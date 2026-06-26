'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserTestProvider, useUserTest } from '@/context/UserTestContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
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
  MessageSquare,
  Settings,
  Route,
  Bookmark,
  Globe,
  Car,
  Users
} from 'lucide-react';

import { getEventNavigatorName } from '@/components/NavigatorHeader';
import { FamilyProvider } from '@/context/FamilyContext';

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
  FloatingExploreButton,
  FloatDevButton,
  SidebarBackdrop,
  SidebarContainer,
  SidebarHeader,
  SidebarTitleWrapper,
  SidebarTitle,
  SidebarSubtitle,
  SidebarCloseButton,
  SidebarList,
  SidebarItem,
  SidebarFooter,
  SidebarFooterText
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
    isInitialized,
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
    triggerToast,
    isSidebarOpen,
    setIsSidebarOpen
  } = useUserTest();

  const { t } = useLanguage();
  const [showDevBanner, setShowDevBanner] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Auto-hide bottom navigation bar on Map Page, synchronized with Map page state
  const [isBottomNavVisible, setIsBottomNavVisible] = useState<boolean>(true);

  useEffect(() => {
    // If not on map page, ensure bottom nav is always visible
    if (!pathname.endsWith('/map')) {
      setIsBottomNavVisible(true);
      return;
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsBottomNavVisible(customEvent.detail.visible);
    };

    window.addEventListener('map-controls-visible', handleSync);

    return () => {
      window.removeEventListener('map-controls-visible', handleSync);
    };
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // First visit check: redirect to language selection page if no language chosen yet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mm_language');
      const isLanguageRoute = pathname === '/melamarg/language' || pathname === '/melamarg/language/';
      if (!savedLang && !isLanguageRoute) {
        router.push(`/melamarg/language?returnUrl=${pathname}`);
      }
    }
  }, [pathname, router]);

  // If no event is selected and we try to access sub-routes, redirect to the selector
  useEffect(() => {
    if (!isInitialized) return; // Wait until local storage state is loaded
    
    const isSetupRoute = pathname === '/melamarg' || pathname === '/melamarg/';
    const isLanguageRoute = pathname === '/melamarg/language' || pathname === '/melamarg/language/';
    if (!selectedEvent && !isSetupRoute && !isLanguageRoute) {
      router.push(`/melamarg?returnUrl=${pathname}`);
    }
  }, [isInitialized, selectedEvent, pathname, router]);

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
          router.push('/melamarg/map');
        }
      }
    }
  }, [selectedEvent, pathname, router, setNavTarget]);

  // Determine active tab based on pathname
  let currentTab: 'home' | 'map' | 'shops' | 'alerts' | 'help' | 'advisories' | 'all-pois' | null = null;
  if (pathname.endsWith('/home')) currentTab = 'home';
  else if (pathname.endsWith('/map')) currentTab = 'map';
  else if (pathname.endsWith('/alerts')) currentTab = 'alerts';
  else if (pathname.endsWith('/help')) currentTab = 'help';
  else if (pathname.endsWith('/shops')) currentTab = 'shops';
  else if (pathname.endsWith('/all-pois')) currentTab = 'all-pois';
  else if (pathname.endsWith('/advisories')) currentTab = 'advisories';

  const isSetupRoute = pathname.endsWith('/melamarg') || pathname.endsWith('/melamarg/');
  const isNavigatingRoute = pathname.endsWith('/navigation');
  const isLanguageRoute = pathname.includes('/language');
  const showNav = selectedEvent && !isSetupRoute && !isLanguageRoute;

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

  // Prevent hydration flashing/blinking and side effects during initial mount or redirect phases
  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <div className="animate-pulse text-slate-400 font-medium" style={{ fontFamily: 'system-ui, sans-serif' }}>Loading...</div>
      </div>
    );
  }

  const savedLang = typeof window !== 'undefined' ? localStorage.getItem('mm_language') : null;

  // 1. Language redirect check
  if (!savedLang && !isLanguageRoute) {
    return null; // Let the useEffect redirect run, render nothing to avoid blinking
  }

  // 2. Setup/Selected event redirect check
  if (isInitialized && !selectedEvent && !isSetupRoute && !isLanguageRoute) {
    return null; // Let the useEffect redirect run, render nothing to avoid blinking
  }

  return (
    <RootContainer>
      {/* Mobile Sidebar Navigation */}
      <SidebarBackdrop $isOpen={isSidebarOpen} onClick={() => setIsSidebarOpen(false)} />
      <SidebarContainer $isOpen={isSidebarOpen}>
        <SidebarHeader>
          <SidebarTitleWrapper>
            <SidebarTitle>{selectedEvent ? getEventNavigatorName(selectedEvent.name) : 'MelaMarg'}</SidebarTitle>
            <SidebarSubtitle>{t('melaMarg')}</SidebarSubtitle>
          </SidebarTitleWrapper>
          <SidebarCloseButton onClick={() => setIsSidebarOpen(false)}>
            <X size={18} />
          </SidebarCloseButton>
        </SidebarHeader>

        <SidebarList>
          <SidebarItem 
            $isActive={pathname.includes('/family')}
            onClick={() => {
              setIsSidebarOpen(false);
              router.push('/melamarg/family');
            }}
          >
            <Users />
            <span>{t('familyMeetup') || 'Family Meetup'}</span>
          </SidebarItem>

          <SidebarItem 
            $isActive={pathname.endsWith('/saved-spot')}
            onClick={() => {
              setIsSidebarOpen(false);
              router.push('/melamarg/saved-spot');
            }}
          >
            <Bookmark />
            <span>{t('savedSpot')}</span>
          </SidebarItem>

          <SidebarItem 
            $isActive={pathname.endsWith('/parking')}
            onClick={() => {
              setIsSidebarOpen(false);
              router.push('/melamarg/parking');
            }}
          >
            <Car />
            <span>{t('liveParking') || 'Parking'}</span>
          </SidebarItem>

          <SidebarItem 
            $isActive={pathname.endsWith('/ideas')}
            onClick={() => {
              setIsSidebarOpen(false);
              router.push('/melamarg/ideas');
            }}
          >
            <MessageSquare />
            <span>{t('feedback')}</span>
          </SidebarItem>

          <SidebarItem 
            onClick={() => {
              setIsSidebarOpen(false);
              router.push('/melamarg');
            }}
          >
            <RefreshCw />
            <span>{t('changeFestival') || 'Switch Festival / Event'}</span>
          </SidebarItem>

          <SidebarItem 
            $isActive={pathname.endsWith('/language')}
            onClick={() => {
              setIsSidebarOpen(false);
              router.push(`/melamarg/language?returnUrl=${pathname}`);
            }}
          >
            <Globe />
            <span>{t('language') || 'Language Settings'}</span>
          </SidebarItem>
        </SidebarList>

        <SidebarFooter>
          <SidebarFooterText>MelaMarg App</SidebarFooterText>
          <span style={{ fontSize: '9px', fontWeight: 600, color: '#94A3B8' }}>v1.2.0 (Offline Native)</span>
        </SidebarFooter>
      </SidebarContainer>


      {/* Global Offline Status Notification Banner */}
      {offlineMode && (
        <div style={{
          backgroundColor: '#feebc8',
          color: '#c05621',
          padding: '0.6rem 1rem',
          fontSize: '11px',
          fontWeight: 800,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #fbd38d',
          zIndex: 39,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <AlertTriangle style={{ width: '14px', height: '14px', color: '#dd6b20' }} />
            <span>Running in Offline Mode (using cached maps & data)</span>
          </div>
          {typeof window !== 'undefined' && !navigator.onLine ? (
            <span style={{ fontSize: '10px', opacity: 0.8 }}>(Browser is offline)</span>
          ) : (
            <button 
              onClick={() => setOfflineMode(false)}
              style={{
                backgroundColor: '#dd6b20',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '10px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c05621'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dd6b20'}
            >
              Go Online
            </button>
          )}
        </div>
      )}
      
      {/* Dynamic Glassmorphic Toasts Container */}
      <ToastsContainer>
        {activeToasts.map(toast => {
          const isEmergency = toast.is_emergency;
          const isService = toast.title.toUpperCase().includes('SERVICE');
          const isAdvisory = toast.title.toUpperCase().includes('ADVISORY') || toast.title.toUpperCase().includes('CROWD') || !!toast.advisory_id;

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
                {toast.advisory_id ? (
                  <ToastAction
                    onClick={() => {
                      dismissToast(toast.id);
                      router.push('/melamarg/advisories');
                    }}
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>{t('viewDetourMap')}</span>
                    <ArrowRight className="w-3 h-3 arrow-right" />
                  </ToastAction>
                ) : toast.latitude && toast.longitude && (
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
                      router.push(`/melamarg/navigation?returnUrl=${pathname}`);
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
        <BottomNav $visible={isBottomNavVisible} $isMapPage={currentTab === 'map' || pathname.endsWith('/navigation')}>
          <NavButton
            $isActive={currentTab === 'home'}
            $activeColor="#1d4ed8"
            onClick={() => {
              setScreenMode('home');
              router.push('/melamarg/home');
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
              router.push('/melamarg/map');
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
              router.push('/melamarg/all-pois');
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
              router.push('/melamarg/alerts');
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
              router.push('/melamarg/help');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'help'}>
              <HelpCircle />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'help'}>{t('support')}</NavButtonText>
          </NavButton>

          <NavButton
            $isActive={currentTab === 'advisories'}
            $activeColor="#1d4ed8"
            onClick={() => {
              router.push('/melamarg/advisories');
            }}
          >
            <NavIconWrapper $isActive={currentTab === 'advisories'}>
              <Route />
            </NavIconWrapper>
            <NavButtonText $isActive={currentTab === 'advisories'}>{t('advisories')}</NavButtonText>
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
        <FamilyProvider>
          <UserTestLayoutContent>{children}</UserTestLayoutContent>
        </FamilyProvider>
      </LanguageProvider>
    </UserTestProvider>
  );
}
