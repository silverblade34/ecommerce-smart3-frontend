"use server";
import {
  Catalogo,
  CatalogoFiltro,
  CatalogoFiltroResponse,
  DetalleProductoResponse,
  FiltrosResponse,
  ProductosParams,
  ProductosResponse,
  RecomendacionesResponse,
  Talla,
} from "@/lib/interfaces/articulo";
import { http } from "@/utils/http";
import axios from "axios";
import { getServerSession } from "next-auth";
import nextAuthOptions from "../auth";

const EXCLUDED_KEYS = [
  "nomCatalogo",
  "nomMarca",
  "nomGenero",
  "nomTipo",
  "nomCategoria",
  "nomColor",
  "nomEstilo",
  "nomTalla",
  "nomTipoPedido"
];


export const getEcommerceFiltersService = async (
  params: ProductosParams = {}
) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const user = session?.user;

    const { colores, tallas, nIdDirectora, ...restParams } = params;

    const filteredParams = Object.fromEntries(
      Object.entries(restParams).filter(
        ([key]) => !EXCLUDED_KEYS.includes(key)
      )
    );

    const queryParams: URLSearchParams = new URLSearchParams(
      Object.entries(filteredParams)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );

    if (user?.nIdCliente) {
      queryParams.append("nIdCliente", user.nIdCliente.toString());
    }

    // Añadir array de colores si existe
    if (colores && colores.length > 0) {
      colores.forEach((color) => {
        queryParams.append("colores", color);
      });
    }

    // Añadir array de tallas si existe
    if (tallas && tallas.length > 0) {
      tallas.forEach((talla) => {
        queryParams.append("tallas", talla.toString());
      });
    }
    const queryString = queryParams.toString();
    const url = `/api/articulos/ecommerce/filtros${queryString ? `?${queryString}` : ""}`;
    const res = await http.get<FiltrosResponse>(url);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.code === 'ECONNABORTED' || error.response?.status === 522) {
        return {
          data: {
            marcas: [],
            categorias: [],
            generos: [],
            tipos: [],
            colores: [],
            rangoPrecio: { min: 0, max: 0 },
            estilos: [],
            tallas: [],
            tiposCatalogo: [],
            catalogos: [],
            tipo_pedido: []
          },
          message: "",
          status: 200,
        };
      }
      return {
        data: {
          marcas: [],
          categorias: [],
          generos: [],
          tipos: [],
          colores: [],
          rangoPrecio: { min: 0, max: 0 },
          estilos: [],
          tallas: [],
          tiposCatalogo: [],
          catalogos: [],
          tipo_pedido: []
        },
        message: error.response?.data.message || "Error al obtener los filtros",
        status: error.response?.status || 500,
      };
    } else {
      return {
        data: {
          marcas: [],
          categorias: [],
          generos: [],
          tipos: [],
          colores: [],
          rangoPrecio: { min: 0, max: 0 },
          estilos: [],
          tallas: [],
          tiposCatalogo: [],
          catalogos: [],
          tipo_pedido: []
        },
        message: "Error al obtener los filtros del e-commerce",
        status: 500,
      };
    }
  }
};

