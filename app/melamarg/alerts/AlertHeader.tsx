'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Menu } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUserTest } from '@/context/UserTestContext';
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
  const { setIsSidebarOpen } = useUserTest();

  return (
    <AlertPageHeader>
      <BackButton onClick={() => setIsSidebarOpen(true)} aria-label="Menu">
        <Menu />
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
