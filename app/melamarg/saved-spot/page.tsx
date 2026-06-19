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
  SavedPhotoWrapper
} from './page.styled';

export default function SavedSpotPage() {
  const router = useRouter();
  const { userGps, setNavTarget, triggerToast } = useUserTest();
  const { t } = useLanguage();

  const { savedSpot, saveSpot, deleteSpot } = useSavedSpotStore();

  const [mounted, setMounted] = useState(false);
  const [spotName, setSpotName] = useState('Bada Danda Gate');
  const [photo, setPhoto] = useState<string | null>(null);

  // Set mounted flag to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSpot = mounted ? savedSpot : null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName.trim()) return;

    const newSpot: SavedSpotData = {
      name: spotName.trim(),
      photo,
      latitude: userGps[0],
      longitude: userGps[1],
      timestamp: Date.now()
    };

    saveSpot(newSpot);

    triggerToast({
      id: `spot-save-${Date.now()}`,
      title: t('savedSpot'),
      message: t('spotSavedSuccess'),
      is_emergency: false
    });
  };

  const handleDelete = () => {
    deleteSpot();
    setSpotName('Bada Danda Gate');
    setPhoto(null);

    triggerToast({
      id: `spot-delete-${Date.now()}`,
      title: t('savedSpot'),
      message: t('noSavedSpot'),
      is_emergency: false
    });
  };

  const handleNavigate = () => {
    if (!activeSpot) return;

    // Create a temporary POI structure for navigation target
    const targetPoi = {
      id: 'saved-spot-nav',
      name_en: activeSpot.name,
      latitude: activeSpot.latitude,
      longitude: activeSpot.longitude,
      category_name: 'Saved Spot',
      description: 'Navigate back to your saved location'
    };

    setNavTarget(targetPoi);
    router.push('/melamarg/map');
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

        {activeSpot ? (
          /* SAVED SPOT DETAIL VIEW */
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin color={colors.brand.primary} size={20} />
                <Text variant="sectionTitle" weight={800} color="#1E293B" style={{ margin: 0, fontSize: '20px' }}>
                  {activeSpot.name}
                </Text>
              </div>
              <Text variant="bodySmall" weight={500} color="#64748B" style={{ margin: 0 }}>
                {new Date(activeSpot.timestamp).toLocaleString()}
              </Text>
            </CardHeader>

            {activeSpot.photo && (
              <SavedPhotoWrapper>
                <img src={activeSpot.photo} alt={activeSpot.name} />
              </SavedPhotoWrapper>
            )}

            <CoordsRow>
              <CoordBox>
                <CoordsLabel>{t('latitude')}</CoordsLabel>
                <CoordValue>{activeSpot.latitude.toFixed(6)}</CoordValue>
              </CoordBox>
              <CoordBox>
                <CoordsLabel>{t('longitude')}</CoordsLabel>
                <CoordValue>{activeSpot.longitude.toFixed(6)}</CoordValue>
              </CoordBox>
            </CoordsRow>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <StyledButton
                onClick={handleNavigate}
                bgColor={colors.brand.primary}
                textColor="#ffffff"
                height="48px"
                radius="2rem"
                width="100%"
                style={{ fontWeight: 700, gap: '0.5rem', boxShadow: '0 4px 14px rgba(230, 81, 0, 0.15)' }}
              >
                <Navigation size={18} fill="#ffffff" />
                <Text variant="button" weight={800} color="#ffffff" style={{ margin: 0 }}>
                  {t('navigateToSpot')}
                </Text>
              </StyledButton>

              <StyledButton
                onClick={handleDelete}
                bgColor="#F1F5F9"
                textColor="#EF4444"
                strokeColor="#E2E8F0"
                height="44px"
                radius="2rem"
                width="100%"
                style={{ fontWeight: 700, gap: '0.5rem' }}
              >
                <Trash2 size={16} />
                <span>{t('deleteSpot')}</span>
              </StyledButton>
            </div>
          </Card>
        ) : (
          /* SAVE NEW SPOT FORM VIEW (Mockup UI) */
          <Card as="form" onSubmit={handleSave}>
            <CardHeader>
              <Text variant="sectionTitle" weight={800} color="#0F172A" style={{ margin: 0, fontSize: '24px', letterSpacing: '-0.01em' }}>
                {t('saveMySpot')}
              </Text>
              <Text
                variant="bodyPrimary"
                weight={500}
                color="#475569"
                style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.5' }}
              >
                {t('saveMySpotDesc')}
              </Text>
            </CardHeader>

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
              height="50px"
              radius="2rem"
              width="100%"
              style={{ fontWeight: 700, gap: '0.5rem', marginTop: '0.5rem', boxShadow: '0 4px 14px rgba(230, 81, 0, 0.15)' }}
            >
              <Bookmark size={18} fill="#ffffff" />
              <Text variant="button" weight={800} color="#ffffff" style={{ margin: 0 }}>
                {t('saveThisSpot')}
              </Text>
            </StyledButton>
          </Card>
        )}

        {/* Info notice box at the bottom */}
        <InfoNotice />
      </ScrollContent>
    </Container>
  );
}
