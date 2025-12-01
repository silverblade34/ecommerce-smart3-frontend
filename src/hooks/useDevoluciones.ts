
import useAuthStore from "@/context/user/auth-store";
import { ClienteConDevoluciones, DatosDev } from "@/lib/interfaces/devoluciones";
import { eliminarDevolucionRegistrada, getDevolucionesxDirectora, getListDevService } from "@/server/actions/devoluciones";


import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const useDevoluciones = (tipoDevolucion: string) => {
  const [devoluciones, setDevoluciones] = useState<ClienteConDevoluciones[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();
  const stored = localStorage.getItem("nIdDirectora") || profile?.cliente?.directora?.nIdDirectora;
  console.log("ID DIRECTORA", stored);

  const fetchPedido = async () => {
    try {
      const response = await getDevolucionesxDirectora(Number(stored), tipoDevolucion);

      if (response) {
        setDevoluciones(response);
      } else {
        throw new Error('No se encontraron datos del pedido');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedido();
  }, []);

  const confirmDelete = async (productoToDelete: string, selectedReason: string) => {

    if (!productoToDelete || !selectedReason) {
      toast.error("Seleccione un motivo para eliminar");
      return;
    }
    try {
      const result = await eliminarDevolucionRegistrada(
        productoToDelete,
        selectedReason
      );

      if (result.success) {
        toast.success(result.message);
        fetchPedido();
        return true
      } else {
        toast.error(result.message);
        return false
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };


  return { devoluciones, loading, fetchPedido, confirmDelete };
};

export const usePedidosFacturados = (tipoDevolucion:string) => {
  const [pedidosFacturados, setPedidosFacturados] = useState<DatosDev[] | null>(null);
  const [loading, setLoading] = useState(true);
      const { profile } = useAuthStore();
    const stored = localStorage.getItem("nIdDirectora") || profile?.cliente?.directora?.nIdDirectora;
    const fetchPedido = async () => {
      try {
        const response = await getListDevService(Number(stored),tipoDevolucion);
        if (response) {
          setPedidosFacturados(response.data);
        } else {
          throw new Error('No se encontraron datos del pedido');
        }

      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
 useEffect(() => {
    fetchPedido();
  }, []);


  return { pedidosFacturados, loading, fetchPedido };
};



