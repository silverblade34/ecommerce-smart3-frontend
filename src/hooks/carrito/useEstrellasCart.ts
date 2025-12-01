import { ClientCartTable } from "@/lib/interfaces/clientes";
import { listEstrellasporDirectora } from "@/server/actions/client";
import { useState } from "react";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

export const useEstrellasCart = () => {
  const [estrellasCart, setEstrellasCart] = useState<ClientCartTable[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const getEstrellasCart = async (searchQuery: string = "") => {
    setLoadingCart(true);
    try {
      const clientes = await listEstrellasporDirectora("DIR-01", searchQuery);
      setEstrellasCart(clientes);
    } catch (error) {
      console.error("Error al cargar estrellas", error);
    } finally {
      setLoadingCart(false);
    }
  };


  return {
    loadingCart,
    getEstrellasCart,
    estrellasCart
  };
};
