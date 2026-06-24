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
        <AdvisoryBadge style={{
          color: 
            advisory.status_tag === 'stable' ? '#137333' :
            advisory.status_tag === 'warning' ? '#b06000' :
            advisory.status_tag === 'congested' ? '#e65100' :
            advisory.status_tag === 'critical' ? '#c5221f' :
            advisory.status_tag === 'general' ? '#1a73e8' :
            (advisory.advisory_type === 'zone' ? '#2563eb' : '#ea580c'),
          backgroundColor: 
            advisory.status_tag === 'stable' ? '#e6f4ea' :
            advisory.status_tag === 'warning' ? '#fef7e0' :
            advisory.status_tag === 'congested' ? '#fff3e0' :
            advisory.status_tag === 'critical' ? '#fce8e6' :
            advisory.status_tag === 'general' ? '#e8f0fe' :
            (advisory.advisory_type === 'zone' ? '#eff6ff' : '#fff7ed'),
          borderColor: 
            advisory.status_tag === 'stable' ? '#ceead6' :
            advisory.status_tag === 'warning' ? '#ffe0b2' :
            advisory.status_tag === 'congested' ? '#ffe0b2' :
            advisory.status_tag === 'critical' ? '#fad2cf' :
            advisory.status_tag === 'general' ? '#d2e3fc' :
            (advisory.advisory_type === 'zone' ? '#dbeafe' : '#ffedd5')
        }}>
          <AlertTriangle size={10} style={{ marginRight: '3px', display: 'inline', verticalAlign: 'middle' }} />
          {advisory.status_tag 
            ? `${advisory.advisory_type === 'zone' ? 'Zone' : 'Road'} - ${advisory.status_tag.toUpperCase()}`
            : (advisory.advisory_type === 'zone' ? 'Zone Alert' : t('trafficAdvisory'))
          }
        </AdvisoryBadge>
      </AdvisoryHeaderRow>

      <AdvisoryMessage>{advisory.message}</AdvisoryMessage>

      {/* Interactive Leaflet Map for this advisory */}
      {advisory.advisory_type !== 'zone' && (
        <AdvisoryMiniMap
          advisory={advisory}
          routeNodes={routeNodes}
          routeEdges={routeEdges}
          leafletLoaded={leafletLoaded}
        />
      )}

      {/* CTA Action button to initiate rerouted navigation */}
      {advisory.advisory_type !== 'zone' && advisory.end_node_id && (
        <NavigateButton onClick={() => onNavigate(advisory)}>
          <Navigation />
          <span>{t('navigateViaDetour')}</span>
        </NavigateButton>
      )}
    </CardContainer>
  );
}
