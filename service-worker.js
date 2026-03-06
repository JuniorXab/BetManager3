// ═══════════════════════════════════════════
//  BlackJack Royale — Service Worker v3
//  Estrategia: Cache-first para assets estáticos
//              Network-first para Firebase (tiempo real)
// ═══════════════════════════════════════════

const CACHE_NAME = 'bj-royale-v17';

// Archivos a cachear para juego offline (solo modo)
const STATIC_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-512.svg'
];

// URLs que NUNCA se cachean (siempre van a red)
const NETWORK_ONLY = [
  'firebaseio.com',
  'googleapis.com',
  'gstatic.com/firebasejs'
];

// ── INSTALL: Pre-cache assets estáticos ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Pre-cache parcial:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: Limpiar caches viejos ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Borrando cache viejo:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: Estrategia híbrida ──
self.addEventListener('fetch', event => {
  const url = event.request.url;

  // Firebase y CDNs externos → siempre red
  if (NETWORK_ONLY.some(domain => url.includes(domain))) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Solo GET se cachea
  if (event.request.method !== 'GET') return;

  // index.html → network-first (always get latest version)
  if (url.endsWith('/') || url.includes('index.html') || url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.status === 200 && response.type !== 'opaque') {
            const toCache = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

// ── MENSAJE: Forzar actualización ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[SW] BlackJack Royale Service Worker v3 activo');

// ── NOTIFICATION CLICK: open app ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.includes('Blackjack') || client.url.includes('blackjack')) {
          return client.focus();
        }
      }
      return clients.openWindow('./');
    })
  );
});
