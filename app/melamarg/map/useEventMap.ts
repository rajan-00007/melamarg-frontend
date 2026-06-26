'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { findOptimalPathToPoi } from '@/context/types';
import { useLanguage } from '@/context/LanguageContext';
import { useFamily } from '@/context/FamilyContext';
import {
  getHaversineDistance,
  getCompassBearing,
  getDistanceToSegment,
  getClosestPointOnSegment,
  DijkstraRouter
} from './mapUtils';

export function useEventMap() {
  const router = useRouter();
  const [selectedPoi, setSelectedPoi] = useState<any | null>(null);

  // State for filtering POIs in Family Mode
  const [isFamilyMode, setIsFamilyMode] = useState(false);
  const [showEventPois, setShowEventPois] = useState(true);
  const [showFamilyMembers, setShowFamilyMembers] = useState(false);

  // New redesign states
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [mapViewType, setMapViewType] = useState<'normal' | 'radar'>('normal');

  // Immersive auto-hide states & timer
  const [areControlsVisible, setAreControlsVisible] = useState<boolean>(true);
  const interactionTimerRef = useRef<any>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const resetInteractionTimer = useCallback(() => {
    setAreControlsVisible(true);
    if (interactionTimerRef.current) {
      clearTimeout(interactionTimerRef.current);
    }
    
    // If a POI is selected, do NOT start the auto-hide timer! Keep bottom nav visible.
    if (selectedPoi) {
      return;
    }

    interactionTimerRef.current = setTimeout(() => {
      setAreControlsVisible(false);
    }, 6000); // Hide after 6 seconds of inactivity
  }, [selectedPoi]);

  useEffect(() => {
    // If a POI is selected, force bottom nav visible and prevent auto-hide
    if (selectedPoi) {
      setAreControlsVisible(true);
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }
      return;
    }

    const handleInteraction = (e: any) => {
      const target = e.target as Node;
      
      // If the interaction occurs inside the bottom sheet or the drawer, ignore it
      if (bottomSheetRef.current && bottomSheetRef.current.contains(target)) {
        return;
      }
      if (drawerRef.current && drawerRef.current.contains(target)) {
        return;
      }

      resetInteractionTimer();
    };

    // Use capturing phase to catch clicks before event propagation is stopped
    window.addEventListener('click', handleInteraction, { capture: true });
    window.addEventListener('touchstart', handleInteraction, { capture: true });
    window.addEventListener('mousemove', handleInteraction);

    resetInteractionTimer();

    return () => {
      window.removeEventListener('click', handleInteraction, { capture: true });
      window.removeEventListener('touchstart', handleInteraction, { capture: true });
      window.removeEventListener('mousemove', handleInteraction);
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }
    };
  }, [selectedPoi, resetInteractionTimer]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('map-controls-visible', {
        detail: { visible: areControlsVisible }
      })
    );
  }, [areControlsVisible]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode') === 'family' || !!params.get('groupId');
      setIsFamilyMode(mode);
      setShowEventPois(!mode); // Default to hiding POIs if in family mode
      setShowFamilyMembers(mode); // Show family members by default if coming from family page
    }
  }, []);

  const {
    selectedEvent,
    userGps,
    setUserGps,
    gpsAccuracy,
    gpsStatus,
    poisList,
    routeNodes,
    routeEdges,
    leafletLoaded,
    navTarget,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    getRealGps,
    handleGpsUpdate,
    screenMode,
    deviceHeading,
    computeNavigationStats,
    loadingMapData,
    activeAdvisories,
    setIsSidebarOpen,
    zonesList,
    findZoneForCoordinate
  } = useUserTest();

  const { language, t, tPoiName, tPoiDesc, tEventName } = useLanguage();

  // Memoized filtered POI list based on selected category and search query
  const filteredPois = useMemo(() => {
    if (!poisList || poisList.length === 0) return [];
    return poisList.filter(poi => {
      // 1. Category filter
      if (selectedCategory !== 'All') {
        const catName = (poi.category_name || '').toLowerCase();
        const selCat = selectedCategory.toLowerCase();
        if (selCat === 'restrooms') {
          if (!catName.includes('toilet') && !catName.includes('washroom') && !catName.includes('restroom')) return false;
        } else if (selCat === 'water') {
          if (!catName.includes('water') && !catName.includes('drinking')) return false;
        } else if (selCat === 'food') {
          if (!catName.includes('food') && !catName.includes('canteen') && !catName.includes('dining')) return false;
        } else if (selCat === 'medical') {
          if (!catName.includes('medical') && !catName.includes('hospital') && !catName.includes('first')) return false;
        } else if (selCat === 'security') {
          if (!catName.includes('police') && !catName.includes('security')) return false;
        } else if (selCat === 'gates') {
          if (!catName.includes('gate') && !catName.includes('entrance') && !catName.includes('exit') && !catName.includes('temple')) return false;
        } else if (selCat === 'parking') {
          if (!catName.includes('parking')) return false;
        } else {
          if (!catName.includes(selCat)) return false;
        }
      }

      // 2. Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const nameEn = (poi.name_en || '').toLowerCase();
        const nameHi = (poi.name_hi || '').toLowerCase();
        const nameOr = (poi.name_or || '').toLowerCase();
        const nameBn = ((poi as any).name_bn || '').toLowerCase();
        const desc = (poi.description || '').toLowerCase();
        const cat = (poi.category_name || '').toLowerCase();
        
        if (
          !nameEn.includes(q) &&
          !nameHi.includes(q) &&
          !nameOr.includes(q) &&
          !nameBn.includes(q) &&
          !desc.includes(q) &&
          !cat.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [poisList, selectedCategory, searchQuery]);

  // Sorted list of nearest points based on filtered POIs and user GPS
  const sortedNearestPois = useMemo(() => {
    if (!userGps || !filteredPois || filteredPois.length === 0) return [];
    return filteredPois
      .map(poi => {
        const dist = getHaversineDistance(userGps[0], userGps[1], Number(poi.latitude), Number(poi.longitude));
        const walkTime = Math.max(1, Math.round(dist / 80));
        return {
          ...poi,
          distanceMeters: dist,
          walkTimeMinutes: walkTime
        };
      })
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [filteredPois, userGps]);

  // Family Meetup Context
  let familyContext: any;
  try {
    familyContext = useFamily();
  } catch (e) {
    familyContext = { currentGroup: null, membersList: [], myMemberInfo: null };
  }
  const { currentGroup, membersList, myMemberInfo } = familyContext;

  // Sync family mode and family toggle buttons with active group membership
  useEffect(() => {
    if (!currentGroup) {
      setIsFamilyMode(false);
      setShowFamilyMembers(false);
      setShowEventPois(true);
    }
  }, [currentGroup]);

  // Determine if the user is outside the selected event boundary box
  const isUserOutsideEvent = useMemo(() => {
    if (!selectedEvent || !userGps) return false;
    const { north, south, east, west } = selectedEvent;
    if (north === undefined || south === undefined || east === undefined || west === undefined) return false;
    
    const lat = userGps[0];
    const lng = userGps[1];
    
    const n = Number(north);
    const s = Number(south);
    const e = Number(east);
    const w = Number(west);
    
    return lat < s || lat > n || lng < w || lng > e;
  }, [selectedEvent, userGps]);

  // Find nearest designated entrance point (node with is_entrance: true)
  const nearestEntrance = useMemo(() => {
    if (!routeNodes || routeNodes.length === 0 || !userGps) return null;
    const entranceNodes = routeNodes.filter((node) => node.is_entrance);
    
    if (entranceNodes.length === 0) {
      // Fallback: search for any node whose name or type suggests an entrance/gate
      const fallbackNode = routeNodes.find(
        (node) => 
          node.name?.toLowerCase().includes('gate') || 
          node.name?.toLowerCase().includes('entrance') ||
          node.node_type?.toLowerCase().includes('entrance')
      );
      if (fallbackNode) {
        const dist = getHaversineDistance(userGps[0], userGps[1], fallbackNode.latitude, fallbackNode.longitude);
        return { ...fallbackNode, distance: Math.round(dist) };
      }
      // Ultimate fallback: first node
      const dist = getHaversineDistance(userGps[0], userGps[1], routeNodes[0].latitude, routeNodes[0].longitude);
      return { ...routeNodes[0], distance: Math.round(dist) };
    }
    
    let closestNode = entranceNodes[0];
    let minDist = Infinity;
    
    entranceNodes.forEach((node) => {
      const dist = getHaversineDistance(userGps[0], userGps[1], node.latitude, node.longitude);
      if (dist < minDist) {
        minDist = dist;
        closestNode = node;
      }
    });
    
    return {
      ...closestNode,
      distance: Math.round(minDist)
    };
  }, [routeNodes, userGps]);

  // Compute compass bearing to the entrance node
  const entranceBearing = useMemo(() => {
    if (!nearestEntrance || !userGps) return 0;
    return getCompassBearing(
      userGps[0],
      userGps[1],
      nearestEntrance.latitude,
      nearestEntrance.longitude
    );
  }, [nearestEntrance, userGps]);

  // GPS-derived movement heading
  const [gpsHeading, setGpsHeading] = useState<number>(0);
  const [mapZoom, setMapZoom] = useState<number>(16);
  const [mapCenter, setMapCenter] = useState<[number, number]>(userGps);

  // Helper to map category to color
  const categoryColor = (catName: string): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '#f59e0b';
    if (c.includes('police') || c.includes('security')) return '#3b82f6';
    if (c.includes('medical') || c.includes('hospital') || c.includes('health') || c.includes('first')) return '#ef4444';
    if (c.includes('water') || c.includes('drink')) return '#06b6d4';
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) return '#10b981';
    if (c.includes('parking')) return '#6366f1';
    if (c.includes('food') || c.includes('eat')) return '#f97316';
    return '#a1a1aa';
  };

  // Helper to return upright SVG icons for speech bubbles (stroke matching category color)
  const getBubbleIconSvg = (catName: string, color: string, size: number = 18): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 22V10h-3V6a5 5 0 0 0-10 0v4H2v12"></path><path d="M6 10V6a3 3 0 0 1 6 0v4"></path></svg>`;
    }
    if (c.includes('police') || c.includes('security')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    }
    if (c.includes('medical') || c.includes('hospital') || c.includes('first')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"></path></svg>`;
    }
    if (c.includes('water') || c.includes('drink')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`;
    }
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>`;
    }
    if (c.includes('parking')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17V5h5a4 4 0 0 1 0 8H9"></path></svg>`;
    }
    if (c.includes('food') || c.includes('eat')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7 6 13 6 13s6-6 6-13z"></path><path d="M12 2v6M12 11h.01"></path></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="${color}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`;
  };

  const getDistanceString = (distMeters: number) => {
    const d = Math.round(distMeters);
    if (language === 'hi') return `${d} मीटर दूर`;
    if (language === 'or') return `${d} ମିଟର ଦୂର`;
    if (language === 'bn') return `${d} মিটার দূরে`;
    return `${d}m away`;
  };

  // Helper for rotated icons in classic pins
  const categoryIconSvg = (catName: string): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 22V10h-3V6a5 5 0 0 0-10 0v4H2v12"></path><path d="M6 10V6a3 3 0 0 1 6 0v4"></path></svg>`;
    }
    if (c.includes('police') || c.includes('security')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    }
    if (c.includes('medical') || c.includes('hospital') || c.includes('first')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 5v14M5 12h14"></path></svg>`;
    }
    if (c.includes('water') || c.includes('drink')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`;
    }
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>`;
    }
    if (c.includes('parking')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M9 17V5h5a4 4 0 0 1 0 8H9"></path></svg>`;
    }
    if (c.includes('food') || c.includes('eat')) {
      return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 8A6 6 0 0 0 6 8c0 7 6 13 6 13s6-6 6-13z"></path><path d="M12 2v6M12 11h.01"></path></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><circle cx="12" cy="12" r="10"></circle></svg>`;
  };

  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const lastGpsRef = useRef<[number, number] | null>(null);

  const [isAdvisoryDrawerOpen, setIsAdvisoryDrawerOpen] = useState<boolean>(false);
  const [showZones, setShowZones] = useState<boolean>(false);

  // Automatically hide bottom navigation bar (controls) when the advisory drawer opens
  useEffect(() => {
    if (isAdvisoryDrawerOpen) {
      setAreControlsVisible(false);
      if (interactionTimerRef.current) {
        clearTimeout(interactionTimerRef.current);
      }
    }
  }, [isAdvisoryDrawerOpen]);

  // Active Zone detection based on user coordinates
  const currentZone = useMemo(() => {
    if (!userGps || !findZoneForCoordinate) return null;
    return findZoneForCoordinate(userGps[0], userGps[1]);
  }, [userGps, findZoneForCoordinate]);

  // Filter advisories that apply to the current active zone
  const zoneAdvisories = useMemo(() => {
    if (!currentZone || !activeAdvisories) return [];
    return activeAdvisories.filter(advisory => 
      advisory.is_active && 
      advisory.advisory_type === 'zone' &&
      Array.isArray(advisory.zoneIds) && 
      advisory.zoneIds.includes(currentZone.id)
    );
  }, [currentZone, activeAdvisories]);

  useEffect(() => {
    if (!userGps) return;
    if (!lastGpsRef.current) {
      lastGpsRef.current = userGps;
      return;
    }

    const dist = getHaversineDistance(
      lastGpsRef.current[0],
      lastGpsRef.current[1],
      userGps[0],
      userGps[1]
    );

    // Update heading only for significant movement to filter GPS jitter
    if (dist > 1.5) {
      const newHeading = getCompassBearing(
        lastGpsRef.current[0],
        lastGpsRef.current[1],
        userGps[0],
        userGps[1]
      );
      setGpsHeading(newHeading);
      lastGpsRef.current = userGps;
    }
  }, [userGps]);

  // Real-time calculation of nearest POIs in 4 quadrants (Front, Back, Left, Right)
  const nearestQuadrantPOIs = useMemo(() => {
    if (isUserOutsideEvent || !poisList || poisList.length === 0) {
      return { front: null, back: null, left: null, right: null };
    }

    // Determine current heading of travel
    let heading = 0;
    if (navTarget) {
      // If navigating, use bearing to next waypoint
      const stats = computeNavigationStats(userGps[0], userGps[1]);
      if (stats && typeof stats.bearing === 'number') {
        heading = stats.bearing;
      }
    } else {
      // Fallback to GPS-derived heading, or deviceHeading if active, or default to 0
      heading = gpsHeading || deviceHeading || 0;
    }

    // Find if user is on any path (closest route edge within 50m)
    let userPathName: string | null = null;
    if (routeEdges && routeEdges.length > 0 && routeNodes && routeNodes.length > 0 && userGps) {
      let nearestEdge: any = null;
      let minEdgeDist = Infinity;
      
      routeEdges.forEach((edge) => {
        const startNodeId = edge.start_node_id || (edge as any).startNodeId;
        const endNodeId = edge.end_node_id || (edge as any).endNodeId;
        const startNode = routeNodes.find((n) => n.id === startNodeId);
        const endNode = routeNodes.find((n) => n.id === endNodeId);
        if (!startNode || !endNode) return;

        const dist = getDistanceToSegment(
          userGps[0],
          userGps[1],
          Number(startNode.latitude),
          Number(startNode.longitude),
          Number(endNode.latitude),
          Number(endNode.longitude)
        );

        if (dist < minEdgeDist) {
          minEdgeDist = dist;
          nearestEdge = edge;
        }
      });

      const edgePathName = nearestEdge ? (nearestEdge.path_name || (nearestEdge as any).pathName) : null;
      if (nearestEdge && minEdgeDist <= 20 && edgePathName) {
        userPathName = edgePathName;
      }
    }

    // Helper to check if a POI is within 30m of the path's sides
    const isPoiWithinPathBuffer = (poi: any, pathName: string) => {
      const pLat = Number(poi.latitude);
      const pLng = Number(poi.longitude);
      if (isNaN(pLat) || isNaN(pLng)) return false;

      const pathEdges = routeEdges.filter(e => (e as any).path_name === pathName || (e as any).pathName === pathName);
      if (pathEdges.length === 0) return false;

      for (const edge of pathEdges) {
        const startNodeId = edge.start_node_id || (edge as any).startNodeId;
        const endNodeId = edge.end_node_id || (edge as any).endNodeId;
        const startNode = routeNodes.find(n => n.id === startNodeId);
        const endNode = routeNodes.find(n => n.id === endNodeId);
        if (!startNode || !endNode) continue;

        const dist = getDistanceToSegment(
          pLat,
          pLng,
          Number(startNode.latitude),
          Number(startNode.longitude),
          Number(endNode.latitude),
          Number(endNode.longitude)
        );
        if (dist <= 30) {
          return true;
        }
      }
      return false;
    };

    const filteredPoisList = userPathName
      ? poisList.filter((poi) => {
          const poiPath = poi.path_name || (poi as any).pathName;
          if (!poiPath || poiPath === userPathName) {
            return true;
          }
          return isPoiWithinPathBuffer(poi, userPathName);
        })
      : poisList;

    let nearestFront: any = null;
    let nearestBack: any = null;
    let nearestLeft: any = null;
    let nearestRight: any = null;

    let minFrontDist = Infinity;
    let minBackDist = Infinity;
    let minLeftDist = Infinity;
    let minRightDist = Infinity;

    filteredPoisList.forEach((poi) => {
      // Skip the active navigation target POI to avoid listing it on the sides
      if (navTarget && poi.id === navTarget.id) return;

      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const dist = getHaversineDistance(userGps[0], userGps[1], lat, lng);
      const absBearing = getCompassBearing(userGps[0], userGps[1], lat, lng);

      // Relative angle from user heading (0 to 360)
      const relativeAngle = (absBearing - heading + 360) % 360;

      // Classify into 4 quadrants
      if (relativeAngle >= 315 || relativeAngle < 45) {
        // Front (315 to 45)
        if (dist < minFrontDist) {
          minFrontDist = dist;
          nearestFront = { ...poi, distance: Math.round(dist) };
        }
      } else if (relativeAngle >= 45 && relativeAngle < 135) {
        // Right (45 to 135)
        if (dist < minRightDist) {
          minRightDist = dist;
          nearestRight = { ...poi, distance: Math.round(dist) };
        }
      } else if (relativeAngle >= 135 && relativeAngle < 225) {
        // Back (135 to 225)
        if (dist < minBackDist) {
          minBackDist = dist;
          nearestBack = { ...poi, distance: Math.round(dist) };
        }
      } else {
        // Left (225 to 315)
        if (dist < minLeftDist) {
          minLeftDist = dist;
          nearestLeft = { ...poi, distance: Math.round(dist) };
        }
      }
    });

    return { front: nearestFront, back: nearestBack, left: nearestLeft, right: nearestRight, currentPathName: userPathName };
  }, [poisList, routeNodes, routeEdges, userGps, navTarget, gpsHeading, deviceHeading, computeNavigationStats, isUserOutsideEvent]);

  const getDirectionArrowAndColor = (direction: string) => {
    const dir = (direction || '').toUpperCase();
    if (dir.includes('LEFT')) {
      return { arrow: '←', color: '#10b981' };
    }
    if (dir.includes('RIGHT')) {
      return { arrow: '→', color: '#10b981' };
    }
    if (dir.includes('AROUND') || dir.includes('BACK')) {
      return { arrow: '↓', color: '#f59e0b' };
    }
    return { arrow: '↑', color: '#10b981' }; // Default is STRAIGHT
  };

  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const entranceGuidanceLineRef = useRef<any>(null);
  const offPathConnectorLineRef = useRef<any>(null);
  const poisLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const activeRouteLayerRef = useRef<any>(null);
  const zonesLayerRef = useRef<any>(null);
  const familyLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const eventBoundsLayerRef = useRef<any>(null);
  const hasCenteredMapRef = useRef<boolean>(false);

  const findOptimalEntranceNode = (
    userLat: number,
    userLng: number,
    destNode: any,
    nodes: any[],
    edges: any[]
  ) => {
    let nearestNode = nodes[0];
    let minGeomDist = Infinity;
    nodes.forEach((node) => {
      const dist = getHaversineDistance(userLat, userLng, node.latitude, node.longitude);
      if (dist < minGeomDist) {
        minGeomDist = dist;
        nearestNode = node;
      }
    });

    if (minGeomDist <= 100) {
      return { nearestNodeToUser: nearestNode, minUserDist: minGeomDist };
    }

    const entranceNodes = nodes.filter((node) => node.is_entrance);

    if (entranceNodes.length === 0) {
      return { nearestNodeToUser: nearestNode, minUserDist: minGeomDist };
    }

    let bestEntrance = entranceNodes[0];
    let minTotalDist = Infinity;
    let minUserDistForBest = getHaversineDistance(userLat, userLng, bestEntrance.latitude, bestEntrance.longitude);
    let foundValidPath = false;

    entranceNodes.forEach((entrance) => {
      const distToEntrance = getHaversineDistance(userLat, userLng, entrance.latitude, entrance.longitude);
      const path = DijkstraRouter.findShortestPath(nodes, edges, entrance.id, destNode.id);
      
      if (path && path.length > 0) {
        foundValidPath = true;
        let pathDist = 0;
        for (let i = 0; i < path.length - 1; i++) {
          pathDist += getHaversineDistance(path[i].latitude, path[i].longitude, path[i+1].latitude, path[i+1].longitude);
        }
        const totalDist = distToEntrance + pathDist;
        if (totalDist < minTotalDist) {
          minTotalDist = totalDist;
          bestEntrance = entrance;
          minUserDistForBest = distToEntrance;
        }
      }
    });

    if (!foundValidPath) {
      let nearestEntrance = entranceNodes[0];
      let minEntranceGeomDist = Infinity;
      entranceNodes.forEach((entrance) => {
        const dist = getHaversineDistance(userLat, userLng, entrance.latitude, entrance.longitude);
        if (dist < minEntranceGeomDist) {
          minEntranceGeomDist = dist;
          nearestEntrance = entrance;
        }
      });
      return { 
        nearestNodeToUser: nearestEntrance, 
        minUserDist: minEntranceGeomDist 
      };
    }

    return { nearestNodeToUser: bestEntrance, minUserDist: minUserDistForBest };
  };

  // Bind Leaflet object on mount/check
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      LRef.current = (window as any).L;
    }
  }, [leafletLoaded]);

  // REALTIME: update user marker position when GPS changes, draw guidance to entrance if outside
  useEffect(() => {
    if (!mapRef.current || !leafletLoaded) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    // Create or update user location marker
    if (!userMarkerRef.current) {
      const gpsIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <span style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(6,182,212,0.4);animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
            <div style="position:relative;width:16px;height:16px;border-radius:50%;background:#06b6d4;border:3px solid white;box-shadow:0 0 8px #06b6d4;"></div>
          </div>
        `,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      const userMarker = L.marker(userGps, { icon: gpsIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
      userMarkerRef.current = userMarker;
      userMarker.bindPopup('<strong style="color:#06b6d4">Your Location</strong>');
    } else {
      userMarkerRef.current.setLatLng(userGps);
    }

    // Create or update user accuracy ring
    if (!userAccuracyCircleRef.current) {
      const initialCircleColor = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
      const accuracyCircle = L.circle(userGps, {
        radius: gpsAccuracy || 15,
        color: initialCircleColor,
        fillColor: initialCircleColor,
        fillOpacity: 0.08,
        weight: 1
      }).addTo(mapRef.current);
      userAccuracyCircleRef.current = accuracyCircle;
    } else {
      userAccuracyCircleRef.current.setLatLng(userGps);
      if (gpsAccuracy !== null) {
        userAccuracyCircleRef.current.setRadius(gpsAccuracy);
      }
      const color = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
      userAccuracyCircleRef.current.setStyle({
        color: color,
        fillColor: color
      });
    }

    // Center map on user location only once when first real GPS coordinate is locked
    if (!hasCenteredMapRef.current && userGps && (userGps[0] !== 19.8050 || userGps[1] !== 85.8250)) {
      mapRef.current.setView(userGps, 18);
      hasCenteredMapRef.current = true;
    }

    // Dynamic clean up and draw outside guidance line
    if (entranceGuidanceLineRef.current) {
      entranceGuidanceLineRef.current.remove();
      entranceGuidanceLineRef.current = null;
    }
    if (offPathConnectorLineRef.current) {
      offPathConnectorLineRef.current.remove();
      offPathConnectorLineRef.current = null;
    }

    if (isUserOutsideEvent && nearestEntrance) {
      const entLat = Number(nearestEntrance.latitude);
      const entLng = Number(nearestEntrance.longitude);
      if (!isNaN(entLat) && !isNaN(entLng)) {
        entranceGuidanceLineRef.current = L.polyline([
          userGps,
          [entLat, entLng]
        ], {
          color: '#fbbf24', // Amber/yellow dash line for entrance guidance
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8',
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(mapRef.current)
          .bindTooltip(`Entrance: ${nearestEntrance.name || 'Entrance Point'} (${nearestEntrance.distance}m)`, {
            permanent: true,
            direction: 'top',
            className: 'entrance-tooltip'
          });
      }
    }

    if (!isUserOutsideEvent && routeEdges.length > 0 && routeNodes.length > 0 && userGps) {
      let minEdgeDist = Infinity;
      let nearestPoint: any = null;

      routeEdges.forEach((edge) => {
        const startNodeId = edge.start_node_id || (edge as any).startNodeId;
        const endNodeId = edge.end_node_id || (edge as any).endNodeId;
        const startNode = routeNodes.find((n) => n.id === startNodeId);
        const endNode = routeNodes.find((n) => n.id === endNodeId);
        if (!startNode || !endNode) return;

        const dist = getDistanceToSegment(
          userGps[0],
          userGps[1],
          Number(startNode.latitude),
          Number(startNode.longitude),
          Number(endNode.latitude),
          Number(endNode.longitude)
        );

        if (dist < minEdgeDist) {
          minEdgeDist = dist;
          nearestPoint = getClosestPointOnSegment(
            userGps[0],
            userGps[1],
            Number(startNode.latitude),
            Number(startNode.longitude),
            Number(endNode.latitude),
            Number(endNode.longitude)
          );
        }
      });

      if (nearestPoint && minEdgeDist > 20) {
        offPathConnectorLineRef.current = L.polyline([
          userGps,
          [nearestPoint.lat, nearestPoint.lng]
        ], {
          color: '#f97316',
          weight: 4,
          opacity: 0.9,
          dashArray: '8, 8',
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(mapRef.current);
      }
    }
  }, [userGps, gpsAccuracy, gpsStatus, isUserOutsideEvent, nearestEntrance, leafletLoaded, routeEdges, routeNodes]);


  // Force Leaflet recalculation on expanded state toggle
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (mapRef.current) {
      timer = setTimeout(() => {
        mapRef.current?.invalidateSize?.({ animate: true });
      }, 150);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isMapExpanded]);

  // Map rendering logic - Initialize Map and stable Layer Groups once
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined') return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (mapRef.current) return; // Prevent recreation

    const map = L.map('standalone-leaflet-map-canvas', {
      zoomControl: false,
      attributionControl: false,
      maxZoom: 22
    }).setView(userGps || [19.8050, 85.8250], 18);
    mapRef.current = map;

    setMapZoom(map.getZoom());
    setMapCenter([map.getCenter().lat, map.getCenter().lng]);
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
      resetInteractionTimer();
    });
    map.on('moveend', () => {
      setMapCenter([map.getCenter().lat, map.getCenter().lng]);
      resetInteractionTimer();
    });
    map.on('click dragstart zoomstart movestart', () => {
      resetInteractionTimer();
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      maxNativeZoom: 19
    }).addTo(map);

    // Initialize layer groups and assign to refs
    poisLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    zonesLayerRef.current = L.layerGroup().addTo(map);
    familyLayerRef.current = L.layerGroup().addTo(map);
    eventBoundsLayerRef.current = L.layerGroup().addTo(map);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        userMarkerRef.current = null;
        userAccuracyCircleRef.current = null;
        poisLayerRef.current = null;
        routeLayerRef.current = null;
        zonesLayerRef.current = null;
        familyLayerRef.current = null;
        eventBoundsLayerRef.current = null;
      }
      if (entranceGuidanceLineRef.current) {
        entranceGuidanceLineRef.current = null;
      }
      if (offPathConnectorLineRef.current) {
        offPathConnectorLineRef.current = null;
      }
    };
  }, [leafletLoaded, resetInteractionTimer]);

  // Event Bounding Box Effect
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !eventBoundsLayerRef.current) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    const eventBoundsLayer = eventBoundsLayerRef.current;
    eventBoundsLayer.clearLayers();

    if (selectedEvent) {
      const { north, south, east, west } = selectedEvent;
      if (north && south && east && west) {
        const bounds = [[Number(south), Number(west)], [Number(north), Number(east)]];
        L.rectangle(bounds, {
          color: '#10b981',
          weight: 2,
          fill: true,
          fillColor: '#10b981',
          fillOpacity: 0.05,
          dashArray: '5, 8'
        }).addTo(eventBoundsLayer);
      }
    }
  }, [leafletLoaded, selectedEvent]);

  // Zones Boundary Effect
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !zonesLayerRef.current) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    const zonesLayer = zonesLayerRef.current;
    zonesLayer.clearLayers();

    if (showZones && zonesList && zonesList.length > 0) {
      zonesList.forEach((zone) => {
        const boundary = typeof zone.boundary === 'string' ? JSON.parse(zone.boundary) : zone.boundary;
        if (!Array.isArray(boundary) || boundary.length < 3) return;

        const latlngs = boundary.map((p: any) => [
          p.lat !== undefined ? Number(p.lat) : Number(p.latitude),
          p.lng !== undefined ? Number(p.lng) : Number(p.longitude)
        ]);

        L.polygon(latlngs, {
          color: '#fb923c',
          fillColor: '#fdba74',
          fillOpacity: 0.06,
          weight: 1.5,
          dashArray: '4, 4'
        }).addTo(zonesLayer)
          .bindTooltip(zone.name, {
            permanent: true,
            direction: 'center',
            className: 'zone-map-tooltip'
          });
      });
    }
  }, [leafletLoaded, showZones, zonesList]);

  // Route Network Effect
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !routeLayerRef.current) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    const routeLayer = routeLayerRef.current;
    routeLayer.clearLayers();

    if (!routeEdges || !routeNodes) return;

    // Draw route segments
    routeEdges.forEach((edge) => {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;
      const startNode = routeNodes.find((n) => n.id === startId);
      const endNode = routeNodes.find((n) => n.id === endId);
      if (startNode && endNode) {
        let edgeColor = '#22d3ee';
        let isDashed = true;

        if (activeAdvisories && activeAdvisories.length > 0) {
          activeAdvisories.forEach(advisory => {
            if (advisory.is_active && advisory.advisory_type === 'road' && advisory.edges) {
              advisory.edges.forEach((ae: any) => {
                if (ae.edge_id === edge.id) {
                  if (ae.status === 'blocked') {
                    edgeColor = '#ef4444';
                    isDashed = false;
                  } else if (ae.status === 'recommended') {
                    edgeColor = '#10b981';
                    isDashed = true;
                  }
                }
              });
            }
          });
        }

        L.polyline([
          [Number(startNode.latitude), Number(startNode.longitude)],
          [Number(endNode.latitude), Number(endNode.longitude)]
        ], {
          color: edgeColor,
          weight: 40,
          opacity: 0.12,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(routeLayer);

        L.polyline([
          [Number(startNode.latitude), Number(startNode.longitude)],
          [Number(endNode.latitude), Number(endNode.longitude)]
        ], {
          color: edgeColor,
          weight: 3,
          opacity: 0.75,
          dashArray: isDashed ? '6, 6' : undefined
        }).addTo(routeLayer);
      }
    });

    // Draw route dots
    routeNodes.forEach((node) => {
      const lat = Number(node.latitude);
      const lng = Number(node.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      if (node.is_entrance) {
        L.circleMarker([lat, lng], {
          radius: 8,
          fillColor: '#8b5cf6',
          color: '#fff',
          weight: 2,
          fillOpacity: 1
        }).addTo(routeLayer)
          .bindPopup(`<strong style="color:#c084fc;font-size:12px">Entrance: ${node.name || 'Point'}</strong><div style="font-size:10px;color:#a1a1aa;margin-top:2px">Designated Event Entrance</div>`);
      } else {
        L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: '#0891b2',
          color: '#fff',
          weight: 1.5,
          fillOpacity: 1
        }).addTo(routeLayer)
          .bindPopup(`<span style="color:#22d3ee;font-size:11px">${node.name || 'Node'}</span>`);
      }
    });
  }, [leafletLoaded, routeEdges, routeNodes, activeAdvisories]);

  // Dedicated effect to render and update POI markers on map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !poisLayerRef.current) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    const poisLayer = poisLayerRef.current;
    poisLayer.clearLayers();

    // Draw navTarget alert target if not already in poisList
    if (navTarget && poisList && !poisList.some(p => p.id === navTarget.id)) {
      const lat = Number(navTarget.latitude);
      const lng = Number(navTarget.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        const alertIcon = L.divIcon({
          html: `
            <div style="
              background:#ef4444;
              width:32px;height:32px;border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              border:2px solid #fff;
              box-shadow:0 0 10px rgba(239,68,68,0.8);
              display:flex;align-items:center;justify-content:center;
            ">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
          `,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [10, 32],
          popupAnchor: [6, -32]
        });

        const targetMarker = L.marker([lat, lng], { icon: alertIcon })
          .addTo(poisLayer)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:140px">
              <strong style="color:#ef4444;font-size:12px">ALERT TARGET</strong>
              <div style="font-size:11px;color:#f4f4f5;margin-top:4px">${navTarget.name_en}</div>
              ${navTarget.description ? `<div style="font-size:10px;color:#a1a1aa;margin-top:4px">${navTarget.description}</div>` : ''}
            </div>
          `);
        
        targetMarker.openPopup();
      }
    }

    if (isFamilyMode && !showEventPois) return;
    if (!filteredPois || filteredPois.length === 0) return;

    const nearestPoiIds = sortedNearestPois.slice(0, 3).map(p => p.id);

    filteredPois.forEach((poi) => {
      const color = categoryColor(poi.category_name);
      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const dist = userGps ? getHaversineDistance(userGps[0], userGps[1], lat, lng) : 0;
      const isPremiumBubble = mapZoom >= 20;
      const isNearest = nearestPoiIds.includes(poi.id);

      const poiIcon = isPremiumBubble
        ? L.divIcon({
            html: `
              <div class="${isNearest && mapViewType === 'radar' ? 'nearest-poi-breath' : ''}" style="
                background: #ffffff;
                border-radius: 16px;
                padding: 8px 12px;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.12);
                border: 1px solid rgba(0,0,0,0.05);
                position: relative;
                width: 170px;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              ">
                <div class="${isNearest && mapViewType === 'radar' ? 'nearest-icon-pulse' : ''}" style="
                  width: 32px;
                  height: 32px;
                  border-radius: 50%;
                  background: ${color}15;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  flex-shrink: 0;
                ">
                  ${getBubbleIconSvg(poi.category_name, color, 16)}
                </div>
                <div style="
                  display: flex;
                  flex-direction: column;
                  overflow: hidden;
                  text-align: left;
                ">
                  <div style="
                    font-weight: 700;
                    color: #1f2937;
                    font-size: 12px;
                    line-height: 1.2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
                    ${tPoiName(poi) || poi.name_en || 'POI'}
                  </div>
                  <div style="
                    font-weight: 500;
                    color: #6b7280;
                    font-size: 9px;
                    margin-top: 1px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  ">
                    ${(poi.description && poi.description.length < 20) ? poi.description : getDistanceString(dist)}
                  </div>
                </div>
                <div style="
                  position: absolute;
                  bottom: -5px;
                  left: 50%;
                  transform: translateX(-50%) rotate(45deg);
                  width: 10px;
                  height: 10px;
                  background: #ffffff;
                  border-right: 1px solid rgba(0,0,0,0.05);
                  border-bottom: 1px solid rgba(0,0,0,0.05);
                "></div>
              </div>
            `,
            className: '',
            iconSize: [170, 46],
            iconAnchor: [85, 51],
            popupAnchor: [0, -46]
          })
        : L.divIcon({
            html: `
              <div class="${isNearest && mapViewType === 'radar' ? 'nearest-poi-breath' : ''}" style="
                background:${color};
                width:28px;height:28px;border-radius:50% 50% 50% 0;
                transform:rotate(-45deg);
                border:2px solid rgba(0,0,0,0.6);
                box-shadow:0 2px 6px rgba(0,0,0,0.5);
                display:flex;align-items:center;justify-content:center;
              ">
                <div class="${isNearest && mapViewType === 'radar' ? 'nearest-icon-pulse' : ''}" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;">
                  ${categoryIconSvg(poi.category_name)}
                </div>
              </div>
            `,
            className: '',
            iconSize: [28, 28],
            iconAnchor: [8, 28],
            popupAnchor: [6, -28]
          });

      const marker = L.marker([lat, lng], { icon: poiIcon })
        .addTo(poisLayer);

      marker.on('click', () => {
        setSelectedPoi(poi);
      });

      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px">
          <strong style="color:#333;font-size:12px">${tPoiName(poi) || poi.name_en || 'POI'}</strong>
          <div style="font-size:10px;color:${color};text-transform:uppercase;margin-top:2px">${poi.category_name || ''}</div>
          ${poi.description ? `<div style="font-size:10px;color:#666;margin-top:4px">${poi.description}</div>` : ''}
        </div>
      `);
    });
  }, [leafletLoaded, filteredPois, mapZoom, userGps, navTarget, isFamilyMode, showEventPois, sortedNearestPois, mapViewType]);

  // Dedicated effect to render real-time Family Meetup members and assembly point (Zero Polling)
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !familyLayerRef.current) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    const familyLayer = familyLayerRef.current;
    familyLayer.clearLayers();

    if (!showFamilyMembers) return;
    if (!currentGroup || !myMemberInfo) return;

    // 1. Resolve Assembly Point Coordinates
    let assemblyLat: number | null = null;
    let assemblyLng: number | null = null;
    let assemblyName = 'Agreed Assembly Point';

    if (currentGroup.assembly_point_id) {
      const matchPoi = poisList.find(p => p.id === currentGroup.assembly_point_id);
      if (matchPoi) {
        assemblyLat = Number(matchPoi.latitude);
        assemblyLng = Number(matchPoi.longitude);
        assemblyName = tPoiName(matchPoi) || matchPoi.name_en;
      }
    } else if (currentGroup.assembly_custom_lat && currentGroup.assembly_custom_lng) {
      assemblyLat = Number(currentGroup.assembly_custom_lat);
      assemblyLng = Number(currentGroup.assembly_custom_lng);
      assemblyName = currentGroup.assembly_custom_name || 'Agreed Custom Spot';
    }

    // Draw Assembly Point Marker
    if (assemblyLat && !isNaN(assemblyLat) && assemblyLng && !isNaN(assemblyLng)) {
      const flagIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:32px;height:32px;border-radius:50%;background:rgba(230,81,0,0.15);animation:ping 2s infinite;"></div>
            <div style="position:relative;width:24px;height:24px;border-radius:50%;background:#e65100;border:2px solid white;box-shadow:0 2px 8px rgba(230,81,0,0.4);display:flex;align-items:center;justify-content:center;color:white;">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                <line x1="4" y1="22" x2="4" y2="15"></line>
              </svg>
            </div>
          </div>
        `,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      L.marker([assemblyLat, assemblyLng], { icon: flagIcon, zIndexOffset: 900 })
        .addTo(familyLayer)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:140px;text-align:center">
            <strong style="color:#e65100;font-size:12px">Agreed Assembly Point</strong>
            <div style="font-size:11px;color:#333;margin-top:4px;font-weight:600">${assemblyName}</div>
            <button 
              id="manage-group-btn"
              style="margin-top:6px;background:#e65100;color:white;border:none;border-radius:4px;padding:3px 8px;font-size:10px;font-weight:600;cursor:pointer;"
            >
              Manage Group
            </button>
          </div>
        `);

      // Bind manage group redirect dynamically
      const handlePopupOpen = () => {
        const btn = document.getElementById('manage-group-btn');
        if (btn) {
          btn.onclick = () => {
            router.push('/melamarg/family');
          };
        }
      };

      // Find another way to handle popupopen via pure standard React router instead of raw inline onclick
      // We will handle it below or by binding to Leaflet event

      if (userGps && userGps[0] !== 0 && userGps[1] !== 0) {
        L.polyline([userGps, [assemblyLat, assemblyLng]], {
          color: '#e65100',
          weight: 2,
          dashArray: '6, 8',
          opacity: 0.75
        }).addTo(familyLayer);
      }
    }

    // 2. Draw Family Members (excluding me)
    membersList.forEach((member: any) => {
      if (member.id === myMemberInfo.id) return;
      
      const lat = Number(member.latitude);
      const lng = Number(member.longitude);
      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const isOnline = (new Date().getTime() - new Date(member.last_active_at).getTime()) < 60000;
      const initials = member.name.substring(0, 2).toUpperCase();

      const memberIcon = L.divIcon({
        html: `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            ${isOnline ? `<span style="position:absolute;width:28px;height:28px;border-radius:50%;background:rgba(230,81,0,0.3);animation:ping 1.5s infinite;"></span>` : ''}
            <div style="position:relative;width:20px;height:20px;border-radius:50%;background:#e65100;border:2px solid white;box-shadow:0 2px 6px rgba(230,81,0,0.3);display:flex;align-items:center;justify-content:center;color:white;font-size:9px;font-weight:600;">
              ${initials}
            </div>
            <span style="position:absolute;bottom:-1px;right:-1px;width:7px;height:7px;border-radius:50%;background:${isOnline ? '#22c55e' : '#94a3b8'};border:1.5px solid white;"></span>
          </div>
        `,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const memberMarker = L.marker([lat, lng], { icon: memberIcon, zIndexOffset: 850 }).addTo(familyLayer);

      let nearestPoiName = 'Unknown Landmark';
      if (poisList && poisList.length > 0) {
        let minD = Infinity;
        poisList.forEach(poi => {
          const d = getHaversineDistance(lat, lng, Number(poi.latitude), Number(poi.longitude));
          if (d < minD) {
            minD = d;
            nearestPoiName = tPoiName(poi) || poi.name_en;
          }
        });
        nearestPoiName = minD < 30 ? `At ${nearestPoiName}` : minD < 100 ? `Near ${nearestPoiName}` : `${Math.round(minD)}m from ${nearestPoiName}`;
      }

      let distanceLabel = '';
      if (userGps && userGps[0] !== 0) {
        const d = getHaversineDistance(userGps[0], userGps[1], lat, lng);
        distanceLabel = `<div style="font-size:10px;color:#475569;margin-top:2px;font-weight:500">${Math.round(d)}m away from you</div>`;
      }

      memberMarker.bindPopup(`
        <div style="font-family:sans-serif;min-width:150px">
          <div style="display:flex;align-items:center;gap:4px">
            <strong style="color:#333;font-size:12px">${member.name}</strong>
            <span style="font-size:8px;font-weight:600;padding:1px 4px;border-radius:3px;background:${isOnline ? '#dcfce7;color:#15803d' : '#f1f5f9;color:#475569'}">
              ${isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          <div style="font-size:10px;color:#666;margin-top:4px">${nearestPoiName}</div>
          ${distanceLabel}
          <div style="display:flex;gap:4px;margin-top:6px">
            <button 
              id="nav-to-member-${member.id}"
              style="flex:1;background:#e65100;color:white;border:none;border-radius:4px;padding:4px;font-size:9px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:2px"
            >
              Navigate
            </button>
            <button 
              id="pulse-member-${member.id}"
              style="background:white;border:1px solid #cbd5e1;color:#333;border-radius:4px;padding:4px;font-size:9px;font-weight:600;cursor:pointer;"
            >
              Pulse
            </button>
          </div>
        </div>
      `);

      memberMarker.on('popupopen', () => {
        const btn = document.getElementById(`nav-to-member-${member.id}`);
        if (btn) {
          btn.onclick = () => {
            const targetPoi = {
              id: `family-member-${member.id}`,
              name_en: member.name,
              latitude: lat,
              longitude: lng,
              category_name: 'Family Member',
              description: `Live location of ${member.name}`
            };
            setNavTarget(targetPoi);
            setScreenMode('navigation');
            setArrivalNotify(false);
            logNavigationInstructions(targetPoi);
            router.push('/melamarg/navigation?returnUrl=/melamarg/map');
          };
        }
        
        const pulseBtn = document.getElementById(`pulse-member-${member.id}`);
        if (pulseBtn) {
          pulseBtn.onclick = () => {
            router.push('/melamarg/family');
          };
        }
      });

      if (assemblyLat && !isNaN(assemblyLat) && assemblyLng && !isNaN(assemblyLng)) {
        L.polyline([[lat, lng], [assemblyLat, assemblyLng]], {
          color: '#e65100',
          weight: 1.5,
          dashArray: '4, 6',
          opacity: 0.5
        }).addTo(familyLayer);
      }
    });
  }, [leafletLoaded, poisList, userGps, mapZoom, currentGroup, membersList, myMemberInfo, showFamilyMembers, router, navTarget, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions, tPoiName]);

  // ACTIVE ROUTE HIGHLIGHT EFFECT
  useEffect(() => {
    if (!mapRef.current || !leafletLoaded) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (!activeRouteLayerRef.current) {
      activeRouteLayerRef.current = L.layerGroup().addTo(mapRef.current);
    } else {
      if (!mapRef.current.hasLayer(activeRouteLayerRef.current)) {
         activeRouteLayerRef.current.addTo(mapRef.current);
      }
      activeRouteLayerRef.current.clearLayers();
    }

    const targetPoi = navTarget || selectedPoi;

    if (routeLayerRef.current) {
      if (targetPoi) {
        if (mapRef.current.hasLayer(routeLayerRef.current)) {
          mapRef.current.removeLayer(routeLayerRef.current);
        }
      } else {
        if (!mapRef.current.hasLayer(routeLayerRef.current)) {
          routeLayerRef.current.addTo(mapRef.current);
        }
      }
    }

    if (!targetPoi || routeNodes.length === 0) return;

    const {
      path,
      destNode
    } = findOptimalPathToPoi(userGps[0], userGps[1], targetPoi, routeNodes, routeEdges);

    if (path && path.length > 0) {
      const latlngs = path.map((n: any) => [Number(n.latitude), Number(n.longitude)]);
      
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 40,
        opacity: 0.12,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
      
      L.polyline(latlngs, {
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        dashArray: '4, 8',
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);

      if (destNode && String(destNode.id).startsWith('proj-')) {
        L.polyline([[Number(destNode.latitude), Number(destNode.longitude)], [targetPoi.latitude, targetPoi.longitude]], {
          color: '#f97316',
          weight: 4,
          opacity: 0.9,
          dashArray: '6, 6',
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(activeRouteLayerRef.current);
      }
    }
  }, [navTarget, selectedPoi, userGps, leafletLoaded, routeNodes, routeEdges, screenMode]);

  const checkIsOffPath = () => {
    if (routeEdges.length === 0 || routeNodes.length === 0) return { isOff: true, dist: 0, dir: '', pathName: 'Event Area' };

    let pathNodeIds = new Set<string>();

    if (selectedPoi) {
      const { path } = findOptimalPathToPoi(userGps[0], userGps[1], selectedPoi, routeNodes, routeEdges);
      if (path) {
        pathNodeIds = new Set(path.map(n => n.id));
      }
    }

    let isOff = true;
    let minOffDist = Infinity;
    let minOffX = 0;
    let minOffY = 0;
    let nearestEdge: any = null;

    const pLat = userGps[0];
    const pLng = userGps[1];
    
    const latFactor = 111320;
    const lngFactor = 111320 * Math.cos(pLat * Math.PI / 180);
    
    for (const edge of routeEdges) {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;
      
      if (pathNodeIds.size > 0 && (!pathNodeIds.has(startId) || !pathNodeIds.has(endId))) {
        continue;
      }

      const startNode = routeNodes.find((n) => n.id === startId);
      const endNode = routeNodes.find((n) => n.id === endId);
      
      if (startNode && endNode) {
        const ax = Number(startNode.longitude) * lngFactor;
        const ay = Number(startNode.latitude) * latFactor;
        const bx = Number(endNode.longitude) * lngFactor;
        const by = Number(endNode.latitude) * latFactor;
        const px = pLng * lngFactor;
        const py = pLat * latFactor;
        
        const l2 = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
        let dist = 0;
        let projX = 0;
        let projY = 0;
        
        if (l2 === 0) {
          projX = ax;
          projY = ay;
          dist = Math.sqrt((px - ax) * (px - ax) + (py - ay) * (py - ay));
        } else {
          let t = ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / l2;
          t = Math.max(0, Math.min(1, t));
          projX = ax + t * (bx - ax);
          projY = ay + t * (by - ay);
          dist = Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
        }
        
        if (dist < minOffDist) {
          minOffDist = dist;
          minOffX = projX / lngFactor;
          minOffY = projY / latFactor;
          nearestEdge = edge;
        }
      }
    }

    if (minOffDist <= 15) {
      isOff = false;
    }

    let dirText = '';
    let pathNameStr = 'Path';
    if (nearestEdge && (nearestEdge as any).path_name) {
      pathNameStr = (nearestEdge as any).path_name;
    }

    if (isOff && minOffDist !== Infinity) {
      const y = Math.sin((minOffX - pLng) * Math.PI / 180) * Math.cos(minOffY * Math.PI / 180);
      const x = Math.cos(pLat * Math.PI / 180) * Math.sin(minOffY * Math.PI / 180) -
                Math.sin(pLat * Math.PI / 180) * Math.cos(minOffY * Math.PI / 180) * Math.cos((minOffX - pLng) * Math.PI / 180);
      const bearing = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      
      const relativeAngle = (bearing - deviceHeading + 360) % 360;
      if (relativeAngle > 45 && relativeAngle <= 135) dirText = 'Right ➔';
      else if (relativeAngle > 135 && relativeAngle <= 225) dirText = 'Back ⬇';
      else if (relativeAngle > 225 && relativeAngle <= 315) dirText = 'Left ⬅';
      else dirText = 'Straight ⬆';
    }

    return {
      isOff,
      dist: Math.round(minOffDist),
      dir: dirText,
      pathName: pathNameStr
    };
  };

  const explorePathStatus = useMemo(() => {
    return checkIsOffPath();
  }, [userGps, routeEdges, routeNodes, selectedPoi, deviceHeading]);

  const getOffPathInstruction = () => {
    if (language === 'hi') {
      return `${explorePathStatus.pathName} में शामिल होने के लिए ${explorePathStatus.dir} ${explorePathStatus.dist} मीटर चलें।`;
    }
    if (language === 'or') {
      return `${explorePathStatus.pathName} ରେ ଯୋଗଦେବା ପାଇଁ ${explorePathStatus.dir} ${explorePathStatus.dist} ମିଟର ଚାଲନ୍ତୁ |`;
    }
    if (language === 'bn') {
      return `${explorePathStatus.pathName}-এ যোগ দিতে ${explorePathStatus.dir} ${explorePathStatus.dist} মিটার হাঁটুন।`;
    }
    return `Move ${explorePathStatus.dist}m ${explorePathStatus.dir} to join ${explorePathStatus.pathName}.`;
  };

  // Redirect to active navigation page if navTarget is active
  useEffect(() => {
    if (navTarget) {
      router.push('/melamarg/navigation?returnUrl=/melamarg/map');
    }
  }, [navTarget, router]);

  // Floating indicators when zoomed in and off-screen
  const getFloatingPois = () => {
    if (!mapRef.current || !filteredPois || filteredPois.length === 0) return [];
    if (mapZoom < 18 || !userGps) return [];

    if (isFamilyMode && !showEventPois) return [];

    let currentPhysicalPathName: string | null = null;
    let minEdgeDist = Infinity;
    let nearestEdge: any = null;

    if (routeEdges && routeEdges.length > 0 && routeNodes && routeNodes.length > 0) {
      routeEdges.forEach((edge) => {
        const startNodeId = edge.start_node_id || (edge as any).startNodeId;
        const endNodeId = edge.end_node_id || (edge as any).endNodeId;
        const startNode = routeNodes.find((n) => n.id === startNodeId);
        const endNode = routeNodes.find((n) => n.id === endNodeId);
        if (!startNode || !endNode) return;

        const dist = getDistanceToSegment(
          userGps[0],
          userGps[1],
          Number(startNode.latitude),
          Number(startNode.longitude),
          Number(endNode.latitude),
          Number(endNode.longitude)
        );

        if (dist < minEdgeDist) {
          minEdgeDist = dist;
          nearestEdge = edge;
        }
      });

      const edgePathName = nearestEdge ? (nearestEdge.path_name || (nearestEdge as any).pathName) : null;
      if (nearestEdge && minEdgeDist <= 30 && edgePathName) {
        currentPhysicalPathName = edgePathName;
      }
    }

    if (!currentPhysicalPathName || currentPhysicalPathName === 'Path') return [];

    const map = mapRef.current;
    
    let bounds: any = null;
    try {
      bounds = map.getBounds();
    } catch (e) {
      return [];
    }
    if (!bounds) return [];

    const center = map.getCenter();

    const currentPathNodeIds = new Set<string>();
    routeEdges.forEach(e => {
       if ((e as any).path_name === currentPhysicalPathName || (e as any).pathName === currentPhysicalPathName) {
         currentPathNodeIds.add(e.start_node_id || (e as any).startNodeId);
         currentPathNodeIds.add(e.end_node_id || (e as any).endNodeId);
       }
    });
    
    const poiIdsOnPath = new Set<string>();
    routeNodes.forEach(n => {
       if (currentPathNodeIds.has(n.id) && n.poi_id) {
         poiIdsOnPath.add(n.poi_id);
       }
    });

    const isPoiWithinPathBuffer = (poi: any, pathName: string) => {
      const pLat = Number(poi.latitude);
      const pLng = Number(poi.longitude);
      if (isNaN(pLat) || isNaN(pLng)) return false;

      const pathEdges = routeEdges.filter(e => (e as any).path_name === pathName || (e as any).pathName === pathName);
      if (pathEdges.length === 0) return false;

      for (const edge of pathEdges) {
        const startNodeId = edge.start_node_id || (edge as any).startNodeId;
        const endNodeId = edge.end_node_id || (edge as any).endNodeId;
        const startNode = routeNodes.find(n => n.id === startNodeId);
        const endNode = routeNodes.find(n => n.id === endNodeId);
        if (!startNode || !endNode) continue;

        const dist = getDistanceToSegment(
          pLat,
          pLng,
          Number(startNode.latitude),
          Number(startNode.longitude),
          Number(endNode.latitude),
          Number(endNode.longitude)
        );
        if (dist <= 30) {
          return true;
        }
      }
      return false;
    };

    const floatingPoisList = filteredPois.filter(p => {
      const lat = Number(p.latitude);
      const lng = Number(p.longitude);
      if (isNaN(lat) || isNaN(lng)) return false;

      const latLng = LRef.current ? LRef.current.latLng(lat, lng) : null;
      const isOffScreen = bounds && latLng ? !bounds.contains(latLng) : true;

      const isOnCurrentPath = poiIdsOnPath.has(p.id) || isPoiWithinPathBuffer(p, currentPhysicalPathName!);
      return isOffScreen && isOnCurrentPath;
    });

    const travelHeading = gpsHeading || deviceHeading || 0;

    return floatingPoisList.map(poi => {
      const pLat = Number(poi.latitude);
      const pLng = Number(poi.longitude);
      const dist = getHaversineDistance(userGps[0], userGps[1], pLat, pLng);
      const bearing = getCompassBearing(userGps[0], userGps[1], pLat, pLng);
      const relativeAngle = (bearing - travelHeading + 360) % 360;

      let relDir: 'front' | 'back' | 'left' | 'right' = 'front';
      if (relativeAngle >= 315 || relativeAngle < 45) {
        relDir = 'front';
      } else if (relativeAngle >= 45 && relativeAngle < 135) {
        relDir = 'right';
      } else if (relativeAngle >= 135 && relativeAngle < 225) {
        relDir = 'back';
      } else {
        relDir = 'left';
      }

      return {
        ...poi,
        dist,
        relDir
      };
    }).sort((a, b) => a.dist - b.dist).slice(0, 4);
  };

  const floatingPois = getFloatingPois();

  const handleStopNavigation = () => {
    setNavTarget(null);
    setIsWalking(false);
    setScreenMode('home');
    router.push('/melamarg/home');
  };

  const handleGpsUpdateProxy = async () => {
    const pos = await getRealGps();
    if (pos) {
      setUserGps(pos);
      if (mapRef.current) mapRef.current.setView(pos, 18);
    } else if (mapRef.current) {
      mapRef.current.setView(userGps, 18);
    }
  };

  const setIsWalking = (val: boolean) => {
    // Stub or proxy as needed if context contains setIsWalking, since it comes from useUserTest
  };

  return {
    // States & setters
    selectedPoi,
    setSelectedPoi,
    isFamilyMode,
    setIsFamilyMode,
    showEventPois,
    setShowEventPois,
    showFamilyMembers,
    setShowFamilyMembers,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    isSearchActive,
    setIsSearchActive,
    mapViewType,
    setMapViewType,
    areControlsVisible,
    setAreControlsVisible,
    isAdvisoryDrawerOpen,
    setIsAdvisoryDrawerOpen,
    showZones,
    setShowZones,
    gpsHeading,
    setGpsHeading,
    mapZoom,
    setMapZoom,
    mapCenter,
    setMapCenter,

    // Refs
    mapRef,
    bottomSheetRef,
    drawerRef,

    // Memoized / Calculated values
    filteredPois,
    sortedNearestPois,
    explorePathStatus,
    floatingPois,
    currentZone,
    zoneAdvisories,
    nearestEntrance,
    entranceBearing,
    isUserOutsideEvent,

    // Context & Context Actions
    selectedEvent,
    userGps,
    setUserGps,
    gpsAccuracy,
    gpsStatus,
    poisList,
    routeNodes,
    routeEdges,
    leafletLoaded,
    navTarget,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    getRealGps,
    handleGpsUpdate,
    screenMode,
    deviceHeading,
    computeNavigationStats,
    loadingMapData,
    activeAdvisories,
    setIsSidebarOpen,
    zonesList,
    findZoneForCoordinate,
    currentGroup,
    membersList,
    myMemberInfo,
    router,

    // Language / Translations
    language,
    t,
    tPoiName,
    tPoiDesc,
    tEventName,

    // Helpers / Handlers
    categoryColor,
    getBubbleIconSvg,
    getDistanceString,
    categoryIconSvg,
    getOffPathInstruction,
    getDirectionArrowAndColor,
    handleStopNavigation,
    handleGpsUpdateProxy
  };
}
