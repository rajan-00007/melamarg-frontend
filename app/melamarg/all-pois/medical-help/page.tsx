'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../../context/UserTestContext';
import { useLanguage } from '../../context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { StyledButton } from '@/components/style/button/Button.Styled';
import {
  ArrowLeft, Clock, CheckCircle2, Bed, UserCheck, MapPin, Info, Heart, Droplets
} from 'lucide-react';
import { FaBriefcaseMedical } from 'react-icons/fa';
import { MdDirectionsWalk } from 'react-icons/md';
import { getHaversineDistance } from '../../context/types';

import {
  PageContainer, ScrollArea, HeaderRow, HeaderLeft, LangBadge,
  SubtitleRow, SubtitleItem,
  ServicesGrid, ServiceCard, ServiceIconBox, StretcherRowCard, StretcherIconBox, StretcherTextCol,
  InfoCard, InfoRow, InfoLabelGroup,
  NotesCard, NotesHeaderRow, EmergencyBanner,
  MapCard, StatusPill, MapGraphicWrapper, FloatingInfoBox, InfoBoxLeft, RoundedIconBadge
} from './page.styled';

export default function MedicalHelpDetailsPage() {
  const router = useRouter();
  const { selectedEvent, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions, poisList, userGps } = useUserTest();
  const { language, t, tPoiName, tPoiDesc } = useLanguage();

  if (!selectedEvent) return null;

  // Find nearest medical POI dynamically from backend if it exists
  const medicalPois = poisList.filter(p => 
    p.category_name.toLowerCase().includes('medical') || 
    p.category_name.toLowerCase().includes('firstaid') || 
    p.category_name.toLowerCase().includes('camp')
  );

  let nearestMedical = null;
  if (medicalPois.length > 0 && userGps && userGps[0] && userGps[1]) {
    nearestMedical = [...medicalPois].map(p => {
      const dist = getHaversineDistance(userGps[0], userGps[1], p.latitude, p.longitude);
      return { ...p, distance: dist };
    }).sort((a, b) => a.distance - b.distance)[0];
  }

  // Fallback details matching mockup
  const name = nearestMedical ? tPoiName(nearestMedical) : t('medicalCamp4');
  const description = nearestMedical ? tPoiDesc(nearestMedical) : t('locatedAshwaDwara');
  const lat = nearestMedical ? nearestMedical.latitude : 19.8055;
  const lng = nearestMedical ? nearestMedical.longitude : 85.8208;
  
  let distanceStr = `200 ${t('metersAway')}`;
  let walkMinutesStr = `4 ${t('minWalk')}`;
  if (nearestMedical) {
    const dist = nearestMedical.distance;
    distanceStr = dist >= 1000 ? `${(dist / 1000).toFixed(1)}km` : `${Math.round(dist)} ${t('metersAway')}`;
    
    const mins = Math.max(1, Math.round(dist / 80));
    walkMinutesStr = `${mins} ${t('minWalk')}`;
  }

  const handleStartWalking = () => {
    const targetPoi = nearestMedical || {
      id: 'medical-camp-4-poi',
      name_en: 'Medical Camp #4',
      latitude: lat,
      longitude: lng,
      category_name: 'medical',
      description: description
    };

    setNavTarget(targetPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(targetPoi);
    router.push('/melamarg/map');
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
            {t('medicalHelp')}
          </Text>
        </HeaderLeft>
        <LangBadge onClick={() => router.push(`/melamarg/language?returnUrl=/melamarg/all-pois/medical-help`)}>
          {language.toUpperCase()}
        </LangBadge>
      </HeaderRow>

      <ScrollArea>
        {/* 1. Map Banner Card */}
        <MapCard>
          <StatusPill>
            <span className="dot" />
            <span>{t('statusOpen247')}</span>
          </StatusPill>

          <MapGraphicWrapper>
            {/* Custom SVG Map matching the circular graphic style */}
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="85" fill="#fdfcf0" stroke="#FFFFFF" strokeWidth="4" />
              <clipPath id="circleClip">
                <circle cx="100" cy="100" r="85" />
              </clipPath>
              <g clipPath="url(#circleClip)">
                {/* Parks */}
                <rect x="15" y="25" width="65" height="45" rx="10" fill="#e2f3ec" />
                <rect x="130" y="65" width="80" height="90" rx="14" fill="#e2f3ec" />
                {/* River */}
                <path d="M 0,170 Q 50,150 110,170 T 200,160 L 200,200 L 0,200 Z" fill="#c3ebfc" />
                {/* Streets */}
                <path d="M -10,100 L 210,100" stroke="#FFFFFF" strokeWidth="12" />
                <path d="M 100,-10 L 100,210" stroke="#FFFFFF" strokeWidth="12" />
                <path d="M 40,-10 L 40,110" stroke="#FFFFFF" strokeWidth="8" />
                
                {/* Route Path (Red dashed line) */}
                <path d="M 100,140 Q 120,115 100,95 T 130,70" stroke="#00695c" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />

                {/* Map Pin (Red cross medical style) */}
                <g transform="translate(90, 80) scale(0.8)">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22S19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#dc2626" />
                  <circle cx="12" cy="9" r="3" fill="#FFFFFF" />
                </g>
              </g>
            </svg>
          </MapGraphicWrapper>

          <FloatingInfoBox>
            <InfoBoxLeft>
              <Text variant="bodyPrimary" weight={700} color={colors.brand.primary} style={{ fontSize: '15px', margin: 0 }}>
                {name}
              </Text>
              <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '11.5px', margin: 0 }}>
                {distanceStr} • {walkMinutesStr}
              </Text>
            </InfoBoxLeft>
            <RoundedIconBadge>
              <FaBriefcaseMedical />
            </RoundedIconBadge>
          </FloatingInfoBox>
        </MapCard>

        {/* 2. Status Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', textAlign: 'left' }}>
          <SubtitleRow>
            <SubtitleItem $color="#0d9488">
              <CheckCircle2 size={16} />
              <Text variant="bodyPrimary" weight={600} color="#0d9488" style={{ margin: 0 }}>
                {t('open')} - 24/7
              </Text>
            </SubtitleItem>

            <SubtitleItem>
              <Clock size={16} />
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[700]} style={{ margin: 0 }}>
                {t('currentWait10')}
              </Text>
            </SubtitleItem>
          </SubtitleRow>
        </div>

        {/* 3. Start Walking Button (Darker Orange Background) */}
        <StyledButton
          width="100%"
          height="48px"
          radius="12px"
          bgColor="#c2410c"
          textColor={colors.base.white}
          onClick={handleStartWalking}
        >
          <MdDirectionsWalk size={18} />
          <Text variant="button" weight={700} color={colors.base.white}>
            {t('startWalking')}
          </Text>
        </StyledButton>

        {/* 4. Services Available */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', margin: 0 }}>
            {t('servicesAvailable')}
          </Text>

          <ServicesGrid>
            <ServiceCard>
              <ServiceIconBox $bg="#fef2f2" $color="#dc2626">
                <FaBriefcaseMedical />
              </ServiceIconBox>
              <Text variant="bodySecondary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                {t('firstAid')}
              </Text>
            </ServiceCard>

            <ServiceCard>
              <ServiceIconBox $bg="#f0f9ff" $color="#0284c7">
                <Droplets />
              </ServiceIconBox>
              <Text variant="bodySecondary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                {t('hydration')}
              </Text>
            </ServiceCard>
          </ServicesGrid>

          <StretcherRowCard>
            <StretcherIconBox>
              <Bed />
            </StretcherIconBox>
            <StretcherTextCol>
              <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                {t('emergencyStretcher')}
              </Text>
              <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '11px', margin: 0 }}>
                {t('priorityTransport')}
              </Text>
            </StretcherTextCol>
          </StretcherRowCard>
        </div>

        {/* 5. Facility Info */}
        <InfoCard>
          <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', margin: 0 }}>
            {t('facilityInfo')}
          </Text>

          <InfoRow style={{ marginTop: '0.25rem' }}>
            <InfoLabelGroup>
              <Bed size={18} />
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[800]} style={{ margin: 0 }}>
                {t('totalPatientBeds')}
              </Text>
            </InfoLabelGroup>
            <Text variant="bodyPrimary" weight={700} color={colors.brand.primary} style={{ margin: 0 }}>
              15
            </Text>
          </InfoRow>

          <hr style={{ border: 0, borderTop: `1px solid ${colors.neutral[500]}`, margin: '0.15rem 0' }} />

          <InfoRow>
            <InfoLabelGroup>
              <UserCheck size={18} />
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[800]} style={{ margin: 0 }}>
                {t('doctorsOnSite')}
              </Text>
            </InfoLabelGroup>
            <Text variant="bodyPrimary" weight={700} color={colors.brand.primary} style={{ margin: 0 }}>
              3
            </Text>
          </InfoRow>
        </InfoCard>

        {/* 6. Location Notes (Text Notes Only, Map box removed) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'left', margin: 0 }}>
            {t('locationNotes')}
          </Text>

          <NotesCard>
            <NotesHeaderRow>
              <MapPin />
              <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                {t('nearSouthGate')}
              </Text>
            </NotesHeaderRow>

            <Text variant="bodySecondary" weight={600} color={colors.neutral[800]} style={{ fontSize: '12.5px', lineHeight: '1.45', margin: 0 }}>
              {description}
            </Text>
          </NotesCard>
        </div>

        {/* 7. Bottom Red Emergency Banner */}
        <EmergencyBanner>
          <Info />
          <Text variant="bodySmall" weight={600} color="#b91c1c" style={{ margin: 0, fontSize: '12px', lineHeight: '1.45' }}>
            {t('extremeEmergencyBanner')}
          </Text>
        </EmergencyBanner>
      </ScrollArea>
    </PageContainer>
  );
}
