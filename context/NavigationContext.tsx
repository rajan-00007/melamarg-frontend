'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { POIItem, NodeItem, getHaversineDistance, getCompassBearing, findOptimalEntranceNode, DijkstraRouter } from './types';
import { useGps } from './GpsContext';
import { useMapData } from './MapDataContext';

export interface NavigationStats {
  distance: number;
  time: number;
  bearing: number;
  directionText: string;
  isOffRoute: boolean;
  pathNodes: NodeItem[];
  targetNodeName: string;
  waypointLat: number;
  waypointLng: number;
  offRouteDistance?: number;
  offRouteDirectionText?: string;
}

export interface NavigationContextType {
  stats: NavigationStats;
  navTarget: POIItem | null;
  setNavTarget: React.Dispatch<React.SetStateAction<POIItem | null>>;
  deviceHeading: number;
  setDeviceHeading: React.Dispatch<React.SetStateAction<number>>;
  isWalking: boolean;
  setIsWalking: React.Dispatch<React.SetStateAction<boolean>>;
  arrivalNotify: boolean;
  setArrivalNotify: React.Dispatch<React.SetStateAction<boolean>>;
  computeNavigationStats: (currentLat: number, currentLng: number) => NavigationStats;
  getNavigationStats: () => NavigationStats;
  handleSimulateWalking: () => void;
  logNavigationInstructions: (poi: POIItem) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const { userGps, setUserGps } = useGps();
  const { routeNodes, routeEdges, activeAdvisories } = useMapData();

  const [navTarget, setNavTarget] = useState<POIItem | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [arrivalNotify, setArrivalNotify] = useState(false);

