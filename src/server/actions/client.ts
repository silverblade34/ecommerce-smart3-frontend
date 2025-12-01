"use server";

import {
  CentroModaEstrella,
  ClientCartTable,
  ClienteEstrella,
  ClientTableResponse,
  ClientTableResponseCart,
  DocumentoValidado,
  GeneroCliente,
  IFormaPagoCliente,
  MetodoPagoCliente,
  PagosActivos,
  TipoCliente,
  TipoDocumentoCliente,
  Ubigeo,
} from "@/lib/interfaces/clientes";
import { http } from "@/utils/http";
import axios from "axios";
import { getServerSession } from "next-auth";
import nextAuthOptions from "../auth";
import {
  CentroModaDirectora,
  EditDirectoraForm,
} from "@/lib/interfaces/directora";
export const getGenerosService = async () => {
  try {
    const res = await http.get<GeneroCliente[]>("/api/clientes/genero");
    return res.data;
  } catch {
    throw new Error("Error al obtener los generos");
  }
};

export const getTiposClienteService = async () => {
  try {
    const res = await http.get<TipoCliente[]>("/api/clientes/tipo-cliente");
    return res.data;
  } catch {
    throw new Error("Error al obtener los tipos de cliente");
  }
};

export const getTipoDocumentoService = async () => {
  try {
    const res = await http.get<TipoDocumentoCliente[]>(
      "/api/clientes/tipo-documento"
    );
    return res.data;
  } catch {
    throw new Error("Error al obtener los tipos de documento");
  }
};

export const getUbigeoService = async () => {
  try {
    const res = await http.get<Ubigeo[]>("/api/clientes/ubigeo");
    return res.data;
  } catch {
    throw new Error("Error al obtener los ubigeos");
  }
};

export const getMetodoPagoService = async () => {
  try {
    const res = await http.get<MetodoPagoCliente[]>(
      "/api/clientes/metodo-pago"
    );
    return res.data;
  } catch {
    throw new Error("Error al obtener los metodos de pago");
  }
};

export const getFormaPagoService = async () => {
  try {
    const res = await http.get<IFormaPagoCliente>(
      "/api/clientes/directora/forma-pago"
    );
    return res.data;
  } catch {
    throw new Error("Error al obtener las formas de pago");
  }
};

export const validateDocumentService = async (
  numeroDocumento: string,
  typeDocument: string = "dni"
) => {
  try {
    const res = await http.post<DocumentoValidado>(
      `/api/integraciones/validar-documento?tipoDocumento=${typeDocument}`,
      { numeroDocumento }
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("error.response", error.response);
      return {
        message: error.response?.data.message,
        success: false,
      };
    } else {
      return {
        message: "Error al validar el documento",
        success: false,
      };
    }
  }
};

export const sendCodeService = async (sTipo: string, sValor: string) => {
  try {
   const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



    const res = await http.post("/api/clientes/enviar-codigo-verificacion", {
      sTipo,
      sValor,
    },
  {
    headers: { Authorization: `Bearer ${token}` },
  });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("ERROR", error.response);
      return {
        message: error.response?.data.message,
        success: false,
      };
    } else {
      return {
        message: "Error al validar el n° telefono",
        success: false,
      };
    }
  }
};

export const sendMedioPagos = async (
  nIdDirectora: number,
  formasAgregadas: number[],
  formasEliminadas: number[]
) => {
  try {
    const res = await http.post(
      "/api/clientes/directora/configurar-multiple-pago",
      {
        nIdDirectora,
        formasAgregadas,
        formasEliminadas,
      }
    );
    return res.data;
  } catch (error) {
    console.error("Error al enviar la configuración de pagos:", error);
    throw new Error("Error al enviar la configuración de pagos");
  }
};

export const createClientService = async (data: unknown) => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



    const res = await http.post("/api/clientes/crear", JSON.stringify(data),{
    headers: { Authorization: `Bearer ${token}` },
  });
    return {
      success: true,
      data: res.data,
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        message: error.response?.data.message,
        success: false,
      };
    } else {
      return {
        message: "Error al validar el documento",
        success: false,
      };
    }
  }
};

export const listClientesHijosService = async (sCodInterlocutor: string) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return [];
    }
    console.log("session.user.nIdCliente", session.user.nIdCliente)
    const res = await http.get<ClientTableResponse[]>(
      `/api/clientes/listar-hijos?nIdCliente=${session.user.nIdCliente}&sCodInterlocutor=${sCodInterlocutor}`
    );
    return res.data;
  } catch {
    throw new Error("Error al obtener los clientes hijos");
  }
};

