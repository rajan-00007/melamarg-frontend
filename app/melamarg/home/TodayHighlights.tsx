'use client';

import React from 'react';
import styled from 'styled-components';
import { Calendar } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useUserTest } from '@/context/UserTestContext';
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
  gap: 0.85rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  scroll-snap-type: x mandatory;
  width: 100%;
  box-sizing: border-box;
  padding: 0.1rem 0;
`;

const HighlightCard = styled.div`
  flex: 0 0 65%;
  scroll-snap-align: start;
  background-color: white;
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  border: 1px solid #F1E5D5;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 140px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TimePill = styled.span`
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  background-color: #E65100;
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  line-height: 1.2;
`;

const TextBlock = styled.div`
  padding: 0.75rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const EmptyStateCard = styled.div`
  background-color: #FFFFFF;
  border-radius: 1.25rem;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 1px dashed #EEF2F6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  width: 100%;
  box-sizing: border-box;
`;

const IconCircle = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.neutral[700]};
  margin-bottom: 0.25rem;
  border: 1px solid #F1F5F9;
`;

export default function TodayHighlights() {
  const { t } = useLanguage();
  const { highlightsList } = useUserTest();

  const FALLBACK_BANNERS = React.useMemo(() => [
    '/rathyatra_banner2.png',
    '/rathyatra_banner3.png',
    '/rathyatra_banner.png'
  ], []);

  // Compute today's date YYYY-MM-DD in local time
  const todayStr = React.useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  // Filter highlights whose date is today or later (upcoming highlights)
  const activeHighlights = React.useMemo(() => {
    if (!highlightsList || highlightsList.length === 0) return [];
    return highlightsList.filter((item: any) => {
      const datePart = item.highlight_date ? item.highlight_date.split('T')[0] : '';
      return datePart >= todayStr;
    });
  }, [highlightsList, todayStr]);

  return (
    <SectionWrapper>
      <Text
        variant="bodyPrimary"
        weight={700}
        color={colors.neutral[900]}
        style={{ letterSpacing: '0.05em', fontSize: '15px', textTransform: 'uppercase', paddingLeft: '0.25rem', marginBottom: '0.15rem' }}
      >
        {t('todayHighlights')}
      </Text>

      {activeHighlights.length > 0 ? (
        <ScrollContainer>
          {activeHighlights.map((item, idx) => {
            const fallbackImg = FALLBACK_BANNERS[idx % FALLBACK_BANNERS.length];
            const imgUrl = item.image_url || fallbackImg;

            return (
              <HighlightCard key={item.id}>
                <ImageContainer>
                  <CardImage 
                    src={imgUrl} 
                    alt={item.title} 
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = fallbackImg;
                    }}
                  />
                  {item.time && <TimePill>{item.time}</TimePill>}
                </ImageContainer>
                <TextBlock>
                  <Text
                    variant="bodyPrimary"
                    weight={600}
                    color={colors.neutral[900]}
                    style={{ fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {item.title}
                  </Text>
                  {item.location && (
                    <Text
                      variant="caption"
                      weight={500}
                      color={colors.neutral[800]}
                      style={{ fontSize: '11px', opacity: 0.6 }}
                    >
                      {item.location}
                    </Text>
                  )}
                </TextBlock>
              </HighlightCard>
            );
          })}
        </ScrollContainer>
      ) : (
        <EmptyStateCard>
          <IconCircle>
            <Calendar size={20} />
          </IconCircle>
          <Text
            variant="bodySecondary"
            weight={600}
            color={colors.neutral[900]}
            style={{ fontSize: '14px', margin: 0 }}
          >
            {t('noUpcomingSubEvents')}
          </Text>
          <Text
            variant="caption"
            weight={500}
            color={colors.neutral[700]}
            style={{ fontSize: '11.5px', opacity: 0.8, margin: 0 }}
          >
            {t('checkBackLater')}
          </Text>
        </EmptyStateCard>
      )}
    </SectionWrapper>
  );
}
