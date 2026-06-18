'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useUserTest } from '../context/UserTestContext';
import { getEventNavigatorName } from '../components/NavigatorHeader';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';

import {
  PageWrapper,
  OnboardingHeader,
  IndicatorDots,
  ActiveIndicatorBar,
  InactiveDot,
  IllustrationCard,
  TextContentGroup,
  LangGrid,
  LangOptionCard,
  ContinueButtonWrapper,
  CustomContinueButton
} from './page.styled';

function LanguageSelectorPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/melamarg';

  const { selectedEvent } = useUserTest();
  const { language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<typeof language>(language || 'en');

  const handleContinue = () => {
    // Commit selection to context and localstorage
    setLanguage(selectedLang);
    // Redirect
    router.push(returnUrl);
  };

  const appTitle = selectedEvent ? getEventNavigatorName(selectedEvent.name) : 'Ratha Navigator';

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'or', label: 'ଓଡ଼ିଆ' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'bn', label: 'বাংলা' }
  ];

  return (
    <PageWrapper>
      {/* Onboarding Header */}
      <OnboardingHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E65100" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <Text variant="bodyPrimary" weight={800} color={colors.brand.primary} style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', letterSpacing: '0.01em', margin: 0 }}>
            {appTitle}
          </Text>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.5rem', backgroundColor: '#EEF2F6', borderRadius: '6px', fontSize: '9px', fontWeight: '800', color: '#475569' }}>
          {selectedLang.toUpperCase()}
        </div>
      </OnboardingHeader>

      {/* Step Setup Indicator */}
      <IndicatorDots>
        <ActiveIndicatorBar />
        <InactiveDot />
        <InactiveDot />
      </IndicatorDots>

      {/* SVG Illustration Card */}
      <IllustrationCard>
        <svg viewBox="0 0 200 160" width="100%" height="100%" fill="none">
          {/* Decorative background sun circles */}
          <circle cx="100" cy="80" r="55" fill="rgba(255, 255, 255, 0.12)" />
          <circle cx="100" cy="80" r="38" fill="rgba(255, 255, 255, 0.08)" />

          {/* Temple Spire Outline */}
          <path d="M100 15 L118 65 L108 65 L114 90 L100 90 Z" fill="#FFFFFF" opacity="0.95" />
          <path d="M100 15 L82 65 L92 65 L86 90 L100 90 Z" fill="rgba(255, 255, 255, 0.8)" />
          <rect x="98" y="90" width="4" height="25" fill="#FFFFFF" />

          {/* Stylized Chariot Wheel Outline */}
          <circle cx="100" cy="100" r="28" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeDasharray="4 2" />

          {/* Folded Hands Silhouette (Namaste greeting) */}
          <path d="M92 135 L100 110 L108 135 Z" fill="#FFFFFF" />
          <path d="M97 135 L100 112 L103 135 Z" fill="#FCF2E7" opacity="0.4" />
          <path d="M85 138 C85 132, 115 132, 115 138 Z" fill="#FFFFFF" opacity="0.6" />
        </svg>
      </IllustrationCard>

      {/* Typography Headers */}
      <TextContentGroup>
        <Text variant="sectionTitle" weight={800} color={colors.neutral[900]} style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', fontSize: '23px', margin: 0 }}>
          Choose your language
        </Text>
        <Text variant="bodySecondary" weight={500} color={colors.neutral[800]} style={{ margin: 0, fontSize: '13.5px', lineHeight: 1.5, opacity: 0.8 }}>
          Navigate the spiritual heart of Odisha in the language you are most comfortable with.
        </Text>
      </TextContentGroup>

      {/* Selection Grid */}
      <LangGrid>
        {languages.map((lang) => (
          <LangOptionCard
            key={lang.code}
            $isActive={selectedLang === lang.code}
            onClick={() => setSelectedLang(lang.code as any)}
          >
            {lang.label}
          </LangOptionCard>
        ))}
      </LangGrid>

      {/* Continue Action */}
      <ContinueButtonWrapper>
        <CustomContinueButton onClick={handleContinue}>
          <span>Continue</span>
          <ArrowRight />
        </CustomContinueButton>
      </ContinueButtonWrapper>
    </PageWrapper>
  );
}

export default function LanguageSelectorPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', color: '#6b7280' }}>
        Loading Language Selector...
      </div>
    }>
      <LanguageSelectorPageContent />
    </Suspense>
  );
}
