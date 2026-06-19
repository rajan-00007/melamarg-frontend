'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import SupportHeader from '@/components/SupportHeader';
import {
  Search, ArrowLeft, ChevronRight as ChevronRightIcon, Wifi,
  Droplets, ShieldCheck, Utensils, RefreshCw, DoorOpen, HandHeart, Info
} from 'lucide-react';
import { FaBriefcaseMedical, FaToilet, FaHandsWash, FaShoePrints } from 'react-icons/fa';
import { MdLuggage, MdTempleBuddhist, MdInfoOutline } from 'react-icons/md';
import { GiCampfire, GiPrayer } from 'react-icons/gi';
import { BiBed } from 'react-icons/bi';
import { getHaversineDistance } from '@/context/types';

import {
  PageContainer, ScrollArea, SearchBar, SearchInput, TitleRow, SectionLabel,
  Grid2x2, GridCard, GridIconCircle,
  ListCard, ListIconBox, ListTextCol, ChevronRight,
  SyncBar, NoResultsContainer,
  SpiritualGrid, TallImageCard, ImageCardOverlay, SpiritualCard, SpiritualIconWrapper
} from './page.styled';

/* ── Static Data with Icons/Styling ── */
const essentialServices = [
  { id: 'medical', label: 'Medical', icon: FaBriefcaseMedical, iconBg: '#fef2f2', iconColor: '#dc2626' },
  { id: 'police', label: 'Police', icon: ShieldCheck, iconBg: '#f0fdf4', iconColor: '#16a34a' },
  { id: 'water', label: 'Water', icon: Droplets, iconBg: '#eff6ff', iconColor: '#2563eb' },
  { id: 'food', label: 'Food', icon: Utensils, iconBg: '#fef9ec', iconColor: '#d97706' },
];

const facilities = [
  { id: 'toilets', label: 'Toilets & Hygiene', sub: '24/7 accessible', icon: FaToilet, iconBg: '#f5f3ff', iconColor: '#7c3aed' },
  { id: 'sanitation', label: 'Sanitation Centers', sub: 'Waste disposal', icon: FaHandsWash, iconBg: '#ecfdf5', iconColor: '#059669' },
  { id: 'rest', label: 'Rest Areas', sub: 'Pilgrim shelters', icon: BiBed, iconBg: '#fff7ed', iconColor: '#ea580c' },
  { id: 'luggage', label: 'Luggage Cloakroom', sub: 'Safe storage', icon: MdLuggage, iconBg: '#f0f9ff', iconColor: '#0284c7' },
];

const spiritualList = [
  { id: 'shoes', label: 'Shoe Stands', sub: 'Token-based shoe storage', icon: FaShoePrints, iconBg: '#EEF2F6', iconColor: colors.neutral[800] },
];

