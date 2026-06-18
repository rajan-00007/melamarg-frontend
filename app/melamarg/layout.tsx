'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserTestProvider, useUserTest } from './context/UserTestContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
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
  Usb,
  Home,
  Store,
  MessageSquare
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
  NavIconWrapper,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  FloatingExploreButton
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
    setScreenMode,
    triggerToast
  } = useUserTest();

  const { t } = useLanguage();

  // First visit check: redirect to language selection page if no language chosen yet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mm_language');
      const isLanguageRoute = pathname === '/user-test-page/language';
      if (!savedLang && !isLanguageRoute) {
        router.push(`/user-test-page/language?returnUrl=${pathname}`);
      }
    }
  }, [pathname, router]);

  // If no event is selected and we try to access sub-routes, redirect to the selector
  useEffect(() => {
    const isSetupRoute = pathname === '/user-test-page';
    const isLanguageRoute = pathname === '/user-test-page/language';
    if (!selectedEvent && !isSetupRoute && !isLanguageRoute) {
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
  let currentTab: 'home' | 'map' | 'shops' | 'alerts' | 'help' | 'ideas' | 'all-pois' | null = null;
  if (pathname.endsWith('/home')) currentTab = 'home';
  else if (pathname.endsWith('/map')) currentTab = 'map';
  else if (pathname.endsWith('/alerts')) currentTab = 'alerts';
  else if (pathname.endsWith('/help')) currentTab = 'help';
  else if (pathname.endsWith('/shops')) currentTab = 'shops';
  else if (pathname.endsWith('/all-pois')) currentTab = 'all-pois';
  else if (pathname.endsWith('/ideas')) currentTab = 'ideas';

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
                  <LeftIcon className="w-3.5 h-3.5" style={{ color: leftBorderColor }} />
                  <ToastTitle>
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

      {/* Fixed Explore Map button on Home Page - outside animated scope to prevent movement */}
      {currentTab === 'home' && (
        <FloatingExploreButton onClick={() => router.push('/user-test-page/map')}>
          <Compass style={{ transform: 'rotate(0deg)' }} />
          <span>{t('exploreLiveMap')}</span>
        </FloatingExploreButton>
      )}

      {/* BOTTOM TAB NAVIGATION BAR */}
      {showNav && (
        <BottomNav>
          <NavButton
            $isActive={currentTab === 'home'}
            $activeColor="#1d4ed8"
            onClick={() => {
              setScreenMode('home');
              router.push('/user-test-page/home');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'home'}>
              <Home />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'home'}>{t('home')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'map'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/user-test-page/map');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'map'}>
              <Map />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'map'}>{t('map')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'all-pois'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/user-test-page/all-pois');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'all-pois'}>
              <LayoutGrid />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'all-pois'}>{t('categories')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'alerts'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/user-test-page/alerts');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'alerts'}>
              <Bell />
            </NavIconWrapper>
            {notifications.filter(n => !dismissedNotificationIds.includes(n.id)).length > 0 && (
              <NavBadge>
                {notifications.filter(n => !dismissedNotificationIds.includes(n.id)).length}
              </NavBadge>
            )}
            <NavButtonText $isActive={currentTab === 'alerts'}>{t('alerts')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'help'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/user-test-page/help');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'help'}>
              <HelpCircle />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'help'}>{t('support')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'ideas'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/user-test-page/ideas');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'ideas'}>
              <MessageSquare />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'ideas'}>{t('ideas')}</NavButtonText>
          </NavButton>
        </BottomNav>
      )}
    </RootContainer>
  );
}

export default function UserTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserTestProvider>
      <LanguageProvider>
        <UserTestLayoutContent>{children}</UserTestLayoutContent>
      </LanguageProvider>
    </UserTestProvider>
  );
}