export const getEcommerceProductosService = async (
  params: ProductosParams = {}
) => {
  try {
    const session = await getServerSession(nextAuthOptions);
    const user = session?.user;

    const { colores, tallas, nIdDirectora, page, ...restParams } = params;

    const filteredParams = Object.fromEntries(
      Object.entries(restParams).filter(
        ([key]) => !EXCLUDED_KEYS.includes(key)
      )
    );

    const queryParams: URLSearchParams = new URLSearchParams(
      Object.entries(filteredParams)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, String(value)])
    );

    // Añadir array de colores si existe
    if (colores && colores.length > 0) {
      colores.forEach((color) => {
        queryParams.append("colores", color);
      });
    }

    if (page !== undefined && page !== null) {
      let pageNumber = Number(page);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        queryParams.append("page", pageNumber.toString());
      }
    }
    // if (nIdDirectora != null && !isNaN(nIdDirectora) && nIdDirectora != 0) {
    //   queryParams.append("nIdDirectora", nIdDirectora.toString());
    // }

    if (user?.nIdCliente) {
      queryParams.append("nIdCliente", user.nIdCliente.toString());
    }

    // Añadir array de tallas si existe
    if (tallas && tallas.length > 0) {
      tallas.forEach((talla) => {
        queryParams.append("tallas", talla.toString());
      });
    }

    const queryString = queryParams.toString();

    const url = `/api/articulos/ecommerce/productos${queryString ? `?${queryString}` : ""
      }`;

    const res = await http.get<ProductosResponse>(url);
    console.log("qqqqqq", res.data)

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.code === 'ECONNABORTED' || error.response?.status === 522) {
        return {
          data: [],
          message: "",
          status: 200,
          dataFilter: {
            totalItems: 0,
            totalPages: 0,
            currentPage: 1,
            pageSize: 10,
          },
        };
      }
      return {
        data: [],
        message:
          error.response?.data.message || "Error al obtener los productos",
        status: error.response?.status || 500,
        dataFilter: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
        },
      };
    } else {
      return {
        data: [],
        message: "Error al obtener los productos del e-commerce",
        status: 500,
        dataFilter: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          pageSize: 10,
        },
      };
    }
  }
};

export const getDetalleProductoService = async (
  nIdArticulo: string,
  nIdColor: string,
  sCodigoCatalogo: string,
  nIdDirectora: number
) => {
  try {
    let url = `/api/articulos/ecommerce/detalle-producto/${nIdArticulo}/${nIdColor}/${sCodigoCatalogo}`;
    if (nIdDirectora && !isNaN(nIdDirectora) && nIdDirectora !== 0) {
      url += `?nIdDirectora=${nIdDirectora}`;
    }
    const res = await http.get<DetalleProductoResponse>(url);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.code === 'ECONNABORTED' || error.response?.status === 522) {
        return {
          data: null,
          message: "",
          status: 200,
        }
      }
      return {
        data: null,
        message:
          error.response?.data.message ||
          "Error al obtener el detalle del producto",
        status: error.response?.status || 500,
      };
    } else {
      return {
        data: null,
        message: "Error al obtener el detalle del producto",
        status: 500,
      };
    }
  }
};


export const getStockTallas = async (
  nIdArticulo: number,
  nIdColor: string,
  nIdListaPrecio: number
) => {
  try {
    const body: any = {
      nIdArticulo,
      nIdColor,
      nIdListaPrecio
    };
    const res = await http.post<Talla[]>(
      '/api/articulos/ecommerce/stocks-disponibles',
      body
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: [],
        message: error.response?.data.message || "Error al obtener el stock",
        status: error.response?.status || 500,
      };
    } else {
      return {
        data: [],
        message: "Error al obtener el stock",
        status: 500,
      };
    }
  }
};



export const getProductosRecomendadosService = async (
  nIdModelo: number,
  nIdColor: string,
  sCodigoCatalogo: string,
  nIdDirectora: number
) => {
  try {
    const body: any = {
      nIdModelo,
      nIdColor,
      sCodigoCatalogo
    };

    if (nIdDirectora != null && nIdDirectora !== 0 && !isNaN(nIdDirectora)) {
      body.nIdDirectora = nIdDirectora;
    }

    const res = await http.post<RecomendacionesResponse>(
      '/api/articulos/ecommerce/productos-recomendados',
      body
    );
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: [],
        message: error.response?.data.message || "Error al obtener recomendaciones",
        status: error.response?.status || 500,
      };
    } else {
      return {
        data: [],
        message: "Error al obtener recomendaciones",
        status: 500,
      };
    }
  }
};

export const getFiltrosCatalogs = async () => {

  try {
    const session = await getServerSession(nextAuthOptions);
    const nIdCliente = session?.user?.nIdCliente ?? null; // usa null si no hay sesión o user
    const { data } = await http.post<CatalogoFiltroResponse>(
      `/api/articulos/catalogos/get-catalogos-filtro`,
      { nIdCliente: nIdCliente }
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );
    console.log()
    return data.data;
  } catch (error) {

    return null;
  }
};