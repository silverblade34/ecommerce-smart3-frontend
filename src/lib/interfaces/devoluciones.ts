export interface DevolucionesCambio {
  sCorrelativo: string;
  nTotal: number;
  devoluciones: EstrellaCambio[];
}

export interface EstrellaCambio {
  estrella: string;
  total: number;
  cantidadAceptada: number;
  cantidadFacturada: number;
  productos: ProductoCambio[];
}

export interface ProductoCambio {
  nIdProductoDevolución: number,
  nombre: string;
  precio: number;
  cantidad: number;
  talla: number;
  color: string;
  fecha: string;
  foto: string
}
export interface ListadoDevoluciones {
  // status: number;
  message: string;
  data: DatosDev[];
}

export interface DatosDev {
  dtFechaPedido: Date;
  sIdPedidoDetalle: string;
  sPedidoNetsuiteId: string;
  sDatosEstrella: SDatosEstrella;
  sDatosProducto: SDatosProducto;
  nCantidad: number;
  nIndiceNetsuite: number
  nPrecioEstrella: string;
  nSubtotal: string;
  nPrecioSugerido: string;
  pedidoCabecera: PedidoCabecera;
  plazoCambio: PlazoCambioDev

}
interface PlazoCambioDev {
  nDias: number
  dtFechaLimite: string
  bEnPlazo: boolean
}
export interface PedidoCabecera {
  sNumeroFactura: string;
  sNumeroGuia: string;
  dtFechaFactura: string;
  infoEnvioDirectora: InfoEnvioDirectora
  sCodigoOrderVenta: string
}

interface InfoEnvioDirectora {
  sFacturaId: string;
  entity: string;
  emailDirectora: string;
  salesRepId: string;
  transportId: string;

}

export interface SDatosEstrella {
  nIdEstrella: number;
  nIdInterno: string;
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sNumeroCelular: string;
  sNumeroDocumento: string;
}

export interface SDatosProducto {
  nIdArticulo: number;
  sSkuHijo: string;
  nIdColor: string;
  sUrlEcommerce: string;
  sExternalId: string;
  sSkuPadre: string;
  sNetsuiteId: string;
  sDescripcion: string;
  sModelo: string;
  nIdModelo: number;
  sUnidadMedida: number;
  sColor: string;
  sTalla: string;
  sCodNivelPrecioDir: string;
  catalogoPadre: CatalogoPadre;
  imagene: string | null;
  nDiasGarantia: number;
}

export interface CatalogoPadre {
  codigo: string;
  descripcion: string;
  nombreComercial: string;
  tipo: string;
}
export interface ListadoMotivoDevoluciones {
  message: string;
  status: number;
  data: DatosList[];
}

export interface DatosList {
  sIdMotivoDevolucion: string;
  sNombre: string;
  sTipoDevolucion: string;
}
export interface ListadoEnvioDevoluciones {
  message: string;
  status: number;
  data: EnvioList[];
}

export interface EnvioList {
  id: number;
  sNumeroDevolucion: string;
  sTipoDevolucion: string;
  nro_pedido: string;
  sEstado: string;
  dtFechaCreacion: string;
  cantidad: number;
  dias_restantes: number;
  agencia: string;
  bultos: number;
  fechaEnvio: string;
  tiempoLlegada: number;
  diasRecojo: string;
  fechaRecojo: string;
  fechaRecogido: string;
  fechaAlmacen: string;
  fechaRevision: string;
  fechaCompletado: string;
}

