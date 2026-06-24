'use client';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Car } from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
`;

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.65rem;
  width: 100%;
  box-sizing: border-box;
`;

const RuleCard = styled.div<{ $allowed: boolean }>`
  border-radius: 1rem;
  padding: 1rem 0.5rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  text-align: center;
  background-color: ${props => props.$allowed ? '#E8F5E9' : '#FFEBEE'};
  border: 1px solid ${props => props.$allowed ? '#C8E6C9' : '#FFCDD2'};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.01);
  min-height: 120px;
`;

const IconWrapper = styled.div<{ $allowed: boolean }>`
  color: ${props => props.$allowed ? '#1B5E20' : '#B71C1C'};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatusPill = styled.span<{ $allowed: boolean }>`
  background-color: ${props => props.$allowed ? '#1B5E20' : '#B71C1C'};
  color: #FFFFFF;
  font-size: 8.5px;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
`;

// Premium custom SVG icons to match UI reference perfectly
const PedestrianIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4" r="2" />
    <path d="M9 20l3-5 1-3-2-4-3 2" />
    <path d="M12 12l2 4 2 4" />
  </svg>
);

const ScooterIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="18" r="2.5" />
    <path d="M6 15.5h12" />
    <path d="M18 15.5V10h-2.5" />
    <path d="M9 7h2.5l2.5 8.5" />
  </svg>
);

export default function AccessRules() {
  const { userGps, findZoneForCoordinate } = useUserTest();
  const { t } = useLanguage();

  // Find active zone dynamically based on GPS coordinates
  const currentZone = useMemo(() => {
    if (!userGps || userGps[0] === 0 || !findZoneForCoordinate) return null;
    return findZoneForCoordinate(userGps[0], userGps[1]);
  }, [userGps, findZoneForCoordinate]);

  // Extract rules with fallbacks matching the UI spec
  const rules = useMemo(() => {
    const allowPedestrians = currentZone ? currentZone.allow_pedestrians !== false : true;
    const allow2Wheelers = currentZone ? currentZone.allow_2wheelers !== false : true;
    const allowCars = currentZone ? currentZone.allow_cars !== false : false;

    return [
      {
        id: 'pedestrians',
        label: (t as any)('pedestrians') || 'Pedestrians',
        allowed: allowPedestrians,
        icon: PedestrianIcon
      },
      {
        id: '2wheelers',
        label: (t as any)('twoWheelers') || '2-Wheelers',
        allowed: allow2Wheelers,
        icon: ScooterIcon
      },
      {
        id: 'cars',
        label: (t as any)('cars') || 'Cars',
        allowed: allowCars,
        icon: Car
      }
    ];
  }, [currentZone, t]);

  return (
    <SectionWrapper>
      <Text
        variant="bodyPrimary"
        weight={700}
        color={colors.neutral[900]}
        style={{ letterSpacing: '0.05em', fontSize: '15px', textTransform: 'uppercase', paddingLeft: '0.25rem', marginBottom: '0.15rem' }}
      >
        {t('currentAccessRules')}
      </Text>
      
      <RulesGrid>
        {rules.map((rule) => {
          const RuleIcon = rule.icon;
          return (
            <RuleCard key={rule.id} $allowed={rule.allowed}>
              <IconWrapper $allowed={rule.allowed}>
                <RuleIcon size={24} />
              </IconWrapper>
              
              <Text
                variant="bodyTiny"
                weight={600}
                color={rule.allowed ? '#1B5E20' : '#B71C1C'}
                style={{ fontSize: '11.5px', margin: 0 }}
              >
                {rule.label}
              </Text>
              
              <StatusPill $allowed={rule.allowed}>
                {rule.allowed ? ((t as any)('allowed') || 'ALLOWED') : ((t as any)('prohibited') || 'PROHIBITED')}
              </StatusPill>
            </RuleCard>
          );
        })}
      </RulesGrid>
    </SectionWrapper>
  );
}
