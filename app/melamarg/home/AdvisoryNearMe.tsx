'use client';

import React from 'react';
import styled from 'styled-components';
import { Users, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 0.75rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  scroll-snap-type: x mandatory;
  width: 100%;
  box-sizing: border-box;
  padding: 0.1rem 0;
`;

const AdvisoryCard = styled.div<{ $type: string }>`
  flex: 0 0 82%;
  scroll-snap-align: start;
  border-radius: 1.25rem;
  padding: 1.25rem;
  box-sizing: border-box;
  background-color: ${props => props.$type === 'warning' ? '#FFF9E6' : '#EEF2F6'};
  border: 1px solid ${props => props.$type === 'warning' ? '#FCE8B2' : '#E5EAF0'};
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  cursor: pointer;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const IconContainer = styled.div<{ $type: string }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: ${props => props.$type === 'warning' ? '#FCF2E7' : '#CFE7FF'};
  color: ${props => props.$type === 'warning' ? '#E65100' : '#0340D1'};
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function AdvisoryNearMe() {
  const router = useRouter();
  const { activeAdvisories, userGps, findZoneForCoordinate } = useUserTest();
  const { t } = useLanguage();

  // Find active zone dynamically based on GPS coordinates
  const currentZone = React.useMemo(() => {
    if (!userGps || userGps[0] === 0 || !findZoneForCoordinate) return null;
    return findZoneForCoordinate(userGps[0], userGps[1]);
  }, [userGps, findZoneForCoordinate]);

  // Combine dynamic server advisories with premium mock alerts if empty
  const advisories = React.useMemo(() => {
    const list: any[] = [];
    if (activeAdvisories && activeAdvisories.length > 0) {
      // Filter for road-type advisories only
      const roadAdvisories = activeAdvisories.filter((adv: any) => 
        adv.is_active && 
        adv.advisory_type === 'road'
      );

      roadAdvisories.forEach((adv: any, index: number) => {
        const isEmergency = adv.is_emergency || adv.isEmergency;
        list.push({
          id: adv.id || `dyn-${index}`,
          title: adv.title || (isEmergency ? 'Critical Alert' : 'Advisory Update'),
          location: adv.subtitle || 'Near Me',
          message: adv.message || '',
          type: isEmergency ? 'warning' : 'info'
        });
      });
    }

    // Default mocks matching the UI design specs
    if (list.length === 0) {
      list.push(
        {
          id: 'mock-adv-1',
          title: 'Heavy Crowd',
          location: currentZone ? `${currentZone.name}` : 'Near North Gate (150m)',
          message: 'Congestion ahead. Use Temple Street for a clearer path or move 100m right to bypass the main gate.',
          type: 'warning'
        },
        {
          id: 'mock-adv-2',
          title: 'Traffic Advisory',
          location: currentZone ? `${currentZone.name}` : 'Bada Danda Area',
          message: 'Slow movement observed. Pedestrian pathways are fully functional, but vehicles are diverted.',
          type: 'info'
        }
      );
    }
    return list;
  }, [activeAdvisories, currentZone]);

  const handleCardClick = () => {
    router.push('/melamarg/alerts');
  };

  return (
    <SectionWrapper>
      <Text
        variant="caption"
        weight={500}
        color={colors.neutral[800]}
        style={{ letterSpacing: '0.08em', opacity: 0.6, fontSize: '9.5px', textTransform: 'uppercase', paddingLeft: '0.25rem' }}
      >
        {(t as any)('advisoryNearMe') || 'ADVISORY NEAR ME'}
      </Text>
      
      <ScrollContainer>
        {advisories.map((advisory) => {
          const CardIcon = advisory.type === 'warning' ? Users : AlertCircle;
          return (
            <AdvisoryCard
              key={advisory.id}
              $type={advisory.type}
              onClick={handleCardClick}
            >
              <HeaderRow>
                <IconContainer $type={advisory.type}>
                  <CardIcon size={20} />
                </IconContainer>
                <TextGroup>
                  <Text
                    variant="bodyPrimary"
                    weight={600}
                    color={colors.neutral[900]}
                    style={{ margin: 0, fontSize: '15px' }}
                  >
                    {advisory.title}
                  </Text>
                  <Text
                    variant="caption"
                    weight={500}
                    color={colors.neutral[800]}
                    style={{ fontSize: '11px', opacity: 0.7 }}
                  >
                    {advisory.location}
                  </Text>
                </TextGroup>
              </HeaderRow>
              <Text
                variant="bodySecondary"
                weight={500}
                color={colors.neutral[800]}
                style={{ fontSize: '13px', lineHeight: 1.4, margin: 0 }}
              >
                {advisory.message}
              </Text>
            </AdvisoryCard>
          );
        })}
      </ScrollContainer>
    </SectionWrapper>
  );
}
