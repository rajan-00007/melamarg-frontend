'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
import { Navigation, MapPin } from 'lucide-react';
import {
  NavContainer,
  Overlay,
  OverlayBox,
  CenterBox,
  WarningIconWrapper,
  OverlayTitle,
  OverlayText,
  OverlayPillWrapper,
  OverlayButtons,
  BypassButton,
  StopButton,
  ArrivalOverlay,
  ArrivalTitle,
  ArrivalText,
  ArrivalButton,
  BackButton,
  SplitWrapper,
  DashboardContainer,
  MapContainer,
  MapCanvas,
  CentralCard,
  ArrowAnimationWrapper,
  ArrowWrapper,
  DirectionText,
  NextInstruction,
  SidePOICard,
  POITag,
  POIEmoji,
  POIName,
  POIDistance,
  NoPOIText,
  MiddleColumn,
  DashboardHeaderRow,
  DashboardHeaderTitle,
  DashboardHeaderStats,
  DashboardColumns,
  CompassSliderContainer,
  CompassSliderTrack,
  CompassLabel,
  CompassIndicatorLine,
  CompassTickLine,
  MapToggleButton,
  NavigationFooter,
  FooterStatus,
  FooterActions,
  FooterButton,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  StyledCompassIcon,
  StyledPartyPopper,
  StyledArrowLeft,
  StyledNavigation,
  StyledMapPin,
  GlowStatusOverlay,
  ControlsOverlay,
  RecenterButton,
  CoordinatesDisplay
} from './page.styled';

// Pure Utility Helpers
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

