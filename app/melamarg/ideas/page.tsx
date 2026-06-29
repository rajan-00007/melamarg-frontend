'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Check } from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import axiosClient from '@/lib/axios/axiosClient';
import { API_ENDPOINTS } from '@/lib/axios/endpoints';
import { useFeedbackStore } from '@/app/melamarg/stores/feedbackStore';
import {
  IdeasContainer,
  IdeasHeader,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  FeedbackCard,
  CardQuestion,
  HeartsRowContainer,
  HeartButton,
  SectionLabel,
  ThoughtsTextArea,
  SubmitButton
} from './page.styled';

export default function IdeasPage() {
  const router = useRouter();
  const { triggerToast, selectedEvent, offlineMode } = useUserTest();
  const { t } = useLanguage();
  
  const [rating, setRating] = useState<number>(0); // by default no heart selected
  const [thoughts, setThoughts] = useState<string>(''); // by default empty to show placeholder

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      triggerToast({
        id: `feedback-error-${Date.now()}`,
        title: 'Rating Required',
        message: 'Please tap a heart rating before submitting.',
        is_emergency: false
      });
      return;
    }

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline || offlineMode) {
      // User is offline: save feedback locally in Zustand store
      useFeedbackStore.getState().addPendingFeedback({
        event_id: selectedEvent?.id || null,
        rating,
        thoughts
      });

      triggerToast({
        id: `feedback-offline-${Date.now()}`,
        title: t('savedOffline'),
        message: t('offlineFeedbackDesc'),
        is_emergency: false
      });

      // Reset input fields
      setThoughts('');
      setRating(0);

      // Redirect home
      setTimeout(() => {
        router.push('/melamarg/home');
      }, 1500);
      return;
    }
    
    try {
      const feedbackUrl = API_ENDPOINTS.feedback?.submit || '/feedback';
      await axiosClient.post(feedbackUrl, {
        event_id: selectedEvent?.id || null,
        rating,
        thoughts
      });

      // Trigger toast indicating success
      triggerToast({
        id: `feedback-submit-${Date.now()}`,
        title: t('feedbackReceived'),
        message: `${t('thankYouFeedback')} (${rating}/5)`,
        is_emergency: false
      });

      // Reset input fields
      setThoughts('');
      setRating(0);
      
      // Smooth redirect back to home route
      setTimeout(() => {
        router.push('/melamarg/home');
      }, 1500);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      triggerToast({
        id: `feedback-error-${Date.now()}`,
        title: 'Submission Failed',
        message: 'Could not send feedback. Please check your connection.',
        is_emergency: false
      });
    }
  };

  return (
    <IdeasContainer>
      <IdeasHeader>
        <BackButton onClick={() => router.push('/melamarg/home')}>
          <ChevronLeft size={20} strokeWidth={2.5} />
        </BackButton>
        <HeaderTitles>
          <HeaderTitle>{t('feedback')}</HeaderTitle>
          <HeaderSubtitle>{t('voiceOfVisitor')}</HeaderSubtitle>
        </HeaderTitles>
      </IdeasHeader>

      <FeedbackCard>
        <CardQuestion>{t('expoExperience')}</CardQuestion>

        <HeartsRowContainer>
          {[1, 2, 3, 4, 5].map((star) => (
            <HeartButton
              key={star}
              type="button"
              $active={star <= rating}
              onClick={() => setRating(star)}
            >
              <Heart fill={star <= rating ? '#ef4444' : 'none'} stroke={star <= rating ? '#ef4444' : '#cbd5e1'} />
            </HeartButton>
          ))}
        </HeartsRowContainer>

        <SectionLabel>{t('detailedThoughts')}</SectionLabel>
        
        <ThoughtsTextArea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder={t('feedbackPlaceholder')}
        />

        <SubmitButton onClick={handleSubmit}>
          <Check />
          <span>{t('submitFeedback')}</span>
        </SubmitButton>
      </FeedbackCard>
    </IdeasContainer>
  );
}
