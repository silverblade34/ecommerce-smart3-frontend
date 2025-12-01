"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCartSimple, User } from "@phosphor-icons/react";
import { LogoIcon } from "../common/icons/LogoIcon";
import useAuthStore from "@/context/user/auth-store";
import useCartStore from "@/context/cart/cart-store";
import ProfileDrop from "./ProfileDrop";

const Navbar = () => {
  const { toggleCart, getTotalQuantity } = useCartStore();
  const { handleModal } = useAuthStore();
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);
  const { status } = useSession();

  return (
    <div className=" bg-bg_gray/25 py-1">
      <nav className="header-menu container mx-auto flex  justify-center">
        <li className="flex items-center justify-center">
          <Link
            prefetch={false}
            href="https://sokso.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LogoIcon />
          </Link>
        </li>
        <ul className="flex h-[56px] w-full items-center  justify-end p-5 md:h-[74px]">
          <li className="  px-5">
            <button
              className="cart-icon relative flex cursor-pointer   flex-col items-center p-1"
              onClick={toggleCart}
              type="button"
            >
              <p className="relative">
                <ShoppingCartSimple size={28} className="text-primary_sokso" />
                <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
                  {render && getTotalQuantity()}
                </span>
              </p>

              <span className="hidden md:block" style={{ fontSize: "0.8rem" }}>
                Mi carrito
              </span>
            </button>
          </li>

          {status === "authenticated" && <ProfileDrop />}
          {status === "unauthenticated" && (
            <li className="">
              <button
                className="cart-icon relative flex  cursor-pointer   flex-col items-center p-1"
                type="button"
                onClick={handleModal}
              >
                <User size={28} className="text-primary_sokso" />
                <span
                  className="hidden md:block"
                  style={{ fontSize: "0.8rem" }}
                >
                  Iniciar sesión
                </span>
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
