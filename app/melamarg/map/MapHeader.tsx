'use client';

import React from 'react';
import { Search, LayoutGrid, X } from 'lucide-react';
import {
  CategoryScrollWrapper,
  CategoryScrollContainer,
  CategoryPill,
  SearchTriggerButton,
  SearchOverlayContainer,
  SearchInput,
  SearchCloseButton,
  GpsStrongPill
} from './page.styled';

interface MapHeaderProps {
  isSearchActive: boolean;
  setIsSearchActive: (val: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  setSelectedPoi: (val: any) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  userGps: [number, number] | null;
  gpsStatus: 'locked' | 'searching' | 'lost';
  explorePathStatus: {
    isOff: boolean;
    dist: number;
    dir: string;
    pathName: string;
  };
  t: any;
  router: any;
}

export default function MapHeader({
  isSearchActive,
  setIsSearchActive,
  selectedCategory,
  setSelectedCategory,
  setSelectedPoi,
  searchQuery,
  setSearchQuery,
  userGps,
  gpsStatus,
  explorePathStatus,
  t,
  router
}: MapHeaderProps) {
  return (
    <>
      {/* Top Categories Scroll Bar & Search */}
      <CategoryScrollWrapper>
        {!isSearchActive ? (
          <>
            <CategoryScrollContainer>
              {[
                { id: 'All', label: 'All', icon: '📍' },
                { id: 'Restrooms', label: t('restrooms'), icon: '🚺' },
                { id: 'Water', label: t('drinkingWater' as any) || 'Water', icon: '💧' },
                { id: 'Food', label: 'Food', icon: '🍽️' },
                { id: 'Medical', label: t('medical'), icon: '🏥' },
                { id: 'Security', label: t('police'), icon: '👮' },
                { id: 'Gates', label: 'Gates', icon: '🛕' },
                { id: 'Parking', label: 'Parking', icon: '🅿️' }
              ].map(cat => (
                <CategoryPill
                  key={cat.id}
                  $active={selectedCategory === cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setSelectedPoi(null); // Deselect active POI when switching category
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </CategoryPill>
              ))}
            </CategoryScrollContainer>
            
            <SearchTriggerButton onClick={() => setIsSearchActive(true)} title="Search POIs">
              <Search size={16} />
            </SearchTriggerButton>
            <SearchTriggerButton 
              onClick={() => router.push('/melamarg/all-pois')} 
              title="View All POIs" 
              style={{ marginLeft: '4px' }}
            >
              <LayoutGrid size={16} />
            </SearchTriggerButton>
          </>
        ) : (
          <SearchOverlayContainer>
            <Search size={16} style={{ color: '#64748b', marginRight: '4px' }} />
            <SearchInput
              type="text"
              placeholder={t('searchPlaceholder') || "Search points..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedPoi(null); // Deselect active POI on search change
              }}
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#e65100', fontSize: '11px', fontWeight: '700', marginRight: '8px', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                {t('clear' as any) || 'Clear'}
              </button>
            )}
            <SearchCloseButton onClick={() => {
              setIsSearchActive(false);
              setSearchQuery('');
            }}>
              <X size={16} />
            </SearchCloseButton>
          </SearchOverlayContainer>
        )}
      </CategoryScrollWrapper>

      {/* Floating Info Badges Row (Path Status, GPS Status, Offline Mode) */}
      {userGps && (
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '1rem',
          right: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 999,
          pointerEvents: 'none'
        }}>
          {/* Left: Path status badge */}
          <div style={{ pointerEvents: 'auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              backgroundColor: explorePathStatus.isOff ? '#fee2e2' : '#d1fae5',
              color: explorePathStatus.isOff ? '#b91c1c' : '#065f46',
              border: `1px solid ${explorePathStatus.isOff ? '#fca5a5' : '#6ee7b7'}`,
              fontSize: '11px',
              fontWeight: '700',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: explorePathStatus.isOff ? '#ef4444' : '#10b981'
              }} />
              <span>
                {explorePathStatus.isOff
                  ? `${t('offPath') || 'Off Path'}: ${explorePathStatus.dist}m ${explorePathStatus.dir}`
                  : `${t('onPath') || 'On Path'}: ${explorePathStatus.pathName}`}
              </span>
            </div>
          </div>

          {/* Right: GPS navigation status pill */}
          <div style={{ display: 'flex', gap: '0.45rem', pointerEvents: 'auto' }}>
            {gpsStatus === 'locked' ? (
              <GpsStrongPill style={{ margin: 0, padding: '4px 10px', fontSize: '10px' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0288d1' }} />
                <span>{t('gpsStrong')}</span>
              </GpsStrongPill>
            ) : gpsStatus === 'searching' ? (
              <GpsStrongPill style={{ margin: 0, padding: '4px 10px', fontSize: '10px', background: '#FCF2E7', color: '#B7791F' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B7791F', animation: 'ping 1s infinite' }} />
                <span>{t('searchingGps')}</span>
              </GpsStrongPill>
            ) : (
              <GpsStrongPill style={{ margin: 0, padding: '4px 10px', fontSize: '10px', background: '#FEE2E2', color: '#EF4444' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                <span>{t('noGpsSignal')}</span>
              </GpsStrongPill>
            )}
          </div>
        </div>
      )}
    </>
  );
}
