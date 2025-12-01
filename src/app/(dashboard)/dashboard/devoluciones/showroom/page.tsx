"use client";

import TitleSection from "@/components/common/ui/TitleSection";
import GestionShowRoom from "./components/tables/GestionShowRoom";

export const dynamic = "force-dynamic";

export default function GestionDirectoraPage() {
  return (
    <section>
      <TitleSection text="Gestión de ShowRoom" />
      <GestionShowRoom />
    </section>
  );
}
