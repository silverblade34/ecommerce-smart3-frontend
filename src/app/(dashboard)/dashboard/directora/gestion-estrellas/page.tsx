"use client";

import TitleSection from "@/components/common/ui/TitleSection";
import GestionEstrellas from "./components/tables/GestionEstrellas";
export const dynamic = "force-dynamic";

export default function GestionDirectoraPage() {
  return (
    <section>
      <TitleSection text="Gestion de estrellas" />
      <GestionEstrellas />{/** */}
    </section>
  );
}
