'use client';

import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const ping = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

export const MapWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  min-height: 500px;
`;

export const MapCanvas = styled.div`
  flex-grow: 1;
  width: 100%;
  position: relative;
  z-index: 10;
  height: 100%;
`;

export const GlowStatusOverlay = styled.div`
  position: absolute;
  top: 1rem; /* top-4 */
  left: 1rem; /* left-4 */
  z-index: 20;
`;

export const ControlsOverlay = styled.div`
  position: absolute;
  top: 1rem; /* top-4 */
  right: 1rem; /* right-4 */
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* gap-2 */
`;

export const RecenterButton = styled.button`
  padding: 0.625rem; /* p-2.5 */
  background-color: #18181b; /* bg-zinc-900 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  color: #d4d4d8; /* text-zinc-300 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    color: #ffffff;
    border-color: #3f3f46;
  }
`;

export const CoordinatesDisplay = styled.div`
  position: absolute;
  bottom: 1rem; /* bottom-4 */
  left: 1rem;
  right: 1rem; /* left-4 right-4 */
  z-index: 20;
  padding: 0.625rem; /* p-2.5 */
  background-color: rgba(9, 9, 11, 0.9); /* bg-zinc-950/90 */
  border: 1px solid #27272a; /* border-zinc-800 */
  border-radius: 0.75rem; /* rounded-xl */
  font-size: 9px;
  color: #22d3ee; /* text-cyan-400 */
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; /* font-mono */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem; /* gap-1.5 */
  backdrop-filter: blur(8px); /* backdrop-blur-md */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

// GPS Status Pills
export const GPSLockedPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(16, 185, 129, 0.1); /* bg-emerald-500/10 */
  border: 1px solid rgba(16, 185, 129, 0.3); /* border-emerald-500/30 */
  color: #34d399; /* text-emerald-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #10b981;
    animation: ${ping} 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`;

export const GPSSearchingPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(245, 158, 11, 0.1); /* bg-amber-500/10 */
  border: 1px solid rgba(245, 158, 11, 0.3); /* border-amber-500/30 */
  color: #fbbf24; /* text-amber-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #fbbf24;
    animation: ${pulse} 1.5s infinite;
  }
`;

export const GPSLostPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem; /* gap-1 */
  padding: 0.25rem 0.625rem; /* py-1 px-2.5 */
  border-radius: 9999px;
  background-color: rgba(239, 68, 68, 0.1); /* bg-rose-500/10 */
  border: 1px solid rgba(239, 68, 68, 0.3); /* border-rose-500/30 */
  color: #f43f5e; /* text-rose-400 */
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px); /* backdrop-blur-md */

  span.dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;
    background-color: #ef4444;
    animation: ${pulse} 1.5s infinite;
  }
`;
