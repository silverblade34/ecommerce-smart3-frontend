"use server";
import { http } from "@/utils/http";
import { API_GATEWAY_URL } from '@/utils/Constants';
import { BuscarDevolucionesParams, ClientDevolution, DatosDetalles, DatosDev, DatosList, EnvioList, ListadoAgencias, ListadoTrackingDev, ListDetalleProductos, ListDevHistorial } from "@/lib/interfaces/devoluciones";
import axios from "axios";

export const deleteProductoDevolucionService = async (id: string) => {
  try {
    const res = await http.delete(`/api/devoluciones/productos/${id}`);
    return {
      success: true,
      data: res.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error en la respuesta:", error.response);
      return {
        message: error.response?.data?.message || "Error en el servidor",
        success: false,
      };
    } else {
      return {
        message: "Error desconocido al eliminar el producto",
        success: false,
      };
    }
  }
};
export const getListDevService = async (id: number, tipoDevolucion: string) => {
  try {

    const res = await http.get<{ data: DatosDev[]; message: string; status: number }>(
      `/api/devoluciones/integracion/pedidos-facturados-directora/${id}?tipoDevolucion=${tipoDevolucion}`
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el listado de devoluciones");
  }
};
export const getListMotivosService = async (sTipoDevolucion: string) => {
  try {
    const res = await http.get<{ data: DatosList[]; message: string; status: number }>(
      `/api/devoluciones/listar-motivos`,
      {
        params: { sTipoDevolucion }, // <-- aquí se agrega el parámetro
      }
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el listado de devoluciones");
  }
};


export const getListEnvioService = async (params: BuscarDevolucionesParams) => {
  try {
    const res = await http.get<ListadoTrackingDev>(
      `/api/devoluciones/tracking/listar-paginado`,
      { params }
    );
    return res.data.data;
  } catch (error) {
    console.error("Error al obtener devoluciones paginadas", error);
    throw new Error("Error al obtener devoluciones paginadas");
  }
};


export const getListDetalleService = async (numeroDevoluciones: unknown) => {
  try {
    const res = await http.get<{ data: DatosDetalles[]; message: string; status: number }>(
      `/api/devoluciones/listar-detalle-devoluciones-envio`,
      {
        params: { numeroDevoluciones }, // Aquí se pasa el estado correctamente
      }
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el listado de devoluciones");
  }
};

export const getListEnvioByIdCodeAction = async (sNumeroDevolucion: string[]) => {
  try {
    const queryString = sNumeroDevolucion
      .map(id => `numeroDevoluciones=${encodeURIComponent(id)}`)
      .join("&");
    console.log("sNumeroDevolucion123", sNumeroDevolucion)
    const res = await http.get<{
      data: ClientDevolution[];
      message: string;
      status: number;
    }>(
      `/api/devoluciones/listar-detalle-devoluciones-envio?${queryString}`,

    );
    console.log("ver", res)
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el listado de devoluciones");
  }
}

export const getResumenByDevolutionsAction = async (sNumeroDevolucion: string[]) => {
  try {
    const res = await http.post<{
      data: {
        sNombreGeneral: string;
        nCantidad: number;
        mappperIdentificador: Array<{
          id: number;
          sNumeroDevolucion: string;
        }>
      }
      message: string;
      status: number;
    }>(
      `/api/devoluciones/resumen-por-devoluciones`,
      {
        sNumeroDevolucion
      }
    );

    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el listado de devoluciones");
  }
}

export const ListAgencyService = async () => {
  try {


    const res = await http.get<ListadoAgencias>(
      `${API_GATEWAY_URL}/api/devoluciones/agencias/listar`,
      {

      }
    );

    return res.data;
  } catch (error) {
    console.error('Error al obtener las agencias', error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response?.data?.message || 'Error al obtener las agencias'
      );
    } else {
      throw new Error('Error desconocido al obtener las agencias');
    }
  }
};

const buildFormData = (payload: Record<string, unknown>) => {
  const formData = new FormData();
  if (!("sFotos" in payload)) {
    return payload;
  }
  for (const key in payload) {
    const value = payload[key];
    if (key === "sFotos" && Array.isArray(value)) {
      value.forEach((file: File) => {
        formData.append("sFotos", file);
      });
    } else if (
      typeof value === "object" &&
      value !== null &&
      !(value instanceof File)
    ) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }

  return formData;
};

export const postRegistrarCambioService = async (payload: Record<string, unknown>) => {
  try {
    const formData = buildFormData(payload);
    console.log("formData2", formData)
    const response = await axios.post(
      `${API_GATEWAY_URL}/api/devoluciones/registrar-devolucion`,
      formData
    );
    console.log("response.data", response.data)
    return {
      data: response.data,
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    console.log("errorerror", error)
    if (axios.isAxiosError(error) && error.response) {
      console.log("error.response12", error.response.data?.message)
      return {
        success: false,
        message: Array.isArray(error.response.data?.message)
          ? error.response.data.message.join(", ")
          : error.response.data?.message || "Error desconocido del servidor",
      };
    }

    console.error("Error inesperado:", error);
    return {
      success: false,
      message: "Error inesperado al registrar el cambio",
    };
  }
};


// export const postRegistrarCambioService = async (payload: Record<string, unknown>) => {
//   try {
//     const formData = buildFormData(payload);

//     const res = await http.post('/api/devoluciones/registrar-devolucion', formData);

//     return {
//       data: res.data,
//       success: true,
//       message: res.data?.message || "Operación exitosa",
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error) && error.response) {
//       return {
//         success: false,
//         message: Array.isArray(error.response.data?.message)
//           ? error.response.data.message.join(", ")
//           : error.response.data?.message || "Error desconocido del servidor",
//       };
//     } else {
//       return {
//         success: false,
//         message: "Error inesperado al registrar el cambio",
//       };
//     }
//   }
// };

export const GenerarBultosService = async (data: {
  devoluciones: { id: string; sNumeroDevolucion: string }[];
  bultos: { nCantidad: number }[];
}) => {
  try {
    const res = await http.post('/api/devoluciones/registrar-bulto-ecommerce', data);
    console.log({ res });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        message: error.response?.data.message,
        success: false,
      };
    } else {
      return {
        message: 'Error al registrar los bultos',
        success: false,
      };
    }
  }
};

