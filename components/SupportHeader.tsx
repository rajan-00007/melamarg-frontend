'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { getEventNavigatorName } from './NavigatorHeader';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  z-index: 45;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
  box-sizing: border-box;
  width: 100%;
  flex-shrink: 0;
`;

const BrandBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.15;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
`;

const StatusPill = styled.div<{ $isOnline: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 9999px;
  background-color: ${props => props.$isOnline ? 'rgba(16, 185, 129, 0.08)' : 'rgba(113, 113, 122, 0.08)'};
  border: 1px solid ${props => props.$isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(113, 113, 122, 0.15)'};
  color: ${props => props.$isOnline ? '#065f46' : '#64748B'};
  box-sizing: border-box;

  span.dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${props => props.$isOnline ? '#10b981' : '#64748B'};
    animation: ${pulse} 2s infinite;
  }
`;

const LangBadge = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  background-color: #EEF2F6;
  border: 1px solid rgba(0, 0, 0, 0.04);
  color: #475569;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background-color: #DBE6FC;
  }
`;

export default function SupportHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedEvent } = useUserTest();
  const { language } = useLanguage();

  const [isOnline, setIsOnline] = useState(true);

  // Sync browser network connectivity state
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsOnline(navigator.onLine);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

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

  if (!selectedEvent) return null;

  const eventTitle = getEventNavigatorName(selectedEvent.name);
  const words = eventTitle.split(' ');
  const firstLine = words[0] || 'Mela';
  const secondLine = words.slice(1).join(' ') || 'Navigator';

  return (
    <HeaderContainer>
      <BrandBlock>
        {/* Rust Orange Signal SVG Icon matching mockup */}
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E65100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>

        <TitleContainer>
          <Text variant="bodyPrimary" weight={800} color={colors.brand.primary} style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', fontSize: '15px', lineHeight: '1.1', margin: 0 }}>
            {firstLine}
          </Text>
          <Text variant="bodyPrimary" weight={800} color={colors.brand.primary} style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', fontSize: '15px', lineHeight: '1.1', margin: 0 }}>
            {secondLine}
          </Text>
        </TitleContainer>
      </BrandBlock>

      <ControlsGroup>
        <StatusPill $isOnline={isOnline}>
          <span className="dot" />
          <Text variant="bodyTiny" weight={800} color="inherit" style={{ fontSize: '9px', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
            {isOnline ? 'Online Mode' : 'Offline Mode'}
          </Text>
        </StatusPill>

        <LangBadge onClick={() => router.push(`/melamarg/language?returnUrl=${pathname}`)}>
          <Text variant="bodyTiny" weight={800} color="inherit" style={{ fontSize: '9px', margin: 0 }}>
            {language}
          </Text>
        </LangBadge>
      </ControlsGroup>
    </HeaderContainer>
  );
}
