export type User = {
  _id: string;
  nIdCliente: number;
  sNombreUsuario: string;
  nEstado: number;
  bPassTemporal: boolean;
  dtFechaVigenciaPassTemporal: Date;
  dtFechaHoraBloqueo: Date;
  rol: {
    _id: string;
    sNombre: string;
    plataforma: string;
    sCodigo: string;
  };
  vistas: {
    _id: string;
    sNombre: string;
    sUrl: string;
    nEstado: number;
    nOrden: number;
    sIcono: string;
    children?: {
      _id: string;
      sNombre: string;
      sUrl: string;
      nEstado: number;
      nOrden: number;
      sIcono: string;
    }[];
  }[];
};
