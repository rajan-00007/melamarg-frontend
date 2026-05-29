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
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [downloadedEventIds, setDownloadedEventIds] = useState<string[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [screenMode, setScreenMode] = useState<'selector' | 'downloading' | 'permission' | 'home' | 'pois' | 'navigation'>('selector');
  const [downloadProgress, setDownloadProgress] = useState(0);

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

  return (
    <EventsContext.Provider
      value={{
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
      }}
    >
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
