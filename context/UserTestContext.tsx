'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { App } from '@capacitor/app';
import axiosClient from '@/lib/axios/axiosClient';
import { API_ENDPOINTS } from '@/lib/axios/endpoints';
import { useFeedbackStore } from '@/app/melamarg/stores/feedbackStore';

// Re-export types, mock data, and routing classes from types.ts to preserve complete backward-compatibility
export {
  type EventItem,
  type POIItem,
  type NodeItem,
  type EdgeItem,
  DijkstraRouter,
  MOCK_EVENTS,
  MOCK_POIS,
  MOCK_NODES,
  MOCK_EDGES,
  getHaversineDistance,
  getCompassBearing,
  findOptimalEntranceNode,
  sanitizeBackendUrl,
} from './types';

import {
  type EventItem,
  type POIItem,
  type NodeItem,
  type EdgeItem,
  MOCK_EVENTS,
  sanitizeBackendUrl,
} from './types';

// Import sub-providers and sub-hooks
import { ConfigProvider, useConfig } from './ConfigContext';
import { EventsProvider, useEvents } from './EventsContext';
import { GpsProvider, useGps } from './GpsContext';
import { MapDataProvider, useMapData } from './MapDataContext';
import { NavigationProvider, useNavigation } from './NavigationContext';
import { NotificationProvider, useNotification } from './NotificationContext';

// Re-export type definitions to ensure that types.ts exports match UserTestContext exports
import { ConfigContextType } from './ConfigContext';
import { EventsContextType } from './EventsContext';
import { GpsContextType } from './GpsContext';
import { MapDataContextType } from './MapDataContext';
import { NavigationContextType } from './NavigationContext';
import { NotificationContextType } from './NotificationContext';

