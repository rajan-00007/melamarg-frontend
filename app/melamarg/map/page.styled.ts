'use client';

import styled, { keyframes, css } from 'styled-components';

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

export const MapWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  min-height: 500px;
`;

export const MapCanvas = styled.div`
  flex-grow: 1;
  width: 100%;
  position: relative;
  z-index: 10;
  height: 100%;
`;

export const GlowStatusOverlay = styled.div`
  position: absolute;
  top: 1rem; /* top-4 */
  left: 1rem; /* left-4 */
  z-index: 20;
`;

export const ControlsOverlay = styled.div`
  position: absolute;
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* gap-2 */
`;

export const RecenterButton = styled.button`
  padding: 0.625rem; /* p-2.5 */
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  color: #d4d4d8; /* text-zinc-300 */
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
  bottom: 1rem; /* bottom-4 */
  left: 1rem;
  right: 1rem; /* left-4 right-4 */
  z-index: 20;
  padding: 0.625rem; /* p-2.5 */
  background-color: rgba(9, 9, 11, 0.9); /* bg-zinc-950/90 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 9px;
  color: #22d3ee; /* text-cyan-400 */
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem; /* gap-1.5 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

// GPS Status Pills
export const GPSLockedPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(16, 185, 129, 0.1); /* bg-emerald-500/10 */
  border: 1px solid rgba(16, 185, 129, 0.3); /* border-emerald-500/30 */
  color: #34d399; /* text-emerald-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

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
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(245, 158, 11, 0.1); /* bg-amber-500/10 */
  border: 1px solid rgba(245, 158, 11, 0.3); /* border-amber-500/30 */
  color: #fbbf24; /* text-amber-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

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
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.1); /* bg-rose-500/10 */
  border: 1px solid rgba(239, 68, 68, 0.3); /* border-rose-500/30 */
  color: #f43f5e; /* text-rose-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #ef4444;
    animation: ${pulse} 1.5s infinite;
  }
`;

// SPLIT SCREEN & NAVIGATION DASHBOARD COMPONENTS

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

export const CentralCard = styled.div`
  flex: 0.68;
  width: 100%;
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid rgba(39, 39, 42, 0.6);
  border-radius: 1.25rem;
  padding: 0.25rem 0.5rem;
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
  margin-bottom: 0.35rem;
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
  width: 3rem;
  height: 3rem;
`;

export const DirectionText = styled.div`
  font-size: 0.95rem;
  font-weight: 900;
  color: #10b981;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.15rem;
`;

export const NextInstruction = styled.div`
  font-size: 0.65rem;
  color: #a1a1aa;
  font-weight: 500;
  line-height: 1.2;
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

// FRONT & BACK QUADRANT STYLED-COMPONENTS

