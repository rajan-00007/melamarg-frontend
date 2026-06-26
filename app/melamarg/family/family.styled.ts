'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/components/style/colors';

// Animations
export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const pulseGlow = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(230, 81, 0, 0.4);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgba(230, 81, 0, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(230, 81, 0, 0);
  }
`;

// Layout Wrappers
export const FamilyContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: ${colors.neutral[100]};
  min-height: 100vh;
  padding: 1rem;
  padding-bottom: 5.5rem; /* Space for bottom nav */
  animation: ${fadeIn} 0.3s ease-out;
  font-family: 'Inter', system-ui, sans-serif;
`;

export const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
`;

// Premium Headers
export const ScreenHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  position: relative;
`;

export const BackButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  margin-bottom: 0.5rem;
  color: ${colors.neutral[800]};
`;

// Landing Style Elements (Dashboard default)
export const IntroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin: 0.5rem 0 1rem 0;
  border: 1px solid ${colors.neutral[500]};
  aspect-ratio: 1.2;
  background-color: ${colors.brand.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const OptionCard = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid ${colors.neutral[500]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.brand.primary};
  }
`;

export const IconCircle = styled.div<{ $bgColor?: string; $color?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ $bgColor }) => $bgColor || colors.neutral[500]};
  color: ${({ $color }) => $color || colors.brand.primary};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const InfoCard = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid ${colors.neutral[500]};
`;

// Active Group Dashboard Styles
export const GroupHeaderCard = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid ${colors.neutral[500]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ActiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  background-color: ${colors.green[100]};
  color: ${colors.green[300]};
`;

export const BadgeDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${colors.green[200]};
`;

export const MembersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const MemberListItem = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid ${colors.neutral[500]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
`;

export const MemberAvatar = styled.div<{ $isMe?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ $isMe }) => $isMe ? colors.neutral[500] : colors.blue[200]};
  color: ${({ $isMe }) => $isMe ? colors.brand.primary : colors.reco[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 1.5px solid ${colors.base.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
`;

export const StatusIndicatorDot = styled.span<{ $online?: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $online }) => $online ? colors.green[200] : colors.neutral[700_2]};
  border: 2px solid ${colors.base.white};
  position: absolute;
  bottom: 0;
  right: 0;
`;

export const MemberInfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const PulseButton = styled.button`
  background-color: ${colors.yellow[100]};
  border: 1px solid ${colors.yellow[200]};
  color: ${colors.yellow[300]};
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${colors.yellow[200]};
    color: ${colors.base.white};
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const PulseIconIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${colors.brand.primary};
  animation: ${pulseGlow} 1.5s infinite;
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.25rem;
`;

// Assembly Point Block
export const AssemblyCard = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid ${colors.neutral[500]};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const AssemblyRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const ArrivalStatusContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: ${colors.neutral[500_2]};
  border: 1px solid ${colors.neutral[500]};
`;

// Group Details & Sharing Panel (for QR codes/sharing PIN)
export const SharePanel = styled.div`
  background-color: ${colors.base.white};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid ${colors.neutral[500]};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  animation: ${fadeIn} 0.25s ease-out;
`;

// POI Select Modal Bottom Sheet Drawer
export const PoiSelectDrawer = styled.div`
  background-color: ${colors.base.white};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.25s ease-out;
`;

export const CodeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${colors.neutral[100]};
  border-radius: 8px;
  border: 1px dashed ${colors.neutral[700_2]};
`;

export const QrCodeWrapper = styled.div`
  padding: 0.5rem;
  background-color: ${colors.base.white};
  border: 1px solid ${colors.neutral[500]};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

// Forms and Inputs
export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

export const StyledInput = styled.input`
  height: 44px;
  border-radius: 8px;
  border: 1px solid ${colors.neutral[500]};
  padding: 0 1rem;
  font-size: 15px;
  font-family: inherit;
  color: ${colors.neutral[900]};
  background-color: ${colors.base.white};
  outline: none;
  transition: border-color 0.15s ease-in-out;

  &:focus {
    border-color: ${colors.brand.primary};
  }

  &::placeholder {
    color: ${colors.neutral[700]};
    opacity: 0.8;
  }
`;

export const PinInputsRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.5rem 0;
`;

export const PinDigitBox = styled.input`
  width: 48px;
  height: 52px;
  border-radius: 8px;
  border: 1.5px solid ${colors.neutral[500]};
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: ${colors.brand.primary};
  outline: none;
  background-color: ${colors.base.white};
  transition: all 0.15s ease-in-out;

  &:focus {
    border-color: ${colors.brand.primary};
    box-shadow: 0 0 0 2px rgba(230, 81, 0, 0.1);
  }
`;

// Tutorial Styles (How Groups Work)
export const TutorialStepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 0.5rem 0;
`;

export const TutorialStepItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

export const StepNumber = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${colors.brand.primary};
  color: ${colors.base.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 0.125rem;
`;

export const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;
