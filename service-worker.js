// BetManager Pro — Service Worker v2
const CACHE_NAME = 'betmanager-v2';
const FILES = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instalar: guardar archivos en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting(); // Activa el nuevo SW inmediatamente
});

// Activar: eliminar cachés viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim(); // Toma control de todas las pestañas abiertas
});

// Fetch: RED PRIMERO, caché como respaldo
// Así siempre carga la versión más reciente si hay internet
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Si la red responde bien, actualiza el caché
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
        return response;
      })
      .catch(() => {
        // Sin internet: usa el caché
        return caches.match(e.request);
      })
  );
});
