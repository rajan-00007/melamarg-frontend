'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Lock } from 'lucide-react';
import Text from '@/components/style/text/Text';
import { colors } from '@/components/style/colors';
import { StyledButton } from '@/components/style/button/Button.Styled';
import { useFamily } from '@/context/FamilyContext';
import {
  FamilyContainer,
  ScrollArea,
  ScreenHeader,
  BackButtonWrapper,
  FormGroup,
  StyledInput,
  PinInputsRow,
  PinDigitBox
} from '../family.styled';

export default function CreateFamilyGroup() {
  const router = useRouter();
  const { createGroup, isLoading, error, clearError } = useFamily();

  const [groupName, setGroupName] = useState('');
  const [memberName, setMemberName] = useState('');
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);

  // Refs for each PIN input box to handle auto-focus shifting
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handlePinChange = (value: string, index: number) => {
    // Only allow single digit
    const digit = value.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newDigits = [...pinDigits];
    newDigits[index] = digit;
    setPinDigits(newDigits);

    // Auto-focus next input
    if (digit !== '' && index < 5) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Backspace: shift focus back
    if (e.key === 'Backspace' && pinDigits[index] === '' && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const pin = pinDigits.join('');
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }
    if (pin.length < 6) {
      alert('Please enter a 6-digit PIN');
      return;
    }
    if (!memberName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      await createGroup(groupName.trim(), pin, memberName.trim());
      router.push('/melamarg/family');
    } catch (err) {
      // Error is handled in context and displayed below
      console.error(err);
    }
  };

  return (
    <FamilyContainer>
      <ScrollArea>
        {/* Back Button */}
        <BackButtonWrapper onClick={() => {
          clearError();
          router.push('/melamarg/family');
        }}>
          <ChevronLeft size={20} />
          <Text variant="bodySmall" weight={600} color={colors.neutral[800]} style={{ fontSize: '14px' }}>
            Back
          </Text>
        </BackButtonWrapper>

        {/* Header */}
        <ScreenHeader>
          <Text variant="pageTitle" weight={700} color={colors.neutral[900]} style={{ fontSize: '22px' }}>
            Create Family Group
          </Text>
          <Text variant="bodySecondary" weight={500} color={colors.neutral[800]} style={{ fontSize: '14px' }}>
            Stay connected with your loved ones during the festival.
          </Text>
        </ScreenHeader>

        {/* Create Group Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
          {/* Input 1: Group Name */}
          <FormGroup>
            <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
              Group Name
            </Text>
            <StyledInput
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="e.g., Daspalla Family"
              required
              maxLength={40}
            />
          </FormGroup>

          {/* Input 2: Set Group PIN */}
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Lock size={14} color={colors.brand.primary} />
              <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
                Set Group PIN
              </Text>
            </div>
            <Text variant="bodyTiny" weight={500} color={colors.neutral[800]} style={{ fontSize: '12px' }}>
              Required for new members to join your private group.
            </Text>

            {/* 6 Digit Box Row */}
            <PinInputsRow>
              {pinDigits.map((digit, index) => (
                <PinDigitBox
                  key={index}
                  ref={pinRefs[index]}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  required
                />
              ))}
            </PinInputsRow>
          </FormGroup>

          {/* Input 3: Your Name */}
          <FormGroup>
            <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
              Your Display Name
            </Text>
            <StyledInput
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g., Dad (Organizer)"
              required
              maxLength={25}
            />
          </FormGroup>

          {/* Error Message Display */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #fecaca', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Text variant="bodySmall" weight={500} color="#ef4444" style={{ fontSize: '13px' }}>
                {error}
              </Text>
            </div>
          )}

          {/* Submit Button */}
          <StyledButton
            variant="primary"
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', height: '44px', backgroundColor: colors.brand.primary, marginTop: '0.5rem' }}
          >
            <span>{isLoading ? 'Creating Group...' : 'Generate Group Code'}</span>
          </StyledButton>
        </form>
      </ScrollArea>
    </FamilyContainer>
  );
}
