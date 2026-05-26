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
  background-color: rgba(9, 9, 11, 0.85); /* bg-zinc-950/85 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  z-index: 30;
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

// Directions Dashboard (Upper Panel)
export const DirectionsDashboard = styled.div`
  height: 28%;
  min-height: 175px;
  overflow-y: auto;
  padding: 0.875rem; /* p-3.5 */
  padding-bottom: 0.5rem; /* pb-2 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.625rem; /* space-y-2.5 */
  background-color: rgba(10, 10, 15, 0.95); /* bg-[#0a0a0f]/95 */
  border-bottom: 1px solid #18181b; /* border-zinc-900 */
  z-index: 10;
  position: relative;
  flex-shrink: 0;
`;

// Arrival Notification Overlay
export const ArrivalOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(2, 44, 34, 0.95); /* bg-emerald-955/95 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  z-index: 20;
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

export const NavHeaderCategory = styled.div`
  font-size: 9px;
  color: #d97706;
  text-transform: uppercase;
  letter-spacing: 0.1em; /* tracking-widest */
  font-weight: 900;
  line-height: 1;
`;

export const NavHeaderTitle = styled.h3`
  font-size: 0.875rem; /* text-sm */
  font-weight: 800;
  color: #fafafa; /* text-zinc-50 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  margin: 0;
  margin-top: 0.25rem; /* mt-1 */
  line-height: 1.25;
`;

export const NavHeaderStatsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.25rem; /* gap-1 */
  flex-shrink: 0;
`;

export const NavHeaderStats = styled.span`
  font-size: 10px;
  color: #71717a; /* text-zinc-450 */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  font-weight: 900;
`;

// Compass Banner
export const CompassBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem; /* space-x-3.5 */
  background-color: rgba(24, 24, 27, 0.6); /* bg-zinc-900/60 */
  border: 1px solid rgba(39, 39, 42, 0.8); /* border-zinc-800/80 */
  border-radius: 1rem; /* rounded-2xl */
  padding: 0.625rem; /* p-2.5 */
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.6);
`;

export const CompassRing = styled.div`
  position: relative;
  height: 3.25rem; /* h-13 */
  width: 3.25rem; /* w-13 */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #09090b; /* bg-zinc-950 */
  border: 1px solid rgba(39, 39, 42, 0.8); /* border-zinc-800/80 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const CompassText = styled.div`
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem; /* space-y-0.5 */
`;

export const CompassSub = styled.div`
  font-size: 7.5px;
  color: #71717a; /* text-zinc-505 */
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  line-height: 1;
`;

export const CompassTitle = styled.div`
  font-size: 0.75rem; /* text-xs */
  font-weight: 900;
  color: #10b981; /* text-emerald-400 */
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wide */
  line-height: 1;
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  margin-top: 0.125rem;
`;

export const CompassInstruction = styled.p`
  font-size: 10px;
  font-weight: 700;
  color: #d4d4d8; /* text-zinc-300 */
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
`;

// Controls
export const ControlsGrid = styled.div`
  display: grid;
  grid-template-cols: repeat(2, minmax(0, 1fr)); /* grid-cols-2 */
  gap: 0.75rem; /* gap-3 */
  padding-top: 0.125rem; /* pt-0.5 */
