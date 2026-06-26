'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Users, Droplet, Plus, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import { getHaversineDistance } from '@/context/types';
import Text from '@/components/style/text/Text';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.25rem;
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
`;

// Single cohesive panel card containing radar and list items
const UnifiedProximityCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 1.25rem;
  border: 1px solid #EEF2F6;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  overflow: hidden;
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const HudContainer = styled.div`
  background-color: #F7F4EF; /* Light beige/sand HUD screen */
  border-radius: 1.25rem 1.25rem 0 0;
  height: 150px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.25rem;
  border-bottom: 1px solid #ECE7DE;
  box-sizing: border-box;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  transform: translate3d(0, 0, 0);
  will-change: transform;
`;

const RadarCircleLarge = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  border: 1px dashed rgba(230, 81, 0, 0.15);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
`;

const RadarCircleSmall = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border: 1px solid rgba(230, 81, 0, 0.1);
  border-radius: 50%;
  pointer-events: none;
  z-index: 3;
`;

const RadarSweep = styled.div`
  position: absolute;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    rgba(230, 81, 0, 0.08) 0deg,
    rgba(230, 81, 0, 0) 120deg
  );
  border-radius: 50%;
  top: -50%;
  left: -50%;
  animation: ${rotate} 4s linear infinite;
  pointer-events: none;
  z-index: 2; /* Sweep floats on top of the MapCanvas but below text/badges */
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
`;

const UserGpsDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  background-color: ${colors.brand.primary};
  border-radius: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12px ${colors.brand.primary};
  z-index: 3;
`;

const RadarTargetDot = styled.div<{ $top: string; $left: string }>`
  position: absolute;
  top: ${props => props.$top};
  left: ${props => props.$left};
  width: 8px;
  height: 8px;
  background-color: ${colors.brand.primary};
  border-radius: 50%;
  animation: ${pulse} 2s infinite ease-in-out;
  box-shadow: 0 0 8px ${colors.brand.primary};
  z-index: 3;
`;

const HudText = styled.span`
  font-family: monospace;
  font-size: 9px;
  font-weight: 700;
  color: ${colors.neutral[800]};
  opacity: 0.5;
  z-index: 4;
  letter-spacing: 0.05em;
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #FFFFFF;
`;

const PoiItemRow = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  background-color: #FFFFFF;
  border: none;
  border-bottom: 1px solid #F1F5F9;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:active {
    background-color: #FAF9F6;
  }
`;

const LeftSide = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
  flex: 1;
`;

const IconBox = styled.div<{ $bgColor: string; $color: string }>`
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 0.65rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${props => props.$bgColor};
  color: ${props => props.$color};

  svg {
    width: 1.15rem;
    height: 1.15rem;
    stroke-width: 2.5;
  }
`;

