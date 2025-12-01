"use server";

import { getServerSession } from "next-auth";
import { http } from "@/utils/http";
import nextAuthOptions from "@/server/auth";

export const verifyToken = async () => {
  const session = await getServerSession(nextAuthOptions);

  if (!session || !session.backendToken?.accessToken) {
    return {
      ok: false,
      status: 401,
      message: "Token no disponible en la sesión",
    };
  }

  try {
    const token = session.backendToken.accessToken;

    const response = await http.get("/api/auth/check-auth-status", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      validateStatus: (status) => [200, 401, 403].includes(status),
    });

    if (response.status === 401 || response.status === 403) {
      return {
        ok: false,
        status: response.status,
        message: "Token expirado o inválido",
      };
    }

    return {
      ok: true,
      status: 200,
      token,
    };
  } catch (error) {
    console.error("Error en verifyToken:", error);
    return {
      ok: false,
      status: 500,
      message: "Error al validar el token",
    };
  }
};

