'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertTriangle,
  AlertCircle,
  Bell, 
  Compass, 
  Users, 
  Droplet, 
  Plus, 
  Shield, 
  Utensils, 
  Brush, 
  LayoutGrid, 
  ChevronRight, 
  Car,
  Heart,
  MapPin,
  CheckCircle,
  Navigation,
  Menu
} from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { getHaversineDistance } from '@/context/types';

import CurrentZoneBlock from './CurrentZoneBlock';
import AdvisoryNearMe from './AdvisoryNearMe';
import AccessRules from './AccessRules';
import SurroundingByYou from './SurroundingByYou';
import TodayHighlights from './TodayHighlights';
import QuickActions from './QuickActions';

// Static Image Imports for offline asset resolution
import rathyatraBanner1 from '@/public/rathyatra_banner.png';
import rathyatraBanner2 from '@/public/rathyatra_banner2.png';
import rathyatraBanner3 from '@/public/rathyatra_banner3.png';

import baliyatraBanner1 from '@/public/baliyatra_banner.png';
import baliyatraBanner2 from '@/public/baliyatra_banner2.png';
import baliyatraBanner3 from '@/public/baliyatra_banner3.png';

import kumbhmelaBanner1 from '@/public/kumbhmela_banner.png';
import kumbhmelaBanner2 from '@/public/kumbhmela_banner2.png';
import kumbhmelaBanner3 from '@/public/kumbhmela_banner3.png';

// Styled Components
import {
  HomeContainer,
  SliderWrapper,
  SliderContainer,
  SlideItem,
  SlideImage,
  SlideOverlay,
  SlideInfo,
  SlideBadge,
  DotIndicators,
  Dot,
  HomeBody,
  UrgentAlertCard,
  AlertContent,
  AlertText,
  AlertLink,
  NearestHelpCard,
  HelpBadgeWrapper,
  HelpBadgeDot,
  HelpBadgeText,
  HelpCardRow,
  HelpCardButton,
  ActionGrid,
  SosButton,
  SosIconBox,
  GridItemCard,
  GridIconBox,
  ViewAllButton,
  SafetySection,
  SectionTitle,
  SafetyGrid,
  SafetyCard,
  SafetyIconBox,
  LiveParkingRow,
  ParkingIconBox,
  HomeHeader,
  HeaderLeft,
  HeaderRight,
  LocationBadge,
  LiveBadge,
  LangButton
} from './page.styled';

const EVENT_SLIDES_MAP = {
  rathyatra: [
    {
      image: rathyatraBanner1.src,
      title: 'Rath Yatra Puri',
      badge: 'Featured',
      badgeColor: '#E65100'
    },
    {
      image: rathyatraBanner2.src,
      title: 'Temple Heritage',
      badge: 'Art & Culture',
      badgeColor: '#00695C'
    },
    {
      image: rathyatraBanner3.src,
      title: 'Grand Procession',
      badge: 'Live Event',
      badgeColor: '#4C616C'
    }
  ],
  baliyatra: [
    {
      image: baliyatraBanner1.src,
      title: 'Bali Yatra Festival',
      badge: 'Featured',
      badgeColor: '#E65100'
    },
    {
      image: baliyatraBanner2.src,
      title: 'Grand Boita Bandana',
      badge: 'Art & Culture',
      badgeColor: '#00695C'
    },
    {
      image: baliyatraBanner3.src,
      title: 'Cuttack Cultural Stage',
      badge: 'Live Event',
      badgeColor: '#4C616C'
    }
  ],
  kumbhmela: [
    {
      image: kumbhmelaBanner1.src,
      title: 'Maha Kumbh Mela',
      badge: 'Featured',
      badgeColor: '#E65100'
    },
    {
      image: kumbhmelaBanner2.src,
      title: 'Sangam Confluence',
      badge: 'Art & Culture',
      badgeColor: '#00695C'
    },
    {
      image: kumbhmelaBanner3.src,
      title: 'Twilight Diya Ceremony',
      badge: 'Live Event',
      badgeColor: '#4C616C'
    }
  ]
};

