'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sanitizeBackendUrl } from './types';

export interface ConfigContextType {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  detectedIpPreset: string | null;
  setDetectedIpPreset: React.Dispatch<React.SetStateAction<string | null>>;
  usbTetheringPreset: string | null;
  setUsbTetheringPreset: React.Dispatch<React.SetStateAction<string | null>>;
  offlineMode: boolean;
  setOfflineMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  platformName: string;
  setPlatformName: React.Dispatch<React.SetStateAction<string>>;
  apiError: boolean;
  setApiError: (val: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [backendUrl, setBackendUrlState] = useState(
    sanitizeBackendUrl(process.env.NEXT_PUBLIC_API_URL || 'https://api-wp-events.infoviz.co')
  );
  const [detectedIpPreset, setDetectedIpPreset] = useState<string | null>(null);
  const [usbTetheringPreset, setUsbTetheringPreset] = useState<string | null>(null);
  
  // Initialize offlineMode: check manual localStorage override first, then navigator.onLine
  const [offlineMode, setOfflineModeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mm_force_offline');
      if (saved === 'true') return true;
      if (saved === 'false') return false;
      return !navigator.onLine;
    }
    return false;
  });

  const [platformName, setPlatformName] = useState<string>('web');
  const [apiError, setApiError] = useState(false);

  // Custom setter to persist manual offline override in localStorage
  const setOfflineMode = useCallback((val: boolean | ((prev: boolean) => boolean)) => {
    setOfflineModeState((prevVal) => {
      const newVal = typeof val === 'function' ? val(prevVal) : val;
      if (typeof window !== 'undefined') {
        localStorage.setItem('mm_force_offline', newVal ? 'true' : 'false');
      }
      return newVal;
    });
  }, []);

  // Sync state with browser network status changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      const isForcedOffline = localStorage.getItem('mm_force_offline') === 'true';
      if (!isForcedOffline) {
        setOfflineModeState(false);
        console.log('[Connection] Browser online. Toggled offlineMode to false.');
      }
    };

    const handleOffline = () => {
      setOfflineModeState(true);
      console.log('[Connection] Browser offline. Toggled offlineMode to true.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setBackendUrl = useCallback((url: string) => {
    const sanitized = sanitizeBackendUrl(url);
    setBackendUrlState(sanitized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_test_backend_url', sanitized);
    }
  }, []);

  const value = React.useMemo(() => ({
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
  }), [
    backendUrl,
    setBackendUrl,
    detectedIpPreset,
    usbTetheringPreset,
    offlineMode,
    setOfflineMode,
    platformName,
    apiError,
  ]);

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
