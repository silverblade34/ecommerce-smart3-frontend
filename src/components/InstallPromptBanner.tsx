"use client";

import { X } from "@phosphor-icons/react";
import Image from "next/image";
import { usePwaStore } from "@/stores/usePwaStore";
import { usePwaManager } from "@/hooks/usePwaManager";
import { useState } from "react";
import { toast } from "react-toastify";

export function InstallPromptBanner() {
  const { showInstallBanner, deferredPrompt, isPwaInstalled, dismissBanner } = usePwaStore();
  const { hideBannerFor15Days } = usePwaManager();
  const [showImage, setShowImage] = useState(false);

  // Si no debe mostrarse o ya está instalada, no renderizar
  if (!showInstallBanner || isPwaInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Navegador no soporta instalación nativa (Safari/Firefox)
      setShowImage(true);
      return;
    }

    // Instalación nativa (Chrome/Android)
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      // El evento appinstalled manejará el resto
      toast.success("Instalando aplicación...");
    } else {
      // Usuario rechazó
      dismissBanner();
    }
  };

  const handleAlreadyInstalled = () => {
    hideBannerFor15Days();
    toast.success("¡Genial! Disfruta de la experiencia completa.");
  };

  return (
    <>
      {/* Backdrop oscuro */}
      <div
        className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
        onClick={dismissBanner}
      />

      {/* Modal popup */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[70] flex justify-center items-start pt-4 px-4 sm:pt-8 pointer-events-none overflow-y-auto">
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative pointer-events-auto animate-slideDown mb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Botón cerrar */}
          <button
            onClick={dismissBanner}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} weight="bold" />
          </button>

          {/* Primera fila: Icono y Descripción */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary_sokso/10">
                <Image src="/images/isotipo_sokso.png"
                  alt="Icono Sokso Smart" width={40}
                  height={40} className="text-primary_sokso" />
              </div>
            </div>
            <p className="text-gray-900 text-lg sm:text-base font-medium leading-relaxed flex-1">
              Recibe alertas y beneficios exclusivos.
            </p>
          </div>

          {/* Segunda fila: Botón */}
          <div className="flex justify-center w-full">
            {deferredPrompt ? (
              // Botón Instalar (cuando hay prompt disponible)
              <button
                onClick={handleInstallClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary_sokso px-8 py-1.5 font-semibold text-white transition-all hover:bg-primary_sokso/90 active:scale-95 shadow-md hover:shadow-lg"
                title="Instalar ahora"
              >
                <span>Instalar Sokso Smart</span>
              </button>
            ) : (
              // Botón Cómo instalar (cuando NO hay prompt)
              <div className="flex flex-col gap-3 w-full items-center">
                <button
                  onClick={() => setShowImage(!showImage)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary_sokso px-8 py-1.5 font-semibold text-white transition-all hover:bg-primary_sokso/90 active:scale-95 shadow-md hover:shadow-lg"
                  title="Ver instrucciones de instalación"
                >
                  <span>{showImage ? 'Ocultar instrucciones' : 'Ver cómo instalar'}</span>
                </button>
                
                <button 
                  onClick={handleAlreadyInstalled}
                  className="text-sm text-gray-500 hover:text-gray-700 underline transition-colors"
                >
                  Ya instalé la App
                </button>
              </div>
            )}
          </div>

          {/* Imagen de instrucciones */}
          {showImage && (
            <div className="mt-6 animate-fadeIn">
              <Image
                src="/images/how-install-pwa.png"
                alt="Instrucciones de instalación de Sokso Smart PWA"
                width={600}
                height={400}
                className="w-full h-auto rounded-xl"
              />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-in;
        }
      `}</style>
    </>
  );
}