export default function CompassNavigationPage() {
  const router = useRouter();
  const {
    navTarget,
    setNavTarget,
    gpsStatus,
    userGps,
    setUserGps,
    gpsAccuracy,
    deviceHeading,
    isWalking,
    setIsWalking,
    arrivalNotify,
    setArrivalNotify,
    handleSimulateWalking,
    setScreenMode,
    getNavigationStats,
    handleGpsUpdate,
    routeNodes,
    routeEdges,
    selectedEvent,
    leafletLoaded,
    getRealGps,
    poisList
  } = useUserTest();

  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const activeRouteLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [gpsHeading, setGpsHeading] = useState<number>(0);
  const lastGpsRef = useRef<[number, number] | null>(null);

  const stats = navTarget ? getNavigationStats() : null;

  // Track user movements to derive walking bearing
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

    // Filter minor coordinate jitters
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

  // Real-time Left and Right POI quadrant calculations
  const nearestQuadrantPOIs = useMemo(() => {
    if (!poisList || poisList.length === 0) {
      return { left: null, right: null };
    }

    // Travel bearing heading vector
    let heading = 0;
    if (stats && typeof stats.bearing === 'number') {
      heading = stats.bearing;
    } else {
      heading = gpsHeading || deviceHeading || 0;
    }

    let nearestLeft: any = null;
    let nearestRight: any = null;

    let minLeftDist = Infinity;
    let minRightDist = Infinity;

    poisList.forEach((poi) => {
      // Don't show our active destination POI on the side quadrants
      if (navTarget && poi.id === navTarget.id) return;

      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const dist = getHaversineDistance(userGps[0], userGps[1], lat, lng);
      const absBearing = getCompassBearing(userGps[0], userGps[1], lat, lng);

      // Angle relative to our travel direction (0 to 360)
      const relativeAngle = (absBearing - heading + 360) % 360;

      // Classify into left and right boundaries (ignoring front/back)
      if (relativeAngle >= 45 && relativeAngle < 180) {
        // Right quadrant (45 to 180)
        if (dist < minRightDist) {
          minRightDist = dist;
          nearestRight = { ...poi, distance: Math.round(dist) };
        }
      } else if (relativeAngle >= 180 && relativeAngle < 315) {
        // Left quadrant (180 to 315)
        if (dist < minLeftDist) {
          minLeftDist = dist;
          nearestLeft = { ...poi, distance: Math.round(dist) };
        }
      }
    });

    return { left: nearestLeft, right: nearestRight };
  }, [poisList, userGps, navTarget, stats, gpsHeading, deviceHeading]);

  // Emoji category matcher
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

  // Computes precise turn prompts at Dijkstra intersection junctions
  const getDetailedInstruction = () => {
    if (!navTarget || !stats) return 'No active target';

    const distanceVal = stats.distance;

    if (stats.isOffRoute) {
      return `Walk ${distanceVal}m to join route at [${stats.targetNodeName}]`;
    }

    const path = stats.pathNodes || [];
    if (path.length > 2) {
      // Relative bearing comparison to detect turn transitions
      const b1 = getCompassBearing(path[0].latitude, path[0].longitude, path[1].latitude, path[1].longitude);
      const b2 = getCompassBearing(path[1].latitude, path[1].longitude, path[2].latitude, path[2].longitude);
      const relative = (b2 - b1 + 360) % 360;

      let turnText = "";
      if (relative > 45 && relative <= 135) turnText = ", then turn RIGHT";
      else if (relative > 225 && relative <= 315) turnText = ", then turn LEFT";
      else if (relative > 135 && relative <= 225) turnText = ", then turn AROUND";

      return `Walk ${distanceVal}m straight to [${stats.targetNodeName}]${turnText}`;
    } else if (path.length === 2) {
      return `Walk ${distanceVal}m straight to [${stats.targetNodeName}], then head to destination`;
    } else {
      return `Walk final ${distanceVal}m to ${navTarget.name_en}`;
    }
  };

  // Bind Leaflet object on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      LRef.current = (window as any).L;
    }
  }, [leafletLoaded]);

  // Leaflet Map Setup effect
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined' || !navTarget) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
      activeRouteLayerRef.current = null;
    }

    const map = L.map('navigation-split-map-canvas', {
      zoomControl: false,
      attributionControl: false
    }).setView(userGps, 17);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Event boundary overlay
    if (selectedEvent) {
      const { north, south, east, west } = selectedEvent;
      if (north && south && east && west) {
        const bounds = [[Number(south), Number(west)], [Number(north), Number(east)]];
        L.rectangle(bounds, {
          color: '#10b981',
          weight: 2,
          fill: true,
          fillColor: '#10b981',
          fillOpacity: 0.03,
          dashArray: '5, 8'
        }).addTo(map);
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

    // Accuracy ring
    const initialCircleColor = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
    const accuracyCircle = L.circle(userGps, {
      radius: gpsAccuracy || 15,
      color: initialCircleColor,
      fillColor: initialCircleColor,
      fillOpacity: 0.06,
      weight: 1
    }).addTo(map);
    userAccuracyCircleRef.current = accuracyCircle;

    // Layer group for network route grid
    const networkLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = networkLayer;

    // Draw full waypoint grid network reference lines
    routeEdges.forEach((edge) => {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;
      const startNode = routeNodes.find((n) => n.id === startId);
      const endNode = routeNodes.find((n) => n.id === endId);
      if (startNode && endNode) {
        L.polyline([
          [Number(startNode.latitude), Number(startNode.longitude)],
          [Number(endNode.latitude), Number(endNode.longitude)]
        ], {
          color: '#22d3ee',
          weight: 2,
          opacity: 0.3,
          dashArray: '4, 4'
        }).addTo(networkLayer);
      }
    });

    routeNodes.forEach((node) => {
      const lat = Number(node.latitude);
      const lng = Number(node.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      if (node.is_entrance) {
        L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: '#8b5cf6',
          color: '#fff',
          weight: 1,
          fillOpacity: 0.8
        }).addTo(networkLayer);
      } else {
        L.circleMarker([lat, lng], {
          radius: 3,
          fillColor: '#0891b2',
          color: '#fff',
          weight: 0.8,
          fillOpacity: 0.8
        }).addTo(networkLayer);
      }
    });

    // Draw active target POI marker
    const categoryColor = (catName: string): string => {
      const c = (catName || '').toLowerCase();
      if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '#f59e0b';
      if (c.includes('police') || c.includes('security')) return '#3b82f6';
      if (c.includes('medical') || c.includes('hospital')) return '#ef4444';
      if (c.includes('water') || c.includes('drink')) return '#06b6d4';
      if (c.includes('exit') || c.includes('gate')) return '#10b981';
      if (c.includes('parking')) return '#6366f1';
      if (c.includes('food') || c.includes('eat')) return '#f97316';
      return '#ef4444';
    };

    const categoryIconSvg = (catName: string): string => {
      const c = (catName || '').toLowerCase();
      if (c.includes('toilet') || c.includes('washroom')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 22V10h-3V6a5 5 0 0 0-10 0v4H2v12"></path><path d="M6 10V6a3 3 0 0 1 6 0v4"></path></svg>`;
      }
      if (c.includes('police') || c.includes('security')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
      }
      if (c.includes('medical') || c.includes('hospital')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 5v14M5 12h14"></path></svg>`;
      }
      if (c.includes('water') || c.includes('drink')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`;
      }
      if (c.includes('exit') || c.includes('gate')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>`;
      }
      if (c.includes('parking')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M9 17V5h5a4 4 0 0 1 0 8H9"></path></svg>`;
      }
      if (c.includes('food') || c.includes('eat')) {
        return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 8A6 6 0 0 0 6 8c0 7 6 13 6 13s6-6 6-13z"></path><path d="M12 2v6M12 11h.01"></path></svg>`;
      }
      return `<svg viewBox="0 0 24 24" width="10" height="10" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><circle cx="12" cy="12" r="10"></circle></svg>`;
    };

    const destLat = Number(navTarget.latitude);
    const destLng = Number(navTarget.longitude);
    if (!isNaN(destLat) && !isNaN(destLng)) {
      const color = categoryColor(navTarget.category_name);
      const poiIcon = L.divIcon({
        html: `
          <div style="
            background:${color};
            width:26px;height:26px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid rgba(0,0,0,0.6);
            box-shadow:0 2px 6px rgba(0,0,0,0.5);
            display:flex;align-items:center;justify-content:center;
          ">
            ${categoryIconSvg(navTarget.category_name)}
          </div>
        `,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [8, 26]
      });

      L.marker([destLat, destLng], { icon: poiIcon })
        .addTo(map)
        .bindPopup(`<strong>${navTarget.name_en}</strong>`);
    }

    activeRouteLayerRef.current = L.layerGroup().addTo(map);

    // Initial path drawing
    if (stats && stats.pathNodes) {
      drawActiveRoute(L, stats.pathNodes);
    }

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false });
        mapRef.current.panTo(userGps);
      }
    }, 150);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        userMarkerRef.current = null;
        userAccuracyCircleRef.current = null;
        activeRouteLayerRef.current = null;
      }
    };
  }, [leafletLoaded, selectedEvent, navTarget]);

  // Recenter map on active updates
  useEffect(() => {
    if (!userMarkerRef.current || !mapRef.current) return;
    userMarkerRef.current.setLatLng(userGps);
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

    mapRef.current.panTo(userGps);
  }, [userGps, gpsAccuracy, gpsStatus]);

  // Force map size checks on expand/collapse size change
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
        mapRef.current.panTo(userGps);
      }, 150);
    }
  }, [isMapExpanded, userGps]);

  // Redraw route highlighting when GPS or nodes update
  useEffect(() => {
    const L = LRef.current || (window as any).L;
    if (L && activeRouteLayerRef.current && stats && stats.pathNodes) {
      drawActiveRoute(L, stats.pathNodes);
    }
  }, [stats?.pathNodes]);

  const drawActiveRoute = (L: any, path: any[]) => {
    if (!activeRouteLayerRef.current || !L) return;
    activeRouteLayerRef.current.clearLayers();

    if (path && path.length > 0) {
      const latlngs = path.map((n: any) => [Number(n.latitude), Number(n.longitude)]);
      
      // Thick green outline
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
      
      // Dashed white fill line
      L.polyline(latlngs, {
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        dashArray: '4, 8',
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
    }
  };

  if (!navTarget || !stats) return null;

  const renderGpsStatusPill = () => {
    if (gpsStatus === 'locked') {
      return (
        <GPSLockedPill>
          <span className="dot"></span>
          <span>Locked ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Good'})</span>
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
          <span>No GPS ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'No Signal'})</span>
        </GPSLostPill>
      );
    }
  };

  return (
    <NavContainer>
      
      {/* Waiting for GPS Lock Bypass Modal */}
      {gpsStatus !== 'locked' && (
        <Overlay>
          <OverlayBox>
            <CenterBox>
              <WarningIconWrapper>
                <StyledCompassIcon />
              </WarningIconWrapper>
            </CenterBox>
            <OverlayTitle>Waiting for GPS Signal...</OverlayTitle>
            <OverlayText>
              We require a high-accuracy GPS lock (<span style={{ color: '#fbbf24', fontWeight: 'bold' }}>50m</span>) to compute reliable offline walking routes.
            </OverlayText>
            <OverlayPillWrapper>
              {renderGpsStatusPill()}
            </OverlayPillWrapper>
            <OverlayButtons>
              <BypassButton 
                onClick={() => handleGpsUpdate({
                  coords: { latitude: userGps[0], longitude: userGps[1], accuracy: 12 },
                  timestamp: Date.now()
                })}
              >
                Bypass / Force Mock GPS Lock
              </BypassButton>
              <StopButton
                onClick={() => {
                  setNavTarget(null);
                  setScreenMode('pois');
                  setIsWalking(false);
                  router.push('/user-test-page/pois');
                }}
              >
                Stop Navigation
              </StopButton>
            </OverlayButtons>
          </OverlayBox>
        </Overlay>
      )}

      <SplitWrapper>
        {/* Top Premium Mockup Dashboard container */}
        <DashboardContainer $isExpanded={isMapExpanded}>
          {isMapExpanded ? (
            /* Single-row floating header banner when map is maximized */
            <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                <DashboardHeaderTitle style={{ fontSize: '0.625rem', marginBottom: 0 }}>
                  Navigating to: <span className="target">{navTarget.name_en}</span>
                </DashboardHeaderTitle>
                <DashboardHeaderStats style={{ fontSize: '0.95rem', marginTop: '0.1rem' }}>
                  {stats.distance}m <span className="time">~{stats.time}s</span>
                </DashboardHeaderStats>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {renderGpsStatusPill()}
                <button 
                  onClick={() => setIsMapExpanded(false)}
                  style={{
                    background: 'rgba(34, 211, 238, 0.1)',
                    border: '1px solid rgba(34, 211, 238, 0.3)',
                    borderRadius: '0.5rem',
                    color: '#22d3ee',
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '0.35rem 0.65rem',
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  Minimize Map
                </button>
              </div>
            </div>
          ) : (
            /* Premium active route dashboard mockup when map is collapsed preview */
            <>
              {arrivalNotify && (
                <ArrivalOverlay>
                  <StyledPartyPopper />
                  <ArrivalTitle>Destination Reached!</ArrivalTitle>
                  <ArrivalText>You have arrived safely at {navTarget.name_en}.</ArrivalText>
                  <ArrivalButton
                    onClick={() => {
                      setNavTarget(null);
                      setScreenMode('pois');
                      setIsWalking(false);
                      setArrivalNotify(false);
                      router.push('/user-test-page/pois');
                    }}
                  >
                    Return to POI List
                  </ArrivalButton>
                </ArrivalOverlay>
              )}

              {/* Title Header with Back navigators */}
              <DashboardHeaderRow>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <BackButton
                    onClick={() => {
                      setNavTarget(null);
                      setScreenMode('pois');
                      setIsWalking(false);
                      router.push('/user-test-page/pois');
                    }}
                    style={{ marginBottom: '0.35rem' }}
                  >
                    <StyledArrowLeft />
                    <span>Back</span>
                  </BackButton>
                  <DashboardHeaderTitle>
                    Navigating to: <span className="target">{navTarget.name_en}</span>
                  </DashboardHeaderTitle>
                  <DashboardHeaderStats>
                    {stats.distance}m <span className="time">~{stats.time}s</span>
                  </DashboardHeaderStats>
                </div>
                <div>
                  {renderGpsStatusPill()}
                </div>
              </DashboardHeaderRow>

              {/* Three-column Dashboard panel */}
              <DashboardColumns>
                {/* Left POI card */}
                {nearestQuadrantPOIs.left ? (
                  <SidePOICard 
                    $side="left" 
                    $hasPoi={true}
                    onClick={() => {
                      if (confirm(`Change route target to ${nearestQuadrantPOIs.left.name_en}?`)) {
                        setNavTarget(nearestQuadrantPOIs.left);
                      }
                    }}
                  >
                    <POITag $side="left">
                      <span>← LEFT</span>
                    </POITag>
                    <POIEmoji>{getCategoryEmoji(nearestQuadrantPOIs.left.category_name)}</POIEmoji>
                    <POIName>{nearestQuadrantPOIs.left.name_en}</POIName>
                    <POIDistance>{nearestQuadrantPOIs.left.distance}m</POIDistance>
                  </SidePOICard>
                ) : (
                  <SidePOICard $side="left" $hasPoi={false}>
                    <POITag $side="left">
                      <span>← LEFT</span>
                    </POITag>
                    <NoPOIText>No POI near</NoPOIText>
                  </SidePOICard>
                )}

                {/* High-focus Central active instructions card (taking full middle height) */}
                {(() => {
                  const dirColor = (stats.directionText.includes('AROUND') || stats.directionText.includes('BACK')) ? '#f59e0b' : '#10b981';
                  const rotationAngle = (stats.bearing - deviceHeading + 360) % 360;

                  return (
                    <MiddleColumn>
                      <CentralCard>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                          <ArrowAnimationWrapper>
                            <ArrowWrapper 
                              style={{ 
                                color: dirColor, 
                                filter: `drop-shadow(0 0 12px ${dirColor}66)`,
                                transform: `rotate(${rotationAngle}deg)`
                              }}
                            >
                              <svg
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                style={{ width: '1.85rem', height: '1.85rem', display: 'block' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            </ArrowWrapper>
                          </ArrowAnimationWrapper>
                          <DirectionText style={{ color: dirColor }}>
                            {stats.directionText || 'STRAIGHT'}
                          </DirectionText>
                          <NextInstruction>
                            {getDetailedInstruction()}
                          </NextInstruction>
                        </div>
                      </CentralCard>
                    </MiddleColumn>
                  );
                })()}

                {/* Right POI card */}
                {nearestQuadrantPOIs.right ? (
                  <SidePOICard 
                    $side="right" 
                    $hasPoi={true}
                    onClick={() => {
                      if (confirm(`Change route target to ${nearestQuadrantPOIs.right.name_en}?`)) {
                        setNavTarget(nearestQuadrantPOIs.right);
                      }
                    }}
                  >
                    <POITag $side="right">
                      <span>RIGHT →</span>
                    </POITag>
                    <POIEmoji>{getCategoryEmoji(nearestQuadrantPOIs.right.category_name)}</POIEmoji>
                    <POIName>{nearestQuadrantPOIs.right.name_en}</POIName>
                    <POIDistance>{nearestQuadrantPOIs.right.distance}m</POIDistance>
                  </SidePOICard>
                ) : (
                  <SidePOICard $side="right" $hasPoi={false}>
                    <POITag $side="right">
                      <span>RIGHT →</span>
                    </POITag>
                    <NoPOIText>No POI near</NoPOIText>
                  </SidePOICard>
                )}
              </DashboardColumns>

              {/* West-East Compass Slider indicator strip */}
              {(() => {
                const bearing = stats.bearing;
                let diff = (bearing - deviceHeading + 360) % 360;
                if (diff > 180) diff -= 360;
                const maxPx = 45; // limits
                const offsetPx = (diff / 180) * maxPx;

                return (
                  <CompassSliderContainer>
                    <CompassLabel>W</CompassLabel>
                    <CompassSliderTrack>
                      <CompassTickLine $offset={-40} $isMajor={true} />
                      <CompassTickLine $offset={-30} />
                      <CompassTickLine $offset={-20} $isMajor={true} />
                      <CompassTickLine $offset={-10} />
                      <CompassTickLine $offset={0} $isMajor={true} />
                      <CompassTickLine $offset={10} />
                      <CompassTickLine $offset={20} $isMajor={true} />
                      <CompassTickLine $offset={30} />
                      <CompassTickLine $offset={40} $isMajor={true} />
                      <CompassIndicatorLine $headingOffset={Math.round(offsetPx)} />
                    </CompassSliderTrack>
                    <CompassLabel>E</CompassLabel>
                  </CompassSliderContainer>
                );
              })()}
            </>
          )}
        </DashboardContainer>

        {/* Bottom Collapsible Interactive Map Panel */}
        <MapContainer 
          $isExpanded={isMapExpanded}
          onClick={() => !isMapExpanded && setIsMapExpanded(true)}
        >
          <MapCanvas id="navigation-split-map-canvas" />

          {/* Floating Minimize/Maximize button top left */}
          <MapToggleButton
            onClick={(e) => {
              e.stopPropagation(); // prevent map expand toggle
              setIsMapExpanded(!isMapExpanded);
            }}
            title={isMapExpanded ? "Minimize map panel" : "Maximize map panel"}
          >
            {isMapExpanded ? (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.1rem', height: '1.1rem', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ width: '1.1rem', height: '1.1rem', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
              </svg>
            )}
          </MapToggleButton>

          {/* GPS Locked badge overlay top left (shifted right of MapToggleButton) */}
          <GlowStatusOverlay>
            {renderGpsStatusPill()}
          </GlowStatusOverlay>

          {/* Recenter & Magnetometer compass permission trigger */}
          <ControlsOverlay>
            <RecenterButton
              onClick={async (e) => {
                e.stopPropagation(); // prevent map expand click bubbling

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
              title="Go to my real GPS location"
            >
              <Navigation className="w-4 h-4 rotate-45 text-cyan-400" />
            </RecenterButton>
          </ControlsOverlay>

          {/* GPS Coordinates text displays at bottom */}
          <CoordinatesDisplay>
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>
              {userGps[0].toFixed(6)}, {userGps[1].toFixed(6)}
              {gpsAccuracy !== null && ` • Accuracy: ${Math.round(gpsAccuracy)}m`}
            </span>
          </CoordinatesDisplay>
        </MapContainer>

        {/* Bottom Sticky Active Status Footer Bar */}
        <NavigationFooter>
          <FooterStatus>
            <span className="dot"></span>
            <span>{stats.isOffRoute ? 'Off route' : 'On route'}</span>
          </FooterStatus>
          <FooterActions>
            <FooterButton 
              $variant="simulate" 
              onClick={handleSimulateWalking}
              disabled={isWalking || arrivalNotify}
            >
              {isWalking ? 'Walking...' : 'Simulate Walk'}
            </FooterButton>
            <FooterButton 
              $variant="stop" 
              onClick={() => {
                if (confirm("Are you sure you want to stop navigation?")) {
                  setNavTarget(null);
                  setScreenMode('pois');
                  setIsWalking(false);
                  router.push('/user-test-page/pois');
                }
              }}
            >
              Stop
            </FooterButton>
          </FooterActions>
        </NavigationFooter>
      </SplitWrapper>
    </NavContainer>
  );
}
