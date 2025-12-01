"use client";

import useAuthStore from "@/context/user/auth-store";
import {
  generateBaseDevolucionAction,
  getListEnvioByIdCodeAction,
  getListEnvioService,
  lastDevolutionByClientAction,
} from "@/server/actions/devoluciones";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useDevolutionStore } from "@/context/devoluciones/devolution-store";
import { BuscarDevolucionesParams, ClientDevolution, EnvioList } from "@/lib/interfaces/devoluciones";
import { usePedidosStore } from "@/context/devoluciones/tracking-store";

interface Props {
  sTipoDevolucao: string;
}

export const useDevolution = ({ sTipoDevolucao }: Props) => {
  const setGlobalDevolution = useDevolutionStore((state) => state.setDevolution);
  const [devolution, setDevolution] = useState<{
    idDevolucion: number;
    sNumeroDevolucion: string;
    sTipoDevolucion: string;
    nCantidadProductos: number;
    dtFechaApertura: string;
    cardAviso: {
      isActive: boolean;
      sTitle: string;
      sDescription: string;
      sAlert: string;
    } | null;
  }>({
    idDevolucion: 0,
    sNumeroDevolucion: "",
    sTipoDevolucion: sTipoDevolucao,
    nCantidadProductos: 0,
    dtFechaApertura: "",
    cardAviso: null
  });
  const stored = localStorage.getItem("nIdDirectora");
  const [status, setStatus] = useState(false);

  const profile = useAuthStore((state) => state.profile);

  const fetchDevolution = async () => {
    const result = await lastDevolutionByClientAction(Number(stored), sTipoDevolucao);
    if (result?.status) {
      setStatus(true)
      const dev = {
        idDevolucion: result.res.idDevolucion,
        sNumeroDevolucion: result.res.sNumeroDevolucion,
        sTipoDevolucion: result.res.sTipoDevolucion,
        nCantidadProductos: result.res.nCantidadProductos,
        dtFechaApertura: result.res.dtFechaApertura,
        cardAviso: result.res.cardAviso
      };
      console.log("Devolucion fetched:", dev);
      setDevolution(dev);
      setGlobalDevolution(dev);
    } else {
      setStatus(false)
      toast.error(result?.res || "Hubo un problema al obtener el N° de devolución")
    }
  };

  useEffect(() => {
    fetchDevolution();
  }, []);

  const registrarBaseDevolucion = async () => {
    try {
      const stored = localStorage.getItem("nIdDirectora");
      await generateBaseDevolucionAction({
        sClienteId: stored?.toString() || "",
        sTipoDevolucion: sTipoDevolucao,
        sNombreCliente:
          profile?.cliente.infoCliente.sNombre +
          " " +
          profile?.cliente.infoCliente.sApellidos,
        sZona: profile?.cliente.directora?.centroModa.sZona || "",
      });

      toast.success("Número de devolución creada exitosamente");

      const result = await lastDevolutionByClientAction(
        Number(stored),
        sTipoDevolucao
      );
      if (result?.status) {
        const dev = {
          idDevolucion: result.res.idDevolucion,
          sNumeroDevolucion: result.res.sNumeroDevolucion,
          sTipoDevolucion: result.res.sTipoDevolucion,
          nCantidadProductos: result.res.nCantidadProductos,
          dtFechaApertura: result.res.dtFechaApertura,
          cardAviso: result.res.cardAviso
        };
        setDevolution(dev);
        setGlobalDevolution(dev);
      } else {
        toast.error(result?.res || "Hubo un problema al obtener el N° de devolución")
      }
    } catch (error: any) {
      const mensaje =
        error?.message ||
        error?.response?.data?.message ||
        error?.toString() ||
        "Ocurrió un error inesperado";
      toast.error(mensaje);
    }
  };

  return { devolution, status, setDevolution, registrarBaseDevolucion };
};

export const useTrackingDevoluciones = () => {
  const [pedidos, setPedidos] = useState<EnvioList[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<any>(null);
  const [page, setPage] = useState(1);

  const buscar = async (
    filtroSeleccionado?: string | null,
    valorFiltro?: string,
    fechaDesde?: string,
    fechaHasta?: string,
    pageParam: number = 1
  ) => {
    setLoading(true);
    try {
      const sClienteId = localStorage.getItem("nIdDirectora") || "";
      const params: BuscarDevolucionesParams = {
        sClienteId,
        page: pageParam,
        // incluirHistorial: "NO",
      };

      if (filtroSeleccionado === "estrellaFilter") {
        params.estrellaFilter = valorFiltro;
      }
      else if (filtroSeleccionado === "numeroDevolucion") {
        params.numeroDevolucion = valorFiltro;
      } else if (filtroSeleccionado === "productoFilter") {
        params.productoFilter = valorFiltro;
      } else if (filtroSeleccionado === "fechaDesde" && fechaDesde && fechaHasta) {
        params.fechaDesde = fechaDesde;
        params.fechaHasta = fechaHasta;
      }
      else if (filtroSeleccionado === "estado" && valorFiltro) {
        params.estado = valorFiltro;   // 👈 aquí agregas el nuevo filtro
      }
      const response = await getListEnvioService(params);
      setPedidos(response.items);
      setPagination(response.pagination);
      setPage(response.pagination.currentPage);
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { buscar(undefined, undefined, undefined, undefined, 1) }, [])

  return {
    pedidos,
    loading,
    buscar,
    pagination,
    page,
    setPage,
  };
};



export const useDetalleDevoluciones = (ids: string[]) => {
  const [detalleDevolucion, setDetalleDevolucion] = useState<ClientDevolution[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 👈


  const listDetalleDevoluciones = useCallback(async (idsToFetch: string[]) => {
    try {
      setLoading(true);
      if (idsToFetch.length > 0) {
        const resultData = await getListEnvioByIdCodeAction(idsToFetch);
        if (resultData.status) {
          setDetalleDevolucion(resultData.data);
        }
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error cargando pedidos:", error);
    }
  }, []);

  useEffect(() => {
    if (ids.length > 0) {
      listDetalleDevoluciones(ids);
    }
  }, [ids, refreshKey, listDetalleDevoluciones]);

  return {
    detalleDevolucion,
    loading,
    listDetalleDevoluciones,
    refresh: () => setRefreshKey(prev => prev + 1)
  };


}