`;

export const SimulateButton = styled.button`
  padding: 0.5rem; /* py-2 */
  background: linear-gradient(to right, #059669, #14b8a6); /* from-emerald-600 to-teal-500 */
  color: #ffffff;
  font-weight: 900;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;
  border: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem; /* gap-1.5 */
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: linear-gradient(to right, #10b981, #2dd4bf);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const StopNavigationButton = styled.button`
  padding: 0.5rem; /* py-2 */
  background-color: rgba(127, 29, 29, 0.2); /* bg-red-955/20 */
  color: #f87171; /* text-red-400 */
  border: 1px solid rgba(185, 28, 28, 0.3); /* border-red-900/30 */
  font-weight: 900;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(185, 28, 28, 0.4);
  }
`;

// Map Panel (Lower Panel)
interface MapPanelProps {
  isExpanded: boolean;
}

export const MapPanel = styled.div<MapPanelProps>`
  position: relative;
  z-index: 0;
  border-top: 1px solid #18181b; /* border-zinc-900 */
  height: ${props => props.isExpanded ? '100%' : '72%'};
  ${props => props.isExpanded && 'flex-grow: 1;'}
`;

export const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
`;

export const MapToggleButton = styled.button`
  position: absolute;
  top: 1rem; /* top-4 */
  left: 1rem; /* left-4 */
  z-index: 20;
  padding: 0.625rem; /* p-2.5 */
  background-color: rgba(24, 24, 27, 0.9); /* bg-zinc-900/90 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  color: #22d3ee; /* text-cyan-400 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
  }
`;

export const MapRecenterButton = styled.button`
  position: absolute;
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  z-index: 20;
  padding: 0.625rem; /* p-2.5 */
  background-color: rgba(24, 24, 27, 0.9); /* bg-zinc-900/90 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  color: #22d3ee; /* text-cyan-400 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
  }
`;

// Expanded banner overlay
export const ExpandedBanner = styled.div`
  position: absolute;
  top: 4rem; /* top-16 */
  left: 1rem;
  right: 1rem; /* left-4 right-4 */
  z-index: 20;
  padding: 0.75rem; /* p-3 */
  background-color: rgba(9, 9, 11, 0.9); /* bg-zinc-950/90 */
  border: 1px solid rgba(39, 39, 42, 0.8); /* border-zinc-800/80 */
  border-radius: 1rem; /* rounded-2xl */
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: #10b981; /* border-l-[#10b981] */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const ExpandedBannerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* space-x-3 */
  min-width: 0;
  flex: 1;
  margin-right: 0.5rem; /* mr-2 */
`;

export const ExpandedCompassRing = styled.div`
  position: relative;
  height: 2.25rem; /* h-9 */
  width: 2.25rem; /* w-9 */
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const ExpandedBannerActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; /* space-x-1.5 */
  flex-shrink: 0;
`;

export const ExpandedSimulateButton = styled.button`
  padding: 0.375rem 0.625rem; /* py-1.5 px-2.5 */
  background-color: #059669; /* bg-emerald-600 */
  color: #ffffff;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  border-radius: 0.5rem; /* rounded-lg */
  border: 0;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #10b981;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const ExpandedCloseButton = styled.button`
  padding: 0.375rem; /* p-1.5 */
  background-color: rgba(127, 29, 29, 0.4); /* bg-red-955/40 */
  border: 1px solid rgba(185, 28, 28, 0.4); /* border-red-900/40 */
  color: #f87171; /* text-red-400 */
  border-radius: 0.5rem; /* rounded-lg */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: all 0.2s;

  &:hover {
    background-color: rgba(185, 28, 28, 0.6);
  }
`;

export const FooterCoordinatesDisplay = styled.div`
  position: absolute;
  bottom: 1rem; /* bottom-4 */
  left: 1rem;
  right: 1rem; /* left-4 right-4 */
  z-index: 20;
  padding: 0.5rem; /* p-2 */
  background-color: rgba(9, 9, 11, 0.95); /* bg-zinc-950/95 */
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

// GPS Status Pills (Overlay re-use)
export const GPSLockedPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  padding: 0.125rem 0.5rem; /* py-0.5 px-2 */
  border-radius: 9999px;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  font-size: 9px;
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
  gap: 0.25rem; /* gap-1 */
  padding: 0.125rem 0.5rem; /* py-0.5 px-2 */
  border-radius: 9999px;
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #fbbf24;
  font-size: 9px;
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
  gap: 0.25rem; /* gap-1 */
  padding: 0.125rem 0.5rem; /* py-0.5 px-2 */
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f43f5e;
  font-size: 9px;
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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const StyledCompassIcon = styled(Compass)`
  width: 2rem;
  height: 2rem;
  animation: ${spin} 3s linear infinite;
`;

export const CompassArrowSvg = styled.svg`
  width: 1.75rem;
  height: 1.75rem;
  color: #34d399; /* text-emerald-400 */
  transition: transform 300ms ease-out;
`;

export const ExpandedCompassArrowSvg = styled.svg`
  width: 1.125rem;
  height: 1.125rem;
  color: #34d399; /* text-emerald-400 */
  transition: transform 300ms ease-out;
`;

export const StyledPartyPopper = styled(PartyPopper)`
  width: 2.5rem;
  height: 2.5rem;
  color: #34d399; /* text-emerald-400 */
  margin-bottom: 0.5rem;
  animation: ${bounce} 1s infinite;
`;

export const StyledArrowLeft = styled(ArrowLeft)`
  width: 1rem;
  height: 1rem;
  color: #a1a1aa; /* text-zinc-400 */
`;

export const StyledNavigation = styled(Navigation)`
  width: 1rem;
  height: 1rem;
  transform: rotate(45deg);
`;

export const StyledMapPin = styled(MapPin)`
  width: 0.75rem;
  height: 0.75rem;
  color: #22d3ee; /* text-cyan-400 */
`;

export const ToggleSvg = styled.svg`
  width: 1rem;
  height: 1rem;
`;

export const CloseSvg = styled.svg`
  width: 0.75rem;
  height: 0.75rem;
`;

