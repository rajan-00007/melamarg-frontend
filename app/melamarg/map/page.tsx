'use client';

import React from 'react';
import { useEventMap } from './useEventMap';
import {
  SplitLayoutContainer,
  MapAreaContainer,
  MapCanvas,
  RadarOverlay,
  RadarCircleLargeStyled,
  RadarCircleSmallStyled,
  RadarSweepStyled,
  BottomContentContainer
} from './page.styled';
import MapHeader from './MapHeader';
import FloatingHUDIndicators from './FloatingHUDIndicators';
import ZoneHUD from './ZoneHUD';
import MapControls from './MapControls';
import BottomSheetContent from './BottomSheetContent';
import AdvisoryDrawer from './AdvisoryDrawer';

export default function EventMapPage() {
  const mapState = useEventMap();

  return (
    <SplitLayoutContainer>
      {/* Global CSS for Proximity Radar Breathing Effects */}
      <style>{`
        @keyframes nearestMarkerBreath {
          0% { transform: scale(1); filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 12px 24px rgba(230, 81, 0, 0.35)); }
          100% { transform: scale(1); filter: drop-shadow(0 4px 12px rgba(0,0,0,0.12)); }
        }
        @keyframes nearestIconPulse {
          0% { box-shadow: 0 0 0 0 rgba(230, 81, 0, 0.65); }
          70% { box-shadow: 0 0 0 12px rgba(230, 81, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(230, 81, 0, 0); }
        }
        .nearest-poi-breath {
          animation: nearestMarkerBreath 2.2s infinite ease-in-out !important;
          transform-origin: center bottom !important;
        }
        .nearest-icon-pulse {
          animation: nearestIconPulse 2.2s infinite ease-in-out !important;
        }
      `}</style>

      {/* Top 70vh Map Area */}
      <MapAreaContainer>
        <MapCanvas id="standalone-leaflet-map-canvas" style={{ height: '100%', width: '100%' }} />

        {/* Radar Overlay Sweeper and Rings */}
        {mapState.mapViewType === 'radar' && (
          <RadarOverlay>
            <RadarCircleLargeStyled />
            <RadarCircleSmallStyled />
            <RadarSweepStyled />
          </RadarOverlay>
        )}

        {/* Loading overlay */}
        {mapState.poisList.length === 0 && mapState.loadingMapData && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(22, 22, 34, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            color: '#a1a1aa'
          }}>
            <style>{`
              @keyframes map-spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              border: '3px solid rgba(34, 211, 238, 0.1)',
              borderTopColor: '#22d3ee',
              borderRadius: '50%',
              animation: 'map-spin 1s linear infinite'
            }} />
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#fafafa' }}>{mapState.t('initializingAssets')}</div>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>{mapState.t('downloadingPois')}</div>
          </div>
        )}

        {/* Top Header components: Category Scroll, Search bar, Status badges */}
        <MapHeader {...mapState} />

        {/* Off-screen quadrant HUD indicators */}
        <FloatingHUDIndicators {...mapState} />

        {/* Floating Zone badges (active card) */}
        <ZoneHUD {...mapState} />

        {/* Floating Controls: Recenter, Radar, Attractions, Family */}
        <MapControls {...mapState} />
      </MapAreaContainer>

      {/* Bottom 30vh Section */}
      <BottomContentContainer
        ref={mapState.bottomSheetRef}
        $bottomNavVisible={mapState.areControlsVisible}
        $isPoiSelected={!!mapState.selectedPoi}
      >
        <BottomSheetContent {...mapState} />
      </BottomContentContainer>

      {/* Collapsible Zone / Traffic Advisories Drawer */}
      <AdvisoryDrawer {...mapState} />
    </SplitLayoutContainer>
  );
}
