'use client';

import styled from 'styled-components';
import { colors } from '@/components/style/colors';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 2.5rem 1.5rem;
  background-color: #F9FAFC; /* Neutral 100 light backdrop */
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  position: relative;
`;

export const OnboardingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 360px;
  margin-bottom: 0.5rem;
`;

export const IndicatorDots = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 1rem 0;
`;

export const ActiveIndicatorBar = styled.div`
  width: 1.75rem;
  height: 6px;
  border-radius: 9999px;
  background-color: #E65100; /* Brand Primary */
`;

export const InactiveDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #DBE6FC; /* Neutral 600 */
`;

export const IllustrationCard = styled.div`
  background: linear-gradient(135deg, #FF9E40 0%, #E65100 100%);
  border-radius: 2rem;
  width: 100%;
  max-width: 320px;
  height: 18rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 35px rgba(230, 81, 0, 0.15);
  overflow: hidden;
  padding: 1.5rem;
  box-sizing: border-box;
  margin-bottom: 1.5rem;
`;

export const TextContentGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  max-width: 320px;
  margin-bottom: 2rem;
`;

export const LangGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
  max-width: 320px;
  margin-bottom: 2.5rem;
`;

export const LangOptionCard = styled.button<{ $isActive: boolean }>`
  padding: 1rem 0.5rem;
  border-radius: 1rem;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  outline: none;
  
  ${props => props.$isActive ? `
    border: 2px solid #E65100; /* Brand Primary */
    background-color: #FCF2E7; /* Yellow 100 / soft orange */
    color: #E65100;
    box-shadow: 0 8px 20px rgba(230, 81, 0, 0.08);
  ` : `
    border: 1px solid #E5EAF0; /* Neutral 500 border */
    background-color: #FFFFFF;
    color: #475569; /* Neutral 800 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
    &:hover {
      background-color: #F9FAFC;
    }
  `}
`;

export const ContinueButtonWrapper = styled.div`
  width: 100%;
  max-width: 320px;
`;

export const CustomContinueButton = styled.button`
  width: 100%;
  height: 3.25rem;
  background-color: #E65100; /* Brand Primary Orange */
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  border-radius: 9999px;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 10px 25px rgba(230, 81, 0, 0.25);

  &:hover {
    background-color: #BF4300;
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(230, 81, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.1rem;
    height: 1.1rem;
    stroke-width: 2.5;
  }
`;
