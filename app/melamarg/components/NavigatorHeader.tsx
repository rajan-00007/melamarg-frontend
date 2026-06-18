'use client';

import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Signal, Settings, Globe } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';

// Keyframes for indicator pulse
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

// Helper to format dynamic Event Navigator Name
export const getEventNavigatorName = (eventName: string) => {
  if (!eventName) return 'Mela Navigator';
  
  // Clean string: remove years, dashes and locations
  let name = eventName.replace(/\d{4}/g, '').replace(/-.*/g, '').trim();
  
  // Title Case conversion
  name = name.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  // Clean extra spaces
  name = name.replace(/\s+/g, ' ');

  // Shorthand translations
  if (name === 'Rath Yatra') return 'Ratha Navigator';
  
  if (name.includes('Navigator')) return name;
  return `${name} Navigator`;
};

// Styled Components
const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  z-index: 45;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
`;

const LogoText = styled.h1`
  font-family: 'Atkinson Hyperlegible Next', sans-serif;
  font-size: 17px;
  font-weight: 800;
  color: #E65100; /* Brand Primary */
  margin: 0;
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusPill = styled.div<{ $isLive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: ${props => props.$isLive ? 'rgba(16, 185, 129, 0.08)' : 'rgba(113, 113, 122, 0.08)'};
  border: 1px solid ${props => props.$isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(113, 113, 122, 0.15)'};
  color: ${props => props.$isLive ? '#065f46' : '#27272a'};
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.03em;

  span.dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: ${props => props.$isLive ? '#10b981' : '#71717a'};
    animation: ${pulse} 2s infinite;
  }
`;

const LangBadge = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background-color: #EEF2F6; /* Neutral 500_2 */
  border: 1px solid rgba(0, 0, 0, 0.04);
  color: #475569; /* Neutral 800 */
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background-color: #DBE6FC;
  }
`;

const DevSettingsButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border-radius: 6px;
  background-color: transparent;
  border: 0;
  color: #91949D; /* Neutral 700 */
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #475569;
  }

  svg {
    width: 0.95rem;
    height: 0.95rem;
  }
`;

// Modal overlay for language selection
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalContent = styled.div`
  background-color: #FFFFFF;
  border-radius: 2rem;
  padding: 1.75rem;
  width: 100%;
  max-width: 340px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: center;
`;

const LangGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const LangOptionButton = styled.button<{ $isActive: boolean }>`
  padding: 1rem 0.5rem;
  border-radius: 1rem;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s;
  
  ${props => props.$isActive ? `
    border: 2px solid #E65100; /* Brand Primary */
    background-color: #FCF2E7; /* Yellow 100 / soft orange */
    color: #E65100;
  ` : `
    border: 1px solid #E5EAF0; /* Neutral 500 border */
    background-color: #FFFFFF;
    color: #475569; /* Neutral 800 */
    &:hover {
      background-color: #F9FAFC;
    }
  `}
`;

interface NavigatorHeaderProps {
  onToggleDevBanner?: () => void;
}

export default function NavigatorHeader({ onToggleDevBanner }: NavigatorHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedEvent, gpsStatus, offlineMode } = useUserTest();
  const { language, t } = useLanguage();

  if (!selectedEvent) return null;

  const eventTitle = getEventNavigatorName(selectedEvent.name);
  const isLive = gpsStatus === 'locked' && !offlineMode;

  return (
    <>
      <HeaderContainer>
        <LogoText>{eventTitle}</LogoText>

        <ControlsGroup>
          <StatusPill $isLive={isLive}>
            <span className="dot" />
            <span>{isLive ? t('gpsLive') : t('offline')}</span>
          </StatusPill>

          <LangBadge onClick={() => router.push(`/user-test-page/language?returnUrl=${pathname}`)}>
            {language}
          </LangBadge>

          {onToggleDevBanner && (
            <DevSettingsButton onClick={onToggleDevBanner} title="Developer Endpoints">
              <Settings />
            </DevSettingsButton>
          )}
        </ControlsGroup>
      </HeaderContainer>
    </>
  );
}
