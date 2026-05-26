'use client';

import styled, { keyframes } from 'styled-components';
import { Trash2, AlertTriangle, CheckCircle2, Zap, RefreshCw } from 'lucide-react';

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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
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

const bounce = keyframes`
  0%, 100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
`;

// Layout Wrapper
export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
`;

// Selector Screen
export const SelectorContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 1.5rem; /* p-6 */
  gap: 1.5rem; /* space-y-6 */
  padding-top: 2.5rem; /* pt-10 */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const Header = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
`;

export const Title = styled.h2`
  font-size: 2.25rem; /* text-4xl */
  font-weight: 800;
  letter-spacing: 0.05em; /* tracking-wider */
  background: linear-gradient(to right, #22d3ee, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.75rem; /* text-xs */
  color: #a1a1aa; /* text-zinc-400 */
  line-height: 1.5;
  max-w: 20rem; /* max-w-xs */
  margin: 0 auto;
`;

export const ClearCacheButton = styled.button`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em; /* tracking-widest */
  color: #d97706;
  background-color: rgba(69, 26, 3, 0.2); /* bg-amber-950/20 */
  border: 1px solid rgba(120, 53, 15, 0.4); /* border-amber-900/40 */
  padding: 0.375rem 0.75rem; /* py-1.5 px-3 */
  border-radius: 0.5rem; /* rounded-lg */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem; /* gap-1.5 */
  transition: all 0.2s;

  &:hover {
    background-color: rgba(69, 26, 3, 0.4); /* hover:bg-amber-950/40 */
  }
`;

// Alerts / Error Box
export const AlertBox = styled.div`
  width: 100%;
  max-width: 28rem; /* max-w-md */
  padding: 1rem; /* p-4 */
  background-color: rgba(69, 26, 3, 0.2); /* bg-amber-950/20 */
  border: 1px solid rgba(217, 119, 6, 0.3); /* border-amber-600/30 */
  border-radius: 1rem; /* rounded-2xl */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem; /* space-y-2 */
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.6);
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const AlertTitle = styled.div`
  font-size: 0.75rem; /* text-xs */
  color: #f59e0b; /* text-amber-500 */
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wide */
`;

export const AlertText = styled.p`
  font-size: 10px;
  color: #a1a1aa; /* text-zinc-400 */
  line-height: 1.625;
  max-w: 20rem; /* max-w-xs */
  margin: 0;
`;

export const ConfigureButton = styled.button`
  padding: 0.25rem 0.75rem; /* py-1 px-3 */
  background-color: rgba(69, 26, 3, 0.6); /* bg-amber-950/60 */
  border: 1px solid rgba(217, 119, 6, 0.4); /* border-amber-600/40 */
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 9px;
  color: #fbbf24; /* text-amber-400 */
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 0.25rem; /* mt-1 */
  transition: all 0.2s;

  &:hover {
    background-color: rgba(120, 53, 15, 0.4); /* hover:bg-amber-900/40 */
  }
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem; /* space-y-3 */
  padding-top: 3rem;
  padding-bottom: 3rem; /* py-12 */
`;

export const Spinner = styled.div`
  height: 2rem; /* h-8 */
  width: 2rem; /* w-8 */
  border-width: 3px;
  border-style: solid;
  border-color: #27272a; /* border-zinc-800 */
  border-top-color: #22d3ee; /* border-t-cyan-500 */
  border-radius: 9999px;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.span`
  font-size: 0.75rem; /* text-xs */
  color: #71717a; /* text-zinc-500 */
`;

// Empty State
export const EmptyState = styled.div`
  padding: 2rem; /* p-8 */
  border: 1px dashed rgba(39, 39, 42, 0.4); /* border-zinc-900/40 */
  background-color: rgba(9, 9, 11, 0.2); /* bg-zinc-950/20 */
  border-radius: 1rem; /* rounded-2xl */
  text-align: center;
  font-size: 0.75rem; /* text-xs */
  color: #71717a; /* text-zinc-500 */
`;

// Events List
export const EventList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  padding-top: 0.5rem; /* pt-2 */
  max-width: 28rem; /* max-w-md */
`;

interface EventCardProps {
  $isDownloaded: boolean;
}

export const EventCard = styled.div<EventCardProps>`
  padding: 1.25rem; /* p-5 */
  border-radius: 1rem; /* rounded-2xl */
  border: 1px solid ${props => props.$isDownloaded ? 'rgba(6, 95, 70, 0.4)' : '#27272a'};
  background-color: ${props => props.$isDownloaded ? 'rgba(15, 23, 18, 0.5)' : 'rgba(18, 18, 23, 0.5)'};
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${props => props.$isDownloaded ? 'rgba(15, 23, 18, 1)' : 'rgba(18, 18, 23, 1)'};
  }
