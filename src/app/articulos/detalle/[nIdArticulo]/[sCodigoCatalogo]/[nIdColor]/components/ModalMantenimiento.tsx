"use client";
import Image from "next/image";
import React from "react";

export default function ModalMantenimiento() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-10 max-w-md w-full text-center animate-fadeIn space-y-6">
        <Image
          alt="Logo Sokso"
          src="/images/isotipo_sokso.png"
          width={80}
          height={80}
          className="mx-auto rounded-full object-cover "
        />
        <h2 className="text-xl sm:text-xl font-semibold text-gray-800">
          Estamos realizando mejoras
        </h2>
        <p className="text-gray-600 text-md">
          En estos momentos Smart Sokso se encuentra en mantenimiento.
          <br />
          Estamos trabajando para brindarte una mejor experiencia.
        </p>
        <div className="flex justify-center">
          <div className="flex space-x-2 animate-bounceDelay">
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full delay-150"></div>
            <div className="w-2.5 h-2.5 bg-primary-600 rounded-full delay-300"></div>
          </div>
        </div>
        <p className="text-sm text-gray-500 italic">
         ¡Gracias por tu paciencia! 🛠️
        </p>
      </div>
      <style jsx>{`
        @keyframes bounceDelay {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }

        .animate-bounceDelay > div {
          animation: bounceDelay 1.4s infinite ease-in-out both;
        }

        .delay-150 {
          animation-delay: -0.16s;
        }

        .delay-300 {
          animation-delay: -0.32s;
        }
      `}</style>
    </div>
  );
}
