'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { EventItem, MOCK_EVENTS } from './types';

export interface EventsContextType {
  events: EventItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  loadingEvents: boolean;
  setLoadingEvents: React.Dispatch<React.SetStateAction<boolean>>;
  downloadedEventIds: string[];
  setDownloadedEventIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedEvent: EventItem | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>;
  screenMode: 'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation';
  setScreenMode: React.Dispatch<React.SetStateAction<'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation'>>;
  downloadProgress: number;
  setDownloadProgress: React.Dispatch<React.SetStateAction<number>>;
  getOfflineEvents: (downloadedIds: string[]) => EventItem[];
  isInitialized: boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [downloadedEventIds, setDownloadedEventIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [screenMode, setScreenMode] = useState<'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation'>('selector');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const isSelectorRoute = pathname === '/melamarg' || pathname === '/melamarg/';
      
      const saved = localStorage.getItem('mm_selected_event');
      if (saved && !isSelectorRoute) {
        try {
          const parsed = JSON.parse(saved);
          setSelectedEvent(parsed);
          setScreenMode('home');
        } catch (e) {
          console.error('Failed to parse mm_selected_event:', e);
        }
      } else if (isSelectorRoute) {
        localStorage.removeItem('mm_selected_event');
      }
      setIsInitialized(true);
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      if (selectedEvent) {
        localStorage.setItem('mm_selected_event', JSON.stringify(selectedEvent));
      } else {
        localStorage.removeItem('mm_selected_event');
      }
    }
  }, [selectedEvent]);

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

  const value = React.useMemo(() => ({
    events,
    setEvents,
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
  }), [
    events,
    loadingEvents,
    downloadedEventIds,
    selectedEvent,
    screenMode,
    downloadProgress,
    getOfflineEvents,
    isInitialized,
  ]);

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
}
