'use client';

import styled, { keyframes } from 'styled-components';
import { Compass, PartyPopper, ArrowLeft, Navigation, MapPin } from 'lucide-react';

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
    opacity: 0.5;
  }
`;

const ping = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
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

// Root Navigation Container
export const NavContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  position: relative;
  height: calc(100vh - 130px);
  min-height: 500px;

  @media (min-width: 640px) {
    height: calc(100vh - 120px);
  }
`;

// GPS Lock Overlay
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(9, 9, 11, 0.85); /* bg-zinc-955/85 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem; /* p-6 */
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const OverlayBox = styled.div`
  padding: 1.25rem; /* p-5 */
  background-color: #121217; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 1rem; /* rounded-2xl */
  max-w: 20rem; /* max-w-xs */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
`;

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
`;

export const WarningIconWrapper = styled.div`
  padding: 0.75rem; /* p-3 */
  background-color: rgba(245, 158, 11, 0.1); /* bg-amber-500/10 */
  border: 1px solid rgba(245, 158, 11, 0.2); /* border-amber-500/20 */
  border-radius: 9999px;
  color: #fbbf24; /* text-amber-400 */
  animation: ${pulse} 2s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OverlayTitle = styled.h3`
  font-size: 0.875rem; /* text-sm */
  font-weight: 900;
  color: #f4f4f5; /* text-zinc-100 */
  margin: 0;
`;

export const OverlayText = styled.p`
  font-size: 10px;
  color: #a1a1aa; /* text-zinc-400 */
  line-height: 1.625;
  font-weight: 500;
  margin: 0;
`;

export const OverlayPillWrapper = styled.div`
  padding-top: 0.5rem; /* pt-2 */
  display: flex;
  justify-content: center;
`;

export const OverlayButtons = styled.div`
  padding-top: 0.75rem; /* pt-3 */
  border-top: 1px solid #27272a; /* border-zinc-800 */
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* gap-1.5 */
  width: 100%;
`;

export const BypassButton = styled.button`
  width: 100%;
  padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
  background-color: #0891b2; /* bg-cyan-600 */
  color: #ffffff;
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  border: 0;
  transition: background-color 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #06b6d4; /* hover:bg-cyan-500 */
  }
`;

export const StopButton = styled.button`
  width: 100%;
  padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
  background-color: rgba(127, 29, 29, 0.4); /* bg-red-955/40 */
  color: #f87171; /* text-red-400 */
  border: 1px solid rgba(185, 28, 28, 0.4); /* border-red-900/40 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(185, 28, 28, 0.6);
  }
`;

// Arrival Notification Overlay
export const ArrivalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(2, 44, 34, 0.95); /* bg-emerald-955/95 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem; /* p-4 */
  text-align: center;
  border-bottom: 1px solid rgba(16, 185, 129, 0.3); /* border-emerald-500/30 */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const ArrivalTitle = styled.h4`
  font-weight: 800;
  font-size: 0.875rem; /* text-md */
  color: #34d399; /* text-emerald-400 */
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const ArrivalText = styled.p`
  font-size: 0.75rem; /* text-xs */
  color: #d4d4d8; /* text-zinc-300 */
  margin: 0;
  margin-bottom: 1rem; /* mb-4 */
`;

export const ArrivalButton = styled.button`
  padding: 0.5rem 1.5rem; /* py-2 px-6 */
  background-color: #059669; /* bg-emerald-600 */
  color: #ffffff;
  font-weight: 750;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;
  border: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: background-color 0.2s;

  &:hover {
    background-color: #10b981; /* hover:bg-emerald-505 */
  }
`;

// Back Button
export const BackButton = styled.button`
  display: flex;
  align-items: center;
  color: #a1a1aa; /* text-zinc-400 */
  background: transparent;
  border: 0;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.75rem; /* text-xs */
  gap: 0.25rem; /* gap-1 */
  width: fit-content;
  padding: 0;

  &:hover {
    color: #ffffff;
  }
`;

// SPLIT SCREEN & REDESIGNED 3-COLUMN DASHBOARD STYLES

export const SplitWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #07070a;
`;

