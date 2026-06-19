'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { Navigation, MapPin, Compass, AlertTriangle, LogOut, CheckCircle, Info, Map as MapIcon } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  MapWrapper,
  MapCanvas,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  
  // Redesigned explore components
  FloatingHeaderWrapper,
  FloatingHeaderPillRow,
  OfflineActivePill,
  GpsStrongPill,
  RouteStatusBanner,
  RouteStatusIconWrapper,
  RouteStatusInfo,
  RouteStatusTitle,
  RouteStatusSubtitle,
  FloatingBottomWrapper,
  FloatingControlsRow,
  FloatingLocateButton,
  ExploreBottomCard,
  ExploreCardTitle,
  ExploreCardDescription,
  ExplorePOIInfoRow,
  ExploreActionsRow,
  ExploreNavButton,
  ExploreCloseButton,
  UnifiedStatusCard,
  UnifiedStatusHeader,
  UnifiedStatusBody,
  FloatingHUDContainer,
  HUDSection,
  HUDIndicatorBadge
} from './page.styled';

// Pure Utility Helpers (defined at module scope to avoid hoisting/initialization errors)
const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getCompassBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return Math.round(bearing);
};

const getDistanceToSegment = (
  userLat: number,
  userLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const x = userLng;
  const y = userLat;
  const x1 = lng1;
  const y1 = lat1;
  const x2 = lng2;
  const y2 = lat2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return getHaversineDistance(y, x, y1, x1);
  }

  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  const closestLat = y1 + t * dy;
  const closestLng = x1 + t * dx;

  return getHaversineDistance(y, x, closestLat, closestLng);
};

const getClosestPointOnSegment = (
  userLat: number,
  userLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const x = userLng;
  const y = userLat;
  const x1 = lng1;
  const y1 = lat1;
  const x2 = lng2;
  const y2 = lat2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return { lat: y1, lng: x1 };
  }

  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  return {
    lat: y1 + t * dy,
    lng: x1 + t * dx
  };
};

const getCategoryEmoji = (cat: string) => {
  const c = (cat || '').toLowerCase();
  if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '🚺';
  if (c.includes('police') || c.includes('security') || c.includes('guard')) return '👮';
  if (c.includes('medical') || c.includes('hospital') || c.includes('first aid') || c.includes('camp')) return '🏥';
  if (c.includes('water') || c.includes('drinking')) return '💧';
  if (c.includes('food') || c.includes('canteen') || c.includes('dining')) return '🍽️';
  if (c.includes('temple') || c.includes('gate') || c.includes('darshan')) return '🛕';
  if (c.includes('help') || c.includes('information')) return 'ℹ️';
  return '📍';
};

const DijkstraRouter = {
  findShortestPath(ns: any[], es: any[], startId: string, endId: string) {
    if (startId === endId) {
      const node = ns.find(n => n.id === startId);
      return node ? [node] : null;
    }

    const graph: any = {};
    ns.forEach(node => {
      graph[node.id] = { node, neighbors: [] };
    });

    const getDist = (n1: any, n2: any) => {
      return getHaversineDistance(Number(n1.latitude), Number(n1.longitude), Number(n2.latitude), Number(n2.longitude));
    };

    es.forEach(edge => {
      const sId = edge.start_node_id || edge.startNodeId;
      const eId = edge.end_node_id || edge.endNodeId;
      if (graph[sId] && graph[eId]) {
        const dist = getDist(graph[sId].node, graph[eId].node);
        graph[sId].neighbors.push({ targetId: eId, distance: dist });
        graph[eId].neighbors.push({ targetId: sId, distance: dist });
      }
    });

    const distances: any = {};
    const previous: any = {};
    const unvisited = new Set<string>();

    ns.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    distances[startId] = 0;

    while (unvisited.size > 0) {
      let currentNodeId: string | null = null;
      let minDistance = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNodeId = nodeId;
        }
      });

      if (currentNodeId === null || minDistance === Infinity) {
        break;
      }

      if (currentNodeId === endId) {
        break;
      }

      unvisited.delete(currentNodeId);

      const neighbors = graph[currentNodeId].neighbors;
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.targetId)) continue;
        const alt = distances[currentNodeId] + neighbor.distance;
        if (alt < distances[neighbor.targetId]) {
          distances[neighbor.targetId] = alt;
          previous[neighbor.targetId] = currentNodeId;
        }
      }
    }

    if (distances[endId] === Infinity) return null;

    const pathIds: string[] = [];
    let curr: string | null = endId;
    while (curr !== null) {
      pathIds.push(curr);
      curr = previous[curr];
    }
    pathIds.reverse();

    return pathIds.map(id => graph[id].node);
  }
};

