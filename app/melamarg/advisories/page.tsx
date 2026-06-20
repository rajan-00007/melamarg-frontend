'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Route, Menu } from 'lucide-react';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import AdvisoryCard from './AdvisoryCard';
import {
  AdvisoriesContainer,
  AdvisoriesHeader,
  BackButton,
  HeaderTitles,
  HeaderTitle,
  HeaderSubtitle,
  NoAdvisoriesContainer,
  NoAdvisoriesIcon,
  NoAdvisoriesText
} from './page.styled';

export default function AdvisoriesPage() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const {
    activeAdvisories,
    routeNodes,
    routeEdges,
    leafletLoaded,
    setNavTarget,
    setScreenMode,
    setArrivalNotify,
    logNavigationInstructions,
    setIsSidebarOpen
  } = useUserTest();

  // Filter only active advisories
  const activeList = (activeAdvisories || []).filter(a => a.is_active);

  const handleNavigateViaDetour = (advisory: any) => {
    const endNode = routeNodes.find(n => n.id === advisory.end_node_id);
    if (!endNode) return;

    // Create a mock POIItem targeting the detour end node coordinates
    const targetPoi = {
      id: endNode.id,
      name_en: endNode.name || advisory.title || 'Detour End Point',
      latitude: Number(endNode.latitude),
      longitude: Number(endNode.longitude),
      category_name: 'navigation',
      description: advisory.message
    };

    setNavTarget(targetPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(targetPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/advisories');
  };

  return (
    <AdvisoriesContainer>
      <AdvisoriesHeader>
        <BackButton onClick={() => setIsSidebarOpen(true)} aria-label="Menu">
          <Menu size={20} />
        </BackButton>
        <HeaderTitles>
          <HeaderTitle>{t('advisories')}</HeaderTitle>
          <HeaderSubtitle>{t('activeRouteAdvisories')}</HeaderSubtitle>
        </HeaderTitles>
      </AdvisoriesHeader>

      {activeList.length === 0 ? (
        <NoAdvisoriesContainer>
          <NoAdvisoriesIcon>
            <Route size={28} />
          </NoAdvisoriesIcon>
          <NoAdvisoriesText>{t('noActiveAdvisories')}</NoAdvisoriesText>
        </NoAdvisoriesContainer>
      ) : (
        activeList.map((advisory) => (
          <AdvisoryCard
            key={advisory.id}
            advisory={advisory}
            routeNodes={routeNodes}
            routeEdges={routeEdges}
            leafletLoaded={leafletLoaded}
            onNavigate={handleNavigateViaDetour}
          />
        ))
      )}
    </AdvisoriesContainer>
  );
}
