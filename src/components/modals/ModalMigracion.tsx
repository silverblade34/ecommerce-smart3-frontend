'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
} from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react"; // ✅ Icono de X

const ModalMigracion = () => {
  const { status } = useSession();
  const [preventa, setPreventa] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Buscar PREVENTA en localStorage
  useEffect(() => {
    if (status === "authenticated") {
      const raw = localStorage.getItem("catalog-filter");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const found = parsed.data.find(
            (item: any) => item.sDescripcionTipoCatalogo.toUpperCase() === "GRATIS" 
          );

          setPreventa(found ? "GRATIS" : null);
        } catch (error) {
          console.error("Error parseando localStorage:", error);
        }
      }
    }
  }, [status]);

useEffect(() => {
  console.log("🔎 Revisando estado preventa:", preventa);

  // Si preventa aún es undefined o null, NO continúes
  if (preventa === undefined || preventa === null) {
    console.log("⏳ preventa aún no cargó...");
    return;
  }

  // Buscar si existe en localStorage
  const ocultar = localStorage.getItem("ocultar_migracion");

  console.log("📦 Valor en localStorage ocultar_migracion:", ocultar);

  // Solo abrir si preventa es true
  if (!preventa && !ocultar) {
    console.log("✅ PREVENTA detectado, abriendo modal...");
    setIsOpen(true);
  } else {
    console.log("❌ No cumple condiciones → Modal NO se abre");
  }
}, [preventa]);


  const handleClose = () => {
    localStorage.setItem("ocultar_migracion", "true");
    setIsOpen(false);
  };

  return (
 <Modal
  isOpen={isOpen}
  onClose={handleClose}
  size="sm"
  backdrop="blur"
  placement="center"
  hideCloseButton
  className="z-[9999]"
>
  <ModalContent className="relative z-[9999] p-0 overflow-hidden">
    {/* Botón de cerrar (X blanca) */}
    <button
      onClick={handleClose}
      className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 z-10"
    >
      <X size={20} weight="bold" />
    </button>

    <ModalBody className="p-0">
      <a href="?catalogo=gratis" target="_blank" className="block w-full h-full">
        <img
          src="/images/preventa-02.png"
          alt=""
          className="block w-full h-full object-cover"
        />
      </a>
    </ModalBody>
  </ModalContent>
</Modal>

  );
};

export default ModalMigracion;