  // Listen to device orientation absolute/relative sensors to update deviceHeading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientation = (e: any) => {
      if (e.webkitCompassHeading !== undefined) {
        setDeviceHeading(Math.round(e.webkitCompassHeading));
      } else if (e.alpha !== null && e.alpha !== undefined) {
        const heading = (360 - e.alpha) % 360;
        setDeviceHeading(Math.round(heading));
      }
    };

    if ('ondeviceorientationabsolute' in (window as any)) {
      (window as any).addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else {
      (window as any).addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if ('ondeviceorientationabsolute' in (window as any)) {
        (window as any).removeEventListener('deviceorientationabsolute', handleOrientation, true);
      } else {
        (window as any).removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const computeNavigationStats = useCallback((currentLat: number, currentLng: number) => {
    if (!navTarget) {
      return { 
        distance: 0, 
        time: 0, 
        bearing: 0, 
        directionText: 'STRAIGHT', 
        isOffRoute: false, 
        pathNodes: [] as NodeItem[], 
        targetNodeName: '',
        waypointLat: 0,
        waypointLng: 0
      };
    }

    if (routeNodes.length === 0) {
      const dist = getHaversineDistance(currentLat, currentLng, navTarget.latitude, navTarget.longitude);
      const bearing = getCompassBearing(currentLat, currentLng, navTarget.latitude, navTarget.longitude);
      let relativeAngle = (bearing - deviceHeading + 360) % 360;
      let directionText = 'STRAIGHT';
      if (relativeAngle > 45 && relativeAngle <= 135) directionText = 'TURN RIGHT';
      else if (relativeAngle > 135 && relativeAngle <= 225) directionText = 'TURN AROUND';
      else if (relativeAngle > 225 && relativeAngle <= 315) directionText = 'TURN LEFT';

      return {
        distance: Math.round(dist),
        time: Math.max(1, Math.round(dist / 80)),
        bearing,
        directionText,
        isOffRoute: true,
        pathNodes: [] as NodeItem[],
        targetNodeName: navTarget.name_en,
        waypointLat: navTarget.latitude,
        waypointLng: navTarget.longitude
      };
    }

    let destNode = routeNodes.find(n => n.poi_id === navTarget.id);
    
    if (!destNode) {
      let minPoiDist = Infinity;
      routeNodes.forEach(node => {
        const dist = getHaversineDistance(navTarget.latitude, navTarget.longitude, node.latitude, node.longitude);
        if (dist < minPoiDist) {
          minPoiDist = dist;
          destNode = node;
        }
      });
    }

    if (!destNode) {
      destNode = routeNodes[0];
    }

    const advisoriesToUse = (navTarget && (navTarget.id === 'saved-spot-nav' || navTarget.category_name === 'Saved Spot')) ? [] : activeAdvisories;

    const { nearestNodeToUser, minUserDist } = findOptimalEntranceNode(
      currentLat,
      currentLng,
      destNode,
      routeNodes,
      routeEdges,
      advisoriesToUse
    );

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id, advisoriesToUse);
    
    // Check if user is off route by calculating distance to path segments
    let isOffRoute = true;
    let minOffRouteDist = Infinity;
    let minOffRouteX = 0;
    let minOffRouteY = 0;

    if (path && path.length > 1) {
      const pLat = currentLat;
      const pLng = currentLng;
      const latFactor = 111320;
      const lngFactor = 111320 * Math.cos(pLat * Math.PI / 180);
      const px = pLng * lngFactor;
      const py = pLat * latFactor;

      for (let i = 0; i < path.length - 1; i++) {
        const ax = Number(path[i].longitude) * lngFactor;
        const ay = Number(path[i].latitude) * latFactor;
        const bx = Number(path[i+1].longitude) * lngFactor;
        const by = Number(path[i+1].latitude) * latFactor;
        
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
        
        if (dist < minOffRouteDist) {
          minOffRouteDist = dist;
          minOffRouteX = projX / lngFactor;
          minOffRouteY = projY / latFactor;
        }
      }
      
      if (minOffRouteDist <= 15) {
        isOffRoute = false;
      }
    } else {
      minOffRouteDist = minUserDist;
      minOffRouteX = nearestNodeToUser.longitude;
      minOffRouteY = nearestNodeToUser.latitude;
      isOffRoute = minUserDist > 15;
    }

    let offRouteDistance = 0;
    let offRouteDirectionText = '';

    if (isOffRoute && minOffRouteDist !== Infinity) {
      offRouteDistance = Math.round(minOffRouteDist);
      const y = Math.sin((minOffRouteX - currentLng) * Math.PI / 180) * Math.cos(minOffRouteY * Math.PI / 180);
      const x = Math.cos(currentLat * Math.PI / 180) * Math.sin(minOffRouteY * Math.PI / 180) -
                Math.sin(currentLat * Math.PI / 180) * Math.cos(minOffRouteY * Math.PI / 180) * Math.cos((minOffRouteX - currentLng) * Math.PI / 180);
      const bearingOff = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      
      const relativeAngle = (bearingOff - deviceHeading + 360) % 360;
      if (relativeAngle > 45 && relativeAngle <= 135) offRouteDirectionText = 'Right ➔';
      else if (relativeAngle > 135 && relativeAngle <= 225) offRouteDirectionText = 'Around ⬇';
      else if (relativeAngle > 225 && relativeAngle <= 315) offRouteDirectionText = 'Left ⬅';
      else offRouteDirectionText = 'Straight ⬆';
    }

    if (!path || path.length === 0) {
      const dist = getHaversineDistance(currentLat, currentLng, navTarget.latitude, navTarget.longitude);
      const bearing = getCompassBearing(currentLat, currentLng, navTarget.latitude, navTarget.longitude);
      
      let relativeAngle = (bearing - deviceHeading + 360) % 360;
      let directionText = 'STRAIGHT';
      if (relativeAngle > 45 && relativeAngle <= 135) directionText = 'TURN RIGHT';
      else if (relativeAngle > 135 && relativeAngle <= 225) directionText = 'TURN AROUND';
      else if (relativeAngle > 225 && relativeAngle <= 315) directionText = 'TURN LEFT';

      return {
        distance: Math.round(dist),
        time: Math.max(1, Math.round(dist / 80)),
        bearing,
        directionText,
        isOffRoute: true,
        pathNodes: [] as NodeItem[],
        targetNodeName: navTarget.name_en,
        waypointLat: navTarget.latitude,
        waypointLng: navTarget.longitude
      };
    }

    let pathDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      pathDistance += getHaversineDistance(
        path[i].latitude,
        path[i].longitude,
        path[i+1].latitude,
        path[i+1].longitude
      );
    }

    const distToStart = minUserDist;
    const distFromEndToPoi = getHaversineDistance(destNode.latitude, destNode.longitude, navTarget.latitude, navTarget.longitude);

    let totalDistance = 0;
    let nextWaypoint: NodeItem = nearestNodeToUser;
    let targetNodeName = '';

    if (isOffRoute) {
      nextWaypoint = nearestNodeToUser;
      totalDistance = distToStart + pathDistance + distFromEndToPoi;
      targetNodeName = `${nearestNodeToUser.name || 'Entry Node'} (Join Route)`;
    } else {
      if (path.length > 1) {
        if (distToStart <= 5) {
          nextWaypoint = path[1];
          const distToNext = getHaversineDistance(currentLat, currentLng, path[1].latitude, path[1].longitude);
          let remainingPathDist = 0;
          for (let i = 1; i < path.length - 1; i++) {
            remainingPathDist += getHaversineDistance(
              path[i].latitude,
              path[i].longitude,
              path[i+1].latitude,
              path[i+1].longitude
            );
          }
          totalDistance = distToNext + remainingPathDist + distFromEndToPoi;
          targetNodeName = path[1].name || 'Next Waypoint';
        } else {
          nextWaypoint = nearestNodeToUser;
          totalDistance = distToStart + pathDistance + distFromEndToPoi;
          targetNodeName = nearestNodeToUser.name || 'Current Node';
        }
      } else {
        nextWaypoint = destNode;
        totalDistance = distToStart + distFromEndToPoi;
        targetNodeName = navTarget.name_en;
      }
    }

    const bearing = getCompassBearing(currentLat, currentLng, nextWaypoint.latitude, nextWaypoint.longitude);
    let relativeAngle = (bearing - deviceHeading + 360) % 360;
    let directionText = 'STRAIGHT';
    if (relativeAngle > 45 && relativeAngle <= 135) directionText = 'TURN RIGHT';
    else if (relativeAngle > 135 && relativeAngle <= 225) directionText = 'TURN AROUND';
    else if (relativeAngle > 225 && relativeAngle <= 315) directionText = 'TURN LEFT';

    return {
      distance: Math.max(1, Math.round(totalDistance)),
      time: Math.max(1, Math.round(totalDistance / 1.4)),
      bearing,
      directionText,
      isOffRoute,
      pathNodes: path,
      targetNodeName,
      waypointLat: nextWaypoint.latitude,
      waypointLng: nextWaypoint.longitude,
      offRouteDistance,
      offRouteDirectionText
    };
  }, [navTarget, routeNodes, deviceHeading]);

  const stats = computeNavigationStats(userGps[0], userGps[1]);

  const getNavigationStats = useCallback(() => {
    return computeNavigationStats(userGps[0], userGps[1]);
  }, [userGps, computeNavigationStats]);

  const handleSimulateWalking = () => {
    if (!navTarget || isWalking) return;
    setIsWalking(true);
    setArrivalNotify(false);

    let lat = userGps[0];
    let lng = userGps[1];

    const walker = setInterval(() => {
      const currentStats = computeNavigationStats(lat, lng);
      const totalDist = getHaversineDistance(lat, lng, navTarget.latitude, navTarget.longitude);
      
      if (totalDist < 4) {
        clearInterval(walker);
        setUserGps([navTarget.latitude, navTarget.longitude]);
        setIsWalking(false);
        setArrivalNotify(true);
      } else {
        const wLat = currentStats.waypointLat;
        const wLng = currentStats.waypointLng;
        const nextHeading = getCompassBearing(lat, lng, wLat, wLng);
        setDeviceHeading(nextHeading);
        const bearingRad = (nextHeading * Math.PI) / 180;
        const earthRadius = 6371e3;
        const walkStep = 5;

        const phi1 = (lat * Math.PI) / 180;
        const lambda1 = (lng * Math.PI) / 180;

        const phi2 = Math.asin(
          Math.sin(phi1) * Math.cos(walkStep / earthRadius) +
            Math.cos(phi1) * Math.sin(walkStep / earthRadius) * Math.cos(bearingRad)
        );
        const lambda2 =
          lambda1 +
          Math.atan2(
            Math.sin(bearingRad) * Math.sin(walkStep / earthRadius) * Math.cos(phi1),
            Math.cos(walkStep / earthRadius) - Math.sin(phi1) * Math.sin(phi2)
          );

        lat = (phi2 * 180) / Math.PI;
        lng = (lambda2 * 180) / Math.PI;
        setUserGps([lat, lng]);
      }
    }, 450);
  };

  const logNavigationInstructions = useCallback((poi: POIItem) => {
    if (routeNodes.length === 0) {
      console.log(`${Math.round(getHaversineDistance(userGps[0], userGps[1], poi.latitude, poi.longitude))}m straight to ${poi.name_en}`);
      return;
    }

    let destNode = routeNodes.find(n => n.poi_id === poi.id);
    if (!destNode) {
      let minPoiDist = Infinity;
      routeNodes.forEach(node => {
        const dist = getHaversineDistance(poi.latitude, poi.longitude, node.latitude, node.longitude);
        if (dist < minPoiDist) {
          minPoiDist = dist;
          destNode = node;
        }
      });
    }
    if (!destNode) destNode = routeNodes[0];

    const advisoriesToUse = (poi && (poi.id === 'saved-spot-nav' || poi.category_name === 'Saved Spot')) ? [] : activeAdvisories;

    const { nearestNodeToUser, minUserDist } = findOptimalEntranceNode(
      userGps[0],
      userGps[1],
      destNode,
      routeNodes,
      routeEdges,
      advisoriesToUse
    );

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id, advisoriesToUse);
    
    console.log(`\n=== NAVIGATION INSTRUCTIONS TO ${poi.name_en.toUpperCase()} ===`);
    if (minUserDist > 15) {
      console.log(`Walk ${Math.round(minUserDist)}m straight to join route at [${nearestNodeToUser.name}]`);
    }

    if (path && path.length > 1) {
      for (let i = 0; i < path.length - 1; i++) {
        const dist = getHaversineDistance(path[i].latitude, path[i].longitude, path[i+1].latitude, path[i+1].longitude);
        
        let turnStr = "";
        if (i < path.length - 2) {
          const b1 = getCompassBearing(path[i].latitude, path[i].longitude, path[i+1].latitude, path[i+1].longitude);
          const b2 = getCompassBearing(path[i+1].latitude, path[i+1].longitude, path[i+2].latitude, path[i+2].longitude);
          const relative = (b2 - b1 + 360) % 360;
          if (relative > 45 && relative <= 135) turnStr = ", then turn RIGHT";
          else if (relative > 225 && relative <= 315) turnStr = ", then turn LEFT";
          else if (relative > 135 && relative <= 225) turnStr = ", then turn AROUND";
        }
        
        console.log(`${Math.round(dist)}m straight to [${path[i+1].name}]${turnStr}`);
      }
    }

    const distEnd = getHaversineDistance(destNode.latitude, destNode.longitude, poi.latitude, poi.longitude);
    if (distEnd > 2) {
      console.log(`Walk final ${Math.round(distEnd)}m to ${poi.name_en}`);
    } else {
      console.log(`Arrived at ${poi.name_en}`);
    }
    console.log(`========================================================\n`);
  }, [userGps, routeNodes]);

  return (
    <NavigationContext.Provider
      value={{
        stats,
        navTarget,
        setNavTarget,
        deviceHeading,
        setDeviceHeading,
        isWalking,
        setIsWalking,
        arrivalNotify,
        setArrivalNotify,
        computeNavigationStats,
        getNavigationStats,
        handleSimulateWalking,
        logNavigationInstructions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
