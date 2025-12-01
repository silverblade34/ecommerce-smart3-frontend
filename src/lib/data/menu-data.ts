import { EnvioList } from "../interfaces/devoluciones";

export const generosData = [
  {
    id: 1,
    title: "Hombre",
    link: "/categoria?genero=hombre",
  },
  {
    id: 2,
    title: "Mujer",
    link: "/categoria?genero=mujer",
  },
  {
    id: 3,
    title: "Niños",
    link: "/categoria?genero=niños",
  },
  {
    id: 4,
    title: "Bebé",
    link: "/categoria?genero=bebé",
  },
];

export const categoriasData = [
  {
    id: 1,
    title: "Correa",
    link: "/categoria?categoria=accesorios",
  },
  {
    id: 2,
    title: "Zapatos",
    link: "/categoria?categoria=ropa",
  },
  {
    id: 3,
    title: "Bottoms",
    link: "/categoria?categoria=ropa",
  },
  {
    id: 4,
    title: "Relojes",
    link: "/categoria?categoria=accesorios",
  },
  {
    id: 5,
    title: "Sandalias",
    link: "/categoria?categoria=Sandalias",
  },
  {
    id: 6,
    title: "Tops",
    link: "/categoria?categoria=Tops",
  },
  {
    id: 7,
    title: "Bags",
    link: "/categoria?categoria=ropa",
  },
  {
    id: 8,
    title: "Zapatillas",
    link: "/categoria?categoria=Zapatillas",
  },
  {
    id: 9,
    title: "Pantuflas",
    link: "/categoria?categoria=Pantuflas",
  },
];
interface FieldConfig {
  key: keyof EnvioList; 
  label: string;
}

export const tiposData = [
  {
    id: 1,
    title: "Camisetas",
    link: "/categoria?tipo=camisetas",
  },
  {
    id: 2,
    title: "Pantalones",
    link: "/categoria?tipo=pantalones",
  },
  {
    id: 3,
    title: "Vestidos",
    link: "/categoria?tipo=vestidos",
  },
  {
    id: 4,
    title: "Zapatos",
    link: "/categoria?tipo=zapatos",
  },
];


export const datosEstado: { state: string; fields: FieldConfig[] }[] = [
  {
    state: "recogido",
    fields: [
      { key: "fechaRecogido", label: "Recojo Efectivo" }
    ]
  },
  {
    state: "en_almacen",
    fields: [
      { key: "fechaRecogido", label: "Recojo Efectivo" },
      { key: "fechaAlmacen", label: "Fecha en Almacén" }
    ]
  },
  {
    state: "en_revision",
    fields: [
      { key: "fechaRecogido", label: "Recojo Efectivo" },
      { key: "fechaAlmacen", label: "Fecha en Almacén" },
      { key: "fechaRevision", label: "Fecha en Revisión" }
    ]
  },
  {
    state: "completado",
    fields: [
      { key: "fechaRecogido", label: "Recojo Efectivo" },
      { key: "fechaAlmacen", label: "Fecha en Almacén" },
      { key: "fechaRevision", label: "Fecha en Revisión" },
      { key: "fechaCompletado", label: "Completado el" }
    ]
  }
]