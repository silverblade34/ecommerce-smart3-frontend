"use client";

import { useEffect, useState } from "react";
import { WifiSlash, CheckCircle } from "@phosphor-icons/react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

/**
 * Banner flotante que muestra el estado de la conexión
 * Se muestra cuando se pierde o recupera la conexión
 */
export function NetworkStatusBanner() {
    const isOnline = useOnlineStatus();
    const [showBanner, setShowBanner] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        // Si cambió a offline
        if (!isOnline && !wasOffline) {
            setWasOffline(true);
            setShowBanner(true);
        }

        // Si cambió a online después de estar offline
        if (isOnline && wasOffline) {
            setShowBanner(true);

            // Ocultar el banner después de 3 segundos cuando vuelve la conexión
            const timer = setTimeout(() => {
                setShowBanner(false);
                setWasOffline(false);
            }, 3000);

            return () => clearTimeout(timer);
        }

        // Si está offline, mantener el banner visible
        if (!isOnline) {
            setShowBanner(true);
        }
    }, [isOnline, wasOffline]);

    if (!showBanner) {
        return null;
    }

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-[100] flex items-center justify-center gap-2 px-4 py-2 transition-all duration-300 ${isOnline
                ? "bg-[#d1fae5] text-[#065f46]"
                : "bg-[#fee2e2] text-[#991b1b]"
                }`}
        >
            {isOnline ? (
                <>
                    <CheckCircle size={18} weight="fill" />
                    <span className="text-sm font-semibold">¡Conexión restaurada!</span>
                </>
            ) : (
                <>
                    <WifiSlash size={18} weight="fill" />
                    <span className="text-sm font-semibold">Sin conexión a internet</span>
                </>
            )}
        </div>
    );
}
