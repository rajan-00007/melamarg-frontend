import axios from 'axios';
import { getBaseUrl } from './config';

// Create axios instance — baseURL is resolved fresh on every request via
// the interceptor below so URL changes in the UI take effect immediately.
const axiosClient = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: resolve the base URL fresh from localStorage each time.
// This is identical to the pattern in wp-restroom and ensures that whatever
// URL the user sets in the UI is used without needing a page reload.
axiosClient.interceptors.request.use(
  (config) => {
    const baseUrl = getBaseUrl();
    // Set baseURL dynamically so every request uses the latest saved URL
    config.baseURL = baseUrl;
    const requestUrl = config.url?.startsWith('http://') || config.url?.startsWith('https://')
      ? config.url
      : baseUrl + (config.url || '');
    console.log('[axiosClient] Request →', requestUrl);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: log errors for debugging
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('[axiosClient] Response error:', error.response.status, error.response.data);
    } else {
      console.error('[axiosClient] Network error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
