'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserTestProvider, useUserTest } from './context/UserTestContext';
import { 
  Bell, 
  MapPin, 
  Compass, 
  AlertTriangle, 
  Info, 
  LayoutGrid, 
  Map, 
  Megaphone, 
  HelpCircle, 
  X, 
  ArrowRight,
  Smartphone,
  RefreshCw,
  Plane,
  Wifi,
  Usb
} from 'lucide-react';

import {
  RootContainer,
  ToastsContainer,
  ToastCard,
  ToastContent,
  ToastHeader,
  ToastTitle,
  ToastMessage,
  ToastAction,
  ToastDismiss,
  TopBanner,
  BannerRow,
  EndpointWrapper,
  StatusIndicator,
  EndpointText,
  PlatformBadge,
  EditButton,
  RefreshButton,
  OfflineModeButton,
  ResetButton,
  PresetsContainer,
  PresetsLabel,
  PresetButton,
  ContentArea,
  BottomNav,
  NavButton,
  NavBadge,
  NavButtonText,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill
} from './layout.styled';

function UserTestLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const {
    backendUrl,
    setBackendUrl,
    detectedIpPreset,
    usbTetheringPreset,
    offlineMode,
    setOfflineMode,
    setEvents,
    downloadedEventIds,
    apiError,
    setApiError,
    platformName,
    selectedEvent,
    setSelectedEvent,
    setNavTarget,
    setArrivalNotify,
    gpsAccuracy,
    gpsStatus,
    userGps,
    notifications,
    dismissedNotificationIds,
    activeToasts,
    dismissToast,
    fetchEventsCatalog,
    getOfflineEvents,
    clearDownloadedCache,
    screenMode,
    setScreenMode
  } = useUserTest();

  // If no event is selected and we try to access sub-routes, redirect to the selector
  useEffect(() => {
    const isSetupRoute = pathname === '/user-test-page';
    if (!selectedEvent && !isSetupRoute) {
      router.push('/user-test-page');
    }
  }, [selectedEvent, pathname, router]);

  // Handle deep-linking query parameters if present on layout mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const navLatStr = params.get('nav_lat');
      const navLngStr = params.get('nav_lng');
      if (navLatStr && navLngStr && selectedEvent) {
        const navLat = parseFloat(navLatStr);
        const navLng = parseFloat(navLngStr);
        const title = params.get('title') || 'Alert Location';
        const msg = params.get('msg') || '';
        if (!isNaN(navLat) && !isNaN(navLng)) {
          const targetPoi = {
            id: `alert-poi-query`,
            name_en: title,
            latitude: navLat,
            longitude: navLng,
            category_name: 'Alert Target',
            description: msg
          };

          // Remove query params to avoid infinite routing
          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);

          setNavTarget(targetPoi);
          router.push('/user-test-page/map');
        }
      }
    }
  }, [selectedEvent, pathname, router, setNavTarget]);

  // Determine active tab based on pathname
  let currentTab: 'home' | 'map' | 'alerts' | 'help' | null = null;
  if (pathname.endsWith('/home')) currentTab = 'home';
  else if (pathname.endsWith('/map')) currentTab = 'map';
  else if (pathname.endsWith('/alerts')) currentTab = 'alerts';
  else if (pathname.endsWith('/help')) currentTab = 'help';

  const isSetupRoute = pathname === '/user-test-page';
  const isNavigatingRoute = pathname.endsWith('/navigation');
  const showNav = selectedEvent && !isSetupRoute && !isNavigatingRoute;

  const renderGpsStatusPill = () => {
    if (gpsStatus === 'locked') {
      return (
        <GPSLockedPill>
          <span className="dot"></span>
          <span>GPS Locked ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Good'})</span>
        </GPSLockedPill>
      );
    } else if (gpsStatus === 'searching') {
      return (
        <GPSSearchingPill>
          <span className="dot"></span>
          <span>Searching GPS... ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Weak'})</span>
        </GPSSearchingPill>
      );
    } else {
      return (
        <GPSLostPill>
          <span className="dot"></span>
          <span>GPS Lost ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'No Signal'})</span>
        </GPSLostPill>
      );
    }
  };

  return (
    <RootContainer>
      
      {/* Dynamic Glassmorphic Toasts Container */}
      <ToastsContainer>
        {activeToasts.map(toast => {
          const isEmergency = toast.is_emergency;
          const isService = toast.title.toUpperCase().includes('SERVICE');
          const isAdvisory = toast.title.toUpperCase().includes('ADVISORY') || toast.title.toUpperCase().includes('CROWD');

          let leftBorderColor = '#ef4444';
          let alertColorTheme = '#f43f5e';
          let bgOverlay = 'rgba(239, 68, 68, 0.1)';
          let LeftIcon = Bell;
          let iconColor = 'text-rose-400';

          if (isService) {
            leftBorderColor = '#22c55e';
            alertColorTheme = '#10b981';
            bgOverlay = 'rgba(34, 197, 94, 0.1)';
            LeftIcon = Info;
            iconColor = 'text-emerald-400';
          } else if (isAdvisory) {
            leftBorderColor = '#eab308';
            alertColorTheme = '#fbbf24';
            bgOverlay = 'rgba(234, 179, 8, 0.1)';
            LeftIcon = AlertTriangle;
            iconColor = 'text-amber-400';
          } else if (!isEmergency) {
            leftBorderColor = '#6366f1';
            alertColorTheme = '#818cf8';
            bgOverlay = 'rgba(99, 102, 241, 0.1)';
            LeftIcon = Bell;
            iconColor = 'text-indigo-400';
          } else {
            LeftIcon = AlertTriangle;
            iconColor = 'text-rose-450';
          }

          return (
            <ToastCard
              key={toast.id}
              $leftBorderColor={leftBorderColor}
              $bgOverlay={bgOverlay}
            >
              <ToastContent>
                <ToastHeader>
                  <LeftIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                  <ToastTitle $color={alertColorTheme}>
                    {toast.title}
                  </ToastTitle>
                </ToastHeader>
                <ToastMessage>
                  {toast.message}
                </ToastMessage>
                {toast.latitude && toast.longitude && (
                  <ToastAction
                    onClick={() => {
                      const targetPoi = {
                        id: `alert-poi-${toast.id}`,
                        name_en: `Alert: ${toast.title}`,
                        latitude: Number(toast.latitude),
                        longitude: Number(toast.longitude),
                        category_name: 'Alert Target',
                        description: toast.message
                      };
                      setNavTarget(targetPoi);
                      setArrivalNotify(false);
                      dismissToast(toast.id);
                      router.push('/user-test-page/navigation');
                    }}
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Navigate route</span>
                    <ArrowRight className="w-3 h-3 arrow-right" />
                  </ToastAction>
                )}
              </ToastContent>
              <ToastDismiss onClick={() => dismissToast(toast.id)}>
                <X className="w-3.5 h-3.5" />
              </ToastDismiss>
            </ToastCard>
          );
        })}
      </ToastsContainer>
      


      <ContentArea>
        {children}
      </ContentArea>

      {/* BOTTOM TAB NAVIGATION BAR */}
      {showNav && (
        <BottomNav>
          <NavButton
            $isActive={currentTab === 'home'}
            $activeColor="#d97706"
            onClick={() => {
              setScreenMode('home');
              router.push('/user-test-page/home');
            }}
          >
            <LayoutGrid className="w-5 h-5" />
            <NavButtonText>Home</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'map'}
            $activeColor="#22d3ee"
            onClick={() => {
              router.push('/user-test-page/map');
            }}
          >
            <Map className="w-5 h-5" />
            <NavButtonText>Map</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'alerts'}
            $activeColor="#ef4444"
            onClick={() => {
              router.push('/user-test-page/alerts');
            }}
          >
            <Megaphone className="w-5 h-5" />
            <NavButtonText>Alerts</NavButtonText>
            {notifications.filter(n => !dismissedNotificationIds.includes(n.id)).length > 0 && (
              <NavBadge>
                {notifications.filter(n => !dismissedNotificationIds.includes(n.id)).length}
              </NavBadge>
            )}
          </NavButton>

          <NavButton
            $isActive={currentTab === 'help'}
            $activeColor="#fafafa"
            onClick={() => {
              router.push('/user-test-page/help');
            }}
          >
            <HelpCircle className="w-5 h-5" />
            <NavButtonText>Help</NavButtonText>
          </NavButton>
        </BottomNav>
      )}
    </RootContainer>
  );
}

export default function UserTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserTestProvider>
      <UserTestLayoutContent>{children}</UserTestLayoutContent>
    </UserTestProvider>
  );
}
