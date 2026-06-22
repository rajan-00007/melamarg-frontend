'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { POIItem, NodeItem, EdgeItem, EventItem, MOCK_POIS, MOCK_NODES, MOCK_EDGES, MOCK_EVENTS, getHaversineDistance } from './types';
import { useConfig } from './ConfigContext';
import { useGps } from './GpsContext';
import axiosClient from '@/lib/axios/axiosClient';
import { API_ENDPOINTS } from '@/lib/axios/endpoints';

export interface MapDataContextType {
  poisList: POIItem[];
  setPoisList: React.Dispatch<React.SetStateAction<POIItem[]>>;
  routeNodes: NodeItem[];
  setRouteNodes: React.Dispatch<React.SetStateAction<NodeItem[]>>;
  routeEdges: EdgeItem[];
  setRouteEdges: React.Dispatch<React.SetStateAction<EdgeItem[]>>;
  activeAdvisories: any[];
  setActiveAdvisories: React.Dispatch<React.SetStateAction<any[]>>;
  leafletLoaded: boolean;
  setLeafletLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  loadingMapData: boolean;
  setLoadingMapData: React.Dispatch<React.SetStateAction<boolean>>;
  loadEventPoisAndGraph: (event: EventItem) => Promise<void>;
  getCategoryStats: (cat: string) => number;
  getSortedPois: () => POIItem[];
}

const MapDataContext = createContext<MapDataContextType | undefined>(undefined);

export function MapDataProvider({ children }: { children: React.ReactNode }) {
  const { offlineMode } = useConfig();
  const { userGps } = useGps();

  const [poisList, setPoisList] = useState<POIItem[]>([]);
  const [routeNodes, setRouteNodes] = useState<NodeItem[]>([]);
  const [routeEdges, setRouteEdges] = useState<EdgeItem[]>([]);
  const [activeAdvisories, setActiveAdvisories] = useState<any[]>([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('toilet');
  const [loadingMapData, setLoadingMapData] = useState(false);

  // Load Leaflet dynamically on mount
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

  const loadEventPoisAndGraph = useCallback(async (event: EventItem) => {
    if (!event) return;

    setLoadingMapData(true);
    try {
      const isMock = event.id.startsWith('mock-');
      let loadedPois = isMock ? MOCK_POIS : [];
      let loadedNodes = isMock ? MOCK_NODES : [];
      let loadedEdges = isMock ? MOCK_EDGES : [];
      let loadedAdvisories: any[] = [];
      let hasLocalCache = false;

      if (typeof window !== 'undefined') {
        const cachedPois = localStorage.getItem(`mm_offline_pois_${event.id}`);
        const cachedRoutes = localStorage.getItem(`mm_offline_routes_${event.id}`);
        const cachedAdvisories = localStorage.getItem(`mm_offline_advisories_${event.id}`);
        if (cachedPois && cachedRoutes) {
          try {
            loadedPois = JSON.parse(cachedPois);
            const routeData = JSON.parse(cachedRoutes);
            if (routeData.nodes) loadedNodes = routeData.nodes;
            if (routeData.edges) loadedEdges = routeData.edges;
            if (cachedAdvisories) loadedAdvisories = JSON.parse(cachedAdvisories);
            hasLocalCache = true;
            console.log(`[Offline Cache] Loaded ${loadedPois.length} POIs and route graph from local storage for event ${event.id}`);
          } catch (e) {
            console.error('Failed to parse offline cache:', e);
          }
        }
      }

      setPoisList(loadedPois);
      setRouteNodes(loadedNodes);
      setRouteEdges(loadedEdges);
      setActiveAdvisories(loadedAdvisories);

      if (!offlineMode) {
        try {
          console.log(`[Fetch] Fetching latest map data from server for event ${event.id}...`);
          let pDataFetched = false;
          let rDataFetched = false;
          let aDataFetched = false;
          let newPois = loadedPois;
          let newNodes = loadedNodes;
          let newEdges = loadedEdges;
          let newAdvisories = loadedAdvisories;

          try {
            const pRes = await axiosClient.get(API_ENDPOINTS.events.pois(event.id) + `?t=${Date.now()}`);
            const pJson = pRes.data;
            if (pJson.success && Array.isArray(pJson.data)) {
              newPois = pJson.data;
              pDataFetched = true;
            }
          } catch (e) {
            console.warn('[Fetch] POIs fetch failed:', e);
          }

          try {
            const rRes = await axiosClient.get(API_ENDPOINTS.events.routes(event.id) + `?t=${Date.now()}`);
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

          try {
            const aRes = await axiosClient.get(API_ENDPOINTS.events.advisories(event.id) + `/active?t=${Date.now()}`);
            const aJson = aRes.data;
            if (aJson.success && Array.isArray(aJson.data)) {
              newAdvisories = aJson.data;
              aDataFetched = true;
            }
          } catch (e) {
            console.warn('[Fetch] Advisories fetch failed:', e);
          }

          if (pDataFetched || rDataFetched || aDataFetched) {
            loadedPois = newPois;
            loadedNodes = newNodes;
            loadedEdges = newEdges;
            loadedAdvisories = newAdvisories;
            hasLocalCache = true;
            
            if (typeof window !== 'undefined') {
              localStorage.setItem(`mm_offline_pois_${event.id}`, JSON.stringify(newPois));
              localStorage.setItem(`mm_offline_routes_${event.id}`, JSON.stringify({ nodes: newNodes, edges: newEdges }));
              localStorage.setItem(`mm_offline_advisories_${event.id}`, JSON.stringify(newAdvisories));
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
      setActiveAdvisories(loadedAdvisories);
    } finally {
      setLoadingMapData(false);
    }
  }, [offlineMode]);

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

  return (
    <MapDataContext.Provider
      value={{
        poisList,
        setPoisList,
        routeNodes,
        setRouteNodes,
        routeEdges,
        setRouteEdges,
        activeAdvisories,
        setActiveAdvisories,
        leafletLoaded,
        setLeafletLoaded,
        activeCategory,
        setActiveCategory,
        loadingMapData,
        setLoadingMapData,
        loadEventPoisAndGraph,
        getCategoryStats,
        getSortedPois,
      }}
    >
      {children}
    </MapDataContext.Provider>
  );
}

export function useMapData() {
  const context = useContext(MapDataContext);
  if (context === undefined) {
    throw new Error('useMapData must be used within a MapDataProvider');
  }
  return context;
}
