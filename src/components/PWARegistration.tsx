"use client";

import { usePwaManager } from "@/hooks/usePwaManager";

/**
 * Componente para registrar el Service Worker en el cliente
 * Este componente debe ser incluido en el layout principal
 */
export function PWARegistration() {
  // Inicializamos el manager aquí para que esté activo en toda la app
  usePwaManager();

  return null;
}
