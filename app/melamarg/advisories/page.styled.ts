'use client';

import styled from 'styled-components';

export const AdvisoriesContainer = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 4.5rem);
  background-color: #f3f4f6; /* Matching RootContainer background */
  color: #1f2937;
`;

export const AdvisoriesHeader = styled.header`
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
  background-color: #ffffff; /* White background matching Alerts page */
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateX(-2px);
    background-color: #f9fafb;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  }

  &:active {
    transform: translateX(0);
  }
`;

export const HeaderTitles = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
`;

export const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 950; /* Match Alerts Title bold weight */
  color: #111827; /* Dark text */
  margin: 0;
  letter-spacing: -0.01em;
`;

export const HeaderSubtitle = styled.span`
  font-size: 9px;
  font-weight: 900;
  color: #ea580c; /* Warning orange color accent matching Alert Type Badge */
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const AdvisoryCard = styled.div`
  background: #ffffff; /* Light background card */
  border: 1px solid #e5e7eb;
  border-radius: 1.75rem;
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.015);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-sizing: border-box;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(234, 88, 12, 0.3);
    box-shadow: 0 12px 36px rgba(234, 88, 12, 0.05);
  }
`;

export const AdvisoryHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

export const AdvisoryTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const AdvisoryTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 800;
  color: #111827; /* Dark text */
  margin: 0;
  line-height: 1.3;
`;

export const AdvisoryBadge = styled.span`
  font-size: 8px;
  font-weight: 900;
  color: #ea580c;
  background-color: #fff7ed;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid #ffedd5;
`;

export const AdvisoryMessage = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #4b5563; /* Light gray text for readable description */
  margin: 0;
  line-height: 1.5;
`;

export const MapWrapperContainer = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 1.25rem;
  overflow: hidden;
  position: relative;
  border: 1px solid #e5e7eb;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  background-color: #f9fafb;

  .leaflet-container {
    width: 100%;
    height: 100%;
    background-color: #f3f4f6 !important;
  }
`;

export const NavigateButton = styled.button`
  background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%); /* Orange gradient */
  color: #ffffff;
  border: none;
  border-radius: 1.25rem;
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
  box-shadow: 0 4px 14px rgba(234, 88, 12, 0.35);
  transition: all 0.2s ease;

  svg {
    width: 1rem;
    height: 1rem;
    stroke-width: 2.5;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const NoAdvisoriesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 1.5rem;
  background: #ffffff;
  border: 1px dashed #e5e7eb;
  border-radius: 1.75rem;
  text-align: center;
`;

export const NoAdvisoriesIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #ecfdf5;
  color: #10b981;
  border: 1px solid #a7f3d0;
`;

export const NoAdvisoriesText = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
`;
