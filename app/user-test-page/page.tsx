'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from './context/UserTestContext';
import { Signal } from 'lucide-react';
import { colors } from '@/components/style/colors';
import Text from '@/components/style/text/Text';
import { getEventNavigatorName } from './components/NavigatorHeader';

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
    screenMode,
    downloadProgress,
    locationPermission,
    handleEventSelection,
    triggerExplicitRedownload,
    clearDownloadedCache,
    handleGrantPermission
  } = useUserTest();

  // Redirect to home if setup is fully complete
  useEffect(() => {
    if (selectedEvent && downloadedEventIds.includes(selectedEvent.id) && locationPermission === true) {
      router.push('/user-test-page/home');
    }
  }, [selectedEvent, downloadedEventIds, locationPermission, router]);

  return (
    <Wrapper>
      
      {/* VIEW: SELECT EVENT CATALOG */}
      {screenMode === 'selector' && (
        <SelectorContainer>
          <Header>
            <Title>MelaMarg</Title>
            <Subtitle>
              Download offline event maps, nodes, and points of interest to navigate dense crowd areas without cellular networks.
            </Subtitle>
          </Header>

          {downloadedEventIds.length > 0 && (
            <ClearCacheButton onClick={clearDownloadedCache}>
              <StyledTrash />
              <span>Clear Download Cache ({downloadedEventIds.length})</span>
            </ClearCacheButton>
          )}

          {apiError && (
            <AlertBox>
              <StyledAlertTriangle />
              <AlertTitle>Backend Unreachable</AlertTitle>
              <AlertText>
                Could not reach server at <span className="underline font-mono text-cyan-400">{backendUrl}</span>. {events.length > 0 ? 'Showing already downloaded offline maps.' : 'No downloaded offline maps found. Please check your connection.'}
              </AlertText>
              <ConfigureButton
                onClick={() => {
                  const newUrl = prompt('Enter backend API server URL (e.g. https://api-wp-events.infoviz.co):', backendUrl);
                  if (newUrl !== null) {
                    setBackendUrl(newUrl.trim());
                  }
                }}
              >
                Configure Server Endpoint
              </ConfigureButton>
            </AlertBox>
          )}

          {loadingEvents ? (
            <LoadingContainer>
              <Spinner />
              <LoadingText>Querying festival map catalogs...</LoadingText>
            </LoadingContainer>
          ) : (
            <EventList>
              {events.length === 0 ? (
                <EmptyState>
                  No downloaded offline maps found. Connect to the internet to download maps.
                </EmptyState>
              ) : (
                events.map((event: any) => {
                  const isDownloaded = downloadedEventIds.includes(event.id);
                  return (
                    <EventCard key={event.id} $isDownloaded={isDownloaded}>
                      <EventHeaderRow>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          <EventTitle>
                            <span>{event.name}</span>
                            {isDownloaded && (
                              <DownloadedBadge>
                                <StyledCheckCircle />
                                <span>Downloaded</span>
                              </DownloadedBadge>
                            )}
                          </EventTitle>
                          <EventDescription>
                            {event.description || 'Offline navigation, crowd sectors, and emergency POI zones.'}
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
                              <span>Open Offline Map</span>
                            </>
                          ) : (
                            <>
                              <DownloadButtonSvg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </DownloadButtonSvg>
                              <span>Download offline package</span>
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
              Initializing Offline Assets
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
                {selectedEvent ? getEventNavigatorName(selectedEvent.name) : 'Ratha Navigator'}
              </Text>
              <Text variant="bodySecondary" weight={600} color={colors.neutral[800]} style={{ margin: 0, fontSize: '15px', opacity: 0.85 }}>
                Find Help. Even Offline.
              </Text>
            </DownloadTextGroup>
          </div>

          <ProgressWrapper>
            <ProgressBarBg>
              <ProgressBarFill progress={downloadProgress} />
            </ProgressBarBg>
            <ConnectionStatusRow>
              <Signal />
              <span>Optimizing for low connectivity</span>
            </ConnectionStatusRow>
          </ProgressWrapper>

          <Text variant="bodySmall" weight={700} color={colors.neutral[700]} style={{ letterSpacing: '0.01em', opacity: 0.7 }}>
            Inspired by Puri. Built for Pilgrims.
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
            <PermissionTitle>Allow location tracking?</PermissionTitle>
            <PermissionText>
              MelaMarg requires precise GPS location to track your coordinates and calculate the correct compass bearings offline.
            </PermissionText>
          </div>

          <PermissionButtons>
            <AllowButton onClick={() => handleGrantPermission(true)}>
              Allow while using app
            </AllowButton>
            <DenyButton onClick={() => handleGrantPermission(false)}>
              Deny
            </DenyButton>
          </PermissionButtons>
        </PermissionContainer>
      )}

    </Wrapper>
  );
}
