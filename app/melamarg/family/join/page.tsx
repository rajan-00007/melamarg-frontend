'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, HelpCircle, Lock, QrCode, AlertCircle } from 'lucide-react';
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
  const [cameraError, setCameraError] = useState<string | null>(null);

  const scannerRef = useRef<any>(null);

  // Auto-fill group details if passed in the URL (e.g., from deep links or QR scans)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCode = params.get('code');
      const urlPin = params.get('pin');
      if (urlCode) {
        setGroupCode(urlCode.toUpperCase());
      }
      if (urlPin && urlPin.length === 6) {
        setPinDigits(urlPin.split(''));
      }
    }
  }, []);

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

  const startScanning = async () => {
    setCameraError(null);
    setIsScanning(true);

    try {
      const { Html5Qrcode } = await import('html5-qrcode');

      // Small delay to ensure the DOM element #qr-reader is mounted and available
      setTimeout(async () => {
        try {
          const scanner = new Html5Qrcode('qr-reader');
          scannerRef.current = scanner;

          const config = {
            fps: 15,
            qrbox: (width: number, height: number) => {
              const size = Math.min(width, height) * 0.7;
              return { width: size, height: size };
            }
          };

          await scanner.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              let code = '';
              let pin = '';

              try {
                if (decodedText.startsWith('melamarg://')) {
                  const queryString = decodedText.split('?')[1];
                  const urlParams = new URLSearchParams(queryString);
                  code = urlParams.get('code') || '';
                  pin = urlParams.get('pin') || '';
                } else {
                  const url = new URL(decodedText);
                  code = url.searchParams.get('code') || '';
                  pin = url.searchParams.get('pin') || '';
                }
              } catch (e) {
                const urlParams = new URLSearchParams(decodedText);
                code = urlParams.get('code') || '';
                pin = urlParams.get('pin') || '';
              }

              if (code && pin && pin.length === 6) {
                setGroupCode(code.toUpperCase());
                setPinDigits(pin.split(''));

                // Stop scanner
                scanner.stop().then(() => {
                  scannerRef.current = null;
                }).catch(err => console.error(err));

                setIsScanning(false);

                // Haptic feedback
                if (typeof window !== 'undefined' && navigator.vibrate) {
                  navigator.vibrate([100]);
                }
              }
            },
            () => {
              // Ignore frame analysis errors
            }
          );
        } catch (err: any) {
          console.error('[Scanner] Failed to start:', err);
          setCameraError('Camera access denied or device has no camera. Please enter details manually.');
          setIsScanning(false);
          scannerRef.current = null;
        }
      }, 300);
    } catch (e) {
      console.error('[Scanner] Failed to load library:', e);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error('[Scanner] Error stopping camera:', err);
      } finally {
        scannerRef.current = null;
      }
    }
    setIsScanning(false);
  };

  // Component cleanup
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch((e: any) => console.error('[Scanner] Cleanup error:', e));
      }
    };
  }, []);

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

        {/* QR Code Scanner Card */}
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: '16px',
          border: `1.5px solid ${isScanning ? colors.brand.primary : colors.neutral[500]}`,
          aspectRatio: '1.4',
          overflow: 'hidden',
          backgroundColor: '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          margin: '0.25rem 0'
        }}>
          {isScanning ? (
            <>
              {/* QR Reader DOM Element container */}
              <div id="qr-reader" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Floating Cancel Button */}
              <StyledButton
                variant="secondary"
                onClick={stopScanning}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  zIndex: 10,
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  height: '32px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#ef4444',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                Cancel Scan
              </StyledButton>
            </>
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
                onClick={startScanning}
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

        {/* Camera Access Error Alert */}
        {cameraError && (
          <div style={{
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#b91c1c',
            fontSize: '12px',
            fontWeight: '600',
            margin: '0.5rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} />
            <span>{cameraError}</span>
          </div>
        )}

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
