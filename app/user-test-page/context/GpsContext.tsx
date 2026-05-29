'use client';

import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Geolocation } from '@capacitor/geolocation';

export interface GpsContextType {
  locationPermission: boolean | null;
  setLocationPermission: React.Dispatch<React.SetStateAction<boolean | null>>;
  userGps: [number, number];
  setUserGps: React.Dispatch<React.SetStateAction<[number, number]>>;
  gpsAccuracy: number | null;
  setGpsAccuracy: React.Dispatch<React.SetStateAction<number | null>>;
  gpsStatus: 'searching' | 'locked' | 'lost';
  setGpsStatus: React.Dispatch<React.SetStateAction<'searching' | 'locked' | 'lost'>>;
  getRealGps: () => Promise<[number, number] | null>;
  handleGpsUpdate: (pos: any) => void;
  startGpsWatch: () => Promise<void>;
  stopGpsWatch: () => void;
}

const GpsContext = createContext<GpsContextType | undefined>(undefined);

export function GpsProvider({ children }: { children: React.ReactNode }) {
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [userGps, setUserGps] = useState<[number, number]>([19.8050, 85.8250]); // Puri Center fallback
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'searching' | 'locked' | 'lost'>('searching');

  const gpsWatchRef = useRef<any>(null);

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
          console.warn('[GPS] Fast native fix failed, trying high-accuracy...');
        }
        
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
    
    const source = ageMs > 5000 ? 'OS Cache (Last Known Location)' : 'Live Satellite (Actual Current)';
    console.log(`[GPS Monitor] Source: ${source} | Age: ${(ageMs / 1000).toFixed(1)}s | Acc: ${accuracy ? Math.round(accuracy) + 'm' : 'unknown'}`);

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

    const LOCK_ACCURACY_LIMIT = 1000;
    if (accuracy !== undefined && accuracy > LOCK_ACCURACY_LIMIT) {
      setGpsStatus('searching');
      return;
    }

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

  return (
    <GpsContext.Provider
      value={{
        locationPermission,
        setLocationPermission,
        userGps,
        setUserGps,
        gpsAccuracy,
        setGpsAccuracy,
        gpsStatus,
        setGpsStatus,
        getRealGps,
        handleGpsUpdate,
        startGpsWatch,
        stopGpsWatch,
      }}
    >
      {children}
    </GpsContext.Provider>
  );
}

export function useGps() {
  const context = useContext(GpsContext);
  if (context === undefined) {
    throw new Error('useGps must be used within a GpsProvider');
  }
  return context;
}
