"use client";

import { useEffect, useState } from "react";
import { usePwaStore } from "@/stores/usePwaStore";

/**
 * Wrapper que agrega padding-top solo si NO estamos corriendo como PWA
 * Esto evita el espacio en blanco cuando la app está instalada
 */
export function PWABannerWrapper({ children }: { children: React.ReactNode }) {
    const { isPwaInstalled } = usePwaStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Mientras carga, no mostrar nada para evitar flash
    if (!mounted) {
        return <div >{children}</div>;
    }

    // Si está corriendo como PWA, NO agregar padding
    if (isPwaInstalled) {
        return <>{children}</>;
    }

    // Si está en navegador web, agregar padding para el banner
    return <div >{children}</div>;
}