`;

export const EventHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const EventTitle = styled.h4`
  font-weight: 800;
  font-size: 0.875rem; /* text-sm */
  color: #f4f4f5; /* text-zinc-100 */
  display: flex;
  align-items: center;
  margin: 0;
`;

export const DownloadedBadge = styled.span`
  margin-left: 0.5rem; /* ml-2 */
  padding: 0.125rem 0.5rem; /* py-0.5 px-2 */
  border-radius: 0.25rem;
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  background-color: rgba(2, 44, 34, 0.8); /* bg-emerald-950/80 */
  color: #34d399; /* text-emerald-400 */
  border: 1px solid rgba(6, 95, 70, 0.4); /* border-emerald-900/40 */
  display: flex;
  align-items: center;
  gap: 0.125rem; /* gap-0.5 */
`;

export const EventDescription = styled.p`
  font-size: 10px;
  color: #a1a1aa; /* text-zinc-400 */
  line-height: 1.625;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem; /* space-x-2 */
`;

interface ButtonProps {
  $isDownloaded: boolean;
}

export const DownloadOrOpenButton = styled.button<ButtonProps>`
  flex: 1;
  padding: 0.625rem; /* py-2.5 */
  font-weight: 800;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  letter-spacing: 0.05em; /* tracking-wider */
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem; /* space-x-1.5 */
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.25s;

  ${props => props.$isDownloaded ? `
    background: linear-gradient(to right, #059669, #14b8a6); /* from-emerald-600 to-teal-500 */
    &:hover {
      background: linear-gradient(to right, #10b981, #2dd4bf); /* hover:from-emerald-500 hover:to-teal-400 */
    }
  ` : `
    background: linear-gradient(to right, #0891b2, #6366f1); /* from-cyan-600 to-indigo-500 */
    &:hover {
      background: linear-gradient(to right, #06b6d4, #818cf8); /* hover:from-cyan-500 hover:to-indigo-400 */
    }
  `}
`;

export const RedownloadButton = styled.button`
  padding-left: 0.75rem;
  padding-right: 0.75rem; /* px-3 */
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  color: #a1a1aa; /* text-zinc-400 */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(18, 18, 23, 0.5); /* hover:bg-[#121217] */
    color: #ffffff;
  }
`;

// Downloading Progress Screen
export const DownloadingContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem; /* p-6 */
  gap: 1.5rem; /* space-y-6 */
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const GlowIconBox = styled.div`
  position: relative;
  height: 4rem; /* h-16 */
  width: 4rem; /* w-16 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PulseCircle = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background-color: rgba(6, 182, 212, 0.1); /* bg-cyan-500/10 */
  border: 2px solid rgba(6, 182, 212, 0.3); /* border-cyan-500/30 */
  animation: ${pulse} 2s infinite;
`;

export const BouncingDownloadIcon = styled.svg`
  width: 2rem;
  height: 2rem;
  color: #22d3ee;
  animation: ${bounce} 1s infinite;
`;

export const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* space-y-2 */
  max-width: 320px;
`;

export const ProgressTextRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  color: #22d3ee; /* text-cyan-400 */
`;

export const ProgressBarBg = styled.div`
  height: 0.5rem; /* h-2 */
  background-color: #09090b; /* bg-zinc-950 / bg-zinc-900 */
  border-radius: 9999px;
  overflow: hidden;
  border: 1px solid #27272a; /* border-zinc-800 */
