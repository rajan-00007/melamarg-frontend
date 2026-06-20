'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
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
  const { t, tPoiName } = useLanguage();

  const sortedPois = getSortedPois();

  return (
    <PoisContainer>
      {/* Category list header */}
      <HeaderBar>
        <BackButton onClick={() => router.push('/melamarg/home')}>
          <StyledChevronLeft />
          <span>{t('back')}</span>
        </BackButton>

        <CategoryTitle>
          {(() => {
            switch (activeCategory) {
              case 'toilet': return (
                <>
                  <StyledCompass />
                  <span>{t('toiletSanitation')}</span>
                </>
              );
              case 'police': return (
                <>
                  <StyledShield />
                  <span>{t('policeHelp')}</span>
                </>
              );
              case 'medical': return (
                <>
                  <StyledHeartPulse />
                  <span>{t('medicalCenters')}</span>
                </>
              );
              case 'lost': return (
                <>
                  <StyledSearch />
                  <span>{t('lostFound')}</span>
                </>
              );
              case 'water': return (
                <>
                  <StyledDroplets />
                  <span>{t('drinkingWater')}</span>
                </>
              );
              case 'exit': return (
                <>
                  <StyledLogOut />
                  <span>{t('exitGatePoints')}</span>
                </>
              );
              case 'food': return (
                <>
                  <StyledUtensils />
                  <span>{t('foodDining')}</span>
                </>
              );
              case 'parking': return (
                <>
                  <StyledCar />
                  <span>{t('parkingZones')}</span>
                </>
              );
              default: return (
                <>
                  <StyledAlertTriangle />
                  <span>{t('emergencyZones')}</span>
                </>
              );
            }
          })()}
        </CategoryTitle>

        <CountBadge>
          {sortedPois.length} {t('nearest')}
        </CountBadge>
      </HeaderBar>

      <ListSubtitle>{t('sortedDistance')}</ListSubtitle>

      {/* Cards List */}
      <CardsList>
        {sortedPois.length === 0 ? (
          <EmptyState>
            {t('noCustomPois')}
          </EmptyState>
        ) : (
          sortedPois.map((poi, idx) => (
            <PoiCard key={poi.id}>
              <PoiInfoWrapper>
                <IndexCircle>
                  {idx + 1}
                </IndexCircle>

                <PoiDetails>
                  <PoiTitle>{tPoiName(poi)}</PoiTitle>
                  <PoiStats>
                    <span>{poi.distance}m</span>
                    <DotSeparator>•</DotSeparator>
                    <WalkText>~{poi.time} {t('minWalk')}</WalkText>
                    <DotSeparator>•</DotSeparator>
                    <StatusText>{t('open')}</StatusText>
                  </PoiStats>
                </PoiDetails>
              </PoiInfoWrapper>

              <GoButton
                onClick={() => {
                  setNavTarget(poi);
                  setScreenMode('navigation');
                  setArrivalNotify(false);
                  logNavigationInstructions(poi);
                  router.push('/melamarg/navigation?returnUrl=/melamarg/pois');
                }}
              >
                <span>{t('go')}</span>
                <StyledArrowRight />
              </GoButton>
            </PoiCard>
          ))
        )}
      </CardsList>

      {/* Tip info box */}
      <TipBox>
        {t('poisTip')}
      </TipBox>
    </PoisContainer>
  );
}
