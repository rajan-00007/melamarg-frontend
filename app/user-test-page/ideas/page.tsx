'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Heart, Check } from 'lucide-react';
import { useUserTest } from '../context/UserTestContext';
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
  const { triggerToast } = useUserTest();
  
  const [rating, setRating] = useState<number>(0); // by default no heart selected
  const [thoughts, setThoughts] = useState<string>(''); // by default empty to show placeholder

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trigger toast indicating success
    triggerToast({
      id: `feedback-submit-${Date.now()}`,
      title: 'FEEDBACK RECEIVED',
      message: `Thank you for rating your experience (${rating}/5 stars). Your thoughts have been submitted.`,
      is_emergency: false
    });

    // Reset input fields
    setThoughts('');
    setRating(0);
    
    // Smooth redirect back to home route
    setTimeout(() => {
      router.push('/user-test-page/home');
    }, 1500);
  };

  return (
    <IdeasContainer>
      <IdeasHeader>
        <BackButton onClick={() => router.push('/user-test-page/home')}>
          <ChevronLeft size={20} strokeWidth={2.5} />
        </BackButton>
        <HeaderTitles>
          <HeaderTitle>Feedback</HeaderTitle>
          <HeaderSubtitle>Voice of Visitor</HeaderSubtitle>
        </HeaderTitles>
      </IdeasHeader>

      <FeedbackCard>
        <CardQuestion>How is your expo experience?</CardQuestion>

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

        <SectionLabel>Detailed Thoughts</SectionLabel>
        
        <ThoughtsTextArea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          placeholder="Share your experience or suggestions..."
        />

        <SubmitButton onClick={handleSubmit}>
          <Check />
          <span>Submit Feedback</span>
        </SubmitButton>
      </FeedbackCard>
    </IdeasContainer>
  );
}