export const listClientesEstrellasService = async (
  nIdCliente: number,
  search: string = "",
  page: number = 1,
  limit: number = 25
) => {
  try {
      const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;

    const res = await http.get(
      `/api/clientes/listar-estrellas-paginado/${nIdCliente}?search=${search}&page=${page}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const { data, pagination } = res.data;

    // ✅ Normalizamos para que el hook reciba siempre la misma estructura
    return {
      success: true,
      data: {
        items: data || [],
        totalPages: pagination?.totalPages || 1,
        totalItems: pagination?.totalRecords || data?.length || 0,
        currentPage: pagination?.currentPage || page,
      },
    };
  } catch (error) {
    console.error("Error al obtener estrellas paginadas", error);
    throw new Error("Error al obtener las estrellas");
  }
};




export const listEstrellasporDirectora = async (
  sCodInterlocutor: string,
  search: string = ""
): Promise<ClientCartTable[]> => {
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session?.user?.nIdCliente) {
      return [];
    }
    const res = await http.get<ClientTableResponseCart>(
      `/api/clientes/listar-hijos-pedidos?nIdCliente=${session.user.nIdCliente}&sCodInterlocutor=${sCodInterlocutor}&search=${search}`
    );
    return res.data.data;
  } catch (error) {
    throw new Error("Error al obtener los clientes hijos");
  }
};


export const updatePhoneEmailService = async (
  id: number,
  sTipo: string,
  sValor: string
) => {
  try {
    const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



    const res = await http.post(`/api/clientes/update-phone-email/${id}`, {
      sTipo,
      sValor,
    },
  {
    headers: { Authorization: `Bearer ${token}` },
  });
    return res.data;
  } catch {
    throw new Error("Error al actualizar el contacto");
  }
};

export const updateDireccionService = async (
  id: number,
  sCodigoUbigeo: string,
  sDireccion: string,
  nLatitud: number,
  nLongitud: number
) => {
  try {
     const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



    const res = await http.patch(`/api/clientes/update-direction/${id}`, {
      sCodigoUbigeo: sCodigoUbigeo,
      sDireccion: sDireccion,
      nLatitud: nLatitud,
      nLongitud: nLongitud,
    },
  {
    headers: { Authorization: `Bearer ${token}` },
  });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("ERROR AQUI", error);
      if (error.response) {
        console.log("ERROR AQUI", error.response);
        const errorMessage =
          error.response.data?.message || "Error al rechazar pedido";
        throw new Error(errorMessage);
      }
    }
    throw new Error("Error de conexión al confirmar/rechazar pedido");
  }
};

export const PagosActivosService = async (idCliente: number) => {
  console.log("ID CLIENTE", idCliente);
  try {
    const res = await http.get<PagosActivos>(
      `/api/clientes/directora/obtener-formas-pago/${idCliente}`
    );
    return res.data;
  } catch (error) {
    console.log("ERROR", error);
    throw new Error("Error al obtener el centro de moda");
  }
};

export const centroModaEstrellaService = async (idCliente: number) => {
  try {
    console.log({ idCliente });
    const res = await http.get<CentroModaEstrella>(
      `/api/clientes/centro-moda-estrella/${idCliente}`
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el centro de moda");
  }
};

export const centroModaDirectoraService = async (idCliente: number) => {
  try {
    const res = await http.get<CentroModaDirectora>(
      `/api/clientes/centro-moda-directora/${idCliente}`
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    throw new Error("Error al obtener el centro de moda");
  }
};

export const updateDataDirectoraService = async (
  data: EditDirectoraForm,
  idCliente: number
) => {
  try {
      const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



    const res = await http.patch(
      `/api/clientes/editar/datos-directora/${idCliente}`,
      JSON.stringify(data),
      {
    headers: { Authorization: `Bearer ${token}` },
  }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log("ERROR AQUI", error.response);
        const errorMessage =
          error.response.data?.message || "Error al rechazar pedido";
        throw new Error(errorMessage);
      }
    }
    throw new Error("Error de conexión al confirmar/rechazar pedido");
  }
};



export const LogoutService = async (nIdCliente: number) => {
  try {
  const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;

    const res = await http.post(
      `/api/auth/logout`,
      { nIdCliente },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Respuesta del logout:", res.data);
    return res.data; // el backend debe devolver success/message
  } catch (error: any) {
    console.error("❌ Error en LogoutService:", error.response?.data || error.message);
    throw new Error("Error al cerrar sesión del cliente");
  }
};

export const BannersService = async (nIdCliente: number) => {
  try {


    const res = await http.get(
      `/api/articulos/reglas-visualizacion-banners/banners-permitidos/${nIdCliente}`,
      {
     
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("❌ Error en BannersService:", error.response?.data || error.message);
    throw new Error("Error al obtener banners permitidos");
  }
};
