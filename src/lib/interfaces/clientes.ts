export interface GeneroCliente {
  nIdGenero: number;
  sNombre: string;
}

export interface TipoCliente {
  nIdTipoCliente: number;
  sNombre: string;
  sCodigoFormato: string;
  sCodNetSuite: string;
}

export interface TipoDocumentoCliente {
  nIdTipoDocumento: number;
  sNombre: string;
  sCodNetSuite: string;
}
export interface Ubigeo {
  nIdUbigeo: number;
  sNombre: string;
  sCodigo: string;
  nIdUbigeoPadre: number | null;
  hijos?: Ubigeo[];
}

export interface MetodoPagoCliente {
  nIdMetodoPago: number;
  sNombre: string;
  sCodNetSuite: string;
}

export interface IFormaPagoCliente {
  data: ITipoPgo[];
  message: string;
  status: number;
}

export interface ITipoPgo {
  nIdTipoFormaPago: number;
  sNombre: string;
  nEstado: number;
  formasPago: IFormasPago[];
}

export interface IFormasPago {
  nIdFormaPago: number;
  sNombre: string;
  sNameIcon: string;
  nEstado: number;
}

export interface PagosActivos {
  data: DataPagosActivos[];
  message: string;
  status: number;
}

export interface DataPagosActivos {
  nIdFPagoConfigurado: number;
  nEstado: number;
  formaPago: DataFormaPago;
  directora: DataDirectora;
}

export interface DataDirectora {
  nIdDirectora: number;
  nEstado: number;
}

export interface DataFormaPago {
  nIdFormaPago: number;
  sNombre: string;
  sNameIcon: string;
  nEstado: number;
}

export interface DocumentoValidado {
  success: boolean;
  data?: Data;
  message?: string;
}

export interface Data {
  dni: string;
  name: string;
  mothers_lastname: string;
  fathers_lastname: string;
  fullname: string;
  verification_code: string;
  updated_at: Date;
}

export interface ClientTableResponse {
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sTipo? : string
  sRazonSocial: null;
  sNumeroDocumento: string;
  sTelefono: string;
  sEmail: string;
  dtFechaRegistro: string;
  sDireccion: string;
  sDistrito: string;
  sProvincia: string;
  sDepartamento: string;
  dFechaNacimiento: string;
  sOrigen: string;
  detailWork:DataWork
}

export interface ClienteEstrella {
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sNumeroDocumento: string;
  sTelefono: string;
  sEmail: string;
  dtFechaCreacion: string; 
  sOrigenRegistro: string;
  dtFechaNacimiento: string; 
  sTipoCliente: string; 
  sCentroLabores: string;
  sDireccion: string;
  sUbigeoResumen: string;
}

export interface ClientTableResponseCart {
 data: ClientCartTable[];
  meta: {
    total: number;
    showing: number;
    hasMore: boolean;
    filtered: boolean;
    searchTerm: string | null;
    message: string;
  };
}


export interface ClientCartTable {
  nIdCliente: number;
  sNombre: string;
  sApellidos: string;
  sTipo? : string
  sNumeroDocumento: string;
}




export interface DataWork {
  sTipoCliente: string;
   centroLabores:DataCentro
}
export interface DataCentro {
 nEstado: string;
 nIdCentroLabores: string;
  sNombre: string;
}
export interface CentroModaEstrella {
  directora: Directora;
  gerenta: Gerenta;
}

export interface Directora {
  nIdDirectora: number;
  infoPersonal: Gerenta;
  centroModa: CentroModa;
  medioPago: MedioPago;
}

export interface CentroModa {
  sNombreComercial: string;
  sDireccionEnvio: string;
  sCelularComercial: string;
  sZona: string;
  ubicacion: Ubicacion;
  horario: Horario;
  transporte: Transporte;
  formaPago?: {
    nIdFormaPago: number;
    sNombre: string;
    sNameIcon: string;
  }[];
}

export interface Horario {
  sDiasCierre: string[];
  sDiasCierreEC?: string[];
  sHoraCierre: string;
  sHoraCierreEC?: string;
  nPlazoCambio: number;
  nPlazoCambioEC?: number;
  nCostoEnvio: string;
  sHorarioAtencionInicoLV: string;
  sHorarioAtencionFinLV: string;
  sHorarioAtencionInicoS: string;
  sHorarioAtencionFinS: string;
  sHorarioRefrigerioInicio: string;
  sHorarioRefrigerioFin: string;
}

export interface Transporte {
  nIdTransporte: number;
  sRazonSocial: string;
  sRuc: string;
}

export interface Ubicacion {
  nLatitud: number;
  nLongitud: number;
  sDireccion: string;
  sDistrito: string;
  sProvincia: string;
  sDepartamento: string;
  sCodUbigeo: string;
}

export interface Gerenta {
  sNombre: string;
  sApellidos: string;
  sNombreCompleto: string;
  sNumeroDocumento?: string;
  sTelefono: string;
  sEmail: string;
  nIdGerenta?: number;
}

export interface MedioPago {
  nIdMetodoPago: number;
  sNombre: string;
}

