export interface CentroModaDirectora {
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

export interface EditDirectoraForm {
  sNumeroDocumento?: string;
  sNombre?: string;
  sApellidos?: string;
  sFechaNacimiento?: string;
  nIdGenero?: number;
  sTelefono?: string;
  sEmail?: string;
  sDireccion?: string;
  sNombreComercial?: string;
  sDireccionEnvio?: string;
  nLatitud?: number;
  nLongitud?: number;
  sCodigoUbigeo?: string;
  sCelularComercial?: string;
  nIdAsesor?: number;
  nIdGerente?: number;
  sZona?: string;
  nIdTransporte?: number;
  sDiasCierre?: string[];
  sHoraCierre?: string;
  sDiasCierreEC?: string[];
  sHoraCierreEC?: string;

  sHorarioAtencionInicoLV?: string;
  sHorarioAtencionFinLV?: string;
  sHorarioAtencionInicoS?: string;
  sHorarioAtencionFinS?: string;
  sHorarioRefrigerioInicio?: string;
  sHorarioRefrigerioFin?: string;

  nPlazoCambioEC?: number;
  nCostoEnvio?: number;
}