export const DashboardContainer = styled.div<{ $isExpanded?: boolean }>`
  height: ${props => props.$isExpanded ? '15%' : '72%'};
  min-height: ${props => props.$isExpanded ? '90px' : '390px'};
  background: linear-gradient(180deg, #0b0b14 0%, #07070a 100%);
  border-bottom: 1px solid #18181b;
  position: relative;
  z-index: 30;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

export const MapContainer = styled.div<{ $isExpanded?: boolean }>`
  height: ${props => props.$isExpanded ? '85%' : '28%'};
  min-height: ${props => props.$isExpanded ? '350px' : '150px'};
  position: relative;
  z-index: 10;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: ${props => props.$isExpanded ? 'default' : 'pointer'};
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 1;
`;

// Expanded active navigation center card (flex: 1 to fill middle column height completely)
export const CentralCard = styled.div`
  flex: 1;
  height: 100%;
  width: 100%;
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid rgba(39, 39, 42, 0.6);
  border-radius: 1.25rem;
  padding: 0.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px 0 rgba(0, 0, 0, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-sizing: border-box;

  &:hover {
    border-color: rgba(34, 211, 238, 0.4);
    box-shadow: 0 10px 30px 0 rgba(34, 211, 238, 0.1);
  }
`;

export const ArrowAnimationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.45rem;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;

export const ArrowWrapper = styled.div`
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 3.25rem;
  height: 3.25rem;
`;

export const DirectionText = styled.div`
  font-size: 1.15rem;
  font-weight: 900;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
`;

export const NextInstruction = styled.div`
  font-size: 0.75rem;
  color: #e4e4e7;
  font-weight: 700;
  line-height: 1.35;
  max-width: 95%;
  word-wrap: break-word;
`;

interface SidePOICardProps {
  $side: 'left' | 'right';
  $hasPoi: boolean;
}

export const SidePOICard = styled.div<SidePOICardProps>`
  flex: 0 1 110px;
  height: 95%;
  background: rgba(18, 18, 22, 0.6);
  border: 1px solid rgba(39, 39, 42, 0.4);
  border-radius: 1.5rem;
  padding: 1rem 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  cursor: ${props => props.$hasPoi ? 'pointer' : 'default'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  overflow: hidden;
  opacity: ${props => props.$hasPoi ? 1 : 0.5};

  ${props => props.$side === 'left' ? `
    border-left: 4px solid #10b981;
    box-shadow: ${props.$hasPoi ? '0 4px 20px rgba(16, 185, 129, 0.05)' : 'none'};
  ` : `
    border-right: 4px solid #8b5cf6;
    box-shadow: ${props.$hasPoi ? '0 4px 20px rgba(139, 92, 246, 0.05)' : 'none'};
  `}

  &:hover {
    ${props => props.$hasPoi && (props.$side === 'left' ? `
      border-color: #10b981 rgba(39,39,42,0.8) rgba(39,39,42,0.8) #10b981;
      background: rgba(16, 185, 129, 0.05);
      transform: translateX(2.5px);
    ` : `
      border-color: rgba(39,39,42,0.8) #8b5cf6 rgba(39,39,42,0.8) rgba(39,39,42,0.8);
      background: rgba(139, 92, 246, 0.05);
      transform: translateX(-2.5px);
    `)}
  }
`;

interface POITagProps {
  $side: 'left' | 'right';
}

export const POITag = styled.div<POITagProps>`
  font-size: 0.6rem;
  font-weight: 800;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  justify-content: ${props => props.$side === 'left' ? 'flex-start' : 'flex-end'};
`;

export const POIEmoji = styled.div`
  font-size: 1.5rem;
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const POIName = styled.div`
  font-size: 0.65rem;
  font-weight: 700;
  color: #fafafa;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  text-align: center;
`;

export const POIDistance = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  color: #a1a1aa;
  margin-top: 0.15rem;
  text-align: center;
`;

export const NoPOIText = styled.div`
  font-size: 0.6rem;
  color: #52525b;
  font-weight: 500;
  text-align: center;
  margin: auto 0;
`;

// Center column container
export const MiddleColumn = styled.div`
  flex: 1.25;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* high focus center alignment */
  height: 95%;
  min-width: 140px;
  max-width: 220px;
  box-sizing: border-box;
  gap: 0.35rem;
`;

// Mockup dashboard header rows
export const DashboardHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  width: 100%;
  margin-bottom: 0.4rem;
`;

export const DashboardHeaderTitle = styled.div`
  font-size: 0.72rem;
  font-weight: 800;
  color: #a1a1aa;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  span.target {
    color: #f97316; /* Orange target color */
    margin-left: 0.25rem;
    font-weight: 900;
  }
`;

export const DashboardHeaderStats = styled.div`
  font-size: 1.3rem;
  font-weight: 900;
  color: #fafafa;
  margin-top: 0.15rem;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  span.time {
    font-size: 0.75rem;
    color: #71717a;
    font-weight: 600;
  }
`;

export const DashboardColumns = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  min-height: 0;
  gap: 0.4rem;
  box-sizing: border-box;
`;

// Horizontal Compass Slider Strip
export const CompassSliderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.35rem 0.25rem;
  box-sizing: border-box;
  gap: 0.75rem;
  margin-top: 0.25rem;
`;

export const CompassSliderTrack = styled.div`
  flex: 1;
  height: 22px;
  background: rgba(18, 18, 22, 0.65);
  border: 1px solid rgba(63, 63, 70, 0.45);
  border-radius: 9999px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
`;

export const CompassLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 900;
  color: #71717a;
  letter-spacing: 0.05em;
`;

export const CompassIndicatorLine = styled.div<{ $headingOffset?: number }>`
  position: absolute;
  width: 3px;
  height: 12px;
  background-color: #f97316; /* Orange tick cursor */
  border-radius: 9999px;
  box-shadow: 0 0 6px #f97316;
  left: calc(50% + ${props => props.$headingOffset || 0}px);
  transition: left 0.1s ease-out;
  z-index: 15;
`;

export const CompassTickLine = styled.div<{ $offset: number; $isMajor?: boolean }>`
  position: absolute;
  width: 1px;
  height: ${props => props.$isMajor ? '8px' : '5px'};
  background-color: ${props => props.$isMajor ? 'rgba(161, 161, 170, 0.5)' : 'rgba(113, 113, 122, 0.25)'};
  left: calc(50% + ${props => props.$offset}px);
`;

// Expand / Minimize Floating Button
export const MapToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  padding: 0.5rem;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 0.75rem;
  color: #d4d4d8;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.45);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  backdrop-filter: blur(8px);

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
    background-color: #27272a;
  }
`;

export const GlowStatusOverlay = styled.div`
  position: absolute;
  top: 1rem;
  left: 3.5rem;
  z-index: 9999;
`;

// Floating Recenter Controls
export const ControlsOverlay = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RecenterButton = styled.button`
  padding: 0.625rem;
  background-color: #18181b;
  border: 1px solid #27272a;
  border-radius: 0.75rem;
  color: #d4d4d8;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
  }
`;

export const CoordinatesDisplay = styled.div`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 9999;
  padding: 0.625rem;
  background-color: rgba(9, 9, 11, 0.9);
  border: 1px solid #27272a;
  border-radius: 0.75rem;
  font-size: 9px;
  color: #22d3ee;
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

// Bottom Active Navigation Status Footer Bar
export const NavigationFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background-color: #0b0b14;
  border-top: 1px solid #18181b;
  position: relative;
  z-index: 30;
  height: 52px;
  box-sizing: border-box;
`;

export const FooterStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 10px;
  font-weight: 800;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    display: inline-block;
    animation: ${pulse} 1.5s infinite;
  }
`;

export const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FooterButton = styled.button<{ $variant?: 'mute' | 'stop' | 'simulate' }>`
  padding: 0.35rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${props => props.$variant === 'stop' ? `
    background-color: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.25);
    color: #f43f5e;
    &:hover {
      background-color: rgba(239, 68, 68, 0.25);
      border-color: #ef4444;
      color: #fff;
    }
  ` : props.$variant === 'simulate' ? `
    background: linear-gradient(to right, #059669, #14b8a6);
    color: #ffffff;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    &:hover:not(:disabled) {
      background: linear-gradient(to right, #10b981, #2dd4bf);
    }
    &:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
  ` : `
    background-color: rgba(63, 63, 70, 0.3);
    border-color: rgba(63, 63, 70, 0.6);
    color: #a1a1aa;
    &:hover {
      background-color: rgba(63, 63, 70, 0.5);
      border-color: #a1a1aa;
      color: #fff;
    }
  `}
`;

// GPS Status Pills
export const GPSLockedPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #10b981;
    animation: ${ping} 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const GPSSearchingPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #fbbf24;
    animation: ${pulse} 1.5s infinite;
  }
`;

export const GPSLostPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f43f5e;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #ef4444;
    animation: ${pulse} 1.5s infinite;
  }