export default function EventMapPage() {
  const router = useRouter();
  const [selectedPoi, setSelectedPoi] = useState<any | null>(null);

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
    getRealGps,
    handleGpsUpdate,
    screenMode,
    deviceHeading,
    computeNavigationStats,
    loadingMapData
  } = useUserTest();

  const { language, t, tPoiName, tPoiDesc, tEventName } = useLanguage();

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
      router.push('/melamarg/navigation');
    }
  }, [navTarget, router]);

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
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const lastGpsRef = useRef<[number, number] | null>(null);

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

    const filteredPoisList = userPathName
      ? poisList.filter((poi) => {
          const poiPath = poi.path_name || (poi as any).pathName;
          return !poiPath || poiPath === userPathName;
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

  // Helper to map POI category names to emojis/icons
  const getCategoryEmoji = (category: string): string => {
    const c = (category || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '🚽';
    if (c.includes('police') || c.includes('security') || c.includes('post')) return '👮';
    if (c.includes('medical') || c.includes('hospital') || c.includes('health') || c.includes('first')) return '🏥';
    if (c.includes('water') || c.includes('drink')) return '💧';
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) return '🚪';
    if (c.includes('parking')) return '🅿️';
    if (c.includes('food') || c.includes('eat') || c.includes('restaurant')) return '🍔';
    return '📍';
  };

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
  const LRef = useRef<any>(null);

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

    // DijkstraRouter is defined globally

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

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userGps);
    }
    if (userAccuracyCircleRef.current) {
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
  }, [userGps, gpsAccuracy, gpsStatus, isUserOutsideEvent, nearestEntrance, leafletLoaded]);

  // Force Leaflet recalculation on expanded state toggle
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
        mapRef.current.panTo(userGps);
      }, 150);
    }
  }, [isMapExpanded, userGps]);


  // Map rendering logic
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined') return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
    }

    const map = L.map('standalone-leaflet-map-canvas', {
      zoomControl: false,
      attributionControl: false
    }).setView(userGps, 19);
    mapRef.current = map;

    setMapZoom(map.getZoom());
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Bounding box for event
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
        }).addTo(map);
        map.setView(userGps, 19);
      }
    }

    // User GPS location pin
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
    const userMarker = L.marker(userGps, { icon: gpsIcon, zIndexOffset: 1000 }).addTo(map);
    userMarkerRef.current = userMarker;
    userMarker.bindPopup('<strong style="color:#06b6d4">Your Location</strong>');

    // Accuracy ring
    const initialCircleColor = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
    const accuracyCircle = L.circle(userGps, {
      radius: gpsAccuracy || 15,
      color: initialCircleColor,
      fillColor: initialCircleColor,
      fillOpacity: 0.08,
      weight: 1
    }).addTo(map);
    userAccuracyCircleRef.current = accuracyCircle;

    poisLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);

    // Draw POIs
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

    poisList.forEach((poi) => {
      const color = categoryColor(poi.category_name);
      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const poiIcon = L.divIcon({
        html: `
          <div style="
            background:${color};
            width:28px;height:28px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid rgba(0,0,0,0.6);
            box-shadow:0 2px 6px rgba(0,0,0,0.5);
            display:flex;align-items:center;justify-content:center;
          ">
            ${categoryIconSvg(poi.category_name)}
          </div>
        `,
        className: '',
        iconSize: [28, 28],
        iconAnchor: [8, 28],
        popupAnchor: [6, -28]
      });

      const marker = L.marker([lat, lng], { icon: poiIcon })
        .addTo(poisLayerRef.current);

      marker.on('click', () => {
        setSelectedPoi(poi);
      });

      marker.bindPopup(`
        <div style="font-family:sans-serif;min-width:140px">
          <strong style="color:#333;font-size:12px">${poi.name_en || 'POI'}</strong>
          <div style="font-size:10px;color:${color};text-transform:uppercase;margin-top:2px">${poi.category_name || ''}</div>
          ${poi.description ? `<div style="font-size:10px;color:#666;margin-top:4px">${poi.description}</div>` : ''}
        </div>
      `);
    });

    // Draw navTarget alert target
    if (navTarget && !poisList.some(p => p.id === navTarget.id)) {
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
          .addTo(poisLayerRef.current)
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

    // Draw route segments
    routeEdges.forEach((edge) => {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;
      const startNode = routeNodes.find((n) => n.id === startId);
      const endNode = routeNodes.find((n) => n.id === endId);
      if (startNode && endNode) {
        // Shaded corridor representing the 20-meter buffer radius (40m total width)
        L.polyline([
          [Number(startNode.latitude), Number(startNode.longitude)],
          [Number(endNode.latitude), Number(endNode.longitude)]
        ], {
          color: '#22d3ee',
          weight: 40, // Visual corridor thickness
          opacity: 0.12,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(routeLayerRef.current);

        // Center line
        L.polyline([
          [Number(startNode.latitude), Number(startNode.longitude)],
          [Number(endNode.latitude), Number(endNode.longitude)]
        ], {
          color: '#22d3ee',
          weight: 3,
          opacity: 0.75,
          dashArray: '6, 6'
        }).addTo(routeLayerRef.current);
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
        }).addTo(routeLayerRef.current)
          .bindPopup(`<strong style="color:#c084fc;font-size:12px">Entrance: ${node.name || 'Point'}</strong><div style="font-size:10px;color:#a1a1aa;margin-top:2px">Designated Event Entrance</div>`);
      } else {
        L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: '#0891b2',
          color: '#fff',
          weight: 1.5,
          fillOpacity: 1
        }).addTo(routeLayerRef.current)
          .bindPopup(`<span style="color:#22d3ee;font-size:11px">${node.name || 'Node'}</span>`);
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        userMarkerRef.current = null;
        activeRouteLayerRef.current = null;
      }
      if (entranceGuidanceLineRef.current) {
        entranceGuidanceLineRef.current = null;
      }
      if (offPathConnectorLineRef.current) {
        offPathConnectorLineRef.current = null;
      }
    };
  }, [leafletLoaded, poisList, routeNodes, routeEdges, navTarget, selectedEvent]);

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

    let destNode = routeNodes.find((n) => n.poi_id === targetPoi.id);
    if (!destNode) {
      let minPoiDist = Infinity;
      routeNodes.forEach((node) => {
        const dist = getHaversineDistance(targetPoi.latitude, targetPoi.longitude, node.latitude, node.longitude);
        if (dist < minPoiDist) {
          minPoiDist = dist;
          destNode = node;
        }
      });
    }
    if (!destNode) destNode = routeNodes[0];

    const { nearestNodeToUser } = findOptimalEntranceNode(
      userGps[0],
      userGps[1],
      destNode,
      routeNodes,
      routeEdges
    );

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id);

    if (path && path.length > 0) {
      const latlngs = path.map((n: any) => [Number(n.latitude), Number(n.longitude)]);
      
      // Match the static route corridor so the navigable path stays visible.
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
    }
  }, [navTarget, selectedPoi, userGps, leafletLoaded, routeNodes, routeEdges, screenMode]);



  const renderGpsStatusPill = () => {
    if (gpsStatus === 'locked') {
      return (
        <GPSLockedPill>
          <span className="dot"></span>
          <span>GPS Locked ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Good'})</span>
        </GPSLockedPill>
      );
    } else if (gpsStatus === 'searching') {
      return (
        <GPSSearchingPill>
          <span className="dot"></span>
          <span>Searching GPS... ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Weak'})</span>
        </GPSSearchingPill>
      );
    } else {
      return (
        <GPSLostPill>
          <span className="dot"></span>
          <span>GPS Lost ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'No Signal'})</span>
        </GPSLostPill>
      );
    }
  };

  const checkIsOffPath = () => {
    if (routeEdges.length === 0 || routeNodes.length === 0) return { isOff: true, dist: 0, dir: '', pathName: 'Event Area' };

    let pathNodeIds = new Set<string>();

    if (selectedPoi) {
      let destNode = routeNodes.find((n) => n.poi_id === selectedPoi.id);
      if (!destNode) {
        let minPoiDist = Infinity;
        routeNodes.forEach((node) => {
          const dist = getHaversineDistance(selectedPoi.latitude, selectedPoi.longitude, node.latitude, node.longitude);
          if (dist < minPoiDist) {
            minPoiDist = dist;
            destNode = node;
          }
        });
      }
      if (!destNode) destNode = routeNodes[0];

      const { nearestNodeToUser } = findOptimalEntranceNode(
        userGps[0],
        userGps[1],
        destNode,
        routeNodes,
        routeEdges
      );

      const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id);
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
      else if (relativeAngle > 135 && relativeAngle <= 225) dirText = 'Around ⬇';
      else if (relativeAngle > 225 && relativeAngle <= 315) dirText = 'Left ⬅';
      else dirText = 'Straight ⬆';
    }

    return { isOff, dist: Math.round(minOffDist), dir: dirText, pathName: pathNameStr };
  };
  
  const explorePathStatus = checkIsOffPath();

  const getFloatingPois = () => {
    if (mapZoom < 18 || !explorePathStatus || explorePathStatus.isOff) return [];
    if (!explorePathStatus.pathName || explorePathStatus.pathName === 'Path') return [];
    
    const currentPathNodeIds = new Set<string>();
    routeEdges.forEach(e => {
       if ((e as any).path_name === explorePathStatus.pathName) {
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
    
    const floatingPoisList = poisList.filter(p => poiIdsOnPath.has(p.id));
    
    return floatingPoisList.map(poi => {
      const b = getCompassBearing(userGps[0], userGps[1], Number(poi.latitude), Number(poi.longitude));
      const rel = (b - deviceHeading + 360) % 360;
      let dir = '';
      if (rel > 315 || rel <= 45) dir = 'front';
      else if (rel > 45 && rel <= 135) dir = 'right';
      else if (rel > 135 && rel <= 225) dir = 'back';
      else dir = 'left';
      return { ...poi, relDir: dir, dist: Math.round(getHaversineDistance(userGps[0], userGps[1], Number(poi.latitude), Number(poi.longitude))) };
    });
  };
  
  const floatingPois = getFloatingPois();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', flexGrow: 1 }}>
      <MapCanvas id="standalone-leaflet-map-canvas" />

      {/* Loading overlay */}
      {poisList.length === 0 && loadingMapData && (
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(22, 22, 34, 0.85)',
          backdropFilter: 'blur(8px)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          color: '#a1a1aa'
        }}>
          <style>{`
            @keyframes map-spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid rgba(34, 211, 238, 0.1)',
            borderTopColor: '#22d3ee',
            borderRadius: '50%',
            animation: 'map-spin 1s linear infinite'
          }} />
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#fafafa' }}>{t('initializingAssets')}</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>{t('downloadingPois')}</div>
        </div>
      )}

      {/* Top Floating Header Controls */}
      <FloatingHeaderWrapper>
        <FloatingHeaderPillRow>
          <OfflineActivePill>
            <span className="dot"></span>
            <span>{t('offlineNavigationActive')}</span>
          </OfflineActivePill>
          
          {gpsStatus === 'locked' ? (
            <GpsStrongPill>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0288d1' }} />
              <span>{t('gpsStrong')}</span>
            </GpsStrongPill>
          ) : gpsStatus === 'searching' ? (
            <GpsStrongPill style={{ background: '#FCF2E7', color: '#B7791F' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B7791F', animation: 'ping 1s infinite' }} />
              <span>{t('searchingGps')}</span>
            </GpsStrongPill>
          ) : (
            <GpsStrongPill style={{ background: '#FEE2E2', color: '#EF4444' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
              <span>{t('noGpsSignal')}</span>
            </GpsStrongPill>
          )}
        </FloatingHeaderPillRow>

        <UnifiedStatusCard>
          <UnifiedStatusHeader $isOffPath={explorePathStatus.isOff}>
            {explorePathStatus.isOff ? `${t('offPath')}: ${explorePathStatus.pathName}` : `${t('onPath')}: ${explorePathStatus.pathName}`}
          </UnifiedStatusHeader>
          <UnifiedStatusBody>
            <MapIcon style={{ width: '1.25rem', height: '1.25rem', color: explorePathStatus.isOff ? '#dc2626' : '#1e293b', flexShrink: 0 }} />
            <span>
              {explorePathStatus.isOff 
                ? getOffPathInstruction()
                : t('offlineMapReady')}
            </span>
          </UnifiedStatusBody>
        </UnifiedStatusCard>
      </FloatingHeaderWrapper>

      {/* Floating Relative POI indicators when zoomed in */}
      {mapZoom >= 18 && floatingPois.length > 0 && (
        <FloatingHUDContainer>
          {/* Front */}
          <HUDSection $position="front">
            {floatingPois.filter(p => p.relDir === 'front').map(p => (
              <HUDIndicatorBadge 
                key={p.id} 
                $direction="front"
                onClick={() => {
                  setSelectedPoi(p);
                  if (mapRef.current) {
                    mapRef.current.setView([Number(p.latitude), Number(p.longitude)], 19);
                  }
                }}
              >
                <span className="arrow">▲</span>
                <span className="icon">{getCategoryEmoji(p.category_name)}</span>
                <span className="name">{tPoiName(p) || p.category_name}</span>
                <span className="dist">({p.dist}m)</span>
              </HUDIndicatorBadge>
            ))}
          </HUDSection>

          {/* Back */}
          <HUDSection $position="back">
            {floatingPois.filter(p => p.relDir === 'back').map(p => (
              <HUDIndicatorBadge 
                key={p.id} 
                $direction="back"
                onClick={() => {
                  setSelectedPoi(p);
                  if (mapRef.current) {
                    mapRef.current.setView([Number(p.latitude), Number(p.longitude)], 19);
                  }
                }}
              >
                <span className="arrow">▼</span>
                <span className="icon">{getCategoryEmoji(p.category_name)}</span>
                <span className="name">{tPoiName(p) || p.category_name}</span>
                <span className="dist">({p.dist}m)</span>
              </HUDIndicatorBadge>
            ))}
          </HUDSection>

          {/* Left */}
          <HUDSection $position="left">
            {floatingPois.filter(p => p.relDir === 'left').map(p => (
              <HUDIndicatorBadge 
                key={p.id} 
                $direction="left"
                onClick={() => {
                  setSelectedPoi(p);
                  if (mapRef.current) {
                    mapRef.current.setView([Number(p.latitude), Number(p.longitude)], 19);
                  }
                }}
              >
                <span className="arrow">◀</span>
                <span className="icon">{getCategoryEmoji(p.category_name)}</span>
                <span className="name">{tPoiName(p) || p.category_name}</span>
                <span className="dist">({p.dist}m)</span>
              </HUDIndicatorBadge>
            ))}
          </HUDSection>

          {/* Right */}
          <HUDSection $position="right">
            {floatingPois.filter(p => p.relDir === 'right').map(p => (
              <HUDIndicatorBadge 
                key={p.id} 
                $direction="right"
                onClick={() => {
                  setSelectedPoi(p);
                  if (mapRef.current) {
                    mapRef.current.setView([Number(p.latitude), Number(p.longitude)], 19);
                  }
                }}
              >
                <span className="name">{tPoiName(p) || p.category_name}</span>
                <span className="dist">({p.dist}m)</span>
                <span className="icon">{getCategoryEmoji(p.category_name)}</span>
                <span className="arrow">▶</span>
              </HUDIndicatorBadge>
            ))}
          </HUDSection>
        </FloatingHUDContainer>
      )}

      {/* Bottom Floating Card & Secondary Actions */}
      <FloatingBottomWrapper>
        <FloatingControlsRow>
          <FloatingLocateButton
            onClick={async (e) => {
              e.stopPropagation();
              try {
                const DeviceOrientationEventAny = (window as any).DeviceOrientationEvent;
                if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
                  await DeviceOrientationEventAny.requestPermission();
                }
              } catch (err) {
                console.warn('Failed compass permission request:', err);
              }

              const pos = await getRealGps();
              if (pos) {
                setUserGps(pos);
                if (mapRef.current) mapRef.current.setView(pos, 17);
              } else if (mapRef.current) {
                mapRef.current.setView(userGps, 17);
              }
            }}
            title="Recenter on my location"
          >
            <Navigation style={{ width: '1.2rem', height: '1.2rem', transform: 'rotate(45deg)' }} />
          </FloatingLocateButton>
        </FloatingControlsRow>

        {selectedPoi ? (
          <ExploreBottomCard>
            <ExploreCardTitle>{tPoiName(selectedPoi)}</ExploreCardTitle>
            <ExplorePOIInfoRow>
              <span className="badge">{selectedPoi.category_name}</span>
              <span>•</span>
              <span>
                {(() => {
                  const dist = getHaversineDistance(userGps[0], userGps[1], selectedPoi.latitude, selectedPoi.longitude);
                  return dist < 1000 ? `${Math.round(dist)} m ${t('metersAway')}` : `${(dist / 1000).toFixed(2)} km ${t('metersAway')}`;
                })()}
              </span>
            </ExplorePOIInfoRow>
            {selectedPoi.description && (
              <ExploreCardDescription>{tPoiDesc(selectedPoi)}</ExploreCardDescription>
            )}
            <ExploreActionsRow>
              <ExploreNavButton
                onClick={() => {
                  setNavTarget(selectedPoi);
                }}
              >
                <Navigation style={{ width: '1.1rem', height: '1.1rem', transform: 'rotate(45deg)' }} />
                <span>{t('startNavigation')}</span>
              </ExploreNavButton>
              <ExploreCloseButton onClick={() => setSelectedPoi(null)}>
                <span>{t('cancel')}</span>
              </ExploreCloseButton>
            </ExploreActionsRow>
          </ExploreBottomCard>
        ) : (
          <ExploreBottomCard>
            <ExploreCardTitle>{selectedEvent ? tEventName(selectedEvent) : 'Event Map'}</ExploreCardTitle>
            <ExploreCardDescription>
              {t('nearestHelpSub')}
            </ExploreCardDescription>
          </ExploreBottomCard>
        )}
      </FloatingBottomWrapper>
    </div>
  );
}
