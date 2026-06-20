'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { StyledButton } from '@/components/style/button/Button.Styled';

// Lucide Icons
import {
  AlertTriangle,
  MapPin,
  Compass,
  Phone,
  PhoneCall,
  Volume2,
  RefreshCw,
  Map as MapIcon,
  ArrowRight
} from 'lucide-react';

import { MdLocalPolice, MdDirectionsWalk } from "react-icons/md";
import { FaBriefcaseMedical } from "react-icons/fa";
import { PiBabyFill } from "react-icons/pi";
import { FaHeadset } from "react-icons/fa";
import { RiPoliceBadgeFill } from "react-icons/ri";

// Subcomponents
import SupportHeader from '@/components/SupportHeader';

// Styled Components
import {
  HelpContainer,
  ScrollContent,
  EmergencyCard,
  EmergencyIconCircle,
  EmergencyTextGroup,
  EmergencyGrid,
  GridOptionCard,
  OptionIconBox,
  LocationPanelCard,
  LocationHeaderRow,
  RefreshLinkButton,
  CoordsBlockRow,
  CoordItemBlock,
  QuickDialHeader,
  HelplinesCardList,
  HelplineCardItem,
  HelplineContentLeft,
  HelplineIconCircleBox,
  DialCircleBtn
} from './page.styled';