const TextCol = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  min-width: 0;
`;

export default function SurroundingByYou() {
  const router = useRouter();
  const { poisList, userGps, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions, leafletLoaded, selectedEvent } = useUserTest();
  const { t, tPoiName } = useLanguage();
  const mapInstanceRef = useRef<any>(null);
  const userLayerRef = useRef<any>(null);
  const poisLayerRef = useRef<any>(null);


  // Find nearest dynamic POIs based on categories
  const surroundingItems = useMemo(() => {
    const getClosestPoi = (keyword: string) => {
      if (!poisList || poisList.length === 0) return null;
      const matches = poisList.filter((p) =>
        p.category_name?.toLowerCase().includes(keyword.toLowerCase())
      );
      if (matches.length === 0) return null;

      const userLat = userGps ? userGps[0] : 0;
      const userLng = userGps ? userGps[1] : 0;

      const sorted = matches.map((p) => {
        const dist = userLat !== 0 ? getHaversineDistance(userLat, userLng, p.latitude, p.longitude) : 150;
        return { ...p, distance: dist };
      }).sort((a, b) => a.distance - b.distance);

      return sorted[0];
    };

    const toiletPoi = getClosestPoi('toilet') || getClosestPoi('restroom');
    const waterPoi = getClosestPoi('water') || getClosestPoi('drinking');
    const medicalPoi = getClosestPoi('medical') || getClosestPoi('firstaid') || getClosestPoi('camp');

    const list = [];

    // Card 1: Toilet
    if (toiletPoi) {
      const distance = Math.round(toiletPoi.distance);
      const time = Math.max(1, Math.round(distance / 80));
      list.push({
        id: toiletPoi.id,
        name: tPoiName(toiletPoi),
        details: `${distance}m • ${time} min walk`,
        category: 'toilet',
        rawPoi: toiletPoi,
        bg: '#FFF9E6',
        color: '#D97706',
        icon: Users
      });
    } else {
      list.push({
        id: 'mock-toilet',
        name: 'Public Toilet Block C',
        details: '50m • 1 min walk',
        category: 'toilet',
        rawPoi: { id: 'mock-toilet', name_en: 'Public Toilet Block C', latitude: 19.8048, longitude: 85.8188, category_name: 'toilet' },
        bg: '#FFF9E6',
        color: '#D97706',
        icon: Users
      });
    }

    // Card 2: Water
    if (waterPoi) {
      const distance = Math.round(waterPoi.distance);
      const time = Math.max(1, Math.round(distance / 80));
      list.push({
        id: waterPoi.id,
        name: tPoiName(waterPoi),
        details: `${distance}m • ${time} min walk`,
        category: 'water',
        rawPoi: waterPoi,
        bg: '#E0F2FE',
        color: '#0284C7',
        icon: Droplet
      });
    } else {
      list.push({
        id: 'mock-water',
        name: 'Drinking Water Point #2',
        details: '120m • 2 min walk',
        category: 'water',
        rawPoi: { id: 'mock-water', name_en: 'Drinking Water Point #2', latitude: 19.8052, longitude: 85.8194, category_name: 'water' },
        bg: '#E0F2FE',
        color: '#0284C7',
        icon: Droplet
      });
    }

    // Card 3: Medical
    if (medicalPoi) {
      const distance = Math.round(medicalPoi.distance);
      const time = Math.max(1, Math.round(distance / 80));
      list.push({
        id: medicalPoi.id,
        name: tPoiName(medicalPoi),
        details: `${distance}m • ${time} min walk`,
        category: 'medical',
        rawPoi: medicalPoi,
        bg: '#FEE2E2',
        color: '#EF4444',
        icon: Plus
      });
    } else {
      list.push({
        id: 'mock-medical',
        name: 'Medical Camp #4',
        details: '200m • 3 min walk',
        category: 'medical',
        rawPoi: { id: 'mock-medical', name_en: 'Medical Camp #4', latitude: 19.8056, longitude: 85.8202, category_name: 'medical' },
        bg: '#FEE2E2',
        color: '#EF4444',
        icon: Plus
      });
    }

    return list;
  }, [poisList, userGps, tPoiName]);

  // 1. Initialize locked static mini-map ONCE
  useEffect(() => {
    if (!leafletLoaded || !selectedEvent || typeof window === 'undefined') return;
    const L = (window as any).L;
    if (!L) return;

    if (mapInstanceRef.current) return;

    const initialLat = selectedEvent.center_lat ? Number(selectedEvent.center_lat) : 19.8050;
    const initialLng = selectedEvent.center_lng ? Number(selectedEvent.center_lng) : 85.8250;

    const miniMap = L.map('mini-leaflet-map-canvas', {
      zoomControl: false,
      dragging: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      attributionControl: false
    }).setView([initialLat, initialLng], 17);

    mapInstanceRef.current = miniMap;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(miniMap);

    userLayerRef.current = L.layerGroup().addTo(miniMap);
    poisLayerRef.current = L.layerGroup().addTo(miniMap);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        userLayerRef.current = null;
        poisLayerRef.current = null;
      }
    };
  }, [leafletLoaded, selectedEvent]);

  // 2. Dynamically update mini-map center, user position and POI markers
  useEffect(() => {
    if (!leafletLoaded || !mapInstanceRef.current || !userLayerRef.current || !poisLayerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const miniMap = mapInstanceRef.current;
    const userLayer = userLayerRef.current;
    const poisLayer = poisLayerRef.current;

    userLayer.clearLayers();
    poisLayer.clearLayers();

    // Center map on user location or event center fallback
    const centerLat = userGps && userGps[0] !== 0 ? userGps[0] : (selectedEvent?.center_lat ? Number(selectedEvent.center_lat) : 19.8050);
    const centerLng = userGps && userGps[1] !== 0 ? userGps[1] : (selectedEvent?.center_lng ? Number(selectedEvent.center_lng) : 85.8250);

    miniMap.setView([centerLat, centerLng], 17);

    // Plot user position
    if (userGps && userGps[0] !== 0) {
      const userIcon = L.divIcon({
        className: 'user-marker-container',
        html: '<div class="user-gps-dot"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([userGps[0], userGps[1]], { icon: userIcon }).addTo(userLayer);
    }

    // Custom Breathing Marker Icon for POIs
    const breathingIcon = L.divIcon({
      className: 'breathing-poi-marker-container',
      html: '<div class="breathing-poi-marker"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Plot nearest POIs with text tooltips
    surroundingItems.forEach((item) => {
      if (item.rawPoi && item.rawPoi.latitude && item.rawPoi.longitude) {
        L.marker([item.rawPoi.latitude, item.rawPoi.longitude], { icon: breathingIcon })
          .addTo(poisLayer)
          .bindTooltip(item.name, {
            permanent: true,
            direction: 'top',
            className: 'mini-map-tooltip'
          });
      }
    });
  }, [leafletLoaded, userGps, surroundingItems, selectedEvent]);

  const handlePoiNavigate = (rawPoi: any) => {
    setNavTarget(rawPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(rawPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/home');
  };

  return (
    <SectionWrapper>
      {/* Dynamic CSS styles for Leaflet custom marker classes */}
      <style>{`
        .breathing-poi-marker-container {
          background: transparent !important;
          border: none !important;
        }
        .breathing-poi-marker {
          width: 10px;
          height: 10px;
          background-color: #E65100; /* Warm Orange */
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(230, 81, 0, 0.8);
          animation: mini-poi-breathe 2s infinite ease-in-out;
        }
        .user-marker-container {
          background: transparent !important;
          border: none !important;
        }
        .user-gps-dot {
          width: 8px;
          height: 8px;
          background-color: #0052F7; /* Blue user indicator */
          border: 2px solid #FFFFFF;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(0, 82, 247, 0.8);
          animation: mini-user-pulse 1.5s infinite ease-in-out;
        }
        @keyframes mini-poi-breathe {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 1; }
        }
        @keyframes mini-user-pulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .mini-map-tooltip {
          background-color: rgba(15, 23, 42, 0.85) !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 4px !important;
          padding: 2px 6px !important;
          font-size: 8.5px !important;
          font-family: inherit !important;
          font-weight: 500 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
        }
        .mini-map-tooltip::before {
          display: none !important;
        }
      `}</style>

      <SectionHeader>
        <Text
          variant="bodyPrimary"
          weight={700}
          color={colors.neutral[900]}
          style={{ letterSpacing: '0.05em', fontSize: '15px', textTransform: 'uppercase' }}
        >
          {t('surroundingByYou')}
        </Text>
        <Text
          variant="caption"
          weight={600}
          color={colors.brand.primary}
          style={{ letterSpacing: '0.05em', fontSize: '9px', textTransform: 'uppercase' }}
        >
          {(t as any)('liveProximity') || 'LIVE PROXIMITY'}
        </Text>
      </SectionHeader>

      <UnifiedProximityCard>
        <HudContainer>
          {leafletLoaded && <MapCanvas id="mini-leaflet-map-canvas" />}
          <RadarSweep />
          
          {/* Static design lines drawn only when Leaflet map is not loaded */}
          {!leafletLoaded && (
            <>
              <RadarCircleLarge />
              <RadarCircleSmall />
              <UserGpsDot />
              <RadarTargetDot $top="35%" $left="65%" />
              <RadarTargetDot $top="65%" $left="25%" />
              <RadarTargetDot $top="22%" $left="40%" />
            </>
          )}

          <HudText>
            {(t as any)('hudScanning') || 'HUD SYSTEM V2.1 // SCANNING...'}
          </HudText>
        </HudContainer>

        <ListWrapper>
          {surroundingItems.map((item) => {
            const Icon = item.icon;
            return (
              <PoiItemRow
                key={item.id}
                onClick={() => handlePoiNavigate(item.rawPoi)}
              >
                <LeftSide>
                  <IconBox $bgColor={item.bg} $color={item.color}>
                    <Icon />
                  </IconBox>
                  <TextCol>
                    <Text
                      variant="bodyPrimary"
                      weight={600}
                      color={colors.neutral[900]}
                      style={{ fontSize: '14.5px', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {item.name}
                    </Text>
                    <Text
                      variant="caption"
                      weight={500}
                      color={colors.neutral[800]}
                      style={{ fontSize: '11.5px', opacity: 0.6 }}
                    >
                      {item.details}
                    </Text>
                  </TextCol>
                </LeftSide>
                <ChevronRight color="#B5B7BD" size={18} />
              </PoiItemRow>
            );
          })}
        </ListWrapper>
      </UnifiedProximityCard>
    </SectionWrapper>
  );
}