export const QuadrantBadgeContainer = styled.div`
  display: flex;
  gap: 0.35rem;
  margin-top: 0.4rem;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

interface MiniQuadrantBadgeProps {
  $side: 'front' | 'back';
}

export const MiniQuadrantBadge = styled.div<MiniQuadrantBadgeProps>`
  font-size: 0.525rem;
  font-weight: 800;
  padding: 0.15rem 0.35rem;
  border-radius: 0.375rem;
  background: rgba(18, 18, 22, 0.8);
  border: 1px solid rgba(39, 39, 42, 0.6);
  color: ${props => props.$side === 'front' ? '#22d3ee' : '#f59e0b'};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.15rem;

  &:hover {
    background: ${props => props.$side === 'front' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
    border-color: ${props => props.$side === 'front' ? 'rgba(34, 211, 238, 0.4)' : 'rgba(245, 158, 11, 0.4)'};
  }
`;

interface CentralMiniPOIProps {
  $side: 'front' | 'back';
}

export const CentralMiniPOI = styled.div<CentralMiniPOIProps>`
  flex: 0.95;
  width: 100%;
  color: ${props => props.$side === 'front' ? '#22d3ee' : '#f97316'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.18rem;
  max-width: 100%;
  cursor: pointer;
  background: rgba(9, 9, 11, 0.7);
  padding: 0.55rem 0.4rem;
  border-radius: 0.75rem;
  border: 1px solid ${props => props.$side === 'front' ? 'rgba(34, 211, 238, 0.35)' : 'rgba(249, 115, 22, 0.35)'};
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  text-align: center;

  span.indicator {
    font-size: 0.68rem;
    font-weight: 900;
    line-height: 1;
  }

  span.emoji {
    font-size: 1.35rem; /* Make emoji very big and legible! */
    line-height: 1;
    margin: 0.1rem 0;
    display: inline-block;
  }

  span.name {
    color: #fafafa;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    font-size: 0.65rem;
    line-height: 1.15;
    margin-top: 0.1rem;
    text-align: center;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  span.dist {
    color: #a1a1aa;
    font-weight: 700;
    font-size: 0.65rem;
    margin-top: 0.05rem;
  }

  &:hover {
    background: rgba(9, 9, 11, 0.85);
    border-color: ${props => props.$side === 'front' ? '#22d3ee' : '#f97316'};
    transform: translateY(${props => props.$side === 'front' ? '1px' : '-1px'});
  }
`;

export const MiddleColumn = styled.div`
  flex: 1.25;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 95%;
  min-width: 140px;
  max-width: 190px;
  box-sizing: border-box;
  gap: 0.35rem;
`;

// MOCKUP GRAPHICS AND INTERACTION OVERLAYS

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
    color: #f97316; /* Orange color */
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
  background-color: #f97316; /* Orange tick */
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

export const MapToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 20;
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
  color: #10b981; /* Green color */
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

export const FooterButton = styled.button<{ $variant?: 'mute' | 'stop' }>`
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

// --- REDESIGNED EXPLORE FLOATING UI STYLED COMPONENTS ---

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

export const RouteStatusBanner = styled.div<{ $isOffPath?: boolean }>`
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
  flex-direction: column;
  align-items: flex-end;
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

export const ExploreBottomCard = styled.div`
  pointer-events: auto;
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.25rem;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const ExploreCardTitle = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
`;

export const ExploreCardDescription = styled.div`
  font-size: 11px;
  color: #64748b;
  line-height: 1.4;
`;

export const ExplorePOIInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  
  span.badge {
    background: #f1f5f9;
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    color: #e65100;
  }
`;

export const ExploreActionsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.25rem;
`;

export const ExploreNavButton = styled.button`
  flex: 1.5;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background: #e65100;
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
    background: #bf360c;
  }
`;

export const ExploreCloseButton = styled.button`
  flex: 1;
  padding: 0.65rem 1rem;
  border-radius: 0.75rem;
  background: #f1f5f9;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #e2e8f0;
  }
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
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
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

export const FloatingHUDContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 999;
`;

export const HUDSection = styled.div<{ $position: 'front' | 'back' | 'left' | 'right' }>`
  position: absolute;
  display: flex;
  gap: 0.5rem;
  pointer-events: none;
  
  ${props => props.$position === 'front' && `
    top: 140px;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    flex-wrap: wrap;
    width: 90%;
  `}
  
  ${props => props.$position === 'back' && `
    bottom: 270px;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    flex-wrap: wrap;
    width: 90%;
  `}
  
  ${props => props.$position === 'left' && `
    top: 45%;
    left: 12px;
    transform: translateY(-50%);
    flex-direction: column;
    align-items: flex-start;
  `}
  
  ${props => props.$position === 'right' && `
    top: 45%;
    right: 12px;
    transform: translateY(-50%);
    flex-direction: column;
    align-items: flex-end;
  `}
`;

export const HUDIndicatorBadge = styled.div<{ $direction: 'front' | 'back' | 'left' | 'right' }>`
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 8px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: auto;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid ${props => 
    props.$direction === 'front' ? '#3b82f6' : 
    props.$direction === 'right' ? '#10b981' : 
    props.$direction === 'back' ? '#ef4444' : 
    '#8b5cf6'
  };

  &:hover {
    transform: scale(1.05);
    background: rgba(15, 23, 42, 0.95);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
  }

  &:active {
    transform: scale(0.98);
  }

  .arrow {
    font-size: 13px;
    display: flex;
    align-items: center;
    color: ${props => 
      props.$direction === 'front' ? '#3b82f6' : 
      props.$direction === 'right' ? '#10b981' : 
      props.$direction === 'back' ? '#ef4444' : 
      '#8b5cf6'
    };
  }

  .icon {
    font-size: 12px;
  }

  .name {
    max-width: 110px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dist {
    opacity: 0.6;
    font-size: 9px;
    font-weight: 500;
  }
`;

export const ZoneHUDCard = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.25rem;
  padding: 1.0rem 1.25rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

export const ZoneHUDTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ZoneInfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex-shrink: 0;
`;

export const ZoneLabel = styled.span`
  font-size: 9px;
  font-weight: 700;
  color: #ea580c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ZoneName = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
`;

export const VehicleStatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  width: 100%;
  flex-shrink: 0;
`;

export const VehicleStatusBadge = styled.div<{ $allowed: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.35rem 0.6rem;
  border-radius: 0.75rem;
  font-size: 11px;
  font-weight: 700;
  background: ${props => props.$allowed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'};
  border: 1px solid ${props => props.$allowed ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)'};
  color: ${props => props.$allowed ? '#047857' : '#b91c1c'};
`;

export const ZoneAdvisoryWarningPill = styled.button<{ $severity?: string }>`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.8rem;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
  animation: pulseWarning 2s infinite;
  transition: all 0.2s;
  border: 1px solid;
  white-space: nowrap;
  flex-shrink: 0;

  ${props => {
    const sev = props.$severity || 'general';
    if (sev === 'critical') {
      return css`
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        color: #b91c1c;
        box-shadow: 0 0 12px rgba(239, 68, 68, 0.08);
        &:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: rgba(239, 68, 68, 0.5);
        }
      `;
    } else if (sev === 'congested') {
      return css`
        background: rgba(249, 115, 22, 0.1);
        border-color: rgba(249, 115, 22, 0.3);
        color: #c2410c;
        box-shadow: 0 0 12px rgba(249, 115, 22, 0.08);
        &:hover {
          background: rgba(249, 115, 22, 0.2);
          border-color: rgba(249, 115, 22, 0.5);
        }
      `;
    } else if (sev === 'warning') {
      return css`
        background: rgba(217, 119, 6, 0.1);
        border-color: rgba(217, 119, 6, 0.3);
        color: #a16207;
        box-shadow: 0 0 12px rgba(217, 119, 6, 0.08);
        &:hover {
          background: rgba(217, 119, 6, 0.2);
          border-color: rgba(217, 119, 6, 0.5);
        }
      `;
    } else if (sev === 'stable') {
      return css`
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.3);
        color: #047857;
        box-shadow: 0 0 12px rgba(16, 185, 129, 0.08);
        &:hover {
          background: rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.5);
        }
      `;
    } else {
      return css`
        background: rgba(37, 99, 235, 0.1);
        border-color: rgba(37, 99, 235, 0.3);
        color: #1d4ed8;
        box-shadow: 0 0 12px rgba(37, 99, 235, 0.08);
        &:hover {
          background: rgba(37, 99, 235, 0.2);
          border-color: rgba(37, 99, 235, 0.5);
        }
      `;
    }
  }}

  @keyframes pulseWarning {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.03);
    }
  }
`;

