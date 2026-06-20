
// OPTION 1: USB TETHERING (Android phone connected to PC via USB tethering)
// export const BASE_URL = 'http://192.168.42.129:5000/api/';

// OPTION 2: ANDROID EMULATOR (host machine localhost)
// export const BASE_URL = 'http://10.0.2.2:5000/api/';

// OPTION 3: LOCAL NETWORK (phone and PC on same WiFi)
// export const BASE_URL = 'http://192.168.1.100:5000/api/'; https://api-wp-events.infoviz.co/api/

// OPTION 4: WEB BROWSER DEV
export const BASE_URL = 'http://localhost:5000/api/';

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('mm_test_backend_url');
    if (saved && !saved.includes('localhost:5000') && !saved.includes('127.0.0.1:5000')) {
      const cleaned = saved.replace(/\/+$/, '');
      return cleaned.endsWith('/api') ? cleaned + '/' : cleaned + '/api/';
    }
  }
  if (process.env.NEXT_PUBLIC_API_URL) {
    const cleaned = process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
    return cleaned.endsWith('/api') ? cleaned + '/' : cleaned + '/api/';
  }
  return 'http://localhost:5000/api/';
};

