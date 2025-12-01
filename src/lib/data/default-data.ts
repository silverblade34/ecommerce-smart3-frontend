export const days = [
  { key: "Lunes", label: "Lunes" },
  { key: "Martes", label: "Martes" },
  { key: "Miercoles", label: "Miercoles" },
  { key: "Jueves", label: "Jueves" },
  { key: "Viernes", label: "Viernes" },
  { key: "Sabado", label: "Sabado" },
  { key: "Domingo", label: "Domingo" },
];
export const product1 = {
  cod: "2200005614",
  cod_catalogo: "OFT24VH0009",
  cod_color: "COBR",
  name: "BAGS CARTERA",
  color: "COBRE",
  size: "unc",
  pvs: 160,
  price: 179.9,
  photo: "https://oms-fotos.sokso.com/fotos/2200005614_FIO-CJ35_COBR-1.jpg?V=1",
};

export const product2 = {
  cod: "2000035650",
  cod_catalogo: "ESP24NK0003",
  cod_color: "BL64",
  name: "ZAPATILLAS LIFESTYLE",
  color: "BLANCO/VERDE",
  size: "10",
  price: 409,
  pvs: 160,
  photo:
    "https://oms-fotos.sokso.com/fotos/2000035650_DZ0795-102_BL64-1.jpg?V=1",
};

export const product3 = {
  cod: "2000035733",
  cod_catalogo: "ESP24AD0008",
  cod_color: "BLAN",
  name: "BAGS MONEDERO",
  color: "BLANCO",
  size: "unc",
  price: 200,
  pvs: 160,
  photo:
    "https://oms-fotos.sokso.com/fotos/2000035733_100033040_BLAN-1.jpg?V=1",
};

export const product4 = {
  cod: "2000033755",
  cod_catalogo: "DAM24PVNS11",
  cod_color: "MENT",
  name: "ZAPATILLAS URBANO",
  color: "MENTA",
  size: "35",
  price: 149,
  pvs: 160,
  photo: "https://oms-fotos.sokso.com/fotos/2000033755_BRIT-010_MENT-1.jpg?V=2",
};

const products_all_pendientes = [
  {
    ...product1,
    quantity: 1,
    status: 2,
    added: "2021-06-01 12:00:00",
    confirmed: "2021-06-01 12:00:00",
  },
  {
    ...product2,
    quantity: 1,
    status: 2,
    added: "2021-06-01 12:00:00",
    confirmed: "2021-06-01 12:00:00",
  },
  {
    ...product3,
    quantity: 2,
    status: 2,
    added: "2021-06-01 12:00:00",
    confirmed: "2021-06-01 12:00:00",
  },
  {
    ...product4,
    quantity: 1,
    status: 2,
    added: "2021-06-01 12:00:00",
    confirmed: "2021-06-01 12:00:00",
  },
];

const products_all_denegados = [
  {
    ...product1,
    quantity: 1,
    status: 3,
    added: "2021-06-01 12:00:00",
    denied: "2021-06-01 12:00:00",
  },
  {
    ...product2,
    quantity: 1,
    status: 3,
    added: "2021-06-01 12:00:00",
    denied: "2021-06-01 12:00:00",
  },
  {
    ...product3,
    quantity: 2,
    status: 3,
    added: "2021-06-01 12:00:00",
    denied: "2021-06-01 12:00:00",
  },
  {
    ...product4,
    quantity: 1,
    status: 3,
    added: "2021-06-01 12:00:00",
    denied: "2021-06-01 12:00:00",
  },
];

