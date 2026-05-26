'use client';

import styled, { keyframes } from 'styled-components';
import { Info } from 'lucide-react';

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

export const HelpContainer = styled.div`
  padding: 1.25rem; /* p-5 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
  line-height: 1.625; /* leading-relaxed */
  color: #a1a1aa; /* text-zinc-400 */
  font-size: 0.75rem; /* text-xs */
  animation: ${fadeIn} 0.4s ease-out forwards;
`;

export const Header = styled.h3`
  font-size: 0.875rem; /* text-md */
  font-weight: 900;
  color: #f4f4f5; /* text-zinc-100 */
  border-bottom: 1px solid #18181b; /* border-zinc-900 */
  padding-bottom: 0.5rem; /* pb-2 */
  display: flex;
  align-items: center;
  gap: 0.375rem; /* gap-1.5 */
  margin: 0;
`;

export const HelpList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* space-y-3 */
`;

export const HelpSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem; /* space-y-1 */
`;

export const HelpTitle = styled.h4`
  font-weight: 700;
  color: #e4e4e7; /* text-zinc-200 */
  margin: 0;
`;

export const HelpText = styled.p`
  font-size: 11px;
  color: #a1a1aa; /* text-zinc-400 */
  margin: 0;
  line-height: 1.5;
`;

export const StyledInfo = styled(Info)`
  width: 1rem;
  height: 1rem;
  color: #22d3ee; /* text-cyan-400 */
`;

