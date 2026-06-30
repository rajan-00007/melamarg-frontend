'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest, POIItem } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { 
  Bell, 
  Shield, 
  Plus, 
  Baby, 
  HelpCircle, 
  RefreshCw, 
  Volume2, 
  Compass, 
  PhoneCall, 
  ChevronRight,
  WifiOff,
  BellOff
} from 'lucide-react';

// Subcomponents
import AlertHeader from './AlertHeader';
import AlertFeedCard from './AlertFeedCard';

// Styled Components
import {
  AlertsContainer,
  AlertsFeed,
  EmptyFeed,
  EmptyTitle,
  EmptySubtitle,
  EmergencyCard,
  EmergencyGrid,
  EmergencyButton,
  EmergencyIconBox,
  LocationCard,
  CoordsRow,
  CoordBlock,
  CoordLabel,
  CoordValue,
  ShareButton,
  BoothCard,
  BoothOverlayImage,
  BoothCardContent,
  BoothHeader,
  BoothBadge,
  BoothActionBtn,
  HelplinesCard,
  HelplinesList,
  HelplineItem,
  HelplineLeft,
  HelplineIconBox,
  HelplineNumberPill
} from './page.styled';

const MOCK_PAGE_ALERTS = [
  {
    id: 'mock-alert-1',
    title: 'Emergency: Medical Post Alpha',
    message: 'A new medical assistance point is now live near Sector 4 (Mahanadi Gadi).',
    created_at: new Date(Date.now() - 2 * 60000).toISOString(),
    is_emergency: true,
    category: 'CRITICAL' as const,
    timeLabel: '2M AGO',
    latitude: 19.805,
    longitude: 85.825,
    actionText: 'NAVIGATE TO MEDICAL POST'
  },
  {
    id: 'mock-alert-2',
    title: 'Crowd Advisory: Main Stage',
    message: 'High density reported near the cultural stage. Please use alternate paths through the handicraft zone.',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    is_emergency: false,
    category: 'WARNING' as const,
    timeLabel: '15M AGO',
    latitude: 19.806,
    longitude: 85.826,
    actionText: 'AVOID AREA / FIND ALTERNATE'
  },
  {
    id: 'mock-alert-3',
    title: 'Weather Update',
    message: 'Clear skies expected for the evening. Perfect time for the laser show at 7:00 PM.',
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    is_emergency: false,
    category: 'INFO' as const,
    timeLabel: '1H AGO',
    latitude: 19.807,
    longitude: 85.827,
    actionText: 'NAVIGATE TO LASER SHOW'
  }
];

