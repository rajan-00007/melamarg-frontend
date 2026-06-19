'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from './context/UserTestContext';
import { Signal } from 'lucide-react';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { getEventNavigatorName } from './components/NavigatorHeader';
import { useLanguage } from './context/LanguageContext';

import {
  Wrapper,
  SelectorContainer,
  Header,
  Title,
  Subtitle,
  ClearCacheButton,
  AlertBox,
  AlertTitle,
  AlertText,
  ConfigureButton,
  LoadingContainer,
  Spinner,
  LoadingText,
  EmptyState,
  EventList,
  EventCard,
  EventBannerImage,
  EventHeaderRow,
  EventTitle,
  DownloadedBadge,
  EventDescription,
  ActionsRow,
  DownloadOrOpenButton,
  RedownloadButton,
  DownloadingContainer,
  DownloadLogoCard,
  DownloadTextGroup,
  ProgressWrapper,
  ProgressBarBg,
  ProgressBarFill,
  ConnectionStatusRow,
  PermissionContainer,
  PermissionIconBox,
  PermissionTitle,
  PermissionText,
  PermissionButtons,
  AllowButton,
  DenyButton,
  StyledTrash,
  StyledAlertTriangle,
  StyledCheckCircle,
  StyledZap,
  StyledRefreshCw,
  DownloadButtonSvg,
  PermissionSvg
} from './page.styled';

