'use client';

import styled, { keyframes, css } from 'styled-components';

// Keyframe Animations
const bounceShort = keyframes`
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

// Layout Container
export const RootContainer = styled.div`
  height: 100vh;
  height: 100dvh;
  background-color: #07070a;
  color: #fafafa; /* zinc-50 */
  font-family: Inter, system-ui, -apple-system, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  position: relative;
  user-select: none;
`;

// Toasts Container
export const ToastsContainer = styled.div`
  position: fixed;
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  left: 1rem; /* left-4 */
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* gap-3 */
  pointer-events: none;
  max-w: 24rem; /* max-w-sm */
  margin-left: auto;
  margin-right: auto;
`;

// Individual Toast Card
interface ToastCardProps {
  $leftBorderColor: string;
  $bgOverlay: string;
}

export const ToastCard = styled.div<ToastCardProps>`
  pointer-events: auto;
  display: flex;
  align-items: start;
  padding: 1rem; /* p-4 */
  border-radius: 1.5rem; /* rounded-3xl */
  border: 1px solid rgba(24, 24, 27, 0.8); /* border-zinc-900/80 */
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${props => props.$leftBorderColor};
  background-color: ${props => props.$bgOverlay};
  backdrop-filter: blur(24px); /* backdrop-blur-xl */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); /* shadow-2xl */
  transition: all 0.3s;
  animation: ${bounceShort} 1.5s ease-in-out infinite;
`;

export const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
  padding-right: 0.5rem; /* pr-2 */
`;

export const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  margin-bottom: 0.25rem; /* mb-1 */
`;

interface ToastTitleProps {
  $color: string;
}

export const ToastTitle = styled.span<ToastTitleProps>`
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-widest */
  color: ${props => props.$color};
`;

export const ToastMessage = styled.p`
  font-size: 11px;
  line-height: 1.625; /* leading-relaxed */
  color: #e4e4e7; /* text-zinc-200 */
  font-weight: 500;
  margin: 0;
`;

export const ToastAction = styled.button`
  margin-top: 0.5rem; /* mt-2 */
  font-size: 10px;
  font-weight: 700;
  color: #22d3ee; /* text-cyan-400 */
  background: transparent;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  pointer-events: auto;
  padding: 0;
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

export const ToastDismiss = styled.button`
  color: #71717a; /* text-zinc-500 */
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.125rem; /* p-0.5 */
  margin-left: 0.5rem; /* ml-2 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #d4d4d8; /* hover:text-zinc-300 */
  }
`;

// Top Header / Utility Banner
export const TopBanner = styled.div`
  background-color: rgba(18, 18, 22, 0.9); /* bg-[#121216]/90 */
  backdrop-filter: blur(8px); /* backdrop-blur */
  border-bottom: 1px solid #18181b; /* border-zinc-900 */
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* gap-1.5 */
  position: relative;
  z-index: 40;
`;

export const BannerRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem; /* gap-2 */
`;

export const EndpointWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem; /* space-x-2 */
  min-width: 0;
  flex: 1;
`;

interface StatusIndicatorProps {
  $isError: boolean;
}

export const StatusIndicator = styled.span<StatusIndicatorProps>`
  height: 0.375rem; /* h-1.5 */
  width: 0.375rem; /* w-1.5 */
  flex-shrink: 0;
  border-radius: 9999px;
  background-color: ${props => props.$isError ? '#ef4444' : '#10b981'};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  ${props => !props.$isError && css`
    animation: ${pulse} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  `}
`;

export const EndpointText = styled.span`
  font-size: 9px;
  color: #a1a1aa; /* text-zinc-400 */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PlatformBadge = styled.span<{ platform: string }>`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.125rem 0.375rem; /* py-0.5 px-1.5 */
  border-radius: 0.25rem;
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  ${props => {
    if (props.platform === 'android') {
      return `
        background-color: rgba(6, 78, 59, 0.4); /* bg-green-950/40 */
        color: #4ade80; /* text-green-400 */
        border-color: rgba(6, 95, 70, 0.4); /* border-green-900/40 */
      `;
    } else if (props.platform === 'ios') {
      return `
        background-color: rgba(23, 37, 84, 0.4); /* bg-blue-950/40 */
        color: #60a5fa; /* text-blue-400 */
        border-color: rgba(30, 58, 138, 0.4); /* border-blue-900/40 */
      `;
    } else {
      return `
        background-color: #18181b; /* bg-zinc-900 */
        color: #71717a; /* text-zinc-500 */
        border-color: #27272a; /* border-zinc-800 */
      `;
    }
  }}
`;

export const EditButton = styled.button`
  font-size: 9px;
  color: #22d3ee; /* text-cyan-400 */
  font-weight: 800;
  text-decoration: underline;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
