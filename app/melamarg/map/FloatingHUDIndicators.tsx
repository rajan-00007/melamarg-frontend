'use client';

import React from 'react';
import {
  FloatingHUDContainer,
  HUDSection,
  HUDIndicatorBadge
} from './page.styled';

interface FloatingHUDIndicatorsProps {
  mapZoom: number;
  floatingPois: any[];
  setSelectedPoi: (val: any) => void;
  mapRef: React.RefObject<any>;
  categoryColor: (catName: string) => string;
  getBubbleIconSvg: (catName: string, color: string, size: number) => string;
  tPoiName: (poi: any) => string;
  getDistanceString: (dist: number) => string;
}

export default function FloatingHUDIndicators({
  mapZoom,
  floatingPois,
  setSelectedPoi,
  mapRef,
  categoryColor,
  getBubbleIconSvg,
  tPoiName,
  getDistanceString
}: FloatingHUDIndicatorsProps) {
  if (mapZoom < 18 || floatingPois.length === 0) {
    return null;
  }

  const directions: Array<{ key: 'front' | 'back' | 'left' | 'right'; arrow: string }> = [
    { key: 'front', arrow: '▲' },
    { key: 'back', arrow: '▼' },
    { key: 'left', arrow: '◀' },
    { key: 'right', arrow: '▶' }
  ];

  return (
    <FloatingHUDContainer>
      {directions.map(({ key, arrow }) => {
        const pois = floatingPois.filter(p => p.relDir === key);
        if (pois.length === 0) return null;

        return (
          <HUDSection key={key} $position={key}>
            {pois.map(p => (
              <HUDIndicatorBadge 
                key={p.id} 
                $direction={key}
                onClick={() => {
                  setSelectedPoi(p);
                  if (mapRef.current) {
                    mapRef.current.setView([Number(p.latitude), Number(p.longitude)], 18);
                  }
                }}
              >
                <div className="icon-circle" style={{
                  background: `${categoryColor(p.category_name)}18`,
                  color: categoryColor(p.category_name)
                }} dangerouslySetInnerHTML={{ __html: getBubbleIconSvg(p.category_name, categoryColor(p.category_name), 16) }} />
                
                <div className="text-container">
                  <span className="poi-title">{tPoiName(p) || p.name_en || 'POI'}</span>
                  <span className="poi-subtitle">{(p.description && p.description.length < 20) ? p.description : getDistanceString(p.dist)}</span>
                </div>

                <span className="direction-arrow">{arrow}</span>
              </HUDIndicatorBadge>
            ))}
          </HUDSection>
        );
      })}
    </FloatingHUDContainer>
  );
}
