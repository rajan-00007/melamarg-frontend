'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest, POIItem } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  AlertTriangle,
  AlertCircle,
  Bell,
  Compass,
  Route
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
    advisory_id?: string;
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
  const { t } = useLanguage();

  const isAdvisory = !!alert.advisory_id;
  const category = isAdvisory ? 'WARNING' : alert.category;

  let TitleIcon = Bell;
  if (isAdvisory) TitleIcon = Route;
  else if (category === 'CRITICAL') TitleIcon = AlertTriangle;
  else if (category === 'WARNING') TitleIcon = AlertCircle;

  const getLocalizedActionText = () => {
    if (isAdvisory) return t('viewDetourMap');
    const text = alert.actionText || 'NAVIGATE TO LOCATION';
    if (text === 'NAVIGATE TO LOCATION') return t('navigateLocation');
    if (text === 'NAVIGATE TO MEDICAL POST') return t('navigateMedical');
    if (text === 'AVOID AREA / FIND ALTERNATE') return t('avoidArea');
    if (text === 'NAVIGATE TO LASER SHOW') return t('navigateLaser');
    return text;
  };

  const getLocalizedTimeLabel = (label: string) => {
    if (!label) return '';
    const upperLabel = label.toUpperCase();
    if (upperLabel === 'JUST NOW') return t('justNow').toUpperCase();
    if (upperLabel.endsWith('M AGO')) {
      const value = upperLabel.replace('M AGO', '').trim();
      return `${value}${t('mAgo').toUpperCase()}`;
    }
    if (upperLabel.endsWith('H AGO')) {
      const value = upperLabel.replace('H AGO', '').trim();
      return `${value}${t('hAgo').toUpperCase()}`;
    }
    return label;
  };

  return (
    <AlertCard $type={category}>
      <CardHeaderRow>
        <TypeBadge>
          <IconBox $type={category}>
            <TitleIcon size={14} />
          </IconBox>
          <TypeLabel $type={category}>
            {isAdvisory ? t('trafficAdvisory').toUpperCase() : t(category.toLowerCase() as any).toUpperCase()}
          </TypeLabel>
        </TypeBadge>
        <TimeAgo>{getLocalizedTimeLabel(alert.timeLabel)}</TimeAgo>
      </CardHeaderRow>
      
      <AlertTitle $type={category}>{alert.title}</AlertTitle>
      <AlertText $type={category}>{alert.message}</AlertText>
      
      {/* Render full-width navigation action if it is an advisory OR has coordinates */}
      {isAdvisory ? (
        <NavigateButton
          $type="WARNING"
          onClick={() => {
            router.push('/melamarg/advisories');
          }}
        >
          <Route size={14} />
          <span>{getLocalizedActionText()}</span>
        </NavigateButton>
      ) : alert.latitude && alert.longitude && (
        <NavigateButton
          $type={category}
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
            router.push('/melamarg/navigation?returnUrl=/melamarg/alerts');
          }}
        >
          <Compass size={14} />
          <span>{getLocalizedActionText()}</span>
        </NavigateButton>
      )}

      {/* If it's a real notification, render a dismiss option */}
     {/*  {!alert.id.startsWith('mock-') && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <DismissTextLink
            onClick={() => {
              setDismissedNotificationIds((prev: string[]) => [...prev, alert.id]);
            }}
          >
            {t('dismissAlert')}
          </DismissTextLink>
        </div>
      )} */}
    </AlertCard>
  );
}
