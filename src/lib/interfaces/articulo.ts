export interface MarcaFiltro {
  nIdMarca: number;
  sNombreMarca: string;
  cantidad: number;
}

export interface CategoriaFiltro {
  nIdCategoria: number;
  sDescripcion: string;
  cantidad: number;
}

export interface GeneroFiltro {
  nIdGenero: number;
  sDescripcion: string;
  cantidad: number;
}

export interface TipoFiltro {
  nIdTipo: number;
  sDescripcion: string;
  cantidad: number;
}

export interface ColorFiltro {
  nIdColor: string;
  sDenominacion: string;
  sColorEcommerce: string;
  cantidad: number;
}

export interface RangoPrecioFiltro {
  min: number;
  max: number;
}

export interface EstiloFiltro {
  nIdEstilo: number;
  sDescripcion: string;
  cantidad: number;
}

export interface TallaFiltro {
  nIdTalla: number;
  sTalla: string;
  sDescripcion: string;
  cantidad: number;
}
export interface TipoCatalogoFiltro {
  nIdTipoCatalogo: number;
  sDescripcion: string;
  cantidad: number;
}

export interface CatalogoFiltro {
  nIdCatalogo: number;
  sCodigoCatalogo: string;
  nIdTipoCatalogo: number;
  sNombreComercial: string;
  sDescripcion: string;
  sEstadoDescripcion: string;
  cantidadProductos: number;
  sDescripcionTipoCatalogo: string;
}
export interface CatalogoFiltroResponse {
  data: CatalogoFiltro[];
  message: string;
  status: number;
}

export interface FiltrosResponse {
  data: {
    marcas: MarcaFiltro[];
    categorias: CategoriaFiltro[];
    generos: GeneroFiltro[];
    tipos: TipoFiltro[];
    colores: ColorFiltro[];
    rangoPrecio: RangoPrecioFiltro;
    estilos: EstiloFiltro[];
    tallas: TallaFiltro[];
    tiposCatalogo: TipoCatalogoFiltro[];
    catalogos: CatalogoFiltro[];
    tipo_pedido: TipoPedido[];
  };
  message: string;
  status: number;
}

//----------------------------------
export interface TipoPedido {
  nIdTipoCatalogo: number;
  sDescripcion: string;
}

export interface Marca {
  nIdMarca: number;
  sNombreMarca: string;
}

export interface Categoria {
  nIdCategoria: number;
  sDescripcion: string;
}

export interface Genero {
  nIdGenero: number;
  sDescripcion: string;
}

export interface Color {
  nIdColor: string;
  sDenominacion: string;
  sColorEcommerce: string;
}

export interface Precios {
  nPvs: number;
  nPrecioDirector: number;
  nPrecioSugerido: number;
  nPrecioPromotor: number;
}

export interface Imagen {
  sNombreArchivo: string;
  sUrlCompleta: string;
}

export interface Producto {
  nIdArticulo: number;
  nIdModelo: number;
  sItemName: string;
  sDescripcion: string;
  nIdColor: string;
  sCodigoCatalogo: string;
  sTipoCatalogo?: string;
  marca: Marca;
  categoria: Categoria;
  genero: Genero;
  color: Color;
  precios: Precios;
  imagenPrincipal: Imagen;
  enStock: boolean;
  stock: Stock;
}
export interface Stock {
  cantidad: number
  disponible: boolean
  mensaje: string
  tallasConStock: number[]
  tallasDisponibles: number

  totalTallas: number

}

export interface DataFilter {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface ProductosResponse {
  data: Producto[];
  message: string;
  status: number;
  dataFilter: DataFilter;
}

// Interfaces para los parámetros de filtrado
export interface ProductosParams {
  page?: number;
  limit?: number;
  orderBy?: string;
  nIdCategoria?: number;
  nIdMarca?: number[];
  nIdGenero?: number;
  nIdTipo?: number;
  colores?: string[];
  precioMin?: number;
  precioMax?: number;
  ordenar?: string;
  tallas?: number[];
  buscar?: string;
  nIdTipoCatalogo?: number;
  nIdEstilo?: number;
  nIdCatalogo?: number[];
  nIdDirectora?: number | null;

  nomCatalogo?: string[]
  nomMarca?: string[]
  nomGenero?: string
  nomTipo?: string
  nomCategoria?: string
  nomColor?: string[];
  nomEstilo?: string
  nomTalla?: string[];

