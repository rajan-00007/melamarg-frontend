'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUserTest } from '../context/UserTestContext';
import { Navigation, MapPin, Volume2, VolumeX, LogOut, Compass, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  NavContainer,
  Overlay,
  OverlayBox,
  CenterBox,
  WarningIconWrapper,
  OverlayTitle,
  OverlayText,
  OverlayPillWrapper,
  BypassButton,
  StopButton,
  ArrivalOverlay,
  ArrivalTitle,
  ArrivalText,
  ArrivalButton,
  MapCanvas,
  GPSLockedPill,
  GPSSearchingPill,
  GPSLostPill,
  StyledCompassIcon,
  StyledPartyPopper,
  
  // Redesigned UI components
  FloatingHeaderWrapper,
  FloatingHeaderPillRow,
  OfflineActivePill,
  GpsStrongPill,
  RouteStatusBanner,
  RouteStatusIconWrapper,
  RouteStatusInfo,
  RouteStatusTitle,
  RouteStatusSubtitle,
  FloatingBottomWrapper,
  FloatingControlsRow,
  FloatingLocateButton,
  FloatingSimulateButton,
  PremiumBottomCard,
  BottomCardProgressHeader,
  BottomCardDestinationText,
  BottomCardPercentageText,
  BottomProgressBarContainer,
  BottomProgressBarFill,
  BottomMetricsRow,
  BottomMetricCol,
  BottomMetricLabel,
  BottomMetricValue,
  BottomActionsRow,
  BottomVoiceButton,
  BottomExitButton,
  NextInstructionPill,
  UnifiedStatusCard,
  UnifiedStatusHeader,
  UnifiedStatusBody
} from './page.styled';

// Pure Utility Helpers
const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getCompassBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  return Math.round(bearing);
};

const getClosestPointOnSegment = (
  userLat: number,
  userLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const x = userLng;
  const y = userLat;
  const x1 = lng1;
  const y1 = lat1;
  const x2 = lng2;
  const y2 = lat2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return { lat: y1, lng: x1 };
  }

  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  return {
    lat: y1 + t * dy,
    lng: x1 + t * dx
  };
};

