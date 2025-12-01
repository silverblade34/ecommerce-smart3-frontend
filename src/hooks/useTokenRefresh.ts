'use client';
import { verifyToken } from "@/lib/validations/server-auth";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";


export default function SessionRefresher() {
  const { data: session, update } = useSession();

  useEffect(() => {
    if (!session?.backendToken?.accessToken) return;

    const interval = setInterval(async () => {
      console.log("⏳ Verificando token con el servidor...");

      try {
        // ✅ Consultar al servidor si el token sigue válido
        const verify = await verifyToken();

        if (!verify.ok && verify.status === 401) {
          console.warn("🔴 Token expirado. Intentando refrescar...");

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_GATEWAY_URL}/api/auth/refresh-token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                refreshToken: session.backendToken.refreshToken,
              }),
            }
          );

          if (!res.ok) throw new Error("Error al refrescar token");

          const data = await res.json();
          console.log("✅ Nuevo token refrescado:", data.accessToken);

          // 🔁 Actualizamos la sesión en memoria
          await update({
            ...session,
            backendToken: {
              ...session.backendToken,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            },
          });
        } else if (verify.ok) {
          console.log("🟢 Token aún válido, todo correcto.");
        }
      } catch (err) {
        console.error("❌ Error en validación/refresco de token:", err);
        signOut(); // cierra sesión si falla la validación
      }
    }, 60_000); // cada minuto

    return () => clearInterval(interval);
  }, [session, update]);

  return null;
}