export default function AllPoisPage() {
  const router = useRouter();
  const { selectedEvent, setActiveCategory, triggerToast, poisList, userGps } = useUserTest();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = React.useState('');

  const getServiceLabel = (id: string, defaultLabel: string) => {
    if (id === 'toilet' || id === 'toilets') return t('restroomsHygiene');
    if (id === 'police') return t('police');
    if (id === 'water') return t('drinkingWater');
    if (id === 'food') return t('foodCamps');
    if (id === 'sanitation') return t('sanitationCenters');
    if (id === 'rest') return t('restAreas');
    if (id === 'luggage') return t('luggageCloakroom');
    if (id === 'shoes') return t('shoeStands');
    if (id === 'temple') return t('templeGates');
    if (id === 'prasad') return t('prasadCounters');
    if (id === 'info') return t('infoCenters');
    return defaultLabel;
  };

  const getServiceSub = (id: string, defaultSub: string) => {
    if (id === 'toilets') return language === 'hi' ? '24/7 सुलभ' : language === 'or' ? '୨୪/୭ ସୁଗମ' : language === 'bn' ? '২৪/৭ অ্যাক্সেসযোগ্য' : defaultSub;
    if (id === 'sanitation') return language === 'hi' ? 'कचरा निपटान' : language === 'or' ? 'ବର୍ଜ୍ୟବସ୍ତୁ ନିଷ୍କାସନ' : language === 'bn' ? 'বর্জ্য অপসারণ' : defaultSub;
    if (id === 'rest') return language === 'hi' ? 'तीर्थयात्री आश्रय' : language === 'or' ? 'ତୀର୍ଥଯାତ୍ରୀ ଆଶ୍ରୟସ୍ଥଳୀ' : language === 'bn' ? 'তীর্থযাত্রী আশ্রয়স্থল' : defaultSub;
    if (id === 'luggage') return language === 'hi' ? 'सुरक्षित भंडारण' : language === 'or' ? 'ସୁରକ୍ଷିତ ସାଇତିବା ସ୍ଥାନ' : language === 'bn' ? 'নিরাপদ স্টোরেজ' : defaultSub;
    if (id === 'shoes') return language === 'hi' ? 'टोकन-आधारित जूता भंडारण' : language === 'or' ? 'ଟୋକନ୍-ଆଧାରିତ ଜୋତା ରଖିବା ସ୍ଥାନ' : language === 'bn' ? 'টোকেন-ভিত্তিক জুতো রাখার ব্যবস্থা' : defaultSub;
    return defaultSub;
  };

  if (!selectedEvent) return null;

  const handleCategoryTap = (id: string) => {
    if (id === 'medical') {
      router.push('/melamarg/all-pois/medical-help');
    } else {
      setActiveCategory(id);
      router.push('/melamarg/pois');
    }
  };

  const handleComingSoon = (label: string) => {
    triggerToast({ id: `poi-${label}-${Date.now()}`, title: label, message: `${label} navigation coming soon.`, is_emergency: false });
  };

  const handleFacilityTap = (id: string, label: string) => {
    if (id === 'sanitation') {
      router.push('/melamarg/all-pois/sanitation');
    } else {
      handleComingSoon(label);
    }
  };

  // Helper to compute category counts and nearest distance dynamically
  const getCategoryDetails = (id: string) => {
    let filtered = [];
    const query = id.toLowerCase();
    
    if (query === 'toilets') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('toilet'));
    } else if (query === 'water') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('water') || p.category_name.toLowerCase().includes('drinking'));
    } else if (query === 'medical') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('medical') || p.category_name.toLowerCase().includes('firstaid'));
    } else if (query === 'police') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('police') || p.category_name.toLowerCase().includes('post'));
    } else if (query === 'food') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('food') || p.category_name.toLowerCase().includes('camp') || p.category_name.toLowerCase().includes('langar'));
    } else if (query === 'sanitation') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('sanitation') || p.category_name.toLowerCase().includes('waste'));
    } else if (query === 'rest') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('rest') || p.category_name.toLowerCase().includes('shelter'));
    } else if (query === 'luggage') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('luggage') || p.category_name.toLowerCase().includes('cloak'));
    } else if (query === 'shoes') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('shoe') || p.category_name.toLowerCase().includes('stand'));
    } else if (query === 'temple') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('temple') || p.category_name.toLowerCase().includes('gate'));
    } else if (query === 'prasad') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('prasad') || p.category_name.toLowerCase().includes('counter'));
    } else if (query === 'info') {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes('info') || p.category_name.toLowerCase().includes('helpdesk'));
    } else {
      filtered = poisList.filter(p => p.category_name.toLowerCase().includes(query));
    }

    const count = filtered.length;

    let nearestStr = '';
    if (count > 0 && userGps && userGps[0] && userGps[1]) {
      let minDistance = Infinity;
      filtered.forEach(p => {
        const dist = getHaversineDistance(userGps[0], userGps[1], p.latitude, p.longitude);
        if (dist < minDistance) {
          minDistance = dist;
        }
      });
      if (minDistance !== Infinity) {
        if (minDistance >= 1000) {
          nearestStr = `${(minDistance / 1000).toFixed(1)}km`;
        } else {
          nearestStr = `${Math.round(minDistance)}m`;
        }
      }
    }

    const getSuffix = (catId: string) => {
      if (catId === 'toilets') return t('restrooms');
      if (catId === 'water') return t('drinkingWater');
      if (catId === 'medical') return t('medical');
      if (catId === 'police') return t('police');
      if (catId === 'food') return t('foodCamps');
      if (catId === 'sanitation') return t('sanitation');
      if (catId === 'rest') return t('restAreas');
      if (catId === 'luggage') return t('luggageCloakroom');
      if (catId === 'shoes') return t('shoeStands');
      return 'Units';
    };

    return {
      count,
      nearest: nearestStr ? `${t('nearest')} ${nearestStr}` : '',
      suffix: getSuffix(id)
    };
  };

  const query = searchQuery.trim().toLowerCase();

  const filteredEssential = essentialServices.filter(s =>
    s.label.toLowerCase().includes(query)
  );

  const filteredFacilities = facilities.filter(f =>
    f.label.toLowerCase().includes(query) || f.sub.toLowerCase().includes(query)
  );

  const showTempleGates = 'temple gates'.includes(query);
  const showPrasadCounters = 'prasad counters'.includes(query);
  const showInfoCenters = 'info centers'.includes(query);
  const showShoesStands = 'shoe stands'.includes(query) || 'token-based shoe storage'.includes(query);

  const hasMatches = (
    filteredEssential.length > 0 ||
    filteredFacilities.length > 0 ||
    showTempleGates ||
    showPrasadCounters ||
    showInfoCenters ||
    showShoesStands
  );

  return (
    <PageContainer>
      <SupportHeader />
      <ScrollArea>
        {/* Search */}
        <SearchBar>
          <Search />
          <SearchInput
            type="text"
            placeholder={t('searchCategories')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBar>

        {/* Title */}
        <TitleRow>
          <button onClick={() => router.back()}><ArrowLeft size={20} /></button>
          <Text variant="sectionTitle" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
            {t('allCategories')}
          </Text>
        </TitleRow>

        {!hasMatches && query !== '' ? (
          <NoResultsContainer>
            <Search />
            <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
              {t('noCategoriesFound')}
            </Text>
            <Text variant="bodySmall" weight={500} color={colors.neutral[700]} style={{ margin: 0 }}>
              {t('noCategoriesMatching')} "{searchQuery}".
            </Text>
          </NoResultsContainer>
        ) : (
          <>
            {/* ── ESSENTIAL SERVICES ── */}
            {filteredEssential.length > 0 && (
              <>
                <SectionLabel>
                  <Wifi size={14} strokeWidth={2.5} color={colors.brand.primary} />
                  <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '9.5px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                    {t('essentialServices')}
                  </Text>
                </SectionLabel>

                <Grid2x2>
                  {filteredEssential.map(s => {
                    const Icon = s.icon;
                    const details = getCategoryDetails(s.id);
                    return (
                      <GridCard key={s.id} onClick={() => handleCategoryTap(s.id)}>
                        <GridIconCircle $bg={s.iconBg} $color={s.iconColor}>
                          <Icon />
                        </GridIconCircle>
                        <Text variant="bodySecondary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                          {getServiceLabel(s.id, s.label)}
                        </Text>
                        <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '10px', margin: 0, textAlign: 'center' }}>
                          {details.count} {details.suffix} {details.nearest ? `• ${details.nearest}` : ''}
                        </Text>
                      </GridCard>
                    );
                  })}
                </Grid2x2>
              </>
            )}

            {/* ── FACILITIES ── */}
            {filteredFacilities.length > 0 && (
              <>
                <SectionLabel>
                  <GiCampfire size={14} color={colors.brand.primary} />
                  <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '9.5px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                    {t('facilities')}
                  </Text>
                </SectionLabel>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {filteredFacilities.map(f => {
                    const Icon = f.icon;
                    const details = getCategoryDetails(f.id);
                    return (
                      <ListCard key={f.id} onClick={() => handleFacilityTap(f.id, f.label)}>
                        <ListIconBox $bg={f.iconBg} $color={f.iconColor}>
                          <Icon />
                        </ListIconBox>
                        <ListTextCol>
                          <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                            {getServiceLabel(f.id, f.label)}
                          </Text>
                          <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '10.5px', margin: 0 }}>
                            {getServiceSub(f.id, f.sub)} • {details.count} {details.suffix} {details.nearest ? `• ${details.nearest}` : ''}
                          </Text>
                        </ListTextCol>
                        <ChevronRight><ChevronRightIcon /></ChevronRight>
                      </ListCard>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── SPIRITUAL & CULTURAL ── */}
            {(showTempleGates || showPrasadCounters || showInfoCenters || showShoesStands) && (
              <>
                <SectionLabel>
                  <MdTempleBuddhist size={14} color={colors.brand.primary} />
                  <Text variant="bodyTiny" weight={700} color={colors.brand.secondary} style={{ fontSize: '9.5px', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>
                    {t('spiritualCultural')}
                  </Text>
                </SectionLabel>

                {(showTempleGates || showPrasadCounters || showInfoCenters) && (
                  <SpiritualGrid>
                    {showTempleGates && (
                      <TallImageCard
                        onClick={() => handleComingSoon('Temple Gates')}
                        style={{ gridColumn: 1, gridRow: 'span 2' }}
                      >
                        <img src="/rathyatra_banner.png" alt="Temple Gates" />
                        <ImageCardOverlay />
                        <SpiritualIconWrapper $color={colors.base.white} style={{ position: 'relative', zIndex: 2, marginBottom: '0.5rem' }}>
                          <DoorOpen size={32} />
                        </SpiritualIconWrapper>
                        <Text variant="bodySecondary" weight={700} color={colors.base.white} style={{ position: 'relative', zIndex: 2, margin: 0 }}>
                          {t('templeGates')}
                        </Text>
                      </TallImageCard>
                    )}

                    {showPrasadCounters && (
                      <SpiritualCard
                        $bg={colors.brand.tertiary}
                        $color={colors.base.white}
                        onClick={() => handleComingSoon('Prasad Counters')}
                        style={{
                          gridColumn: showTempleGates ? 2 : 'span 2',
                          gridRow: 1
                        }}
                      >
                        <SpiritualIconWrapper $color={colors.base.white}>
                          <HandHeart size={32} />
                        </SpiritualIconWrapper>
                        <Text variant="bodySecondary" weight={700} color={colors.base.white} style={{ margin: 0, whiteSpace: 'pre-line', lineHeight: '1.2' }}>
                          {t('prasadCounters')}
                        </Text>
                      </SpiritualCard>
                    )}

                    {showInfoCenters && (
                      <SpiritualCard
                        $bg="#e5e5e0"
                        $color={colors.neutral[900]}
                        onClick={() => handleComingSoon('Info Centers')}
                        style={{
                          gridColumn: showTempleGates ? 2 : 'span 2',
                          gridRow: showPrasadCounters ? 2 : 1
                        }}
                      >
                        <SpiritualIconWrapper $color={colors.neutral[900]}>
                          <Info size={32} />
                        </SpiritualIconWrapper>
                        <Text variant="bodySecondary" weight={700} color={colors.neutral[900]} style={{ margin: 0, lineHeight: '1.2' }}>
                          {t('infoCenters')}
                        </Text>
                      </SpiritualCard>
                    )}
                  </SpiritualGrid>
                )}

                {showShoesStands && spiritualList.map(s => {
                  const Icon = s.icon;
                  const details = getCategoryDetails(s.id);
                  return (
                    <ListCard key={s.id} onClick={() => handleComingSoon(s.label)} style={{ marginTop: '0.85rem' }}>
                      <ListIconBox $bg={s.iconBg} $color={s.iconColor}>
                        <Icon />
                      </ListIconBox>
                      <ListTextCol>
                        <Text variant="bodyPrimary" weight={700} color={colors.neutral[900]} style={{ margin: 0 }}>
                          {getServiceLabel(s.id, s.label)}
                        </Text>
                        <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '10.5px', margin: 0 }}>
                          {getServiceSub(s.id, s.sub)} • {details.count} {details.suffix} {details.nearest ? `• ${details.nearest}` : ''}
                        </Text>
                      </ListTextCol>
                      <ChevronRight><ChevronRightIcon /></ChevronRight>
                    </ListCard>
                  );
                })}
              </>
            )}
          </>
        )}

        {/* ── Sync Status Footer ── */}
        <SyncBar>
          <RefreshCw />
          <div>
            <Text variant="bodySmall" weight={700} color="#15803d" style={{ margin: 0 }}>
              {t('mapUpdated')}
            </Text>
            <Text variant="bodyTiny" weight={600} color="#16a34a" style={{ fontSize: '10.5px', margin: 0, opacity: 0.85 }}>
              {t('offlineSync')}
            </Text>
          </div>
        </SyncBar>
      </ScrollArea>
    </PageContainer>
  );
}
