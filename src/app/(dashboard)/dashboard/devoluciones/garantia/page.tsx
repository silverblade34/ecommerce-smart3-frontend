"use client";

import TitleSection from "@/components/common/ui/TitleSection";
import GestionGarantia from "./components/tables/GestionGarantia";

export const dynamic = "force-dynamic";

export default function GestionDirectoraPage() {
  return (
    <section>
      <TitleSection text="Gestión de Garantía" />
      <GestionGarantia />
    </section>
  );
}
