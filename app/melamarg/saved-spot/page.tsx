'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, Trash2, MapPin, Navigation, ArrowLeft } from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { StyledButton } from '@/components/style/button/Button.Styled';
import SupportHeader from '@/components/SupportHeader';
import PhotoUpload from './PhotoUpload';
import InfoNotice from './InfoNotice';
import { useSavedSpotStore, SavedSpotData } from '../stores/savedSpotStore';
import { getHaversineDistance } from '@/context/types';
import {
  Container,
  ScrollContent,
  Card,
  CardHeader,
  FormGroup,
  Label,
  Input,
  CoordsRow,
  CoordBox,
  CoordsLabel,
  CoordValue,
  SavedPhotoWrapper,
  EmptyState,
  SpotList,
  SpotCard,
  SpotCardBody,
  SpotThumbnail,
  SpotInfo,
  SpotMetaRow,
  DistanceBadge
} from './page.styled';

export default function SavedSpotPage() {
  const router = useRouter();
  const { userGps, setNavTarget, triggerToast, setScreenMode, setArrivalNotify, logNavigationInstructions } = useUserTest();
  const { t } = useLanguage();

  const { savedSpots, addSpot, deleteSpot } = useSavedSpotStore();

  const [mounted, setMounted] = useState(false);
  const [spotName, setSpotName] = useState('My Spot 1');
  const [photo, setPhoto] = useState<string | null>(null);

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const spots = mounted ? savedSpots : [];

  // Update default spot name based on count
  useEffect(() => {
    if (mounted) {
      setSpotName(`My Spot ${spots.length + 1}`);
    }
  }, [mounted, spots.length]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim()) return;

    const newSpot: SavedSpotData = {
      id: `spot-${Date.now()}`,
      name: spotName.trim(),
      photo,
      latitude: userGps[0],
      longitude: userGps[1],
      timestamp: Date.now()
    };

    addSpot(newSpot);
    setPhoto(null);

    triggerToast({
      id: `spot-save-${Date.now()}`,
      title: t('spotSavedSuccess'),
      message: `"${spotName.trim()}" is now locked in offline storage.`,
      is_emergency: false
    });
  };

  const handleDelete = (id: string, name: string) => {
    deleteSpot(id);

    triggerToast({
      id: `spot-delete-${Date.now()}`,
      title: t('savedSpot'),
      message: `"${name}" has been deleted.`,
      is_emergency: false
    });
  };

  const handleNavigate = (spot: SavedSpotData) => {
    // Create a temporary POI structure for navigation target
    const targetPoi = {
      id: 'saved-spot-nav',
      name_en: spot.name,
      latitude: spot.latitude,
      longitude: spot.longitude,
      category_name: 'Saved Spot',
      description: 'Navigate back to your saved location'
    };

    setNavTarget(targetPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(targetPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/saved-spot');
  };

  return (
    <Container>
      {/* SupportHeader replacing standard image header */}
      <SupportHeader />

      <ScrollContent>
        {/* Back Button matching the style of other sub-pages */}
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <button
            onClick={() => router.push('/melamarg/home')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid #EEF2F6',
              borderRadius: '0.85rem',
              color: '#475569',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <Text
            variant="subSectionTitle"
            weight={800}
            color="#0F172A"
            style={{ margin: '0 0 0 1rem', fontSize: '16px', letterSpacing: '0.01em', textTransform: 'uppercase' }}
          >
            {t('saveMySpot')}
          </Text>
        </div>

        {/* SAVE NEW SPOT FORM VIEW */}
        <Card as="form" onSubmit={handleSave}>
          <CardHeader>
            <Text variant="sectionTitle" weight={800} color="#0F172A" style={{ margin: 0, fontSize: '20px', letterSpacing: '-0.01em' }}>
              Save Current Location
            </Text>
            <Text
              variant="bodyPrimary"
              weight={500}
              color="#475569"
              style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.4' }}
            >
              Record coordinates to easily navigate back later.
            </Text>
          </CardHeader>

          <CoordsRow>
            <CoordBox>
              <CoordsLabel>{t('latitude')}</CoordsLabel>
              <CoordValue>{userGps[0].toFixed(6)}</CoordValue>
            </CoordBox>
            <CoordBox>
              <CoordsLabel>{t('longitude')}</CoordsLabel>
              <CoordValue>{userGps[1].toFixed(6)}</CoordValue>
            </CoordBox>
          </CoordsRow>

          <FormGroup>
            <Label htmlFor="spot-name">{t('spotName')}</Label>
            <Input
              id="spot-name"
              type="text"
              value={spotName}
              onChange={(e) => setSpotName(e.target.value)}
              placeholder={t('spotNamePlaceholder')}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>{t('referencePhoto')}</Label>
            <PhotoUpload photo={photo} onChange={setPhoto} />
          </FormGroup>

          <StyledButton
            type="submit"
            bgColor={colors.brand.primary}
            textColor="#ffffff"
            height="46px"
            radius="2rem"
            width="100%"
            style={{ fontWeight: 700, gap: '0.5rem', marginTop: '0.25rem', boxShadow: '0 4px 14px rgba(230, 81, 0, 0.15)' }}
          >
            <Bookmark size={18} fill="#ffffff" />
            <Text variant="button" weight={800} color="#ffffff" style={{ margin: 0 }}>
              {t('saveThisSpot')}
            </Text>
          </StyledButton>
        </Card>

        {/* SAVED SPOTS LIST */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
          <Text variant="sectionTitle" weight={800} color="#0F172A" style={{ margin: '0 0 0.25rem 0', fontSize: '18px', letterSpacing: '-0.01em' }}>
            My Saved Locations
          </Text>

          {spots.length === 0 ? (
            <Card style={{ padding: '2.5rem 1.5rem', alignItems: 'center', textAlign: 'center' }}>
              <EmptyState style={{ padding: 0 }}>
                <Bookmark size={36} color="#94A3B8" />
                <Text variant="bodyPrimary" weight={700} color="#64748B" style={{ margin: '0.25rem 0 0 0' }}>
                  {t('noSavedSpot')}
                </Text>
                <Text variant="bodySmall" weight={500} color="#94A3B8" style={{ margin: 0, fontSize: '13px' }}>
                  {t('saveMySpotDesc')}
                </Text>
              </EmptyState>
            </Card>
          ) : (
            <SpotList>
              {spots.map((spot) => {
                const dist = getHaversineDistance(userGps[0], userGps[1], spot.latitude, spot.longitude);
                const distanceStr = dist < 1000 
                  ? `${Math.round(dist)} m` 
                  : `${(dist / 1000).toFixed(1)} km`;

                return (
                  <SpotCard key={spot.id}>
                    <SpotCardBody>
                      {spot.photo && (
                        <SpotThumbnail>
                          <img src={spot.photo} alt={spot.name} />
                        </SpotThumbnail>
                      )}
                      <SpotInfo>
                        <Text variant="bodyPrimary" weight={800} color="#1E293B" style={{ margin: 0, fontSize: '15px' }}>
                          {spot.name}
                        </Text>
                        <Text variant="bodyTiny" weight={600} color="#94A3B8" style={{ margin: '0.15rem 0' }}>
                          {new Date(spot.timestamp).toLocaleString()}
                        </Text>
                        <SpotMetaRow>
                          <DistanceBadge>
                            <MapPin size={10} fill="#E65100" />
                            <span>{distanceStr} away</span>
                          </DistanceBadge>
                        </SpotMetaRow>
                      </SpotInfo>
                    </SpotCardBody>

                    <div style={{ display: 'flex', gap: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                      <StyledButton
                        onClick={() => handleNavigate(spot)}
                        bgColor={colors.brand.primary}
                        textColor="#ffffff"
                        height="36px"
                        radius="0.5rem"
                        width="100%"
                        style={{ fontWeight: 700, gap: '0.25rem', fontSize: '12px' }}
                      >
                        <Navigation size={12} fill="#ffffff" />
                        <span>Navigate</span>
                      </StyledButton>

                      <StyledButton
                        onClick={() => handleDelete(spot.id, spot.name)}
                        bgColor="#F1F5F9"
                        textColor="#EF4444"
                        strokeColor="#E2E8F0"
                        height="36px"
                        radius="0.5rem"
                        width="100%"
                        style={{ fontWeight: 700, gap: '0.25rem', fontSize: '12px' }}
                      >
                        <Trash2 size={12} />
                        <span>{t('deleteSpot')}</span>
                      </StyledButton>
                    </div>
                  </SpotCard>
                );
              })}
            </SpotList>
          )}
        </div>

        {/* Info notice box at the bottom */}
        <InfoNotice />
      </ScrollContent>
    </Container>
  );
}
