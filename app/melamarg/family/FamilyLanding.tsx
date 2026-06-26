'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, ArrowRight, HelpCircle } from 'lucide-react';
import Text from '@/components/style/text/Text';
import { colors } from '@/components/style/colors';
import {
  FamilyContainer,
  ScrollArea,
  ScreenHeader,
  IntroImageWrapper,
  OptionGrid,
  OptionCard,
  IconCircle,
  InfoCard
} from './family.styled';
import { useLanguage } from '@/context/LanguageContext';

export default function FamilyLanding() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <FamilyContainer>
      <ScrollArea>
        {/* Header */}
        <ScreenHeader>
          <Text variant="pageTitle" weight={700} color={colors.neutral[900]} style={{ fontSize: '24px' }}>
            {t('familyMeetup') || 'Family Meetup'}
          </Text>
          <Text variant="bodySecondary" weight={500} color={colors.neutral[800]} style={{ fontSize: '14px' }}>
            {t('familyMeetupSubtitle' as any) || 'Stay connected with your loved ones amidst the festival crowds.'}
          </Text>
        </ScreenHeader>

        {/* Beautiful Map/Family illustration (Inline SVG for clean offline rendering) */}
        <IntroImageWrapper>
          <svg viewBox="0 0 320 240" width="100%" height="100%" fill="none" style={{ maxWidth: '280px' }}>
            {/* Background Map lines */}
            <path d="M20 120 C 80 120, 100 60, 160 60 C 220 60, 240 180, 300 180" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" strokeLinecap="round" />
            <path d="M40 40 C 120 40, 140 160, 200 160 C 260 160, 280 220, 300 220" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="3" strokeLinecap="round" />
            
            {/* Assembly point center (Temple) */}
            <g transform="translate(160, 100)">
              <circle cx="0" cy="0" r="36" fill="rgba(230, 81, 0, 0.2)" />
              <circle cx="0" cy="0" r="24" fill="rgba(230, 81, 0, 0.3)" />
              {/* Simple Temple Tower drawing */}
              <path d="M-10 12 L0 -15 L10 12 Z" fill="#E65100" />
              <path d="M-6 12 L0 -5 L6 12 Z" fill="#FFB74D" />
              <circle cx="0" cy="-18" r="3" fill="#FFE082" />
              <line x1="0" y1="-15" x2="0" y2="12" stroke="#E65100" strokeWidth="1" />
            </g>

            {/* Family Members connected via dotted lines */}
            {/* Member 1 (Dad) */}
            <g transform="translate(60, 70)">
              <circle cx="0" cy="0" r="20" fill="#455A64" stroke="#FFF" strokeWidth="2" />
              <text x="0" y="4" fill="#FFF" fontSize="10" fontWeight="600" textAnchor="middle">Dad</text>
              <line x1="16" y1="16" x2="72" y2="28" stroke="#E65100" strokeWidth="2" strokeDasharray="4,4" />
            </g>

            {/* Member 2 (Priya) */}
            <g transform="translate(250, 80)">
              <circle cx="0" cy="0" r="20" fill="#00695C" stroke="#FFF" strokeWidth="2" />
              <text x="0" y="4" fill="#FFF" fontSize="10" fontWeight="600" textAnchor="middle">Priya</text>
              <line x1="-16" y1="10" x2="-60" y2="16" stroke="#E65100" strokeWidth="2" strokeDasharray="4,4" />
            </g>

            {/* Member 3 (Me) */}
            <g transform="translate(130, 190)">
              <circle cx="0" cy="0" r="22" fill="#E65100" stroke="#FFF" strokeWidth="2.5" />
              <text x="0" y="5" fill="#FFF" fontSize="11" fontWeight="600" textAnchor="middle">Me</text>
              <line x1="16" y1="-16" x2="24" y2="-60" stroke="#E65100" strokeWidth="2" strokeDasharray="4,4" />
            </g>
          </svg>
        </IntroImageWrapper>

        {/* Options Grid */}
        <OptionGrid>
          <OptionCard onClick={() => router.push('/melamarg/family/create')}>
            <IconCircle $bgColor="rgba(230, 81, 0, 0.08)" $color={colors.brand.primary}>
              <Plus size={22} />
            </IconCircle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                {t('createGroup' as any) || 'Create Group'}
              </Text>
              <Text variant="bodyTiny" weight={500} color={colors.neutral[700]}>
                Start a family room
              </Text>
            </div>
          </OptionCard>

          <OptionCard onClick={() => router.push('/melamarg/family/join')}>
            <IconCircle $bgColor="rgba(69, 90, 100, 0.08)" $color={colors.brand.secondary}>
              <Users size={20} />
            </IconCircle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                {t('joinGroup' as any) || 'Join Group'}
              </Text>
              <Text variant="bodyTiny" weight={500} color={colors.neutral[700]}>
                Enter group code
              </Text>
            </div>
          </OptionCard>
        </OptionGrid>

        {/* How Groups Work Card */}
        <InfoCard>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => router.push('/melamarg/family/how-it-works')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <IconCircle $bgColor={colors.neutral[500_2]} $color={colors.neutral[800]} style={{ width: '36px', height: '36px' }}>
                <HelpCircle size={18} />
              </IconCircle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
                  {t('howGroupsWork' as any) || 'How Groups Work'}
                </Text>
                <Text variant="bodyTiny" weight={500} color={colors.neutral[700]}>
                  Learn how to stay connected
                </Text>
              </div>
            </div>
            <ArrowRight size={16} color={colors.neutral[700]} />
          </div>
        </InfoCard>
      </ScrollArea>
    </FamilyContainer>
  );
}
