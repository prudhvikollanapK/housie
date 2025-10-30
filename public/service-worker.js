// public/service-worker.js

const CACHE_NAME = 'react-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/logo192.png',
  '/manifest.json',
];

// Install event - cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        await cache.addAll(urlsToCache);
        console.log('All resources cached successfully');
      } catch (error) {
        console.error('Failed to cache:', error);
      }
    })
  );
  self.skipWaiting();
});


// Activate event - clean up old caches if needed
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(response => {
        if (response) {
          return response;
        }
        // Optionally return fallback page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
    )
  );
});
