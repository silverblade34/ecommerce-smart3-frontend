"use server";
import { AUTH_BACKEND_URL } from "@/lib/Constants";
import { Profile, Validateusername } from "@/lib/interfaces/profile";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import nextAuthOptions from "../auth";

// Interface for API error responses
interface ApiErrorResponse {
  message: string;
  status?: number;
}

export const getMyClient = async (): Promise<Profile | null> => {
  try {
    const session = await getServerSession(nextAuthOptions);
    if (!session) {
      return null;
    }

    const { backendToken, user } = session;
    const token = backendToken.accessToken;
    if (!token) {
      return null;
    }

    const { data } = await axios.get<Profile>(
      `${AUTH_BACKEND_URL}/api/usuarios/me/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    

    return data;
  } catch (error) {
    console.error("Error al obtener el perfil del cliente:", error);
    return null;
  }
};

export const validateUser = async (username: string) => {
  if (!username) {
    return {
      success: false,
      data: undefined,
      message: 'El nombre de usuario no puede estar vacío.',
    };
  }

  try {
    const res = await axios.get<Validateusername>(
      `${AUTH_BACKEND_URL}/api/usuarios/validar-username?username=${username}`
    );
    return {
      success: true,
      data: res.data,
      message: '',
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    return {
      success: false,
      data: undefined,
      message: axiosError.response?.data?.message || 'Usuario no registrado',
    };
  }
};


export const sendMessageService = async (payload: {
  id: string;
  medio: string;
}) => {
  console.log('Payload', {
    medio: payload.medio,
  });
  try {

    console.log("PAYLOAD",payload.id)
    console.log(payload.medio)
    const res = await axios.post(
      `${AUTH_BACKEND_URL}/api/auth/forgot-password/${payload.id}`,
      {
        medio: payload.medio,
      }
    );
    console.log("RES", res)
    return {
      success: true,
      data: res.data, 
      message: '',
    };
  } catch (error) {
    console.log("error2", error)
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.log("ERROR", axiosError)
  if (axiosError.response?.data?.message) {
    return {
      success: false,
      data: undefined,
      message: axiosError.response?.data.message|| 'Usuario no registrado',
    };
  }
  }
};

export const changePasswordService = async (payload: {
  id: string;
  currentPassword: string;
  newPassword: string;
}) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    throw new Error('No hay una sesión activa');
  }
  const { backendToken } = session;

  const token = backendToken.accessToken;
  try {
    const res = await axios.post(
      `${AUTH_BACKEND_URL}/api/auth/reset-password/${payload.id}`,
      {
        sPass: payload.newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return await res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    throw new Error('Error al cambiar la contraseña');
  }
};

export const verifyPasswordService = async (sCurrentPassword: string) => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    throw new Error('No hay una sesión activa');
  }

  const token = session.backendToken.accessToken;
  try {
    const res = await axios.post(`${AUTH_BACKEND_URL}/api/auth/verify-password`, {
      sCurrentPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: res.data.data, 
      message: '',
    };
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
      console.log("ERROR", axiosError)
    if (axiosError.response?.data?.message) {
      return {
        success: false,
        data: undefined,
        message: axiosError.response?.data.message|| 'El documento ya está registrado',
      };
    }
  }
};
