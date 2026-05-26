'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest, POIItem } from '../context/UserTestContext';
import {
  AlertTriangle,
  Info,
  Bell
} from 'lucide-react';
import {
  AlertsContainer,
  HeaderRow,
  IconTextRow,
  HeaderTitle,
  CountBadge,
  VerifiedBadge,
  BadgeText,
  AlertsFeed,
  EmptyFeed,
  EmptyTitle,
  EmptySubtitle,
  AlertCard,
  AlertBody,
  AlertCategory,
  AlertMessage,
  AlertTime,
  AlertFooter,
  NavigateButton,
  DismissButton,
  StyledBellHeader,
  StyledAwardBadge,
  StyledBellEmpty,
  StyledCompassNav,
  StyledArrowRightNav
} from './page.styled';

export default function EventAlertsPage() {
  const router = useRouter();
  const {
    selectedEvent,
    notifications,
    dismissedNotificationIds,
    setDismissedNotificationIds,
    setNavTarget,
    setArrivalNotify,
    logNavigationInstructions,
    setScreenMode
  } = useUserTest();

  if (!selectedEvent) return null;

  const activeAlerts = notifications.filter(n => !dismissedNotificationIds.includes(n.id));

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diffMs = new Date().getTime() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <AlertsContainer>
      
      {/* Header: Official Alerts & Count */}
      <HeaderRow>
        <IconTextRow>
          <StyledBellHeader />
          <HeaderTitle>Official Alerts</HeaderTitle>
        </IconTextRow>
        {activeAlerts.length > 0 && (
          <CountBadge>{activeAlerts.length}</CountBadge>
        )}
      </HeaderRow>

      {/* Verified Administration Badge */}
      <VerifiedBadge>
        <StyledAwardBadge />
        <BadgeText>
          {selectedEvent.name} 
        </BadgeText>
      </VerifiedBadge>

      {/* Alerts Feed items */}
      <AlertsFeed>
        {activeAlerts.length === 0 ? (
          <EmptyFeed>
            <StyledBellEmpty />
            <div style={{ textAlign: 'center' }}>
              <EmptyTitle>All clear in this sector</EmptyTitle>
              <EmptySubtitle>No administrative safety broadcast alerts currently active.</EmptySubtitle>
            </div>
          </EmptyFeed>
        ) : (
          activeAlerts.map((alert) => {
            const isEmergency = alert.is_emergency;
            const isService = alert.title.toUpperCase().includes('SERVICE');
            const isAdvisory = alert.title.toUpperCase().includes('ADVISORY') || alert.title.toUpperCase().includes('CROWD');

            let leftBorderColor = '#ef4444';
            let TitleIcon = AlertTriangle;
            let alertColorTheme = '#f43f5e';
            let bgOverlay = 'rgba(239, 68, 68, 0.05)';
            let iconColor = '#ef4444';

            if (isService) {
              leftBorderColor = '#22c55e';
              TitleIcon = Info;
              alertColorTheme = '#34d399';
              bgOverlay = 'rgba(34, 197, 94, 0.05)';
              iconColor = '#22c55e';
            } else if (isAdvisory) {
              leftBorderColor = '#eab308';
              TitleIcon = AlertTriangle;
              alertColorTheme = '#fbbf24';
              bgOverlay = 'rgba(234, 179, 8, 0.05)';
              iconColor = '#eab308';
            } else if (!isEmergency) {
              leftBorderColor = '#6366f1';
              TitleIcon = Bell;
              alertColorTheme = '#818cf8';
              bgOverlay = 'rgba(99, 102, 241, 0.05)';
              iconColor = '#6366f1';
            }

            let actionText = 'Navigate route';
            if (alert.title.toUpperCase().includes('ROUTE')) {
              actionText = 'Navigate alternate';
            } else if (alert.title.toUpperCase().includes('WATER') || isService) {
              actionText = 'Find water nearby';
            } else if (alert.title.toUpperCase().includes('CROWD') || alert.title.toUpperCase().includes('GATE')) {
              actionText = 'East gate route';
            }

            return (
              <AlertCard
                key={alert.id}
                $leftBorderColor={leftBorderColor}
                $bgOverlay={bgOverlay}
              >
                <AlertBody>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <TitleIcon style={{ width: '0.875rem', height: '0.875rem', flexShrink: 0, color: iconColor }} />
                    <AlertCategory $color={alertColorTheme}>
                      {alert.title}
                    </AlertCategory>
                  </div>
                  
                  <AlertMessage>
                    {alert.message}
                  </AlertMessage>
                  
                  <AlertTime>
                    {getRelativeTime(alert.created_at)}
                  </AlertTime>
                </AlertBody>

                <AlertFooter>
                  {alert.latitude && alert.longitude ? (
                    <NavigateButton
                      onClick={() => {
                        const targetPoi: POIItem = {
                          id: `alert-poi-${alert.id}`,
                          name_en: alert.title,
                          latitude: Number(alert.latitude),
                          longitude: Number(alert.longitude),
                          category_name: 'Alert Target',
                          description: alert.message
                        };

                        setNavTarget(targetPoi);
                        setScreenMode('navigation');
                        setArrivalNotify(false);
                        logNavigationInstructions(targetPoi);
                        router.push('/user-test-page/map');
                      }}
                    >
                      <StyledCompassNav />
                      <span>{actionText}</span>
                      <StyledArrowRightNav className="arrow-right" />
                    </NavigateButton>
                  ) : (
                    <div />
                  )}

                  <DismissButton
                    onClick={() => {
                      setDismissedNotificationIds(prev => [...prev, alert.id]);
                    }}
                  >
                    Dismiss
                  </DismissButton>
                </AlertFooter>
              </AlertCard>
            );
          })
        )}
      </AlertsFeed>
    </AlertsContainer>
  );
}
