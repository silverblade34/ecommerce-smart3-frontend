export type TableColumns = {
  name: string;
  uid: string;
};

export type InitialColumns = {
  initial: TableColumns[];
  visible: string[];
};

// ---TABLA DE SEGUIMIENTO DE PEDIDOS (ESTRELLA)---

export const columnsOrder = [
  { name: 'CÓDIGO', uid: 'sNumeroPedido' },
  { name: 'FECHA DE APERTURA', uid: 'dFechaApertura' },
  { name: 'CANTIDAD', uid: 'cantidad' },
  { name: 'TOTAL', uid: 'nTotalCompra' },
  { name: 'GANANCIA', uid: 'nGanancia' },
  { name: 'ACCIONES', uid: 'actions' },

];

const INITIAL_VISIBLE_COLUMNS_ORDERS = [
  "actions",
  "code",
  "alert",
  "quantity",
  "status",
  "total_price",
  "total_gain",
];

export const initialColumnsOrders: InitialColumns = {
  initial: columnsOrder,
  visible: INITIAL_VISIBLE_COLUMNS_ORDERS,
};

// ----------------------------

// ---TABLA  DE PEDIDOS (DIRECTORA)---

export const columnsPedidosDirectora = [
  { name: "PRODUCTO", uid: "producto" },
  { name: "ESTRELLA", uid: "estrella" },
  { name: "FECHA", uid: "fecha" },
  { name: "PRECIO", uid: "precio" },
  { name: "MONTO TOTAL", uid: "monto" },
  { name: "ACCIONES", uid: "actions" }
];

export const columnsPedidosDirectoraConfirmados = [
  
  { name: "PRODUCTO", uid: "producto" },
  { name: "ESTRELLA", uid: "estrella" },
  { name: "F.CONFIRMACIÓN", uid: "fechaConfirmado" },
  { name: "TOTAL", uid: "monto" },
  { name: "CATÁLOGO", uid: "catalogo" },
  { name: "ORIGEN", uid: "origen" },
  { name: "ACCIONES", uid: "actions" }
];

const INITIAL_VISIBLE_COLUMNS_PEDIDOS_DIRECTORA = [
  "product",
  "estrella",
  "created_on",
  "quantity",
  "type",
  "status",
  "total_price",
];

export const initialColumnsPedidosDirectora: InitialColumns = {
  initial: columnsPedidosDirectora,
  visible: INITIAL_VISIBLE_COLUMNS_PEDIDOS_DIRECTORA,
};

// ----------------------------
const columnsClient = [
  { name: "ACCIONES", uid: "actions" },
  { name: "NOMBRE", uid: "sNombre" },
  // { name: 'TIPO DE DOCUMENTO', uid: 'document_type' },
  { name: "NÚMERO DE DOCUMENTO", uid: "sNumeroDocumento" },
];
const INITIAL_VISIBLE_COLUMNS_CLIENT = [
  "actions",
  "sNombre",
  // 'document_type',
  "sNumeroDocumento",
];

export const initialColumnsClient: InitialColumns = {
  initial: columnsClient,
  visible: INITIAL_VISIBLE_COLUMNS_CLIENT,
};
// ----------------------------
