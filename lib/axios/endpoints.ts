import { getBaseUrl } from './config';

// getBaseUrl() returns Base URL with trailing slash, e.g. "https://api-wp-events.infoviz.co/api/"
// We clean it up by removing the trailing slash.
const getBase = (): string => {
  return getBaseUrl().replace(/\/+$/, '');
};

export const API_ENDPOINTS = {
  events: {
    get base() { return `${getBase()}/events`; },
    pois: (eventId: string) => `${getBase()}/pois?eventId=${eventId}`,
    routes: (eventId: string) => `${getBase()}/events/${eventId}/routes`,
    advisories: (eventId: string) => `${getBase()}/events/${eventId}/advisories`,
    zones: (eventId: string) => `${getBase()}/events/${eventId}/zones`,
  },
  notifications: {
    get register() { return `${getBase()}/notifications/register`; },
    eventAlerts: (eventId: string) => `${getBase()}/notifications/events/${eventId}`,
  },
};
