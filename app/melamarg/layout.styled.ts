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
  background-color: #f3f4f6;
  color: #1f2937;
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
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-left-width: 4px;
  border-left-style: solid;
  border-left-color: ${props => props.$leftBorderColor};
  background-color: #ffffff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
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

export const ToastTitle = styled.span`
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-widest */
  color: #111827;
`;

export const ToastMessage = styled.p`
  font-size: 11px;
  line-height: 1.625; /* leading-relaxed */
  color: #111827;
  font-weight: 500;
  margin: 0;
`;

export const ToastAction = styled.button`
  margin-top: 0.5rem; /* mt-2 */
  font-size: 10px;
  font-weight: 700;
  color: #2563eb;
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
    color: #1d4ed8;
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg.arrow-right {
    transform: translateX(2px);
  }
`;

export const ToastDismiss = styled.button`
  color: #9ca3af;
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
    color: #4b5563;
  }
`;

// Top Header / Utility Banner
export const TopBanner = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px); /* backdrop-blur */
  border-bottom: 1px solid #e5e7eb;
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
  color: #4b5563;
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
        background-color: rgba(209, 250, 229, 0.6);
        color: #065f46;
        border-color: rgba(16, 185, 129, 0.3);
      `;
    } else if (props.platform === 'ios') {
      return `
        background-color: rgba(219, 234, 254, 0.6);
        color: #1e40af;
        border-color: rgba(59, 130, 246, 0.3);
      `;
    } else {
      return `
        background-color: #f3f4f6;
        color: #4b5563;
        border-color: #e5e7eb;
      `;
    }
  }}
`;

export const EditButton = styled.button`
  font-size: 9px;
  color: #2563eb;
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
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #4b5563;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  transition: all 0.2s;

  &:hover {
    color: #111827;
    border-color: #9ca3af;
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
    background-color: rgba(254, 243, 199, 0.8);
    color: #92400e;
    border-color: rgba(217, 119, 6, 0.4);
  ` : `
    background-color: rgba(209, 250, 229, 0.6);
    color: #065f46;
    border-color: rgba(16, 185, 129, 0.3);
  `}
`;

export const ResetButton = styled.button`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  color: #4b5563;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  padding: 0.25rem 0.5rem; /* py-1 px-2 */
  border-radius: 0.375rem; /* rounded-md */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #111827;
    border-color: #9ca3af;
  }
`;

export const PresetsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  padding-top: 0.5rem; /* pt-2 */
  margin-top: 0.5rem; /* mt-2 */
  border-top: 1px solid #e5e7eb;
`;

export const PresetsLabel = styled.span`
  font-size: 8px;
  color: #6b7280;
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
          background-color: rgba(254, 243, 199, 0.8);
          color: #92400e;
          border-color: rgba(217, 119, 6, 0.4);
        `;
      }
      return `
        background-color: rgba(219, 234, 254, 0.8);
        color: #1e40af;
        border-color: rgba(59, 130, 246, 0.4);
      `;
    } else {
      if (props.$isAmber) {
        return `
          background-color: #ffffff;
          color: rgba(180, 83, 9, 0.8);
          border-color: #d1d5db;
          &:hover {
            color: #b45309;
          }
        `;
      }
      return `
        background-color: #ffffff;
        color: #6b7280;
        border-color: #d1d5db;
        &:hover {
          color: #111827;
          background-color: #f9fafb;
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
  background-color: #ffffff;
  border-top: 1px solid #e5e7eb;
  padding: 0.85rem 0.5rem 0.65rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 30;
  user-select: none;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.03);
`;

interface NavButtonProps {
  $isActive: boolean;
  $activeColor: string;
}

export const NavIconWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 1.25rem;
  border-radius: 9999px;
  transition: all 0.2s ease-in-out;
  background-color: ${props => props.$isActive ? '#eff6ff' : 'transparent'};
  color: ${props => props.$isActive ? '#1d4ed8' : '#9ca3af'};
  margin-bottom: 0.125rem;

  svg {
    width: 1.45rem;
    height: 1.45rem;
    stroke-width: 2.25;
  }
`;

export const NavButton = styled.button<NavButtonProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: 0;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
  padding: 0;
  flex: 1;
  min-width: 0;
`;

export const NavBadge = styled.span`
  position: absolute;
  top: -0.125rem;
  right: 1.15rem;
  height: 1rem;
  width: 1rem;
  background-color: #ef4444; /* bg-rose-500 */
  color: #ffffff;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 7px;
  animation: ${bounceShort} 1s infinite;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;

export const NavButtonText = styled.span<{ $isActive: boolean }>`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-widest */
  font-weight: 800;
  color: ${props => props.$isActive ? '#1e293b' : '#9ca3af'};
  transition: color 0.2s;
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

export const FloatingExploreButton = styled.button`
  position: fixed;
  bottom: 6.2rem;
  right: 1.25rem;
  background-color: #3b2eb6;
  color: #ffffff;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 10px 25px rgba(59, 46, 182, 0.3);
  z-index: 40;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #2c2194;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(59, 46, 182, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 0.9rem;
    height: 0.9rem;
    stroke-width: 2.5;
  }
`;

export const FloatDevButton = styled.button`
  position: fixed;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 100;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #111827;
    background-color: #ffffff;
    transform: rotate(45deg);
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`;

// Mobile Sidebar Styled Components
export const SidebarBackdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: opacity 0.3s ease, visibility 0.3s ease;
`;

export const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 290px;
  max-width: 80%;
  background-color: rgba(255, 255, 255, 0.98);
  box-shadow: 20px 0 50px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  overflow: hidden;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(135deg, #FCF2E7 0%, #FFFFFF 100%);
`;

export const SidebarTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const SidebarTitle = styled.h2`
  font-family: 'Atkinson Hyperlegible Next', sans-serif;
  font-size: 16px;
  font-weight: 900;
  color: #E65100;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`;

export const SidebarSubtitle = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const SidebarCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.04);
  border: 0;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
`;

export const SidebarList = styled.nav`
  flex: 1;
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow-y: auto;
`;

export const SidebarItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  font-size: 13.5px;
  font-weight: 700;
  color: ${props => props.$isActive ? '#E65100' : '#475569'};
  background-color: ${props => props.$isActive ? '#FCF2E7' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid ${props => props.$isActive ? 'rgba(230, 81, 0, 0.15)' : 'transparent'};

  &:hover {
    background-color: ${props => props.$isActive ? '#FCF2E7' : '#F8FAFC'};
    color: ${props => props.$isActive ? '#E65100' : '#0F172A'};
    transform: translateX(4px);
  }

  svg {
    width: 1.2rem;
    height: 1.2rem;
    color: ${props => props.$isActive ? '#E65100' : '#64748B'};
  }
`;

export const SidebarFooter = styled.div`
  padding: 1.25rem;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  background-color: #F8FAFC;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
`;

export const SidebarFooterText = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #94A3B8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

