// ── Puck Tracker Service Worker ──
// Versione cache: aggiorna per forzare refresh
const CACHE_NAME = 'puck-tracker-v1';

// File da cachare al primo avvio (app shell)
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=JetBrains+Mono:wght@400;700&family=Barlow+Condensed:wght@500;700;900&display=swap',
];

// File del modello TensorFlow.js — cachati separatamente
const MODEL_CACHE = 'puck-model-v1';
const MODEL_FILES = [
  './tfjs_model/model.json',
  './tfjs_model/metadata.json',
  './tfjs_model/group1-shard1of1.bin',
];

// ── INSTALL: pre-cacha app shell ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(APP_SHELL);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: pulisci cache vecchie ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== MODEL_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: serve dalla cache, aggiorna in background ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Modello TFjs: cache-first (il modello non cambia spesso)
  if (url.pathname.includes('/tfjs_model/')) {
    event.respondWith(
      caches.open(MODEL_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // TensorFlow.js CDN: cache-first
  if (url.hostname.includes('jsdelivr') || url.hostname.includes('tensorflow')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => cached || fetch(event.request))
      )
    );
    return;
  }

  // App files: stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached); // offline fallback
      return cached || fetchPromise;
    })
  );
});
