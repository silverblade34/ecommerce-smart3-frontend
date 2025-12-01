"use client";

import { useEffect, useState } from "react";

/**
 * Hook personalizado para detectar el estado de conexión a internet
 * 
 * @returns {boolean} isOnline - true si hay conexión, false si está offline
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Verificar el estado inicial
    setIsOnline(navigator.onLine);

    // Handlers para eventos de conexión
    const handleOnline = () => {
      console.log('[Network] Conexión restaurada');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('[Network] Sin conexión a internet');
      setIsOnline(false);
    };

    // Agregar event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
