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
    setActiveCategory
  } = useUserTest();

  if (!selectedEvent) return null;

  // Format event title to RATH YATRA 2025 · PURI
  const formattedEventSub = selectedEvent.name
    ? selectedEvent.name.toUpperCase().replace(' - ', ' · ')
    : 'RATH YATRA 2025 · PURI';

  return (
    <HomeContainer>
      
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
