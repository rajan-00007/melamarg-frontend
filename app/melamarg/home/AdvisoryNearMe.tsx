'use client';

import React from 'react';
import styled from 'styled-components';
import { Users, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { getHaversineDistance } from '@/context/types';
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

const EmptyAdvisoryCard = styled.div`
  border-radius: 1.25rem;
  padding: 1.5rem 1.25rem;
  box-sizing: border-box;
  background-color: #FAF8F5;
  border: 1px dashed #E5D0C0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.4rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
`;

export default function AdvisoryNearMe() {
  const router = useRouter();
  const { activeAdvisories, userGps, findZoneForCoordinate, routeNodes } = useUserTest();
  const { t } = useLanguage();

  // Find active zone dynamically based on GPS coordinates
  const currentZone = React.useMemo(() => {
    if (!userGps || userGps[0] === 0 || !findZoneForCoordinate) return null;
    return findZoneForCoordinate(userGps[0], userGps[1]);
  }, [userGps, findZoneForCoordinate]);

  // Combine dynamic server advisories and filter by near-me coordinates
  const advisories = React.useMemo(() => {
    const list: any[] = [];
    const hasGps = userGps && userGps[0] !== 0;

    if (activeAdvisories && activeAdvisories.length > 0) {
      // Filter for road-type advisories only
      const roadAdvisories = activeAdvisories.filter((adv: any) => 
        adv.is_active && 
        adv.advisory_type === 'road'
      );

      roadAdvisories.forEach((adv: any, index: number) => {
        let advLat = 0;
        let advLng = 0;

        // Resolve coordinates from start or end node
        if (routeNodes && routeNodes.length > 0) {
          const startNode = routeNodes.find(n => n.id === adv.start_node_id);
          if (startNode) {
            advLat = Number(startNode.latitude);
            advLng = Number(startNode.longitude);
          } else {
            const endNode = routeNodes.find(n => n.id === adv.end_node_id);
            if (endNode) {
              advLat = Number(endNode.latitude);
              advLng = Number(endNode.longitude);
            }
          }
        }

        // Fallback to coordinates directly on the advisory
        if (advLat === 0 && adv.latitude && adv.longitude) {
          advLat = Number(adv.latitude);
          advLng = Number(adv.longitude);
        }

        const isEmergency = adv.is_emergency || adv.isEmergency;
        const baseAdvisory = {
          id: adv.id || `dyn-${index}`,
          title: adv.title || (isEmergency ? 'Critical Alert' : 'Advisory Update'),
          location: adv.subtitle || 'Near Me',
          message: adv.message || '',
          type: isEmergency ? 'warning' : 'info',
        };

        if (hasGps && advLat !== 0 && advLng !== 0) {
          const distance = getHaversineDistance(userGps[0], userGps[1], advLat, advLng);
          list.push({
            ...baseAdvisory,
            location: adv.subtitle || `${Math.round(distance)}m away`,
            distance
          });
        } else {
          // If no GPS or no coordinates, still show it as fallback to ensure visibility
          list.push({
            ...baseAdvisory,
            distance: Infinity
          });
        }
      });

      // Sort by distance (closest first)
      list.sort((a, b) => a.distance - b.distance);
    }
    return list;
  }, [activeAdvisories, userGps, routeNodes]);

  const handleCardClick = () => {
    router.push('/melamarg/alerts');
  };

  return (
    <SectionWrapper>
      <Text
        variant="bodyPrimary"
        weight={700}
        color={colors.neutral[900]}
        style={{ letterSpacing: '0.05em', fontSize: '15px', textTransform: 'uppercase', paddingLeft: '0.25rem', marginBottom: '0.15rem' }}
      >
        {t('advisoryNearMe')}
      </Text>
      
      {advisories.length === 0 ? (
        <EmptyAdvisoryCard>
          <span style={{ fontSize: '22px', marginBottom: '0.2rem' }}>🔔</span>
          <Text
            variant="bodyPrimary"
            weight={600}
            color={colors.neutral[900]}
            style={{ margin: 0, fontSize: '14.5px' }}
          >
            {(t as any)('noAdvisoriesNearMe') || 'No Advisories Near You'}
          </Text>
          <Text
            variant="caption"
            weight={500}
            color={colors.neutral[800]}
            style={{ fontSize: '11.5px', opacity: 0.7, maxWidth: '280px', lineHeight: '1.3' }}
          >
            {(t as any)('noAdvisoriesNearMeDesc') || 'All routes around you are currently clear. Check back later for updates.'}
          </Text>
        </EmptyAdvisoryCard>
      ) : (
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
      )}
    </SectionWrapper>
  );
}
