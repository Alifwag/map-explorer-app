const CACHE_VERSION = 'mapexplorer-v2';
const DYNAMIC_CACHE = 'mapexplorer-dynamic-v2';
const API_CACHE = 'mapexplorer-api-v2';

// Asset yang di-cache saat install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/logo192.png',
  '/logo512.png',
  '/og-image.jpg',
  '/apple-touch-icon.png'
];

// Install Service Worker
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => {
            return name !== CACHE_VERSION && 
                   name !== DYNAMIC_CACHE && 
                   name !== API_CACHE;
          })
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Claiming clients');
      return self.clients.claim();
    })
  );
});

// Strategy: Network First, fallback to cache
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw error;
  }
};

// Strategy: Cache First, fallback to network
const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_VERSION);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return new Response('Offline - Please check your connection', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

// Fetch handler
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // API requests - Network first
  if (url.pathname.includes('/api/') || url.hostname.includes('api.')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Static assets - Cache first
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Navigation - Network first
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Default - Network first
  event.respondWith(networkFirst(request));
});

// Push Notification
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'Update from MapExplorer',
    icon: '/logo192.png',
    badge: '/favicon-32x32.png',
    vibrate: [200, 100, 200],
    tag: 'mapexplorer-notif',
    renotify: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ],
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('MapExplorer', options)
  );
});

// Notification Click
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// Background Sync
self.addEventListener('sync', event => {
  if (event.tag === 'sync-location') {
    event.waitUntil(syncLocationData());
  }
  
  if (event.tag === 'sync-trips') {
    event.waitUntil(syncTripData());
  }
});

// Sync functions
async function syncLocationData() {
  try {
    const data = await getLocalData('pending-locations');
    if (data?.length > 0) {
      await fetch('/api/sync/locations', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      await clearLocalData('pending-locations');
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

async function syncTripData() {
  try {
    const data = await getLocalData('pending-trips');
    if (data?.length > 0) {
      await fetch('/api/sync/trips', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      await clearLocalData('pending-trips');
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Helper: Get data from IndexedDB
async function getLocalData(key) {
  // Implement IndexedDB read
  return [];
}

// Helper: Clear data from IndexedDB
async function clearLocalData(key) {
  // Implement IndexedDB clear
}

// Periodic Background Sync
self.addEventListener('periodicsync', event => {
  if (event.tag === 'update-location') {
    event.waitUntil(updateBackgroundLocation());
  }
});

async function updateBackgroundLocation() {
  // Update lokasi di background
  console.log('[SW] Background location update');
}

console.log('[SW] MapExplorer Service Worker ready! 🚀');

