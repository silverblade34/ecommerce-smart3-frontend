"use client";

import TitleSection from "@/components/common/ui/TitleSection";
import GestionCambio from "./components/tables/GestionCambio";

export const dynamic = "force-dynamic";

export default function GestionDirectoraPage() {
  return (
    <section>
      <TitleSection text="Gestión de Cambio" />
      <GestionCambio />
    </section>
  );
}
