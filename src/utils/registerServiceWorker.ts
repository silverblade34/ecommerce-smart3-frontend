/**
 * Service Worker Registration for Sokso Smart PWA
 *
 * Este archivo maneja el registro del service worker en la aplicación Next.js.
 */

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  // Solo registrar en producción y si el navegador soporta service workers
  if (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production'
  ) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('[PWA] Service Worker registrado exitosamente:', registration.scope);
      return registration;
    } catch (error) {
      console.error('[PWA] Error al registrar Service Worker:', error);
      return null;
    }
  }
  return null;
}

/**
 * Desregistrar el service worker (útil para desarrollo o limpieza)
 */
export async function unregisterServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('[PWA] Service Worker desregistrado exitosamente');

        // Limpiar cachés
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
          console.log('[PWA] Cachés limpiados');
        }
      }
    } catch (error) {
      console.error('[PWA] Error al desregistrar Service Worker:', error);
    }
  }
}