export interface UserTestContextType
  extends Omit<ConfigContextType, 'setDetectedIpPreset' | 'setPlatformName' | 'setUsbTetheringPreset'>,
    Omit<EventsContextType, 'setEvents' | 'setLoadingEvents' | 'setDownloadedEventIds' | 'setScreenMode' | 'setDownloadProgress'>,
    Omit<GpsContextType, 'setGpsAccuracy' | 'setGpsStatus'>,
    Omit<MapDataContextType, 'setPoisList' | 'setRouteNodes' | 'setRouteEdges' | 'setLeafletLoaded' | 'setLoadingMapData'>,
    NavigationContextType,
    Omit<NotificationContextType, 'setNotifications' | 'dismissedNotificationIds' | 'setDismissedNotificationIds' | 'activeToasts'> {
  // Add missing setters/state that layout or page needs
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setDownloadedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  setScreenMode: (mode: 'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation') => void;
  setDownloadProgress: React.Dispatch<React.SetStateAction<number>>;
  setLeafletLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  dismissedNotificationIds: string[];
  setDismissedNotificationIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeToasts: any[];
  fetchEventsCatalog: () => Promise<void>;
  handleEventSelection: (event: EventItem) => Promise<void>;
  triggerExplicitRedownload: (event: EventItem, e: React.MouseEvent) => void;
  clearDownloadedCache: () => void;
  handleGrantPermission: (granted: boolean) => Promise<void>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserTestCombinedContext = createContext<UserTestContextType | undefined>(undefined);

function UserTestCombinedProvider({ children }: { children: React.ReactNode }) {
  // Consume all sub-contexts
  const {
    backendUrl,
    setBackendUrl,
    detectedIpPreset,
    setDetectedIpPreset,
    usbTetheringPreset,
    setUsbTetheringPreset,
    offlineMode,
    setOfflineMode,
    platformName,
    setPlatformName,
    apiError,
    setApiError,
  } = useConfig();

  const {
    events,
    setEvents,
    upcomingEvents,
    setUpcomingEvents,
    loadingEvents,
    setLoadingEvents,
    downloadedEventIds,
    setDownloadedEventIds,
    selectedEvent,
    setSelectedEvent,
    screenMode,
    setScreenMode,
    downloadProgress,
    setDownloadProgress,
    getOfflineEvents,
    isInitialized,
  } = useEvents();

  const {
    locationPermission,
    setLocationPermission,
    userGps,
    setUserGps,
    gpsAccuracy,
    gpsStatus,
    getRealGps,
    handleGpsUpdate,
    startGpsWatch,
    stopGpsWatch,
  } = useGps();

  const {
    poisList,
    routeNodes,
    routeEdges,
    activeAdvisories,
    setActiveAdvisories,
    zonesList,
    setZonesList,
    highlightsList,
    setHighlightsList,
    leafletLoaded,
    setLeafletLoaded,
    activeCategory,
    setActiveCategory,
    loadingMapData,
    loadEventPoisAndGraph,
    refreshActiveAdvisories,
    getCategoryStats,
    getSortedPois,
    findZoneForCoordinate,
  } = useMapData();

  const {
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
  } = useNavigation();

  const {
    notifications,
    dismissedNotificationIds,
    setDismissedNotificationIds,
    activeToasts,
    dismissToast,
    triggerToast,
    registerPushNotifications,
  } = useNotification();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Local helper ref signals
  const urlReady = useRef(false);
  const [urlReadySignal, setUrlReadySignal] = useState(0);
  const lastLoadedEventIdRef = useRef<string | null>(null);

  // Fetch events on start or mode change
  const fetchEventsCatalog = useCallback(async () => {
    setLoadingEvents(true);
    setApiError(false);
    console.log('[fetchEventsCatalog] Fetching events via axiosClient...');

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const filterActiveAndUpcoming = (allEvents: EventItem[]) => {
      const active = allEvents.filter(e => {
        const start = e.start_date ? new Date(e.start_date) : null;
        const end = e.end_date ? new Date(e.end_date) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(0, 0, 0, 0);
        return (start === null || start <= now) && (end === null || end >= now);
      });

      const upcoming = allEvents.filter(e => {
        const start = e.start_date ? new Date(e.start_date) : null;
        if (start) start.setHours(0, 0, 0, 0);
        return start !== null && start > now;
      });

      upcoming.sort((a, b) => {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateA - dateB;
      });

      return { active, upcoming };
    };

    // Fast-path: if offline, bypass the network call completely and show downloaded list instantly
    if (typeof window !== 'undefined' && !navigator.onLine) {
      console.log('[fetchEventsCatalog] Browser offline. Instantly loading cached downloaded maps.');
      const offlineList = getOfflineEvents(downloadedEventIds);
      const { active, upcoming } = filterActiveAndUpcoming(offlineList);
      setEvents(active);
      setUpcomingEvents(upcoming);
      setLoadingEvents(false);
      return;
    }

    try {
      let url = API_ENDPOINTS.events.base;
      
      const gpsPos = await getRealGps();
      if (gpsPos) {
        const [lat, lng] = gpsPos;
        url = `${API_ENDPOINTS.events.base}?latitude=${lat}&longitude=${lng}`;
        setUserGps([lat, lng]);
      }
      
      const res = await axiosClient.get(url);
      const json = res.data;
      if (json && json.success && json.data) {
        if (json.data.active && json.data.upcoming) {
          const activeEvents = json.data.active;
          const upcomingEvents = json.data.upcoming;
          setEvents(activeEvents);
          setUpcomingEvents(upcomingEvents);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mm_cached_events', JSON.stringify([...activeEvents, ...upcomingEvents]));
          }
        } else if (Array.isArray(json.data)) {
          const backendEvents = json.data;
          const { active, upcoming } = filterActiveAndUpcoming(backendEvents);
          setEvents(active);
          setUpcomingEvents(upcoming);
          if (typeof window !== 'undefined') {
            localStorage.setItem('mm_cached_events', JSON.stringify(backendEvents));
          }
        } else {
          const { active, upcoming } = filterActiveAndUpcoming(MOCK_EVENTS);
          setEvents(active);
          setUpcomingEvents(upcoming);
        }
      } else {
        throw new Error('Fallback empty list');
      }
    } catch (err) {
      console.log('Unable to reach server. Displaying cached downloaded events.', err);
      setApiError(true);
      const offlineList = getOfflineEvents(downloadedEventIds);
      const { active, upcoming } = filterActiveAndUpcoming(offlineList);
      setEvents(active);
      setUpcomingEvents(upcoming);
    } finally {
      setLoadingEvents(false);
    }
  }, [downloadedEventIds, getOfflineEvents, getRealGps, setEvents, setUpcomingEvents, setLoadingEvents, setApiError, setUserGps]);

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
  }, [getRealGps, setUserGps]);

  const trackVisitActivity = useCallback((eventId: string, platform: string) => {
    if (typeof window === 'undefined') return;
    try {
      let deviceId = localStorage.getItem('mm_device_id');
      if (!deviceId) {
        deviceId = 'dev-' + Math.random().toString(36).substring(2, 11);
        localStorage.setItem('mm_device_id', deviceId);
      }
      axiosClient.post('analytics/track-visit', {
        event_id: eventId,
        device_id: deviceId,
        platform: platform
      }).catch(err => console.log('[Analytics] Visitor check-in failed to report:', err));
    } catch (e) {
      // Fail silently
    }
  }, []);

  const handleEventSelection = async (event: EventItem) => {
    setSelectedEvent(event);
    trackVisitActivity(event.id, platformName);
    
    if (downloadedEventIds.includes(event.id)) {
      if (locationPermission !== null) {
        initializeUserGps(event);
        loadEventPoisAndGraph(event);
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

              if (locationPermission !== null) {
                initializeUserGps(event);
                loadEventPoisAndGraph(event);
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

            if (locationPermission !== null) {
              initializeUserGps(event);
              loadEventPoisAndGraph(event);
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
        if (key && key.startsWith('mm_offline_')) {
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
      initializeUserGps(selectedEvent);
    }
    if (selectedEvent) {
      loadEventPoisAndGraph(selectedEvent);
    }
    setScreenMode('home');
  };

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

      const isStaleLocalhost = savedUrl && (
        savedUrl.includes('localhost:5000') ||
        savedUrl.includes('127.0.0.1:5000')
      );

      if (savedUrl && !isStaleLocalhost) {
        setBackendUrl(savedUrl);
      } else {
        const defaultUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co/api/';
        setBackendUrl(defaultUrl);
        if (isStaleLocalhost) {
          localStorage.removeItem('mm_test_backend_url');
        }
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
  }, [setDetectedIpPreset, setPlatformName, setUsbTetheringPreset, setBackendUrl, setDownloadedEventIds, setLocationPermission]);

  // Fetch events catalog loader hook
  useEffect(() => {
    if (!urlReady.current) return;
    if (!offlineMode) {
      fetchEventsCatalog();
    } else {
      const offlineList = getOfflineEvents(downloadedEventIds);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const active = offlineList.filter(e => {
        const start = e.start_date ? new Date(e.start_date) : null;
        const end = e.end_date ? new Date(e.end_date) : null;
        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(0, 0, 0, 0);
        return (start === null || start <= now) && (end === null || end >= now);
      });
      const upcoming = offlineList.filter(e => {
        const start = e.start_date ? new Date(e.start_date) : null;
        if (start) start.setHours(0, 0, 0, 0);
        return start !== null && start > now;
      });
      setEvents(active);
      setUpcomingEvents(upcoming);
    }
  }, [backendUrl, offlineMode, downloadedEventIds, getOfflineEvents, fetchEventsCatalog, setEvents, setUpcomingEvents, urlReadySignal]);

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

  // Auto-load POIs and Graph if selectedEvent is restored but map data is empty
  useEffect(() => {
    if (selectedEvent && lastLoadedEventIdRef.current !== selectedEvent.id && !loadingMapData) {
      console.log(`[AutoLoad] Selected event found. Loading map data for ${selectedEvent.id}...`);
      const autoLoad = async () => {
        lastLoadedEventIdRef.current = selectedEvent.id;
        if (locationPermission === true) {
          await initializeUserGps(selectedEvent);
        }
        await loadEventPoisAndGraph(selectedEvent);
        trackVisitActivity(selectedEvent.id, platformName);
      };
      autoLoad();
    }
  }, [selectedEvent, loadingMapData, locationPermission, initializeUserGps, loadEventPoisAndGraph, platformName, trackVisitActivity]);

  // Synchronize pending feedbacks when coming online
  const syncOfflineFeedbacks = useCallback(async () => {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline || offlineMode) return;

    const pendingFeedbacks = useFeedbackStore.getState().pendingFeedbacks;
    if (pendingFeedbacks.length === 0) return;

    console.log(`[FeedbackSync] Found ${pendingFeedbacks.length} pending offline feedbacks. Starting sync...`);
    
    for (const fb of pendingFeedbacks) {
      try {
        const feedbackUrl = API_ENDPOINTS.feedback?.submit || '/feedback';
        await axiosClient.post(feedbackUrl, {
          event_id: fb.event_id,
          rating: fb.rating,
          thoughts: fb.thoughts
        });
        
        // Remove from store upon successful submit
        useFeedbackStore.getState().removePendingFeedback(fb.id);
        console.log(`[FeedbackSync] Successfully synced offline feedback: ${fb.id}`);
      } catch (err) {
        console.error(`[FeedbackSync] Failed to sync feedback ${fb.id}:`, err);
      }
    }
  }, [offlineMode]);

  // Hook up window online listener and try syncing on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', syncOfflineFeedbacks);
    syncOfflineFeedbacks();

    return () => {
      window.removeEventListener('online', syncOfflineFeedbacks);
    };
  }, [syncOfflineFeedbacks]);

  // Sync feedbacks when offlineMode turns false
  useEffect(() => {
    if (!offlineMode) {
      syncOfflineFeedbacks();
    }
  }, [offlineMode, syncOfflineFeedbacks]);

  // Sync highlights, POIs, and graph details when coming online
  useEffect(() => {
    if (!offlineMode && selectedEvent) {
      console.log(`[OnlineSync] App transitioned online. Fetching fresh assets for event ${selectedEvent.id}...`);
      loadEventPoisAndGraph(selectedEvent);
    }
  }, [offlineMode, selectedEvent, loadEventPoisAndGraph]);

  const value = React.useMemo(() => ({
    // Config context fields
    backendUrl,
    setBackendUrl,
    detectedIpPreset,
    usbTetheringPreset,
    offlineMode,
    setOfflineMode,
    platformName,
    apiError,
    setApiError,

    // Events context fields
    events,
    setEvents,
    upcomingEvents,
    setUpcomingEvents,
    loadingEvents,
    downloadedEventIds,
    setDownloadedEventIds,
    selectedEvent,
    setSelectedEvent,
    screenMode,
    setScreenMode,
    downloadProgress,
    setDownloadProgress,
    getOfflineEvents,
    isInitialized,

    // GPS context fields
    locationPermission,
    setLocationPermission,
    userGps,
    setUserGps,
    gpsAccuracy,
    gpsStatus,
    getRealGps,
    handleGpsUpdate,
    startGpsWatch,
    stopGpsWatch,

    // Map Data context fields
    poisList,
    routeNodes,
    routeEdges,
    activeAdvisories,
    setActiveAdvisories,
    zonesList,
    setZonesList,
    highlightsList,
    setHighlightsList,
    leafletLoaded,
    setLeafletLoaded,
    activeCategory,
    setActiveCategory,
    loadingMapData,
    loadEventPoisAndGraph,
    refreshActiveAdvisories,
    getCategoryStats,
    getSortedPois,
    findZoneForCoordinate,

    // Navigation context fields
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

    // Notification context fields
    notifications,
    dismissedNotificationIds,
    setDismissedNotificationIds,
    activeToasts,
    dismissToast,
    triggerToast,
    registerPushNotifications,

    // Sidebar state
    isSidebarOpen,
    setIsSidebarOpen,

    // Cross-cutting methods
    fetchEventsCatalog,
    handleEventSelection,
    triggerExplicitRedownload,
    clearDownloadedCache,
    handleGrantPermission,
  }), [
    backendUrl,
    setBackendUrl,
    detectedIpPreset,
    usbTetheringPreset,
    offlineMode,
    setOfflineMode,
    platformName,
    apiError,
    setApiError,
    events,
    setEvents,
    upcomingEvents,
    setUpcomingEvents,
    loadingEvents,
    downloadedEventIds,
    setDownloadedEventIds,
    selectedEvent,
    setSelectedEvent,
    screenMode,
    setScreenMode,
    downloadProgress,
    setDownloadProgress,
    getOfflineEvents,
    isInitialized,
    locationPermission,
    startGpsWatch,
    stopGpsWatch,
    poisList,
    routeNodes,
    routeEdges,
    activeAdvisories,
    setActiveAdvisories,
    highlightsList,
    setHighlightsList,
    leafletLoaded,
    setLeafletLoaded,
    activeCategory,
    setActiveCategory,
    loadingMapData,
    loadEventPoisAndGraph,
    refreshActiveAdvisories,
    getCategoryStats,
    getSortedPois,
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
    notifications,
    dismissedNotificationIds,
    setDismissedNotificationIds,
    activeToasts,
    dismissToast,
    triggerToast,
    registerPushNotifications,
    fetchEventsCatalog,
    handleEventSelection,
    triggerExplicitRedownload,
    clearDownloadedCache,
    handleGrantPermission,
    isSidebarOpen,
    setIsSidebarOpen,
    zonesList,
    findZoneForCoordinate,
  ]);

  return (
    <UserTestCombinedContext.Provider value={value}>
      {children}
    </UserTestCombinedContext.Provider>
  );
}

// Hierarchical Provider Wrapper to preserve topological dependency order:
// ConfigProvider -> EventsProvider -> GpsProvider -> MapDataProvider -> NavigationProvider -> NotificationProvider -> CombinedProvider
export function UserTestProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider>
      <EventsProvider>
        <GpsProvider>
          <MapDataProvider>
            <NavigationProvider>
              <NotificationProvider>
                <UserTestCombinedProvider>
                  {children}
                </UserTestCombinedProvider>
              </NotificationProvider>
            </NavigationProvider>
          </MapDataProvider>
        </GpsProvider>
      </EventsProvider>
    </ConfigProvider>
  );
}

export function useUserTest() {
  const context = useContext(UserTestCombinedContext);
  if (context === undefined) {
    throw new Error('useUserTest must be used within a UserTestProvider');
  }
  return context;
}
