'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/components/style/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafaf6;
  width: 100%;
  height: 100%;
  overflow: hidden;
  animation: ${fadeIn} 0.35s ease-out forwards;
`;

export const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.15rem;
  padding-bottom: 7.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

/* ── Custom Header ── */
export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem;
  background-color: #fafaf6;
  border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  button {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: flex;
    color: ${colors.brand.primary};
  }
`;

export const LangBadge = styled.button`
  background-color: #dbe6fc;
  color: #1a56db;
  border: 0;
  border-radius: 20px;
  padding: 0.35rem 0.85rem;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s;

  &:active {
    opacity: 0.85;
  }
`;

/* ── Main Map / Info Card ── */
export const MapCard = styled.div`
  background: linear-gradient(135deg, #4fa3a5 0%, #2b8082 100%);
  border-radius: 1.5rem;
  padding: 1.25rem;
  position: relative;
  height: 250px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 8px 24px rgba(43, 128, 130, 0.15);
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
`;

export const StatusPill = styled.div`
  background: rgba(0, 77, 64, 0.65);
  backdrop-filter: blur(4px);
  color: #FFFFFF;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 11.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  align-self: center;
  z-index: 2;

  .dot {
    width: 6px;
    height: 6px;
    background-color: #4ade80;
    border-radius: 50%;
  }
`;

export const MapGraphicWrapper = styled.div`
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.95;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FloatingInfoBox = styled.div`
  background: #FFFFFF;
  border-radius: 1.15rem;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0.85rem;
  left: 0.85rem;
  right: 0.85rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  z-index: 2;
`;

export const InfoBoxLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-align: left;
`;

export const RoundedIconBadge = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #e65100;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

/* ── Availability Row Grid ── */
export const AvailabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  width: 100%;
`;

export const AvailabilityCard = styled.div`
  background: #FFFFFF;
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1rem;
  padding: 0.85rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.005);
  box-sizing: border-box;
`;

export const GenderIconWrapper = styled.div`
  color: #455a64;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.15rem;
  
  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

/* ── Facility Details Card ── */
export const DetailsCard = styled.div`
  background: #FFFFFF;
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.005);
  box-sizing: border-box;
`;

export const DetailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const DetailLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: ${colors.neutral[800]};

  svg {
    width: 1.15rem;
    height: 1.15rem;
    color: ${colors.brand.tertiary};
  }
`;

export const CapacityIcon = styled.div`
  width: 1.15rem;
  height: 1.15rem;
  border-radius: 50%;
  border: 2px solid ${colors.brand.tertiary};
  color: ${colors.brand.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 800;
  box-sizing: border-box;
`;

/* ── Status Row Cards (Safety & Navigation) ── */
export const InfoRowCard = styled.div<{ $bg: string; $borderColor?: string }>`
  background: ${p => p.$bg};
  border: 1px solid ${p => p.$borderColor || colors.neutral[500_2]};
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
`;

export const CircleIconBox = styled.div<{ $bg: string; $color: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

export const InfoCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

/* ── Bottom Civic Banner ── */
export const CivicBanner = styled.div`
  background-color: #fff6f0;
  border: 1px solid #fcdcc9;
  border-radius: 1.25rem;
  padding: 1.15rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  text-align: left;

  svg {
    color: ${colors.brand.primary};
    flex-shrink: 0;
    margin-top: 2px;
    width: 1.4rem;
    height: 1.4rem;
  }
`;
