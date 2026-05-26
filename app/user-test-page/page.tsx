'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from './context/UserTestContext';
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
  GlowIconBox,
  PulseCircle,
  BouncingDownloadIcon,
  ProgressWrapper,
  ProgressTextRow,
  ProgressBarBg,
  ProgressBarFill,
  DetailCard,
  DetailRow,
  DetailRowLabel,
  DetailCodeBlock,
  DatabaseBadge,
  DetailUrlBlock,
  EndpointLabel,
  VersionInfo,
  VersionLabel,
  VersionNumber,
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
                  const newUrl = prompt('Enter backend API server URL (e.g. http://192.168.1.100:5000):', backendUrl);
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
          <GlowIconBox>
            <PulseCircle />
            <BouncingDownloadIcon fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </BouncingDownloadIcon>
          </GlowIconBox>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#f4f4f5', margin: 0 }}>Downloading offline bundle</h3>
            <p style={{ fontSize: '12px', color: '#71717a', fontWeight: '700', margin: 0 }}>{selectedEvent.name}</p>
          </div>

          <ProgressWrapper>
            <ProgressTextRow>
              <span>MELAPACK DATA</span>
              <span>{downloadProgress}%</span>
            </ProgressTextRow>
            <ProgressBarBg>
              <ProgressBarFill progress={downloadProgress} />
            </ProgressBarBg>
          </ProgressWrapper>

          <DetailCard>
            <DetailRow>
              <DetailRowLabel>Actual Event ID</DetailRowLabel>
              <DetailCodeBlock>
                <span>{selectedEvent.id}</span>
                <DatabaseBadge>DATABASE</DatabaseBadge>
              </DetailCodeBlock>
            </DetailRow>

            <DetailRow>
              <DetailRowLabel>Actual Download URL</DetailRowLabel>
              <DetailUrlBlock>
                <EndpointLabel>Endpoint:</EndpointLabel>
                <span>
                  {selectedEvent.bundle_url || (selectedEvent.id.startsWith('mock-') 
                    ? `https://melamarg-s3-bucket.s3.amazonaws.com/bundles/${selectedEvent.id}.melapack` 
                    : `${backendUrl}/storage/bundles/${selectedEvent.id}/bundle.zip`
                  )}
                </span>
              </DetailUrlBlock>
            </DetailRow>

            {selectedEvent.bundle_version !== undefined && (
              <VersionInfo>
                <VersionLabel>Bundle Version:</VersionLabel>
                <VersionNumber>v{selectedEvent.bundle_version}</VersionNumber>
              </VersionInfo>
            )}
          </DetailCard>
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
