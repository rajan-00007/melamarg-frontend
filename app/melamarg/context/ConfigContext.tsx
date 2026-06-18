'use client';

import React, { createContext, useContext, useState } from 'react';
import { sanitizeBackendUrl } from './types';

export interface ConfigContextType {
  backendUrl: string;
  setBackendUrl: (url: string) => void;
  detectedIpPreset: string | null;
  setDetectedIpPreset: React.Dispatch<React.SetStateAction<string | null>>;
  usbTetheringPreset: string | null;
  setUsbTetheringPreset: React.Dispatch<React.SetStateAction<string | null>>;
  offlineMode: boolean;
  setOfflineMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [offlineMode, setOfflineMode] = useState(false);
  const [platformName, setPlatformName] = useState<string>('web');
  const [apiError, setApiError] = useState(false);

  const setBackendUrl = (url: string) => {
    const sanitized = sanitizeBackendUrl(url);
    setBackendUrlState(sanitized);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_test_backend_url', sanitized);
    }
  };

  return (
    <ConfigContext.Provider
      value={{
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
      }}
    >
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
