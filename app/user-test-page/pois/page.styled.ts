'use client';

import styled, { keyframes } from 'styled-components';
import {
  Compass,
  Shield,
  HeartPulse,
  Search,
  Droplets,
  LogOut,
  Utensils,
  Car,
  AlertTriangle,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

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

export const PoisContainer = styled.div`
  padding: 1.25rem; /* p-5 */
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* space-y-5 */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const BrandHeader = styled.div`
  text-align: center;
  padding-top: 0.5rem; /* pt-2 */
  padding-bottom: 0.25rem; /* pb-1 */
`;

export const BrandTitle = styled.h1`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 900;
  letter-spacing: 0.05em; /* tracking-wider */
  color: #f4f4f5; /* text-zinc-100 */
  margin: 0;
`;

export const BrandSubtitle = styled.p`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.1em; /* tracking-widest */
  color: #71717a; /* text-zinc-500 */
  font-weight: 700;
  margin: 0;
`;

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #18181b; /* border-zinc-900 */
  padding-bottom: 0.75rem; /* pb-3 */
  margin-top: 1rem; /* mt-4 */
`;

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
  padding: 0;
  transition: color 0.2s;

  &:hover {
    color: #ffffff;
  }
`;

export const CategoryTitle = styled.h3`
  font-size: 0.75rem; /* text-xs */
  font-weight: 900;
  color: #fafafa; /* text-zinc-50 */
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.05em; /* tracking-wider */
  gap: 0.375rem; /* gap-1.5 */
  margin: 0;
`;

export const CountBadge = styled.span`
  font-size: 9px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  padding: 0.125rem 0.625rem; /* px-2.5 py-0.5 */
  background-color: #121217;
  border-radius: 0.25rem;
  border: 1px solid #27272a; /* border-zinc-800 */
  color: #a1a1aa; /* text-zinc-400 */
  font-weight: 700;
`;

export const ListSubtitle = styled.p`
  font-size: 10px;
  color: #71717a; /* text-zinc-500 */
  font-style: italic;
  padding-left: 0.25rem; /* px-1 */
  margin: 0;
`;

export const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem; /* space-y-3.5 */
`;

export const EmptyState = styled.div`
  padding: 2rem; /* p-8 */
  border: 1px dashed #27272a; /* border-zinc-800 */
  background-color: rgba(24, 24, 27, 0.2); /* bg-zinc-900/20 */
  border-radius: 1rem; /* rounded-2xl */
  text-align: center;
  font-size: 0.75rem; /* text-xs */
  color: #52525b; /* text-zinc-600 */
`;

export const PoiCard = styled.div`
  padding: 1rem; /* p-4 */
  border-radius: 1rem; /* rounded-2xl */
  border: 1px solid #27272a; /* border-zinc-800 */
  background-color: rgba(18, 18, 23, 0.5); /* bg-[#121217]/50 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem; /* space-x-4 */
  position: relative;
`;

export const PoiInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem; /* space-x-3.5 */
  min-width: 0;
`;

export const IndexCircle = styled.div`
  font-size: 0.875rem; /* text-sm */
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  font-weight: 900;
  color: #d97706;
  background-color: #09090b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-850 */
  height: 1.625rem; /* h-6.5 */
  width: 1.625rem; /* w-6.5 */
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PoiDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem; /* space-y-0.5 */
  min-width: 0;
`;

export const PoiTitle = styled.h4`
  font-weight: 800;
  font-size: 0.75rem; /* text-xs */
  color: #f4f4f5; /* text-zinc-100 */
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PoiStats = styled.div`
  font-size: 10px;
  color: #22d3ee; /* text-cyan-400 */
  font-weight: 700;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const DotSeparator = styled.span`
  margin: 0 0.375rem; /* mx-1.5 */
  color: #3f3f46; /* text-zinc-650 */
`;

export const WalkText = styled.span`
  color: #a1a1aa; /* text-zinc-400 */
  font-weight: 500;
`;

export const StatusText = styled.span`
  color: #34d399; /* text-emerald-400 */
  font-weight: 900;
`;

export const GoButton = styled.button`
  padding: 0.375rem 1rem; /* py-1.5 px-4 */
  border-radius: 0.75rem; /* rounded-xl */
  background-color: #09090b; /* bg-zinc-900 */
  color: #fafafa; /* text-zinc-100 */
  border: 1px solid #27272a; /* border-zinc-800 */
  font-weight: 900;
  font-size: 11px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    background-color: #121217;
    color: #ffffff;
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

export const TipBox = styled.div`
  padding: 0.75rem; /* p-3 */
  background-color: rgba(24, 24, 27, 0.5); /* bg-zinc-900/50 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 1rem; /* rounded-2xl */
  font-size: 9px;
  line-height: 1.625;
  color: #d97706;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  text-align: center;
`;

// Styled icons
export const StyledChevronLeft = styled(ChevronLeft)`
  width: 1rem;
  height: 1rem;
  color: #a1a1aa;
`;

export const StyledArrowRight = styled(ArrowRight)`
  width: 0.75rem;
  height: 0.75rem;
  margin-left: 0.25rem;
  color: #a1a1aa;
`;

export const StyledCompass = styled(Compass)`
  width: 1rem;
  height: 1rem;
  color: #22d3ee; /* text-cyan-400 */
`;

export const StyledShield = styled(Shield)`
  width: 1rem;
  height: 1rem;
  color: #818cf8; /* text-indigo-400 */
`;

export const StyledHeartPulse = styled(HeartPulse)`
  width: 1rem;
  height: 1rem;
  color: #fb7185; /* text-rose-400 */
`;

export const StyledSearch = styled(Search)`
  width: 1rem;
  height: 1rem;
  color: #fbbf24; /* text-amber-400 */
`;

export const StyledDroplets = styled(Droplets)`
  width: 1rem;
  height: 1rem;
  color: #60a5fa; /* text-blue-400 */
`;

export const StyledLogOut = styled(LogOut)`
  width: 1rem;
  height: 1rem;
  color: #34d399; /* text-emerald-400 */
`;

export const StyledUtensils = styled(Utensils)`
  width: 1rem;
  height: 1rem;
  color: #f97316; /* text-orange-400 */
`;

export const StyledCar = styled(Car)`
  width: 1rem;
  height: 1rem;
  color: #a1a1aa; /* text-zinc-400 */
`;

export const StyledAlertTriangle = styled(AlertTriangle)`
  width: 1rem;
  height: 1rem;
  color: #ef4444; /* text-rose-500 */
`;
