'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Overlay,
  OverlayBox,
  CenterBox,
  WarningIconWrapper,
  OverlayTitle,
  OverlayText,
  OverlayPillWrapper,
  BypassButton,
  StopButton,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  StyledCompassIcon
} from './page.styled';

export default function GpsWaitingOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  
  const {
    gpsStatus,
    userGps,
    gpsAccuracy,
    handleGpsUpdate,
    setNavTarget,
    setScreenMode,
    setIsWalking
  } = useUserTest();

  const returnUrl = searchParams.get('returnUrl') || '/melamarg/pois';

  const handleStopNavigation = () => {
    setNavTarget(null);
    setIsWalking(false);
    if (returnUrl.includes('/advisories')) {
      setScreenMode('home');
    } else if (returnUrl.includes('/map')) {
      setScreenMode('home');
    } else {
      setScreenMode('pois');
    }
    router.push(returnUrl);
  };

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

  if (gpsStatus === 'locked') return null;

  return (
    <Overlay>
      <OverlayBox>
        <CenterBox>
          <WarningIconWrapper>
            <StyledCompassIcon />
          </WarningIconWrapper>
        </CenterBox>
        <OverlayTitle>{t('waitingForGps')}</OverlayTitle>
        <OverlayText>
          {t('gpsRequiredDesc')}
        </OverlayText>
        <OverlayPillWrapper>
          {renderGpsStatusPill()}
        </OverlayPillWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
          <BypassButton 
            onClick={() => handleGpsUpdate({
              coords: { latitude: userGps[0], longitude: userGps[1], accuracy: 12 },
              timestamp: Date.now()
            })}
          >
            {t('forceMockGps')}
          </BypassButton>
          <StopButton onClick={handleStopNavigation}>
            {t('stopNavigation')}
          </StopButton>
        </div>
      </OverlayBox>
    </Overlay>
  );
}
