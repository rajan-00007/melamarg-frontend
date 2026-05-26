'use client';

import styled, { keyframes } from 'styled-components';
import { Bell, Award, Compass, ArrowRight } from 'lucide-react';

// Animations
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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Alerts Container
export const AlertsContainer = styled.div`
  padding: 1.25rem; /* p-5 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  flex-grow: 1;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #18181b; /* border-zinc-900 */
  padding-bottom: 0.5rem; /* pb-2 */
`;

export const IconTextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
`;

export const HeaderTitle = styled.h3`
  font-size: 0.875rem; /* text-md */
  font-weight: 900;
  color: #ffffff;
  font-family: Inter, system-ui, -apple-system, sans-serif;
  margin: 0;
`;

export const CountBadge = styled.span`
  background-color: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
  height: 1.125rem; /* h-4.5 */
  width: 1.125rem; /* w-4.5 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${bounce} 1s infinite;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const VerifiedBadge = styled.div`
  padding: 0.375rem 0.875rem; /* py-1.5 px-3.5 */
  border-radius: 9999px;
  background-color: #12122b;
  border: 1px solid rgba(60, 60, 117, 0.5); /* border-[#3c3c75]/50 */
  display: flex;
  align-items: center;
  gap: 0.375rem; /* space-x-1.5 */
  width: fit-content;
`;

export const BadgeText = styled.span`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-widest */
  color: #818cf8;
  font-weight: 900;
  line-height: 1;
`;

// Feed
export const AlertsFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  padding-top: 0.25rem; /* pt-1 */
`;

// Empty Feed State
export const EmptyFeed = styled.div`
  padding: 4rem 1rem; /* py-16 px-4 */
  border: 1px dashed #18181b; /* border-zinc-900 */
  border-radius: 1.5rem; /* rounded-3xl */
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem; /* space-y-2 */
  color: #71717a; /* text-zinc-500 */
`;

export const EmptyTitle = styled.p`
  font-size: 0.75rem; /* text-xs */
  font-weight: 700;
  color: #e4e4e7; /* text-zinc-300 */
  margin: 0;
`;

export const EmptySubtitle = styled.p`
  font-size: 9px;
  color: #52525b; /* text-zinc-650 */
  margin: 0;
`;

// Alert Card
interface AlertCardProps {
  $leftBorderColor: string;
  $bgOverlay: string;
}

export const AlertCard = styled.div<AlertCardProps>`
  display: flex;
  flex-direction: column;
  border: 1px solid #18181b; /* border-zinc-900 */
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${props => props.$leftBorderColor};
  background-color: ${props => props.$bgOverlay};
  border-radius: 1.5rem; /* rounded-3xl */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s;
`;

export const AlertBody = styled.div`
  padding: 0.875rem; /* p-3.5 */
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* space-y-1 */
`;

interface AlertCategoryProps {
  $color: string;
}

export const AlertCategory = styled.span<AlertCategoryProps>`
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.05em; /* tracking-widest */
  text-transform: uppercase;
  color: ${props => props.$color};
`;

export const AlertMessage = styled.p`
  font-size: 11px;
  line-height: 1.625; /* leading-relaxed */
  color: #d4d4d8; /* text-zinc-300 */
  font-family: Inter, system-ui, -apple-system, sans-serif;
  font-weight: 500;
  margin: 0;
`;

export const AlertTime = styled.span`
  font-size: 8px;
  color: #71717a; /* text-zinc-500 */
  font-weight: 500;
`;

// Footer Actions
export const AlertFooter = styled.div`
  padding: 0.75rem; /* p-3 */
  padding-top: 0.625rem; /* pt-2.5 */
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(24, 24, 27, 0.4); /* border-zinc-900/40 */
  margin-top: 0.25rem; /* mt-1 */
  background-color: rgba(9, 9, 11, 0.2); /* bg-zinc-950/20 */
`;

export const NavigateButton = styled.button`
  font-size: 10px;
  font-weight: 900;
  color: #22d3ee; /* text-cyan-400 */
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* space-x-1 */
  transition: all 0.2s;

  &:hover {
    color: #67e8f9; /* hover:text-cyan-300 */
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg.arrow-right {
    transform: translateX(2px);
  }
`;

export const DismissButton = styled.button`
  font-size: 9px;
  font-weight: 700;
  color: #71717a; /* text-zinc-500 */
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #d4d4d8; /* hover:text-zinc-300 */
  }
`;

export const StyledBellHeader = styled(Bell)`
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24; /* text-amber-500 */
  animation: ${pulse} 2s infinite;
`;

export const StyledAwardBadge = styled(Award)`
  width: 0.875rem;
  height: 0.875rem;
  color: #818cf8;
`;

export const StyledBellEmpty = styled(Bell)`
  width: 2rem;
  height: 2rem;
  color: #3f3f46; /* text-zinc-700 */
`;

export const StyledCompassNav = styled(Compass)`
  width: 0.875rem;
  height: 0.875rem;
`;

export const StyledArrowRightNav = styled(ArrowRight)`
  width: 0.875rem;
  height: 0.875rem;
`;

