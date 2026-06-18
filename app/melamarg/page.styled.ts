'use client';

import styled, { keyframes } from 'styled-components';
import { Trash2, AlertTriangle, CheckCircle2, Zap, RefreshCw } from 'lucide-react';
import { colors } from '@/components/style/colors';

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

// Layout Wrapper
export const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  position: relative;
  background-color: #fafaf5;
  min-height: 100dvh;
`;

// Selector Screen
export const SelectorContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 1.5rem;
  gap: 1.5rem;
  padding-top: 2.5rem;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const Header = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Title = styled.h2`
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  color: ${colors.neutral[900]};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral[800]};
  line-height: 1.5;
  max-width: 20rem;
  margin: 0 auto;
`;

export const ClearCacheButton = styled.button`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.brand.primary};
  background-color: rgba(230, 81, 0, 0.1);
  border: 1px solid rgba(230, 81, 0, 0.2);
  padding: 0.375rem 0.85rem;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(230, 81, 0, 0.15);
  }
`;

// Alerts / Error Box
export const AlertBox = styled.div`
  width: 100%;
  max-width: 28rem;
  padding: 1.25rem;
  background-color: #FFF3E0;
  border: 1px solid #FFE0B2;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  box-shadow: 0 4px 12px rgba(230, 81, 0, 0.05);
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const AlertTitle = styled.div`
  font-size: 0.875rem;
  color: ${colors.brand.primary};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const AlertText = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral[800]};
  line-height: 1.625;
  max-width: 20rem;
  margin: 0;
`;

export const ConfigureButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${colors.brand.primary};
  border: none;
  border-radius: 0.75rem;
  font-size: 10px;
  color: #FFFFFF;
  font-weight: 900;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 0.25rem;
  transition: all 0.2s;

  &:hover {
    background-color: #CC4800;
  }
`;

// Loading State
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
`;

export const Spinner = styled.div`
  height: 2.5rem;
  width: 2.5rem;
  border-width: 3px;
  border-style: solid;
  border-color: ${colors.neutral[500]};
  border-top-color: ${colors.brand.primary};
  border-radius: 9999px;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingText = styled.span`
  font-size: 0.875rem;
  color: ${colors.neutral[800]};
  font-weight: 600;
`;

// Empty State
export const EmptyState = styled.div`
  padding: 2.5rem 1.5rem;
  border: 2px dashed ${colors.neutral[500_2]};
  background-color: #FFFFFF;
  border-radius: 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  color: ${colors.neutral[800]};
  font-weight: 500;
`;

// Events List
export const EventList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
  max-width: 28rem;
`;

interface EventCardProps {
  $isDownloaded: boolean;
}

export const EventCard = styled.div<EventCardProps>`
  padding: 1.25rem;
  border-radius: 1.25rem;
  border: 1px solid ${props => props.$isDownloaded ? '#BBF7D0' : '#EEF2F6'};
  background-color: ${props => props.$isDownloaded ? '#F0FDF4' : '#FFFFFF'};
  transition: all 0.25s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
`;

export const EventBannerImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 0.75rem;
`;

export const EventHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const EventTitle = styled.h4`
  font-weight: 900;
  font-size: 1.125rem;
  color: ${colors.neutral[900]};
  display: flex;
  align-items: center;
  margin: 0;
`;

export const DownloadedBadge = styled.span`
  margin-left: 0.5rem;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #DCFCE7;
  color: #16A34A;
  border: 1px solid #BBF7D0;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const EventDescription = styled.p`
  font-size: 0.75rem;
  color: ${colors.neutral[800]};
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;
`;

interface ButtonProps {
  $isDownloaded: boolean;
}

export const DownloadOrOpenButton = styled.button<ButtonProps>`
  flex: 1;
  padding: 0.75rem;
  font-weight: 800;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  letter-spacing: 0.02em;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.25s;

  ${props => props.$isDownloaded ? `
    background: #16A34A;
    &:hover { background: #15803D; }
  ` : `
    background: ${colors.brand.primary};
    &:hover { background: #CC4800; }
  `}
`;

export const RedownloadButton = styled.button`
  padding: 0 0.75rem;
  background-color: #F9FAFC;
  border: 1px solid #EEF2F6;
  border-radius: 0.75rem;
  color: ${colors.neutral[800]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background-color: #EEF2F6;
    color: ${colors.neutral[900]};
  }