const products_3_confirmado_1_pendiente = [
  {
    ...product1,
    quantity: 1,
    status: 2,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product2,
    quantity: 1,
    status: 3,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product3,
    quantity: 2,
    status: 1,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product4,
    quantity: 1,
    status: 1,
    added: "2021-06-01 12:00:00",
  },
];
const products_confirmado = [
  {
    ...product1,
    quantity: 1,
    status: 1,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product2,
    quantity: 1,
    status: 3,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product3,
    quantity: 2,
    status: 1,
    added: "2021-06-01 12:00:00",
  },
  {
    ...product4,
    quantity: 1,
    status: 1,
    added: "2021-06-01 12:00:00",
  },
];
export const responsePedidos = [
  {
    code: "PED-0001",
    total_price: products_all_pendientes.reduce(
      (acc, product) => acc + product.price,
      0
    ),
    total_gain: 100,
    quantity: products_all_pendientes
      .map((product) => product.quantity)
      .reduce((acc, quantity) => acc + quantity, 0),
    products: products_all_pendientes,
    status: 1,
    tracking: {
      confirmed: {
        date: "",
        value: 3,
      },
      prepared: {
        date: "",
        value: 3,
      },
      sent_bill: {
        date: "",
        value: 3,
      },
      sent: {
        date: "",
        value: 3,
      },
      moda_center: {
        date: "",
        value: 3,
      },
    },
  },
  {
    code: "PED-0002",
    total_price: products_all_denegados.reduce(
      (acc, product) => acc + product.price,
      0
    ),
    total_gain: 100,
    quantity: products_all_denegados
      .map((product) => product.quantity)
      .reduce((acc, quantity) => acc + quantity, 0),
    products: products_all_denegados,
    status: 7,
    tracking: {
      confirmed: {
        date: "",
        value: 3,
      },
      prepared: {
        date: "",
        value: 3,
      },
      sent_bill: {
        date: "",
        value: 3,
      },
      sent: {
        date: "",
        value: 3,
      },
      moda_center: {
        date: "",
        value: 3,
      },
    },
  },
  {
    code: "PED-0003",
    total_price: products_confirmado.reduce(
      (acc, product) => acc + product.price,
      0
    ),
    total_gain: 100,
    quantity: products_confirmado
      .map((product) => product.quantity)
      .reduce((acc, quantity) => acc + quantity, 0),
    products: products_confirmado,
    status: 2,
    tracking: {
      confirmed: {
        date: "",
        value: 2,
      },
      prepared: {
        date: "",
        value: 3,
      },
      sent_bill: {
        date: "",
        value: 3,
      },
      sent: {
        date: "",
        value: 3,
      },
      moda_center: {
        date: "",
        value: 3,
      },
    },
  },
  {
    code: "PED-0004",
    total_price: products_3_confirmado_1_pendiente.reduce(
      (acc, product) => acc + product.price,
      0
    ),
    total_gain: 100,
    quantity: products_3_confirmado_1_pendiente
      .map((product) => product.quantity)
      .reduce((acc, quantity) => acc + quantity, 0),
    products: products_3_confirmado_1_pendiente,
    status: 1,
    tracking: {
      confirmed: {
        date: "",
        value: 3,
      },
      prepared: {
        date: "",
        value: 3,
      },
      sent_bill: {
        date: "",
        value: 3,
      },
      sent: {
        date: "",
        value: 3,
      },
      moda_center: {
        date: "",
        value: 3,
      },
    },
  },
  {
    code: "PED-0005",
    total_price: products_3_confirmado_1_pendiente.reduce(
      (acc, product) => acc + product.price,
      0
    ),
    total_gain: 100,
    quantity: products_3_confirmado_1_pendiente
      .map((product) => product.quantity)
      .reduce((acc, quantity) => acc + quantity, 0),
    products: products_confirmado,
    status: 4,
    tracking: {
      confirmed: {
        date: "",
        value: 1,
      },
      prepared: {
        date: "",
        value: 1,
      },
      sent_bill: {
        date: "",
        value: 2,
      },
      sent: {
        date: "",
        value: 3,
      },
      moda_center: {
        date: "",
        value: 3,
      },
    },
  },
];

// const client1 = {
//   name: "Iris Cuya Llanto",
//   document: "11111111",
//   phone: "911111111",
//   photo: "/images/client_1.jpg",
// };

// const client2 = {
//   name: "Andrea Paredes Alarcon",
//   document: "22222222",
//   phone: "922222222",
//   photo: "/images/client_2.avif",
// };
// const client3 = {
//   name: "Julieta Flores Diaz",
//   document: "33333333",
//   phone: "933333333",
//   photo: "/images/client_3.avif",
// };

