"use client";

import { useEffect, useState } from "react";
import { usePwaStore } from "@/stores/usePwaStore";
import { X } from "@phosphor-icons/react";
import NextImage from "next/image";

export function UpdateNotification() {
  const { updateAvailable, swRegistration, setUpdateAvailable } = usePwaStore();
  const [showModal, setShowModal] = useState(false);
  const [wasDismissed, setWasDismissed] = useState(false);

  const updateNow = () => {
    if (swRegistration && swRegistration.waiting) {
      // Enviar mensaje al SW para que tome el control
      swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Recargar cuando el controlador cambie
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    } else {
        // Fallback si algo falló en la lógica
        window.location.reload();
    }
  };

  useEffect(() => {
    if (updateAvailable && !wasDismissed) {
      setShowModal(true);

      // Timer de 5 minutos para actualización automática
      const timer = setTimeout(() => {
        updateNow();
      }, 5 * 60 * 1000);

      return () => clearTimeout(timer);
    }
  }, [updateAvailable, wasDismissed]);

  const handleDismiss = () => {
    setShowModal(false);
    setWasDismissed(true);
    // Opcional: Podríamos querer que updateAvailable siga true en el store
    // pero ocultamos la UI temporalmente.
  };

  if (!showModal) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-sm" />

      {/* Modal */}
      <div className="fixed top-0 left-0 right-0 bottom-0 z-[90] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-bounceIn relative">
          
          {/* Botón cerrar */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Cerrar"
          >
            <X size={20} weight="bold" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary_sokso/10 rounded-full flex items-center justify-center mb-4">
              <NextImage 
                src="/images/isotipo_sokso.png" 
                alt="Sokso Smart" 
                width={40} 
                height={40} 
                className="text-primary_sokso"
              />
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Nueva actualización disponible!
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Sokso Smart se <strong>actualizará automáticamente en 5 minutos.</strong> Puedes actualizar ahora y disfrutar de lo nuevo.
            </p>

            <button
              onClick={updateNow}
              className="w-full bg-primary_sokso text-white font-semibold py-3 px-6 rounded-xl hover:bg-primary_sokso/90 active:scale-95 transition-all shadow-lg shadow-primary_sokso/20"
            >
              Actualizar ahora
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </>
  );
}
