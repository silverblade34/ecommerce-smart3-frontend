"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useEstrellaStore from "@/context/orders/start-store";
import { useRouter } from "next/navigation";

export const useEstrellaSession = () => {
  const { data: session, status } = useSession();
  const {
    fetchEstrellaData,
    fetchDirectoraData,
    fetchColaboradorData,
    sessionInitialized,
    setSessionInitialized,
  } = useEstrellaStore();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user && !sessionInitialized) {
      const userRole = session?.user?.rol?.sCodigo;
      const idCliente = session?.user?.nIdCliente;
      const nIdDirectora = session?.user?.nIdDirectora;
      // console.log("session", session);
      localStorage.setItem("nIdDirectora", nIdDirectora?.toString());
      // setSessionInitialized(true); // se marca como ejecutado

      if (userRole === "EST-EC-01" || userRole === "EST-TD-EC-01") {
        if (idCliente) fetchEstrellaData(idCliente).catch(console.error);
      } else if (userRole === "DIR-EC-01") {
        if (idCliente) fetchDirectoraData(idCliente).catch(console.error);
        // router.push("/dashboard/pedidos/directora");
      } else {
        if (idCliente) fetchColaboradorData(idCliente).catch(console.error);
      }
    }
  }, [status, session?.user?._id, sessionInitialized]);
};
