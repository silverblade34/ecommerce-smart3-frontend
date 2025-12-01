import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { usePedidosDirectora } from "@/hooks/usePedidos";
import { BackendPedido, Pedido } from "../types";

type RawPedidoResponse = {
  data?: {
    items?: Array<Record<string, {
      pedidos?: Array<{
        pedidos?: Array<Pedido>;
      }>
    }>>;
  };
};
type TipoCatalogo = 'CYBER' | 'PREVENTA' | 'REGULAR' | 'GRATIS' | 'PREVENTA CATALOGO' | 'SHOWROOM';


export const usePedidosData = (
  tipoCatalogo: string,
  estado: string,
  pagina: number,
  filasPorPagina: number
) => {
  const [nombreEstrella, setNombreEstrella] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 1000);
  const [ultimaSincronizacion, setUltimaSincronizacion] = useState("");
  const { pedidos, loading, refetch } = usePedidosDirectora(
    tipoCatalogo,
    estado,
    nombreEstrella,
    pagina,
    filasPorPagina
  );

  useEffect(() => {
    localStorage.setItem("nomEstrella", debouncedSearchValue);
    setNombreEstrella(debouncedSearchValue);
  }, [debouncedSearchValue]);

  useEffect(() => {
    if (pedidos) {
      const ahora = new Date();
      setUltimaSincronizacion(`${ahora.getHours().toString().padStart(2, '0')}:${ahora.getMinutes().toString().padStart(2, '0')}`);
    }
  }, [pedidos]);

  const transformPedidosData = useCallback((data: unknown): Pedido[] => {
    const safeData = data as RawPedidoResponse;
    if (!safeData?.data?.items) return [];

    return safeData.data.items.flatMap((item) =>
      Object.entries(item).flatMap(([tipoCatalogo, tipoPedido]) =>
        tipoPedido?.pedidos?.flatMap((pedido) =>
          pedido.pedidos?.map((p: BackendPedido) => ({
            id: p.id,
            linea: p.linea,
            cantidad: p.cantidad,
            precio: p.precio,
            fecha: p.fecha,
            hora: p.hora,
            sOrigenPedido: p.sOrigenPedido,
            puedeEliminar: p.puedeEliminar,
            montoTotal: p.montoTotal,
            sAccionDirectora: p.sAccionDirectora,
            fechaAccion: p.fechaAccion,
            totalPedido: p.totalPedido,
            esDuplicado: p.esDuplicado,
            tipoCatalogo,
            datosItem: p.datosItem,
            datosEstrella: p.datosEstrella,
          })) ?? []
        ) ?? []
      ) ?? []
    );
  }, []);

  const cantidadesPendientes: Record<TipoCatalogo, number> = {
    CYBER: pedidos?.data?.cantidadTotal_CYBER || 0,
    PREVENTA: pedidos?.data?.cantidadTotal_PREVENTA || 0,
    REGULAR: pedidos?.data?.cantidadTotal_REGULAR || 0,
    GRATIS: pedidos?.data?.cantidadTotal_GRATIS || 0,
    'PREVENTA CATALOGO': pedidos?.data?.cantidadTotal_PREVENTA_CATALOGO || 0,
    SHOWROOM: pedidos?.data?.cantidadTotal_SHOWROOM || 0,
  };
  const pedidosData = transformPedidosData(pedidos);

  let tiposCatalogo = pedidos?.data?.metadata?.tiposCatalogo || [];
  if (!tiposCatalogo.includes("REGULAR")) {
    tiposCatalogo = [...tiposCatalogo, "REGULAR"];
  }
  return {
    cantidadesPendientes,
    pedidos,
    pedidosData,
    loading,
    refetch,
    searchValue,
    setSearchValue,
    nombreEstrella,
    tiposCatalogo,
    ultimaSincronizacion
  };
};