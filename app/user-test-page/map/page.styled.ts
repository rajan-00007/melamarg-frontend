'use client';

import styled, { keyframes } from 'styled-components';

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

export const DashboardContainer = styled.div`
  height: 40%;
  min-height: 200px;
  background: linear-gradient(180deg, #0b0b14 0%, #07070a 100%);
  border-bottom: 1px solid #18181b;
  position: relative;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  box-sizing: border-box;
  gap: 0.5rem;
`;

export const MapContainer = styled.div`
  flex: 1;
  height: 60%;
  position: relative;
  z-index: 10;
`;

export const CentralCard = styled.div`
  flex: 1;
  width: 100%;
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid rgba(39, 39, 42, 0.6);
  border-radius: 1.5rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.45);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-sizing: border-box;

  &:hover {
    border-color: rgba(34, 211, 238, 0.4);
    box-shadow: 0 10px 40px 0 rgba(34, 211, 238, 0.1);
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
  font-size: 0.58rem;
  font-weight: 800;
  color: ${props => props.$side === 'front' ? '#22d3ee' : '#f97316'};
  display: flex;
  align-items: center;
  gap: 0.2rem;
  max-width: 100%;
  cursor: pointer;
  background: rgba(9, 9, 11, 0.7);
  padding: 0.3rem 0.75rem;
  border-radius: 0.75rem;
  border: 1px solid ${props => props.$side === 'front' ? 'rgba(34, 211, 238, 0.35)' : 'rgba(249, 115, 22, 0.35)'};
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);

  span.name {
    color: #fafafa;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90px;
  }

  span.dist {
    color: #a1a1aa;
    font-weight: 600;
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

// WALK TRACKING OVERLAYS
export const TrackToggleCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.65rem 0.85rem;
  background-color: rgba(24, 24, 27, 0.9); /* bg-zinc-900/90 */
  border: 1px solid rgba(39, 39, 42, 0.9); /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  z-index: 20;
  color: #fafafa;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.025em;

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 1.25rem;
  }

  .toggle-label {
    text-transform: uppercase;
    font-weight: 800;
    font-size: 8.5px;
    color: #a1a1aa;
    white-space: nowrap;
  }

  /* Custom Switch slider styles */
  .switch {
    position: relative;
    display: inline-block;
    width: 2.25rem; /* 36px */
    height: 1.25rem; /* 20px */
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #27272a;
    transition: .3s;
    border-radius: 9999px;
    border: 1px solid #3f3f46;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 0.85rem; /* 14px */
    width: 0.85rem; /* 14px */
    left: 2px;
    bottom: 2px;
    background-color: #a1a1aa;
    transition: .3s;
    border-radius: 50%;
  }

  input:checked + .slider {
    background-color: rgba(168, 85, 247, 0.2); /* purple-500/20 */
    border-color: #a855f7; /* purple-500 */
  }

  input:checked + .slider:before {
    transform: translateX(16px);
    background-color: #c084fc; /* purple-400 */
  }
`;

export const TelemetryHUDOverlay = styled.div`
  position: absolute;
  bottom: 3.25rem; /* Raised slightly to sit above default CoordinatesDisplay or bottom tab */
  left: 1rem;
  right: 1rem;
  z-index: 20;
  padding: 0.75rem 1rem;
  background: rgba(15, 10, 25, 0.85); /* Dark violet tinted glassmorphism */
  border: 1px solid rgba(168, 85, 247, 0.35); /* Purple outline */
  border-radius: 1rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(168, 85, 247, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  box-sizing: border-box;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

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

export const TelemetryStatsGrid = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex: 1;
  gap: 0.5rem;
`;

export const TelemetryCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  flex: 1;
`;

export const TelemetryLabel = styled.span`
  font-size: 8px;
  font-weight: 800;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TelemetryValue = styled.span`
  font-size: 13px;
  font-weight: 900;
  color: #fafafa;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  span.unit {
    font-size: 9px;
    font-weight: 700;
    color: #a855f7;
    margin-left: 0.1rem;
  }
`;

export const TelemetryDivider = styled.div`
  width: 1px;
  height: 24px;
  background-color: rgba(168, 85, 247, 0.2);
`;

export const TelemetryStatusDot = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 8px;
  font-weight: 800;
  color: #a855f7;
  text-transform: uppercase;
  letter-spacing: 0.075em;
  padding-right: 0.25rem;

  span.pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #c084fc;
    animation: ${ping} 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const HistoryClearButton = styled.button`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #f43f5e;
  padding: 0.3rem 0.5rem;
  font-size: 9px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  text-transform: uppercase;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    color: #ffffff;
  }
`;


