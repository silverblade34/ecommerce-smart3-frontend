import { create } from "zustand";

interface PwaState {
    // Estado de instalación
    isPwaInstalled: boolean;
    isInstallPromptSupported: boolean;
    deferredPrompt: any;

    // Estado de UI
    showInstallBanner: boolean;
    showUpdateBanner: boolean;

    // Estado de actualizaciones
    updateAvailable: boolean;
    swRegistration: ServiceWorkerRegistration | null;

    // Estado de sesión
    hasDismissedInSession: boolean;

    // Acciones
    setPwaInstalled: (installed: boolean) => void;
    setInstallPromptSupported: (supported: boolean) => void;
    setDeferredPrompt: (prompt: any) => void;
    setShowInstallBanner: (show: boolean) => void;
    setShowUpdateBanner: (show: boolean) => void;
    setUpdateAvailable: (available: boolean) => void;
    setSwRegistration: (reg: ServiceWorkerRegistration | null) => void;

    // Acción compuesta para cerrar banner
    dismissBanner: () => void;

    // Reset para cuando se instala
    resetInstallState: () => void;
}

export const usePwaStore = create<PwaState>((set) => ({
    isPwaInstalled: false,
    isInstallPromptSupported: false,
    deferredPrompt: null,
    hasDismissedInSession: false,

    showInstallBanner: false,
    showUpdateBanner: false,

    updateAvailable: false,
    swRegistration: null,

    setPwaInstalled: (installed) => set({ isPwaInstalled: installed }),
    setInstallPromptSupported: (supported) => set({ isInstallPromptSupported: supported }),
    setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt }),
    setShowInstallBanner: (show) => set({ showInstallBanner: show }),
    setShowUpdateBanner: (show) => set({ showUpdateBanner: show }),
    setUpdateAvailable: (available) => set({ updateAvailable: available }),
    setSwRegistration: (reg) => set({ swRegistration: reg }),

    dismissBanner: () => set({
        showInstallBanner: false,
        hasDismissedInSession: true
    }),

    resetInstallState: () => set({
        deferredPrompt: null,
        showInstallBanner: false,
        isPwaInstalled: true,
        hasDismissedInSession: false
    })
}));
