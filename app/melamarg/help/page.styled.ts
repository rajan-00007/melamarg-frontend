'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/components/style/colors';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

export const HelpContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafaf5; /* Neutral ivory backdrop */
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const ScrollContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  padding-bottom: 7.5rem; /* clear bottom navigation */
`;

// Emergency Services Alert Banner Card
export const EmergencyCard = styled.div`
  background-color: #ffebeb; /* Light soft pink/red */
  border: 1px solid rgba(186, 26, 26, 0.12);
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  gap: 0.85rem;
  align-items: flex-start;
  box-shadow: 0 4px 10px rgba(186, 26, 26, 0.02);
`;

export const EmergencyIconCircle = styled.div`
  color: #ba1a1a;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 0.125rem;

  svg {
    width: 1.35rem;
    height: 1.35rem;
  }
`;

export const EmergencyTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

// 2x2 Emergency Quick Grid
export const EmergencyGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
`;

export const GridOptionCard = styled.button`
  background-color: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.5rem;
  padding: 1.5rem 1rem;
  display: flex;
  height:150px;
  width:100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.015);
  transition: all 0.2s ease;
  box-sizing: border-box;
  aspect-ratio: 0.95;

  &:active {
    transform: scale(0.96);
  }
`;

export const OptionIconBox = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: rgba(186, 26, 26, 0.06); /* Soft red background */
  color: #ba1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
  flex-shrink: 0;

  svg {
    width: 2.1rem;
    height: 2.1rem;
    stroke-width: 2.25;
  }
`;

// Current Location Panel
export const LocationPanelCard = styled.div`
  background-color: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.012);
`;

export const LocationHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const RefreshLinkButton = styled.button`
  background: transparent;
  border: 0;
  color: ${colors.brand.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 700;
  padding: 0;
  transition: opacity 0.15s;

  &:active {
    opacity: 0.7;
  }

  svg {
    width: 0.85rem;
    height: 0.85rem;
    stroke-width: 2.5;
  }
`;

export const CoordsBlockRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  box-sizing: border-box;
`;

export const CoordItemBlock = styled.div<{ $hasDivider?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding-left: ${props => props.$hasDivider ? '1rem' : '0'};
  border-left: ${props => props.$hasDivider ? `1px solid ${colors.neutral[500]}` : '0'};
`;

// Nearest Help Booth Card
export const BoothDisplayCard = styled.div`
  background-color: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.012);
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const BoothImageArea = styled.div`
  position: relative;
  width: 100%;
  height: 9.5rem;
  background-color: ${colors.neutral[500_2]};
`;

export const BoothImageCover = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const BoothImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%);
`;

export const LocationBadgeOverlay = styled.div`
  position: absolute;
  bottom: 0.75rem;
  left: 0.75rem;
  background-color: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(8px);
  border-radius: 0.5rem;
  padding: 0.35rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: ${colors.base.white};
  box-sizing: border-box;

  svg {
    width: 0.85rem;
    height: 0.85rem;
    color: ${colors.base.white};
  }
`;

export const BoothDetailsContainer = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-sizing: border-box;
`;

export const BoothHeaderDetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const WalkBadgeCircle = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #D3E2F2; /* Solid light blue matching mockup */
  color: #4B6E96;           /* Slate blue walking icon color */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

export const QuickDialHeader = styled.h3`
  margin: 0;
  margin-top: 0.5rem;
  padding-left: 0.25rem;
`;

// Helpline cards list
export const HelplinesCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
`;

export const HelplineCardItem = styled.a`
  background-color: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.5rem;
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  box-sizing: border-box;
  text-decoration: none;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.98);
  }
`;

export const HelplineContentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
`;

export const HelplineIconCircleBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: ${colors.neutral[500_2]};
  color: ${colors.brand.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

export const DialCircleBtn = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background-color: #fafaf5;
  border: 1px solid ${colors.neutral[500]};
  color: ${colors.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 0.95rem;
    height: 0.95rem;
    stroke-width: 2.5;
  }
`;