export default function CompassNavigationPage() {
  const router = useRouter();
  const {
    navTarget,
    setNavTarget,
    gpsStatus,
    userGps,
    setUserGps,
    gpsAccuracy,
    deviceHeading,
    isWalking,
    setIsWalking,
    arrivalNotify,
    setArrivalNotify,
    handleSimulateWalking,
    setScreenMode,
    getNavigationStats,
    handleGpsUpdate,
    routeNodes,
    routeEdges,
    selectedEvent,
    leafletLoaded,
    getRealGps,
    poisList
  } = useUserTest();

  const { language, t, tPoiName } = useLanguage();

  const mapRef = useRef<any>(null);

  const getArrowIcon = (dirText?: string) => {
    const iconStyle = { width: '1.25rem', height: '1.25rem', color: '#1e293b', flexShrink: 0 };
    if (!dirText) return <ArrowUp style={iconStyle} />;
    const d = dirText.toUpperCase();
    if (d.includes('LEFT')) return <ArrowLeft style={iconStyle} />;
    if (d.includes('RIGHT')) return <ArrowRight style={iconStyle} />;
    if (d.includes('AROUND') || d.includes('BACK')) return <ArrowDown style={iconStyle} />;
    return <ArrowUp style={iconStyle} />;
  };
  const userMarkerRef = useRef<any>(null);
  const userAccuracyCircleRef = useRef<any>(null);
  const routeLayerRef = useRef<any>(null);
  const activeRouteLayerRef = useRef<any>(null);
  const offRouteConnectorRef = useRef<any>(null);
  const poiMarkersLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);

  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [gpsHeading, setGpsHeading] = useState<number>(0);
  const [mapZoom, setMapZoom] = useState<number>(17);
  const [voiceOn, setVoiceOn] = useState<boolean>(true);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const lastGpsRef = useRef<[number, number] | null>(null);

  const stats = navTarget ? getNavigationStats() : null;

  // Manage initial distance tracking
  useEffect(() => {
    if (stats && stats.distance && initialDistance === null) {
      setInitialDistance(stats.distance);
    }
    if (!navTarget) {
      setInitialDistance(null);
    }
  }, [navTarget, stats?.distance, initialDistance]);

  const progressPercent = useMemo(() => {
    if (!stats || !initialDistance) return 0;
    if (stats.distance >= initialDistance) return 0;
    const pct = Math.round(((initialDistance - stats.distance) / initialDistance) * 100);
    return Math.max(0, Math.min(99, pct));
  }, [stats?.distance, initialDistance]);

  const categoryColor = (catName: string): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '#f59e0b';
    if (c.includes('police') || c.includes('security')) return '#3b82f6';
    if (c.includes('medical') || c.includes('hospital')) return '#ef4444';
    if (c.includes('water') || c.includes('drink')) return '#06b6d4';
    if (c.includes('exit') || c.includes('gate')) return '#10b981';
    if (c.includes('parking')) return '#6366f1';
    if (c.includes('food') || c.includes('eat')) return '#f97316';
    return '#ef4444';
  };

  const categoryIconSvg = (catName: string, size: number = 10): string => {
    const c = (catName || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 22V10h-3V6a5 5 0 0 0-10 0v4H2v12"></path><path d="M6 10V6a3 3 0 0 1 6 0v4"></path></svg>`;
    }
    if (c.includes('police') || c.includes('security')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`;
    }
    if (c.includes('medical') || c.includes('hospital')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 5v14M5 12h14"></path></svg>`;
    }
    if (c.includes('water') || c.includes('drink')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z"></path></svg>`;
    }
    if (c.includes('exit') || c.includes('gate')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path></svg>`;
    }
    if (c.includes('parking')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M9 17V5h5a4 4 0 0 1 0 8H9"></path></svg>`;
    }
    if (c.includes('food') || c.includes('eat')) {
      return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><path d="M18 8A6 6 0 0 0 6 8c0 7 6 13 6 13s6-6 6-13z"></path><path d="M12 2v6M12 11h.01"></path></svg>`;
    }
    return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" style="transform:rotate(45deg);"><circle cx="12" cy="12" r="10"></circle></svg>`;
  };

  // Helper to determine if a POI is along the active route path
  const isPoiOnPath = (poi: any, path: any[]) => {
    if (!path || path.length === 0) return false;
    const lat = Number(poi.latitude);
    const lng = Number(poi.longitude);
    if (isNaN(lat) || isNaN(lng)) return false;

    // Find the minimum distance to any path node
    let minDist = Infinity;
    for (const node of path) {
      const dist = getHaversineDistance(lat, lng, Number(node.latitude), Number(node.longitude));
      if (dist < minDist) {
        minDist = dist;
      }
    }
    return minDist < 30; // 30 meters threshold
  };

  // Track user movements to derive walking bearing
  useEffect(() => {
    if (!userGps) return;
    if (!lastGpsRef.current) {
      lastGpsRef.current = userGps;
      return;
    }

    const dist = getHaversineDistance(
      lastGpsRef.current[0],
      lastGpsRef.current[1],
      userGps[0],
      userGps[1]
    );

    // Filter minor coordinate jitters
    if (dist > 1.5) {
      const newHeading = getCompassBearing(
        lastGpsRef.current[0],
        lastGpsRef.current[1],
        userGps[0],
        userGps[1]
      );
      setGpsHeading(newHeading);
      lastGpsRef.current = userGps;
    }
  }, [userGps]);

  // Real-time Left and Right POI quadrant calculations
  const nearestQuadrantPOIs = useMemo(() => {
    if (!poisList || poisList.length === 0) {
      return { left: null, right: null };
    }

    // Travel bearing heading vector
    let heading = 0;
    if (stats && typeof stats.bearing === 'number') {
      heading = stats.bearing;
    } else {
      heading = gpsHeading || deviceHeading || 0;
    }

    let nearestLeft: any = null;
    let nearestRight: any = null;

    let minLeftDist = Infinity;
    let minRightDist = Infinity;

    poisList.forEach((poi) => {
      // Don't show our active destination POI on the side quadrants
      if (navTarget && poi.id === navTarget.id) return;

      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const dist = getHaversineDistance(userGps[0], userGps[1], lat, lng);
      const absBearing = getCompassBearing(userGps[0], userGps[1], lat, lng);

      // Angle relative to our travel direction (0 to 360)
      const relativeAngle = (absBearing - heading + 360) % 360;

      // Classify into left and right boundaries (ignoring front/back)
      if (relativeAngle >= 45 && relativeAngle < 180) {
        // Right quadrant (45 to 180)
        if (dist < minRightDist) {
          minRightDist = dist;
          nearestRight = { ...poi, distance: Math.round(dist) };
        }
      } else if (relativeAngle >= 180 && relativeAngle < 315) {
        // Left quadrant (180 to 315)
        if (dist < minLeftDist) {
          minLeftDist = dist;
          nearestLeft = { ...poi, distance: Math.round(dist) };
        }
      }
    });

    return { left: nearestLeft, right: nearestRight };
  }, [poisList, userGps, navTarget, stats, gpsHeading, deviceHeading]);

  // Emoji category matcher
  const getCategoryEmoji = (category: string): string => {
    const c = (category || '').toLowerCase();
    if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '🚽';
    if (c.includes('police') || c.includes('security') || c.includes('post')) return '👮';
    if (c.includes('medical') || c.includes('hospital') || c.includes('health') || c.includes('first')) return '🏥';
    if (c.includes('water') || c.includes('drink')) return '💧';
    if (c.includes('exit') || c.includes('entrance') || c.includes('gate')) return '🚪';
    if (c.includes('parking')) return '🅿️';
    if (c.includes('food') || c.includes('eat') || c.includes('restaurant')) return '🍔';
    return '📍';
  };

  // Computes precise turn prompts at Dijkstra intersection junctions
  const getDetailedInstruction = () => {
    if (!navTarget || !stats) return t('noSafetyAlerts');

    const distanceVal = stats.distance;

    if (stats.isOffRoute) {
      if (stats.offRouteDistance && stats.offRouteDirectionText) {
        let dirTranslated = stats.offRouteDirectionText;
        if (stats.offRouteDirectionText.includes('Right')) dirTranslated = language === 'hi' ? 'दाएं ➔' : language === 'or' ? 'ଡାହାଣ ➔' : language === 'bn' ? 'ডান ➔' : 'Right ➔';
        else if (stats.offRouteDirectionText.includes('Left')) dirTranslated = language === 'hi' ? 'बाएं ⬅' : language === 'or' ? 'ବାମ ⬅' : language === 'bn' ? 'বাম ⬅' : 'Left ⬅';
        else if (stats.offRouteDirectionText.includes('Around')) dirTranslated = language === 'hi' ? 'पीछे ⬇' : language === 'or' ? 'ପଛକୁ ⬇' : language === 'bn' ? 'পেছনে ⬇' : 'Around ⬇';
        else if (stats.offRouteDirectionText.includes('Straight')) dirTranslated = language === 'hi' ? 'सीधे ⬆' : language === 'or' ? 'ସିଧା ⬆' : language === 'bn' ? 'সোজা ⬆' : 'Straight ⬆';

        if (language === 'hi') return `निकटतम पथ में शामिल होने के लिए ${stats.offRouteDistance} मीटर ${dirTranslated} चलें।`;
        if (language === 'or') return `ନିକଟତମ ପଥରେ ଯୋଗଦେବା ପାଇଁ ${stats.offRouteDistance} ମିଟର ${dirTranslated} ଚାଲନ୍ତୁ |`;
        if (language === 'bn') return `নিকটবর্তী পথে যোগ দিতে ${stats.offRouteDistance} মিটার ${dirTranslated} হাঁটুন।`;
        return `Move ${stats.offRouteDistance}m ${dirTranslated} to join nearest path.`;
      }
      if (language === 'hi') return `[${stats.targetNodeName}] पर मार्ग में शामिल होने के लिए ${distanceVal} मीटर चलें`;
      if (language === 'or') return `[${stats.targetNodeName}] ଠାରେ ପଥରେ ଯୋଗଦେବା ପାଇଁ ${distanceVal} ମିଟର ଚାଲନ୍ତୁ`;
      if (language === 'bn') return `[${stats.targetNodeName}] এ রুটে যোগ দিতে ${distanceVal} মিটার হাঁটুন`;
      return `Walk ${distanceVal}m to join route at [${stats.targetNodeName}]`;
    }

    const path = stats.pathNodes || [];
    if (path.length > 2) {
      // Relative bearing comparison to detect turn transitions
      const b1 = getCompassBearing(path[0].latitude, path[0].longitude, path[1].latitude, path[1].longitude);
      const b2 = getCompassBearing(path[1].latitude, path[1].longitude, path[2].latitude, path[2].longitude);
      const relative = (b2 - b1 + 360) % 360;

      let turnText = "";
      if (relative > 45 && relative <= 135) turnText = language === 'hi' ? ", फिर दाएं मुड़ें" : language === 'or' ? ", ପରେ ଡାହାଣକୁ ବୁଲନ୍ତୁ" : language === 'bn' ? ", তারপর ডানদিকে ঘুরুন" : ", then turn RIGHT";
      else if (relative > 225 && relative <= 315) turnText = language === 'hi' ? ", फिर बाएं मुड़ें" : language === 'or' ? ", ପରେ ବାମକୁ ବୁଲନ୍ତୁ" : language === 'bn' ? ", তারপর বামদিকে ঘুরুন" : ", then turn LEFT";
      else if (relative > 135 && relative <= 225) turnText = language === 'hi' ? ", फिर पीछे मुड़ें" : language === 'or' ? ", ପରେ ପଛକୁ ବୁଲନ୍ତୁ" : language === 'bn' ? ", তারপর পেছনে ঘুরুন" : ", then turn AROUND";

      if (language === 'hi') return `[${stats.targetNodeName}] तक ${distanceVal} मीटर सीधे चलें${turnText}`;
      if (language === 'or') return `[${stats.targetNodeName}] ପର୍ଯ୍ୟନ୍ତ ${distanceVal} ମିଟର ସିଧା ଚାଲନ୍ତୁ${turnText}`;
      if (language === 'bn') return `[${stats.targetNodeName}] পর্যন্ত ${distanceVal} মিটার সোজা হাঁটুন${turnText}`;
      return `Walk ${distanceVal}m straight to [${stats.targetNodeName}]${turnText}`;
    } else if (path.length === 2) {
      if (language === 'hi') return `[${stats.targetNodeName}] तक ${distanceVal} मीटर सीधे चलें, फिर गंतव्य की ओर बढ़ें`;
      if (language === 'or') return `[${stats.targetNodeName}] ପର୍ଯ୍ୟନ୍ତ ${distanceVal} ମିଟର ସିଧା ଚାଲନ୍ତୁ, ପରେ ଗନ୍ତବ୍ୟ ସ୍ଥଳକୁ ଯାଆନ୍ତୁ`;
      if (language === 'bn') return `[${stats.targetNodeName}] পর্যন্ত ${distanceVal} মিটার সোজা হাঁটুন, তারপর গন্তব্যের দিকে যান`;
      return `Walk ${distanceVal}m straight to [${stats.targetNodeName}], then head to destination`;
    } else {
      if (language === 'hi') return `${tPoiName(navTarget)} तक अंतिम ${distanceVal} मीटर चलें`;
      if (language === 'or') return `${tPoiName(navTarget)} ପର୍ଯ୍ୟନ୍ତ ଶେଷ ${distanceVal} ମିଟର ଚାଲନ୍ତୁ`;
      if (language === 'bn') return `${tPoiName(navTarget)} পর্যন্ত শেষ ${distanceVal} মিটার হাঁটুন`;
      return `Walk final ${distanceVal}m to ${tPoiName(navTarget)}`;
    }
  };

  // Bind Leaflet object on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).L) {
      LRef.current = (window as any).L;
    }
  }, [leafletLoaded]);

  // Leaflet Map Setup effect
  useEffect(() => {
    if (!leafletLoaded || typeof window === 'undefined' || !navTarget) return;
    const L = LRef.current || (window as any).L;
    if (!L) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      userMarkerRef.current = null;
      userAccuracyCircleRef.current = null;
      activeRouteLayerRef.current = null;
      offRouteConnectorRef.current = null;
      poiMarkersLayerRef.current = null;
    }

    const map = L.map('navigation-split-map-canvas', {
      zoomControl: false,
      attributionControl: false
    }).setView(userGps, 17);
    mapRef.current = map;

    // Listen to zoom level changes
    map.on('zoomend', () => {
      setMapZoom(map.getZoom());
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Event boundary overlay
    if (selectedEvent) {
      const { north, south, east, west } = selectedEvent;
      if (north && south && east && west) {
        const bounds = [[Number(south), Number(west)], [Number(north), Number(east)]];
        L.rectangle(bounds, {
          color: '#10b981',
          weight: 2,
          fill: true,
          fillColor: '#10b981',
          fillOpacity: 0.03,
          dashArray: '5, 8'
        }).addTo(map);
      }
    }

    // User GPS location pin
    const gpsIcon = L.divIcon({
      html: `
        <div style="position:relative;display:flex;align-items:center;justify-content:center;">
          <span style="position:absolute;width:24px;height:24px;border-radius:50%;background:rgba(6,182,212,0.4);animation:ping 1.2s cubic-bezier(0,0,0.2,1) infinite;"></span>
          <div style="position:relative;width:16px;height:16px;border-radius:50%;background:#06b6d4;border:3px solid white;box-shadow:0 0 8px #06b6d4;"></div>
        </div>
      `,
      className: '',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    const userMarker = L.marker(userGps, { icon: gpsIcon, zIndexOffset: 1000 }).addTo(map);
    userMarkerRef.current = userMarker;

    // Accuracy ring
    const initialCircleColor = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
    const accuracyCircle = L.circle(userGps, {
      radius: gpsAccuracy || 15,
      color: initialCircleColor,
      fillColor: initialCircleColor,
      fillOpacity: 0.06,
      weight: 1
    }).addTo(map);
    userAccuracyCircleRef.current = accuracyCircle;

    // Layer group for network route grid
    const networkLayer = L.layerGroup().addTo(map);
    routeLayerRef.current = networkLayer;

    // Draw full waypoint grid network reference lines removed to keep active navigation view clean without low opacity blue lines

    routeNodes.forEach((node) => {
      const lat = Number(node.latitude);
      const lng = Number(node.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      if (node.is_entrance) {
        L.circleMarker([lat, lng], {
          radius: 5,
          fillColor: '#8b5cf6',
          color: '#fff',
          weight: 1,
          fillOpacity: 0.8
        }).addTo(networkLayer);
      } else {
        L.circleMarker([lat, lng], {
          radius: 3,
          fillColor: '#0891b2',
          color: '#fff',
          weight: 0.8,
          fillOpacity: 0.8
        }).addTo(networkLayer);
      }
    });

    const destLat = Number(navTarget.latitude);
    const destLng = Number(navTarget.longitude);
    if (!isNaN(destLat) && !isNaN(destLng)) {
      const color = categoryColor(navTarget.category_name);
      const poiIcon = L.divIcon({
        html: `
          <div style="
            background:${color};
            width:26px;height:26px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:2px solid rgba(0,0,0,0.6);
            box-shadow:0 2px 6px rgba(0,0,0,0.5);
            display:flex;align-items:center;justify-content:center;
          ">
            ${categoryIconSvg(navTarget.category_name)}
          </div>
        `,
        className: '',
        iconSize: [26, 26],
        iconAnchor: [8, 26]
      });

      L.marker([destLat, destLng], { icon: poiIcon })
        .addTo(map)
        .bindPopup(`<strong>${navTarget.name_en}</strong>`);
    }

    activeRouteLayerRef.current = L.layerGroup().addTo(map);
    poiMarkersLayerRef.current = L.layerGroup().addTo(map);

    // Initial path drawing
    if (stats && stats.pathNodes) {
      drawActiveRoute(L, stats.pathNodes);
    }

    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize({ animate: false });
        mapRef.current.panTo(userGps);
      }
    }, 150);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        userMarkerRef.current = null;
        userAccuracyCircleRef.current = null;
        activeRouteLayerRef.current = null;
        offRouteConnectorRef.current = null;
        poiMarkersLayerRef.current = null;
      }
    };
  }, [leafletLoaded, selectedEvent, navTarget]);

  // Render and update secondary POI markers based on zoom and path proximity
  useEffect(() => {
    const L = LRef.current || (window as any).L;
    if (!L || !mapRef.current || !poiMarkersLayerRef.current) return;

    const poiMarkersLayer = poiMarkersLayerRef.current;
    poiMarkersLayer.clearLayers();

    if (!poisList) return;

    const path = stats?.pathNodes || [];

    poisList.forEach((poi: any) => {
      // Skip the active navigation target POI
      if (navTarget && poi.id === navTarget.id) return;

      const lat = Number(poi.latitude);
      const lng = Number(poi.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const onPath = isPoiOnPath(poi, path);
      // Zoom out (<16) shows all POIs. Zoom in (>=16) shows only POIs on path.
      const shouldShow = mapZoom < 16 || onPath;

      if (shouldShow) {
        const color = categoryColor(poi.category_name);
        const iconSize = onPath ? 22 : 18;
        const iconAnchor = onPath ? 11 : 9;
        
        const poiIcon = L.divIcon({
          html: `
            <div style="
              background: ${color};
              width: ${iconSize}px; height: ${iconSize}px; border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
              display: flex; align-items: center; justify-content: center;
              opacity: ${onPath ? 1 : 0.75};
              transition: all 0.2s;
            ">
              ${categoryIconSvg(poi.category_name, onPath ? 10 : 8)}
            </div>
          `,
          className: '',
          iconSize: [iconSize, iconSize],
          iconAnchor: [iconAnchor, iconAnchor]
        });

        L.marker([lat, lng], { icon: poiIcon })
          .addTo(poiMarkersLayer)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; color: #333; padding: 2px;">
              <strong>${poi.name_en}</strong>
              ${onPath ? '<div style="color: #16a34a; font-weight: bold; margin-top: 4px; font-size: 10px;">On your path</div>' : ''}
            </div>
          `);
      }
    });
  }, [poisList, stats?.pathNodes, mapZoom, navTarget]);

  // Recenter map on active updates
  useEffect(() => {
    if (!userMarkerRef.current || !mapRef.current) return;
    userMarkerRef.current.setLatLng(userGps);
    if (userAccuracyCircleRef.current) {
      userAccuracyCircleRef.current.setLatLng(userGps);
      if (gpsAccuracy !== null) {
        userAccuracyCircleRef.current.setRadius(gpsAccuracy);
      }
      const color = gpsStatus === 'locked' ? '#10b981' : gpsStatus === 'searching' ? '#f59e0b' : '#ef4444';
      userAccuracyCircleRef.current.setStyle({
        color: color,
        fillColor: color
      });
    }

    mapRef.current.panTo(userGps);
  }, [userGps, gpsAccuracy, gpsStatus]);

  useEffect(() => {
    const L = LRef.current || (window as any).L;
    if (!L || !mapRef.current) return;

    if (offRouteConnectorRef.current) {
      offRouteConnectorRef.current.remove();
      offRouteConnectorRef.current = null;
    }

    if (!stats || !stats.isOffRoute || !stats.pathNodes || stats.pathNodes.length < 2) return;

    let minDist = Infinity;
    let nearestPoint: { lat: number; lng: number } | null = null;

    for (let i = 0; i < stats.pathNodes.length - 1; i++) {
      const start = stats.pathNodes[i];
      const end = stats.pathNodes[i + 1];
      const startLat = Number(start.latitude);
      const startLng = Number(start.longitude);
      const endLat = Number(end.latitude);
      const endLng = Number(end.longitude);
      if (isNaN(startLat) || isNaN(startLng) || isNaN(endLat) || isNaN(endLng)) continue;

      const point = getClosestPointOnSegment(userGps[0], userGps[1], startLat, startLng, endLat, endLng);
      const dist = getHaversineDistance(userGps[0], userGps[1], point.lat, point.lng);
      if (dist < minDist) {
        minDist = dist;
        nearestPoint = point;
      }
    }

    if (!nearestPoint || minDist <= 20) return;

    offRouteConnectorRef.current = L.polyline([
      userGps,
      [nearestPoint.lat, nearestPoint.lng]
    ], {
      color: '#f97316',
      weight: 4,
      opacity: 0.9,
      dashArray: '8, 8',
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(mapRef.current);
  }, [stats?.isOffRoute, stats?.pathNodes, userGps, leafletLoaded]);

  // Force map size checks on expand/collapse size change
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current.invalidateSize({ animate: true });
        mapRef.current.panTo(userGps);
      }, 150);
    }
  }, [isMapExpanded, userGps]);

  // Redraw route highlighting when GPS or nodes update
  useEffect(() => {
    const L = LRef.current || (window as any).L;
    if (L && activeRouteLayerRef.current && stats && stats.pathNodes) {
      drawActiveRoute(L, stats.pathNodes);
    }
  }, [stats?.pathNodes]);

  const drawActiveRoute = (L: any, path: any[]) => {
    if (!activeRouteLayerRef.current || !L) return;
    activeRouteLayerRef.current.clearLayers();

    if (path && path.length > 0) {
      const latlngs = path.map((n: any) => [Number(n.latitude), Number(n.longitude)]);
      
      // Keep the active route as a visible 20m corridor, not just a thin line.
      L.polyline(latlngs, {
        color: '#10b981',
        weight: 40,
        opacity: 0.12,
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
      
      // Dashed white fill line
      L.polyline(latlngs, {
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        dashArray: '4, 8',
        lineJoin: 'round',
        lineCap: 'round'
      }).addTo(activeRouteLayerRef.current);
    }
  };

  const arrivalTimeStr = useMemo(() => {
    if (!stats) return '--:--';
    const now = new Date();
    now.setSeconds(now.getSeconds() + stats.time);
    const hrs = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  }, [stats?.time]);

  if (!navTarget || !stats) return null;

  const renderGpsStatusPill = () => {
    if (gpsStatus === 'locked') {
      return (
        <GPSLockedPill>
          <span className="dot"></span>
          <span>Locked ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Good'})</span>
        </GPSLockedPill>
      );
    } else if (gpsStatus === 'searching') {
      return (
        <GPSSearchingPill>
          <span className="dot"></span>
          <span>Searching GPS... ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'Weak'})</span>
        </GPSSearchingPill>
      );
    } else {
      return (
        <GPSLostPill>
          <span className="dot"></span>
          <span>No GPS ({gpsAccuracy ? `${Math.round(gpsAccuracy)}m` : 'No Signal'})</span>
        </GPSLostPill>
      );
    }
  };

  return (
    <NavContainer>
      
      {/* Waiting for GPS Lock Bypass Modal */}
      {gpsStatus !== 'locked' && (
        <Overlay>
          <OverlayBox>
            <CenterBox>
              <WarningIconWrapper>
                <StyledCompassIcon />
              </WarningIconWrapper>
            </CenterBox>
            <OverlayTitle>{t('waitingForGps')}</OverlayTitle>
            <OverlayText>
              {t('gpsRequiredDesc')}
            </OverlayText>
            <OverlayPillWrapper>
              {renderGpsStatusPill()}
            </OverlayPillWrapper>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
              <BypassButton 
                onClick={() => handleGpsUpdate({
                  coords: { latitude: userGps[0], longitude: userGps[1], accuracy: 12 },
                  timestamp: Date.now()
                })}
              >
                {t('forceMockGps')}
              </BypassButton>
              <StopButton
                onClick={() => {
                  setNavTarget(null);
                  setScreenMode('pois');
                  setIsWalking(false);
                  router.push('/user-test-page/pois');
                }}
              >
                {t('stopNavigation')}
              </StopButton>
            </div>
          </OverlayBox>
        </Overlay>
      )}

      {arrivalNotify && (
        <ArrivalOverlay>
          <StyledPartyPopper />
          <ArrivalTitle>{t('destinationReached')}</ArrivalTitle>
          <ArrivalText>{t('arrivedSafelyAt')} {tPoiName(navTarget)}.</ArrivalText>
          <ArrivalButton
            onClick={() => {
              setNavTarget(null);
              setScreenMode('pois');
              setIsWalking(false);
              setArrivalNotify(false);
              router.push('/user-test-page/pois');
            }}
          >
            {t('returnToPoiList')}
          </ArrivalButton>
        </ArrivalOverlay>
      )}

      {/* Main Map & Floating Redesigned UI */}
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', flexGrow: 1 }}>
        <MapCanvas id="navigation-split-map-canvas" />

        {/* Top Floating Header Controls */}
        <FloatingHeaderWrapper>
          <FloatingHeaderPillRow>
            <OfflineActivePill>
              <span className="dot"></span>
              <span>{t('offlineNavigationActive')}</span>
            </OfflineActivePill>
            
            {gpsStatus === 'locked' ? (
              <GpsStrongPill>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#0288d1' }} />
                <span>{t('gpsStrong')}</span>
              </GpsStrongPill>
            ) : gpsStatus === 'searching' ? (
              <GpsStrongPill style={{ background: '#FCF2E7', color: '#B7791F' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#B7791F', animation: 'ping 1s infinite' }} />
                <span>{t('searchingGps')}</span>
              </GpsStrongPill>
            ) : (
              <GpsStrongPill style={{ background: '#FEE2E2', color: '#EF4444' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#EF4444' }} />
                <span>{t('noGpsSignal')}</span>
              </GpsStrongPill>
            )}
          </FloatingHeaderPillRow>

          <UnifiedStatusCard>
            <UnifiedStatusHeader $isOffPath={stats.isOffRoute}>
              {stats.isOffRoute ? t('offPath') : t('onPath')}
            </UnifiedStatusHeader>
            <UnifiedStatusBody>
              {getArrowIcon(stats.directionText)}
              <span>{getDetailedInstruction()}</span>
            </UnifiedStatusBody>
          </UnifiedStatusCard>
        </FloatingHeaderWrapper>

        {/* Bottom Floating Card & Secondary Actions */}
        <FloatingBottomWrapper>
          <FloatingControlsRow>
            <FloatingSimulateButton
              onClick={handleSimulateWalking}
              disabled={isWalking || arrivalNotify}
            >
              {isWalking ? t('walking') : t('simulateWalk')}
            </FloatingSimulateButton>
            
            <FloatingLocateButton
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const DeviceOrientationEventAny = (window as any).DeviceOrientationEvent;
                  if (DeviceOrientationEventAny && typeof DeviceOrientationEventAny.requestPermission === 'function') {
                    await DeviceOrientationEventAny.requestPermission();
                  }
                } catch (err) {
                  console.warn('Failed compass permission request:', err);
                }

                const pos = await getRealGps();
                if (pos) {
                  setUserGps(pos);
                  if (mapRef.current) mapRef.current.setView(pos, 17);
                } else if (mapRef.current) {
                  mapRef.current.setView(userGps, 17);
                }
              }}
              title="Recenter on my location"
            >
              <Navigation style={{ width: '1.2rem', height: '1.2rem', transform: 'rotate(45deg)' }} />
            </FloatingLocateButton>
          </FloatingControlsRow>

          <PremiumBottomCard>
            <BottomCardProgressHeader>
              <BottomCardDestinationText>{tPoiName(navTarget)}</BottomCardDestinationText>
              <BottomCardPercentageText>{progressPercent}% {t('complete')}</BottomCardPercentageText>
            </BottomCardProgressHeader>

            <BottomProgressBarContainer>
              <BottomProgressBarFill $percent={progressPercent} />
            </BottomProgressBarContainer>

            <BottomMetricsRow>
              <BottomMetricCol>
                <BottomMetricLabel>{t('arrival')}</BottomMetricLabel>
                <BottomMetricValue className="arrival-time">{arrivalTimeStr}</BottomMetricValue>
              </BottomMetricCol>

              <BottomMetricCol>
                <BottomMetricLabel>{t('time')}</BottomMetricLabel>
                <BottomMetricValue>
                  {stats.time < 60 
                    ? `${stats.time} ${language === 'hi' ? 'सेकंड' : language === 'or' ? 'ସେକେଣ୍ଡ' : language === 'bn' ? 'সেকেন্ড' : 'sec'}` 
                    : `${Math.ceil(stats.time / 60)} ${language === 'hi' ? 'मिनट' : language === 'or' ? 'ମିନିଟ୍' : language === 'bn' ? 'মিনিট' : 'min'}`}
                </BottomMetricValue>
              </BottomMetricCol>

              <BottomMetricCol>
                <BottomMetricLabel>{t('distance')}</BottomMetricLabel>
                <BottomMetricValue>
                  {stats.distance < 1000 
                    ? `${stats.distance} ${language === 'hi' ? 'मीटर' : language === 'or' ? 'ମିଟର' : language === 'bn' ? 'মিটার' : 'm'}` 
                    : `${(stats.distance / 1000).toFixed(2)} ${language === 'hi' ? 'किमी' : language === 'or' ? 'କିମି' : language === 'bn' ? 'কিমি' : 'km'}`}
                </BottomMetricValue>
              </BottomMetricCol>
            </BottomMetricsRow>

            <BottomActionsRow>
              <BottomVoiceButton $active={voiceOn} onClick={() => setVoiceOn(!voiceOn)}>
                {voiceOn ? (
                  <Volume2 style={{ width: '1.1rem', height: '1.1rem' }} />
                ) : (
                  <VolumeX style={{ width: '1.1rem', height: '1.1rem' }} />
                )}
                <span>{voiceOn ? t('voiceOn') : t('voiceOff')}</span>
              </BottomVoiceButton>

              <BottomExitButton
                onClick={() => {
                  if (confirm(t('confirmExitNav'))) {
                    setNavTarget(null);
                    setScreenMode('pois');
                    setIsWalking(false);
                    router.push('/user-test-page/pois');
                  }
                }}
              >
                <LogOut style={{ width: '1rem', height: '1rem' }} />
                <span>{t('exit')}</span>
              </BottomExitButton>
            </BottomActionsRow>
          </PremiumBottomCard>
        </FloatingBottomWrapper>

      </div>
    </NavContainer>
  );
}