`;

export const RefreshButton = styled.button`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.375rem; /* rounded-lg */
  border: 1px solid #27272a; /* border-zinc-800 */
  background-color: #18181b; /* bg-zinc-900 */
  color: #a1a1aa; /* text-zinc-400 */
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  transition: all 0.2s;

  &:hover {
    color: #fafafa;
    border-color: #3f3f46;
  }
`;

interface OfflineModeButtonProps {
  $isOffline: boolean;
}

export const OfflineModeButton = styled.button<OfflineModeButtonProps>`
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  font-weight: 800;
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.375rem; /* rounded-lg */
  border: 1px solid;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;

  ${props => props.$isOffline ? `
    background-color: rgba(69, 26, 3, 0.3); /* bg-amber-950/30 */
    color: #fbbf24; /* text-amber-400 */
    border-color: rgba(120, 53, 15, 0.5); /* border-amber-900/50 */
  ` : `
    background-color: rgba(2, 44, 34, 0.2); /* bg-emerald-955/20 */
    color: #34d399; /* text-emerald-400 */
    border-color: rgba(6, 95, 70, 0.4); /* border-emerald-900/40 */
  `}
`;

export const ResetButton = styled.button`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  color: #a1a1aa; /* text-zinc-400 */
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #fafafa;
    border-color: #3f3f46;
  }
`;

export const PresetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  padding-top: 0.5rem; /* pt-2 */
  margin-top: 0.5rem; /* mt-2 */
  border-top: 1px solid rgba(39, 39, 42, 0.4); /* border-zinc-800/40 */
`;

export const PresetsLabel = styled.span`
  font-size: 8px;
  color: #71717a; /* text-zinc-500 */
  text-transform: uppercase;
  font-weight: 900;
  margin-right: 0.25rem; /* mr-1 */
`;

interface PresetButtonProps {
  $isActive: boolean;
  $isAmber?: boolean;
}

export const PresetButton = styled.button<PresetButtonProps>`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.125rem 0.5rem; /* py-0.5 px-2 */
  border-radius: 0.25rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.125rem;

  ${props => {
    if (props.$isActive) {
      if (props.$isAmber) {
        return `
          background-color: rgba(69, 26, 3, 0.4); /* bg-amber-950/40 */
          color: #fbbf24; /* text-amber-400 */
          border-color: rgba(180, 83, 9, 0.5); /* border-amber-800/50 */
        `;
      }
      return `
        background-color: rgba(8, 47, 73, 0.4); /* bg-cyan-950/40 */
        color: #22d3ee; /* text-cyan-400 */
        border-color: rgba(6, 182, 212, 0.5); /* border-cyan-800/50 */
      `;
    } else {
      if (props.$isAmber) {
        return `
          background-color: #18181b;
          color: rgba(245, 158, 11, 0.7);
          border-color: #27272a;
          &:hover {
            color: #fbbf24;
          }
        `;
      }
      return `
        background-color: #18181b; /* bg-zinc-900 / bg-zinc-800/50 */
        color: #a1a1aa; /* text-zinc-450 */
        border-color: #27272a; /* border-zinc-800 / border-zinc-700/50 */
        &:hover {
          color: #fafafa;
          background-color: #27272a;
        }
      `;
    }
  }}
`;

// Body Content Container
export const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  position: relative;
  z-index: 10;
`;

// Bottom Navigation Bar
export const BottomNav = styled.nav`
  background-color: #07070a;
  border-top: 1px solid #18181b; /* border-zinc-900 */
  padding: 0.75rem 1rem; /* py-3 px-4 */
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
  user-select: none;
`;

interface NavButtonProps {
  $isActive: boolean;
  $activeColor: string;
}

export const NavButton = styled.button<NavButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem; /* space-y-1.5 */
  font-size: 0.75rem; /* text-xs */
  font-weight: 700;
  background: transparent;
  border: 0;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
  color: ${props => props.$isActive ? props.$activeColor : '#71717a'}; /* hover:text-zinc-300 */

  &:hover {
    color: ${props => props.$isActive ? props.$activeColor : '#d4d4d8'};
  }
`;

export const NavBadge = styled.span`
  position: absolute;
  top: -0.375rem; /* -top-1.5 */
  right: -0.25rem; /* -right-1 */
  height: 1.125rem; /* h-4.5 */
  width: 1.125rem; /* w-4.5 */
  background-color: #ef4444; /* bg-rose-500 */
  color: #ffffff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 7.5px;
  animation: ${bounceShort} 1s infinite;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

export const NavButtonText = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-widest */
  font-weight: 900;
`;

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
  color: #f43f5e; /* text-rose-450 */
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
