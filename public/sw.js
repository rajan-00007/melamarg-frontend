const CACHE_NAME = 'melamarg-cache-v2';
const ASSETS_TO_CACHE = [
  '/melamarg',
  '/manifest.json',
  '/favicon.ico',
  '/leaflet/leaflet.js',
  '/leaflet/leaflet.css',
  '/rathyatra_banner.png',
  '/kumbhmela_banner.png',
  '/baliyatra_banner.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Helper to fetch with a network timeout
function fetchWithTimeout(request, timeoutMs = 4000) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Network request timed out'));
    }, timeoutMs);

    fetch(request).then(
      (response) => {
        clearTimeout(timeoutId);
        resolve(response);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    );
  });
}

// Safari redirection bug fix: clean response to remove the "redirected" flag
function cleanResponse(response) {
  if (!response || !response.redirected) return response;
  
  // Construct a new response from the original body, ignoring the redirected flag
  const headers = new Headers(response.headers);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
}

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

// Fetch Event: Optimized routing and caching strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Bypass service worker for hot-reloading / development endpoints
  if (
    url.pathname.startsWith('/_next/webpack-hmr') ||
    url.pathname.indexOf('hot-update') !== -1 ||
    url.pathname.startsWith('/__next')
  ) {
    return;
  }

  // 1. Navigation requests (HTML documents)
  // Use Network First with a fast timeout, falling back to cached root '/' (App Shell)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetchWithTimeout(event.request, 4000)
        .then((response) => {
          if (response && response.status === 200) {
            const responseToCache = cleanResponse(response.clone());
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch((err) => {
          console.log('[SW] Navigation failed. Falling back to App Shell.', err);
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/melamarg');
          });
        })
    );
    return;
  }

  // 2. OpenStreetMap Map Tiles (Cache-First)
  // Tiles do not change and are critical for offline mapping
  const isOpenStreetMapTile = url.hostname.includes('tile.openstreetmap.org');
  if (isOpenStreetMapTile) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then((response) => {
            // Cache successful or opaque (cross-origin) tile responses
            if (response && (response.status === 200 || response.status === 0)) {
              const responseToCache = cleanResponse(response.clone());
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch((err) => {
            console.warn('[SW] Offline. Failed to fetch OSM tile:', url.pathname, err);
            return new Response('', { status: 404, statusText: 'Offline' });
          });
      })
    );
    return;
  }

  // 3. Static assets & Local files (Stale-While-Revalidate)
  // Speeds up reload times dramatically on slow/congested networks
  const isStaticAsset = 
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/leaflet/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.ico');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = cleanResponse(networkResponse.clone());
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch((err) => {
            console.warn('[SW] Background fetch failed for:', url.pathname, err);
          });
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 4. Default API & Dynamic requests (Network First, Cache Fallback with Timeout)
  event.respondWith(
    fetchWithTimeout(event.request, 5000)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = cleanResponse(response.clone());
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch((err) => {
        console.log('[SW] Network request failed. Falling back to cache:', url.pathname, err);
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          throw err;
        });
      })
  );
});

