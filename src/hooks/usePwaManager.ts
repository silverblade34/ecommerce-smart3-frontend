"use client";

import { useEffect, useRef } from "react";
import { usePwaStore } from "@/stores/usePwaStore";
import { registerServiceWorker } from "@/utils/registerServiceWorker";

export function usePwaManager() {
    const {
        setPwaInstalled,
        setInstallPromptSupported,
        setDeferredPrompt,
        setShowInstallBanner,
        setSwRegistration,
        resetInstallState,
        isPwaInstalled,
        dismissBanner,
        hasDismissedInSession
    } = usePwaStore();

    // Constantes
    const INSTALLED_KEY = "pwa_was_installed";
    const INSTALL_TIMESTAMP_KEY = "pwa_install_timestamp";
    const FIFTEEN_DAYS = 15 * 24 * 60 * 60 * 1000;

    // 1. Inicialización y chequeo de instalación
    useEffect(() => {
        if (typeof window === "undefined") return;

        const checkInstallationStatus = async () => {
            // A. Verificar si corre en modo standalone (PWA activa)
            const isStandalone =
                window.matchMedia("(display-mode: standalone)").matches ||
                (window.navigator as any).standalone === true;

            if (isStandalone) {
                setPwaInstalled(true);
                return;
            }

            // B. Verificar getInstalledRelatedApps (Chrome/Android)
            // Esto detecta si la PWA ya está instalada aunque estemos en el navegador
            if ('getInstalledRelatedApps' in navigator) {
                try {
                    const relatedApps = await (navigator as any).getInstalledRelatedApps();
                    if (relatedApps && relatedApps.length > 0) {
                        console.log("[PWA] App ya instalada detectada por getInstalledRelatedApps");
                        setPwaInstalled(true);
                        // Sincronizar localStorage
                        localStorage.setItem(INSTALLED_KEY, "true");
                        localStorage.setItem(INSTALL_TIMESTAMP_KEY, Date.now().toString());
                        return;
                    }
                } catch (error) {
                    console.error("[PWA] Error verificando apps instaladas:", error);
                }
            }

            // C. Verificar localStorage (Fallback y para iOS)
            const wasInstalled = localStorage.getItem(INSTALLED_KEY) === "true";
            const installTimestamp = localStorage.getItem(INSTALL_TIMESTAMP_KEY);

            if (wasInstalled && installTimestamp) {
                const timeSinceInstall = Date.now() - parseInt(installTimestamp, 10);

                // Si pasaron 15 días y el usuario sigue entrando por web, asumimos que quizás desinstaló
                // o se olvidó. Volvemos a mostrar el banner.
                if (timeSinceInstall > FIFTEEN_DAYS) {
                    localStorage.removeItem(INSTALLED_KEY);
                    localStorage.removeItem(INSTALL_TIMESTAMP_KEY);
                    setPwaInstalled(false);
                } else {
                    setPwaInstalled(true);
                }
            } else {
                setPwaInstalled(false);
            }
        };

        checkInstallationStatus();

        // Listener para cambios en display-mode (por si acaso)
        const mediaQuery = window.matchMedia("(display-mode: standalone)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setPwaInstalled(true);
        };
        mediaQuery.addEventListener("change", handleChange);

        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [setPwaInstalled]);

    // 2. Manejo de beforeinstallprompt (Chrome/Android)
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();

            // CRITICAL FIX: Si este evento se dispara, significa que el navegador detectó que la app NO está instalada.
            // Por lo tanto, debemos limpiar cualquier estado falso positivo que tengamos en localStorage.
            console.log("[PWA] beforeinstallprompt disparado - App no instalada");
            localStorage.removeItem(INSTALLED_KEY);
            localStorage.removeItem(INSTALL_TIMESTAMP_KEY);
            setPwaInstalled(false);

            setInstallPromptSupported(true);
            setDeferredPrompt(e);

            // FIX: Solo respetamos el dismiss de la sesión actual.
            if (!hasDismissedInSession) {
                setShowInstallBanner(true);
            }
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    }, [setPwaInstalled, setInstallPromptSupported, setDeferredPrompt, setShowInstallBanner, hasDismissedInSession]);

    // 3. Manejo de appinstalled
    useEffect(() => {
        if (typeof window === "undefined") return;

        const handleAppInstalled = () => {
            console.log("[PWA] App instalada exitosamente");
            localStorage.setItem(INSTALLED_KEY, "true");
            localStorage.setItem(INSTALL_TIMESTAMP_KEY, Date.now().toString());

            resetInstallState();
        };

        window.addEventListener("appinstalled", handleAppInstalled);

        return () => window.removeEventListener("appinstalled", handleAppInstalled);
    }, [resetInstallState]);

    // 4. Lógica para navegadores no soportados (Safari/Firefox)
    useEffect(() => {
        if (typeof window === "undefined") return;

        // Detectar si el navegador probablemente soporta la instalación nativa
        // 'onbeforeinstallprompt' in window es true en Chrome/Edge/Android, false en Safari/Firefox
        const isLikelyToSupportNativeInstall = 'onbeforeinstallprompt' in window;

        // Si probablemente soporta nativo, esperamos mucho más (20s) para dar tiempo al evento.
        // Si no (Safari), mostramos el fallback rápido (2s).
        const delay = isLikelyToSupportNativeInstall ? 20000 : 2000;

        const timer = setTimeout(() => {
            const { isInstallPromptSupported, isPwaInstalled, hasDismissedInSession } = usePwaStore.getState();

            // Solo mostramos el banner manual si:
            // 1. No se ha detectado soporte nativo (isInstallPromptSupported false)
            // 2. No está instalada (isPwaInstalled false)
            // 3. No se ha cerrado en esta sesión
            if (!isInstallPromptSupported && !isPwaInstalled && !hasDismissedInSession) {
                setShowInstallBanner(true);
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [isPwaInstalled, setShowInstallBanner, hasDismissedInSession]);

    // 5. Registro de Service Worker y detección de actualizaciones
    useEffect(() => {
        if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

        const initServiceWorker = async () => {
            const reg = await registerServiceWorker();
            if (reg) {
                setSwRegistration(reg);

                // Si hay un SW esperando, forzamos la actualización inmediatamente
                if (reg.waiting) {
                    reg.waiting.postMessage({ type: 'SKIP_WAITING' });
                }

                // Escuchar nuevas actualizaciones
                reg.addEventListener("updatefound", () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener("statechange", () => {
                            // Si se instala uno nuevo, le decimos que tome el control de una vez
                            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            }
                        });
                    }
                });
            }
        };

        initServiceWorker();

        // Auto-reload cuando el SW cambie (actualización forzada "por detrás")
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                refreshing = true;
                window.location.reload();
            }
        });

        // Auto-check periódico
        const interval = setInterval(() => {
            navigator.serviceWorker.getRegistration().then(reg => reg?.update());
        }, 60 * 60 * 1000); // Cada hora

        return () => clearInterval(interval);
    }, [setSwRegistration]);

    // Acciones públicas del manager
    const markAsInstalledManually = () => {
        localStorage.setItem(INSTALLED_KEY, "true");
        localStorage.setItem(INSTALL_TIMESTAMP_KEY, Date.now().toString());
        resetInstallState();
    };

    const hideBannerFor15Days = () => {
        markAsInstalledManually();
    };

    return {
        dismissBanner, // Exportamos la acción del store
        markAsInstalledManually,
        hideBannerFor15Days
    };
}
