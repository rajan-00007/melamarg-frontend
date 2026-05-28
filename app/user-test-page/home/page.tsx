'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
import {
  HomeContainer,
  EventHeaderCard,
  EventSub,
  EventTitle,
  EventMeta,
  StatusBox,
  StatusInfo,
  StatusTitle,
  StatusText,
  StatusBadge,
  CategoriesGrid,
  CategoryCard,
  EmojiIcon,
  CategoryTextWrapper,
  CategoryLabel,
  CategoryCount,
  BannerAlert,
  BannerText,
  BannerIndicator,
  BannerBell
} from './page.styled';

export default function EventHomePage() {
  const router = useRouter();
  const {
    selectedEvent,
    poisList,
    getCategoryStats,
    setActiveCategory,
    walkStats,
    loadingMapData
  } = useUserTest();

  if (!selectedEvent) return null;

  // Format event title to RATH YATRA 2025 · PURI
  const formattedEventSub = selectedEvent.name
    ? selectedEvent.name.toUpperCase().replace(' - ', ' · ')
    : 'RATH YATRA 2025 · PURI';

  if (poisList.length === 0 && loadingMapData) {
    return (
      <HomeContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#a1a1aa', textAlign: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid rgba(34, 211, 238, 0.1)',
            borderTopColor: '#22d3ee',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.4; }
              50% { opacity: 1; }
            }
          `}</style>
          <div style={{ fontSize: '14px', fontWeight: '800', color: '#fafafa' }}>Syncing map assets...</div>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#71717a' }}>Downloading points of interest and routing sectors</div>
        </div>
      </HomeContainer>
    );
  }

  return (
    <HomeContainer>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
      
      {/* Event Header Card (Full-bleed dark brown) */}
      <EventHeaderCard>
        <EventSub>
          {formattedEventSub}
        </EventSub>
        <EventTitle>
          Choose a destination
        </EventTitle>
        <EventMeta>
          <span>Map downloaded · Last updated 2h ago</span>
        </EventMeta>
      </EventHeaderCard>

      {/* Offline Map Status Header Box */}
      {loadingMapData ? (
        <StatusBox style={{ borderColor: 'rgba(34, 211, 238, 0.2)' }}>
          <StatusInfo>
            <StatusTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                display: 'inline-block',
                width: '0.5rem',
                height: '0.5rem',
                backgroundColor: '#22d3ee',
                borderRadius: '50%',
                animation: 'pulse 1.5s infinite'
              }} />
              <span>Checking for updates...</span>
            </StatusTitle>
            <StatusText style={{ paddingLeft: '1rem' }}>{poisList.length} POIs active · Updating...</StatusText>
          </StatusInfo>
          <StatusBadge style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', borderColor: 'rgba(34, 211, 238, 0.2)' }}>
            <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              border: '2px solid rgba(34, 211, 238, 0.2)',
              borderTopColor: '#22d3ee',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </StatusBadge>
        </StatusBox>
      ) : (
        <StatusBox>
          <StatusInfo>
            <StatusTitle>Offline map ready</StatusTitle>
            <StatusText>{poisList.length} POIs loaded</StatusText>
          </StatusInfo>
          <StatusBadge>
            <span>OFFLINE</span>
            <span className="checkmark">✓</span>
          </StatusBadge>
        </StatusBox>
      )}

      {/* Active Walk Telemetry Quick Link Banner */}
      {walkStats && walkStats.distance > 0 && (
        <BannerAlert 
          style={{ 
            background: 'rgba(168, 85, 247, 0.1)', 
            borderColor: 'rgba(168, 85, 247, 0.35)', 
            margin: '0 0 1rem 0', 
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(168, 85, 247, 0.1)'
          }} 
          onClick={() => router.push('/user-test-page/map')}
        >
          <BannerIndicator style={{ backgroundColor: '#a855f7' }} />
          <span style={{ fontSize: '1rem', marginRight: '0.5rem', animation: 'ping 1.5s infinite' }}>👣</span>
          <BannerText style={{ color: '#fafafa', fontSize: '11px', fontWeight: '800' }}>
            Active Walk Session: You have walked {walkStats.distance} km today. Tap to view your path!
          </BannerText>
        </BannerAlert>
      )}
   
      {/* Grid 3x3 of POI categories */}
      <CategoriesGrid>
        {[
          { id: 'toilet', label: 'Toilets', count: getCategoryStats('toilet'), emoji: '🚻', desc: 'nearby' },
          { id: 'police', label: 'Police', count: getCategoryStats('police'), emoji: '👮', desc: 'nearby' },
          { id: 'medical', label: 'Medical', count: getCategoryStats('medical'), emoji: '🏥', desc: 'nearby' },
          { id: 'lost', label: 'Lost & Found', count: getCategoryStats('lost'), emoji: '🔍', desc: 'nearby' },
          { id: 'water', label: 'Water', count: getCategoryStats('water'), emoji: '💧', desc: 'nearby' },
          { id: 'exit', label: 'Exit Gates', count: getCategoryStats('exit'), emoji: '🚪', desc: 'nearby' },
          { id: 'food', label: 'Food', count: getCategoryStats('food'), emoji: '🍽️', desc: 'nearby' },
          { id: 'parking', label: 'Parking', count: getCategoryStats('parking'), emoji: '🅿️', desc: 'nearby' },
          { id: 'emergency', label: 'Emergency', count: 1, emoji: '⚠️', isEmergency: true, desc: 'Assembly' }
        ].map((cat) => {
          return (
            <CategoryCard
              key={cat.id}
              $isEmergency={cat.isEmergency}
              onClick={() => {
                setActiveCategory(cat.id);
                router.push('/user-test-page/pois');
              }}
            >
              <EmojiIcon className="emoji">{cat.emoji}</EmojiIcon>
              <CategoryTextWrapper>
                <CategoryLabel>{cat.label}</CategoryLabel>
                <CategoryCount>
                  {cat.id === 'emergency' ? cat.desc : `${cat.count} ${cat.desc}`}
                </CategoryCount>
              </CategoryTextWrapper>
            </CategoryCard>
          );
        })}
      </CategoriesGrid>

      {/* Banner Alert details */}
      <BannerAlert>
        <BannerIndicator />
        <BannerBell />
        <BannerText>
          Procession route change — Bada Danda Sector 3 closed. Tap to see alternate.
        </BannerText>
      </BannerAlert>
    </HomeContainer>
  );
}
