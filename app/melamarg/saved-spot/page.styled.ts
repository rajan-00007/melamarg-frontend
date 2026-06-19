'use client';

import styled from 'styled-components';
import { colors } from '@/components/style/colors';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  min-height: calc(100vh - 4.5rem);
  background-color: #F9FAFC; /* Match the app background */
`;

export const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  gap: 1.25rem;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
  width: 100%;
`;

export const Card = styled.div`
  background-color: #ffffff;
  border-radius: 1.5rem;
  padding: 1.75rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  border: 1px solid #EEF2F6;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-sizing: border-box;
  width: 100%;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-size: 13.5px;
  font-weight: 700;
  color: #475569;
`;

export const Input = styled.input`
  width: 100%;
  background-color: #F5F5F5;
  border: 1px solid #EEE0DB; /* Soft warm pink-orange border */
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14.5px;
  font-weight: 600;
  color: #1E293B;
  outline: none;
  transition: all 0.2s ease;

  &::placeholder {
    color: #94A3B8;
  }

  &:focus {
    background-color: #ffffff;
    border-color: ${colors.brand.primary};
    box-shadow: 0 0 0 3px rgba(230, 81, 0, 0.08);
  }
`;

export const CoordsRow = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
`;

export const CoordBox = styled.div`
  flex: 1;
  background-color: #EEF2F6;
  border-radius: 0.75rem;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const CoordsLabel = styled.span`
  font-size: 9px;
  font-weight: 800;
  color: #64748B;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

export const CoordValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #0F172A;
  font-family: monospace;
`;

export const SavedPhotoWrapper = styled.div`
  width: 100%;
  height: 160px;
  border-radius: 1rem;
  overflow: hidden;
  border: 1px solid #E2E8F0;
  position: relative;
  background: #F1F5F9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  gap: 1rem;
`;
