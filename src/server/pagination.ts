import { getTokenBearer } from '@/utils/access_token';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getServerSession } from "next-auth";
import nextAuthOptions from './auth';

export const paginationService = async (url: string) => {
const session = await getServerSession(nextAuthOptions);

    if (!session || !session.backendToken?.accessToken) {
      throw new Error('Sesión no válida o token ausente');
    }

    const token = session.backendToken.accessToken;



  if (!url) return toast.info('No hay más resultados');
  const res = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) return toast.error('Error al obtener los resultados');
  return res.data;
};
