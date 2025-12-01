import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  centroModaDirectoraService,
  updateDataDirectoraService,
} from "@/server/actions/client";

import { CentroModaDirectora, EditDirectoraForm } from "@/lib/interfaces/directora";
import { Profile } from "@/lib/interfaces/profile";
import useAuthStore from "@/context/user/auth-store";



export const useDirectoraData = (nIdCliente: number) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [centroModaDirectoa, setCentroModaDirectora] =
    useState<CentroModaDirectora | null>(null);
  const profile: Profile | null = useAuthStore((state) => state.profile);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await centroModaDirectoraService(nIdCliente);
      setCentroModaDirectora(data);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error desconocido");
      setLoading(false);
    }
  }, [nIdCliente]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const updateDataDirectora = useCallback(
    async (data: EditDirectoraForm, idCliente: number) => {
      try {
        await updateDataDirectoraService(data, idCliente);
        await loadInitialData();
        toast.success("Datos actualizados correctamente");
      } catch (error) {
        toast.error("Error al actualizar los datos");
      }
    },
    [loadInitialData]
  );

  return {
    loading,
    error,
    centroModaDirectoa,
    profile,
    updateDataDirectora,
    reload: loadInitialData,
  };
};

export default useDirectoraData;
