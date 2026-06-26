'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';

const ZoneCard = styled.div`
  background-color: #FBF6EE; /* Warm, premium off-white/beige */
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  border: 1px solid #F1E5D5;
  box-sizing: border-box;
  width: 100%;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
`;

const StableBadge = styled.span<{ $severity?: string }>`
  background-color: ${props => {
    switch (props.$severity) {
      case 'critical': return '#FCE8E6';
      case 'congested': return '#FFF3E0';
      case 'warning': return '#FEF7E0';
      case 'stable': return '#E6F4EA';
      case 'general': return '#E8F0FE';
      default: return '#E6F4EA';
    }
  }};
  color: ${props => {
    switch (props.$severity) {
      case 'critical': return '#C5221F';
      case 'congested': return '#E65100';
      case 'warning': return '#B06000';
      case 'stable': return '#137333';
      case 'general': return '#1A73E8';
      default: return '#137333';
    }
  }};
  font-size: 10px;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 0.35rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  border: 1px solid ${props => {
    switch (props.$severity) {
      case 'critical': return '#FAD2CF';
      case 'congested': return '#FFE0B2';
      case 'warning': return '#FFE0B2';
      case 'stable': return '#CEEAD6';
      case 'general': return '#D2E3FC';
      default: return '#CEEAD6';
    }
  }};
  
  ${props => (props.$severity === 'critical' || props.$severity === 'congested') && `
    animation: pulseActive 2s infinite;
    @keyframes pulseActive {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
  `}
`;

const EmptyZoneCard = styled.div`
  background-color: #FAF8F5;
  border-radius: 1.25rem;
  padding: 1.5rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.01);
  border: 1px dashed #E5D0C0;
  box-sizing: border-box;
  width: 100%;
  gap: 0.4rem;
`;

export default function CurrentZoneBlock() {
  const { userGps, findZoneForCoordinate, activeAdvisories } = useUserTest();
  const { t } = useLanguage();

  // Find active zone dynamically based on GPS coordinates
  const currentZone = useMemo(() => {
    if (!userGps || userGps[0] === 0 || !findZoneForCoordinate) return null;
    return findZoneForCoordinate(userGps[0], userGps[1]);
  }, [userGps, findZoneForCoordinate]);

  // Find real-time active advisories for this zone
  const zoneAdvisories = useMemo(() => {
    if (!currentZone || !activeAdvisories) return [];
    return activeAdvisories.filter((adv: any) => 
      adv.is_active && 
      adv.advisory_type === 'zone' &&
      Array.isArray(adv.zoneIds) && 
      adv.zoneIds.includes(currentZone.id)
    );
  }, [currentZone, activeAdvisories]);

  const zoneName = currentZone?.name;
  
  // Find highest severity advisory
  const activeAlert = useMemo(() => {
    if (zoneAdvisories.length === 0) return null;
    
    const severityMap: Record<string, number> = {
      critical: 4,
      congested: 3,
      warning: 2,
      stable: 1,
      general: 0
    };
    
    const sorted = [...zoneAdvisories].sort((a, b) => {
      const scoreA = severityMap[a.status_tag || 'general'] || 0;
      const scoreB = severityMap[b.status_tag || 'general'] || 0;
      return scoreB - scoreA;
    });
    
    return sorted[0];
  }, [zoneAdvisories]);

  const hasAlerts = zoneAdvisories.length > 0;
  const alertTag = activeAlert?.status_tag || 'stable';
  
  const statusLabel = activeAlert 
    ? (alertTag === 'critical' ? 'CRITICAL' : alertTag === 'congested' ? 'CONGESTED' : alertTag === 'warning' ? 'WARNING' : alertTag === 'stable' ? 'STABLE' : 'ALERT')
    : 'STABLE';
    
  const statusSubtitle = activeAlert 
    ? activeAlert.title 
    : (currentZone?.crowd_status || 'Moderate Crowd');

  // Early return for empty zone state must be placed after all hook declarations to satisfy the Rules of Hooks
  if (!currentZone) {
    return (
      <EmptyZoneCard>
        <span style={{ fontSize: '22px', marginBottom: '0.2rem' }}>📍</span>
        <Text
          variant="bodyPrimary"
          weight={600}
          color={colors.brand.primary}
          style={{ margin: 0, fontSize: '15px' }}
        >
          {(t as any)('noZoneData') || 'No Zone Data Available'}
        </Text>
        <Text
          variant="caption"
          weight={500}
          color={colors.neutral[800]}
          style={{ fontSize: '11.5px', opacity: 0.7, maxWidth: '280px', lineHeight: '1.3' }}
        >
          {(t as any)('noZoneDataDesc') || 'You are currently outside designated event zones or GPS is disabled.'}
        </Text>
      </EmptyZoneCard>
    );
  }

  return (
    <ZoneCard>
      <LeftColumn>
        <Text
          variant="caption"
          weight={500}
          color={colors.neutral[800]}
          style={{ letterSpacing: '0.08em', opacity: 0.6, fontSize: '9.5px', textTransform: 'uppercase' }}
        >
          {(t as any)('currentZone') || 'CURRENT ZONE'}
        </Text>
        <Text
          variant="sectionTitle"
          weight={600}
          color={colors.brand.primary}
          style={{ margin: 0, fontSize: '20px', lineHeight: 1.2 }}
        >
          {zoneName}
        </Text>
      </LeftColumn>
      <RightColumn>
        <StableBadge $severity={alertTag}>
          {hasAlerts && <span style={{ fontSize: '9px' }}>⚠️</span>}
          {statusLabel}
        </StableBadge>
        <Text
          variant="caption"
          weight={500}
          color={colors.neutral[800]}
          style={{ fontSize: '12px', opacity: 0.8 }}
        >
          {statusSubtitle}
        </Text>
      </RightColumn>
    </ZoneCard>
  );
}
