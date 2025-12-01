import jwt from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

import Credentials from "next-auth/providers/credentials";
const isJwtExpired = (token: string): boolean => {
  const currentTime = Math.round(Date.now() / 1000 + 60);
  const decoded = jwt.decode(token);

  if (
    decoded !== null &&
    decoded !== undefined &&
    typeof decoded === "object"
  ) {
    if (decoded["exp"]) {
      const adjustedExpiry = decoded["exp"];
      return adjustedExpiry < currentTime;
    }
  }
  return true;
};

const nextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;
        const res = await fetch(
          process.env.API_GATEWAY_URL + "/api/auth/login?plataforma=EC-01",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sNombreUsuario: username,
              sPass: password,
            }),
          }
        );

        const resJson = await res.json();

        if (res.status !== 200 && res.status !== 201) {
          throw new Error(resJson.message || "Error al iniciar sesión");
        }

        return resJson;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (isJwtExpired(token.backendToken.accessToken as string)) {
        try {
          const body = { refreshToken: token.backendToken.refreshToken };
          const response = await fetch(
            `${process.env.API_GATEWAY_URL}/api/auth/refresh-token`,

            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
            }
          );
    
      // 🔹 Guardar el token en localStorage
    


          const { accessToken, refreshToken } = await response.json();
          const user = {
            ...token.user,
            backendToken: {
              accessToken,
              refreshToken,
            },
          };

          if (accessToken && refreshToken) {
            token = {
              ...token,
              user,
              backendToken: {
                accessToken,
                refreshToken,
                expiresIn: 24 * 60 * 60,
              },
              iat: Math.floor(Date.now() / 1000),
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            };

            return token;
          }
        } catch (error) {
          console.error("Error al refrescar el token", error);
          return {
            ...token,
            exp: 0,
          };
        }
      }

      return Promise.resolve(token);
    },
    async session({ token, session }) {
      session.user = token.user;
      session.backendToken = token.backendToken;
        
      return session;
    },
  },
  session: {
    jwt: true,
    maxAge: 24 * 60 * 60, // la sesión dura 24 horas
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    error: "/",
    signOut: "/",
  },
} satisfies NextAuthOptions;

export default nextAuthOptions;
