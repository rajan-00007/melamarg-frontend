'use client';

import styled, { keyframes, css } from 'styled-components';
import { Bell } from 'lucide-react';

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

export const HomeContainer = styled.div`
  padding: 1.25rem; /* p-5 */
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 1.25rem; /* space-y-5 */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const EventHeaderCard = styled.div`
  background-color: #24130a; /* Dark amber/brown */
  padding: 1.25rem 1.5rem;
  margin: -1.25rem -1.25rem 0.25rem -1.25rem; /* Full bleed negative margins */
  border-bottom: 1px solid #3c1e0f;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

export const EventSub = styled.div`
  font-size: 0.75rem; /* text-xs */
  letter-spacing: 0.05em; /* tracking-wider */
  color: #f97316; /* Bright orange/amber */
  font-weight: 900;
  text-transform: uppercase;
`;

export const EventTitle = styled.h2`
  font-size: 1.625rem; /* text-2.5xl */
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.025em; /* tracking-tight */
  margin: 0;
`;

export const EventMeta = styled.div`
  font-size: 10px;
  color: #8e8e93; /* Faded grey */
  display: flex;
  align-items: center;
`;

export const StatusBox = styled.div`
  padding: 1rem 1.25rem; /* p-4 */
  border-radius: 1rem; /* rounded-2xl */
  background-color: #161622;
  border: 1px solid rgba(39, 39, 58, 0.4);
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
`;

export const StatusInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const StatusTitle = styled.div`
  font-size: 0.8rem;
  font-weight: 800;
  color: #fafafa;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #10b981;
    border-radius: 50%;
    flex-shrink: 0;
  }
`;

export const StatusText = styled.div`
  font-size: 10px;
  color: #71717a;
  padding-left: 1rem; /* align with title text after dot */
`;

export const StatusBadge = styled.div`
  background-color: #0b2416; /* Dark forest green */
  color: #34d399; /* Emerald 400 */
  border: 1px solid rgba(16, 185, 129, 0.2);
  font-size: 9px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 0.375rem 0.625rem;
  border-radius: 0.5rem;
  letter-spacing: 0.05em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1.2;

  span.checkmark {
    font-size: 11px;
    margin-top: 0.125rem;
  }
`;

// Categories Grid
export const CategoriesGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* grid-cols-3 */
  gap: 0.75rem; /* gap-3 */
  box-sizing: border-box;
`;

// Category Button Card
interface CategoryCardProps {
  $isEmergency?: boolean;
}

export const CategoryCard = styled.button<CategoryCardProps>`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  padding: 0.875rem 0.5rem;
  border-radius: 1rem; /* rounded-2xl */
  background-color: ${props => props.$isEmergency ? '#2c0f0e' : '#171725'};
  border: 1px solid ${props => props.$isEmergency ? 'rgba(239, 68, 68, 0.25)' : 'rgba(39, 39, 58, 0.6)'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;

  &:hover {
    border-color: ${props => props.$isEmergency ? '#ef4444' : '#22d3ee'};
    transform: scale(1.03);
  }

  span.emoji {
    transition: transform 0.2s;
  }

  &:hover span.emoji {
    transform: scale(1.15);
  }
`;

export const EmojiIcon = styled.span`
  font-size: 2rem;
  line-height: 1;
  display: inline-block;
  margin-bottom: 0.125rem;
`;

export const CategoryTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  width: 100%;
  min-width: 0;
  overflow: hidden;
`;

export const CategoryLabel = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: #f4f4f5; /* text-zinc-100 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CategoryCount = styled.div`
  font-size: 9px;
  color: #71717a; /* text-zinc-500 */
  font-weight: 700;
`;

// Banner Alert Box
export const BannerAlert = styled.div`
  padding: 0.875rem 1rem;
  background-color: #17150c; /* Dark amber/olive background */
  border: 1px solid rgba(234, 179, 8, 0.25);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
`;

export const BannerIndicator = styled.span`
  width: 0.375rem;
  height: 0.375rem;
  background-color: #eab308;
  border-radius: 50%;
  flex-shrink: 0;
`;

export const BannerBell = styled(Bell)`
  width: 0.875rem;
  height: 0.875rem;
  color: #eab308;
  flex-shrink: 0;
`;

export const BannerText = styled.p`
  font-size: 10px;
  color: #fbbf24; /* text-amber-400 */
  font-weight: 700;
  line-height: 1.5;
  margin: 0;
`;
