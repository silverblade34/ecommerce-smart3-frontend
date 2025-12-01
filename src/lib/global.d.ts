interface Pagination {
  count: number;
  next: string;
  previous: string;
}

interface PedidosPagination extends Pagination {
  results: Pedido2[];
}
interface Pedido2 {
  code: string;
  total_price: number;
  total_gain: number;
  quantity: number;
  products: PedidoProduct[];
  status: number;
  tracking: {
    confirmed: {
      date: string;
      value: number;
    };
    prepared: {
      date: string;
      value: number;
    };
    sent_bill: {
      date: string;
      value: number;
    };
    sent: {
      date: string;
      value: number;
    };
    moda_center: {
      date: string;
      value: number;
    };
  };
}

interface PedidoProduct {
  pvs: number;
  name: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  status: number;
  photo: string;
  cod: string;
  cod_catalogo: string;
  cod_color: string;
  added: string;
  denied?: string;
  confirmed?: string;
}

interface PriceConfig {
  nPvs: number;
  nPrecioDirector: number;
  nPrecioPromotor: number;
  nPrecioColaborador: number;
}

interface Stock {
  stockDisponible: number;
  stockReservado: number;
  stockConfirmado: number;
  stockReal: number;
}

interface CatalogoPadre {
  codigo: string;
  descripcion: string;
  nombreComercial: string;
  tipo: string;
}

interface Imagen {
  nIdImagen: number;
  nIdArticulo: number;
  nIdColor: string;
  nVista: number;
  sNombreArchivo: string;
  iVersionamientoArchivo: number;
  sExtension: string;
  nIdAuditoria: number;
}

interface ProductoDetalles {
  nIdArticulo: number;
  sSkuHijo: string;
  nIdColor: string;
  sUrlEcommerce: string;
  sSkuPadre: string;
  sNetsuiteId: string;
  sDescripcion: string;
  sModelo: string;
  nIdModelo: number;
  sColor: string;
  sTalla: string;
  pricesConfig: PriceConfig;
  stock: Stock;
  catalogoPadre: CatalogoPadre;
  imagenes: Imagen[];
}

interface Producto {
  sSkuProducto: string;
  sArticuloId: number;
  sNivelPrecioId: string;
  sDepartamentoId: string;
  sUbicacionId: string;
  sClaseId: string;
  sCodigoUm: string;
  detalles: ProductoDetalles;
}

interface Estado {
  nCantidadComprometida: number;
  nCantidadDespachada: number;
  sMotivoRechazo: string | null;
  sAccionDirectora: string | null;
  dtFechaAccionDirectora: number | null;
  bEsBonificacion: boolean;
}

export interface ProductStar {
  nCantidad: number;
  nPrecioEstrella: number;
  nPrecioDirectora: number;
  nPrecioSugerido: number;
  dtFechaPedidoDetalle: string;
  dtFechaConfirmacion: string | null;
  producto: Producto;
  estado: Estado;
}

interface PedidoConfirm {
  code: string;
  total_price: number;
  product: PedidoProduct;
  type: "Regular" | "Cyber" | "Preventa" | "Restringido";
  typeStatus: 1 | 2 | 3 | 4;
  status: number;
  estrella: {
    name: string;
    document: string;
    phone: string;
    photo: string;
  };
}

interface PedidosConfirmPagination extends Pagination {
  results: PedidoConfirm[];
}

interface Client {
  id: number;
  name: string;
  document_type: string;
  document_number: string;
  phone: string;
  email: string;
  date_joined: string;
  confirmed: boolean;
}

interface TrackingResponse {
  status: number;
  message: string;
  data: Array<{
    id: string;
    sDirectora: number;
    sStatus: string;
    dFechaCambio: string;
    dFechaConfirmacion: string | null;
    dFechaRechazo: string | null;
    trackingNetSuite: {
      id: string;
      sStatusNetSuite: string;
      dFechaCambio: string;
      dFechaAprobacionPendiente: string | null;
      dFechaPreparandoPedido: string | null;
      dFechaFacturacionPendiente: string | null;
      dFechaFacturacion: string | null;
      dFechaDespachado: string | null;
      dFechaEnTransito: string | null;
    };
  }>;
}

interface ResPedidosDirectora {
  status: number;
  message: string;
  data: {
    cantidadTotal_CYBER: number,
    cantidadTotal_PREVENTA: number,
    cantidadTotal_REGULAR: number,
    cantidadTotal_GRATIS: number,
    cantidadTotal_PREVENTA_CATALOGO: number,
    cantidadTotal_SHOWROOM: number,
    items: PedidoItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    metadata: {
      estados: string[];
      tiposCatalogo: string[];
      filtrosAplicados: {
        estado: string | null;
        tipoCatalogo: string | null;
        nombreEstrella: string | null;
      };
    };
  };
}

interface PedidoItem {
  [key: string]: {
    cantidadTotal: number;
    sumaTotalPedidos: number;
    pedidos: PedidoDetalle[];
  };
}

