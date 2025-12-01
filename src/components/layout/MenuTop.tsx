"use client";
import useCartStore from "@/context/cart/cart-store";
import useAuthStore from "@/context/user/auth-store";
import { ShoppingCartSimple, User } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoIcon } from "../common/icons/LogoIcon";
import MenuTopMobile from "./MenuTopMobile";
import SearchFilterHome from "@/app/articulos/components/filters/SearchFilterHome";
import { useEcommerce } from "@/hooks/useEcommerce";
import clsx from "clsx";
import ProfileDrop from "./ProfileDrop";

const MenuTop = () => {
  const {
    filtrosActuales,
    isLoadingProductos,
    setFiltros,
  } = useEcommerce();

  const { toggleCart, getTotalQuantity } = useCartStore();
  const { status } = useSession();
  const { handleModal } = useAuthStore();

  const [fixedHeader, setFixedHeader] = useState(false);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const [render, setRender] = useState(false);
  useEffect(() => {
    setRender(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setFixedHeader(scrollPosition > 0 && scrollPosition < lastScrollPosition);
      setLastScrollPosition(scrollPosition);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollPosition]);

  return (
    <>
      {/* <MenuTopMobile /> //Menu de opciones lateral */}
      <div

        className={`header-menu style-one  z-50 ${fixedHeader ? " fixed" : "relative"
          } bg-white w-full md:h-[68px] h-[56px]`}
      >
        <div className="container mx-auto h-full">
          <div className="header-main flex justify-between h-full ml-1.5">
            <Link prefetch={false} href={"/"} className="flex items-center">
              <LogoIcon />
            </Link>

            <div className={clsx("search-container md:w-1/2 mt-4 hidden md:block")}>
              <SearchFilterHome
                filtrosActuales={filtrosActuales}
              />
            </div>

            <div className="right flex gap-12">
              <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">

                <div className="line absolute bg-line w-px h-6 -right-6"></div>
              </div>
              <div className="list-action flex items-center gap-4">
                <ul className="user-icon flex items-center justify-center cursor-pointer">
                  {status === "authenticated" && <ProfileDrop />}
                  {status === "unauthenticated" && (
                    <li className="">
                      <button
                        className="cart-icon relative flex  cursor-pointer   flex-col items-center p-1"
                        type="button"
                        onClick={handleModal}
                      >

                        <User size={28} className=" block md:hidden text-primary_sokso mt-[15px]" />
                        <User size={28} className="text-primary_sokso hidden md:block" />

                        <span className="block md:hidden text-primary_sokso " style={{ fontSize: "0.8rem" }}>
                          SOKSO SMART
                        </span>


                        <span className="hidden md:block" style={{ fontSize: "0.8rem" }}>
                          SOKSO SMART
                        </span>

                      </button>
                    </li>
                  )}
                </ul>
                {/*  */}
                <div className="cart-icon flex items-center relative cursor-pointer">
                  <div className="  px-5">
                    <button
                      className="cart-icon relative flex cursor-pointer   flex-col items-center p-1"
                      onClick={toggleCart}
                      type="button"
                    >
                      <p className="relative">
                        <ShoppingCartSimple
                          size={28}
                          className="text-primary_sokso"
                        />
                        {render && (
                          <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
                            {getTotalQuantity()}
                          </span>
                        )}
                      </p>

                      <span
                        className="hidden md:block"
                        style={{ fontSize: "0.8rem" }}
                      >
                        Mi carrito
                      </span>
                    </button>
                  </div>
                </div> {/*  */}

              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "relative flex items-center  w-full md:justify-center", "gap-5 my-2 md:gap-0 md:my-0"
        )}
      >
        <div className={clsx("search-container block md:hidden w-full md:w-1/2 px-4")}>
          <SearchFilterHome
            filtrosActuales={filtrosActuales}
          />
        </div>
      </div>

    </>
  );
};

export default MenuTop;
