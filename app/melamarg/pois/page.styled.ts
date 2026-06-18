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
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  animation: ${fadeIn} 0.4s ease-out forwards;
  box-sizing: border-box;
  width: 100%;
`;

export const BrandHeader = styled.div`
  text-align: center;
  padding-top: 0.5rem;
  padding-bottom: 0.25rem;
`;

export const BrandTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 950;
  letter-spacing: 0.05em;
  color: #1f2937;
  margin: 0;
  text-transform: uppercase;
`;

export const BrandSubtitle = styled.p`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  font-weight: 700;
  margin: 0;
  margin-top: 0.125rem;
`;

export const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.875rem;
  margin-top: 0.5rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.45rem 0.75rem;
  background-color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  color: #1f2937;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f9fafb;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CategoryTitle = styled.h3`
  font-size: 13px;
  font-weight: 850;
  color: #1f2937;
  display: flex;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  gap: 0.375rem;
  margin: 0;
`;

export const CountBadge = styled.span`
  font-size: 10px;
  padding: 0.25rem 0.75rem;
  background-color: #eff6ff;
  border-radius: 9999px;
  border: 1px solid rgba(191, 219, 254, 0.4);
  color: #3b2eb6;
  font-weight: 800;
  letter-spacing: -0.01em;
`;

export const ListSubtitle = styled.p`
  font-size: 10px;
  color: #6b7280;
  font-style: italic;
  padding-left: 0.25rem;
  margin: 0;
  margin-top: -0.25rem;
`;

export const CardsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`;

export const EmptyState = styled.div`
  padding: 2.5rem 2rem;
  border: 1px dashed #d1d5db;
  background-color: #ffffff;
  border-radius: 1.5rem;
  text-align: center;
  font-size: 11px;
  color: #6b7280;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
`;

export const PoiCard = styled.div`
  padding: 1rem 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.02);
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.03);
  }
`;

export const PoiInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
`;

export const IndexCircle = styled.div`
  font-size: 11px;
  font-weight: 900;
  color: #3b2eb6;
  background-color: #eff6ff;
  border: none;
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const PoiDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
`;

export const PoiTitle = styled.h4`
  font-weight: 850;
  font-size: 13px;
  color: #1f2937;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PoiStats = styled.div`
  font-size: 10px;
  color: #3b2eb6;
  font-weight: 800;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

export const DotSeparator = styled.span`
  margin: 0 0.375rem;
  color: #d1d5db;
`;

export const WalkText = styled.span`
  color: #6b7280;
  font-weight: 600;
`;

export const StatusText = styled.span`
  color: #10b981;
  font-weight: 900;
`;

export const GoButton = styled.button`
  padding: 0.5rem 1.15rem;
  border-radius: 9999px;
  background-color: #1c1917; /* Dark black like Ideas */
  color: #ffffff;
  border: none;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(28, 25, 23, 0.15);

  &:hover {
    background-color: #292524;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    transition: transform 0.2s;
  }

  &:hover svg {
    transform: translateX(2px);
  }
`;

export const TipBox = styled.div`
  padding: 0.875rem 1rem;
  background-color: #fffbeb;
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 1.25rem;
  font-size: 10px;
  line-height: 1.5;
  color: #b45309;
  font-weight: 750;
  text-align: center;
`;

// Styled icons
export const StyledChevronLeft = styled(ChevronLeft)`
  width: 0.9rem;
  height: 0.9rem;
  color: #1f2937;
  stroke-width: 3;
`;

export const StyledArrowRight = styled(ArrowRight)`
  width: 0.8rem;
  height: 0.8rem;
  color: #ffffff;
  stroke-width: 3;
`;

export const StyledCompass = styled(Compass)`
  width: 1.15rem;
  height: 1.15rem;
  color: #3b2eb6;
  stroke-width: 2.5;
`;

export const StyledShield = styled(Shield)`
  width: 1.15rem;
  height: 1.15rem;
  color: #3b2eb6;
  stroke-width: 2.5;
`;

export const StyledHeartPulse = styled(HeartPulse)`
  width: 1.15rem;
  height: 1.15rem;
  color: #de2c2c;
  stroke-width: 2.5;
`;

export const StyledSearch = styled(Search)`
  width: 1.15rem;
  height: 1.15rem;
  color: #ca8a04;
  stroke-width: 2.5;
`;

export const StyledDroplets = styled(Droplets)`
  width: 1.15rem;
  height: 1.15rem;
  color: #2563eb;
  stroke-width: 2.5;
`;

export const StyledLogOut = styled(LogOut)`
  width: 1.15rem;
  height: 1.15rem;
  color: #10b981;
  stroke-width: 2.5;
`;

export const StyledUtensils = styled(Utensils)`
  width: 1.15rem;
  height: 1.15rem;
  color: #f97316;
  stroke-width: 2.5;
`;

export const StyledCar = styled(Car)`
  width: 1.15rem;
  height: 1.15rem;
  color: #6b7280;
  stroke-width: 2.5;
`;

export const StyledAlertTriangle = styled(AlertTriangle)`
  width: 1.15rem;
  height: 1.15rem;
  color: #de2c2c;
  stroke-width: 2.5;
`;
