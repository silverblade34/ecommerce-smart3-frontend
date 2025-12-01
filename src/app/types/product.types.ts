import { Precios } from "@/lib/interfaces/articulo";

export type GeneralDataProduct = {
  sCodMaterial: string;
  sDescripcion: string;
  sMarca: string;
  sCodModelo: string;
  nFlagTieneGuiaTallas: number;
  sAtributos: string;
};

export type Product = {
  oDatosMaterial: {
    oGeneral: GeneralDataProduct;
    oPrecios: VariantProduct[];
  };
  oResult: {
    bSatisfactorio: boolean;
    sErrCode: string;
    sMessage: string;
  };
};
export type VariantProduct = {
  nColorSeleccionado: number;
  sCodMaterial: string;
  sCodCampana: string;
  sCodColor: string;
  sColor: string;
  sNombreComercialCampana: string;
  nPrecioSugerido: number;
  nPrecioAnterior: number;
  nPorcentajeDescuento: number;
  sFotoDefecto: string;
  oTallas: SizeProduct[];
  oFotos: ImageProduct[];
  oPrecioMenor: PriceLowerProduct[];
  dtFechaInicioCampana: string;
  nEstadoCampana: number;
  oRelacionados: Material[];
};

export type SizeProduct = {
  nIdGridValue: number;
  sCodMaterial: string;
  sTalla: string;
  sCodColor: string;
  sDisponible: string;
  nStockDisponible: number;
};
export type ImageProduct = {
  sCodMaterial: string;
  sCodColor: string;
  sUrlFoto: string;
};

export type PriceLowerProduct = {
  sCodMaterial: string;
  sCodCampana: string;
  sCodColor: string;
  sColor: string;
  nPrecioSugerido: number;
  sFotoDefecto: string;
};
export type ProductSelected = {
  id: number | string;
  model: string;
  brand: string;
  size: number;
  sizeName: string;
  colorName: string;
  date: string;
  name: string;
  prices: Precios;
  color: string;
  quantity: number;
  image: string;
  maxQuantity: number;
  catalog: string;
  sNivelPrecioId: string;
  sSkuHijo: string;
  sTipoCatalogo:string
  agotado? :boolean
  stockDisponible? : number
  articuloNoVigente?: boolean;
};

export type GuideSize = {
  oDatosGuia: {
    nIdTipoMaterial: number;
    sReporteGuiaTallas: string;
  };
  oResult: {
    bSatisfactorio: boolean;
    sErrCode: string;
    sMessage: string;
  };
};

export type ImagesGuideSize = {
  mobile: string;
  desktop: string;
};

// ---------------------------------------------------
export interface Material {
  nOrden: number;
  sDescripcion: string;
  nPrecioSugerido: number;
  sUrl: string;
  sCodCampana: string;
  sCodMaterial: string;
  sCodColor: string;
  nIdJerarquia: number;
  sDesCatalogo: string;
  sDesGenero: string;
  sDesTipo: string;
  sDesCategoria: string;
  sDesMarca: string;
  sDesColor: string;
}

export interface Total {
  nTotalItems: number;
}

export interface Campana {
  sCodCampana: string;
  sDesCatalogo: string;
}

export interface Genero {
  sDesGenero: string;
}

export interface Tipo {
  sDesTipo: string;
}

export interface Categoria {
  sDesCategoria: string;
}

export interface Marca {
  sDesMarca: string;
  nIdMarca: number;
}

export interface Color {
  sColorFiltro: string;
}

export interface Precio {
  nMinimo: number;
  nMaximo: number;
}

export interface Paginacion {
  total_items: number;
  limitpage: number;
  current_page: number;
  total_pages: number;
  next: string | null;
  previous: string | null;
}

export interface RootObject {
  oMateriales: Material[];
  oTotal: Total;
  oCampanas: Campana[];
  oGeneros: Genero[];
  oTipo: Tipo[];
  oCategoria: Categoria[];
  oMarca: Marca[];
  oColor: Color[];
  oPrecio: Precio;
  oPaginacion: Paginacion;
}