  nIdTipoPedido?: number;
  nomTipoPedido?: string
}
//----------------------------------
export interface Catalogo {
  nIdCatalogo: number;
  sCodigoCatalogo: string;
  sNombreComercial: string;
  dFechaHoraInicio: string;
  dFechaHoraFin: string;
  sTipoCatalogo: string;
  sStatusCatalogo?: string
}

export interface Modelo {
  nIdModelo: number;
  sDescripcion: string;
}

export interface Estilo {
  nIdEstilo: number;
  sDescripcion: string;
}

export interface Familia {
  nIdFamilia: number;
  sDescripcion: string;
}

export interface ColorSeleccionado {
  nIdColor: string;
  sDenominacion: string;
  sColorEcommerce: string;
}

export interface ColorDisponible {
  nIdColor: string;
  nIdModelo: number;
  sDenominacion: string;
  sColorEcommerce: string;
  nIdArticulo: number;
  sCodigoCatalogo: number;
  imagen: Imagen;
}

export interface Talla {
  nIdTalla: number;
  sTalla: string;
  sSkuHijo: string;
  sItemName: string;
  nStockDisponible: number;
  disponible: boolean;
  statusStock?: string

  nStockConfirmado?: number;
  sTipoCatalogo?: string
}

export interface ProductoRecomendado {
  sDescripcionProducto: string;
  nIdArticulo: number;
  sItemName: string;
  nIdColor: string;
  nIdModelo: number;
  sCodigoCatalogo: string;
  marca: Marca;
  categoria: Categoria;
  color: Color;
  precios: Precios;
  imagenPrincipal: Imagen;
  genero: Genero;
  sTipoCatalogo?: string;
}

export interface DetalleProducto {

  catalogo: Catalogo;
  nIdArticulo: number;
  nIdListaPrecio: number,
  sSkuPadre: string;
  sSkuHijo: string;
  sItemName: string;
  sNivelPrecioId: string;
  sDescripcion: string;
  sDescripcionTecnica: string;
  marca: {
    nIdMarca: number;
    sNombreMarca: string;
    bEsMarcaPropia: boolean;
    nDiasGarantia: number;
  };
  modelo: Modelo;
  genero: Genero;
  estilo: Estilo;
  familia: Familia;
  categoria: Categoria;
  tipo: TipoFiltro;
  sProcedencia: string;
  sMaterialPredominante: string;
  sHormaPuntera: string;
  sLinkFicha: string;
  colorSeleccionado: ColorSeleccionado;
  coloresDisponibles: ColorDisponible[];
  detallesAdicionales: { [key: string]: string };
  tallas: Talla[];
  precios: Precios;
  imagenes: {
    nIdImagen: number;
    sNombreArchivo: string;
    nVista: number;
    sUrlCompleta: string;
  }[];
  guiaTalla: string; // Podría definirse una interfaz específica si hay datos estructurados
  recomendaciones: ProductoRecomendado[];
  alternativeInfo: {
    message: string;
    catalogoActivo: {
      nIdCatalogo: string;
      sCodigoCatalogo: string;
      sNombreComercial: string;
    };
    precios: Precios;
  };
  proximaOferta: {
    mensaje: string;
    catalogoFuturo: {
      nIdCatalogo: number;
      sCodigoCatalogo: string;
      sNombreComercial: string;
    };
    precios: Precios;
  };
  ultimaOportunidad: {
    mensaje: string;
    fechaIncremento: string;
    catalogoFuturo: {
      nIdCatalogo: number;
      sCodigoCatalogo: string;
      sNombreComercial: string;
    };
    precios: Precios;
  };
}

export interface DetalleProductoResponse {
  data: DetalleProducto | null;
  message: string;
  status: number;
}


export interface RecomendacionesResponse {
  data: Articulo[] | null;
  message: string;
  status: number;
}
export interface Tipo {
  nIdTipo: number;
  sDescripcion: string;
}

export interface Articulo {
  nIdArticulo: number;
  nIdModelo: number;
  sDescripcionProducto: string;
  sTipoCatalogo: string;
  sItemName: string;
  nIdColor: string;
  sCodigoCatalogo: string;
  marca: Marca;
  categoria: Categoria;
  genero: Genero;
  tipo: Tipo;
  estilo: Estilo;
  color: Color;
  precios: Precios;
  imagenPrincipal: Imagen;
}