export interface ListadoTrackingDev {
  data: {
    items: EnvioList[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
  message: string;
  status: number;
}

export interface BuscarDevolucionesParams {
  fechaDesde?: string;
  fechaHasta?: string;
  estado?: string;
  tipo?: string;
  zona?: string;
  sClienteId: string;
  numeroDevolucion?: string;
  estrellaFilter?: string;
  productoFilter?: string;
  incluirHistorial?: string;
  page?: number;
}

export interface ListadoDetalleDevoluciones {
  message: string;
  status: number;
  data: DatosDetalles[];
}

export interface DatosDetalles {
  id: string;
  sTipoDevolucion: string;
  sClienteId: string;
  sNombreCliente: string;
  sFacturaId: string;
  sNumeroFactura: string;
  dtFechaFactura: Date;
  sEstado: SEstado;
  sAgenciaId: null;
  sMovilidadId: null;
  dtFechaRecojo: null;
  sUsuarioCreacion: SUsuario;
  dtFechaCreacion: Date;
  bActivo: boolean;
  sDireccionAgenciaId: null;
  sDocumentoEnvio: null;
  sClaveEnvio: null;
  sUrlDocumentoEnvio: null;
  sUrlGuiaRemision: null;
  dtFechaEnvio: null;
  dtFechaRecogido: null;
  sZona: string;
  sObservaciones: null;
  bTodosRechazados: boolean;
  bAprobacionParcial: boolean;
  sNumeroDevolucion: string;
  detalles: Detalle[];
  historial: Historial[];
}

export interface Detalle {
  nombreCliente: string;
  id: string;
  sFotoProducto: string;
  sProducto: string;
  sTalla: string;
  sColor: string;
  nPrecioUnitario: string;
  nCantidad: number;
  sMotivo: string;
  sFacturaOrigen: string;
  historial: string;
  nombre: string;
  productos: Producto[];
}

export interface Producto {
  id: string;
  sProducto: string;
  nCantidad: string;
  sMotivo: string;
  sCodigoProducto: string;
  sIdPedidoDetalle: string;
  sFotoProducto: string;
  nIdCliente: string;
  sFullName: string;
  sNumeroCelular: string;
  sNumeroDocumento: string;
  nPrecioUnitario: string;
  sEstadoEvaluacion: string;
  sComentariosEvaluacion: null | string;
  dtFechaCreacion: Date;
  bActivo: boolean;
  sMotivoEliminado: null;
  historial: Historial[];
}

export interface Historial {
  id: string;
  sEstadoAnterior: SEstado;
  sEstadoNuevo: SEstadoNuevo;
  sUsuario: SUsuario;
  sComentarios: null | string;
  dtFechaCreacion: Date;
  sUrlFoto: null;
  arrUrlFotos: string;
  devolucionId: string;
  sDevolucionDetalle: string;
}
export enum SEstado {
  Abierto = "ABIERTO",
}

export enum SEstadoNuevo {
  Registrado = "REGISTRADO",
}

export enum SUsuario {
  Sistema = "sistema",
}
export interface DetalleDevolucion {
  id: string;
  sProducto: string;
  sNumeroFactura: string
  nPrecio: string;
  fechaRegistroDevolucion: string;
  nCantidad: string;
  sMotivo: string;
  talla: string,
  color: string,
  urlFotoProducto: string,
  sNumDocumento: string,
  sNumeroCelular: string
}

export interface ClienteConDevoluciones {
  nIdCliente: string;
  sFullName: string;
  totalMonto: number
  origen: string,
  cantidadDevoluciones: number
  cantidadAceptada: number,
  detalles: DetalleDevolucion[];
}
export interface ListadoAgencias {
  id: string;
  sNombre: string;
  sRuc: string;
  sContacto: string;
  sTelefono: string;
  sEmail: string;
  dtFechaCreacion: Date;
  bActivo: boolean;
  direcciones: Direccione[];
}

export interface Direccione {
  id: string;
  sDireccion: string;
  sDistrito: string;
  sProvincia: string;
  sDepartamento: string;
  sReferencia: string;
  dtFechaCreacion: Date;
  bActivo: boolean;
}

// devoluciones detalle


export interface ClientDevolution {
  sIdCliente: string;
  sNombreCliente: string;
  detalles: DetalleDevolutiom[];
}

export interface DetalleDevolutiom {
  detalleRechazado :   devolucionDetalle ;
  idDetalle: string;
  sTipoDevolucion: string;
  sImagenProducto: string;
  sNumeroDevolucion: string
  sNombreProducto: string;
  sTalla: string;
  sColor: string;
  nPrecio: string;
  nCantidad: string;
  dtFechaRegistro: string;
  subDetalle: SubDetalle;
  sEstadoEvaluacion: string;
}
export interface devolucionDetalle {
  devolucionDetalle: string;

dtFechaEvaluacion : string;
nIdRechazoDev : number;
sDescripcion : string;
sUrlContenido : string;

}


export interface SubDetalle {
  sFactura: string;
  sMotivo: string;
  sDetalle: string;
  fotos: string[];
}
export interface ListDetalleProductos {
  message: string;
  status: number;
  data: DataProductos;
}

export interface DataProductos {
  sNumeroDevolucion: string;
  sTipo: string;
  dtFechaCreacion: Date;
  cantidad: number;
  cantidad_aceptados: number;
  detalles: DataDetalle[];
}

export interface DataDetalle {
  sIdCliente: string;
  sNombreCliente: string;
  sNumeroDocumento: string;
  detalles: DetalleDetalle[];
}

export interface DetalleDetalle {
  detalleRechazado: any;
  sEstadoEvaluacion: any;
  idDetalle: string;
  sNumeroDevolucion: string
  sTipoDevolucion: string;
  sImagenProducto: string;
  sNombreProducto: string;
  sTalla: string;
  sColor: string;
  nPrecio: string;
  nCantidad: string;
  dtFechaRegistro: string;
  sCodigoProducto: string;
  subDetalle: SubDetalle;
}

export interface SubDetalle {
  sFactura: string;
  sMotivo: string;
  sDetalle: string;
  fotos: string[];
}

export interface ListDevHistorial {
  message: string;
  status: number;
  data: HistorialDev[];
}

export interface HistorialDev {
  id: string;
  sEstadoAnterior: string;
  sEstadoNuevo: string;
  sUsuario: string;
  sComentarios: string;
  dtFechaCreacion: Date;
  sUrlFoto: null | string;
  arrUrlFotos: null;
  devolucionId: number;
  sDevolucionDetalle: null;
}