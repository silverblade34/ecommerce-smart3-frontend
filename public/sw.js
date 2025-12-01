// Service Worker para Sokso Smart PWA
// Version 1.1.0 - Updated offline page with improved UI

const CACHE_NAME = 'sokso-smart-v1.1.5';
const RUNTIME_CACHE = 'sokso-runtime-v1.1.5';
const IMAGE_CACHE = 'sokso-images-v1.1.5';

// Archivos críticos para precarga
const PRECACHE_URLS = [
  '/offline.html',
  // '/icons/android/android-launchericon-192-192.png',
  // '/icons/android/android-launchericon-512-512.png',
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  // console.log('[SW] Installing Service Worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // console.log('[SW] Precaching App Shell');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting()) // Activar inmediatamente
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  // console.log('[SW] Activating Service Worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar cachés antiguos
            if (cacheName !== CACHE_NAME &&
                cacheName !== RUNTIME_CACHE &&
                cacheName !== IMAGE_CACHE) {
              // console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Tomar control inmediatamente
  );
});

// Estrategia de Fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests que no son del mismo origen (excepto imágenes de Sokso)
  if (url.origin !== location.origin &&
      !url.hostname.includes('sokso.com')) {
    return;
  }

  // Ignorar APIs de autenticación y datos dinámicos
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/articulos')) {
    return;
  }

  // Estrategia para imágenes: Cache First
  if (request.destination === 'image' ||
      url.hostname.includes('oms-fotos')) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Estrategia para iconos y assets estáticos: Cache First
  if (url.pathname.startsWith('/icons/') ||
      url.pathname.startsWith('/_next/static/') ||
      url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp|ico)$/)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME));
    return;
  }

  // Estrategia para páginas HTML: Network First
  if (request.mode === 'navigate' ||
      request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  // Estrategia para otros recursos: Network First con fallback a caché
  event.respondWith(networkFirstStrategy(request, RUNTIME_CACHE));
});

// Estrategia Cache First (para assets estáticos e imágenes)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // console.log('[SW] Cache hit:', request.url);
      return cachedResponse;
    }

    // console.log('[SW] Cache miss, fetching:', request.url);
    const networkResponse = await fetch(request);

    // Cachear solo respuestas válidas
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // console.error('[SW] Cache First failed:', error);

    // Intentar obtener de caché como último recurso
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Si es una imagen, retornar placeholder
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Imagen no disponible</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }

    throw error;
  }
}

// Estrategia Network First (para páginas dinámicas)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Cachear respuestas exitosas
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback offline para páginas HTML
    if (request.mode === 'navigate' ||
        request.headers.get('accept')?.includes('text/html')) {
      return getOfflinePage();
    }

    throw error;
  }
}

// Obtener página offline desde caché
async function getOfflinePage() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match('/offline.html');

    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback si no está en caché (no debería pasar)
    return createFallbackOfflinePage();
  } catch (error) {
    return createFallbackOfflinePage();
  }
}

// Fallback básico si offline.html no está disponible
function createFallbackOfflinePage() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sin Conexión - Sokso Smart</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          background: linear-gradient(135deg, #8331A7 0%, #2D2A26 100%);
          color: white;
          text-align: center;
          padding: 20px;
        }
        .container {
          max-width: 400px;
          background: rgba(255, 255, 255, 0.1);
          padding: 40px;
          border-radius: 20px;
        }
        h1 { font-size: 2rem; margin: 0 0 16px 0; }
        p { font-size: 1.1rem; margin: 16px 0; }
        button {
          background: white;
          color: #8331A7;
          border: none;
          padding: 12px 24px;
          font-size: 1rem;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 16px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>📡 Sin Conexión</h1>
        <p>No tienes conexión a internet.</p>
        <p>Verifica tu red e intenta nuevamente.</p>
        <button onclick="window.location.reload()">Reintentar</button>
      </div>
    </body>
    </html>`,
    {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store'
      }
    }
  );
}

// Manejo de mensajes desde el cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

