import { CentroModaEstrella } from "@/lib/interfaces/clientes";
import { Profile } from "@/lib/interfaces/profile";
import { centroModaEstrellaService } from "@/server/actions/client";
import { getMyClient } from "@/server/actions/users";
import { useCallback, useEffect, useState } from "react";

export const useEstrellaData = (nIdCliente: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [centroModaEstrella, setCentroModaEstrella] =
    useState<CentroModaEstrella | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await centroModaEstrellaService(nIdCliente);
      console.log("DATA", data);
      const prof = await getMyClient();
      setCentroModaEstrella(data);
      setProfile(prof);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setLoading(false);
    }
  }, [nIdCliente]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return {
    loading,
    error,
    centroModaEstrella,
    profile,
  };
};

export default useEstrellaData;