export default function UserTestPage() {
  const router = useRouter();
  const {
    events,
    loadingEvents,
    downloadedEventIds,
    apiError,
    backendUrl,
    setBackendUrl,
    selectedEvent,
    setSelectedEvent,
    screenMode,
    setScreenMode,
    downloadProgress,
    locationPermission,
    handleEventSelection,
    triggerExplicitRedownload,
    clearDownloadedCache,
    handleGrantPermission
  } = useUserTest();

  const { t, tEventName, tEventDesc } = useLanguage();

  const getEventBannerImage = (event: any) => {
    let url = event.banner_url;
    if (url) {
      if (url.startsWith('/') && backendUrl) {
        return `${backendUrl.replace(/\/+$/, '')}${url}`;
      }
      return url;
    }
    // Default image based on name
    const name = event.name?.toLowerCase() || '';
    const id = event.id?.toLowerCase() || '';
    if (name.includes('bali') || id.includes('bali')) return '/baliyatra_banner.png';
    if (name.includes('kumbh') || id.includes('kumbh')) return '/kumbhmela_banner.png';
    return '/rathyatra_banner.png';
  };

  // Reset selected event and screen mode on mount to ensure we always show the selector first
  useEffect(() => {
    setSelectedEvent(null);
    setScreenMode('selector');

    // Prefetch all main sub-routes so their JS chunks are cached offline
    router.prefetch('/melamarg/home');
    router.prefetch('/melamarg/map');
    router.prefetch('/melamarg/all-pois');
    router.prefetch('/melamarg/alerts');
    router.prefetch('/melamarg/help');
    router.prefetch('/melamarg/ideas');
  }, [setSelectedEvent, setScreenMode, router]);

  // Redirect to home or returnUrl if setup is fully complete
  useEffect(() => {
    if (screenMode !== 'selector' && selectedEvent && downloadedEventIds.includes(selectedEvent.id) && locationPermission === true) {
      const params = new URLSearchParams(window.location.search);
      const returnUrl = params.get('returnUrl');
      router.push(returnUrl || '/melamarg/home');
    }
  }, [screenMode, selectedEvent, downloadedEventIds, locationPermission, router]);

  return (
    <Wrapper>
      
      {/* VIEW: SELECT EVENT CATALOG */}
      {screenMode === 'selector' && (
        <SelectorContainer>
          <Header>
            <Title>{t('melaMarg')}</Title>
            <Subtitle>
              {t('melaMargSubtitle')}
            </Subtitle>
          </Header>

          {downloadedEventIds.length > 0 && (
            <ClearCacheButton onClick={clearDownloadedCache}>
              <StyledTrash />
              <span>{t('clearCache')} ({downloadedEventIds.length})</span>
            </ClearCacheButton>
          )}

          {apiError && (
            <AlertBox>
              <StyledAlertTriangle />
              <AlertTitle>{t('backendUnreachable')}</AlertTitle>
              <AlertText>
                {t('couldNotReachServer')} at <span className="underline font-mono text-cyan-400">{backendUrl}</span>. {events.length > 0 ? t('noMapsCheckConnection') : t('noMapsCheckConnection')}
              </AlertText>
            </AlertBox>
          )}

          {loadingEvents ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>{t('queryingCatalogs')}</LoadingText>
            </LoadingContainer>
          ) : (
            <EventList>
              {events.length === 0 ? (
                <EmptyState>
                  {t('noMapsConnectInternet')}
                </EmptyState>
              ) : (
                events.map((event: any) => {
                  const isDownloaded = downloadedEventIds.includes(event.id);
                  return (
                    <EventCard key={event.id} $isDownloaded={isDownloaded}>
                      <EventBannerImage src={getEventBannerImage(event)} alt={tEventName(event)} />
                      <EventHeaderRow>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <EventTitle>
                            <span>{tEventName(event)}</span>
                            {isDownloaded && (
                              <DownloadedBadge>
                                <StyledCheckCircle />
                                <span>{t('downloaded')}</span>
                              </DownloadedBadge>
                            )}
                          </EventTitle>
                          <EventDescription>
                            {tEventDesc(event) || t('offlineDesc')}
                          </EventDescription>
                        </div>
                      </EventHeaderRow>

                      <ActionsRow>
                        <DownloadOrOpenButton
                          $isDownloaded={isDownloaded}
                          onClick={() => handleEventSelection(event)}
                        >
                          {isDownloaded ? (
                            <>
                              <StyledZap fill="currentColor" />
                              <span>{t('openOfflineMap')}</span>
                            </>
                          ) : (
                            <>
                              <DownloadButtonSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </DownloadButtonSvg>
                              <span>{t('downloadOfflinePackage')}</span>
                            </>
                          )}
                        </DownloadOrOpenButton>

                        {isDownloaded && (
                          <RedownloadButton
                            onClick={(e: React.MouseEvent) => triggerExplicitRedownload(event, e)}
                            title="Re-download bundle"
                          >
                            <StyledRefreshCw />
                          </RedownloadButton>
                        )}
                      </ActionsRow>
                    </EventCard>
                  );
                })
              )}
            </EventList>
          )}
        </SelectorContainer>
      )}

      {/* VIEW: DOWNLOAD PROGRESS SIMULATION */}
      {screenMode === 'downloading' && selectedEvent && (
        <DownloadingContainer>
          <div style={{ height: '1px' }} />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Text variant="bodySmall" weight={800} color={colors.neutral[800]} style={{ letterSpacing: '0.15em', opacity: 0.7, textTransform: 'uppercase' }}>
              {t('initializingAssets')}
            </Text>

            <DownloadLogoCard>
              <svg viewBox="0 0 100 100" width="100" height="100" fill="none" stroke={colors.brand.primary} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                {/* Outer Wheel Ring */}
                <circle cx="50" cy="50" r="40" strokeWidth="4.5" />
                <circle cx="50" cy="50" r="32" strokeWidth="1.5" />
                
                {/* Inner Hub */}
                <circle cx="50" cy="50" r="8" fill={colors.brand.primary} />
                <circle cx="50" cy="50" r="12" strokeWidth="2.5" />
                
                {/* Spokes (8 major spokes representing Dharmachakra) */}
                <line x1="50" y1="18" x2="50" y2="42" strokeWidth="3.5" />
                <line x1="50" y1="58" x2="50" y2="82" strokeWidth="3.5" />
                <line x1="18" y1="50" x2="42" y2="50" strokeWidth="3.5" />
                <line x1="58" y1="50" x2="82" y2="50" strokeWidth="3.5" />
                
                <line x1="27.5" y1="27.5" x2="44.5" y2="44.5" strokeWidth="3" />
                <line x1="55.5" y1="55.5" x2="72.5" y2="72.5" strokeWidth="3" />
                <line x1="72.5" y1="27.5" x2="55.5" y2="44.5" strokeWidth="3" />
                <line x1="44.5" y1="55.5" x2="27.5" y2="72.5" strokeWidth="3" />
              </svg>
            </DownloadLogoCard>

            <DownloadTextGroup>
              <Text variant="hero" weight={900} color={colors.brand.primary} style={{ fontFamily: '"Atkinson Hyperlegible Next", sans-serif', fontSize: '28px', margin: 0 }}>
                {selectedEvent ? getEventNavigatorName(tEventName(selectedEvent)) : 'Ratha Navigator'}
              </Text>
              <Text variant="bodySecondary" weight={600} color={colors.neutral[800]} style={{ margin: 0, fontSize: '15px', opacity: 0.85 }}>
                {t('findHelpOffline')}
              </Text>
            </DownloadTextGroup>
          </div>

          <ProgressWrapper>
            <ProgressBarBg>
              <ProgressBarFill progress={downloadProgress} />
            </ProgressBarBg>
            <ConnectionStatusRow>
              <Signal />
              <span>{t('optimizingConnectivity')}</span>
            </ConnectionStatusRow>
          </ProgressWrapper>

          <Text variant="bodySmall" weight={700} color={colors.neutral[700]} style={{ letterSpacing: '0.01em', opacity: 0.7 }}>
            {t('inspiredByPuri')}
          </Text>
        </DownloadingContainer>
      )}

      {/* VIEW: GEOLOCATION PERMISSION OPTION */}   
      {screenMode === 'permission' && selectedEvent && (
        <PermissionContainer>
          <PermissionIconBox>
            <PermissionSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </PermissionSvg>
          </PermissionIconBox>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <PermissionTitle>{t('allowLocationTracking')}</PermissionTitle>
            <PermissionText>
              {t('locationPermissionDesc')}
            </PermissionText>
          </div>

          <PermissionButtons>
            <AllowButton onClick={() => handleGrantPermission(true)}>
              {t('allowWhileUsing')}
            </AllowButton>
            <DenyButton onClick={() => handleGrantPermission(false)}>
              {t('deny')}
            </DenyButton>
          </PermissionButtons>
        </PermissionContainer>
      )}

    </Wrapper>
  );
}
