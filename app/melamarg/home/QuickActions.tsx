'use client';

import React from 'react';
import styled from 'styled-components';
import { Users, MapPin, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import { StyledButton } from '@/components/style/button/Button.Styled';
import Text from '@/components/style/text/Text';

const SectionWrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 2rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  width: 100%;
  box-sizing: border-box;
`;

const FamilyCard = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.25rem;
  background-color: #FBF6EE; 
  border: 1px solid #F1E5D5;
  border-radius: 1.25rem;
  height: 140px;
  cursor: pointer;
  box-sizing: border-box;
  text-align: left;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const RightStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 140px;
`;

const MiniCard = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0 1rem;
  background-color: #FBF6EE; /* Warm beige card background */
  border: 1px solid #EAE0D5;
  border-radius: 1rem;
  cursor: pointer;
  box-sizing: border-box;
  text-align: left;
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.97);
  }
`;

const IconWrapper = styled.div<{ $bg: string; $color: string }>`
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.$bg};
  color: ${props => props.$color};
  flex-shrink: 0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    stroke-width: 2.5;
  }
`;

const LetterPIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 17V7h4.5a3 3 0 0 1 0 6H9" />
  </svg>
);

export default function QuickActions() {
  const router = useRouter();
  const { setActiveCategory } = useUserTest();
  const { t } = useLanguage();

  const handleBrowseCategories = () => {
    setActiveCategory('all');
    router.push('/melamarg/all-pois');
  };

  return (
    <SectionWrapper>
      <GridContainer>
        {/* Left Column: Family Meetup (Double Height) */}
        <FamilyCard onClick={() => router.push('/melamarg/saved')}>
          <IconWrapper $bg="transparent" $color="#E65100" style={{ padding: 0, justifyContent: 'flex-start', alignItems: 'flex-start' }}>
            <Users size={28} />
          </IconWrapper>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
            <Text
              variant="bodyPrimary"
              weight={600}
              color={colors.neutral[900]}
              style={{ fontSize: '14.5px', margin: 0 }}
            >
              {(t as any)('familyMeetup') || 'Family Meetup'}
            </Text>
            <Text
              variant="caption"
              weight={500}
              color={colors.neutral[800]}
              style={{ fontSize: '11px', opacity: 0.6 }}
            >
              {(t as any)('syncGroup') || 'Sync with your group'}
            </Text>
          </div>
        </FamilyCard>

        {/* Right Column: Stack of Save My Spot and Live Parking */}
        <RightStack>
          <MiniCard onClick={() => router.push('/melamarg/saved-spot')}>
            <IconWrapper $bg="transparent" $color="#E65100">
              <MapPin />
            </IconWrapper>
            <Text
              variant="bodyPrimary"
              weight={600}
              color={colors.neutral[900]}
              style={{ fontSize: '14.5px', margin: 0 }}
            >
              {(t as any)('saveMySpot') || 'Save My Spot'}
            </Text>
          </MiniCard>

          <MiniCard onClick={() => router.push('/melamarg/parking')}>
            <IconWrapper $bg="transparent" $color="#E65100">
              <LetterPIcon />
            </IconWrapper>
            <Text
              variant="bodyPrimary"
              weight={600}
              color={colors.neutral[900]}
              style={{ fontSize: '14.5px', margin: 0 }}
            >
              {(t as any)('liveParking') || 'Live Parking'}
            </Text>
          </MiniCard>
        </RightStack>
      </GridContainer>

      {/* Full-width Browse All Categories Button */}
      <StyledButton
        width="100%"
        height="46px"
        radius="1.25rem"
        bgColor={colors.base.white}
        textColor={colors.brand.primary}
        strokeColor={colors.brand.primary}
        onClick={handleBrowseCategories}
        style={{ marginTop: '0.5rem', borderWidth: '1.5px', borderStyle: 'solid' }}
      >
        <span style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {(t as any)('browseAllCategories') || 'Browse All Categories'}
          <ArrowRight size={16} strokeWidth={2.5} />
        </span>
      </StyledButton>
    </SectionWrapper>
  );
}
