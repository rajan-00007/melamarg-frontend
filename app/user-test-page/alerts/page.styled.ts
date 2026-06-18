'use client';

import styled, { keyframes } from 'styled-components';

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

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

export const AlertsContainer = styled.div`
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex-grow: 1;
  overflow-y: auto;
  animation: ${fadeIn} 0.4s ease-out forwards;
  box-sizing: border-box;
  width: 100%;
`;

// Header Styles
export const AlertPageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.25rem;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #ffffff;
  border: 1px solid rgba(229, 231, 235, 0.5);
  border-radius: 1rem;
  color: #1f2937;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.02);
  transition: all 0.2s;
  outline: none;
  
  &:hover {
    background-color: #f9fafb;
    transform: translateX(-2px);
  }
  
  &:active {
    transform: translateX(0);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 2.5;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 1rem;
`;

export const TitleText = styled.h2`
  font-size: 1.25rem;
  font-weight: 950;
  color: #111827;
  margin: 0;
  letter-spacing: -0.01em;
  line-height: 1.1;
`;

export const SubtitleText = styled.span`
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #4f46e5;
  margin-top: 0.125rem;
`;

export const EmergencyLiveBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 9999px;
  color: #ef4444;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;

  span.dot {
    width: 6px;
    height: 6px;
    background-color: #ef4444;
    border-radius: 50%;
    animation: ${pulse} 1.5s infinite;
  }
`;

// Feed Wrapper
export const AlertsFeed = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

// Alert Card base
interface CardProps {
  $type: 'CRITICAL' | 'WARNING' | 'INFO';
}

export const AlertCard = styled.div<CardProps>`
  padding: 1.25rem;
  border-radius: 1.75rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.015);
  box-sizing: border-box;
  width: 100%;
  transition: transform 0.2s ease;
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return `
        background-color: #fef2f2;
        border: 1px solid #fee2e2;
      `;
    } else if (props.$type === 'WARNING') {
      return `
        background-color: #fffbeb;
        border: 1px solid #fef3c7;
      `;
    } else {
      return `
        background-color: #ffffff;
        border: 1px solid #e5e7eb;
      `;
    }
  }}
`;

export const CardHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.875rem;
`;

export const TypeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
`;

interface IconBoxProps {
  $type: 'CRITICAL' | 'WARNING' | 'INFO';
}

export const IconBox = styled.div<IconBoxProps>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  
  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return 'background-color: #ef4444;';
    } else if (props.$type === 'WARNING') {
      return 'background-color: #f59e0b;';
    } else {
      return 'background-color: #4f46e5;';
    }
  }}
`;

export const TypeLabel = styled.span<CardProps>`
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return 'color: #991b1b;';
    } else if (props.$type === 'WARNING') {
      return 'color: #92400e;';
    } else {
      return 'color: #312e81;';
    }
  }}
`;

export const TimeAgo = styled.span`
  font-size: 8px;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
`;

export const AlertTitle = styled.h3<CardProps>`
  font-size: 1.2rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.25;
  letter-spacing: -0.01em;
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return 'color: #991b1b;';
    } else if (props.$type === 'WARNING') {
      return 'color: #78350f;';
    } else {
      return 'color: #1e293b;';
    }
  }}
`;

export const AlertText = styled.p<CardProps>`
  font-size: 11.5px;
  line-height: 1.5;
  margin: 0;
  margin-top: 0.5rem;
  font-weight: 600;
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return 'color: #b91c1c;';
    } else if (props.$type === 'WARNING') {
      return 'color: #b45309;';
    } else {
      return 'color: #6b7280;';
    }
  }}
`;

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 1rem;
`;

interface NavigateButtonProps {
  $type: 'CRITICAL' | 'WARNING' | 'INFO';
}

export const NavigateButton = styled.button<NavigateButtonProps>`
  color: #ffffff;
  width: 100%;
  border-radius: 1rem;
  padding: 0.875rem;
  border: 0;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top:8px;
  
  ${props => {
    if (props.$type === 'CRITICAL') {
      return `
        background-color: #ef4444;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        &:hover {
          background-color: #dc2626;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
        }
      `;
    } else if (props.$type === 'WARNING') {
      return `
        background-color: #ca8a04; /* Mud Yellow (Yellow-600) */
        box-shadow: 0 4px 12px rgba(202, 138, 4, 0.25);
        &:hover {
          background-color: #a16207;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(202, 138, 4, 0.35);
        }
      `;
    } else {
      return `
        background-color: #3b2eb6; /* Indigo Blue */
        box-shadow: 0 4px 12px rgba(59, 46, 182, 0.2);
        &:hover {
          background-color: #2c2196;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(59, 46, 182, 0.3);
        }
      `;
    }
  }}
  
  &:active {
    transform: translateY(0);
  }
`;

export const DismissTextLink = styled.button`
  background: transparent;
  border: 0;
  color: #9ca3af;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.2s;
  outline: none;
  
  &:hover {
    color: #4b5563;
  }
`;

