export interface DatosItem {
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

export interface DatosEstrella {
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sNumeroCelular: string;
  dni: string
  direccion: string;
  nivel: string;
  zona: string;
  fechaRegistro: string | null;
}

export interface Pedido {
  id: string;
  linea: number;
  cantidad: number;
  precio: number;
  fecha: string;
  hora: string;
  sOrigenPedido: string
  puedeEliminar: boolean
  sAccionDirectora: string | null;
  fechaAccion: string | null;
  totalPedido: number;
  esDuplicado: boolean;
  datosItem: DatosItem;
  montoTotal: number;
  datosEstrella: DatosEstrella;
  tipoCatalogo?: string;
  talla?: string
  color?: string
  cantidadDespachada? : string
  total?:number
}


export interface BackendPedido {
  id: string;
  linea: number;
  cantidad: number;
  precio: number;
  fecha: string;
  hora: string;
  sOrigenPedido: string
  puedeEliminar: boolean
  montoTotal: number;
  totalPedido: number;
  esDuplicado: boolean;
  sAccionDirectora: string | null;
  fechaAccion: string | null;
  datosItem: DatosItem;
  datosEstrella: DatosEstrella;
};

export interface DuplicateModalData {
  detalle: string;
  duplicados: Array<{
    idPedido: string;
    nombreProducto: string;
    nombreEstrella: string;
    apellidosEstrella: string;
    cantidad: number;
    color: string;
    talla: string;
    fechaPedido: string;
  }>;
  pedidoActual: {
    idPedido: string;
    nombreProducto: string;
    nombreEstrella: string;
    apellidosEstrella: string;
    cantidad: number;
    color: string;
    talla: string;
  };
};

export interface Estrella {
  nombre: string;
  apellidos: string;
  idInterno: string;
}

export interface PedidoCabecera {
  id: string;
  fechaCreacion: string; // ISO date string
}

export interface StockInfo {
  disponible: number;
  requerido: number;
  deficit: number;
}

export interface ItemInvolucrado {
  idPedido: string;
  sku: string;
  descripcion: string;
  color: string;
  talla: string;
  cantidad: number;
  precioUnitario: string; // puede cambiar a number si es numérico
  subtotal: string;
  total: string;
  origen: string;
  estado: string;
  motivoRechazo: string;
  fechaAccion: string; // ISO date string
  estrella: Estrella;
  pedidoCabecera: PedidoCabecera;
  stockInfo: StockInfo;
}

export interface Procesado {
  idPedido: string;
  estado: string;
}

export interface RechazadosDetalle {
  total: number;
  porStockInsuficiente: number;
}

export interface Resumen {
  totalProcesados: number;
  confirmados: number;
  rechazados: number;
  rechazadosPorStock: number;
  eliminadosPreexistentes: number;
  rechazadosDetalle: RechazadosDetalle;
}

export interface ResultadoPedido {
  itemsInvolucrados: ItemInvolucrado[];
  procesados: Procesado[];
  resumen: Resumen;
}


export const rejectionReasons = [
  { key: "ERROR DE PRODUCTO", label: "ERROR DE PRODUCTO" },
  { key: "LA ESTRELLA NO DESEA", label: "LA ESTRELLA NO DESEA" },
  { key: "PEDIDO DUPLICADO", label: "PEDIDO DUPLICADO" },
  { key: "RECHAZADO POR PENDIENTES", label: "RECHAZADO POR PENDIENTES" },
];

export const statusOptions = [
  { label: "Pedidos Pendientes", key: "POR_CONFIRMAR" },
  { label: "Pedidos Confirmados", key: "CONFIRMADO" },
];