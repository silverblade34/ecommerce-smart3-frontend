import { getSession } from "next-auth/react";
import nextAuthOptions from "@/server/auth";
import { getServerSession } from "next-auth";

export const getTokenBearer = async () => {
  const session = await getSession();

  if (!session) {
    return null;
  }
  const { backendToken } = session;
  const token = backendToken.accessToken;
  if (!token) {
    return null;
  }
  return token;
};

export const getServerTokenBearer = async () => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    return null;
  }

  const { backendToken } = session;
  const token = backendToken.accessToken;
  if (!token) {
    return null;
  }
  return token;
};
