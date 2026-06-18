'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/components/style/colors';

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafaf5; /* Neutral surface */
  width: 100%;
  min-height: 100%;
  animation: ${fadeIn} 0.4s ease-out forwards;
  box-sizing: border-box;
  padding-bottom: 7.5rem; /* pb-30 to clear bottom nav */
  position: relative;
`;

// Highlights Slider components
export const SliderWrapper = styled.section`
  position: relative;
  width: 100%;
  height: 14rem; /* h-56 */
  overflow: hidden;
  background-color: #E65100; /* Fallback brand orange background */
  flex-shrink: 0;
`;

export const SliderContainer = styled.div`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  width: 100%;
  height: 100%;
`;

export const SlideItem = styled.div`
  scroll-snap-align: center;
  flex: 0 0 100%;
  position: relative;
  height: 100%;
  width: 100%;
`;

export const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const SlideOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.75) 100%
  );
`;

export const SlideInfo = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

export const SlideBadge = styled.span<{ $bgColor: string }>`
  background-color: ${props => props.$bgColor};
  color: #FFFFFF;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.35rem;
`;

export const DotIndicators = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1.25rem;
  display: flex;
  gap: 0.35rem;
  z-index: 10;
`;

export const Dot = styled.div<{ $active: boolean }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #FFFFFF;
  opacity: ${props => props.$active ? 1 : 0.4};
  transition: opacity 0.2s ease;
`;

// Body container padding
export const HomeBody = styled.div`
  padding: 1.25rem 1.25rem 0 1.25rem; /* px-5 (20px), pt-5 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

// Condensed Urgent Alerts 

interface UrgentAlertCardProps {
  $type: 'CRITICAL' | 'WARNING' | 'INFO';
}

export const UrgentAlertCard = styled.div<UrgentAlertCardProps>`
  color: #FFFFFF;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  display: flex;
  height: 54px;
  align-items: center;
  justify-content: space-between;
  animation: ${pulse} 2s infinite;
  box-sizing: border-box;
  width: 100%;

  ${props => {
    if (props.$type === 'CRITICAL') {
      return `
        background-color: #ef4444;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
      `;
    } else if (props.$type === 'WARNING') {
      return `
        background-color: #ca8a04;
        box-shadow: 0 4px 12px rgba(202, 138, 4, 0.15);
      `;
    } else {
      return `
        background-color: #16a34a;
        box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
      `;
    }
  }}
`;

export const AlertContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
  flex: 1;
`;

export const AlertText = styled.p`
  font-size: 15px;
  font-weight: 400;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const AlertLink = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
  white-space: nowrap;
  margin-left: 0.5rem;
`;

// Refined Nearest Help Card
export const NearestHelpCard = styled.section`
  background: linear-gradient(135deg, #E65100 0%, #a43700 100%);
  color: #FFFFFF;
  padding: 1.25rem;
  min-height: 160px;
  height: auto;
  border-radius: 1.5rem;
  box-shadow: 0 10px 25px rgba(230, 81, 0, 0.12);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
`;

export const HelpBadgeWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.2rem 0.5rem;
  border-radius: 0.35rem;
  margin-bottom: 0.75rem;
`;

export const HelpBadgeDot = styled.span`
  width: 5px;
  height: 5px;
  background-color: #FFFFFF;
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

export const HelpBadgeText = styled.span`
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const HelpCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

export const HelpCardButton = styled.button`
  background-color: #FFFFFF;
  color: #E65100;
  border: 0;
  border-radius: 50%;
  width: 2.75rem;
  height: 2.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.1s;
  
  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 1.35rem;
    height: 1.35rem;
    stroke-width: 2.5;
  }
`;

// Quick Action Grid
export const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
`;

export const SosButton = styled.button`
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #ffdad6; /* error-container */
  border: 1px solid rgba(186, 26, 26, 0.15);
  color: #93000a; /* on-error-container */
  padding: 1rem;
  border-radius: 1.25rem;
  cursor: pointer;
  transition: transform 0.1s;
  text-align: left;
  box-shadow: 0 4px 12px rgba(186, 26, 26, 0.04);
  box-sizing: border-box;

  &:active {
    transform: scale(0.98);
  }
`;

export const SosIconBox = styled.div`
  background-color: #ba1a1a; /* error */
  color: #FFFFFF;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  box-shadow: 0 4px 10px rgba(186, 26, 26, 0.25);
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    stroke-width: 2.5;
  }
`;

export const GridItemCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6; /* Neutral 500_2 outline */
  border-radius: 1.25rem;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  aspect-ratio: 1;
  box-sizing: border-box;

  &:active {
    transform: scale(0.96);
  }
`;

export const GridIconBox = styled.div<{ $bgColor: string; $color: string }>`
  background-color: ${props => props.$bgColor};
  color: ${props => props.$color};
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;

  svg {
    width: 1.35rem;
    height: 1.35rem;
    stroke-width: 2.25;
  }
`;

export const ViewAllButton = styled.button`
  width: 100%;
  padding: 0.85rem 1rem;
  margin-top: 0.5rem;
  background-color: rgba(230, 81, 0, 0.05); /* Soft primary */
  border: 1px solid rgba(230, 81, 0, 0.15);
  color: #E65100;
  font-weight: 700;
  font-size: 13.5px;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
    stroke-width: 2.5;
  }
`;

// Safety & Planning sections
export const SafetySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
  width: 100%;
`;

export const SectionTitle = styled.h3`
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748B; /* slate */
  margin: 0;
  padding-left: 0.25rem;
`;

export const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
`;

export const SafetyCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  padding: 1.25rem;
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.25rem;
  height: 8rem;
  cursor: pointer;
  transition: transform 0.1s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  box-sizing: border-box;

  &:active {
    transform: scale(0.96);
  }
`;

export const SafetyIconBox = styled.div<{ $bgColor: string; $color: string }>`
  background-color: ${props => props.$bgColor};
  color: ${props => props.$color};
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: auto;

  svg {
    width: 1.2rem;
    height: 1.2rem;
    stroke-width: 2.25;
  }
`;

export const LiveParkingRow = styled.button`
  grid-column: span 2;
  margin-bottom:30px;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  cursor: pointer;
  transition: transform 0.1s;
  text-align: left;
  box-sizing: border-box;
  width: 100%;

  &:active {
    transform: scale(0.98);
  }
`;

export const ParkingIconBox = styled.div`
  background-color: rgba(76, 97, 108, 0.08); /* slate light */
  color: #4C616C; /* slate */
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 2.5;
  }
`;

// Redesigned Top Header Overlay for Home Page
export const HomeHeader = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  box-sizing: border-box;
  z-index: 50;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #FFFFFF;
  cursor: pointer;
  
  svg, img {
    width: 1.4rem;
    height: 1.4rem;
    object-fit: contain;
    cursor: pointer;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
    color: #FFFFFF;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LocationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const LiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #84d5c5; /* tertiary-fixed-dim light teal */
  color: #00201b; /* on-tertiary-fixed */
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 104, 91, 0.15);
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  svg {
    width: 0.75rem;
    height: 0.75rem;
  }
`;

export const LangButton = styled.button`
  background-color: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.15);
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.9);
  }
`;

