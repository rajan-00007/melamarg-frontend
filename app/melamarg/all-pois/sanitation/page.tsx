'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { StyledButton } from '@/components/style/button/Button.Styled';
import {
  ArrowLeft, Lightbulb, CheckCircle2, Info, Droplets
} from 'lucide-react';
import { FaMale, FaFemale, FaWheelchair, FaToilet } from 'react-icons/fa';
import { MdDirectionsWalk } from 'react-icons/md';

import {
  PageContainer, ScrollArea, HeaderRow, HeaderLeft, LangBadge,
  MapCard, StatusPill, MapGraphicWrapper, FloatingInfoBox, InfoBoxLeft, RoundedIconBadge,
  AvailabilityGrid, AvailabilityCard, GenderIconWrapper,
  DetailsCard, DetailRow, DetailLabelGroup, CapacityIcon,
  InfoRowCard, CircleIconBox, InfoCol, CivicBanner
} from './page.styled';

export default function SanitationDetailsPage() {
  const router = useRouter();
  const { selectedEvent, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions, triggerToast } = useUserTest();
  const { language, t } = useLanguage();

  if (!selectedEvent) return null;

  const handleStartWalking = () => {
    // Navigate to a mock Sanitation POI or custom target
    const toiletPoi = {
      id: 'sanitation-toilet-block-b',
      name_en: 'Public Toilet Block B',
      latitude: 19.8052,
      longitude: 85.8212,
      category_name: 'toilet',
      description: 'Public Toilet Block B - Sanitation facility'
    };

    setNavTarget(toiletPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(toiletPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/all-pois/sanitation');
  };

  return (
    <PageContainer>
      {/* Header */}
      <HeaderRow>
        <HeaderLeft>
          <button onClick={() => router.back()} id="back-button">
            <ArrowLeft size={20} />
          </button>
          <Text variant="subSectionTitle" weight={700} color={colors.brand.primary} style={{ margin: 0 }}>
            {t('sanitation')}
          </Text>
        </HeaderLeft>
        <LangBadge onClick={() => router.push(`/melamarg/language?returnUrl=/melamarg/all-pois/sanitation`)}>
          {language.toUpperCase()}
        </LangBadge>
      </HeaderRow>

      <ScrollArea>
        {/* 1. Map Card */}
        <MapCard>
          <StatusPill>
            <span className="dot" />
            <span>{t('statusCleaned')}</span>
          </StatusPill>

          <MapGraphicWrapper>
            {/* Custom SVG Map matching the circular graphic in the mockup */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="85" fill="#fdfcf0" stroke="#FFFFFF" strokeWidth="4" />
              <clipPath id="circleClip">
                <circle cx="100" cy="100" r="85" />
              </clipPath>
              <g clipPath="url(#circleClip)">
                {/* Parks */}
                <rect x="10" y="10" width="70" height="50" rx="12" fill="#e2f3ec" />
                <rect x="120" y="70" width="90" height="80" rx="16" fill="#e2f3ec" />
                {/* River */}
                <path d="M 0,165 Q 40,140 100,165 T 200,155 L 200,200 L 0,200 Z" fill="#c3ebfc" />
                {/* Streets */}
                <path d="M -10,95 L 210,95" stroke="#FFFFFF" strokeWidth="14" />
                <path d="M 95,-10 L 95,210" stroke="#FFFFFF" strokeWidth="14" />
                <path d="M 35,-10 L 35,110" stroke="#FFFFFF" strokeWidth="8" />
                
                {/* Route Path (Blue line) */}
                <path d="M 95,140 Q 115,115 95,95 T 130,80" stroke="#2b8082" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />

                {/* Map Pin */}
                <g transform="translate(85, 75) scale(0.8)">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#e65100" />
                  <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
                </g>
              </g>
            </svg>
          </MapGraphicWrapper>

          <FloatingInfoBox>
            <InfoBoxLeft>
              <Text variant="bodyPrimary" weight={700} color={colors.brand.primary} style={{ fontSize: '15px', margin: 0 }}>
                {t('toiletBlockB')}
              </Text>
              <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '11.5px', margin: 0 }}>
                300{t('metersAway')} • 4 {t('minWalk')}
              </Text>
            </InfoBoxLeft>
            <RoundedIconBadge>
              <FaToilet />
            </RoundedIconBadge>
          </FloatingInfoBox>
        </MapCard>

        {/* 2. Availability Grid */}
        <AvailabilityGrid>
          <AvailabilityCard>
            <GenderIconWrapper style={{ color: '#1a56db' }}>
              <FaMale />
            </GenderIconWrapper>
            <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '12.5px', margin: 0 }}>
              {t('male')}
            </Text>
            <Text variant="bodyTiny" weight={700} color={colors.brand.primary} style={{ fontSize: '12px', margin: 0 }}>
              2 {t('open')}
            </Text>
          </AvailabilityCard>

          <AvailabilityCard>
            <GenderIconWrapper style={{ color: '#0891b2' }}>
              <FaFemale />
            </GenderIconWrapper>
            <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '12.5px', margin: 0 }}>
              {t('female')}
            </Text>
            <Text variant="bodyTiny" weight={700} color={colors.brand.primary} style={{ fontSize: '12px', margin: 0 }}>
              3 {t('open')}
            </Text>
          </AvailabilityCard>

          <AvailabilityCard>
            <GenderIconWrapper style={{ color: '#64748b' }}>
              <FaWheelchair />
            </GenderIconWrapper>
            <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '12.5px', margin: 0 }}>
              {t('accessible')}
            </Text>
            <Text variant="bodyTiny" weight={700} color={colors.brand.primary} style={{ fontSize: '12px', margin: 0 }}>
              1 {t('open')}
            </Text>
          </AvailabilityCard>
        </AvailabilityGrid>

        {/* 3. Start Walking Button */}
        <StyledButton
          width="100%"
          height="48px"
          radius="12px"
          bgColor={colors.brand.primary}
          textColor={colors.base.white}
          onClick={handleStartWalking}
        >
          <MdDirectionsWalk size={18} />
          <Text variant="button" weight={700} color={colors.base.white}>
            {t('startWalking')}
          </Text>
        </StyledButton>

        {/* 4. Facility Details Card */}
        <DetailsCard>
          <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
            {t('facilityDetails')}
          </Text>
          
          <DetailRow style={{ marginTop: '0.25rem' }}>
            <DetailLabelGroup>
              <CapacityIcon>6</CapacityIcon>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[800]} style={{ margin: 0 }}>
                {t('capacity')}
              </Text>
            </DetailLabelGroup>
            <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
              6 {t('unitsAvailable')}
            </Text>
          </DetailRow>

          <hr style={{ border: 0, borderTop: `1px solid ${colors.neutral[500]}`, margin: '0.15rem 0' }} />

          <DetailRow>
            <DetailLabelGroup>
              <Droplets />
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[800]} style={{ margin: 0 }}>
                {t('waterSupply')}
              </Text>
            </DetailLabelGroup>
            <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
              {t('continuous')}
            </Text>
          </DetailRow>
        </DetailsCard>

        {/* 5. Safety Note */}
        <InfoRowCard $bg="#f8faf9" $borderColor="rgba(0, 105, 92, 0.08)">
          <CircleIconBox $bg="#00695c" $color="#FFFFFF">
            <Lightbulb />
          </CircleIconBox>
          <InfoCol>
            <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '11px', margin: 0 }}>
              {t('safetyNote')}
            </Text>
            <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
              {t('wellLitArea')}
            </Text>
          </InfoCol>
        </InfoRowCard>

        {/* 6. Navigation Status */}
        <InfoRowCard $bg="#f1f5f9" $borderColor="rgba(70, 90, 100, 0.08)">
          <CircleIconBox $bg="#455a64" $color="#FFFFFF">
            <CheckCircle2 />
          </CircleIconBox>
          <InfoCol>
            <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '11px', margin: 0 }}>
              {t('navigationStatus')}
            </Text>
            <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
              {t('routeClear')}
            </Text>
          </InfoCol>
        </InfoRowCard>

        {/* 7. Bottom Civic Banner */}
        <CivicBanner>
          <Info />
          <Text variant="bodySmall" weight={600} color="#8c3d0b" style={{ margin: 0, fontSize: '12px', lineHeight: '1.45' }}>
            {t('civicBannerDesc')}
          </Text>
        </CivicBanner>
      </ScrollArea>
    </PageContainer>
  );
}
