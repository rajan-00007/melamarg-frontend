'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
import {
  PoisContainer,
  BrandHeader,
  BrandTitle,
  BrandSubtitle,
  HeaderBar,
  BackButton,
  CategoryTitle,
  CountBadge,
  ListSubtitle,
  CardsList,
  EmptyState,
  PoiCard,
  PoiInfoWrapper,
  IndexCircle,
  PoiDetails,
  PoiTitle,
  PoiStats,
  DotSeparator,
  WalkText,
  StatusText,
  GoButton,
  TipBox,
  StyledChevronLeft,
  StyledArrowRight,
  StyledCompass,
  StyledShield,
  StyledHeartPulse,
  StyledSearch,
  StyledDroplets,
  StyledLogOut,
  StyledUtensils,
  StyledCar,
  StyledAlertTriangle
} from './page.styled';

export default function CategoryPoisPage() {
  const router = useRouter();
  const {
    activeCategory,
    getSortedPois,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions
  } = useUserTest();

  const sortedPois = getSortedPois();

  return (
    <PoisContainer>
      
      {/* Sleek Branding Header */}
      <BrandHeader>
        <BrandTitle>MelaMarg</BrandTitle>
        <BrandSubtitle>Tentative UI - Offline Mass Gathering Navigation</BrandSubtitle>
      </BrandHeader>

      {/* Category list header */}
      <HeaderBar>
        <BackButton onClick={() => router.push('/user-test-page/home')}>
          <StyledChevronLeft />
          <span>Back</span>
        </BackButton>

        <CategoryTitle>
          {(() => {
            switch (activeCategory) {
              case 'toilet': return (
                <>
                  <StyledCompass />
                  <span>Toilets & Sanitation</span>
                </>
              );
              case 'police': return (
                <>
                  <StyledShield />
                  <span>Police & Help</span>
                </>
              );
              case 'medical': return (
                <>
                  <StyledHeartPulse />
                  <span>Medical Centers</span>
                </>
              );
              case 'lost': return (
                <>
                  <StyledSearch />
                  <span>Lost & Found</span>
                </>
              );
              case 'water': return (
                <>
                  <StyledDroplets />
                  <span>Drinking Water</span>
                </>
              );
              case 'exit': return (
                <>
                  <StyledLogOut />
                  <span>Exit Gate points</span>
                </>
              );
              case 'food': return (
                <>
                  <StyledUtensils />
                  <span>Food & Dining</span>
                </>
              );
              case 'parking': return (
                <>
                  <StyledCar />
                  <span>Parking Zones</span>
                </>
              );
              default: return (
                <>
                  <StyledAlertTriangle />
                  <span>Emergency Zones</span>
                </>
              );
            }
          })()}
        </CategoryTitle>

        <CountBadge>
          {sortedPois.length} nearest
        </CountBadge>
      </HeaderBar>

      <ListSubtitle>Sorted by walking distance from your location</ListSubtitle>

      {/* Cards List */}
      <CardsList>
        {sortedPois.length === 0 ? (
          <EmptyState>
            No custom POIs in this category yet. Click reset or switch to mock offline mode.
          </EmptyState>
        ) : (
          sortedPois.map((poi, idx) => (
            <PoiCard key={poi.id}>
              <PoiInfoWrapper>
                <IndexCircle>
                  {idx + 1}
                </IndexCircle>

                <PoiDetails>
                  <PoiTitle>{poi.name_en}</PoiTitle>
                  <PoiStats>
                    <span>{poi.distance}m</span>
                    <DotSeparator>•</DotSeparator>
                    <WalkText>~{poi.time} min walk</WalkText>
                    <DotSeparator>•</DotSeparator>
                    <StatusText>Open</StatusText>
                  </PoiStats>
                </PoiDetails>
              </PoiInfoWrapper>

              <GoButton
                onClick={() => {
                  setNavTarget(poi);
                  setScreenMode('navigation');
                  setArrivalNotify(false);
                  logNavigationInstructions(poi);
                  router.push('/user-test-page/navigation');
                }}
              >
                <span>Go</span>
                <StyledArrowRight />
              </GoButton>
            </PoiCard>
          ))
        )}
      </CardsList>

      {/* Tip info box */}
      <TipBox>
        Tip: Nearest 3 shown. Tap any Go button to start navigation. No internet needed.
      </TipBox>
    </PoisContainer>
  );
}