`;

interface ProgressBarFillProps {
  progress: number;
}

export const ProgressBarFill = styled.div<ProgressBarFillProps>`
  background: linear-gradient(to right, #22d3ee, #6366f1);
  height: 100%;
  border-radius: 9999px;
  width: ${props => props.progress}%;
  transition: width 0.2s ease-out;
`;

export const DetailCard = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: #0c0c10;
  border: 1px solid rgba(39, 39, 42, 0.8); /* border-zinc-800/80 */
  border-radius: 1.125rem; /* rounded-2xl (4.5) */
  padding: 1.125rem; /* p-4.5 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  text-align: left;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.8);
`;

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem; /* space-y-1.5 */
`;

export const DetailRowLabel = styled.span`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  color: #71717a; /* text-zinc-505 */
  font-weight: 900;
`;

export const DetailCodeBlock = styled.div`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  color: #e4e4e7; /* text-zinc-200 */
  background-color: #09090b; /* bg-zinc-955 / bg-zinc-950 */
  padding: 0.375rem 0.625rem; /* py-1.5 px-2.5 */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid #18181b; /* border-zinc-900 */
  word-break: break-all;
  user-select: all;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DatabaseBadge = styled.span`
  font-size: 8px;
  color: #22d3ee; /* text-cyan-400 */
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.1em; /* tracking-widest */
  background-color: rgba(8, 47, 73, 0.4); /* bg-cyan-950/40 */
  padding: 0.125rem 0.375rem; /* py-0.5 px-1.5 */
  border-radius: 0.25rem;
  border: 1px solid rgba(6, 182, 212, 0.4); /* border-cyan-900/40 */
`;

export const DetailUrlBlock = styled.div`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  color: #34d399; /* text-emerald-400 */
  background-color: #09090b; /* bg-zinc-950 */
  padding: 0.5rem 0.625rem; /* py-2 px-2.5 */
  border-radius: 0.5rem; /* rounded-lg */
  border: 1px solid #18181b; /* border-zinc-900 */
  word-break: break-all;
  user-select: all;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* space-y-1 */
`;

export const EndpointLabel = styled.span`
  color: #71717a; /* text-zinc-400 */
  font-size: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  font-weight: 700;
`;

export const VersionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.25rem; /* pt-1 */
  border-top: 1px solid rgba(18, 18, 22, 0.8); /* border-zinc-900/80 */
  font-size: 10px;
`;

export const VersionLabel = styled.span`
  color: #71717a; /* text-zinc-500 */
  font-weight: 500;
`;

export const VersionNumber = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 700;
  color: #d4d4d8; /* text-zinc-350 */
`;

// Geolocation Permission Screen
export const PermissionContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1.5rem; /* p-6 */
  gap: 1.5rem; /* space-y-6 */
  text-align: center;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const PermissionIconBox = styled.div`
  height: 4rem; /* h-16 */
  width: 4rem; /* w-16 */
  border-radius: 9999px;
  background-color: rgba(8, 47, 73, 0.5); /* bg-cyan-950/50 */
  border: 1px solid rgba(6, 182, 212, 0.4); /* border-cyan-800/40 */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee; /* text-cyan-400 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const PermissionTitle = styled.h3`
  font-size: 1.125rem; /* text-lg */
  font-weight: 700;
  color: #fafafa; /* text-zinc-100 */
  margin: 0;
`;

export const PermissionText = styled.p`
  font-size: 0.75rem; /* text-xs */
  color: #a1a1aa; /* text-zinc-400 */
  line-height: 1.625; /* leading-relaxed */
  max-w: 280px;
  margin: 0 auto;
`;

export const PermissionButtons = styled.div`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.625rem; /* space-y-2.5 */
  padding-top: 1rem; /* pt-4 */
`;

export const AllowButton = styled.button`
  width: 100%;
  padding: 0.75rem; /* py-3 */
  background: linear-gradient(to right, #0891b2, #6366f1); /* from-cyan-600 to-indigo-500 */
  color: #ffffff;
  font-weight: 800;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;
  border: 0;
  box-shadow: 0 10px 15px -3px rgba(6, 182, 212, 0.3); /* shadow-lg */
  transition: all 0.25s;

  &:hover {
    background: linear-gradient(to right, #06b6d4, #818cf8); /* hover:from-cyan-500 hover:to-indigo-400 */
  }
`;

export const DenyButton = styled.button`
  width: 100%;
  padding: 0.75rem; /* py-3 */
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  color: #d4d4d8; /* text-zinc-300 */
  font-weight: 800;
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 0.75rem; /* text-xs */
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #27272a; /* hover:bg-zinc-800 */
  }
`;

export const StyledTrash = styled(Trash2)`
  width: 0.875rem;
  height: 0.875rem;
`;

export const StyledAlertTriangle = styled(AlertTriangle)`
  width: 1.5rem;
  height: 1.5rem;
  color: #f59e0b; /* text-amber-500 */
`;

export const StyledCheckCircle = styled(CheckCircle2)`
  width: 0.625rem;
  height: 0.625rem;
`;

export const StyledZap = styled(Zap)`
  width: 0.875rem;
  height: 0.875rem;
`;

export const StyledRefreshCw = styled(RefreshCw)`
  width: 0.875rem;
  height: 0.875rem;
`;

export const DownloadButtonSvg = styled.svg`
  width: 1rem;
  height: 1rem;
  color: #c7d2fe; /* text-cyan-200 / indigo-200 */
`;

export const PermissionSvg = styled.svg`
  width: 2rem;
  height: 2rem;
`;

