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
  background-color: #dc2626;
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

/* ── Content Subtitles ── */
export const SubtitleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  text-align: left;
`;

export const SubtitleItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${p => p.$color || colors.neutral[700]};

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }
`;

/* ── Services Grid ── */
export const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
`;

export const ServiceCard = styled.div`
  background: #FFFFFF;
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1rem;
  padding: 1.15rem 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.005);
  box-sizing: border-box;
`;

export const ServiceIconBox = styled.div<{ $bg: string; $color: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  background-color: ${p => p.$bg};
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.35rem;
    height: 1.35rem;
  }
`;

export const StretcherRowCard = styled.div`
  background: #FFFFFF;
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.005);
  box-sizing: border-box;
  text-align: left;
`;

export const StretcherIconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: #00695c;
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

export const StretcherTextCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

/* ── Facility Info Card ── */
export const InfoCard = styled.div`
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

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const InfoLabelGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: ${colors.neutral[800]};

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: ${colors.brand.secondary};
  }
`;

/* ── Location Notes Card ── */
export const NotesCard = styled.div`
  background-color: #f1f3f2;
  border: 1px solid ${colors.neutral[500]};
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
`;

export const NotesHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: ${colors.neutral[900]};

  svg {
    width: 1.35rem;
    height: 1.35rem;
    color: ${colors.brand.primary};
  }
`;

export const NotesMapBox = styled.div`
  width: 100%;
  height: 130px;
  background-color: #e2e5e4;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.85;
  }
`;

/* ── Red Emergency Footer Banner ── */
export const EmergencyBanner = styled.div`
  background-color: #fff2f2;
  border: 1px solid #fee2e2;
  border-radius: 1.25rem;
  padding: 1.15rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  text-align: left;

  svg {
    color: #ef4444;
    flex-shrink: 0;
    margin-top: 2px;
    width: 1.4rem;
    height: 1.4rem;
  }
`;
