'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
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
  DirectionsDashboard,
  ArrivalOverlay,
  ArrivalTitle,
  ArrivalText,
  ArrivalButton,
  BackButton,
  NavHeaderCategory,
  NavHeaderTitle,
  NavHeaderStatsWrapper,
  NavHeaderStats,
  CompassBanner,
  CompassRing,
  CompassText,
  CompassSub,
  CompassTitle,
  CompassInstruction,
  ControlsGrid,
  SimulateButton,
  StopNavigationButton,
  MapPanel,
  MapCanvas,
  MapToggleButton,
  MapRecenterButton,
  ExpandedBanner,
  ExpandedBannerLeft,
  ExpandedCompassRing,
  ExpandedBannerActions,
  ExpandedSimulateButton,
  ExpandedCloseButton,
  FooterCoordinatesDisplay,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  StyledCompassIcon,
  CompassArrowSvg,
  ExpandedCompassArrowSvg,
  StyledPartyPopper,
  StyledArrowLeft,
  StyledNavigation,
  StyledMapPin,
  ToggleSvg,
  CloseSvg
} from './page.styled';

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
    getRealGps
  } = useUserTest();

  const mapRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const activeRouteLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [isMapExpanded, setIsMapExpanded] = useState(false);

  const stats = navTarget ? getNavigationStats() : null;

  // Bind Leaflet object on mount/check
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      LRef.current = (window as any).L;
    }
  }, [leafletLoaded]);

  // Leaflet Map Initialization effect
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

    // Initialize map centered on user GPS location
    const map = L.map('navigation-split-map-canvas', {
      zoomControl: false,
      attributionControl: false
    }).setView(userGps, 17);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Event boundary box
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

    // Accuracy circle
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

    // Draw grid nodes & segments for layout reference
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

    // Draw target POI marker
    const categoryColor = (catName: string): string => {
      const c = (catName || '').toLowerCase();
      if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '#f59e0b';
      if (c.includes('police') || c.includes('security')) return '#3b82f6';
      if (c.includes('medical') || c.includes('hospital')) return '#ef4444';
      if (c.includes('water') || c.includes('drink')) return '#06b6d4';
      if (c.includes('exit') || c.includes('gate')) return '#10b981';
      if (c.includes('parking')) return '#6366f1';
      if (c.includes('food') || c.includes('eat')) return '#f97316';
      return '#ef4444'; // default to red for alerts
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

    // Initial draw of the highlighted active route polyline
    if (stats && stats.pathNodes) {
      drawActiveRoute(L, stats.pathNodes);
    }

    // Force immediate size validation on mount
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

  // Sync user location marker and pan in real-time
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

    // Auto-pan map to user position during walk simulation or GPS tracking
    mapRef.current.panTo(userGps);
  }, [userGps, gpsAccuracy, gpsStatus]);

  // Force Leaflet recalculation on split/expand state toggle
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
        mapRef.current.panTo(userGps);
      }, 100);
    }
  }, [isMapExpanded, userGps]);

  // Sync highlighted polyline when stats update
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
      
      // Draw highlighted green outline route
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
      
      // Draw dashed white center line
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
          <span>Locked</span>
        </GPSLockedPill>
      );
    } else if (gpsStatus === 'searching') {
      return (
        <GPSSearchingPill>
          <span className="dot"></span>
          <span>Searching</span>
        </GPSSearchingPill>
      );
    } else {
      return (
        <GPSLostPill>
          <span className="dot"></span>
          <span>No GPS</span>
        </GPSLostPill>
      );
    }
  };

  return (
    <NavContainer>
      
      {/* Waiting for GPS Lock Overlay */}
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

      {/* UPPER PANEL: Directions Dashboard (28% height, hidden when map is expanded) */}
      {!isMapExpanded && (
        <DirectionsDashboard>
          
          {/* Celebration Overlay for Goal Arrival */}
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

          {/* Back and Navigation Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <BackButton
              onClick={() => {
                setNavTarget(null);
                setScreenMode('pois');
                setIsWalking(false);
                router.push('/user-test-page/pois');
              }}
            >
              <StyledArrowLeft />
              <span>Back</span>
            </BackButton>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <NavHeaderCategory>
                  Navigating to: {navTarget.category_name}
                </NavHeaderCategory>
                <NavHeaderTitle>
                  {navTarget.name_en}
                </NavHeaderTitle>
              </div>
              <NavHeaderStatsWrapper>
                {renderGpsStatusPill()}
                <NavHeaderStats>
                  {stats.distance}m • ~{stats.time}s
                </NavHeaderStats>
              </NavHeaderStatsWrapper>
            </div>
          </div>

          {/* Glassmorphic Compass and Directive Block */}
          <CompassBanner>
            
            {/* Rotatable arrow container */}
            <CompassRing>
              <CompassArrowSvg
                style={{ transform: `rotate(${(stats.bearing - deviceHeading + 360) % 360}deg)` }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </CompassArrowSvg>
            </CompassRing>

            {/* Real-time textual prompts */}
            <CompassText>
              <CompassSub>Compass Bearings</CompassSub>
              <CompassTitle>
                <span>{stats.directionText}</span>
                {isWalking && (
                  <span style={{ fontSize: '6.5px', fontFamily: 'monospace', padding: '0.125rem 0.25rem', backgroundColor: 'rgba(69,26,3,0.4)', color: '#fbbf24', border: '1px solid rgba(120,53,15,0.4)', borderRadius: '0.25rem', transform: 'scale(0.9)' }}>
                    WALKING
                  </span>
                )}
              </CompassTitle>
              <CompassInstruction>
                {stats.isOffRoute ? (
                  <span>Head to node: <span style={{ color: '#22d3ee', fontWeight: '900' }}>{stats.targetNodeName}</span></span>
                ) : (
                  <span>Follow path: <span style={{ color: '#22d3ee', fontWeight: '900' }}>{stats.targetNodeName}</span></span>
                )}
              </CompassInstruction>
            </CompassText>
          </CompassBanner>

          {/* Action Controls */}
          <ControlsGrid>
{/*             <SimulateButton
              onClick={handleSimulateWalking}
              disabled={isWalking || arrivalNotify}
            >
              <span>{isWalking ? 'Walking...' : 'Simulate Walk'}</span>
            </SimulateButton> */}
            <StopNavigationButton
              onClick={() => {
                setNavTarget(null);
                setScreenMode('pois');
                setIsWalking(false);
                router.push('/user-test-page/pois');
              }}
            >
              Stop Navigation
            </StopNavigationButton>
          </ControlsGrid>
        </DirectionsDashboard>
      )}

      {/* LOWER PANEL: Interactive Leaflet Map (72% or 100% height) */}
      <MapPanel isExpanded={isMapExpanded}>
        
        {/* Leaflet map canvas */}
        <MapCanvas id="navigation-split-map-canvas" />

        {/* Floating Expand/Collapse Toggle Button (Top Left of Map) */}
        <MapToggleButton onClick={() => setIsMapExpanded(!isMapExpanded)}>
          {isMapExpanded ? (
            <ToggleSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
            </ToggleSvg>
          ) : (
            <ToggleSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4" />
            </ToggleSvg>
          )}
        </MapToggleButton>

        {/* Floating Recenter Button (Top Right of Map) */}
        <MapRecenterButton
          onClick={async () => {
            const pos = await getRealGps();
            if (pos) {
              setUserGps(pos);
              if (mapRef.current) mapRef.current.setView(pos, 17);
            } else if (mapRef.current) {
              mapRef.current.setView(userGps, 17);
            }
          }}
        >
          <StyledNavigation />
        </MapRecenterButton>

        {/* Floating directions card overlay when map is full screen */}
        {isMapExpanded && (
          <ExpandedBanner>
            <ExpandedBannerLeft>
              {/* Mini Arrow */}
              <ExpandedCompassRing>
                <ExpandedCompassArrowSvg
                  style={{ transform: `rotate(${(stats.bearing - deviceHeading + 360) % 360}deg)` }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </ExpandedCompassArrowSvg>
              </ExpandedCompassRing>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <span style={{ fontSize: '10px', fontWeight: '900', color: '#10b981', textTransform: 'uppercase' }}>{stats.directionText}</span>
                  <span style={{ fontSize: '8px', color: '#71717a', fontFamily: 'monospace' }}>{stats.distance}m • ~{stats.time}s</span>
                </div>
                <p style={{ fontSize: '9px', color: '#e4e4e7', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0.125rem 0 0 0' }}>
                  Target: {navTarget.name_en}
                </p>
              </div>
            </ExpandedBannerLeft>
            
            {/* Quick simulate controls */}
            <ExpandedBannerActions>
              <ExpandedSimulateButton
                onClick={handleSimulateWalking}
                disabled={isWalking || arrivalNotify}
              >
                {isWalking ? 'Walk...' : 'Simulate'}
              </ExpandedSimulateButton>
              <ExpandedCloseButton
                onClick={() => {
                  setNavTarget(null);
                  setScreenMode('pois');
                  setIsWalking(false);
                  router.push('/user-test-page/pois');
                }}
              >
                <CloseSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </CloseSvg>
              </ExpandedCloseButton>
            </ExpandedBannerActions>
          </ExpandedBanner>
        )}

        {/* GPS coordinates text display overlay at bottom */}
        <FooterCoordinatesDisplay>
          <StyledMapPin />
          <span>
            {userGps[0].toFixed(6)}, {userGps[1].toFixed(6)}
            {gpsAccuracy !== null && ` • Acc: ${Math.round(gpsAccuracy)}m`}
          </span>
        </FooterCoordinatesDisplay>
      </MapPanel>

    </NavContainer>
  );
}
