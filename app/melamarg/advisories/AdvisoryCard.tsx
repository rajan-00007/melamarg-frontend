'use client';

import React from 'react';
import { AlertTriangle, Navigation } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import AdvisoryMiniMap from './AdvisoryMiniMap';
import {
  AdvisoryCard as CardContainer,
  AdvisoryHeaderRow,
  AdvisoryTitleGroup,
  AdvisoryTitle,
  AdvisoryBadge,
  AdvisoryMessage,
  NavigateButton
} from './page.styled';

interface AdvisoryCardProps {
  advisory: any;
  routeNodes: any[];
  routeEdges: any[];
  leafletLoaded: boolean;
  onNavigate: (advisory: any) => void;
}

export default function AdvisoryCard({
  advisory,
  routeNodes,
  routeEdges,
  leafletLoaded,
  onNavigate
}: AdvisoryCardProps) {
  const { t } = useLanguage();

  return (
    <CardContainer>
      <AdvisoryHeaderRow>
        <AdvisoryTitleGroup>
          <AdvisoryTitle>{advisory.title}</AdvisoryTitle>
        </AdvisoryTitleGroup>
        <AdvisoryBadge>
          <AlertTriangle size={10} style={{ marginRight: '3px', display: 'inline', verticalAlign: 'middle' }} />
          {t('trafficAdvisory')}
        </AdvisoryBadge>
      </AdvisoryHeaderRow>

      <AdvisoryMessage>{advisory.message}</AdvisoryMessage>

      {/* Interactive Leaflet Map for this advisory */}
      <AdvisoryMiniMap
        advisory={advisory}
        routeNodes={routeNodes}
        routeEdges={routeEdges}
        leafletLoaded={leafletLoaded}
      />

      {/* CTA Action button to initiate rerouted navigation */}
      {advisory.end_node_id && (
        <NavigateButton onClick={() => onNavigate(advisory)}>
          <Navigation />
          <span>{t('navigateViaDetour')}</span>
        </NavigateButton>
      )}
    </CardContainer>
  );
}
