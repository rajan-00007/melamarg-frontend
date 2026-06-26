'use client';

import React from 'react';
import { AlertTriangle, X, Route } from 'lucide-react';
import {
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerCloseButton,
  VehicleStatusBadge,
  AdvisoryList,
  AdvisoryCard,
  AdvisoryCardTitle,
  AdvisoryCardMessage,
  ExploreNavButton
} from './page.styled';
import { getHaversineDistance } from './mapUtils';

interface AdvisoryDrawerProps {
  isAdvisoryDrawerOpen: boolean;
  setIsAdvisoryDrawerOpen: (val: boolean) => void;
  currentZone: any | null;
  activeAdvisories: any[] | null;
  routeNodes: any[];
  findZoneForCoordinate: (lat: number, lng: number) => any;
  userGps: [number, number] | null;
  drawerRef: React.RefObject<any>;
  router: any;
  t: any;
}

export default function AdvisoryDrawer({
  isAdvisoryDrawerOpen,
  setIsAdvisoryDrawerOpen,
  currentZone,
  activeAdvisories,
  routeNodes,
  findZoneForCoordinate,
  userGps,
  drawerRef,
  router,
  t
}: AdvisoryDrawerProps) {
  if (!isAdvisoryDrawerOpen) {
    return null;
  }

  return (
    <DrawerBackdrop onClick={() => setIsAdvisoryDrawerOpen(false)}>
      <DrawerContent ref={drawerRef} onClick={(e) => e.stopPropagation()}>
        <DrawerHeader>
          <DrawerTitle>
            <AlertTriangle style={{ color: '#fb923c' }} size={18} />
            <span>{currentZone ? `${currentZone.name} - ` : ''}{t('zoneAdvisories') || 'Traffic Advisories'}</span>
          </DrawerTitle>
          <DrawerCloseButton onClick={() => setIsAdvisoryDrawerOpen(false)}>
            <X size={16} />
          </DrawerCloseButton>
        </DrawerHeader>

        {currentZone && (
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.75rem'
          }}>
            <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t('activeZone') || 'Active Zone'}: <span style={{ color: '#0f172a' }}>{currentZone.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <VehicleStatusBadge $allowed={currentZone.allow_pedestrians !== false} style={{ flex: 1, justifyContent: 'center', padding: '6px', pointerEvents: 'none' }} title={currentZone.allow_pedestrians !== false ? 'Pedestrians Allowed' : 'Pedestrians Restricted'}>
                <span style={{ fontSize: '13px' }}>🚶</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', marginLeft: '4px' }}>
                  {currentZone.allow_pedestrians !== false ? 'Allowed' : 'Restricted'}
                </span>
              </VehicleStatusBadge>
              <VehicleStatusBadge $allowed={currentZone.allow_2wheelers !== false} style={{ flex: 1, justifyContent: 'center', padding: '6px', pointerEvents: 'none' }} title={currentZone.allow_2wheelers !== false ? '2-Wheelers Allowed' : '2-Wheelers Restricted'}>
                <span style={{ fontSize: '13px' }}>🏍️</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', marginLeft: '4px' }}>
                  {currentZone.allow_2wheelers !== false ? 'Allowed' : 'Restricted'}
                </span>
              </VehicleStatusBadge>
              <VehicleStatusBadge $allowed={currentZone.allow_cars !== false} style={{ flex: 1, justifyContent: 'center', padding: '6px', pointerEvents: 'none' }} title={currentZone.allow_cars !== false ? 'Cars Allowed' : 'Cars Restricted'}>
                <span style={{ fontSize: '13px' }}>🚗</span>
                <span style={{ fontSize: '10px', fontWeight: 'bold', marginLeft: '4px' }}>
                  {currentZone.allow_cars !== false ? 'Allowed' : 'Restricted'}
                </span>
              </VehicleStatusBadge>
            </div>
          </div>
        )}

        <AdvisoryList style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '4px' }}>
          {(() => {
            if (!activeAdvisories) {
              return (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b', fontSize: '13.5px', fontWeight: '600' }}>
                  There is no zone advisory present.
                </div>
              );
            }

            // 1. General active advisories
            const generalAdvs = activeAdvisories.filter(advisory => advisory.is_active && advisory.advisory_type === 'general');

            // 2. Zone-focused active advisories or fallbacks
            let zoneFocusedAdvs: any[] = [];
            let fallbackMessage = '';

            if (currentZone) {
              // Find zone advisories for this zone
              const zoneAdvs = activeAdvisories.filter(advisory => 
                advisory.is_active && 
                advisory.advisory_type === 'zone' && 
                Array.isArray(advisory.zoneIds) && 
                advisory.zoneIds.includes(currentZone.id)
              );

              if (zoneAdvs.length > 0) {
                zoneFocusedAdvs = zoneAdvs;
              } else {
                // No zone advisories. Search for road advisories in this zone.
                const roadAdvsInZone = activeAdvisories.filter(advisory => {
                  if (!advisory.is_active || advisory.advisory_type !== 'road') return false;
                  let lat = 0, lng = 0;
                  if (routeNodes && routeNodes.length > 0) {
                    const startNode = routeNodes.find(n => n.id === advisory.start_node_id);
                    if (startNode) {
                      lat = Number(startNode.latitude);
                      lng = Number(startNode.longitude);
                    } else {
                      const endNode = routeNodes.find(n => n.id === advisory.end_node_id);
                      if (endNode) {
                        lat = Number(endNode.latitude);
                        lng = Number(endNode.longitude);
                      }
                    }
                  }
                  if (lat === 0 && advisory.latitude && advisory.longitude) {
                    lat = Number(advisory.latitude);
                    lng = Number(advisory.longitude);
                  }
                  if (lat !== 0 && lng !== 0 && findZoneForCoordinate) {
                    const zone = findZoneForCoordinate(lat, lng);
                    return zone?.id === currentZone.id;
                  }
                  return false;
                });

                if (roadAdvsInZone.length > 0) {
                  zoneFocusedAdvs = roadAdvsInZone;
                } else {
                  // No road advisories in this zone. Search for the nearest road advisory globally.
                  let nearestRoadAdv: any = null;
                  if (userGps && userGps[0] !== 0) {
                    let minDistance = Infinity;
                    activeAdvisories.forEach(advisory => {
                      if (!advisory.is_active || advisory.advisory_type !== 'road') return;
                      let lat = 0, lng = 0;
                      if (routeNodes && routeNodes.length > 0) {
                        const startNode = routeNodes.find(n => n.id === advisory.start_node_id);
                        if (startNode) {
                          lat = Number(startNode.latitude);
                          lng = Number(startNode.longitude);
                        } else {
                          const endNode = routeNodes.find(n => n.id === advisory.end_node_id);
                          if (endNode) {
                            lat = Number(endNode.latitude);
                            lng = Number(endNode.longitude);
                          }
                        }
                      }
                      if (lat === 0 && advisory.latitude && advisory.longitude) {
                        lat = Number(advisory.latitude);
                        lng = Number(advisory.longitude);
                      }
                      if (lat !== 0 && lng !== 0) {
                        const dist = getHaversineDistance(userGps[0], userGps[1], lat, lng);
                        if (dist < minDistance) {
                          minDistance = dist;
                          nearestRoadAdv = advisory;
                        }
                      }
                    });
                  }

                  if (nearestRoadAdv) {
                    zoneFocusedAdvs = [nearestRoadAdv];
                  } else {
                    fallbackMessage = 'There is no zone advisory present.';
                  }
                }
              }
            } else {
              if (generalAdvs.length === 0) {
                fallbackMessage = 'There is no zone advisory present.';
              }
            }

            const advisoriesToShow = [...zoneFocusedAdvs, ...generalAdvs];

            if (advisoriesToShow.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '2rem 0', color: '#64748b', fontSize: '13.5px', fontWeight: '600' }}>
                  {fallbackMessage || 'There is no zone advisory present.'}
                </div>
              );
            }
      
            return advisoriesToShow.map((advisory: any) => {
              const tag = advisory.status_tag || 'general';
              let borderCol = 'rgba(0, 0, 0, 0.05)';
              let badgeBg = 'rgba(0, 0, 0, 0.04)';
              let badgeText = '#475569';
              
              if (tag === 'critical') {
                borderCol = 'rgba(239, 68, 68, 0.2)';
                badgeBg = 'rgba(239, 68, 68, 0.08)';
                badgeText = '#b91c1c';
              } else if (tag === 'congested') {
                borderCol = 'rgba(249, 115, 22, 0.2)';
                badgeBg = 'rgba(249, 115, 22, 0.08)';
                badgeText = '#c2410c';
              } else if (tag === 'warning') {
                borderCol = 'rgba(217, 119, 6, 0.2)';
                badgeBg = 'rgba(217, 119, 6, 0.08)';
                badgeText = '#a16207';
              } else if (tag === 'stable') {
                borderCol = 'rgba(16, 185, 129, 0.2)';
                badgeBg = 'rgba(16, 185, 129, 0.08)';
                badgeText = '#047857';
              } else if (tag === 'general') {
                borderCol = 'rgba(59, 130, 246, 0.2)';
                badgeBg = 'rgba(59, 130, 246, 0.08)';
                badgeText = '#1d4ed8';
              }

              const displayTag = advisory.advisory_type === 'road' && !advisory.status_tag ? 'road advisory' : tag;

              return (
                <AdvisoryCard key={advisory.id} style={{ borderColor: borderCol, position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AdvisoryCardTitle style={{ margin: 0, fontSize: '13px' }}>{advisory.title}</AdvisoryCardTitle>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: badgeBg,
                      color: badgeText,
                      border: '1px solid ' + borderCol
                    }}>
                      {displayTag}
                    </span>
                  </div>
                  <AdvisoryCardMessage style={{ marginTop: '8px', fontSize: '12px' }}>{advisory.message}</AdvisoryCardMessage>
                </AdvisoryCard>
              );
            });
          })()}
        </AdvisoryList>

        {/* Redirect to All Advisories Page */}
        <div style={{ marginTop: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'center', pointerEvents: 'auto' }}>
          <ExploreNavButton
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: 0 }}
            onClick={() => {
              router.push('/melamarg/advisories');
            }}
          >
            <Route size={14} />
            <span>{t('viewAllAdvisories' as any) || 'View All Advisories'}</span>
          </ExploreNavButton>
        </div>
      </DrawerContent>
    </DrawerBackdrop>
  );
}