`;

// Downloading Progress Screen
export const DownloadingContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 3.5rem 2rem 2.5rem 2rem;
  text-align: center;
  background-color: #fafaf5;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const DownloadLogoCard = styled.div`
  background: #FFFFFF;
  border-radius: 2rem;
  padding: 2rem;
  width: 13rem;
  height: 13rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid #EEF2F6;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

export const DownloadTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  margin-bottom: 2rem;
`;

export const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 280px;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
`;

export const ProgressBarBg = styled.div`
  width: 100%;
  height: 6px;
  background-color: #EEF2F6;
  border-radius: 9999px;
  overflow: hidden;
`;

interface ProgressBarFillProps {
  progress: number;
}

export const ProgressBarFill = styled.div<ProgressBarFillProps>`
  background-color: ${colors.brand.primary};
  height: 100%;
  border-radius: 9999px;
  width: ${props => props.progress}%;
  transition: width 0.2s ease-out;
`;

export const ConnectionStatusRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #16A34A;
  font-size: 11px;
  font-weight: 800;
  margin-top: 0.5rem;
  
  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 2.5;
  }
`;

export const DetailCard = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.125rem;
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

export const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const DetailRowLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${colors.neutral[800]};
  font-weight: 900;
`;

export const DetailCodeBlock = styled.div`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  color: ${colors.neutral[900]};
  background-color: #F9FAFC;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #EEF2F6;
  word-break: break-all;
  user-select: all;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DatabaseBadge = styled.span`
  font-size: 9px;
  color: ${colors.brand.primary};
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 0.1em;
  background-color: rgba(230, 81, 0, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(230, 81, 0, 0.2);
`;

export const DetailUrlBlock = styled.div`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 10px;
  color: #16A34A;
  background-color: #F0FDF4;
  padding: 0.625rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #BBF7D0;
  word-break: break-all;
  user-select: all;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const EndpointLabel = styled.span`
  color: ${colors.neutral[800]};
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 800;
`;

export const VersionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.5rem;
  border-top: 1px solid #EEF2F6;
  font-size: 11px;
`;

export const VersionLabel = styled.span`
  color: ${colors.neutral[800]};
  font-weight: 600;
`;

export const VersionNumber = styled.span`
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-weight: 800;
  color: ${colors.neutral[900]};
`;

// Geolocation Permission Screen
export const PermissionContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  gap: 2rem;
  text-align: center;
  background-color: #fafaf5;
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const PermissionIconBox = styled.div`
  height: 5rem;
  width: 5rem;
  border-radius: 9999px;
  background-color: #E6EEFE;
  border: 1px solid #B0C6F3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052F7;
  box-shadow: 0 8px 16px rgba(0, 82, 247, 0.1);
  
  svg {
    width: 2.5rem;
    height: 2.5rem;
  }
`;

export const PermissionTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 900;
  color: ${colors.neutral[900]};
  margin: 0;
`;

export const PermissionText = styled.p`
  font-size: 0.875rem;
  color: ${colors.neutral[800]};
  line-height: 1.6;
  max-width: 280px;
  margin: 0 auto;
`;

export const PermissionButtons = styled.div`
  width: 100%;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
`;

export const AllowButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: #0052F7;
  color: #ffffff;
  font-weight: 800;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  cursor: pointer;
  border: 0;
  box-shadow: 0 4px 12px rgba(0, 82, 247, 0.2);
  transition: all 0.25s;

  &:hover {
    background: #0042C6;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 82, 247, 0.3);
  }
`;

export const DenyButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  color: ${colors.neutral[800]};
  font-weight: 800;
  border-radius: 0.875rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #F9FAFC;
    color: ${colors.neutral[900]};
  }
`;

export const StyledTrash = styled(Trash2)`
  width: 0.75rem;
  height: 0.75rem;
`;

export const StyledAlertTriangle = styled(AlertTriangle)`
  width: 2rem;
  height: 2rem;
  color: ${colors.brand.primary};
`;

export const StyledCheckCircle = styled(CheckCircle2)`
  width: 0.75rem;
  height: 0.75rem;
`;

export const StyledZap = styled(Zap)`
  width: 1rem;
  height: 1rem;
`;

export const StyledRefreshCw = styled(RefreshCw)`
  width: 0.875rem;
  height: 0.875rem;
`;

export const DownloadButtonSvg = styled.svg`
  width: 1.125rem;
  height: 1.125rem;
`;

export const PermissionSvg = styled.svg`
  width: 2rem;
  height: 2rem;
`;
