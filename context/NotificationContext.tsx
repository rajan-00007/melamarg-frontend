'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { getWebFcmToken, getFirebaseApp } from '@/lib/firebase';
import { getMessaging, onMessage } from 'firebase/messaging';
import axiosClient from '@/lib/axios/axiosClient';
import { API_ENDPOINTS } from '@/lib/axios/endpoints';
import { POIItem } from './types';
import { useEvents } from './EventsContext';
import { useMapData } from './MapDataContext';
import { useNavigation } from './NavigationContext';

export interface NotificationContextType {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  dismissedNotificationIds: string[];
  setDismissedNotificationIds: React.Dispatch<React.SetStateAction<string[]>>;
  activeToasts: any[];
  dismissToast: (id: string) => void;
  triggerToast: (alertItem: any) => void;
  registerPushNotifications: (eventId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { selectedEvent, setScreenMode } = useEvents();
  const { poisList } = useMapData();
  const { setNavTarget, setArrivalNotify, logNavigationInstructions } = useNavigation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [dismissedNotificationIds, setDismissedNotificationIds] = useState<string[]>([]);
  const [activeToasts, setActiveToasts] = useState<any[]>([]);

  const seenNotificationIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);
  const registeredEventIdRef = useRef<string | null>(null);

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
              advisory_id: payload.data?.advisoryId || payload.data?.advisory_id || undefined,
              created_at: new Date().toISOString()
            };

            setNotifications(prev => {
              if (prev.some(n => n.id === newAlert.id)) return prev;
              return [newAlert, ...prev];
            });

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
          advisory_id: notification.data?.advisoryId || notification.data?.advisory_id || undefined,
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
  }, [triggerToast, logNavigationInstructions, selectedEvent, poisList, setNavTarget, setScreenMode, setArrivalNotify]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        dismissedNotificationIds,
        setDismissedNotificationIds,
        activeToasts,
        dismissToast,
        triggerToast,
        registerPushNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