// Empty State Styles
export const EmptyFeed = styled.div`
  padding: 4rem 1.5rem;
  background-color: #ffffff;
  border: 1px dashed #e5e7eb;
  border-radius: 1.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #9ca3af;
  box-sizing: border-box;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.01);
`;

export const EmptyTitle = styled.p`
  font-size: 12px;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
`;

export const EmptySubtitle = styled.p`
  font-size: 10px;
  color: #9ca3af;
  margin: 0;
  line-height: 1.4;
`;

// Emergency Assistance Card & Grid
export const EmergencyCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.015);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const EmergencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.25rem;
`;

export const EmergencyButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 0.5rem 0.25rem;
  transition: transform 0.1s;
  outline: none;

  &:active {
    transform: scale(0.95);
  }
`;

export const EmergencyIconBox = styled.div`
  background-color: #ffdad6; /* Light red error container */
  color: #ba1a1a; /* Dark red error text */
  width: 3.25rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(186, 26, 26, 0.08);
  transition: all 0.2s;

  svg {
    width: 1.4rem;
    height: 1.4rem;
    stroke-width: 2.25;
  }

  &:hover {
    background-color: #ba1a1a;
    color: #FFFFFF;
    box-shadow: 0 6px 14px rgba(186, 26, 26, 0.2);
  }
`;

// Location Card / Coordinates display
export const LocationCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.015);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CoordsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
`;

export const CoordBlock = styled.div`
  flex: 1;
  background-color: #F9FAFC;
  border: 1px solid #EEF2F6;
  border-radius: 1rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CoordLabel = styled.span`
  font-size: 8px;
  font-weight: 850;
  color: #64748B;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CoordValue = styled.span`
  font-family: monospace;
  font-size: 13.5px;
  font-weight: 700;
  color: #0F172A;
  letter-spacing: -0.01em;
`;

export const ShareButton = styled.button`
  background-color: #2F312E; /* Dark charcoal color from mockup */
  color: #FFFFFF;
  border: 0;
  border-radius: 1.25rem;
  padding: 1rem;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  font-weight: 700;
  font-size: 13px;
  box-shadow: 0 4px 12px rgba(47, 49, 46, 0.15);
  transition: all 0.2s;
  outline: none;

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 2.25;
  }
`;

// Nearest Help Booth Card
export const BoothCard = styled.div`
  position: relative;
  background: linear-gradient(135deg, #E65100 0%, #a43700 100%);
  color: #FFFFFF;
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(230, 81, 0, 0.12);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: hidden;
`;

export const BoothOverlayImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCLFEUr4cVmwd9qI2ZIk1Nsf8U8vH8vtqgCQiiavAje0Y1Li5T9S1YfwpZkpy1a1QNvsWeioxxz5byOkf_PhCP3ddiBhg6QS2BtNLvJ8IGN8aMWj8iF8HsLcyng4g7TFnNxcDF4Bi4QpPJhWB_rBJsT2Ist_PJbLMR96rDszHmmDq6sSEBO_btK4o4r1Pzj3OMRGozMf3keKHQ0LzGOVOGWONGQFdoyqIOynT919f-9UZA6lv_qaqgz08Ld_yp4TxvY8M2Yur0Hvh-Y');
  background-size: cover;
  background-position: center;
  opacity: 0.12;
  z-index: 1;
`;

export const BoothCardContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const BoothHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const BoothBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;

  span.dot {
    width: 5px;
    height: 5px;
    background-color: #FFFFFF;
    border-radius: 50%;
    animation: ${pulse} 1.5s infinite;
  }
  
  span.text {
    font-size: 8.5px;
    font-weight: 850;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const BoothActionBtn = styled.button`
  background-color: #FFFFFF;
  color: #E65100;
  border: 0;
  border-radius: 1.25rem;
  padding: 0.875rem 1.25rem;
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
  outline: none;

  &:active {
    transform: scale(0.98);
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
    stroke-width: 2.5;
  }
`;

// Helplines Directory List
export const HelplinesCard = styled.div`
  background-color: #FFFFFF;
  border: 1px solid #EEF2F6;
  border-radius: 1.75rem;
  padding: 1.25rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.015);
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

export const HelplinesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const HelplineItem = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background-color: #F9FAFC;
  border: 1px solid #EEF2F6;
  border-radius: 1.125rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:active {
    background-color: #EEF2F6;
    transform: scale(0.99);
  }
`;

export const HelplineLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const HelplineIconBox = styled.div`
  color: #ba1a1a; /* priority red icon */
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 1.2rem;
    height: 1.2rem;
    stroke-width: 2.25;
  }
`;

export const HelplineNumberPill = styled.div`
  background-color: rgba(186, 26, 26, 0.08);
  color: #ba1a1a;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-family: monospace;
  font-size: 11.5px;
  font-weight: 750;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;