`;

export const StyledCompassIcon = styled(Compass)`
  width: 2rem;
  height: 2rem;
  animation: ${pulse} 3s linear infinite;
`;

export const StyledPartyPopper = styled(PartyPopper)`
  width: 2.5rem;
  height: 2.5rem;
  color: #34d399;
  margin-bottom: 0.5rem;
  animation: ${bounce} 1s infinite;
`;

export const StyledArrowLeft = styled(ArrowLeft)`
  width: 1rem;
  height: 1rem;
  color: #a1a1aa;
`;

export const StyledNavigation = styled(Navigation)`
  width: 1rem;
  height: 1rem;
  transform: rotate(45deg);
`;

export const StyledMapPin = styled(MapPin)`
  width: 0.75rem;
  height: 0.75rem;
  color: #22d3ee;
`;

// --- REDESIGNED NAVIGATION FLOATING UI STYLED COMPONENTS ---

export const FloatingHeaderWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
`;

export const FloatingHeaderPillRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  pointer-events: auto;
`;

export const OfflineActivePill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  background: #ffffff;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 10px;
  font-weight: 700;
  color: #00695c;
  
  span.dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #10b981;
    display: inline-block;
  }
`;

export const GpsStrongPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.35rem 0.75rem;
  background: #e1f5fe;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  font-size: 10px;
  font-weight: 700;
  color: #0288d1;
