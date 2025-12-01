"use server";

import { http } from "@/utils/http";
import { getServerSession } from "next-auth";
import nextAuthOptions from "../auth";
import {
  BolsasResponse,
  ClienteData,
  DetalleBolsaResponse,
  OrderStar,
  PedidoData,
} from "@/lib/global";
import axios from "axios";
import { verifyToken } from "@/lib/validations/server-auth";

export const getOrderStar = async (params: {
  idEstrella: number;
  nAnio: number;
  nMes: number;
  sCodigoProducto?: string;
}) => {
  try {
    const requestParams: Record<string, string | number> = {
      nAnio: params.nAnio,
      nMes: params.nMes,
    };

    if (params.sCodigoProducto?.trim()) {
      requestParams.sCodigoProducto = params.sCodigoProducto;
    }

    const response = await http.get<OrderStar[]>(
      `/api/pedidos/trackingPedidosPorEstrella/${params.idEstrella}`,
      {
        params: requestParams,
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener pedidos");
  }
};

export const getTrackingByPedido = async (params: { numeroPedido: string }) => {
  try {
    const response = await http.get(
      `/api/pedidos/trackingPedidos/${params.numeroPedido}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el tracking del pedido");
  }
};

export const listPedidoProducts = async (
  idEstrella: number,
  numeroPedido: string,
  codProducto: string
) => {
  try {
    const response = await http.get(
      `/api/pedidos/detallePedidoPorEstrella/${idEstrella}/${numeroPedido}?filtroDescripcion=${codProducto}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el detalle del pedido");
  }
};

export const validateStock = async (pedidoData: PedidoData) => {
  const auth = await verifyToken();
  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  try {
    console.log(pedidoData)
    const { data } = await http.post(
      `/api/pedidos/validar-preenvio`,
      { pedidoData: pedidoData }
      
    );
    console.log(data.status)
    return data;
  } catch (error) {
    console.log("errorPr", error)
    throw new Error(
      "Error al enviar el pedido: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
};



export const sendOrders = async (pedidoData: PedidoData) => {
  const auth = await verifyToken();
  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  try {
    console.log( { pedidoData: pedidoData })
    const { data } = await http.post(
      `/api/pedidos/crear`,
      { pedidoData: pedidoData },
      {
        validateStatus: function (status) {
          return (
            (status >= 200 && status < 300) || status === 409 || status === 400 || status === 504
          );
        },
      }
    );
    return data;
  } catch (error) {
    console.log("errorPr", error)
    throw new Error(
      "Error al enviar el pedido: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
};

export const getTrackingByPedidoDirectora = async (
  nIdDirectora: number,
  tipoCatalogo: string,
  estado: string,
  nomEstrella: string,
  page: number,
  limit: number
) => {
  try {
    const response = await http.get(
      `/api/pedidos/gestionPedidosListados/${nIdDirectora}?tipoCatalogo=${tipoCatalogo}&estado=${estado}&nombreEstrella=${nomEstrella}&page=${page}&limit=100000000`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener los pedidos");
  }
};

export const confirmarPedidoAPI = async (idpedido: string, tipo: string) => {
  const auth = await verifyToken();

  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  console.log("auth123", auth.status)
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) { return null; }
    const { user } = session;
    const payloadActualizado = {
      pedidoId: idpedido,
      action: tipo,
      directoraId: user.nIdDirectora,
      forzarConfirmacion: true,
    };
    const response = await http.post(
      `/api/pedidos/gestionDirectora/confirmarRechazarPedido`,
      payloadActualizado
    );

    return {
      success: response.status === 201,
      status: response.status,
      message: response.data.message,
      isStockError: false,
      isDuplicate: false,
      data: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const isStockError =
        error.response.data.status === 400 &&
        /stock/i.test(error.response.data?.message || "");
      const isDuplicate = error.response.data.status === 409;

      return {
        success: false,
        status: error.response.status,
        message: error.response.data?.message || "Error al confirmar pedido",
        isStockError,
        isDuplicate,
        data: error.response.data,
      };
    }

    return {
      success: false,
      status: 500,
      message: "Error desconocido al confirmar pedido",
      isStockError: false,
      isDuplicate: false,
    };
  }
};

export const rechazarPedidoAPI = async (
  idpedido: string,
  tipo: string,
  motivo: string
) => {
  const auth = await verifyToken();
  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) { return null; }
    const { user } = session;

    const payloadActualizado = {
      pedidoId: idpedido,
      action: tipo,
      directoraId: user.nIdDirectora,
      motivoRechazo: motivo,
    };
    const response = await http.post(
      `/api/pedidos/gestionDirectora/confirmarRechazarPedido`,
      payloadActualizado
    );

    if (response.status === 201) {
      return {
        success: true,
        message: response.data.message || "Pedido rechazado correctamente",
      };
    } else {
      return {
        success: false,
        status: response.status,
        message:
          response.data.message ||
          "Error inesperado al modificar el estado del artículo",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Error al rechazar pedido";
        throw new Error(errorMessage);
      }
    }
    throw new Error("Error de conexión al confirmar/rechazar pedido");
  }
};

export const eliminarPedidoAPI = async (
  idpedido: string,
  tipo: string,
  motivo: string
) => {
  const auth = await verifyToken();
  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) { return null; }
    const { user } = session;
    const payloadActualizado = {
      pedidoId: idpedido,
      action: tipo,
      directoraId: user.nIdDirectora,
      motivoRechazo: motivo,
    };
    const response = await http.post(
      `/api/pedidos/gestionDirectora/confirmarRechazarPedido`,
      payloadActualizado
    );

    if (response.status === 201) {
      return {
        success: true,
        message: response.data.message || "Pedido eliminado correctamente",
      };
    } else {
      return {
        success: false,
        status: response.status,
        message:
          response.data.message ||
          "Error inesperado al modificar el estado del artículo",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Error al eliminar pedido";
        throw new Error(errorMessage);
      }
    }
    throw new Error("Error de conexión al confirmar/rechazar pedido");
  }
};

export const confirmarTodosAPI = async (
  tipoOperacion: string,
  selectedPedidos: string[]
) => {
  const auth = await verifyToken();
  if (!auth.ok) {
    return {
      status: auth.status,
      message: auth.message,
    };
  }
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return null;
    }
    const { user } = session;

    const response = await http.post(
      `/api/pedidos/gestionDirectora/confirmarPorTipoOperacion`,
      {
        tipoOperacion,
        directoraId: user.nIdDirectora,
        sIdPedidoDetalleList: selectedPedidos
      }
    );

    if (response.status === 201) {
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Pedidos confirmados correctamente",
      };
    } else {
      return {
        success: false,
        status: response.status,
        message:
          response.data.message ||
          "Error inesperado al modificar el estado del artículo",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message || "Error al eliminar pedido";
      throw new Error(errorMessage);
    }
    throw new Error("Error de conexión al confirmar/rechazar pedido");
  }
};

