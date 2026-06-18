'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest, POIItem } from '../context/UserTestContext';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  Compass
} from 'lucide-react';
import {
  AlertCard,
  CardHeaderRow,
  TypeBadge,
  IconBox,
  TypeLabel,
  TimeAgo,
  AlertTitle,
  AlertText,
  NavigateButton,
  DismissTextLink
} from './page.styled';

interface AlertFeedCardProps {
  alert: {
    id: string;
    title: string;
    message: string;
    created_at: string;
    is_emergency: boolean;
    category: 'CRITICAL' | 'WARNING' | 'INFO';
    timeLabel: string;
    latitude?: number;
    longitude?: number;
    actionText?: string;
  };
}

export default function AlertFeedCard({ alert }: AlertFeedCardProps) {
  const router = useRouter();
  const {
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    setDismissedNotificationIds
  } = useUserTest();

  let TitleIcon = Bell;
  if (alert.category === 'CRITICAL') TitleIcon = AlertTriangle;
  else if (alert.category === 'WARNING') TitleIcon = AlertCircle;

  return (
    <AlertCard $type={alert.category}>
      <CardHeaderRow>
        <TypeBadge>
          <IconBox $type={alert.category}>
            <TitleIcon />
          </IconBox>
          <TypeLabel $type={alert.category}>{alert.category}</TypeLabel>
        </TypeBadge>
        <TimeAgo>{alert.timeLabel}</TimeAgo>
      </CardHeaderRow>
      
      <AlertTitle $type={alert.category}>{alert.title}</AlertTitle>
      <AlertText $type={alert.category}>{alert.message}</AlertText>
      
      {/* Render full-width navigation action if coordinates are present */}
      {alert.latitude && alert.longitude && (
        <NavigateButton
          $type={alert.category}
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
          <Compass size={14} />
          <span>{alert.actionText || 'NAVIGATE TO LOCATION'}</span>
        </NavigateButton>
      )}

      {/* If it's a real notification, render a dismiss option */}
{/*       {alert.id.startsWith('mock-') ? null : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <DismissTextLink
            onClick={() => {
              setDismissedNotificationIds((prev: string[]) => [...prev, alert.id]);
            }}
          >
            Dismiss Alert
          </DismissTextLink>
        </div>
      )} */}
    </AlertCard>
  );
}
