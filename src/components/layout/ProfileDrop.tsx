"use client";

import useCartStore from "@/context/cart/cart-store";
import useAuthStore from "@/context/user/auth-store";
import { LogoutService } from "@/server/actions/client";
import { getMyClient } from "@/server/actions/users";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Spinner } from "@heroui/react";
import {
  Browser,
  ShoppingCart,
  SignOut,
  UserCheck,
  UserGear,
} from "@phosphor-icons/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ProfileDrop = () => {
  const { clearCart } = useCartStore();

  const [loading, setLoading] = useState(false);
const { profile, setProfile } = useAuthStore();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isDirector =
    isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01";

  // ✅ Solo obtiene perfil si no existe aún
 useEffect(() => {
  if (!session) return;

  // Evita llamadas múltiples
  if (profile) return; 

  setLoading(true);

  getMyClient()
    .then((data) => {
      if (data) {
        setProfile(data);
      }
    })
    .finally(() => setLoading(false));
}, [session]); // <-- SOLO depende de session


  // ✅ Guarda en localStorage solo si ya se tiene el profile listo
  useEffect(() => {
    if (profile?.cliente?.directora?.nIdDirectora) {
      localStorage.setItem(
        "nIdDirectora",
        String(profile.cliente.directora.nIdDirectora)
      );
    }
  }, [profile]);

const handleLogout = async () => {
  try {
    if (profile?.cliente?.nIdCliente) {
      const response = await LogoutService(profile.cliente.nIdCliente);
      console.log("Logout response:", response);
    } else {
      toast.warn("No se encontró información del cliente");
    }
  } catch (error) {
    console.error("Error al ejecutar logout:", error);
    toast.error("Hubo un problema al cerrar sesión");
  } finally {
    localStorage.removeItem("nIdDirectora");
    localStorage.clear();
    clearCart();
    signOut({ callbackUrl: "/" });
  }
};
  return (
    <li className="text-right">
      <Menu>
        <MenuButton className="bg-sokso-purple data-[hover]:bg-sokso-black data-[open]:bg-sokso-black inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10">
          <div className="cart-icon group relative flex cursor-pointer flex-col items-center p-1">
            <UserCheck size={28} className="text-primary_sokso" />
            <span className="text-primary_sokso" style={{ fontSize: "0.8rem" }}>
              {loading ? (
                <Spinner size="sm" color="secondary" />
              ) : profile?.cliente?.infoCliente?.sNombre ? (
                profile.cliente.infoCliente.sNombre.split(" ")[0]
              ) : (
                "SOKSO SMART"
              )}
            </span>
          </div>
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          className="z-[999] w-52 origin-top-right rounded-xl border border-line bg-bg_gray p-1 text-sm text-white"
        >
          {isDirector && (
            <MenuItem>
              <Link
                prefetch={false}
                href="/dashboard/pedidos/directora"
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base text-secondary_sokso hover:bg-primary_sokso hover:text-white"
              >
                <ShoppingCart size={16} className="size-6 group-hover:fill-white" />
                Gestión Pedidos
              </Link>
            </MenuItem>
          )}

          <MenuItem>
            <Link
              prefetch={false}
              href="/dashboard"
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base text-secondary_sokso hover:bg-primary_sokso hover:text-white"
            >
              <Browser size={16} className="size-6 group-hover:fill-white" />
              Mundo Sokso
            </Link>
          </MenuItem>

          <MenuItem>
            <Link
              prefetch={false}
              href="/dashboard/perfil"
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base text-secondary_sokso hover:bg-primary_sokso hover:text-white"
            >
              <UserGear size={16} className="size-6 group-hover:fill-white" />
              Perfil
            </Link>
          </MenuItem>

          <div className="my-1 h-px bg-secondary2" />

          <MenuItem>
            <button
              type="button"
              onClick={handleLogout}
              className="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-base text-secondary_sokso hover:bg-white/10"
            >
              <SignOut size={16} className="size-6" />
              Cerrar sesión
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </li>
  );
}

export default ProfileDrop;