export default function EventAlertsPage() {
  const router = useRouter();
  const {
    selectedEvent,
    notifications,
    dismissedNotificationIds,
    userGps,
    getRealGps,
    setUserGps,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    triggerToast,
    offlineMode
  } = useUserTest();

  const { t } = useLanguage();
  const [isBrowserOnline, setIsBrowserOnline] = React.useState(true);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsBrowserOnline(navigator.onLine);
    }

    const handleOnline = () => setIsBrowserOnline(true);
    const handleOffline = () => setIsBrowserOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const isEffectiveOnline = isBrowserOnline && !offlineMode;

  if (!selectedEvent) return null;

  const activeAlerts = notifications ? notifications.filter(n => !dismissedNotificationIds.includes(n.id)) : [];

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return 'JUST NOW';
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'JUST NOW';
    if (diffMins < 60) return `${diffMins}M AGO`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}H AGO`;
    return new Date(dateStr).toLocaleDateString().toUpperCase();
  };

  // Map active live notifications
  const displayAlerts = activeAlerts.map(alert => {
    const isEmergency = alert.is_emergency;
    const isAdvisory = alert.title.toUpperCase().includes('ADVISORY') || 
                       alert.title.toUpperCase().includes('CROWD') || 
                       alert.title.toUpperCase().includes('WARNING');
    
    let category: 'CRITICAL' | 'WARNING' | 'INFO' = 'INFO';
    if (isEmergency) category = 'CRITICAL';
    else if (isAdvisory) category = 'WARNING';

    let actionText = 'NAVIGATE TO LOCATION';
    if (alert.title.toUpperCase().includes('MEDICAL')) {
      actionText = 'NAVIGATE TO MEDICAL POST';
    } else if (alert.title.toUpperCase().includes('ROUTE')) {
      actionText = 'NAVIGATE ALTERNATE';
    }

    return {
      id: alert.id,
      title: alert.title,
      message: alert.message,
      created_at: alert.created_at,
      is_emergency: isEmergency,
      category,
      timeLabel: getRelativeTime(alert.created_at),
      latitude: alert.latitude,
      longitude: alert.longitude,
      actionText
    };
  });

  // Handles coordinate updates
  const handleUpdateLocation = async () => {
    try {
      const pos = await getRealGps();
      if (pos) {
        setUserGps(pos);
        triggerToast({
          id: `gps-upd-${Date.now()}`,
          title: 'Location Updated',
          message: 'Precise GPS coordinates refreshed successfully.',
          is_emergency: false
        });
      }
    } catch (e) {
      console.warn(e);
    }
  };

  // Handles speaking coordinates verbally
  const handleShareVerbally = () => {
    const lat = userGps ? userGps[0].toFixed(6) : '19.805000';
    const lng = userGps ? userGps[1].toFixed(6) : '85.825000';
    const text = `Latitude ${lat}, Longitude ${lng}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    
    triggerToast({
      id: `share-coord-${Date.now()}`,
      title: 'Coordinates Copied',
      message: 'Location coordinates copied to clipboard.',
      is_emergency: false
    });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Latitude ${lat}, Longitude ${lng}`);
      utterance.rate = 0.85; // Speak clearly
      window.speechSynthesis.speak(utterance);
    }
  };

  // Handles requesting help
  const handleEmergencyRequest = (category: string) => {
    triggerToast({
      id: `help-req-${category}-${Date.now()}`,
      title: `Emergency: ${category}`,
      message: `Help request transmitted offline for ${category}. Responders notified of your GPS coordinates.`,
      is_emergency: true
    });
  };

  // Handles navigation to nearest support booth
  const handleNavigateNearestBooth = () => {
    const boothPoi = {
      id: 'mock-booth-4',
      name_en: 'Grand Road Booth #04',
      latitude: 19.8048,
      longitude: 85.8245,
      category_name: 'booth',
      description: 'Grand Road (Bada Danda) emergency sector booth'
    };
    setNavTarget(boothPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(boothPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/alerts');
  };

  const currentLat = userGps ? userGps[0].toFixed(6) : '19.805000';
  const currentLng = userGps ? userGps[1].toFixed(6) : '85.825000';

  const helplines = [
    { name: 'Police Control Room', number: '100' },
    { name: 'Ambulance Services', number: '108' },
    { name: 'National Emergency Line', number: '112' },
    { name: 'Child Help Line', number: '1098' }
  ];

  return (
    <AlertsContainer>
      
      {/* Redesigned Alert Page Header (extracted section) */}
      <AlertHeader />



      {/* 5. Feed of Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Text variant="subSectionTitle" weight={800} color={colors.neutral[700]} style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', paddingLeft: '0.25rem', margin: 0 }}>
          {t('priorityLines')}
        </Text>
        
        <AlertsFeed>
          {!isEffectiveOnline ? (
            <EmptyFeed>
              <WifiOff size={32} style={{ color: colors.neutral[700] }} />
              <EmptyTitle>{t('noInternet')}</EmptyTitle>
              <EmptySubtitle>{t('noInternetDesc')}</EmptySubtitle>
            </EmptyFeed>
          ) : displayAlerts.length === 0 ? (
            <EmptyFeed>
              <BellOff size={32} style={{ color: colors.neutral[700] }} />
              <EmptyTitle>{t('noNotifications')}</EmptyTitle>
              <EmptySubtitle>{t('noNotificationsDesc')}</EmptySubtitle>
            </EmptyFeed>
          ) : (
            displayAlerts.map((alert) => (
              <AlertFeedCard key={alert.id} alert={alert} />
            ))
          )}
        </AlertsFeed>
      </div>

    </AlertsContainer>
  );
}
