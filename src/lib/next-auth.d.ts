/* eslint-disable */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
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
      nIdDirectora: number; 
    };
    

    backendToken: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
  interface SessionOptions {
    jwt: boolean;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
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
      nIdDirectora: number;
    };

    backendToken: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}