interface PedidoDetalle {
  datosEstrella: DatosEstrella;
  pedidos: Pedido[];
}

interface DatosEstrella {
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sNumeroCelular: string;
  email: string | null;
  direccion: string;
  nivel: string;
  zona: string;
  tipoCliente: string;
  fechaRegistro: string | null;
}

interface Pedido {
  id: string;
  linea: number;
  cantidad: number;
  precio: number;
  fecha: string;
  sOrigenPedido:string
  hora: string;
  sAccionDirectora: string | null;
  fechaAccion: string | null;
  montoTotal: number;
  totalPedido: number;
  datosItem: DatosItem;
  datosEstrella: DatosEstrella;
  esDuplicado: boolean;
}

interface DatosItem {
  descripcion: string;
  modelo: string;
  idModelo: number;
  urlEcommerce: string;
  imagen: string;
  color: string;
  talla: string;
  sku: string;
  stockDisponible: number;
  stockReservado: number;
  precioSugerido: number;
}

interface Estrella {
  datosEstrella: {
    nIdCliente: number;
    sNombre: string;
    sApellidos: string;
    sNumeroCelular: string;
    direccion: string;
    nivel: string;
    zona: string;
    fechaRegistro: string | null;
  };
  cantidadPedidos: number;
  pedidosIds: string[];
}

interface Bolsa {
  [key: string]: {
    numeroPedido: string;
    idPedidoCabecera: string;
    fechaPedido: string;
    fechaCorte: string | null;
    estadoCierre: string;
    cantidadTotal: number;
    fechaProximaCorte: null | string
    numeroPedidoNetsuite :  null | string
    resumen: {
      totalPedidos: number;
      totalConfirmados: number;
      totalRechazados: number;
      totalPendientes: number;
      montoPedidos: number;
      montoDirectora: number;
      montoPromotor: number;
      totalIgv: number;
      totalPercepcion: number;
    };
    datosEnvio: {
      numeroFactura: string;
      numeroGuia: string;
      operador: string;
      cantidadBultos: number;
      cantidadDespachada: number;
    };
    seguimiento: {
      fechaFacturacion: string | null;
      fechaEnvio: string | null;
      fechaPago: string | null;
      leadTime: string | null;
      fechaCompromisoEntrega: string | null;
    };
    estadoPago: string;
    cantidadEstrellas: number;
    estrellas: Estrella[];
  };
}

