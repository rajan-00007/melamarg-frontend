'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, HelpCircle, Lock, QrCode } from 'lucide-react';
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
  PinDigitBox,
  InfoCard
} from '../family.styled';

export default function JoinFamilyGroup() {
  const router = useRouter();
  const { joinGroup, isLoading, error, clearError } = useFamily();

  const [groupCode, setGroupCode] = useState('');
  const [memberName, setMemberName] = useState('');
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [isScanning, setIsScanning] = useState(false);

  // Refs for auto-focus PIN digits
  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const handlePinChange = (value: string, index: number) => {
    const digit = value.slice(-1);
    if (!/^\d*$/.test(digit)) return;

    const newDigits = [...pinDigits];
    newDigits[index] = digit;
    setPinDigits(newDigits);

    if (digit !== '' && index < 5) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && pinDigits[index] === '' && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
  };

  // Simulate scanning a QR code (mock trigger for premium testing)
  const handleTriggerMockScan = async () => {
    setIsScanning(true);
    // Simulate a 1.5s camera focus and scan
    setTimeout(() => {
      // Mocks scanning a QR that contains Code: "DASP89" and PIN: "123456"
      setGroupCode('DASP89');
      setPinDigits(['1', '2', '3', '4', '5', '6']);
      setIsScanning(false);
      alert('QR Code Scanned Successfully!\nGroup Code: DASP89\nPIN: 123456\n\nPlease enter your name to join.');
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const pin = pinDigits.join('');
    const cleanedCode = groupCode.trim().toUpperCase();

    if (!cleanedCode) {
      alert('Please enter a group code');
      return;
    }
    if (pin.length < 6) {
      alert('Please enter the 6-digit PIN');
      return;
    }
    if (!memberName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      await joinGroup(cleanedCode, pin, memberName.trim());
      router.push('/melamarg/family');
    } catch (err) {
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
            Connect with Family
          </Text>
          <Text variant="bodySecondary" weight={500} color={colors.neutral[800]} style={{ fontSize: '14px' }}>
            Join your family's group to share live locations during the festival.
          </Text>
        </ScreenHeader>

        {/* QR Code Scanner Card (Visually premium mockup container) */}
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          border: `1.5px solid ${isScanning ? colors.brand.primary : colors.neutral[500]}`,
          aspectRatio: '1.4',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          margin: '0.25rem 0'
        }}>
          {isScanning ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: `3px solid rgba(230, 81, 0, 0.2)`,
                borderTopColor: colors.brand.primary,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
              <Text variant="bodySmall" weight={600} color={colors.base.white}>
                Scanning viewfinder...
              </Text>
            </div>
          ) : (
            <>
              {/* QR Target Frame Overlay */}
              <div style={{
                position: 'absolute',
                width: '140px',
                height: '140px',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                borderRadius: '12px'
              }} />
              <Camera size={36} color="rgba(255, 255, 255, 0.6)" style={{ zIndex: 2 }} />
              <StyledButton
                variant="primary"
                onClick={handleTriggerMockScan}
                style={{
                  zIndex: 2,
                  backgroundColor: colors.brand.primary,
                  height: '36px',
                  borderRadius: '20px',
                  fontSize: '13px'
                }}
              >
                <QrCode size={15} />
                <span>Scan QR Code</span>
              </StyledButton>
            </>
          )}
        </div>

        {/* Form separator */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '0.25rem 0' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.neutral[500] }} />
          <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ padding: '0 0.75rem', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Or Enter manually
          </Text>
          <div style={{ flex: 1, height: '1px', backgroundColor: colors.neutral[500] }} />
        </div>

        {/* Manual Join Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Input 1: Group Code */}
          <FormGroup>
            <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
              6-Character Group Code
            </Text>
            <StyledInput
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              placeholder="e.g., XY78MZ"
              required
              maxLength={6}
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontSize: '16px', letterSpacing: '0.1em' }}
            />
          </FormGroup>

          {/* Input 2: Group PIN */}
          <FormGroup>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Lock size={14} color={colors.brand.primary} />
              <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
                Enter 6-Digit PIN
              </Text>
            </div>

            {/* 6 Digit PIN Row */}
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

          {/* Input 3: Display Name */}
          <FormGroup>
            <Text variant="label" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
              Your Display Name
            </Text>
            <StyledInput
              type="text"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              placeholder="e.g., Mother"
              required
              maxLength={25}
            />
          </FormGroup>

          {/* Error display */}
          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #fecaca', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Text variant="bodySmall" weight={500} color="#ef4444" style={{ fontSize: '13px' }}>
                {error}
              </Text>
            </div>
          )}

          {/* Submit */}
          <StyledButton
            variant="primary"
            type="submit"
            disabled={isLoading}
            style={{ width: '100%', height: '44px', backgroundColor: colors.brand.primary, marginTop: '0.25rem' }}
          >
            <span>{isLoading ? 'Joining Group...' : 'Join Group'}</span>
          </StyledButton>
        </form>

        {/* Tip section */}
        <InfoCard style={{ border: 'none', backgroundColor: 'transparent', padding: '0.25rem 0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <HelpCircle size={14} color={colors.neutral[700]} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
            <div>
              <Text variant="bodyTiny" weight={500} color={colors.neutral[800]} style={{ fontSize: '11.5px', lineHeight: '1.4' }}>
                Where to find the code? Ask a family member who has already joined. They can tap the QR icon at the top of their meetup screen to show the Group QR or PIN.
              </Text>
            </div>
          </div>
        </InfoCard>
      </ScrollArea>
    </FamilyContainer>
  );
}
