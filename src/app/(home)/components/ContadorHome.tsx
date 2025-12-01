"use client";
import React, { useEffect, useState } from "react";

const ContadorHome: React.FC = () => {
  // 🕒 Leer fecha desde localStorage y sumarle 5 horas
  const catalogoFechaFutura =
    typeof window !== "undefined" ? localStorage.getItem("catalogoFechaFutura") : null;

  const targetDate = (() => {
    if (!catalogoFechaFutura) return new Date();
    const date = new Date(catalogoFechaFutura);
    // ✅ Sumar 5 horas
    date.setHours(date.getHours() + 5);
    return date;
  })();

  console.log("🕓 ContadorHome - targetDate (+5h):", targetDate);

  const [timeLeft, setTimeLeft] = useState<number>(
    Math.max(0, Math.floor((targetDate.getTime() - new Date().getTime()) / 1000))
  );

  // ⏳ Actualizar cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = Math.floor((targetDate.getTime() - now) / 1000);
      setTimeLeft(Math.max(0, diff));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // 🧮 Convertir a horas totales
  const formatTime = (seconds: number) => {
    const totalHours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return (
      <>
        <span className="mx-1 font-extrabold animate-pulse text-3xl sm:text-4xl md:text-5xl">
          {totalHours.toString().padStart(2, "0")}h
        </span>
        <span className="mx-1 font-extrabold animate-pulse text-3xl sm:text-4xl md:text-5xl">
          {mins.toString().padStart(2, "0")}m
        </span>
        <span className="mx-1 font-extrabold animate-pulse text-3xl sm:text-4xl md:text-5xl">
          {secs.toString().padStart(2, "0")}s
        </span>
      </>
    );
  };

  if (timeLeft <= 0) return null;

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-center w-full py-4 text-center 
                 text-white font-bold border-0 
                 bg-gradient-to-r from-pink via-black to-pink-500
                 bg-[length:200%_200%] animate-gradient-move
                 shadow-[0_0_15px_rgba(255,0,150,0.7)] sm:shadow-[0_0_25px_rgba(255,0,200,0.9)]"
    >
      <span className="text-xl sm:text-2xl md:text-3xl mr-0 sm:mr-3 mb-1 sm:mb-0 drop-shadow-md animate-glow">
        💥 ¡Solo faltan!
      </span>
      <span className="tracking-widest drop-shadow-md animate-glow">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default ContadorHome;