// Slide-up drawer for advisories
export const DrawerBackdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: auto;
`;

export const DrawerContent = styled.div`
  width: 100%;
  max-width: 500px;
  background: #ffffff;
  border-top: 1.5px solid rgba(0, 0, 0, 0.08);
  border-radius: 1.5rem 1.5rem 0 0;
  padding: 1.5rem;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-height: 70%;
  overflow-y: auto;
  box-sizing: border-box;
  animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideInUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding-bottom: 0.75rem;
`;

export const DrawerTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const DrawerCloseButton = styled.button`
  background: rgba(0, 0, 0, 0.05);
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  color: #71717a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #0f172a;
  }
`;

export const AdvisoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const AdvisoryCard = styled.div`
  background: #f8fafc;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const AdvisoryCardTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #ea580c;
`;

export const AdvisoryCardMessage = styled.p`
  font-size: 12px;
  color: #334155;
  line-height: 1.5;
`;

export const FloatingToggleZonesButton = styled.button<{ $active: boolean }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: ${props => props.$active ? '#e65100' : '#ffffff'};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  cursor: pointer;
  color: ${props => props.$active ? '#ffffff' : '#e65100'};
  transition: all 0.2s;
  padding: 0;
  pointer-events: auto;

  &:active {
    transform: scale(0.95);
  }
`;









