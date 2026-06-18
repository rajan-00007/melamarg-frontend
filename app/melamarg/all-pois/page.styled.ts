'use client';

import styled, { keyframes } from 'styled-components';
import { colors } from '@/components/style/colors';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* ── Page Shell ── */
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fafaf5;
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
  gap: 1.5rem;
`;

/* ── Search Bar ── */
export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 12px;
  padding: 0.7rem 1rem;
  color: ${colors.neutral[700]};

  svg { width: 1rem; height: 1rem; flex-shrink: 0; }
`;

export const SearchInput = styled.input`
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-family: inherit;
  font-size: 14px;
  color: ${colors.neutral[900]};
  width: 100%;

  &::placeholder {
    color: ${colors.neutral[700]};
    opacity: 0.8;
  }
`;

/* ── Page Title Row ── */
export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  button {
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
    display: flex;
    color: ${colors.neutral[900]};
  }
`;

/* ── Section Label ── */
export const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding-left: 0.1rem;
  margin-bottom: -0.35rem;

  svg { width: 1rem; height: 1rem; }
`;

/* ── 2×2 Grid Cards (Essential Services / Spiritual) ── */
export const Grid2x2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
`;

export const GridCard = styled.button<{ $accent?: string }>`
  background: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.25rem;
  padding: 1.15rem 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  cursor: pointer;
  transition: transform 0.15s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);

  &:active { transform: scale(0.96); }
`;

export const GridIconCircle = styled.div<{ $bg?: string; $color?: string }>`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: ${p => p.$bg || '#EEF2F6'};
  color: ${p => p.$color || colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;

  svg { width: 1.2rem; height: 1.2rem; }
`;

/* ── Spiritual & Cultural Custom Layout ── */
export const SpiritualGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 110px 110px;
  gap: 0.85rem;
`;

export const TallImageCard = styled.button`
  position: relative;
  background: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.25rem;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 1.15rem 1rem;
  transition: transform 0.15s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  text-align: left;
  width: 100%;
  height: 100%;

  &:active { transform: scale(0.96); }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const ImageCardOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0) 70%);
`;

export const SpiritualCard = styled.button<{ $bg: string; $color: string }>`
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.25rem;
  padding: 1.15rem 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  width: 100%;
  height: 100%;

  &:active { transform: scale(0.96); }
`;

export const SpiritualIconWrapper = styled.div<{ $color: string }>`
  color: ${p => p.$color};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 2.1rem;
    height: 2.1rem;
  }
`;

/* ── List Row Card (Facilities) ── */
export const ListCard = styled.button`
  background: ${colors.base.white};
  border: 1px solid ${colors.neutral[500_2]};
  border-radius: 1.15rem;
  padding: 0.85rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  cursor: pointer;
  transition: transform 0.15s;
  box-shadow: 0 4px 10px rgba(0,0,0,0.008);
  text-align: left;

  &:active { transform: scale(0.98); }
`;

export const ListIconBox = styled.div<{ $bg?: string; $color?: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: ${p => p.$bg || '#EEF2F6'};
  color: ${p => p.$color || colors.neutral[800]};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg { width: 1.1rem; height: 1.1rem; }
`;

export const ListTextCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

export const ChevronRight = styled.div`
  color: ${colors.neutral[700]};
  flex-shrink: 0;
  svg { width: 1rem; height: 1rem; }
`;

/* ── Footer Sync Bar ── */
export const SyncBar = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: #f0fdf4;
  border: 1px solid rgba(22,163,74,0.12);
  border-radius: 1rem;
  padding: 0.85rem 1rem;

  svg { width: 1.1rem; height: 1.1rem; color: #16a34a; flex-shrink: 0; margin-top: 2px; }
`;

export const NoResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
  gap: 0.75rem;
  color: ${colors.neutral[700]};
  
  svg {
    width: 2.5rem;
    height: 2.5rem;
    color: ${colors.neutral[500]};
    opacity: 0.6;
  }
`;