export default function RedesignedEventHomePage() {
  const router = useRouter();
  const { 
    selectedEvent, 
    poisList, 
    notifications, 
    triggerToast, 
    setActiveCategory, 
    setNavTarget,
    loadingMapData,
    gpsStatus,
    offlineMode,
    backendUrl,
    userGps,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    setIsSidebarOpen
  } = useUserTest();
  const { language, t, tEventName, tPoiName, tPoiDesc } = useLanguage();
  
  const [activeSlide, setActiveSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const [currentCityName, setCurrentCityName] = useState<string>(() => {
    if (typeof window !== 'undefined' && selectedEvent) {
      return localStorage.getItem(`mm_cached_city_${selectedEvent.id}`) || '';
    }
    return '';
  });
  const fetchedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedEvent) return;
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`mm_cached_city_${selectedEvent.id}`);
      setCurrentCityName(cached || '');
    }
  }, [selectedEvent?.id]);

  useEffect(() => {
    if (!selectedEvent) return;
    const isOnline = !offlineMode && (typeof navigator !== 'undefined' ? navigator.onLine : true);
    if (!isOnline || !userGps || userGps[0] === 0 || userGps[1] === 0) return;
    if (fetchedRef.current === selectedEvent.id) return;

    let isMounted = true;
    const fetchCityName = async () => {
      try {
        const [lat, lng] = userGps;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
          headers: {
            'Accept-Language': 'en'
          }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.address) {
          const city = data.address.city || data.address.town || data.address.village || data.address.suburb || data.address.county;
          if (city && isMounted) {
            setCurrentCityName(city);
            localStorage.setItem(`mm_cached_city_${selectedEvent.id}`, city);
            fetchedRef.current = selectedEvent.id;
          }
        }
      } catch (err) {
        console.warn('Error fetching city name via reverse geocoding:', err);
      }
    };

    fetchCityName();

    return () => {
      isMounted = false;
    };
  }, [userGps, offlineMode, selectedEvent?.id]);

  const getEventSlides = () => {
    if (!selectedEvent) return EVENT_SLIDES_MAP.rathyatra;
    const name = selectedEvent.name.toLowerCase();
    const id = selectedEvent.id.toLowerCase();
    
    let baseSlides = EVENT_SLIDES_MAP.rathyatra;
    if (name.includes('bali') || id.includes('bali')) baseSlides = EVENT_SLIDES_MAP.baliyatra;
    else if (name.includes('kumbh') || id.includes('kumbh')) baseSlides = EVENT_SLIDES_MAP.kumbhmela;

    // Resolve absolute banner image path if it's served from the backend relative path
    let eventBanner = selectedEvent.banner_url;
    if (eventBanner && eventBanner.startsWith('/') && backendUrl) {
      eventBanner = `${backendUrl.replace(/\/+$/, '')}${eventBanner}`;
    }

    return baseSlides.map((slide, idx) => {
      if (idx === 0) {
        return {
          ...slide,
          title: tEventName(selectedEvent), // Display actual event name on the banner
          image: eventBanner || slide.image // Display actual event image if available, otherwise fallback to local
        };
      }
      return slide;
    });
  };

  const slides = getEventSlides();

  // Handle slide dots on scroll
  const handleSliderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container) {
      const scrollPercent = container.scrollLeft / (container.scrollWidth - container.clientWidth);
      const index = Math.round(scrollPercent * 2); // 3 slides total (0, 1, 2)
      if (!isNaN(index) && index >= 0 && index <= 2) {
        setActiveSlide(index);
      }
    }
  };

  // Autoplay Slideshow
  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const container = sliderRef.current;
        const nextIndex = (activeSlide + 1) % slides.length;
        const slideWidth = container.clientWidth;
        
        container.scrollTo({
          left: nextIndex * slideWidth,
          behavior: 'smooth'
        });
      }
    }, 4500); // Auto scroll every 4.5 seconds

    return () => clearInterval(interval);
  }, [activeSlide, slides.length]);

  if (!selectedEvent) return null;

  if (poisList.length === 0 && loadingMapData) {
    return (
      <HomeContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#6b7280', textAlign: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid rgba(230, 81, 0, 0.1)',
            borderTopColor: '#E65100',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <Text variant="bodySecondary" weight={700} color={colors.neutral[900]}>{t('syncingAssets')}</Text>
          <Text variant="bodyTiny" weight={600} color={colors.neutral[700]}>{t('downloadingPois')}</Text>
        </div>
      </HomeContainer>
    );
  }

  // Find Nearest Medical POI dynamically from dataset if loaded
  const medicalPois = poisList.filter(p => 
    p.category_name.toLowerCase().includes('medical') || 
    p.category_name.toLowerCase().includes('firstaid') || 
    p.category_name.toLowerCase().includes('camp')
  );
  
  const nearestMedical = medicalPois.length > 0 
    ? [...medicalPois].sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity))[0] 
    : null;

  const nearestMedicalName = t('medicalHelp') || 'Medical Help';
  const nearestMedicalDistance = nearestMedical ? `${Math.round(nearestMedical.distance || 200)}m` : '200m';
  const nearestMedicalDesc = nearestMedical ? (tPoiDesc(nearestMedical) || t('locatedAshwaDwara')) : t('locatedAshwaDwara');

  // Navigate to Nearest Medical POI
  const handleNavigateNearestMedical = () => {
    if (nearestMedical) {
      setNavTarget(nearestMedical);
      setScreenMode('navigation');
      setArrivalNotify(false);
      logNavigationInstructions(nearestMedical);
      router.push('/melamarg/navigation?returnUrl=/melamarg/home');
    } else {
      // Mock navigation target if database empty
      const mockMedical = {
        id: 'mock-nearest-med',
        name_en: 'Medical Camp - South Gate',
        latitude: 19.8055,
        longitude: 85.8208,
        category_name: 'medical',
        description: 'First aid post setup'
      };
      setNavTarget(mockMedical);
      setScreenMode('navigation');
      setArrivalNotify(false);
      logNavigationInstructions(mockMedical);
      router.push('/melamarg/navigation?returnUrl=/melamarg/home');
    }
  };

  // Trigger SOS Call Card
  const handleSosTrigger = () => {
    triggerToast({
      id: `sos-${Date.now()}`,
      title: 'SOS Emergency Broadcasted',
      message: 'SOS Signal transmitted offline. Emergency dispatch notified of your last GPS coordinates.',
      is_emergency: true
    });
    if (typeof window !== 'undefined') {
      window.location.href = 'tel:112'; // Dial emergency helpline
    }
  };

  // Get Latest Notification dynamically or show default alert
  const latestAlert = notifications && notifications.length > 0 
    ? notifications[0] 
    : { message: 'CROWD ALERT: Heavy congestion at Grand Road', title: 'CROWD ALERT', is_emergency: false };

  const getAlertCategory = (alert: any): 'CRITICAL' | 'WARNING' | 'INFO' => {
    if (!alert) return 'INFO';
    const isEmergency = !!(alert.is_emergency || alert.isEmergency);
    const textToSearch = `${alert.title || ''} ${alert.message || ''}`.toUpperCase();
    const isAdvisory = textToSearch.includes('ADVISORY') || 
                       textToSearch.includes('CROWD') || 
                       textToSearch.includes('WARNING');
    if (isEmergency) return 'CRITICAL';
    if (isAdvisory) return 'WARNING';
    return 'INFO';
  };

  const alertCategory = getAlertCategory(latestAlert);
  
  let AlertIcon = Bell;
  if (alertCategory === 'CRITICAL') AlertIcon = AlertTriangle;
  else if (alertCategory === 'WARNING') AlertIcon = AlertCircle;

  // Categories helper mapping icons and colors
  const services = [
    { id: 'toilet', label: 'Restrooms', icon: Users, bg: 'rgba(76, 97, 108, 0.08)', color: '#4C616C' },
    { id: 'water', label: 'Drinking Water', icon: Droplet, bg: 'rgba(0, 105, 92, 0.08)', color: '#00695C' },
    { id: 'medical', label: 'Medical', icon: Plus, bg: 'rgba(230, 81, 0, 0.08)', color: '#E65100' },
    { id: 'police', label: 'Police', icon: Shield, bg: 'rgba(76, 97, 108, 0.08)', color: '#4C616C' },
    { id: 'food', label: 'Food Camps', icon: Utensils, bg: 'rgba(230, 81, 0, 0.08)', color: '#E65100' },
    { id: 'sanitation', label: 'Sanitation', icon: Brush, bg: 'rgba(0, 105, 92, 0.08)', color: '#00695C' }
  ];

  const eventLocation = currentCityName;
  const isGpsActive = gpsStatus === 'locked' && !offlineMode;

  return (
    <HomeContainer>
      {/* Redesigned Top Header Overlay */}
      <HomeHeader>
        <HeaderLeft onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        </HeaderLeft>
        <HeaderRight>
          {eventLocation && (
            <LocationBadge>
              <CheckCircle />
              <span>{eventLocation}</span>
            </LocationBadge>
          )}
          <LiveBadge style={{ backgroundColor: isGpsActive ? '#84d5c5' : '#E5EAF0', color: isGpsActive ? '#00201b' : '#475569' }}>
            <Compass style={{ opacity: isGpsActive ? 1 : 0.4 }} />
            <span>{isGpsActive ? t('gpsLive') : t('offline')}</span>
          </LiveBadge>
          <LangButton onClick={() => router.push(`/melamarg/language?returnUrl=/melamarg/home`)}>
            {language.toUpperCase()}
          </LangButton>
        </HeaderRight>
      </HomeHeader>
      
      {/* 1. Event Highlights Slider */}
      <SliderWrapper>
        <SliderContainer ref={sliderRef} onScroll={handleSliderScroll}>
          {slides.map((slide, idx) => (
            <SlideItem key={idx}>
              <SlideImage src={slide.image} alt={slide.title} />
              <SlideOverlay />
              <SlideInfo>
                <SlideBadge $bgColor={slide.badgeColor}>
                  {slide.badge === 'Featured' ? t('featured') :
                   slide.badge === 'Art & Culture' ? t('artCulture') :
                   slide.badge === 'Live Event' ? t('liveEvent') : slide.badge}
                </SlideBadge>
                <Text variant="sectionTitle" weight={600} color="#FFFFFF" style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', fontSize: '20px', margin: 0 }}>
                  {slide.title === 'Temple Heritage' ? t('pilgrimGuide') :
                   slide.title === 'Grand Procession' ? t('exploreLiveMap') :
                   slide.title === 'Grand Boita Bandana' ? t('navigatingSafely') :
                   slide.title === 'Cuttack Cultural Stage' ? t('navigatingSafely') :
                   slide.title === 'Sangam Confluence' ? t('exploreLiveMap') :
                   slide.title === 'Twilight Diya Ceremony' ? t('exploreLiveMap') :
                   slide.title}
                </Text>
              </SlideInfo>
            </SlideItem>
          ))}
        </SliderContainer>

        <DotIndicators>
          {slides.map((_, idx) => (
            <Dot key={idx} $active={activeSlide === idx} />
          ))}
        </DotIndicators>
      </SliderWrapper>

      {/* Main Body Contents */}
      <HomeBody>
        <CurrentZoneBlock />
        <AdvisoryNearMe />
        <AccessRules />
        <SurroundingByYou />
        <TodayHighlights />
        <QuickActions />
      </HomeBody>
    </HomeContainer>
  );
}
