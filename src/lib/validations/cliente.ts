import * as yup from "yup";

export interface ClientFinances {
  nIdMetodoPago: number;
  nLimiteCredito: number;
  sMonedaPrincipal: string;
  sMonedaSecundaria: string;
  sTerminos?: string;
}

export interface ClientDocument {
  sNumeroDocumento: string;
  sPaisEmisor: string;
  nIdTipoDocumento: number;
  nIdTipoPersona: number;
}

export interface ClientAddress {
  sDireccion: string;
  nLatitud: number;
  nLongitud: number;
  sCodigoUbigeo: string;
}

export interface ClientContact {
  sEmail: string;
  sTelefono: string;
  sTelefonoAlternativo?: string;
  sCorreoResponsablePagoFactura?: string;
}

export interface ClientInfo {
  sNombre: string;
  sApellidos: string;
  nIdEstadoCivil: number;
  nIdGenero: number;
  dtFechaNacimiento: Date | null;
  documentoCliente: ClientDocument;
  direccionCliente: ClientAddress;
  contacto: ClientContact;
}

export interface ClientInterlocutor {
  sCodInterlocutor: string;
  nPadreId: number;
}

export interface ClientPayload {
  sCodigoRol: string;
  nIdOrigenRegistro: number;
  nIdTipoCliente: number;
  finanzasCliente: ClientFinances;
  infoCliente: ClientInfo;
  interlocutores: ClientInterlocutor[];
}

export const clientPayloadSchema = yup
  .object({
    sCodigoRol: yup.string().required("El código de rol es obligatorio"),
    nIdOrigenRegistro: yup
      .number()
      .required("El ID de origen de registro es obligatorio"),
    nIdTipoCliente: yup
      .number()
      .required("El ID de tipo de cliente es obligatorio"),
    infoCliente: yup
      .object({
        sNombre: yup.string().required("El nombre es obligatorio"),
        sApellidos: yup.string().required("Los apellidos son obligatorios"),
        nIdEstadoCivil: yup.number().required("El estado civil es obligatorio"),
        nIdGenero: yup.number().required("El género es obligatorio"),
        dtFechaNacimiento: yup
          .date()
          .required("La fecha de nacimiento es obligatoria")
          .max(
            new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
            "Debe ser mayor de 18 años"
          )
          .min(
            new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
            "La edad no puede ser mayor a 100 años"
          )
          .nullable()
          .typeError("La fecha de nacimiento es inválida"),
        documentoCliente: yup
          .object({
            sNumeroDocumento: yup
              .string()
              .required("El número de documento es obligatorio")
              .matches(
                /^[0-9]{8,8}$/,
                "El número de documento debe tener 8 dígitos"
              ),
            sPaisEmisor: yup.string().required("El país emisor es obligatorio"),
            nIdTipoDocumento: yup
              .number()
              .required("El tipo de documento es obligatorio"),
            nIdTipoPersona: yup
              .number()
              .required("El tipo de persona es obligatorio"),
          })
          .required(),
        direccionCliente: yup
          .object({
            sDireccion: yup.string().required("La dirección es obligatoria"),
            nLatitud: yup.number().required("La latitud es obligatoria"),
            nLongitud: yup.number().required("La longitud es obligatoria"),
            sCodigoUbigeo: yup
              .string()
              .required("El código de ubigeo es obligatorio"),
          })
          .required(),
        contacto: yup
          .object({
            sEmail: yup.string().required("El email es obligatorio"),
            sTelefono: yup
              .string()
              .required("El teléfono es obligatorio")
              .matches(
                /^[9][0-9]{8,8}$/,
                "El teléfono debe tener 9 dígitos y empezar con 9"
              )
              .typeError("El teléfono debe contener solo dígitos"),
            sTelefonoAlternativo: yup.string(),
            sCorreoResponsablePagoFactura: yup.string(),
          })
          .required(),
      })
      .required(),
    finanzasCliente: yup
      .object({
        nIdMetodoPago: yup
          .number()
          .required("El ID del método de pago es obligatorio"),
        nLimiteCredito: yup
          .number()
          .required("El límite de crédito es obligatorio"),
        sMonedaPrincipal: yup
          .string()
          .required("La moneda principal es obligatoria"),
        sMonedaSecundaria: yup
          .string()
          .required("La moneda secundaria es obligatoria"),
        sTerminos: yup.string(),
      })
      .required(),
    interlocutores: yup
      .array()
      .of(
        yup.object({
          sCodInterlocutor: yup
            .string()
            .required("El código de interlocutor es obligatorio"),
          nPadreId: yup.number().required("El ID del padre es obligatorio"),
        })
      )
      .min(1, "Debe haber al menos un interlocutor")
      .required(),
  })
  .required();
