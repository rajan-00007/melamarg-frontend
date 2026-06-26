'use client';

import React from 'react';
import { Navigation, AlertTriangle, Layers, Info } from 'lucide-react';
import {
  ExploreCardTitle,
  ExplorePOIInfoRow,
  ExploreCardDescription,
  ExploreActionsRow,
  ExploreNavButton,
  ExploreCloseButton,
  BottomHeaderRow,
  BottomTitle,
  BottomButtonsRow,
  BottomActionButton,
  PoisScrollList,
  PoiItemRow,
  PoiLeftSection,
  PoiIconBox,
  PoiTextCol,
  PoiName,
  PoiMeta,
  PoiGoButton
} from './page.styled';
import { getHaversineDistance, getCategoryEmoji } from './mapUtils';

interface BottomSheetContentProps {
  selectedPoi: any | null;
  setSelectedPoi: (val: any | null) => void;
  userGps: [number, number] | null;
  setNavTarget: (poi: any) => void;
  activeAdvisories: any[] | null;
  setIsAdvisoryDrawerOpen: (val: boolean) => void;
  showZones: boolean;
  setShowZones: React.Dispatch<React.SetStateAction<boolean>>;
  sortedNearestPois: any[];
  mapRef: React.RefObject<any>;
  categoryColor: (catName: string) => string;
  t: any;
  tPoiName: (poi: any) => string;
  tPoiDesc: (poi: any) => string;
}

export default function BottomSheetContent({
  selectedPoi,
  setSelectedPoi,
  userGps,
  setNavTarget,
  activeAdvisories,
  setIsAdvisoryDrawerOpen,
  showZones,
  setShowZones,
  sortedNearestPois,
  mapRef,
  categoryColor,
  t,
  tPoiName,
  tPoiDesc
}: BottomSheetContentProps) {
  if (selectedPoi) {
    const dist = userGps ? getHaversineDistance(userGps[0], userGps[1], Number(selectedPoi.latitude), Number(selectedPoi.longitude)) : 0;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
        <div style={{ overflow: 'hidden', flexGrow: 1, paddingBottom: '0.75rem' }}>
          <ExploreCardTitle style={{ marginTop: 0, fontSize: '16px' }}>{tPoiName(selectedPoi)}</ExploreCardTitle>
          <ExplorePOIInfoRow style={{ margin: '0.35rem 0' }}>
            <span className="badge" style={{ backgroundColor: `${categoryColor(selectedPoi.category_name)}15`, color: categoryColor(selectedPoi.category_name), padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>
              {selectedPoi.category_name}
            </span>
            <span>•</span>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
              {dist < 1000 ? `${Math.round(dist)} m ${t('metersAway')}` : `${(dist / 1000).toFixed(2)} km ${t('metersAway')}`}
            </span>
          </ExplorePOIInfoRow>
          {selectedPoi.description && (
            <ExploreCardDescription style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4, marginTop: '0.5rem' }}>
              {tPoiDesc(selectedPoi)}
            </ExploreCardDescription>
          )}
        </div>
        <ExploreActionsRow style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          <ExploreNavButton
            style={{ flex: 1 }}
            onClick={() => {
              setNavTarget(selectedPoi);
            }}
          >
            <Navigation style={{ width: '1.1rem', height: '1.1rem', transform: 'rotate(45deg)' }} />
            <span>{t('startNavigation')}</span>
          </ExploreNavButton>
          <ExploreCloseButton style={{ flex: 1 }} onClick={() => setSelectedPoi(null)}>
            <span>{t('cancel')}</span>
          </ExploreCloseButton>
        </ExploreActionsRow>
      </div>
    );
  }

  /* Default Nearest Points & Action Buttons List */
  const activeAdvisoryCount = activeAdvisories ? activeAdvisories.filter(a => a.is_active).length : 0;

  return (
    <>
      <BottomHeaderRow>
        <BottomTitle>{t('nearest')}</BottomTitle>
        
        <BottomButtonsRow>
          {/* Advisory Button */}
          <BottomActionButton
            $variant={activeAdvisoryCount > 0 ? 'warning' : 'secondary'}
            onClick={() => setIsAdvisoryDrawerOpen(true)}
            title="View active advisories"
          >
            <AlertTriangle size={13} />
            <span>{t('advisory') || 'Advisory'}</span>
          </BottomActionButton>

          {/* Toggle Zones Button */}
          <BottomActionButton
            $variant={showZones ? 'primary' : 'secondary'}
            onClick={() => setShowZones(prev => !prev)}
            title={showZones ? "Hide zones overlay" : "Show zones overlay"}
          >
            <Layers size={13} />
            <span>{t('zones' as any) || 'Zones'}</span>
          </BottomActionButton>
        </BottomButtonsRow>
      </BottomHeaderRow>

      <PoisScrollList>
        {sortedNearestPois.length > 0 ? (
          sortedNearestPois.map(item => (
            <PoiItemRow
              key={item.id}
              onClick={() => {
                setSelectedPoi(item);
                if (mapRef.current) {
                  mapRef.current.setView([Number(item.latitude), Number(item.longitude)], 18);
                }
              }}
            >
              <PoiLeftSection>
                <PoiIconBox $bgColor={`${categoryColor(item.category_name)}15`} $color={categoryColor(item.category_name)}>
                  <span style={{ fontSize: '15px' }}>{getCategoryEmoji(item.category_name)}</span>
                </PoiIconBox>
                <PoiTextCol>
                  <PoiName>{tPoiName(item) || item.name_en || 'POI'}</PoiName>
                  <PoiMeta>
                    {item.distanceMeters < 1000 ? `${Math.round(item.distanceMeters)}m` : `${(item.distanceMeters / 1000).toFixed(1)}km`} • {item.walkTimeMinutes} min walk
                  </PoiMeta>
                </PoiTextCol>
              </PoiLeftSection>
              <PoiGoButton
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPoi(item);
                }}
              >
                {t('go') || 'Go'}
              </PoiGoButton>
            </PoiItemRow>
          ))
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', gap: '0.35rem', padding: '1.5rem 0' }}>
            <Info size={24} style={{ opacity: 0.5 }} />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>No points found</span>
            <span style={{ fontSize: '11px', opacity: 0.8 }}>Try a different category or search term</span>
          </div>
        )}
      </PoisScrollList>
    </>
  );
}
