'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Volume2, VolumeX, LogOut } from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  FloatingBottomWrapper,
  PremiumBottomCard,
  BottomCardProgressHeader,
  BottomCardDestinationText,
  BottomCardPercentageText,
  BottomProgressBarContainer,
  BottomProgressBarFill,
  BottomMetricsRow,
  BottomMetricCol,
  BottomMetricLabel,
  BottomMetricValue,
  BottomActionsRow,
  BottomVoiceButton,
  BottomExitButton
} from './page.styled';

interface NavigationHUDProps {
  stats: any;
  progressPercent: number;
  arrivalTimeStr: string;
  voiceOn: boolean;
  setVoiceOn: React.Dispatch<React.SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export default function NavigationHUD({
  stats,
  progressPercent,
  arrivalTimeStr,
  voiceOn,
  setVoiceOn,
  children
}: NavigationHUDProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t, tPoiName } = useLanguage();
  
  const {
    navTarget,
    setNavTarget,
    setScreenMode,
    setIsWalking
  } = useUserTest();

  const returnUrl = searchParams.get('returnUrl') || '/melamarg/pois';

  const handleExit = () => {
    if (confirm(t('confirmExitNav'))) {
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
    }
  };

  if (!navTarget || !stats) return null;

  return (
    <FloatingBottomWrapper>
      {children}
      <PremiumBottomCard>
        <BottomCardProgressHeader>
          <BottomCardDestinationText>{tPoiName(navTarget)}</BottomCardDestinationText>
          <BottomCardPercentageText>{progressPercent}% {t('complete')}</BottomCardPercentageText>
        </BottomCardProgressHeader>

        <BottomProgressBarContainer>
          <BottomProgressBarFill $percent={progressPercent} />
        </BottomProgressBarContainer>

        <BottomMetricsRow>
          <BottomMetricCol>
            <BottomMetricLabel>{t('arrival')}</BottomMetricLabel>
            <BottomMetricValue className="arrival-time">{arrivalTimeStr}</BottomMetricValue>
          </BottomMetricCol>

          <BottomMetricCol>
            <BottomMetricLabel>{t('time')}</BottomMetricLabel>
            <BottomMetricValue>
              {stats.time < 60 
                ? `${stats.time} ${language === 'hi' ? 'सेकंड' : language === 'or' ? 'ସେକେଣ୍ଡ' : language === 'bn' ? 'সেকেন্ড' : 'sec'}` 
                : `${Math.ceil(stats.time / 60)} ${language === 'hi' ? 'मिनट' : language === 'or' ? 'ମିନିଟ୍' : language === 'bn' ? 'মিনিট' : 'min'}`}
            </BottomMetricValue>
          </BottomMetricCol>

          <BottomMetricCol>
            <BottomMetricLabel>{t('distance')}</BottomMetricLabel>
            <BottomMetricValue>
              {stats.distance < 1000 
                ? `${stats.distance} ${language === 'hi' ? 'मीटर' : language === 'or' ? 'ମିଟର' : language === 'bn' ? 'মিটার' : 'm'}` 
                : `${(stats.distance / 1000).toFixed(2)} ${language === 'hi' ? 'किमी' : language === 'or' ? 'କିମି' : language === 'bn' ? 'কিমি' : 'km'}`}
            </BottomMetricValue>
          </BottomMetricCol>
        </BottomMetricsRow>

        <BottomActionsRow>
          <BottomVoiceButton $active={voiceOn} onClick={() => setVoiceOn(!voiceOn)}>
            {voiceOn ? (
              <Volume2 style={{ width: '1.1rem', height: '1.1rem' }} />
            ) : (
              <VolumeX style={{ width: '1.1rem', height: '1.1rem' }} />
            )}
            <span>{voiceOn ? t('voiceOn') : t('voiceOff')}</span>
          </BottomVoiceButton>

          <BottomExitButton onClick={handleExit}>
            <LogOut style={{ width: '1rem', height: '1rem' }} />
            <span>{t('exit')}</span>
          </BottomExitButton>
        </BottomActionsRow>
      </PremiumBottomCard>
    </FloatingBottomWrapper>
  );
}
