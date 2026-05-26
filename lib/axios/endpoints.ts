import { getBaseUrl } from './config';

// getBaseUrl() returns Base URL with trailing slash, e.g. "https://api-wp-events.infoviz.co/api/"
// We clean it up by removing the trailing slash.
const getBase = (): string => {
  return getBaseUrl().replace(/\/+$/, '');
};

export const API_ENDPOINTS = {
  auth: {
    get sendOtp() { return `${getBase()}/auth/send-otp`; },
    get verifyOtp() { return `${getBase()}/auth/verify-otp`; },
    get refreshToken() { return `${getBase()}/auth/refresh-token`; },
    get logout() { return `${getBase()}/auth/logout`; },
  },
  profile: {
    get updateProfile() { return `${getBase()}/profile/update-profile`; },
    get getProfile() { return `${getBase()}/profile/get-profile`; },
    get setPresetWallpaper() { return `${getBase()}/profile/preset-wallpaper`; },
    get uploadCustomWallpaper() { return `${getBase()}/profile/custom-wallpaper`; },
    hero: (coupleId: string) => `${getBase()}/profile/hero/${coupleId}`,
    stats: (coupleId: string) => `${getBase()}/profile/stats/${coupleId}`,
  },
  wallpapers: {
    get getPresets() { return `${getBase()}/wallpapers/presets`; },
  },
  events: {
    get base() { return `${getBase()}/events`; },
    byId: (id: string) => `${getBase()}/events/${id}`,
    eventsByToken: (token: string) => `${getBase()}/event?token=${token}`,
    get generateFullAccess() { return `${getBase()}/generate-full-access`; },
    get generateCustomAccess() { return `${getBase()}/generate-custom-access`; },
    welcomeByToken: (token: string) => `${getBase()}/event/welcome?token=${token}`,
    get entry() { return `${getBase()}/event/entry`; },
    // Custom/extra event endpoints used in the user-test-page
    pois: (eventId: string) => `${getBase()}/pois?eventId=${eventId}`,
    routes: (eventId: string) => `${getBase()}/events/${eventId}/routes`,
  },
  blessings: {
    get adminMyBlessings() { return `${getBase()}/blessings/admin/my-blessings`; },
    adminPinBlessing: (blessingId: string) => `${getBase()}/blessings/admin/pin/${blessingId}`,
    pinnedByCouple: (coupleId: string) => `${getBase()}/blessings/${coupleId}`,
    allByCouple: (coupleId: string) => `${getBase()}/blessings/all/${coupleId}`,
    create: (coupleId: string) => `${getBase()}/blessings/${coupleId}`,
    like: (blessingId: string) => `${getBase()}/blessings/like/${blessingId}`,
  },
  media: {
    get adminMyMedia() { return `${getBase()}/media/admin/my-media`; },
    adminPinMedia: (mediaId: string) => `${getBase()}/media/admin/pin/${mediaId}`,
    pinnedByCouple: (coupleId: string) => `${getBase()}/media/${coupleId}`,
    allByCouple: (coupleId: string) => `${getBase()}/media/all/${coupleId}`,
    uploadMedia: (coupleId: string) => `${getBase()}/media/${coupleId}`,
    like: (mediaId: string) => `${getBase()}/media/like/${mediaId}`,
  },
  paymentSetup: {
    get upi() { return `${getBase()}/payment-setup/upi`; },
    publicUpi: (coupleId: string) => `${getBase()}/payment-setup/upi/public/${coupleId}`,
    get bank() { return `${getBase()}/payment-setup/bank`; },
  },
  notifications: {
    getHistory: (coupleId: string, token?: string) => `${getBase()}/notifications?coupleId=${coupleId}${token ? `&token=${token}` : ''}`,
    get registerDevice() { return `${getBase()}/devices/register`; },
    // Custom/legacy registration and event alert endpoints used in the user-test-page
    get register() { return `${getBase()}/notifications/register`; },
    eventAlerts: (eventId: string) => `${getBase()}/notifications/events/${eventId}`,
  },
  music: {
    get getLibrary() { return `${getBase()}/music-library`; },
    get updateMusic() { return `${getBase()}/profile/music`; },
  },
  admins: {
    base: (coupleId: string) => `${getBase()}/couples/${coupleId}/admins`,
    verify: (coupleId: string) => `${getBase()}/couples/${coupleId}/admins/verify`,
    remove: (coupleId: string, userId: string) => `${getBase()}/couples/${coupleId}/admins/${userId}`,
  },
};