interface BolsasResponse {
  status: number;
  message: string;
  data: {
    items: Bolsa[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    metadata: {
      estados: string[];
      tiposCatalogo: string[];
      filtrosAplicados: {
        estado: string | null;
        tipoCatalogo: string | null;
        nombreEstrella: string | null;
      };
    };
  };
}

interface ProductoDetalle {
  id: string;
  linea: number;
  cantidad: number;
  precio: number | null;
  fechaEnvío: string | null;//nuevo..
  subtotal: string;
  total: string;
  fecha: string;
  hora: string;
  sAccionDirectora: string | null;
  fechaAccion: string | null;
  cantidadDespachada: number | null //nuevo..
  cantidadConfirmada:  number | null //nuevo..
  datosItem: {
    descripcion: string;
    modelo: string;
    idModelo: number;
    urlEcommerce: string;
    precioEstrella : string //nuevo
    precioDirectora : string //nuevo
    catalogo : string
    imagen: string;
    color: string;
    talla: string;
    sku: string;
    stockDisponible: number;
    stockReservado: number;
    precioSugerido: number;
  };
  datosEstrella: {
    nIdCliente: number;
    sNombre: string;
    sApellidos: string;
    sNumeroCelular: string;
    email: string;
    direccion: string;
    nivel: string;
    zona: string;
    tipoCliente: string;
    fechaRegistro: string | null;
  };
}

interface DetalleBolsaResponse {
  status: number;
  message: string;
  data: BolsaResponse
}

interface BolsaResponse {
   bolsaId: string;
    numeroPedido: string;
    totalCantidades:number
    fechaPedido: string;
    fechaCorte: string | null;
    estadoCierre: string;
    estadoAprobacion: string;
    estadoAprobacionSokso: string;
    datosEnvio: {
      numeroFactura: string;
      numeroGuia: string;
      operador: string;
      cantidadBultos: number;
      cantidadDespachada: number;
    };
    seguimiento: {
      fechaFacturacion: string | null;
      fechaEnvio: string | null;
      fechaPago: string | null;
      leadTime: string | null;
      fechaCompromisoEntrega: string | null;
    };
    estadoPago: string;
    productos: ProductoDetalle[];
    paginacion: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
}

interface Documento {
  nIdDocumento: number;
  sNumeroDocumento: string;
  sPaisEmisor: string;
}

interface ContactoCliente {
  nIdContacto: number;
  sEmail: string;
  sTelefono: string;
  sTelefonoAlternativo: string;
  sCorreoResponsablePagoFactura: string;
}

interface DireccionCliente {
  nIdDireccionCliente: number;
  sDireccion: string;
  sDireccionNetsuiteId: string | null;
  nLatitud: number;
  nLongitud: number;
}

interface InfoCliente {
  nIdInformacionCliente: number;
  sNombre: string;
  sApellidos: string;
  sRazonSocial: string | null;
  dtFechaNacimiento: string;
  documento: Documento;
  contactoCliente: ContactoCliente;
  direccionCliente: DireccionCliente;
}

interface TipoCliente {
  nIdTipoCliente: number;
  sNombre: string;
  sCodigoFormato: string;
  sCodNetSuite: string;
  nEstado: number;
}

interface Factura {
  nIdFactura: number;
  sRuc: string;
  sDireccionFiscal: string;
  sDireccionNetsuiteId: string | null;
  sCorreo: string;
}

interface Horario {
  nIdHorario: number;
  sDiasCierre: string[];
  sHoraCierre: string;
  nPlazoCambio: number;
  nPlazoCambioEC: number;
  nCostoEnvio: string;
  sHorarioAtencionInicoLV: string;
  sHorarioAtencionFinLV: string;
  sHorarioAtencionInicoS: string;
  sHorarioAtencionFinS: string;
  sHorarioRefrigerioInicio: string;
  sHorarioRefrigerioFin: string;
}

interface CentroModa {
  nIdCentroModa: number;
  sNombreComercial: string;
  sDireccionEnvio: string;
  nLatitud: number;
  nLongitud: number;
  sCelularComercial: string;
  sZona: string;
  sDireccionNetsuiteId: string | null;
  horario: Horario;
}

interface Transporte {
  nIdTransporte: number;
  sRazonSocial: string;
  sRuc: string;
  sCodNetSuite: string;
  nEstado: number;
}

interface Region {
  nIdRegion: number;
  sCodNetSuite: string;
  sNombre: string;
  nEstado: number;
}

interface Directora {
  nIdDirectora: number;
  nEstado: number;
  factura: Factura;
  centroModa: CentroModa;
  transporte: Transporte;
  region: Region;
}

interface Interlocutor {
  nIdInterlocutor: number;
  sCodInterlocutor: string;
  nEstado: number;
  nOrden: number;
  dtFechaCreacion: string;
  dtFechaActualizacion: string | null;
  nPadreId: number;
}

interface FinanzasCliente {
  nIdFinanzas: number;
  nLimiteCredito: string;
  sMonedaPrincipal: string;
  sMonedaSecundaria: string;
  sTerminos: string;
  representanteVentas: null;
}

interface RepresentanteVentas {
  id: number;
  codigo: string;
  parentId: number;
  sCodNetSuite: string;
}

interface ClienteData {
  nIdCliente: number;
  nIdExterno: null;
  nIdInterno: string;
  sCodNetSuite: null;
  nEstado: number;
  dtFechaCreacion: string;
  dtFechaActualizacion: string;
  tipoCliente: TipoCliente;
  infoCliente: InfoCliente;
  directora: Directora;
  interlocutores: Interlocutor[];
  finanzasCliente: FinanzasCliente;
  representanteVentas: RepresentanteVentas;
}

interface OrderStar {
  sIdPedidoCabecera:string
  sNumeroPedido: string;
  nTotalCompra: number;
  nSumaPrecioSugerido: string;
  nTotalPaquetes: number;
  nGanancia: number;
  sFechaApertura: string;
  nTotalDespachados: number;
}

interface DetallePedido {
  item: number;
  sDescripcionProducto: string;
  nCantidad: number;
  sNivelPrecio: string;
  sSkuHijo: string;
  sPromotoraId?: number; 
  sDepartamentoId: string;
  sTipoOperacionId: string; 
  sUbicacionId: string;
}

interface PedidoData {
  clienteId: number;
  permitirDuplicados: boolean;
  sUsuarioCreacionId: string;
  paraEstrella: boolean;
  
  detalles: DetallePedido[];
}


export interface EstadoCuentaResumen {
  saldoInicial: string;
  saldoFinal: string;
  totalFacturas: string;
  totalNotasCredito: string;
  totalDepositos: string;
  movimientoNeto: string;
}

export interface EstadoCuentaItem {
  tipo: string;
  trandate: string;
  textoAuxiliar100_5: string; 
  documento: string; 
  memo: string;
  importe: string; 
  saldo: string;
}

export interface EstadoCuentaDepositoDetalle {
  trandate: string;
  memo: string;
  foreigntotal: number;
}

export interface EstadoCuentaDeposito {
  totalDeposito: string;
  detalles: EstadoCuentaDepositoDetalle[];
}

export interface EstadoCuentaResponse {
  resumen: EstadoCuentaResumen;
  items: EstadoCuentaItem[];
  depositos: EstadoCuentaDeposito;
}
export interface RucCuentaCorriente {
    find: any;
    sUsuarioRuc:  string;
    nIdDirectora: number;
    nIdCliente:   number;
    sRazonSocial: string;
}