

export interface Validateusername {
  id: string;
  sEmail: string;
  sTelefono: string;
  sNombre: string;
}

export interface ErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface OptionRestorePassword {
  value: string;
  label: string;
  type: string;
}

export interface Profile {
  usuario: Usuario;
  cliente: Cliente;
}

export interface Cliente {
  nIdCliente: number;
  nIdExterno: null;
  nIdInterno: string;
  sCodNetSuite: null;
  nEstado: number;
  dtFechaCreacion: Date;
  dtFechaActualizacion: null;
  infoCliente: InfoCliente;
  interlocutores : InfoInterlocutores[];
  finanzasCliente: FinanzasCliente;
  directora?: Directora;
}

export interface InfoInterlocutores {
  nIdInterlocutor:number;
  sCodInterlocutor: string;
  nEstado: number;
   nOrden: number;
   dtFechaCreacion: string;
   dtFechaActualizacion:  null | string;
   nPadreId: number;
}
export interface Directora {
  nIdDirectora: number;
  nEstado: number;
  factura: IFactura;
  centroModa: ICentroModa;
  transporte: ITransporte;
}

interface IFactura {
  nIdFactura: number;
  sRuc: string;
  sDireccionFiscal: string;
  sCorreo: string;
  ubigeo: IUbigeo; // Reemplazar 'any' con la estructura correcta si está definida
}

interface IUbigeo {
  nIdUbigeo: number;
  sNombre: string;
  sCodigo: string;
  nIdUbigeoPadre: number;
}

interface ICentroModa {
  nIdCentroModa: number;
  sNombreComercial: string;
  sDireccionEnvio: string;
  nLatitud: number;
  nLongitud: number;
  sCelularComercial: string;
  sZona: string;
}

interface ITransporte {
  nIdTransporte: number;
  sRazonSocial: string;
  sRuc: string;
  sCodNetSuite: string;
  nEstado: number;
}

export interface FinanzasCliente {
  nIdFinanzas: number;
  nLimiteCredito: string;
  sMonedaPrincipal: string;
  sMonedaSecundaria: string;
  sTerminos: string;
}

export interface InfoCliente {
  nIdInformacionCliente: number;
  sNombre: string;
  sApellidos: string;
  sRazonSocial: null;
  estadoCivil: EstadoCivil;
  genero: Genero;
  documento: Documento;
  direccionCliente: DireccionCliente;
  contactoCliente: ContactoCliente;
}

export interface ContactoCliente {
  nIdContacto: number;
  sEmail: string;
  sTelefono: string;
  sTelefonoAlternativo: string;
  sCorreoResponsablePagoFactura: string;
}

export interface DireccionCliente {
  nIdDireccionCliente: number;
  sDireccion: string;
  nLatitud: number;
  nLongitud: number;
  ubigeo?: UbigeoCliente;
}
export interface UbigeoCliente {
nIdUbigeo : number;
nIdUbigeoPadre : number;
sCodigo : string;
sNombre : string;
sUbigeoNetsuiteId : string;
sUbigeoResumen : string;
}

export interface Documento {
  nIdDocumento: number;
  sNumeroDocumento: string;
  sPaisEmisor: string;
}

export interface EstadoCivil {
  nIdEstadoCivil: number;
  sNombre: string;
  nEstado: number;
}

export interface Genero {
  nIdGenero: number;
  sNombre: string;
  nEstado: number;
}

export interface Usuario {
  _id: string;
  nIdCliente: number;
  sNombreUsuario: string;
  nEstado: number;
  rol: Rol;
  auditoriaUsuario: string;
  
}

export interface Rol {
  _id: string;
  sNombre: string;
  vistas: Vista[];
  plataforma: string;
}

export interface Vista {
  _id: string;
  sNombre: string;
  sUrl: string | null;
  nEstado: number;
  nOrden: number;
  sIcono: string;
  children?: Vista[];
}
