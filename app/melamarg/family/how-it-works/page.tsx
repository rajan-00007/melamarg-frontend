'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Info, Group, Share2, Compass, Heart } from 'lucide-react';
import Text from '@/components/style/text/Text';
import { colors } from '@/components/style/colors';
import { StyledButton } from '@/components/style/button/Button.Styled';
import {
  FamilyContainer,
  ScrollArea,
  ScreenHeader,
  BackButtonWrapper,
  InfoCard,
  TutorialStepList,
  TutorialStepItem,
  StepNumber,
  StepContent
} from '../family.styled';
import { useLanguage } from '@/context/LanguageContext';

export default function HowGroupsWork() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <FamilyContainer>
      <ScrollArea>
        {/* Back Button */}
        <BackButtonWrapper onClick={() => router.push('/melamarg/family')}>
          <ChevronLeft size={20} />
          <Text variant="bodySmall" weight={600} color={colors.neutral[800]} style={{ fontSize: '14px' }}>
            Back
          </Text>
        </BackButtonWrapper>

        {/* Header */}
        <ScreenHeader>
          <Text variant="pageTitle" weight={700} color={colors.neutral[900]} style={{ fontSize: '22px' }}>
            {t('howGroupsWork' as any) || 'How Groups Work'}
          </Text>
        </ScreenHeader>

        {/* Informational Warning Block */}
        <InfoCard style={{ backgroundColor: 'rgba(2, 136, 209, 0.04)', borderColor: colors.neutral[500] }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Info size={20} color={colors.neutral[800]} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
                Internet Connection Required
              </Text>
              <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ fontSize: '12.5px', lineHeight: '1.4' }}>
                Unlike offline map navigation, real-time location sharing requires an active mobile internet connection to transmit coordinates between family members.
              </Text>
            </div>
          </div>
        </InfoCard>

        {/* Steps List */}
        <TutorialStepList>
          {/* Step 1 */}
          <TutorialStepItem>
            <StepNumber>1</StepNumber>
            <StepContent>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                Create a Group
              </Text>
              <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ fontSize: '13px', lineHeight: '1.4' }}>
                Give your family group a name (e.g., "Daspalla Family"), enter your name, and set a secure 6-digit PIN to ensure your family's privacy.
              </Text>
            </StepContent>
          </TutorialStepItem>

          {/* Step 2 */}
          <TutorialStepItem>
            <StepNumber>2</StepNumber>
            <StepContent>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                Share the Code
              </Text>
              <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ fontSize: '13px', lineHeight: '1.4' }}>
                Your family can scan your unique group QR code or enter the 6-character Group Code manually to join your room instantly.
              </Text>
            </StepContent>
          </TutorialStepItem>

          {/* Step 3 */}
          <TutorialStepItem>
            <StepNumber>3</StepNumber>
            <StepContent>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                Stay Connected
              </Text>
              <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ fontSize: '13px', lineHeight: '1.4' }}>
                Once joined, view the real-time distance to each family member, locate them on the map, and navigate to the agreed assembly point together.
              </Text>
            </StepContent>
          </TutorialStepItem>
        </TutorialStepList>

        {/* Protection card illustration at bottom */}
        <div style={{ 
          marginTop: 'auto', 
          backgroundColor: 'rgba(230, 81, 0, 0.03)', 
          borderRadius: '12px', 
          padding: '1.25rem', 
          border: `1px solid ${colors.neutral[500]}`,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(230, 81, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Heart size={20} color={colors.brand.primary} />
          </div>
          <div>
            <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
              Protect Your Family
            </Text>
            <Text variant="bodyTiny" weight={500} color={colors.neutral[800]} style={{ fontSize: '12px' }}>
              Stay safe and coordinated during the crowded festival.
            </Text>
          </div>
        </div>

        {/* Got It Button */}
        <StyledButton 
          variant="primary" 
          onClick={() => router.push('/melamarg/family')} 
          style={{ width: '100%', height: '44px', backgroundColor: colors.brand.primary, marginTop: '0.5rem' }}
        >
          <span>Got It</span>
        </StyledButton>
      </ScrollArea>
    </FamilyContainer>
  );
}
