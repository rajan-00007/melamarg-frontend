'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
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

  return (
    <AlertPageHeader>
      <BackButton onClick={() => router.push('/user-test-page/home')}>
        <ChevronLeft />
      </BackButton>
      <TitleContainer>
        <TitleText>ALERTS</TitleText>
        <SubtitleText>Safety Net</SubtitleText>
      </TitleContainer>
      <EmergencyLiveBadge>
        <span className="dot" />
        <span>Emergency Live</span>
      </EmergencyLiveBadge>
    </AlertPageHeader>
  );
}
