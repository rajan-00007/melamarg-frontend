'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { PushNotifications } from '@capacitor/push-notifications';
import { App } from '@capacitor/app';
import axiosClient from '@/lib/axios/axiosClient';
import { API_ENDPOINTS } from '@/lib/axios/endpoints';
import { getWebFcmToken, getFirebaseApp } from '@/lib/firebase';
import { getMessaging, onMessage } from 'firebase/messaging';

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  status: string;
  bundle_version: number;
  current_bundle_id?: string;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  center_lat?: number;
  center_lng?: number;
  bundle_url?: string;
  bundle_size?: number;
}

export interface POIItem {
  id: string;
  name_en: string;
  name_hi?: string;
  name_or?: string;
  latitude: number;
  longitude: number;
  category_name: string;
  category_id?: string;
  description?: string;
  distance?: number;
  time?: number;
}

export interface NodeItem {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  node_type?: string;
  poi_id?: string | null;
  is_entrance?: boolean;
}

export interface EdgeItem {
  id?: string;
  start_node_id: string;
  end_node_id: string;
}

// Dijkstra Shortest Path Router for route graph pathfinding
export class DijkstraRouter {
  static findShortestPath(
    nodes: NodeItem[],
    edges: EdgeItem[],
    startNodeId: string,
    endNodeId: string
  ): NodeItem[] | null {
    if (startNodeId === endNodeId) {
      const node = nodes.find(n => n.id === startNodeId);
      return node ? [node] : null;
    }

    const graph: { [key: string]: { node: NodeItem; neighbors: { targetId: string; distance: number }[] } } = {};
    
    nodes.forEach(node => {
      graph[node.id] = { node, neighbors: [] };
    });

    const getDistance = (n1: NodeItem, n2: NodeItem) => {
      const R = 6371e3; // Earth radius in meters
      const toRad = (d: number) => (d * Math.PI) / 180;
      const dLat = toRad(n2.latitude - n1.latitude);
      const dLng = toRad(n2.longitude - n1.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(n1.latitude)) *
          Math.cos(toRad(n2.latitude)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    edges.forEach(edge => {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;

      if (graph[startId] && graph[endId]) {
        const dist = getDistance(graph[startId].node, graph[endId].node);
        graph[startId].neighbors.push({ targetId: endId, distance: dist });
        graph[endId].neighbors.push({ targetId: startId, distance: dist });
      }
    });

    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    if (distances[startNodeId] === undefined || distances[endNodeId] === undefined) {
      return null;
    }

    distances[startNodeId] = 0;

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

      if (currentNodeId === endNodeId) {
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

    if (distances[endNodeId] === Infinity) {
      return null;
    }

    const pathIds: string[] = [];
    let curr: string | null = endNodeId;
    while (curr !== null) {
      pathIds.push(curr);
      curr = previous[curr];
    }
    pathIds.reverse();

    return pathIds.map(id => graph[id].node);
  }
}

// Fallback Mock Events in case API is disconnected or empty
export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'mock-rath-yatra',
    name: 'RATH YATRA 2025 - PURI',
    slug: 'rath-yatra-2025',
    description: 'Annual chariot festival of Lord Jagannath in Puri, Odisha. Includes sectors for Grand Road, Beach Road, and key transit points.',
    status: 'published',
    bundle_version: 2,
    current_bundle_id: 'bundle-abc-123',
    north: 19.8150,
    south: 19.7950,
    east: 85.8350,
    west: 85.8150,
    center_lat: 19.8050,
    center_lng: 85.8250,
  },
  {
    id: 'mock-kumbh-mela',
    name: 'KUMBH MELA 2025 - PRAYAGRAJ',
    slug: 'kumbh-mela-2025',
    description: 'Mass bathing festival at the Sangam confluence of rivers in Prayagraj. Offline zones cover Sector 1 to 5, bathing ghats, and police help centers.',
    status: 'published',
    bundle_version: 1,
    current_bundle_id: 'bundle-kumbh-456',
    north: 25.4350,
    south: 25.4150,
    east: 81.8950,
    west: 81.8750,
    center_lat: 25.4250,
    center_lng: 81.8850,
  },
  {
    id: 'mock-thrissur-pooram',
    name: 'THRISSUR POORAM 2026',
    slug: 'thrissur-pooram-2026',
    description: 'Grand temple festival of Kerala featuring elephant processions, traditional music, and fireworks at Vadakkunnathan Temple, Thrissur.',
    status: 'published',
    bundle_version: 3,
    current_bundle_id: 'bundle-pooram-789',
    north: 10.5340,
    south: 10.5140,
    east: 76.2240,
    west: 76.2040,
    center_lat: 10.5244,
    center_lng: 76.2144,
  }
];

export const MOCK_POIS: POIItem[] = [
  { id: 'poi-1', name_en: 'Toilet Block — Gate 4', latitude: 19.8056, longitude: 85.8194, category_name: 'toilet', description: 'Open • Male & Female' },
];

export const MOCK_NODES: NodeItem[] = [
  { id: 'n1', latitude: 19.8048, longitude: 85.8188, name: 'Main Gate' },
  { id: 'n2', latitude: 19.8055, longitude: 85.8208, name: 'Water Booth' },
  { id: 'n3', latitude: 19.8068, longitude: 85.8240, name: 'Transit Center' },
  { id: 'n4', latitude: 19.8080, longitude: 85.8276, name: 'Sector 3' },
  { id: 'n5', latitude: 19.8099, longitude: 85.8335, name: 'Chariot Stand' },
];

export const MOCK_EDGES: EdgeItem[] = [
  { start_node_id: 'n1', end_node_id: 'n2' },
  { start_node_id: 'n2', end_node_id: 'n3' },
  { start_node_id: 'n3', end_node_id: 'n4' },
  { start_node_id: 'n4', end_node_id: 'n5' },
];

export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

export function getCompassBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

export function findOptimalEntranceNode(
  userLat: number,
  userLng: number,
  destNode: NodeItem,
  nodes: NodeItem[],
  edges: EdgeItem[]
): { nearestNodeToUser: NodeItem; minUserDist: number } {
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
}

const sanitizeBackendUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/+$/, '');
  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    cleaned = 'http://' + cleaned;
  }
  return cleaned;
};

