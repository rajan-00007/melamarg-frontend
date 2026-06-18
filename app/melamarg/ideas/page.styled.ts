'use client';

import styled from 'styled-components';

export const IdeasContainer = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 4.5rem);
`;

export const IdeasHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  margin-top: 0.5rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  background-color: #ffffff;
  border: none;
  border-radius: 1rem;
  color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 900;
  color: #111827;
  margin: 0;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

export const HeaderSubtitle = styled.span`
  font-size: 9px;
  font-weight: 900;
  color: #f97316;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const FeedbackCard = styled.div`
  background-color: #ffffff;
  border-radius: 2.25rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  width: 100%;
`;

export const CardQuestion = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #111827;
  margin: 0;
  line-height: 1.25;
  letter-spacing: -0.01em;
`;

export const HeartsRowContainer = styled.div`
  background-color: #f9fafb;
  border-radius: 1.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  box-sizing: border-box;
`;

export const HeartButton = styled.button<{ $active: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.15s ease;
  color: ${props => props.$active ? '#ef4444' : '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 2rem;
    height: 2rem;
    transition: fill 0.15s ease, color 0.15s ease;
  }

  &:hover {
    transform: scale(1.15);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SectionLabel = styled.label`
  font-size: 8px;
  font-weight: 900;
  color: #9ca3af;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: -0.75rem;
`;

export const ThoughtsTextArea = styled.textarea`
  width: 100%;
  min-height: 8rem;
  background-color: #f9fafb;
  border: 1px solid transparent;
  border-radius: 1.5rem;
  padding: 1.25rem;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  outline: none;
  resize: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
    font-weight: 600;
  }

  &:focus {
    background-color: #ffffff;
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  }
`;

export const SubmitButton = styled.button`
  background-color: #1c1917; /* Dark coal black like the screenshot */
  color: #ffffff;
  border: none;
  border-radius: 1.5rem;
  padding: 1rem;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 12px rgba(28, 25, 23, 0.15);
  transition: all 0.2s ease;

  svg {
    width: 0.95rem;
    height: 0.95rem;
    stroke-width: 3;
  }

  &:hover {
    background-color: #292524;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(28, 25, 23, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;
