const CACHE_NAME = 'park-pro-active-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/logo.png',
  '/logo-192.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[SW] Some assets failed to cache:', err);
        });
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip Firebase and other API requests
  if (event.request.url.includes('firestore') || 
      event.request.url.includes('googleapis') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          // Only cache valid responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            }).catch(err => console.warn('[SW] Cache put error:', err));
          }
          return response;
        })
        .catch((err) => {
          console.log('[SW] Fetch failed, serving fallback:', err);
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          // Return a simple offline response for other resources
          return new Response('Offline', { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    }).catch(err => {
      console.error('[SW] Cache match error:', err);
      return fetch(event.request);
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const data = event.data?.json() || {};
  const title = data.title || 'Park Pro-Active';
  const options = {
    body: data.body || 'New notification',
    icon: '/logo-192.png',
    badge: '/logo-72.png',
    tag: data.tag || 'general',
    data: data.data || {},
    actions: data.actions || [
      { action: 'open', title: 'Open App' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'dismiss') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-alerts') {
    event.waitUntil(syncPendingAlerts());
  }
});

async function syncPendingAlerts() {
  // Sync any pending alerts when back online
  const pendingAlerts = await getPendingAlerts();
  for (const alert of pendingAlerts) {
    await sendAlertToServer(alert);
  }
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'check-maintenance') {
    event.waitUntil(checkMaintenanceDue());
  }
});

async function checkMaintenanceDue() {
  // Check for maintenance due and send local notification
  const maintenanceDue = await getMaintenanceDueFromCache();
  for (const item of maintenanceDue) {
    self.registration.showNotification('Maintenance Due', {
      body: `${item.assetName} requires maintenance`,
      icon: '/logo-192.png',
      tag: `maintenance-${item.id}`,
      data: { assetId: item.id, type: 'maintenance' }
    });
  }
}