// export const resposePedidosDirectora: PedidoConfirm[] = [
//   {
//     code: "PED-0001",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,
//     status: 1,
//     estrella: client1,
//   },
//   {
//     code: "PED-0002",
//     total_price: product2.price * 2,
//     product: {
//       ...product2,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,
//     status: 1,
//     estrella: client1,
//   },
//   {
//     code: "PED-0003",
//     total_price: product3.price * 2,
//     product: {
//       ...product3,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,
//     status: 1,
//     estrella: client1,
//   },
//   {
//     code: "PED-0004",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,

//     status: 1,
//     estrella: client3,
//   },
//   {
//     code: "PED-0005",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,
//     status: 1,
//     estrella: client2,
//   },
//   {
//     code: "PED-0005",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Regular",
//     typeStatus: 1,
//     status: 1,
//     estrella: client3,
//   },
//   {
//     code: "PED-0006",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Cyber",
//     typeStatus: 2,
//     status: 1,
//     estrella: client3,
//   },
//   {
//     code: "PED-0007",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Preventa",
//     typeStatus: 3,
//     status: 1,
//     estrella: client3,
//   },
//   {
//     code: "PED-0008",
//     total_price: product1.price * 2,
//     product: {
//       ...product1,
//       added: "2021-06-01 12:00:00",
//       quantity: 2,
//       status: 1,
//     },
//     type: "Restringido",
//     typeStatus: 4,
//     status: 1,
//     estrella: client3,
//   },
// ];

// export const clientsData: Client[] = [
//   {
//     confirmed: true,
//     name: "Iris Cuya Llanto",
//     document_type: "DNI",
//     document_number: "11111111",
//     date_joined: "2021-06-01 12:00:00",
//     email: "iris@gmail.com",
//     id: 1,
//     phone: "911111111",
//   },
//   {
//     confirmed: true,
//     name: "Andrea Paredes Alarcon",
//     document_type: "DNI",
//     document_number: "22222222",
//     date_joined: "2021-06-01 12:00:00",
//     email: "andrea@gmail.com",
//     id: 2,
//     phone: "922222222",
//   },
//   {
//     confirmed: true,
//     name: "Julieta Flores Diaz",
//     document_type: "DNI",
//     document_number: "33333333",
//     date_joined: "2021-06-01 12:00:00",
//     email: "julieta@gmail.com",
//     id: 3,
//     phone: "933333333",
//   },
//   {
//     confirmed: true,
//     name: "Isabel Huaman Quispe",
//     document_type: "DNI",
//     document_number: "44444444",
//     date_joined: "2021-06-01 12:00:00",
//     email: "isa@gmail.com",
//     id: 4,
//     phone: "944444444",
//   },
// ];
export const years = [
  { key: 2022, label: '2022' },
  { key: 2023, label: '2023' },
  { key: 2024, label: '2024' },
  { key: 2025, label: '2025' },
];

export const months = [
  { key: 1, label: 'Enero' },
  { key: 2, label: 'Febrero' },
  { key: 3, label: 'Marzo' },
  { key: 4, label: 'Abril' },
  { key: 5, label: 'Mayo' },
  { key: 6, label: 'Junio' },
  { key: 7, label: 'Julio' },
  { key: 8, label: 'Agosto' },
  { key: 9, label: 'Setiembre' },
  { key: 10, label: 'Octubre' },
  { key: 11, label: 'Noviembre' },
  { key: 12, label: 'Diciembre' },
];


export const month = [
  { key: '01', label: 'Enero' },
  { key: '02', label: 'Febrero' },
  { key: '03', label: 'Marzo' },
  { key: '04', label: 'Abril' },
  { key: '05', label: 'Mayo' },
  { key: '06', label: 'Junio' },
  { key: '07', label: 'Julio' },
  { key: '08', label: 'Agosto' },
  { key: '09', label: 'Setiembre' },
  { key: '10', label: 'Octubre' },
  { key: '11', label: 'Noviembre' },
  { key: '12', label: 'Diciembre' },
];
