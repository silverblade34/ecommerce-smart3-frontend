"use client";

import { WifiSlash, ArrowClockwise } from "@phosphor-icons/react";

interface OfflineMessageProps {
    onRetry?: () => void;
    message?: string;
}

/**
 * Componente para mostrar cuando no hay conexión a internet
 */
export function OfflineMessage({
    onRetry,
    message = "No tienes conexión a internet"
}: OfflineMessageProps) {
    return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center px-4 py-12">
            <div className="flex max-w-md flex-col items-center text-center">
                {/* Icono */}
                <div className="mb-6 rounded-full bg-gray-100 p-6">
                    <WifiSlash size={64} weight="duotone" className="text-gray-400" />
                </div>

                {/* Título */}
                <h2 className="mb-3 text-2xl font-bold text-gray-800">
                    Sin conexión
                </h2>

                {/* Mensaje */}
                <p className="mb-6 text-gray-600">
                    {message}. Por favor, verifica tu conexión e intenta nuevamente.
                </p>

                {/* Botón de reintentar */}
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-2 rounded-lg bg-primary_sokso px-6 py-3 font-semibold text-white transition-all hover:bg-primary_sokso/90 active:scale-95"
                    >
                        <ArrowClockwise size={20} weight="bold" />
                        Reintentar
                    </button>
                )}

                {/* Información adicional */}
                <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                    <p className="font-semibold mb-2">💡 Consejo:</p>
                    <ul className="list-disc list-inside space-y-1 text-left">
                        <li>Verifica que tu WiFi esté activado</li>
                        <li>Comprueba los datos móviles</li>
                        <li>Intenta recargar la página</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
