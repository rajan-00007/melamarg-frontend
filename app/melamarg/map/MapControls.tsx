'use client';

import React from 'react';
import { Navigation, Compass, Map as MapIcon, Users } from 'lucide-react';
import {
  FloatingLocateButton,
  RadarToggleBtn
} from './page.styled';

interface MapControlsProps {
  mapViewType: 'normal' | 'radar';
  setMapViewType: React.Dispatch<React.SetStateAction<'normal' | 'radar'>>;
  isFamilyMode: boolean;
  showEventPois: boolean;
  setShowEventPois: React.Dispatch<React.SetStateAction<boolean>>;
  showFamilyMembers: boolean;
  setShowFamilyMembers: React.Dispatch<React.SetStateAction<boolean>>;
  currentGroup: any;
  getRealGps: () => Promise<[number, number] | null>;
  setUserGps: any;
  userGps: [number, number] | null;
  mapRef: React.RefObject<any>;
}

export default function MapControls({
  mapViewType,
  setMapViewType,
  isFamilyMode,
  showEventPois,
  setShowEventPois,
  showFamilyMembers,
  setShowFamilyMembers,
  currentGroup,
  getRealGps,
  setUserGps,
  userGps,
  mapRef
}: MapControlsProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: 'calc(30vh + 5.25rem)',
      right: '1rem',
      zIndex: 999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      pointerEvents: 'auto'
    }}>
      {/* Recenter Button */}
      <FloatingLocateButton
        style={{ margin: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        onClick={async (e) => {
          e.stopPropagation();
          try {
            const DeviceOrientationEventAny = (window as any).DeviceOrientationEvent;
            if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
              await DeviceOrientationEventAny.requestPermission();
            }
          } catch (err) {
            console.warn('Failed compass permission request:', err);
          }

          const pos = await getRealGps();
          if (pos) {
            setUserGps(pos);
            if (mapRef.current) mapRef.current.setView(pos, 18);
          } else if (mapRef.current && userGps) {
            mapRef.current.setView(userGps, 18);
          }
        }}
        title="Recenter on my location"
      >
        <Navigation style={{ width: '1.2rem', height: '1.2rem', transform: 'rotate(45deg)' }} />
      </FloatingLocateButton>

      {/* Radar / Proximity Toggle Button */}
      <RadarToggleBtn
        $active={mapViewType === 'radar'}
        onClick={(e) => {
          e.stopPropagation();
          setMapViewType(prev => prev === 'normal' ? 'radar' : 'normal');
        }}
        title={mapViewType === 'radar' ? "Normal Map View" : "Radar View"}
      >
        <Compass style={{ width: '1.2rem', height: '1.2rem', animation: mapViewType === 'radar' ? 'spin 4s linear infinite' : 'none' }} />
      </RadarToggleBtn>

      {/* Toggle Attractions Button (if in Family Mode) */}
      {isFamilyMode && (
        <button
          onClick={() => setShowEventPois(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: showEventPois ? '#e65100' : '#ffffff',
            border: 'none',
            borderRadius: '50%',
            color: showEventPois ? '#ffffff' : '#e65100',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease-out'
          }}
          title={showEventPois ? "Hide Attractions" : "Show Attractions"}
          type="button"
        >
          <MapIcon style={{ width: '1.2rem', height: '1.2rem' }} />
        </button>
      )}

      {/* Toggle Family Members Button (if in a group) */}
      {currentGroup && (
        <button
          onClick={() => setShowFamilyMembers(prev => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '2.5rem',
            height: '2.5rem',
            backgroundColor: showFamilyMembers ? '#e65100' : '#ffffff',
            border: 'none',
            borderRadius: '50%',
            color: showFamilyMembers ? '#ffffff' : '#e65100',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'all 0.2s ease-out'
          }}
          title={showFamilyMembers ? "Hide Family" : "Show Family"}
          type="button"
        >
          <Users style={{ width: '1.2rem', height: '1.2rem' }} />
        </button>
      )}
    </div>
  );
}