export default function EventHelpPage() {
  const router = useRouter();
  const {
    selectedEvent,
    userGps,
    getRealGps,
    setUserGps,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    triggerToast
  } = useUserTest();

  const { t } = useLanguage();

  if (!selectedEvent) return null;

  // Resolve dynamic booth image depending on active mela
  const getBoothImage = () => {
    const name = selectedEvent?.name?.toLowerCase() || '';
    const id = selectedEvent?.id?.toLowerCase() || '';
    if (name.includes('bali') || id.includes('bali')) return '/baliyatra_banner.png';
    if (name.includes('kumbh') || id.includes('kumbh')) return '/kumbhmela_banner.png';
    return '/rathyatra_banner.png';
  };

  // Handles coordinate updates
  const handleUpdateLocation = async () => {
    try {
      const pos = await getRealGps();
      if (pos) {
        setUserGps(pos);
        triggerToast({
          id: `gps-upd-help-${Date.now()}`,
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
    const lat = userGps ? userGps[0].toFixed(6) : '19.813400';
    const lng = userGps ? userGps[1].toFixed(6) : '85.831200';
    const text = `Latitude ${lat}, Longitude ${lng}`;
    
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    
    triggerToast({
      id: `share-coord-help-${Date.now()}`,
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

  // Handles emergency request button click
  const handleEmergencyRequest = (category: string) => {
    triggerToast({
      id: `help-req-help-${category}-${Date.now()}`,
      title: `Emergency: ${category}`,
      message: `Help request transmitted offline for ${category}. Responders notified of your GPS coordinates.`,
      is_emergency: true
    });
  };

  // Handles path navigation to nearest support booth
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
    router.push('/melamarg/navigation?returnUrl=/melamarg/help');
  };

  const currentLat = userGps ? `${userGps[0].toFixed(4)}° N` : '19.8134° N';
  const currentLng = userGps ? `${userGps[1].toFixed(4)}° E` : '85.8312° E';

  const helplineList = [
    { name: t('policeControlRoom'), number: '100', icon: MdLocalPolice },
    { name: t('ambulanceServices'), number: '108', icon: FaBriefcaseMedical },
    { name: t('nationalHelpLine'), number: '112', icon: AlertTriangle }
  ];

  const emergencyCategories = [
    { id: 'police', label: t('police'), icon: RiPoliceBadgeFill, size: 38 },
    { id: 'medical', label: t('medical'), icon: FaBriefcaseMedical, size: 38 },
    { id: 'lostChild', label: t('lostChild'), icon: PiBabyFill, size: 38 },
    { id: 'helpdesk', label: t('helpdesk'), icon: FaHeadset, size: 38 }
  ];

  return (
    <HelpContainer>
      {/* 1. Header component displaying event name, online/offline state and language switcher */}
      <SupportHeader />

      {/* Main dashboard scrollable content area */}
      <ScrollContent>
        {/* 2. Emergency Services Alert Box */}
        <EmergencyCard>
          <EmergencyIconCircle>
            <AlertTriangle />
          </EmergencyIconCircle>
          <EmergencyTextGroup>
            <Text variant="subSectionTitle" weight={700} color="#ba1a1a" style={{  margin: 0 }}>
              {t('emergencyAssistance')}
            </Text>
            <Text variant="bodySmall" weight={600} color="#ba1a1a" style={{ fontSize: '12.5px', lineHeight: 1.4, margin: 0, opacity: 0.9 }}>
              {t('emergencySub')}
            </Text>
          </EmergencyTextGroup>
        </EmergencyCard>

        {/* 3. 2x2 Emergency Grid */}
        <EmergencyGrid>
          {emergencyCategories.map((item) => {
            const Icon = item.icon;
            return (
              <GridOptionCard key={item.id} onClick={() => handleEmergencyRequest(item.label)}>
                <OptionIconBox>
                  <Icon size={item.size} color="#ba1a1a" fill="#ba1a1a" />
                </OptionIconBox>
                <Text variant="bodySecondary" weight={600} color={colors.neutral[900]} style={{ margin: 0 }}>
                  {item.label}
                </Text>
              </GridOptionCard>
            );
          })}
        </EmergencyGrid>

        {/* 4. Current Location Card */}
        <LocationPanelCard>
          <LocationHeaderRow>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: colors.neutral[900] }}>
              <Compass size={18} strokeWidth={2.25} />
              <Text variant="subSectionTitle" weight={700} color="inherit" style={{  letterSpacing: '-0.01em', margin: 0 }}>
                {t('currentLocation')}
              </Text>
            </div>
            
            <RefreshLinkButton onClick={handleUpdateLocation}>
              <RefreshCw />
              <Text variant="bodySmall" weight={800} color="inherit" style={{ margin: 0 }}>
                {t('update')}
              </Text>
            </RefreshLinkButton>
          </LocationHeaderRow>

          <CoordsBlockRow>
            <CoordItemBlock>
              <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '9px', letterSpacing: '0.04em', margin: 0 }}>
                {t('latitude')}
              </Text>
              <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '20px', letterSpacing: '-0.02em', margin: 0 }}>
                {currentLat}
              </Text>
            </CoordItemBlock>

            <CoordItemBlock $hasDivider>
              <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '9px', letterSpacing: '0.04em', margin: 0 }}>
                {t('longitude')}
              </Text>
              <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '20px', letterSpacing: '-0.02em', margin: 0 }}>
                {currentLng}
              </Text>
            </CoordItemBlock>
          </CoordsBlockRow>

          {/* Black share verbally button matching mockup using StyledButton */}
          <StyledButton
            variant="dark"
            width="100%"
            height="48px"
            radius="12px"
            onClick={handleShareVerbally}
            style={{ fontWeight: 500, gap: '0.5rem' }}
          >
            <Volume2 size={16} />
            <Text variant="button" weight={400} color={colors.base.white} style={{ margin: 0 }}>
              {t('shareCoordinates')}
            </Text>
          </StyledButton>
        </LocationPanelCard>

        {/* Nearest Help Booth Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEF2F6',
            borderRadius: '1.5rem',
            overflow: 'hidden',
            width: '100%',
            flexShrink: 0,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '152px', background: '#EEF2F6' }}>
            <img
              src={getBoothImage()}
              alt="Help Booth"
              width="100%"
              height="100%"
              style={{ objectFit: 'cover', display: 'block', width: '100%', height: '100%' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.65)',
                borderRadius: '8px',
                padding: '5px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fff',
              }}
            >
              <MapPin size={13} color="#fff" />
              <span style={{ fontSize: 9, fontWeight: 800 }}>Grand Road Booth #04</span>
            </div>
          </div>

          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0F172A' }}>
                  {t('nearestHelpBooth')}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>
                  250 {t('metersAway')} (3 {t('minWalk')})
                </div>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: '#D3E2F2',
                  color: '#4B6E96',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdDirectionsWalk size={22} />
              </div>
            </div>

            <button
              onClick={handleNavigateNearestBooth}
              style={{
                width: '100%',
                height: 45,
                borderRadius: 9999,
                border: '1px solid #E65100',
                background: '#fff',
                color: '#E65100',
                fontWeight: 700,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <MapIcon size={16} />
              {t('showPath')}
            </button>
          </div>
        </div>

        {/* 6. Quick Dial Directory Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', width: '100%' }}>
          <QuickDialHeader>
            <Text variant="bodyTiny" weight={800} color={colors.brand.secondary} style={{ fontSize: '9.5px', letterSpacing: '0.08em', margin: 0 }}>
              {t('quickDial')}
            </Text>
          </QuickDialHeader>

          <HelplinesCardList>
            {helplineList.map((hp) => {
              const Icon = hp.icon;
              return (
                <HelplineCardItem key={hp.number} href={`tel:${hp.number}`}>
                  <HelplineContentLeft>
                    <HelplineIconCircleBox>
                      <Icon />
                    </HelplineIconCircleBox>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                      <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{  margin: 0 }}>
                        {hp.name}
                      </Text>
                      <Text variant="caption" weight={600} color={colors.neutral[700]} style={{  margin: 0 }}>
                        {t('dial')} {hp.number}
                      </Text>
                    </div>
                  </HelplineContentLeft>

                  <DialCircleBtn>
                    <Phone />
                  </DialCircleBtn>
                </HelplineCardItem>
              );
            })}
          </HelplinesCardList>
        </div>

        {/* Share Feedback Card */}
        <div
          onClick={() => router.push('/melamarg/ideas')}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EEF2F6',
            borderRadius: '1.5rem',
            padding: '20px',
            width: '100%',
            flexShrink: 0,
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxSizing: 'border-box'
          }}
        >
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0F172A' }}>
              {t('ideas')}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', marginTop: '2px' }}>
              {t('voiceOfVisitor')}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F1F5F9',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRight size={18} />
          </div>
        </div>

      </ScrollContent>
    </HelpContainer>
  );
}
