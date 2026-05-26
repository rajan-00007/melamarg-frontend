const CACHE_NAME = 'melamarg-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// Install Event: cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network First, Cache Fallback strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Bypass service worker for hot-reloading / development endpoints
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.indexOf('hot-update') !== -1 ||
    url.pathname.startsWith('/__next')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If the response is valid and same-origin (basic), cache/update it
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails (e.g., offline), fallback to the cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache match, propagate the error (do not return undefined!)
          throw new Error('Network request failed and no cached response available');
        });
      })
  );
});
