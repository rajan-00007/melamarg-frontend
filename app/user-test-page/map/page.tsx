'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useUserTest } from '../context/UserTestContext';
import { Navigation, MapPin } from 'lucide-react';
import {
  MapWrapper,
  MapCanvas,
  GlowStatusOverlay,
  ControlsOverlay,
  RecenterButton,
  CoordinatesDisplay,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  SplitWrapper,
  DashboardContainer,
  MapContainer,
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
  QuadrantBadgeContainer,
  MiniQuadrantBadge,
  CentralMiniPOI,
  MiddleColumn,
  TrackToggleCard,
  TelemetryHUDOverlay,
  TelemetryStatsGrid,
  TelemetryCol,
  TelemetryLabel,
  TelemetryValue,
  TelemetryDivider,
  TelemetryStatusDot,
  HistoryClearButton
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

export default function EventMapPage() {
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
    isTrackingWalk,
    setIsTrackingWalk,
    walkCoordinates,
    walkStats,
    clearWalkHistory,
    showWalkTrail,
    setShowWalkTrail
  } = useUserTest();

  // GPS-derived movement heading
  const [gpsHeading, setGpsHeading] = useState<number>(0);
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
    if (!poisList || poisList.length === 0) {
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

    let nearestFront: any = null;
    let nearestBack: any = null;
    let nearestLeft: any = null;
    let nearestRight: any = null;

    let minFrontDist = Infinity;
    let minBackDist = Infinity;
    let minLeftDist = Infinity;
    let minRightDist = Infinity;

    poisList.forEach((poi) => {
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

    return { front: nearestFront, back: nearestBack, left: nearestLeft, right: nearestRight };
  }, [poisList, userGps, navTarget, gpsHeading, deviceHeading, computeNavigationStats]);

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
  const poisLayerRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const activeRouteLayerRef = useRef<any>(null);
  const walkLayerRef = useRef<any>(null);
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
          return getHaversineDistance(n1.latitude, n1.longitude, n2.latitude, n2.longitude);
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

  // REALTIME: update user marker position when GPS changes
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
  }, [userGps, gpsAccuracy, gpsStatus]);

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
    }).setView(userGps, 16);
    mapRef.current = map;

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
        map.fitBounds(bounds);
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

      L.marker([lat, lng], { icon: poiIcon })
        .addTo(poisLayerRef.current)
        .bindPopup(`
          <div style="font-family:sans-serif;min-width:140px">
            <strong style="color:#f4f4f5;font-size:12px">${poi.name_en || 'POI'}</strong>
            <div style="font-size:10px;color:${color};text-transform:uppercase;margin-top:2px">${poi.category_name || ''}</div>
            ${poi.description ? `<div style="font-size:10px;color:#a1a1aa;margin-top:4px">${poi.description}</div>` : ''}
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
        if (walkLayerRef.current) {
          walkLayerRef.current = null;
        }
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

    if (!navTarget || routeNodes.length === 0) return;

    let destNode = routeNodes.find((n) => n.poi_id === navTarget.id);
    if (!destNode) {
      let minPoiDist = Infinity;
      routeNodes.forEach((node) => {
        const dist = getHaversineDistance(navTarget.latitude, navTarget.longitude, node.latitude, node.longitude);
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
          return getHaversineDistance(n1.latitude, n1.longitude, n2.latitude, n2.longitude);
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

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id);

    if (path && path.length > 0) {
      const latlngs = path.map((n: any) => [Number(n.latitude), Number(n.longitude)]);
      
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 6,
        opacity: 0.85,
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
  }, [navTarget, userGps, leafletLoaded, routeNodes, routeEdges, screenMode]);

  // WALK PATH & ARROWS RENDER EFFECT
  useEffect(() => {
    if (!mapRef.current || !leafletLoaded) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (!walkLayerRef.current) {
      walkLayerRef.current = L.layerGroup().addTo(mapRef.current);
    } else {
      if (!mapRef.current.hasLayer(walkLayerRef.current)) {
        walkLayerRef.current.addTo(mapRef.current);
      }
      walkLayerRef.current.clearLayers();
    }

    if (!showWalkTrail || walkCoordinates.length === 0) return;

    const latlngs = walkCoordinates.map(coord => [Number(coord[0]), Number(coord[1])]);

    // 1. Draw Polyline (Dashed electric purple)
    L.polyline(latlngs, {
      color: '#a855f7',
      weight: 5,
      opacity: 0.85,
      dashArray: '6, 10',
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(walkLayerRef.current);

    // 2. Draw Start Marker (🏁)
    if (latlngs.length > 0) {
      const startPoint = latlngs[0];
      const startIcon = L.divIcon({
        html: `
          <div style="
            background: #1e1b4b;
            width: 22px; height: 22px; border-radius: 50%;
            border: 2px solid #a855f7;
            box-shadow: 0 0 10px rgba(168, 85, 247, 0.6);
            display: flex; align-items: center; justify-content: center;
            font-size: 10px;
          ">🏁</div>
        `,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });
      L.marker(startPoint, { icon: startIcon })
        .addTo(walkLayerRef.current)
        .bindPopup('<strong style="color:#a855f7">Walk Start Point</strong>');
    }

    // 3. Draw Rotated SVG Arrowheads (▲) at regular intervals (every 5th point)
    if (latlngs.length >= 2) {
      for (let i = 0; i < latlngs.length - 1; i += 5) {
        const pt1 = latlngs[i];
        const nextIdx = Math.min(i + 1, latlngs.length - 1);
        const pt2 = latlngs[nextIdx];

        if (pt1[0] === pt2[0] && pt1[1] === pt2[1]) continue;

        const bearing = getCompassBearing(pt1[0], pt1[1], pt2[0], pt2[1]);

        const arrowIcon = L.divIcon({
          html: `
            <div style="
              transform: rotate(${bearing}deg);
              color: #c084fc;
              font-size: 10px;
              line-height: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              text-shadow: 0 0 3px rgba(0,0,0,0.8);
            ">▲</div>
          `,
          className: '',
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        L.marker(pt1, { icon: arrowIcon }).addTo(walkLayerRef.current);
      }
    }
  }, [walkCoordinates, showWalkTrail, leafletLoaded]);

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

  return (
    <SplitWrapper>
      {/* Top 40% Navigation Dashboard */}
      <DashboardContainer>
        {/* Left POI Card */}
        {nearestQuadrantPOIs.left ? (
          <SidePOICard 
            $side="left" 
            $hasPoi={true}
            onClick={() => setNavTarget(nearestQuadrantPOIs.left)}
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

        {/* Central Navigation Instruction Card */}
        {(() => {
          const stats = navTarget ? computeNavigationStats(userGps[0], userGps[1]) : null;
          const dirColor = navTarget && stats 
            ? ((stats.directionText.includes('AROUND') || stats.directionText.includes('BACK')) ? '#f59e0b' : '#10b981')
            : '#06b6d4'; // Explore mode cyan glow
          const rotationAngle = navTarget && stats ? (stats.bearing - deviceHeading + 360) % 360 : 0;

          return (
            <MiddleColumn>
              {/* Top Quadrant: Front POI */}
              {nearestQuadrantPOIs.front ? (
                <CentralMiniPOI $side="front" onClick={() => setNavTarget(nearestQuadrantPOIs.front)}>
                  ▲ {getCategoryEmoji(nearestQuadrantPOIs.front.category_name)}
                  <span className="name">{nearestQuadrantPOIs.front.name_en}</span>
                  <span className="dist">{nearestQuadrantPOIs.front.distance}m</span>
                </CentralMiniPOI>
              ) : (
                <CentralMiniPOI $side="front" style={{ opacity: 0.35, pointerEvents: 'none', background: 'rgba(9, 9, 11, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  ▲ <span className="name" style={{ color: '#71717a' }}>FRONT</span>
                </CentralMiniPOI>
              )}

              {/* Middle Arrow Card Block */}
              <CentralCard>
                {/* Rotating SVG Arrow */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ArrowAnimationWrapper>
                    <ArrowWrapper 
                      style={{ 
                        color: dirColor, 
                        filter: `drop-shadow(0 0 15px ${dirColor}88)`,
                        transform: `rotate(${rotationAngle}deg)`
                      }}
                    >
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{ width: '2.5rem', height: '2.5rem', display: 'block' }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </ArrowWrapper>
                  </ArrowAnimationWrapper>
                  <DirectionText style={{ color: dirColor, fontSize: '0.85rem' }}>
                    {navTarget ? (stats?.directionText || 'STRAIGHT') : 'EXPLORE'}
                  </DirectionText>
                  <NextInstruction style={{ fontSize: '0.65rem' }}>
                    {navTarget ? (
                      `to ${stats?.targetNodeName || navTarget.name_en} in ${stats?.distance || 0}m`
                    ) : (
                      'Move to explore'
                    )}
                  </NextInstruction>
                </div>
              </CentralCard>

              {/* Bottom Quadrant: Back POI */}
              {nearestQuadrantPOIs.back ? (
                <CentralMiniPOI $side="back" onClick={() => setNavTarget(nearestQuadrantPOIs.back)}>
                  ▼ {getCategoryEmoji(nearestQuadrantPOIs.back.category_name)}
                  <span className="name">{nearestQuadrantPOIs.back.name_en}</span>
                  <span className="dist">{nearestQuadrantPOIs.back.distance}m</span>
                </CentralMiniPOI>
              ) : (
                <CentralMiniPOI $side="back" style={{ opacity: 0.35, pointerEvents: 'none', background: 'rgba(9, 9, 11, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  ▼ <span className="name" style={{ color: '#71717a' }}>BACK</span>
                </CentralMiniPOI>
              )}
            </MiddleColumn>
          );
        })()}

        {/* Right POI Card */}
        {nearestQuadrantPOIs.right ? (
          <SidePOICard 
            $side="right" 
            $hasPoi={true}
            onClick={() => setNavTarget(nearestQuadrantPOIs.right)}
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
      </DashboardContainer>

      {/* Bottom 50% Map Canvas */}
      <MapContainer>
        <MapWrapper style={{ minHeight: 'unset', height: '100%' }}>
          <MapCanvas id="standalone-leaflet-map-canvas" />

          {/* GPS Status Pill Top Left */}
          <GlowStatusOverlay>
            {renderGpsStatusPill()}
          </GlowStatusOverlay>

          {/* Recenter & Tracking Controls */}
          <ControlsOverlay>
            {/* Track My Walk Switch Switcher */}
            <TrackToggleCard>
              <div className="toggle-row">
                <span className="toggle-label">Track Walk</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isTrackingWalk}
                    onChange={(e) => setIsTrackingWalk(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span className="toggle-label">Show Walked Route</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={showWalkTrail}
                    onChange={(e) => setShowWalkTrail(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </TrackToggleCard>

            <RecenterButton
              onClick={async () => {
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

          {/* Telemetry HUD Overlay (Active when showing trail) */}
          {showWalkTrail && walkCoordinates.length > 0 && (
            <TelemetryHUDOverlay>
              <TelemetryStatusDot style={{ color: isTrackingWalk ? '#a855f7' : '#a1a1aa' }}>
                <span className={isTrackingWalk ? "pulse" : ""} style={{ backgroundColor: isTrackingWalk ? "#c084fc" : "#71717a" }}></span>
                <span>{isTrackingWalk ? "Tracking" : "Saved Route"}</span>
              </TelemetryStatusDot>
              
              <TelemetryDivider />
              
              <TelemetryStatsGrid>
                <TelemetryCol>
                  <TelemetryLabel>Distance</TelemetryLabel>
                  <TelemetryValue>
                    {walkStats.distance} <span className="unit">km</span>
                  </TelemetryValue>
                </TelemetryCol>
                
                <TelemetryDivider />
                
                <TelemetryCol>
                  <TelemetryLabel>Duration</TelemetryLabel>
                  <TelemetryValue>
                    {walkStats.duration} <span className="unit">min</span>
                  </TelemetryValue>
                </TelemetryCol>
                
                <TelemetryDivider />
                
                <TelemetryCol>
                  <TelemetryLabel>Avg Speed</TelemetryLabel>
                  <TelemetryValue>
                    {walkStats.speed} <span className="unit">m/s</span>
                  </TelemetryValue>
                </TelemetryCol>
              </TelemetryStatsGrid>

              {walkCoordinates.length > 0 && (
                <>
                  <TelemetryDivider />
                  <HistoryClearButton 
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your current walking history? This cannot be undone.")) {
                        clearWalkHistory();
                      }
                    }}
                    title="Clear history logs"
                  >
                    Clear
                  </HistoryClearButton>
                </>
              )}
            </TelemetryHUDOverlay>
          )}

          {/* GPS coordinates text display at bottom */}
          <CoordinatesDisplay>
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>
              {userGps[0].toFixed(6)}, {userGps[1].toFixed(6)}
              {gpsAccuracy !== null && ` • Accuracy: ${Math.round(gpsAccuracy)}m`}
              {gpsStatus !== 'locked' && ' (Searching for strong GPS lock)'}
            </span>
          </CoordinatesDisplay>
        </MapWrapper>
      </MapContainer>
    </SplitWrapper>
  );
}
