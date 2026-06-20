'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  ArrivalOverlay as OverlayContainer,
  StyledPartyPopper,
  ArrivalTitle,
  ArrivalText,
  ArrivalButton
} from './page.styled';

export default function ArrivalOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tPoiName } = useLanguage();
  
  const {
    navTarget,
    setNavTarget,
    setScreenMode,
    setIsWalking,
    arrivalNotify,
    setArrivalNotify
  } = useUserTest();

  const returnUrl = searchParams.get('returnUrl') || '/melamarg/pois';

  const handleReturn = () => {
    setNavTarget(null);
    setIsWalking(false);
    setArrivalNotify(false);
    if (returnUrl.includes('/advisories')) {
      setScreenMode('home');
    } else if (returnUrl.includes('/map')) {
      setScreenMode('home');
    } else {
      setScreenMode('pois');
    }
    router.push(returnUrl);
  };

  if (!arrivalNotify) return null;

  return (
    <OverlayContainer>
      <StyledPartyPopper />
      <ArrivalTitle>{t('destinationReached')}</ArrivalTitle>
      <ArrivalText>{t('arrivedSafelyAt')} {tPoiName(navTarget)}.</ArrivalText>
      <ArrivalButton onClick={handleReturn}>
        {t('returnToPoiList')}
      </ArrivalButton>
    </OverlayContainer>
  );
}
