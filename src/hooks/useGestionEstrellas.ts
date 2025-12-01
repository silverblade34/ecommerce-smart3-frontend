import { listClientesEstrellasService } from "@/server/actions/client";
import { useState, useCallback } from "react";

export const useGestionEstrellas = (nIdCliente?: number) => {
  const [estrellas, setEstrellas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const getEstrellas = useCallback(
    async ({ search = "", page = 1, limit = 25 }) => {
      if (!nIdCliente) return;
      setLoading(true);
      try {
        const res = await listClientesEstrellasService(nIdCliente, search, page, limit);

        if (res.success) {
          const { items, totalPages, totalItems } = res.data;

          setEstrellas(items || []);
          setTotalPages(totalPages || 1);
          setTotalItems(totalItems || 0);

       
        } else {
          setEstrellas([]);
          setTotalPages(1);
          setTotalItems(0);
        }
      } catch (error) {
        console.error("Error al cargar estrellas:", error);
        setEstrellas([]);
        setTotalPages(1);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    },
    [nIdCliente]
  );

  return {
    estrellas,
    loading,
    totalPages,
    totalItems,
    getEstrellas,
  };
};
