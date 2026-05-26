
// OPTION 1: USB TETHERING (Android phone connected to PC via USB tethering)
// export const BASE_URL = 'http://192.168.42.129:5000/api/';

// OPTION 2: ANDROID EMULATOR (host machine localhost)
// export const BASE_URL = 'http://10.0.2.2:5000/api/';

// OPTION 3: LOCAL NETWORK (phone and PC on same WiFi)
// export const BASE_URL = 'http://192.168.1.100:5000/api/';

// OPTION 4: WEB BROWSER DEV
// export const BASE_URL = 'http://localhost:5000/api/';

// ACTIVE: reads from localStorage at runtime so it's configurable in-app without rebuilding
export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mm_test_backend_url');
    if (saved) return saved.replace(/\/+$/, '') + '/api/';
  }
  return process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '') + '/api/'
    : 'https://api-wp-events.infoviz.co/api/';
};
