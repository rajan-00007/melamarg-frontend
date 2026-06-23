'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '@/context/UserTestContext';
import { useLanguage } from '@/context/LanguageContext';
import axiosClient from '@/lib/axios/axiosClient';
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Car,
  Check,
  MapPin,
  Bookmark,
  ArrowRight,
  Compass,
} from 'lucide-react';

import {
  Container,
  BackRow,
  Title,
  Subtitle,
  SearchBarWrapper,
  SearchInput,
  FeaturedCard,
  FastFillBadge,
  CardRow,
  CardTitle,
  CardDistance,
  CardSpotsCount,
  ProgressBarWrapper,
  ProgressBar,
  ReserveButton,
  GridRow,
  MiniCard,
  MiniCardHeader,
  MiniTitle,
  MiniStatus,
  MiniMeta,
  ListCard,
  ListIconBox,
  ListInfo,
  ListTitle,
  ListMeta,
  LiveSyncBadge,
  TicketCard,
  TicketHeader,
  TicketIconBox,
  TicketTitle,
  TicketSubtitle,
  TicketBody,
  TicketRow,
  TicketCancelButton,
  ListCardActions,
  CompactReserveButton,
  CompactRouteButton,
  PriceBadge,
} from './page.styled';

// Haversine distance calculator
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ParkingFinderPage() {
  const router = useRouter();
  const { selectedEvent, userGps, offlineMode, setNavTarget, setScreenMode, setArrivalNotify, logNavigationInstructions, triggerToast } = useUserTest();
  const { t } = useLanguage();

  const [parkingLots, setParkingLots] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeReservation, setActiveReservation] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Generate or get anonymous device ID for tracking reservations
  const getDeviceId = (): string => {
    if (typeof window === 'undefined') return 'dev-mock';
    let deviceId = localStorage.getItem('mm_device_id');
    if (!deviceId) {
      deviceId = 'dev-' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem('mm_device_id', deviceId);
    }
    return deviceId;
  };

  // Load parking lots data
  const loadParkingLots = async () => {
    if (!selectedEvent) return;
    setLoading(true);

    // 1. Try loading from offline localStorage first
    let cachedData: any[] = [];
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(`mm_offline_parking_${selectedEvent.id}`);
      if (cached) {
        try {
          cachedData = JSON.parse(cached);
          setParkingLots(cachedData);
        } catch (_) {}
      }
    }

    // 2. Fetch fresh details from API if online
    const isUuid = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    if (!offlineMode && isUuid(selectedEvent.id)) {
      try {
        const res = await axiosClient.get(`/parking/events/${selectedEvent.id}/parking?t=${Date.now()}`);
        if (res.data && res.data.success) {
          const freshData = res.data.data || [];
          setParkingLots(freshData);
          if (typeof window !== 'undefined') {
            localStorage.setItem(`mm_offline_parking_${selectedEvent.id}`, JSON.stringify(freshData));
          }
        }
      } catch (err) {
        console.warn('Failed to sync parking lots online. Using offline cache.', err);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  // Load active reservation details
  const loadActiveReservation = async () => {
    if (typeof window === 'undefined') return;
    const cachedRes = localStorage.getItem('mm_active_reservation');
    if (cachedRes) {
      try {
        const reservation = JSON.parse(cachedRes);
        // Verify reservation expiration
        const remaining = new Date(reservation.expires_at).getTime() - Date.now();
        if (remaining > 0) {
          setActiveReservation(reservation);
        } else {
          // Clean up expired reservation locally
          localStorage.removeItem('mm_active_reservation');
        }
      } catch (_) {}
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      loadParkingLots();
      loadActiveReservation();
    }
  }, [selectedEvent, offlineMode]);

  // Countdown timer scheduler
  useEffect(() => {
    if (!activeReservation) {
      setTimeLeft('');
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const updateTimer = () => {
      const remainingMs = new Date(activeReservation.expires_at).getTime() - Date.now();
      if (remainingMs <= 0) {
        setTimeLeft('Expired');
        setActiveReservation(null);
        localStorage.removeItem('mm_active_reservation');
        if (timerRef.current) clearInterval(timerRef.current);
        loadParkingLots(); // Reload to release slot dynamically in UI
        triggerToast({
          id: `expired-${Date.now()}`,
          title: 'Reservation Expired',
          message: 'Your 20-minute reservation has expired and the spot has been released.',
          is_emergency: false
        });
      } else {
        const totalSecs = Math.floor(remainingMs / 1000);
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs} Minutes`);
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeReservation]);

  // Handle reserve click
  const handleReserve = async (lot: any) => {
    if (offlineMode) {
      alert('You are currently offline. Real-time reservations require network connectivity. Please navigate directly to the lot.');
      return;
    }

    try {
      const deviceId = getDeviceId();
      const res = await axiosClient.post('/parking/reserve', {
        parkingLotId: lot.id,
        deviceId
      });

      if (res.data && res.data.success) {
        const reservation = res.data.data;
        setActiveReservation(reservation);
        localStorage.setItem('mm_active_reservation', JSON.stringify(reservation));
        loadParkingLots(); // Reload spots count
        triggerToast({
          id: `res-${Date.now()}`,
          title: 'Spot Reserved Successfully',
          message: `Ticket token: ${reservation.token} is valid for 20 minutes.`,
          is_emergency: false
        });
      } else {
        throw new Error(res.data.error || 'Failed to complete reservation');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || 'Failed to reserve spot');
    }
  };

  // Handle cancel click
  const handleCancelReservation = async () => {
    if (!activeReservation) return;
    if (offlineMode) {
      alert('You are offline. Cannot contact server to release reservation. Please wait until you are online or let it expire.');
      return;
    }

    try {
      const res = await axiosClient.post('/parking/cancel', {
        token: activeReservation.token
      });

      if (res.data && res.data.success) {
        setActiveReservation(null);
        localStorage.removeItem('mm_active_reservation');
        loadParkingLots(); // Reload spots count
        triggerToast({
          id: `cancel-${Date.now()}`,
          title: 'Reservation Cancelled',
          message: 'Your spot has been released successfully.',
          is_emergency: false
        });
      } else {
        throw new Error(res.data.error || 'Failed to cancel reservation');
      }
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || 'Failed to cancel reservation');
    }
  };

  // Trigger offline map walking navigation
  const handleNavigate = (lot: any) => {
    const navItem = {
      id: lot.id,
      name_en: lot.name,
      latitude: Number(lot.latitude),
      longitude: Number(lot.longitude),
      category_name: 'parking',
      description: lot.landmark || 'Event Parking Lot'
    };

    setNavTarget(navItem);
    setScreenMode('navigation');
    setArrivalNotify(false);
    logNavigationInstructions(navItem);
    router.push('/melamarg/navigation?returnUrl=/melamarg/parking');
  };

  // Calculate coordinates distance dynamically from user's current GPS position
  const getLotDistanceText = (lot: any): string => {
    if (!userGps) return 'Location pending';
    const dist = getDistance(userGps[0], userGps[1], Number(lot.latitude), Number(lot.longitude));
    if (dist < 1000) {
      return `${Math.round(dist)}m away`;
    }
    return `${(dist / 1000).toFixed(1)} km away`;
  };

  // Calculate numerical distance for sorting
  const getLotDistanceVal = (lot: any): number => {
    if (!userGps) return Infinity;
    return getDistance(userGps[0], userGps[1], Number(lot.latitude), Number(lot.longitude));
  };

  // Filter list based on search input
  const filteredLots = parkingLots.filter(lot => {
    const term = searchTerm.toLowerCase();
    return (
      lot.name.toLowerCase().includes(term) ||
      (lot.landmark && lot.landmark.toLowerCase().includes(term))
    );
  });

  // Calculate spots fill percentage
  const getFillPercent = (lot: any): number => {
    if (lot.total_spots <= 0) return 100;
    const filled = lot.total_spots - lot.available_spots;
    return Math.min(100, Math.max(0, Math.round((filled / lot.total_spots) * 100)));
  };

  // Find active reserved lot
  const reservedLot = activeReservation
    ? parkingLots.find((lot) => lot.id === activeReservation.parking_lot_id)
    : null;

  // Select the "Spotlight" lot (Pick the active lot with the lowest spots remaining, but not fully full, to represent the "Fastest Fill" stand)
  const availableForSpotlight = filteredLots.filter(lot => !reservedLot || lot.id !== reservedLot.id);

  const spotlightLot = availableForSpotlight.length > 0
    ? [...availableForSpotlight]
        .filter(lot => lot.is_active && lot.available_spots > 0)
        .sort((a, b) => a.available_spots - b.available_spots)[0] || availableForSpotlight[0]
    : null;

  // Secondary grid lots (Exclude spotlight lot and reserved lot from list)
  const secondaryLots = spotlightLot
    ? availableForSpotlight.filter(lot => lot.id !== spotlightLot.id)
    : availableForSpotlight;

  // Sort secondary lots by distance
  const sortedSecondaryLots = [...secondaryLots].sort((a, b) => getLotDistanceVal(a) - getLotDistanceVal(b));

  const cityName = selectedEvent?.name?.split(' - ')[1] || 'Puri City';

  return (
    <Container>
      {/* Back button Row */}
      <BackRow onClick={() => router.push('/melamarg/home')}>
        <ChevronLeft size={18} />
        <span>{t('back')}</span>
      </BackRow>

      {/* Header */}
      <Title>{t('findLiveParking')}</Title>
      <Subtitle>Real-time availability in {cityName}</Subtitle>

      {/* Search Input */}
      <SearchBarWrapper>
        <Search className="search-icon" size={18} />
        <SearchInput
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchByLandmark')}
        />
        <SlidersHorizontal className="filter-icon" size={18} />
      </SearchBarWrapper>

      {/* Live sync pulser */}
      <LiveSyncBadge $active={!offlineMode} onClick={loadParkingLots}>
        <span className="dot" />
        <span>{!offlineMode ? 'Live Sync Active' : 'Offline (Cached Mode)'}</span>
      </LiveSyncBadge>

      {/* 0. ACTIVE RESERVATION */}
      {activeReservation && reservedLot && (
        <div style={{ marginBottom: '24px' }}>
          <FeaturedCard style={{ marginBottom: '12px', border: '1.5px solid #0ea5e9' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <FastFillBadge style={{ background: '#0ea5e9', marginBottom: 0 }}>Your Reservation</FastFillBadge>
              <PriceBadge $isPaid={Number(reservedLot.price_per_hour) > 0}>
                {Number(reservedLot.price_per_hour) > 0 ? `Paid • ₹${reservedLot.price_per_hour}/hr` : 'Free'}
              </PriceBadge>
            </div>
            <CardRow>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <CardTitle>{reservedLot.name}</CardTitle>
                <CardDistance onClick={() => handleNavigate(reservedLot)} style={{ cursor: 'pointer' }}>
                  <Compass size={14} />
                  <span>
                    {getLotDistanceText(reservedLot)} {reservedLot.landmark ? `• ${reservedLot.landmark}` : ''}
                  </span>
                </CardDistance>
              </div>
              <CardSpotsCount>
                <div className="count">{reservedLot.available_spots}</div>
                <div className="label">{t('spotsLeft')}</div>
              </CardSpotsCount>
            </CardRow>

            <ProgressBarWrapper>
              <ProgressBar $percent={getFillPercent(reservedLot)} />
            </ProgressBarWrapper>

            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <ReserveButton
                $disabled={true}
                style={{ flex: 1 }}
              >
                <span>P</span>
                <span>{t('reserved')}</span>
              </ReserveButton>
              <ReserveButton
                onClick={() => handleNavigate(reservedLot)}
                style={{ flex: 1, background: '#0284c7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
              >
                <Compass size={18} />
                <span>{t('selfRoute')}</span>
              </ReserveButton>
            </div>
          </FeaturedCard>

          <TicketCard style={{ marginTop: '0' }}>
            <TicketHeader>
              <TicketIconBox>
                <Check size={22} />
              </TicketIconBox>
              <div>
                <TicketTitle>{t('reserveSuccess')}</TicketTitle>
                <TicketSubtitle>Present at parking entry booth</TicketSubtitle>
              </div>
            </TicketHeader>

            <TicketBody>
              <TicketRow>
                <span>{t('tokenText')}:</span>
                <span className="value">{activeReservation.token}</span>
              </TicketRow>
              <TicketRow>
                <span>{t('validFor')}:</span>
                <span className="countdown">{timeLeft}</span>
              </TicketRow>
            </TicketBody>

            <TicketCancelButton onClick={handleCancelReservation}>
              {t('cancelReservation')}
            </TicketCancelButton>
          </TicketCard>
        </div>
      )}

      {/* 1. TOP SPOTLIGHT FEATURED CARD */}
      {spotlightLot && (
        <FeaturedCard>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <FastFillBadge style={{ marginBottom: 0 }}>Fastest Fill</FastFillBadge>
            <PriceBadge $isPaid={Number(spotlightLot.price_per_hour) > 0}>
              {Number(spotlightLot.price_per_hour) > 0 ? `Paid • ₹${spotlightLot.price_per_hour}/hr` : 'Free'}
            </PriceBadge>
          </div>
          <CardRow>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <CardTitle>{spotlightLot.name}</CardTitle>
              <CardDistance onClick={() => handleNavigate(spotlightLot)} style={{ cursor: 'pointer' }}>
                <Compass size={14} />
                <span>
                  {getLotDistanceText(spotlightLot)} {spotlightLot.landmark ? `• ${spotlightLot.landmark}` : ''}
                </span>
              </CardDistance>
            </div>
            <CardSpotsCount>
              <div className="count">{spotlightLot.available_spots}</div>
              <div className="label">{t('spotsLeft')}</div>
            </CardSpotsCount>
          </CardRow>

          <ProgressBarWrapper>
            <ProgressBar $percent={getFillPercent(spotlightLot)} />
          </ProgressBarWrapper>

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            <ReserveButton
              onClick={() => handleReserve(spotlightLot)}
              $disabled={spotlightLot.available_spots <= 0 || !!activeReservation}
              style={{ flex: 1 }}
            >
              <span>P</span>
              <span>{spotlightLot.available_spots <= 0 ? 'Full' : activeReservation ? t('reserved') : t('reserveSpot')}</span>
            </ReserveButton>
            <ReserveButton
              onClick={() => handleNavigate(spotlightLot)}
              style={{ flex: 1, background: '#0284c7', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}
            >
              <Compass size={18} />
              <span>{t('selfRoute')}</span>
            </ReserveButton>
          </div>
        </FeaturedCard>
      )}
      {/* 2. SECONDARY LOTS LIST */}
      {sortedSecondaryLots.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '10px' }}>
          {sortedSecondaryLots.map((lot) => {
            const isFull = lot.available_spots <= 0;
            return (
              <ListCard key={lot.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%' }}>
                  <ListIconBox>
                    <Car size={20} />
                  </ListIconBox>
                  <ListInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <ListTitle>{lot.name}</ListTitle>
                      <PriceBadge $isPaid={Number(lot.price_per_hour) > 0}>
                        {Number(lot.price_per_hour) > 0 ? `₹${lot.price_per_hour}/hr` : 'Free'}
                      </PriceBadge>
                    </div>
                    <ListMeta>
                      {getLotDistanceText(lot)} {lot.landmark ? `• ${lot.landmark}` : ''}
                    </ListMeta>
                  </ListInfo>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <MiniStatus $type={isFull ? 'full' : 'free'}>
                      {isFull ? 'Full' : `${lot.available_spots} Free`}
                    </MiniStatus>
                  </div>
                </div>

                <ListCardActions>
                  <CompactReserveButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReserve(lot);
                    }}
                    $disabled={isFull || !!activeReservation}
                  >
                    <span>{isFull ? 'Full' : activeReservation ? t('reserved') : t('reserveSpot')}</span>
                  </CompactReserveButton>
                  
                  <CompactRouteButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(lot);
                    }}
                  >
                    <Compass size={16} />
                    <span>{t('selfRoute')}</span>
                  </CompactRouteButton>
                </ListCardActions>
              </ListCard>
            );
          })}
        </div>
      )}


      {filteredLots.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8', fontSize: '15px' }}>
          No parking lots matching search query found.
        </div>
      )}
    </Container>
  );
}