export const getTrackingDirectora = async (
  // nIdDirectora: number,
  nombreEstrella: string,
  page: number,
  limit: number
): Promise<BolsasResponse> => {

  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      throw new Error("No hay sesión activa");
    } const { user } = session;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (nombreEstrella.trim() !== "") {
      queryParams.append("nombreEstrella", nombreEstrella);
    }
    const response = await http.get(
      `/api/pedidos/gestionBolsasListados/${user.nIdDirectora}?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener los pedidos"
    );
  }
};

export const getDetalleBolsa = async (
  bolsaId: string,
  nombreEstrella: string,
  page: number,
  limit: number
): Promise<DetalleBolsaResponse> => {
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      throw new Error("No autenticado");
    }
    const response = await http.get<DetalleBolsaResponse>(
      `/api/pedidos/gestionBolsasListados/detalle/${bolsaId}?nombreProducto=${nombreEstrella}&page=${page}&limit=1000000`
    );

    return response.data;
  } catch (error) {
    console.error("Error en getDetalleBolsa:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al obtener el detalle de la bolsa"
    );
  }
};


export const getDirectoraPorEstrella = async (
  idEstrella: number
) => {
  try {
    const response = await http.get(
      `/api/clientes/padreId/${idEstrella}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Error al obtener el detalle del pedido");
  }
};