export const getDevolucionesxDirectora = async (nIdDirectora: number, tipoDevolucion: string) => {
  try {
    const response = await http.get(
      `/api/devoluciones/detalles-por-cliente/${nIdDirectora}?tipoDevolucion=${tipoDevolucion}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        res: Array.isArray(error.response.data?.message)
          ? error.response.data.message.join(", ")
          : error.response.data?.message || "Error desconocido del servidor",

        status: false
      }

    }
  }
};
export const ListProductosDetalles = async (id: number): Promise<ListDetalleProductos | { res: string; status: false }> => {
  try {
    const res = await http.get<ListDetalleProductos>(`/api/devoluciones/tracking/${id}/detalle`);
    return res.data; // ✅ Aquí estás devolviendo { message, status, data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        res: Array.isArray(error.response.data?.message)
          ? error.response.data.message.join(", ")
          : error.response.data?.message || "Error desconocido del servidor",
        status: false,
      };
    }

    throw error;
  }
};
export const ListProductosHistorial = async (id: number): Promise<ListDevHistorial | { res: string; status: false }> => {
  try {
    const res = await http.get<ListDevHistorial>(`/api/devoluciones/tracking/${id}/listado-visitas`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        res: Array.isArray(error.response.data?.message)
          ? error.response.data.message.join(", ")
          : error.response.data?.message || "Error desconocido del servidor",
        status: false,
      };
    }

    throw error;
  }
};

export const eliminarDevolucionRegistrada = async (
  id: string,
  motivo: string
) => {
  try {
    const response = await http.delete(
      `/api/devoluciones/detalle/eliminar-logico`,
      {
        data: {
          id,
          motivo,
        }
      }
    );
    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message || "Registro eliminado correctamente",
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

export const EnvioDevolucionService = async (formData: FormData) => {
  try {
    const res = await http.post(
      "/api/devoluciones/registrar-envio-devolucion",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        validateStatus: (status) => status >= 200 && status < 600
      }
    );

    if (res.status === 201 || res.status === 504) {
      return {
        status: res.status,
        data: res.data ?? null,
        message: res.data?.message || "Procesado correctamente",
        success: true
      };
    }
    return {
      status: res.status,
      message: res.data?.message || "Error del servidor",
      success: false,
    };

  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 500,
        message: error.response?.data?.message || "Error de conexión",
        success: false,
      };
    }
    return {
      status: 500,
      message: "Error inesperado al enviar las devoluciones",
      success: false,
    };
  }
};


export const PDFBultosService = async (nIdBultoCabecera: string) => {

  try {
    const res = await http.post(`/api/devoluciones/generar-rotulo/${nIdBultoCabecera}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        message: error.response?.data.message,
        success: false,
      };
    } else {
      return {
        message: 'Error al registrar los bultos',
        success: false,
      };
    }
  }
};



export const lastDevolutionByClientAction = async (nIdCliente: number, sTipoDevolucion: string) => {
  try {
    const res = await http.get<{
      status: number;
      message: string;
      data: {
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
        };
      }
    }>(`/api/devoluciones/obtener-ultima-devolucion/${nIdCliente}/${sTipoDevolucion}`);

    return {
      res: res.data.data,
      status: true
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("ERROR", error.response.data.message)
      return {
        res: Array.isArray(error.response.data?.message)
          ? error.response.data.message.join(", ")
          : error.response.data?.message || "Error desconocido del servidor",

        status: false
      }

    }
  }

}


export const generateBaseDevolucionAction = async (payload: {
  sTipoDevolucion: string;
  sClienteId: string;
  sNombreCliente: string;
  sZona: string;
}) => {
  try {
    const res = await http.post('/api/devoluciones/registrar-base-devolucion', payload);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al generar la base de devolucion');
    } else {
      throw new Error('Error desconocido al generar la base de devolucion');
    }
  }
}

export const getDetailDevolutionBySku = async (sSkuHijo: string,nIdColor: string) => {
  try {
    const res = await http.post<{
      sku: string,
      porcentajeDevolucion: string,
    }>('/api/devoluciones/detalle-devolucion-talla',{
      sSkuHijo,
      nIdColor
    })
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || 'Error al obtener el detalle de la devolucion por SKU');
    } else {
      throw new Error('Error desconocido al obtener el detalle de la devolucion por SKU');
    }
  }
}