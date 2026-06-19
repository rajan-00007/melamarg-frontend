'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertPageHeader,
  BackButton,
  TitleContainer,
  TitleText,
  SubtitleText,
  EmergencyLiveBadge
} from './page.styled';

export default function AlertHeader() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <AlertPageHeader>
      <BackButton onClick={() => router.push('/melamarg/home')}>
        <ChevronLeft />
      </BackButton>
      <TitleContainer>
        <TitleText>{t('alerts').toUpperCase()}</TitleText>
        <SubtitleText>{t('safetyNet')}</SubtitleText>
      </TitleContainer>
      <EmergencyLiveBadge>
        <span className="dot" />
        <span>{t('emergencyLive')}</span>
      </EmergencyLiveBadge>
    </AlertPageHeader>
  );
}