interface UserTestContextType {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  detectedIpPreset: string | null;
  usbTetheringPreset: string | null;
  offlineMode: boolean;
  setOfflineMode: (mode: boolean) => void;
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  loadingEvents: boolean;
  loadingMapData: boolean;
  downloadedEventIds: string[];
  setDownloadedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  apiError: boolean;
  setApiError: (val: boolean) => void;
  platformName: string;
  selectedEvent: EventItem | null;
  setSelectedEvent: (event: EventItem | null) => void;
  screenMode: 'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation';
  setScreenMode: (mode: 'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation') => void;
  downloadProgress: number;
  setDownloadProgress: React.Dispatch<React.SetStateAction<number>>;
  locationPermission: boolean | null;
  setLocationPermission: React.Dispatch<React.SetStateAction<boolean | null>>;
  userGps: [number, number];
  setUserGps: React.Dispatch<React.SetStateAction<[number, number]>>;
  gpsAccuracy: number | null;
  gpsStatus: 'searching' | 'locked' | 'lost';
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  poisList: POIItem[];
  routeNodes: NodeItem[];
  routeEdges: EdgeItem[];
  leafletLoaded: boolean;
  setLeafletLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  navTarget: POIItem | null;
  setNavTarget: (poi: POIItem | null) => void;
  deviceHeading: number;
  setDeviceHeading: React.Dispatch<React.SetStateAction<number>>;
  isWalking: boolean;
  setIsWalking: React.Dispatch<React.SetStateAction<boolean>>;
  arrivalNotify: boolean;
  setArrivalNotify: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: any[];
  dismissedNotificationIds: string[];
  setDismissedNotificationIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeToasts: any[];
  dismissToast: (id: string) => void;
  triggerToast: (alertItem: any) => void;
  getOfflineEvents: (downloadedIds: string[]) => EventItem[];
  fetchEventsCatalog: () => Promise<void>;
  handleEventSelection: (event: EventItem) => Promise<void>;
  triggerExplicitRedownload: (event: EventItem, e: React.MouseEvent) => void;
  clearDownloadedCache: () => void;
  handleGrantPermission: (granted: boolean) => Promise<void>;
  loadEventPoisAndGraph: (event: EventItem) => Promise<void>;
  getCategoryStats: (cat: string) => number;
  getSortedPois: () => POIItem[];
  computeNavigationStats: (currentLat: number, currentLng: number) => any;
  getNavigationStats: () => any;
  handleSimulateWalking: () => void;
  logNavigationInstructions: (poi: POIItem) => void;
  getRealGps: () => Promise<[number, number] | null>;
  handleGpsUpdate: (pos: any) => void;
  startGpsWatch: () => Promise<void>;
  stopGpsWatch: () => void;
  registerPushNotifications: (eventId: string) => Promise<void>;
}

const UserTestContext = createContext<UserTestContextType | undefined>(undefined);

