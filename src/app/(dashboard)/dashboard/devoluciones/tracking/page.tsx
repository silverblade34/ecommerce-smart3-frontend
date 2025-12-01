

"use client";

import TitleSection from "@/components/common/ui/TitleSection";
import Tracking from "./components/Tracking";



export const dynamic = "force-dynamic";

export default function TrackingDevoluciones() {
  return (
    <section>
      <TitleSection text="Tracking de Devoluciones" />
      <Tracking />
    </section>
  );
}