`;

export const RouteStatusBanner = styled.div<{ $isOffPath: boolean }>`
  pointer-events: auto;
  width: 100%;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: ${props => props.$isOffPath ? '#dc2626' : '#16a34a'};
  transition: background-color 0.3s;
`;

export const RouteStatusIconWrapper = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const RouteStatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

export const RouteStatusTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
`;

export const RouteStatusSubtitle = styled.div`
  font-size: 15px;
  font-weight: 700;
  margin-top: 0.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const FloatingBottomWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem;
  box-sizing: border-box;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
`;

export const FloatingControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
`;

export const FloatingLocateButton = styled.button`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  color: #e65100;
  transition: transform 0.2s;
  padding: 0;

  &:active {
    transform: scale(0.95);
  }
`;

export const FloatingSimulateButton = styled.button`
  padding: 0.45rem 0.85rem;
  background: #00695c;
  color: #ffffff;
  border-radius: 9999px;
  border: none;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  text-transform: uppercase;
  letter-spacing: 0.025em;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PremiumBottomCard = styled.div`
  pointer-events: auto;
  width: 100%;
  background: #ffffff;
  border-radius: 1.5rem;
  padding: 1rem 1.25rem;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const BottomCardProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  width: 100%;
`;

export const BottomCardDestinationText = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

export const BottomCardPercentageText = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
`;

export const BottomProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
`;

export const BottomProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  background: #e65100;
  border-radius: 9999px;
  width: ${props => props.$percent}%;
  transition: width 0.3s ease;
`;

export const BottomMetricsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.4rem 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
`;

export const BottomMetricCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;

  &:not(:last-child) {
    border-right: 1px solid #f1f5f9;
  }
`;

export const BottomMetricLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
`;

export const BottomMetricValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #0f172a;

  &.arrival-time {
    color: #e65100;
  }
`;

export const BottomActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
`;

export const BottomVoiceButton = styled.button<{ $active: boolean }>`
  flex: 1.2;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background: ${props => props.$active ? '#e65100' : '#455a64'};
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.$active ? '#bf360c' : '#37474f'};
  }
`;

export const BottomExitButton = styled.button`
  flex: 1;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background: #fee2e2;
  color: #ef4444;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #fca5a5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #fecaca;
    border-color: #ef4444;
  }
`;

export const NextInstructionPill = styled.div`
  pointer-events: auto;
  background: #ffffff;
  color: #455a64;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: fit-content;
  align-self: flex-start;
  margin-left: 0.5rem;
`;

// --- UNIFIED ON/OFF PATH STATUS CARD COMPONENTS ---

export const UnifiedStatusCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: auto;
`;

export const UnifiedStatusHeader = styled.div<{ $isOffPath: boolean }>`
  background-color: ${props => props.$isOffPath ? '#dc2626' : '#16a34a'};
  color: #ffffff;
  padding: 1.15rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
`;

export const UnifiedStatusBody = styled.div`
  background-color: #ffffff;
  color: #1e293b;
  padding: 0.65rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 13px;
  font-weight: 700;
`;