export function UserTestProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrlState] = useState(
    sanitizeBackendUrl(process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co')
  );
  const [detectedIpPreset, setDetectedIpPreset] = useState<string | null>(null);
  const [usbTetheringPreset, setUsbTetheringPreset] = useState<string | null>(null);
  const [offlineMode, setOfflineMode] = useState(false);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingMapData, setLoadingMapData] = useState(false);
  const [downloadedEventIds, setDownloadedEventIds] = useState<string[]>([]);
  const [apiError, setApiError] = useState(false);
  const [platformName, setPlatformName] = useState<string>('web');
  
  const [screenMode, setScreenMode] = useState<'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation'>('selector');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userGps, setUserGps] = useState<[number, number]>([19.8050, 85.8250]); // Puri Center
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'searching' | 'locked' | 'lost'>('searching');
  const [activeCategory, setActiveCategory] = useState<string>('toilet');
  const [poisList, setPoisList] = useState<POIItem[]>([]);
  const [routeNodes, setRouteNodes] = useState<NodeItem[]>([]);
  const [routeEdges, setRouteEdges] = useState<EdgeItem[]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  // Load Leaflet dynamically on mount of the context provider
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeafletScript = async () => {
      if ((window as any).L) {
        setLeafletLoaded(true);
        return;
      }
      
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/leaflet/leaflet.css';
        document.head.appendChild(link);
      }

      if (!document.querySelector('script[src*="leaflet.js"]')) {
        const script = document.createElement('script');
        script.src = '/leaflet/leaflet.js';
        script.async = true;
        script.onload = () => {
          setLeafletLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).L) {
            clearInterval(checkInterval);
            setLeafletLoaded(true);
          }
        }, 100);
      }
    };

    loadLeafletScript();
  }, []);

  // Listen to device orientation absolute/relative sensors to update deviceHeading
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOrientation = (e: any) => {
      // iOS Compass Heading (Absolute 0-360 degrees)
      if (e.webkitCompassHeading !== undefined) {
        setDeviceHeading(Math.round(e.webkitCompassHeading));
      } 
      // Android / absolute standard (0-360 degrees)
      else if (e.alpha !== null && e.alpha !== undefined) {
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
  
  
  const [navTarget, setNavTarget] = useState<POIItem | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [isWalking, setIsWalking] = useState(false);
  const [arrivalNotify, setArrivalNotify] = useState(false);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [activeToasts, setActiveToasts] = useState<any[]>([]);

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);
  const registeredEventIdRef = useRef<string | null>(null);
  const gpsWatchRef = useRef<any>(null);
  const urlReady = useRef(false);
  const [urlReadySignal, setUrlReadySignal] = useState(0);

  const setBackendUrl = (url: string) => {
    const sanitized = sanitizeBackendUrl(url);
    setBackendUrlState(sanitized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_test_backend_url', sanitized);
    }
  };

  const getOfflineEvents = useCallback((downloadedIds: string[]): EventItem[] => {
    const allKnown = [...MOCK_EVENTS];
    if (typeof window !== 'undefined') {
      const cachedStr = localStorage.getItem('mm_cached_events');
      if (cachedStr) {
        try {
          const cached = JSON.parse(cachedStr);
          if (Array.isArray(cached)) {
            cached.forEach((ce: EventItem) => {
              if (!allKnown.some(ae => ae.id === ce.id)) {
                allKnown.push(ce);
              }
            });
          }
        } catch (e) {
          console.error('Failed to parse cached events:', e);
        }
      }
    }
    return allKnown.filter(e => downloadedIds.includes(e.id));
  }, []);

  const triggerToast = useCallback((alertItem: any) => {
    setActiveToasts(prev => {
      if (prev.some(t => t.id === alertItem.id)) return prev;
      return [...prev, alertItem];
    });
    
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== alertItem.id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch events on start or mode change
  const fetchEventsCatalog = useCallback(async () => {
    setLoadingEvents(true);
    setApiError(false);
    console.log('[fetchEventsCatalog] Fetching events via axiosClient...');
    try {
      const res = await axiosClient.get(API_ENDPOINTS.events.base);
      const json = res.data;
      if (json && json.success && Array.isArray(json.data)) {
        const backendEvents = json.data;
        if (backendEvents.length > 0) {
          setEvents(backendEvents);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mm_cached_events', JSON.stringify(backendEvents));
          }
        } else {
          setEvents(MOCK_EVENTS);
        }
      } else {
        throw new Error('Fallback empty list');
      }
    } catch (err) {
      console.log('Unable to reach server. Displaying cached downloaded events.', err);
      setApiError(true);
      setEvents(getOfflineEvents(downloadedEventIds));
    } finally {
      setLoadingEvents(false);
    }
  }, [downloadedEventIds, getOfflineEvents]);

  // Load POIs and Walk Nodes from backend (Online) or Mock values (Offline)
  const loadEventPoisAndGraph = useCallback(async (event: EventItem) => {
    if (!event) return;

    setLoadingMapData(true);
    try {
      const isMock = event.id.startsWith('mock-');
      let loadedPois = isMock ? MOCK_POIS : [];
      let loadedNodes = isMock ? MOCK_NODES : [];
      let loadedEdges = isMock ? MOCK_EDGES : [];
      let hasLocalCache = false;

      if (typeof window !== 'undefined') {
        const cachedPois = localStorage.getItem(`mm_offline_pois_${event.id}`);
        const cachedRoutes = localStorage.getItem(`mm_offline_routes_${event.id}`);
        if (cachedPois && cachedRoutes) {
          try {
            loadedPois = JSON.parse(cachedPois);
            const routeData = JSON.parse(cachedRoutes);
            if (routeData.nodes) loadedNodes = routeData.nodes;
            if (routeData.edges) loadedEdges = routeData.edges;
            hasLocalCache = true;
            console.log(`[Offline Cache] Loaded ${loadedPois.length} POIs and route graph from local storage for event ${event.id}`);
          } catch (e) {
            console.error('Failed to parse offline cache:', e);
          }
        }
      }

      // Set cached data immediately so UI isn't empty during network fetch
      setPoisList(loadedPois);
      setRouteNodes(loadedNodes);
      setRouteEdges(loadedEdges);

      if (!offlineMode) {
        try {
          console.log(`[Fetch] Fetching latest map data from server for event ${event.id}...`);
          let pDataFetched = false;
          let rDataFetched = false;
          let newPois = loadedPois;
          let newNodes = loadedNodes;
          let newEdges = loadedEdges;

          try {
            const pRes = await axiosClient.get(API_ENDPOINTS.events.pois(event.id));
            const pJson = pRes.data;
            if (pJson.success && Array.isArray(pJson.data)) {
              newPois = pJson.data;
              pDataFetched = true;
            }
          } catch (e) {
            console.warn('[Fetch] POIs fetch failed:', e);
          }

          try {
            const rRes = await axiosClient.get(API_ENDPOINTS.events.routes(event.id));
            const rJson = rRes.data;
            if ((rJson.status === 'success' || rJson.success) && rJson.data) {
              if (Array.isArray(rJson.data.nodes)) {
                newNodes = rJson.data.nodes;
                rDataFetched = true;
              }
              if (Array.isArray(rJson.data.edges)) {
                newEdges = rJson.data.edges;
              }
            }
          } catch (e) {
            console.warn('[Fetch] Routes fetch failed:', e);
          }

          if (pDataFetched || rDataFetched) {
            loadedPois = newPois;
            loadedNodes = newNodes;
            loadedEdges = newEdges;
            hasLocalCache = true;
            
            if (typeof window !== 'undefined') {
              localStorage.setItem(`mm_offline_pois_${event.id}`, JSON.stringify(newPois));
              localStorage.setItem(`mm_offline_routes_${event.id}`, JSON.stringify({ nodes: newNodes, edges: newEdges }));
              console.log(`[Offline Cache] Updated offline cache in storage for event ${event.id}`);
            }
          }
        } catch (err) {
          console.log('Unable to fetch latest server data. Using offline local cached files or mock.', err);
        }
      }

      if (!hasLocalCache && event.id.startsWith('mock-') && event.center_lat && event.center_lng) {
        const baseEvent = MOCK_EVENTS[0];
        const latOffset = event.center_lat - baseEvent.center_lat!;
        const lngOffset = event.center_lng - baseEvent.center_lng!;

        loadedPois = loadedPois.map((p) => ({
          ...p,
          latitude: p.latitude + latOffset,
          longitude: p.longitude + lngOffset
        }));

        loadedNodes = loadedNodes.map((n) => ({
          ...n,
          latitude: n.latitude + latOffset,
          longitude: n.longitude + lngOffset
        }));

        if (typeof window !== 'undefined') {
          localStorage.setItem(`mm_offline_pois_${event.id}`, JSON.stringify(loadedPois));
          localStorage.setItem(`mm_offline_routes_${event.id}`, JSON.stringify({ nodes: loadedNodes, edges: loadedEdges }));
        }
      }

      setPoisList(loadedPois);
      setRouteNodes(loadedNodes);
      setRouteEdges(loadedEdges);
    } finally {
      setLoadingMapData(false);
    }
  }, [offlineMode]);

  // Real GPS positioning logic (Google Maps style 2-stage)
  const getRealGps = useCallback(async (): Promise<[number, number] | null> => {
    const getBrowserPosition = (opts: PositionOptions): Promise<[number, number] | null> =>
      new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log(`[GPS] Got fix via ${opts.enableHighAccuracy ? 'GPS chip' : 'network/WiFi'}: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} ± ${Math.round(pos.coords.accuracy)}m`);
            resolve([pos.coords.latitude, pos.coords.longitude]);
          },
          (err) => {
            console.warn(`[GPS] ${opts.enableHighAccuracy ? 'GPS chip' : 'Network'} fix failed (code ${err.code}): ${err.message}`);
            resolve(null);
          },
          opts
        );
      });

    try {
      const cap = (window as any).Capacitor;
      const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();

      if (isNative) {
        try {
          // Pass a very large maximumAge so the Android OS will return its last known location 
          // (which is what Google Maps uses when offline and indoors)
          const pos = await Geolocation.getCurrentPosition({
            enableHighAccuracy: false,
            maximumAge: 86400000, // 24 hours
            timeout: 10000,
          });
          if (pos?.coords) {
            console.log(`[GPS] Native fast fix: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)} ± ${Math.round(pos.coords.accuracy)}m`);
            return [pos.coords.latitude, pos.coords.longitude];
          }
        } catch (_) {
          console.warn('[GPS] Native fast fix failed, trying high-accuracy...');
        }
        
        // Give the GPS chip more time to get a lock indoors (30 seconds)
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 30000 });
        return [pos.coords.latitude, pos.coords.longitude];

      } else {
        if (typeof window !== 'undefined' && (!navigator || !navigator.geolocation)) {
          console.log('[GPS] navigator.geolocation is undefined. Check HTTP vs HTTPS security requirements.');
          return null;
        }

        const networkPos = await getBrowserPosition({
          enableHighAccuracy: false,
          maximumAge: 300000,
          timeout: 5000,
        });
        if (networkPos) return networkPos;

        console.warn('[GPS] Network location unavailable, trying GPS chip...');
        const gpsPos = await getBrowserPosition({
          enableHighAccuracy: true,
          maximumAge: 60000,
          timeout: 15000,
        });
        return gpsPos;
      }
    } catch (e) {
      console.warn('[GPS] All position methods failed:', e);
      return null;
    }
  }, []);

  const handleGpsUpdate = useCallback((pos: any) => {
    if (!pos || !pos.coords) return;
    const { latitude, longitude, accuracy } = pos.coords;
    
    setGpsAccuracy(accuracy !== undefined ? accuracy : null);

    const now = Date.now();
    const ageMs = pos.timestamp ? now - pos.timestamp : 0;
    
    // Log whether this is an OS cache or an actual current lock
    const source = ageMs > 5000 ? 'OS Cache (Last Known Location)' : 'Live Satellite (Actual Current)';
    console.log(`[GPS Monitor] Source: ${source} | Age: ${(ageMs / 1000).toFixed(1)}s | Acc: ${accuracy ? Math.round(accuracy) + 'm' : 'unknown'}`);

    // Accept OS cached locations up to 24 hours old so the offline fast-fix works indoors
    const isMapStale = pos.timestamp ? ageMs > 86400000 : false;
    if (isMapStale) {
      console.warn(`[GPS] Ignored extremely stale location: ${ageMs}ms old`);
      return;
    }

    let isNativePlatform = false;
    try {
      const cap = (window as any).Capacitor;
      isNativePlatform = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    } catch (e) {
      console.warn('Capacitor check failed', e);
    }

    const UNUSABLE_ACCURACY_LIMIT = isNativePlatform ? 2000 : 5000;
    if (accuracy !== undefined && accuracy > UNUSABLE_ACCURACY_LIMIT) {
      console.warn(`[GPS] Accuracy ${accuracy}m is completely unusable — skipping position update`);
      setGpsStatus('searching');
      return;
    }

    setUserGps([latitude, longitude]);

    // Increase accuracy limit to 1000m so cell-tower OS cache locks inside work and allow navigation to start
    const LOCK_ACCURACY_LIMIT = 1000;
    if (accuracy !== undefined && accuracy > LOCK_ACCURACY_LIMIT) {
      setGpsStatus('searching');
      return;
    }

    // Removed isNavStale so that older OS cache locations are still marked as 'locked'
    // and can be used for navigation right away.

    setGpsStatus('locked');
  }, []);

  const stopGpsWatch = useCallback(() => {
    try {
      if (gpsWatchRef.current !== null) {
        const cap = (window as any).Capacitor;
        const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
        if (isNative) {
          Geolocation.clearWatch({ id: gpsWatchRef.current });
        } else {
          navigator.geolocation.clearWatch(gpsWatchRef.current);
        }
        gpsWatchRef.current = null;
      }
    } catch (e) {
      console.warn('Error clearing watch:', e);
    }
  }, []);

  const startGpsWatch = useCallback(async () => {
    try {
      stopGpsWatch();
      setGpsStatus('searching');
      
      const cap = (window as any).Capacitor;
      const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
      
      if (isNative) {
        gpsWatchRef.current = await Geolocation.watchPosition(
          { enableHighAccuracy: true, timeout: 60000 },
          (pos, err) => {
            if (err) {
              console.warn('[GPS] Capacitor watch error:', err);
              if (err.code === 1 || (err.message && err.message.toLowerCase().includes('permission'))) {
                setGpsStatus('lost');
              } else {
                setGpsStatus('searching');
              }
              return;
            }
            if (pos) {
              handleGpsUpdate(pos);
            }
          }
        );
      } else if (navigator.geolocation) {
        gpsWatchRef.current = navigator.geolocation.watchPosition(
          (pos) => handleGpsUpdate(pos),
          (err) => {
            console.warn('[GPS] Browser watch error:', err);
            if (err.code === 1 || (err.message && err.message.toLowerCase().includes('permission'))) {
              setGpsStatus('lost');
            } else {
              setGpsStatus('searching');
            }
          },
          {
            enableHighAccuracy: true,
            maximumAge: 30000,
            timeout: 60000
          }
        );
      }
    } catch (e) {
      console.warn('GPS watch start failed:', e);
      setGpsStatus('lost');
    }
  }, [handleGpsUpdate, stopGpsWatch]);

  const initializeUserGps = useCallback(async (event: EventItem) => {
    try {
      const realPos = await getRealGps();
      if (realPos) {
        setUserGps(realPos);
        console.log('[GPS] Initialized user position from real device GPS:', realPos);
        return;
      }
    } catch (e) {
      console.warn('[GPS] Failed to get real position:', e);
    }

    if (event.center_lat && event.center_lng) {
      setUserGps([Number(event.center_lat), Number(event.center_lng)]);
      console.log('[GPS] Fallback to event center coordinates:', [event.center_lat, event.center_lng]);
    } else {
      setUserGps([19.8050, 85.8250]);
      console.log('[GPS] Fallback to default Puri coordinates');
    }
  }, [getRealGps]);

  const handleEventSelection = async (event: EventItem) => {
    setSelectedEvent(event);
    
    if (downloadedEventIds.includes(event.id)) {
      if (locationPermission === true) {
        await initializeUserGps(event);
        await loadEventPoisAndGraph(event);
        setScreenMode('home');
      } else {
        setScreenMode('permission');
      }
    } else {
      setScreenMode('downloading');
      setDownloadProgress(0);

      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(async () => {
              const updated = [...downloadedEventIds, event.id];
              setDownloadedEventIds(updated);
              localStorage.setItem('mm_downloaded_event_ids', JSON.stringify(updated));

              if (locationPermission === true) {
                await initializeUserGps(event);
                await loadEventPoisAndGraph(event);
                setScreenMode('home');
              } else {
                setScreenMode('permission');
              }
            }, 600);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }
  };

  const triggerExplicitRedownload = (event: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    
    const updated = downloadedEventIds.filter(id => id !== event.id);
    setDownloadedEventIds(updated);
    localStorage.setItem('mm_downloaded_event_ids', JSON.stringify(updated));

    setScreenMode('downloading');
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(async () => {
            const finalUpdated = [...updated, event.id];
            setDownloadedEventIds(finalUpdated);
            localStorage.setItem('mm_downloaded_event_ids', JSON.stringify(finalUpdated));

            if (locationPermission === true) {
              await initializeUserGps(event);
              await loadEventPoisAndGraph(event);
              setScreenMode('home');
            } else {
              setScreenMode('permission');
            }
          }, 600);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  const clearDownloadedCache = () => {
    if (typeof window !== 'undefined') {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('mm_offline_pois_') || key.startsWith('mm_offline_routes_'))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }
    setDownloadedEventIds([]);
    localStorage.removeItem('mm_downloaded_event_ids');
    localStorage.removeItem('mm_location_permission');
    setLocationPermission(null);
  };

  const handleGrantPermission = async (granted: boolean) => {
    let nativeGranted = granted;

    if (granted) {
      try {
        // iOS Device Orientation Permission Request
        const DeviceOrientationEventAny = (window as any).DeviceOrientationEvent;
        if (
          DeviceOrientationEventAny &&
          typeof DeviceOrientationEventAny.requestPermission === 'function'
        ) {
          await DeviceOrientationEventAny.requestPermission();
        }
      } catch (err) {
        console.warn('Failed to request DeviceOrientation permission:', err);
      }

      try {
        const cap = (window as any).Capacitor;
        const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
        if (isNative) {
          const perm = await Geolocation.requestPermissions();
          if (perm.coarseLocation !== 'granted' && perm.location !== 'granted') {
            nativeGranted = false;
          }
        }
      } catch (err) {
        console.warn('Failed to request native GPS permission:', err);
      }
    }

    setLocationPermission(nativeGranted);
    localStorage.setItem('mm_location_permission', nativeGranted ? 'granted' : 'denied');
    
    if (nativeGranted && selectedEvent) {
      await initializeUserGps(selectedEvent);
    }
    if (selectedEvent) {
      await loadEventPoisAndGraph(selectedEvent);
    }
    setScreenMode('home');
  };

  const getCategoryStats = (cat: string) => {
    const list = poisList.filter((p) => p.category_name?.toLowerCase().includes(cat.toLowerCase()));
    return list.length;
  };

  const getSortedPois = useCallback(() => {
    const filtered = poisList.filter((p) => p.category_name?.toLowerCase().includes(activeCategory.toLowerCase()));
    
    return filtered
      .map((p) => {
        const dist = getHaversineDistance(userGps[0], userGps[1], p.latitude, p.longitude);
        const time = Math.max(1, Math.round(dist / 80));
        return { ...p, distance: Math.round(dist), time };
      })
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [poisList, activeCategory, userGps]);

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

    const { nearestNodeToUser, minUserDist } = findOptimalEntranceNode(
      currentLat,
      currentLng,
      destNode,
      routeNodes,
      routeEdges
    );

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id);
    const isOffRoute = minUserDist > 15;

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
      waypointLng: nextWaypoint.longitude
    };
  }, [navTarget, routeNodes, routeEdges, deviceHeading]);

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

    const { nearestNodeToUser, minUserDist } = findOptimalEntranceNode(
      userGps[0],
      userGps[1],
      destNode,
      routeNodes,
      routeEdges
    );

    const path = DijkstraRouter.findShortestPath(routeNodes, routeEdges, nearestNodeToUser.id, destNode.id);
    
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
  }, [userGps, routeNodes, routeEdges]);

  // Capacitor native push notification registration
  const registerPushNotifications = useCallback(async (eventId: string) => {
    try {
      if (registeredEventIdRef.current === eventId) {
        return;
      }
      registeredEventIdRef.current = eventId;

      const cap = (window as any).Capacitor;
      const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
      if (!isNative) {
        console.log('[Push] Running on web platform. Initializing real Firebase Web Push.');
        
        try {
          const webToken = await getWebFcmToken();
          if (webToken) {
            console.log(`[Push] Real Web FCM token obtained: ${webToken}`);
            console.log('[Push] Registering token with backend via axiosClient...');
            const result = await axiosClient.post(API_ENDPOINTS.notifications.register, {
              eventId,
              fcmToken: webToken,
              platform: 'web'
            });
            if (result.data?.success) {
              console.log('[Push] Successfully registered Web push token with backend database.');
            } else {
              console.error('[Push] Failed to register Web push token with backend database:', result.data);
            }
          } else {
            console.warn('[Push] Could not obtain Web FCM token. Fallback may be required.');
          }
        } catch (err) {
          console.error('[Push] Error fetching or registering Web push token:', err);
        }
        
        return;
      }

      console.log('[Push] Initializing Push Notifications for event:', eventId);

      let permStatus = await PushNotifications.checkPermissions();
      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.warn('[Push] Push notifications permission was denied.');
        return;
      }

      await PushNotifications.register();
      console.log('[Push] Called PushNotifications.register() successfully.');

    } catch (err) {
      console.error('[Push] Failed to register push notifications:', err);
    }
  }, []);

  // Sync Push Notification lifecycles on event state changes
  useEffect(() => {
    if (selectedEvent) {
      registerPushNotifications(selectedEvent.id);
    }
  }, [selectedEvent, registerPushNotifications]);

  // Load storage details on start
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUrl = localStorage.getItem('mm_test_backend_url');
      const hostname = window.location.hostname;
      if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(hostname)) {
        setDetectedIpPreset(`http://${hostname}:5000`);
      }

      let isAndroid = false;
      let detectedPlatform = 'web';
      try {
        const cap = (window as any).Capacitor;
        if (cap && typeof cap.getPlatform === 'function') {
          detectedPlatform = cap.getPlatform();
          isAndroid = cap.isNativePlatform() && detectedPlatform === 'android';
        }
      } catch (e) {
        console.log('Capacitor bridge detection failed:', e);
      }
      setPlatformName(detectedPlatform);

      if (isAndroid) {
        const localIp = 'https://api-wp-events.infoviz.co';
        setUsbTetheringPreset(localIp);
        if (!savedUrl && !process.env.NEXT_PUBLIC_API_URL) {
          setBackendUrl(localIp);
        }
      }

      if (savedUrl) {
        setBackendUrl(savedUrl);
      } else if (process.env.NEXT_PUBLIC_API_URL) {
        setBackendUrl(process.env.NEXT_PUBLIC_API_URL);
      }

      urlReady.current = true;
      setUrlReadySignal(s => s + 1);

      const savedIds = localStorage.getItem('mm_downloaded_event_ids');
      if (savedIds) {
        try {
          setDownloadedEventIds(JSON.parse(savedIds));
        } catch(e) {
          console.error(e);
        }
      }

      const savedPermission = localStorage.getItem('mm_location_permission');
      if (savedPermission === 'granted') {
        const checkNativePermission = async () => {
          try {
            const cap = (window as any).Capacitor;
            const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
            if (isNative) {
              const perm = await Geolocation.checkPermissions();
              if (perm.coarseLocation === 'granted' || perm.location === 'granted') {
                setLocationPermission(true);
              } else {
                setLocationPermission(false);
                localStorage.setItem('mm_location_permission', 'denied');
              }
            } else {
              setLocationPermission(true);
            }
          } catch (e) {
            setLocationPermission(true);
          }
        };
        checkNativePermission();
      } else if (savedPermission === 'denied') {
        setLocationPermission(false);
      }
    }
  }, []);

  // Fetch events catalog loader hook
  useEffect(() => {
    if (!urlReady.current) return;
    if (!offlineMode) {
      fetchEventsCatalog();
    } else {
      setEvents(getOfflineEvents(downloadedEventIds));
    }
  }, [backendUrl, offlineMode, downloadedEventIds, getOfflineEvents, fetchEventsCatalog, urlReadySignal]);

  // Start/stop GPS watch continuously when inside an event and permission is granted
  useEffect(() => {
    if (locationPermission === true && screenMode !== 'selector') {
      startGpsWatch();
    } else {
      stopGpsWatch();
    }
    return () => stopGpsWatch();
  }, [locationPermission, screenMode, startGpsWatch, stopGpsWatch]);

  // App lifecycle watch (Capacitor background detection)
  useEffect(() => {
    const cap = (window as any).Capacitor;
    const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    let handler: any = null;

    if (isNative) {
      const setupAppListener = async () => {
        try {
          handler = await App.addListener('appStateChange', (state) => {
            if (state.isActive) {
              if (locationPermission === true && screenMode !== 'selector') {
                startGpsWatch();
              }
            } else {
              stopGpsWatch();
            }
          });
        } catch (e) {
          console.warn('Failed to setup Capacitor app lifecycle listener:', e);
        }
      };
      setupAppListener();
    }

    return () => {
      if (handler) {
        handler.remove();
      }
    };
  }, [locationPermission, screenMode, startGpsWatch, stopGpsWatch]);

  // Reset tracking states when selected event changes
  useEffect(() => {
    seenNotificationIdsRef.current.clear();
    isFirstLoadRef.current = true;
    registeredEventIdRef.current = null;
    setActiveToasts([]);
  }, [selectedEvent]);

  // Real-time Notifications live listener and history fetcher
  useEffect(() => {
    if (!selectedEvent) {
      setNotifications([]);
      return;
    }

    // 1. Fetch historical alerts feed (One-off)
    const fetchHistory = async () => {
      try {
        console.log(`[Push] Loading notification history for event ${selectedEvent.id}...`);
        const res = await axiosClient.get(API_ENDPOINTS.notifications.eventAlerts(selectedEvent.id));
        if (res.data?.success && Array.isArray(res.data.data)) {
          const list = res.data.data;
          setNotifications(list);
          list.forEach((alert: any) => {
            seenNotificationIdsRef.current.add(alert.id);
          });
          console.log(`[Push] Loaded ${list.length} historical alerts successfully.`);
        }
      } catch (err) {
        console.error('[Push] Failed to load notification history:', err);
      }
    };

    fetchHistory();

    // 2. Set up real-time FCM Web Push listener (Only on Web build)
    const cap = (window as any).Capacitor;
    const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    if (!isNative) {
      console.log('[Push] Registering live foreground FCM listener on web browser...');
      let unsubscribe: (() => void) | null = null;
      
      try {
        const app = getFirebaseApp();
        const messaging = getMessaging(app);
        unsubscribe = onMessage(messaging, (payload) => {
          console.log('[FCM] Live Web foreground notification received:', payload);
          
          const title = payload.notification?.title || payload.data?.title || 'Broadcast Update';
          const body = payload.notification?.body || payload.data?.message || payload.data?.body || '';
          
          if (body) {
            const newAlert = {
              id: payload.messageId || `fcm-${Date.now()}`,
              title,
              message: body,
              is_emergency: payload.data?.isEmergency === 'true' || payload.data?.is_emergency === 'true',
              latitude: payload.data?.latitude ? Number(payload.data.latitude) : undefined,
              longitude: payload.data?.longitude ? Number(payload.data.longitude) : undefined,
              created_at: new Date().toISOString()
            };

            setNotifications(prev => {
              if (prev.some(n => n.id === newAlert.id)) return prev;
              return [newAlert, ...prev];
            });

            // Trigger visual in-app toast
            triggerToast(newAlert);
          }
        });
      } catch (err) {
        console.error('[Push] Failed to subscribe to web foreground push messages:', err);
      }

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, [selectedEvent, triggerToast]);

  // Capacitor native push notification listeners setup
  useEffect(() => {
    const cap = (window as any).Capacitor;
    const isNative = cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform();
    if (!isNative) return;

    let registrationListener: any = null;
    let errListener: any = null;
    let receivedListener: any = null;
    let actionListener: any = null;

    const setupListeners = async () => {
      registrationListener = await PushNotifications.addListener('registration', async (token) => {
        const fcmToken = token.value;
        const activeEvent = selectedEvent;
        if (!activeEvent) return;

        try {
          const platform = cap.getPlatform() || 'android';
          await axiosClient.post(API_ENDPOINTS.notifications.register, {
            eventId: activeEvent.id,
            fcmToken,
            platform
          });
        } catch (err) {
          console.error('[Push] Error posting FCM token to backend:', err);
        }
      });

      errListener = await PushNotifications.addListener('registrationError', (error) => {
        console.error('[Push] FCM registration failed with error:', error);
      });

      receivedListener = await PushNotifications.addListener('pushNotificationReceived', (notification) => {
        const newAlert = {
          id: notification.id || `push-${Date.now()}`,
          title: notification.title || 'Broadcast Update',
          message: notification.body || '',
          is_emergency: notification.data?.isEmergency === 'true' || notification.data?.isEmergency === true,
          latitude: notification.data?.latitude ? Number(notification.data.latitude) : undefined,
          longitude: notification.data?.longitude ? Number(notification.data.longitude) : undefined,
          created_at: new Date().toISOString()
        };

        setNotifications(prev => {
          if (prev.some(n => n.id === newAlert.id)) return prev;
          return [newAlert, ...prev];
        });

        triggerToast(newAlert);
      });

      actionListener = await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
        const data = action.notification.data;
        if (data) {
          if (data.latitude && data.longitude) {
            let targetPoi: POIItem | null = null;
            const latVal = Number(data.latitude);
            const lngVal = Number(data.longitude);
            if (!isNaN(latVal) && !isNaN(lngVal)) {
              let minDistance = Infinity;
              for (const p of poisList) {
                const dx = p.latitude - latVal;
                const dy = p.longitude - lngVal;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < minDistance) {
                  minDistance = dist;
                  targetPoi = p;
                }
              }
              if (targetPoi) {
                setNavTarget(targetPoi);
                setScreenMode('navigation');
                setArrivalNotify(false);
                logNavigationInstructions(targetPoi);
              }
            }
          }
        }
      });
    };

    setupListeners();

    return () => {
      if (registrationListener) registrationListener.remove();
      if (errListener) errListener.remove();
      if (receivedListener) receivedListener.remove();
      if (actionListener) actionListener.remove();
    };
  }, [triggerToast, logNavigationInstructions, selectedEvent, poisList]);

  return (
    <UserTestContext.Provider
      value={{
        backendUrl,
        setBackendUrl,
        detectedIpPreset,
        usbTetheringPreset,
        offlineMode,
        setOfflineMode,
        events,
        setEvents,
        loadingEvents,
        loadingMapData,
        downloadedEventIds,
        setDownloadedEventIds,
        apiError,
        setApiError,
        platformName,
        selectedEvent,
        setSelectedEvent,
        screenMode,
        setScreenMode,
        downloadProgress,
        setDownloadProgress,
        locationPermission,
        setLocationPermission,
        userGps,
        setUserGps,
        gpsAccuracy,
        gpsStatus,
        activeCategory,
        setActiveCategory,
        poisList,
        routeNodes,
        routeEdges,
        leafletLoaded,
        setLeafletLoaded,
        navTarget,
        setNavTarget,
        deviceHeading,
        setDeviceHeading,
        isWalking,
        setIsWalking,
        arrivalNotify,
        setArrivalNotify,
        notifications,
        dismissedNotificationIds,
        setDismissedNotificationIds,
        activeToasts,
        dismissToast,
        triggerToast,
        getOfflineEvents,
        fetchEventsCatalog,
        handleEventSelection,
        triggerExplicitRedownload,
        clearDownloadedCache,
        handleGrantPermission,
        loadEventPoisAndGraph,
        getCategoryStats,
        getSortedPois,
        computeNavigationStats,
        getNavigationStats,
        handleSimulateWalking,
        logNavigationInstructions,
        getRealGps,
        handleGpsUpdate,
        startGpsWatch,
        stopGpsWatch,
        registerPushNotifications
      }}
    >
      {children}
    </UserTestContext.Provider>
  );
}

export function useUserTest() {
  const context = useContext(UserTestContext);
  if (context === undefined) {
    throw new Error('useUserTest must be used within a UserTestProvider');
  }
  return context;
}
