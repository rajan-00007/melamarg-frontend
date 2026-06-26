'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  MapPin, 
  Navigation, 
  LogOut, 
  QrCode, 
  Copy, 
  Share2, 
  Compass, 
  AlertCircle, 
  CheckCircle, 
  X,
  Search,
  Check
} from 'lucide-react';
import Text from '@/components/style/text/Text';
import { colors } from '@/components/style/colors';
import { StyledButton } from '@/components/style/button/Button.Styled';
import { useFamily } from '@/context/FamilyContext';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import { getHaversineDistance } from '@/context/types';
import {
  FamilyContainer,
  ScrollArea,
  ScreenHeader,
  GroupHeaderCard,
  ActiveBadge,
  BadgeDot,
  MembersSection,
  MemberListItem,
  MemberAvatar,
  StatusIndicatorDot,
  MemberInfoBlock,
  PulseButton,
  PulseIconIndicator,
  AssemblyCard,
  AssemblyRow,
  ArrivalStatusContainer,
  SharePanel,
  CodeRow,
  QrCodeWrapper,
  fadeIn,
  PoiSelectDrawer
} from './family.styled';

export default function FamilyDashboard() {
  const router = useRouter();
  const { t, tPoiName } = useLanguage();
  const { poisList, userGps, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions } = useUserTest();
  
  const {
    currentGroup,
    myMemberInfo,
    membersList,
    isConnected,
    updateAssemblyPoint,
    leaveGroup,
    sendPulseRequest,
    refreshGroupDetails
  } = useFamily();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showPoiModal, setShowPoiModal] = useState(false);
  const [poiSearch, setPoiSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [pulsingMembers, setPulsingMembers] = useState<Record<string, boolean>>({});

  // Trigger automatic refresh of group details every 15 seconds as a fallback
  useEffect(() => {
    const interval = setInterval(() => {
      refreshGroupDetails();
    }, 15000);
    return () => clearInterval(interval);
  }, [refreshGroupDetails]);

  if (!currentGroup || !myMemberInfo) return null;

  // 1. Calculate active members (updated in the last 60 seconds)
  const isMemberActive = (lastActiveStr: string) => {
    const lastActive = new Date(lastActiveStr).getTime();
    const now = new Date().getTime();
    return (now - lastActive) < 60000; // Active if updated in last 60s
  };

  const activeMembersCount = membersList.filter(m => isMemberActive(m.last_active_at)).length;

  // 2. Get Nearest Landmark / POI Name for a coordinate
  const getNearestLandmarkName = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng || poisList.length === 0) return 'Unknown Location';
    
    let nearestPoi = poisList[0];
    let minDistance = Infinity;

    poisList.forEach(poi => {
      const dist = getHaversineDistance(
        Number(lat),
        Number(lng),
        Number(poi.latitude),
        Number(poi.longitude)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestPoi = poi;
      }
    });

    // If within 100 meters, say "Near [POI]", otherwise "Too far!" or "[POI] ([Dist]m)"
    const name = tPoiName(nearestPoi) || nearestPoi.name_en;
    if (minDistance < 30) {
      return `At ${name}`;
    } else if (minDistance < 100) {
      return `Near ${name}`;
    } else {
      return `${Math.round(minDistance)}m from ${name}`;
    }
  };

  // 3. Get Distance between me and another member
  const getDistanceToMember = (memberLat?: number | null, memberLng?: number | null) => {
    if (!userGps || userGps[0] === 0 || !memberLat || !memberLng) return '';
    const dist = getHaversineDistance(userGps[0], userGps[1], Number(memberLat), Number(memberLng));
    if (dist < 10) return 'Nearby (<10m)';
    if (dist < 1000) return `${Math.round(dist)}m away`;
    return `${(dist / 1000).toFixed(1)}km away`;
  };

  // 4. Calculate Arrival Status at the Assembly Point
  // Returns { reached: number, total: number }
  const getArrivalStatus = () => {
    let targetLat = currentGroup.assembly_custom_lat;
    let targetLng = currentGroup.assembly_custom_lng;

    // If it's a POI, resolve coordinates from the POI list
    if (currentGroup.assembly_point_id) {
      const matchPoi = poisList.find(p => p.id === currentGroup.assembly_point_id);
      if (matchPoi) {
        targetLat = Number(matchPoi.latitude);
        targetLng = Number(matchPoi.longitude);
      }
    }

    if (!targetLat || !targetLng) return { reached: 0, total: membersList.length };

    let reached = 0;
    membersList.forEach(m => {
      if (m.latitude && m.longitude) {
        const dist = getHaversineDistance(
          Number(m.latitude),
          Number(m.longitude),
          Number(targetLat),
          Number(targetLng)
        );
        if (dist <= 30) { // Considered arrived if within 30 meters
          reached++;
        }
      }
    });

    return { reached, total: membersList.length };
  };

  const arrival = getArrivalStatus();

  // Get current assembly point name
  const getAssemblyPointName = () => {
    if (currentGroup.assembly_point_id) {
      const matchPoi = poisList.find(p => p.id === currentGroup.assembly_point_id);
      return matchPoi ? (tPoiName(matchPoi) || matchPoi.name_en) : 'Assembly Point';
    }
    return currentGroup.assembly_custom_name || 'Not Set';
  };

  // 5. Handle Copy Group Invite details
  const handleCopyInviteCode = () => {
    const inviteText = `Join my MelaMarg Family Meetup!\nGroup: ${currentGroup.name}\nCode: ${currentGroup.code}\nPIN: ${currentGroup.pin}\nDownload the app and stay connected!`;
    navigator.clipboard.writeText(inviteText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // 6. Pulse a member
  const handlePulseMember = (memberId: string) => {
    sendPulseRequest(memberId);
    setPulsingMembers(prev => ({ ...prev, [memberId]: true }));
    setTimeout(() => {
      setPulsingMembers(prev => ({ ...prev, [memberId]: false }));
    }, 3000); // Pulse glow effect lasts 3 seconds
  };

  // 7. Navigate to Assembly Point
  const handleNavigateToAssembly = () => {
    let targetLat = currentGroup.assembly_custom_lat;
    let targetLng = currentGroup.assembly_custom_lng;
    let name = currentGroup.assembly_custom_name || 'Assembly Point';

    if (currentGroup.assembly_point_id) {
      const matchPoi = poisList.find(p => p.id === currentGroup.assembly_point_id);
      if (matchPoi) {
        targetLat = Number(matchPoi.latitude);
        targetLng = Number(matchPoi.longitude);
        name = tPoiName(matchPoi) || matchPoi.name_en;
      }
    }

    if (!targetLat || !targetLng) return;

    const navTargetPoi = {
      id: currentGroup.assembly_point_id || 'custom-assembly-target',
      name_en: name,
      latitude: Number(targetLat),
      longitude: Number(targetLng),
      category_name: 'Assembly Point',
      description: 'Agreed family assembly point'
    };

    setNavTarget(navTargetPoi);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(navTargetPoi);
    router.push('/melamarg/navigation?returnUrl=/melamarg/family');
  };

  // POIs list filtered by search
  const filteredPois = poisList
    .filter(poi => {
      const name = (tPoiName(poi) || poi.name_en || '').toLowerCase();
      return name.includes(poiSearch.toLowerCase());
    })
    .slice(0, 20); // Cap at 20 for performance

  return (
    <FamilyContainer>
      <ScrollArea>
        {/* Header */}
        <ScreenHeader style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Text variant="pageTitle" weight={700} color={colors.neutral[900]} style={{ fontSize: '22px' }}>
              {currentGroup.name}
            </Text>
            <Text variant="bodyTiny" weight={500} color={colors.neutral[800]} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isConnected ? '#22c55e' : '#f59e0b', display: 'inline-block' }} />
              {isConnected ? 'Real-time connected' : 'Connecting real-time...'}
            </Text>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <StyledButton 
              variant="secondary" 
              height="36px" 
              onClick={() => setShowShareModal(true)}
              style={{ padding: '0 10px', backgroundColor: colors.base.white, border: `1.5px solid ${colors.neutral[500]}` }}
            >
              <QrCode size={18} color={colors.brand.primary} />
            </StyledButton>

            <StyledButton 
              variant="secondary" 
              height="36px" 
              onClick={leaveGroup}
              style={{ padding: '0 10px', backgroundColor: colors.base.white, border: `1.5px solid ${colors.neutral[500]}`, color: '#ef4444' }}
            >
              <LogOut size={16} />
            </StyledButton>
          </div>
        </ScreenHeader>

        {/* Group Header Card */}
        <GroupHeaderCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(230, 81, 0, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} color={colors.brand.primary} />
            </div>
            <div>
              <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                Group Status
              </Text>
              <Text variant="bodyTiny" weight={500} color={colors.neutral[700]}>
                {membersList.length} total members registered
              </Text>
            </div>
          </div>
          <ActiveBadge>
            <BadgeDot />
            <Text variant="bodyTiny" weight={600} color={colors.green[300]}>
              {activeMembersCount} Active
            </Text>
          </ActiveBadge>
        </GroupHeaderCard>

        {/* Members List Section */}
        <MembersSection>
          <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '16px', margin: '0.25rem 0' }}>
            Family Members
          </Text>

          {membersList.map((member) => {
            const isMe = member.id === myMemberInfo.id;
            const isOnline = isMemberActive(member.last_active_at);
            const initials = member.name.substring(0, 2).toUpperCase();
            
            return (
              <MemberListItem key={member.id} style={{ borderLeft: isMe ? `4px solid ${colors.brand.primary}` : `1px solid ${colors.neutral[500]}` }}>
                <MemberAvatar $isMe={isMe}>
                  {initials}
                  <StatusIndicatorDot $online={isOnline} />
                </MemberAvatar>

                <MemberInfoBlock>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '15px' }}>
                      {member.name}
                    </Text>
                    {isMe && (
                      <span style={{ fontSize: '9px', fontWeight: 600, color: colors.brand.primary, padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(230, 81, 0, 0.08)' }}>
                        {member.is_organizer ? 'Organizer' : 'Me'}
                      </span>
                    )}
                  </div>

                  <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '13px' }}>
                    <MapPin size={12} color={colors.neutral[700]} />
                    {isMe ? 'Sharing your live coordinates' : getNearestLandmarkName(member.latitude, member.longitude)}
                  </Text>

                  {!isMe && member.latitude && member.longitude && (
                    <Text variant="bodyTiny" weight={500} color={colors.neutral[700]} style={{ fontSize: '11px' }}>
                      {getDistanceToMember(member.latitude, member.longitude)}
                    </Text>
                  )}
                </MemberInfoBlock>

                {/* Pulse / Ring Alert Button for other members */}
                {!isMe && (
                  <div style={{ position: 'relative' }}>
                    {pulsingMembers[member.id] && <PulseIconIndicator />}
                    <PulseButton onClick={() => handlePulseMember(member.id)} disabled={pulsingMembers[member.id]}>
                      {pulsingMembers[member.id] ? 'Pulsing...' : 'PULSE'}
                    </PulseButton>
                  </div>
                )}
              </MemberListItem>
            );
          })}
        </MembersSection>

        {/* Agreed Assembly Point Card */}
        <AssemblyCard>
          <AssemblyRow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <Text variant="bodyTiny" weight={600} color={colors.brand.primary} style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Agreed Assembly Point
              </Text>
              <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '18px' }}>
                {getAssemblyPointName()}
              </Text>
            </div>
            
            <StyledButton 
              variant="soft" 
              height="30px" 
              onClick={() => setShowPoiModal(true)}
              style={{ fontSize: '11px', padding: '0 10px', borderRadius: '20px' }}
            >
              Set/Change
            </StyledButton>
          </AssemblyRow>

          {/* Show arrival calculations if assembly coordinates exist */}
          {(currentGroup.assembly_point_id || (currentGroup.assembly_custom_lat && currentGroup.assembly_custom_lng)) && (
            <>
              <ArrivalStatusContainer>
                <Text variant="bodySmall" weight={500} color={colors.neutral[800]} style={{ fontSize: '13px' }}>
                  Arrival Status
                </Text>
                <Text variant="bodySmall" weight={600} color={colors.neutral[900]} style={{ fontSize: '13px' }}>
                  {arrival.reached} / {arrival.total} Reached
                </Text>
              </ArrivalStatusContainer>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <StyledButton 
                  variant="primary" 
                  onClick={handleNavigateToAssembly} 
                  style={{ flex: 1, backgroundColor: colors.brand.primary }}
                >
                  <Navigation size={15} />
                  <span>Navigate Route</span>
                </StyledButton>

                <StyledButton 
                  variant="secondary" 
                  onClick={() => {
                    // Redirect to Map page and show assembly point
                    router.push('/melamarg/map');
                  }} 
                  style={{ flex: 1, backgroundColor: colors.base.white, border: `1.5px solid ${colors.neutral[500]}`, color: colors.neutral[900] }}
                >
                  <Compass size={15} />
                  <span>View Map</span>
                </StyledButton>
              </div>
            </>
          )}
        </AssemblyCard>
      </ScrollArea>

      {/* MODAL 1: Group QR and PIN Code Details */}
      {showShareModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99, padding: '1rem' }}>
          <SharePanel style={{ maxWidth: '340px', width: '100%', position: 'relative' }}>
            <button 
              onClick={() => setShowShareModal(false)}
              style={{ position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: colors.neutral[700] }}
            >
              <X size={18} />
            </button>

            <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '16px', marginTop: '0.5rem' }}>
              Invite Family Members
            </Text>
            
            <Text variant="bodySmall" weight={500} color={colors.neutral[800]} align="center" style={{ fontSize: '13px' }}>
              Your family can scan this QR code or enter the Group Code manually to connect.
            </Text>

            {/* QR Code Container */}
            <QrCodeWrapper>
              {/* Simple Google Chart API for quick, offline-ready QR generation with internet */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=melamarg://meetup?code=${currentGroup.code}%26pin=${currentGroup.pin}`} 
                alt="Group QR Code"
                width="140"
                height="140"
                style={{ display: 'block' }}
              />
            </QrCodeWrapper>

            <CodeRow>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  Group Code
                </Text>
                <Text variant="sectionTitle" weight={700} color={colors.brand.primary} style={{ fontSize: '18px', fontFamily: 'monospace', margin: 0 }}>
                  {currentGroup.code}
                </Text>
              </div>
              
              <div style={{ width: '1px', height: '30px', backgroundColor: colors.neutral[500], margin: '0 0.5rem' }} />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text variant="bodyTiny" weight={600} color={colors.neutral[700]} style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  Group PIN
                </Text>
                <Text variant="sectionTitle" weight={700} color={colors.neutral[900]} style={{ fontSize: '18px', fontFamily: 'monospace', margin: 0 }}>
                  {currentGroup.pin}
                </Text>
              </div>
            </CodeRow>

            <div style={{ display: 'flex', width: '100%', gap: '0.75rem', marginTop: '0.5rem' }}>
              <StyledButton variant="secondary" onClick={handleCopyInviteCode} style={{ flex: 1, backgroundColor: colors.base.white, border: `1.5px solid ${colors.neutral[500]}`, color: colors.neutral[900] }}>
                {copiedCode ? <Check size={16} color="green" /> : <Copy size={15} />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </StyledButton>
            </div>
          </SharePanel>
        </div>
      )}

      {/* MODAL 2: Search and Select POI for Assembly Point */}
      {showPoiModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 99 }}>
          <PoiSelectDrawer>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text variant="sectionTitle" weight={600} color={colors.neutral[900]} style={{ fontSize: '16px' }}>
                Set Assembly Point
              </Text>
              <button 
                onClick={() => {
                  setShowPoiModal(false);
                  setPoiSearch('');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.neutral[700] }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${colors.neutral[500]}`, borderRadius: '8px', padding: '0 0.75rem', backgroundColor: colors.neutral[100] }}>
              <Search size={16} color={colors.neutral[700]} />
              <input 
                type="text"
                value={poiSearch}
                onChange={(e) => setPoiSearch(e.target.value)}
                placeholder="Search landmarks or camps..."
                style={{ height: '40px', border: 'none', outline: 'none', background: 'none', flex: 1, padding: '0 0.5rem', fontSize: '14px', color: colors.neutral[900] }}
              />
            </div>

            {/* List of POIs */}
            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', minHeight: '200px' }}>
              {filteredPois.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: colors.neutral[700], gap: '0.5rem' }}>
                  <AlertCircle size={24} />
                  <Text variant="bodySmall" weight={500} color={colors.neutral[800]}>No landmarks found</Text>
                </div>
              ) : (
                filteredPois.map(poi => {
                  const isCurrent = currentGroup.assembly_point_id === poi.id;
                  const name = tPoiName(poi) || poi.name_en;
                  return (
                    <div 
                      key={poi.id}
                      onClick={async () => {
                        await updateAssemblyPoint(poi.id);
                        setShowPoiModal(false);
                        setPoiSearch('');
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        backgroundColor: isCurrent ? 'rgba(230, 81, 0, 0.04)' : 'transparent',
                        border: isCurrent ? `1.5px solid ${colors.brand.primary}` : `1px solid ${colors.neutral[500]}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                        <Text variant="bodyPrimary" weight={600} color={colors.neutral[900]} style={{ fontSize: '14px' }}>
                          {name}
                        </Text>
                        <Text variant="bodyTiny" weight={500} color={colors.neutral[700]} style={{ fontSize: '11px', textTransform: 'capitalize' }}>
                          {poi.category_name}
                        </Text>
                      </div>
                      {isCurrent && <Check size={16} color={colors.brand.primary} />}
                    </div>
                  );
                })
              )}
            </div>
            </PoiSelectDrawer>
        </div>
      )}

    </FamilyContainer>
  );
}
