import useCartStore from "@/context/cart/cart-store";
import { Funnel, ShoppingCartSimple } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { CatalogoFiltro, ProductosParams } from "@/lib/interfaces/articulo";
import OrderFilter from "./filters/OrderFilter";
import SearchFilter from "./filters/SearchFilter";
import CatalogosTipoFilter from "./filters/TipoCatalogo";
import { EcommerceFilters } from "@/hooks/useEcommerce";
import { useSession } from "next-auth/react";


type Props = {
  count?: number;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  handleShowFilters: () => void;
  showFilters: boolean;
  mobileFiltersOpen: boolean;
  handleMobileFilters: () => void;
  isScrolled: boolean;
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  isLoadingProductos: boolean;
  filtrosDisponibles: EcommerceFilters | null;
  isLoadingFiltros: boolean;
  filtrosCatalogs: CatalogoFiltro[]
  isLoadingFiltrosCatalogs: boolean
};

const HeadCategory = ({

  handleShowFilters,
  showFilters,
  mobileFiltersOpen,
  handleMobileFilters,
  isScrolled,
  filtrosActuales,
  isLoadingProductos,
  setFiltros,
  filtrosDisponibles,
  isLoadingFiltros,
  filtrosCatalogs,
  isLoadingFiltrosCatalogs
}: Props) => {

  const { toggleCart, getTotalQuantity } = useCartStore();
  const [render, setRender] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    setRender(true);
  }, []);
  const hasCatalogos = filtrosCatalogs && filtrosCatalogs.length > 0;


  return (
    //     <div className="filter-heading flex flex-col gap-4 py-2">
    //       {isAuthenticated && (

    //         <>
    //           <div
    //             className={clsx(
    //               "relative flex items-center gap-5 mb-2 w-full md:justify-center"
    //             )}
    //           >
    //             <div className={clsx("search-container block md:hidden", isScrolled ? "md:w-1/2" : "w-full md:w-1/2")}>
    //              
    //             </div>
    //             {/* {(isScrolled && render) && (
    //               <button
    //                 className="cart-icon absolute right-0 p-1 mt-10 flex items-center cursor-pointer md:right-10"
    //                 onClick={toggleCart}
    //                 type="button"
    //               >
    //                 <ShoppingCartSimple size={28} className="text-primary_sokso" />
    //                 <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
    //                   {getTotalQuantity()}
    //                 </span>
    //               </button>
    //             )} */}
    //           </div></>
    //       )}

    //       <div className="flex flex-wrap items-center justify-between relative">
    //         <div className=" choose-layout left has-line flex flex-wrap items-center gap-5">
    //           <button
    //             className={clsx(
    //               "item three-col hidden h-8 w-8 cursor-pointer items-center justify-center rounded border border-primary_sokso lg:flex",
    //               showFilters && "active"
    //             )}
    //             onClick={handleShowFilters}
    //             type="button"
    //           >
    //             <div className="flex items-center gap-0.5">
    //               <Funnel
    //                 size={16}
    //                 color={showFilters ? "#FFFFFF" : "#8331A7"}
    //                 className="h-4 w-4"
    //                 weight="fill"

    //               />
    //             </div>
    //           </button>
              // <button
              //   className={clsx(
              //     "item three-col flex h-8 w-8 cursor-pointer items-center justify-center space-x-3 rounded border border-primary_sokso   lg:hidden",
              //     mobileFiltersOpen && "active text-white"
              //   )}
              //   onClick={handleMobileFilters}
              //   type="button"
              // >
    //             <div className="flex items-center gap-0.5">
    //               <Funnel
    //                 size={16}
    //                 color={mobileFiltersOpen ? "#FFFFFF" : "#8331A7"}
    //                 className="h-4 w-4"
    //                 weight="fill"
    //               />
    //             </div>
    //           </button>
    //         </div>
    //         <div className={clsx("relative flex justify-center items-center gap-2 overflow-x-auto sm:overflow-visible w-[300px] ",
    //           filtrosCatalogs.length<3 && "justify-center"
    //         )


    //         }>
    //           {(filtrosCatalogs) && (
    //             <CatalogosTipoFilter
    //               tiposCatalogo={filtrosCatalogs}
    //               isLoading={isLoadingFiltrosCatalogs}
    //               filtrosActuales={filtrosActuales}
    //               filtrosCatalogs={filtrosCatalogs}
    //               setFiltros={setFiltros}


    //             />
    //           )}
    //         </div>

    //         <div
    //           className={clsx(
    //             " hidden lg:flex items-center gap-3", // 
    //             (!isAuthenticated && isScrolled) && "mx-auto",
    //           )}
    //         >
    //           <OrderFilter
    //             setFiltros={setFiltros}
    //             filtrosActuales={filtrosActuales}
    //             isLoadingProductos={isLoadingProductos}
    //           />
    //         </div>
    //          {(isScrolled && render) && (
    // <>

    //               <button
    //                 className="cart-icon absolute right-0 p-1  flex items-center cursor-pointer md:right-10"
    //                 onClick={toggleCart}
    //                 type="button"
    //               >
    //                 <ShoppingCartSimple size={28} className="text-primary_sokso" />
    //                 <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
    //                   {getTotalQuantity()}
    //                 </span>
    //               </button>
    //               </>
    //             )}

    //         {/* )} */}

    //         {/* {(isScrolled && render && !isAuthenticated) && (
    //           <button
    //             className="cart-icon absolute right-0 p-1 flex items-center cursor-pointer md:right-10"
    //             onClick={toggleCart}
    //             type="button"
    //           >
    //             <ShoppingCartSimple size={28} className="text-primary_sokso" />
    //             <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
    //               {getTotalQuantity()}
    //             </span>
    //           </button>
    //         )} */}
    //       </div>


    //     </div>

    <div className="flex w-full items-center justify-between relative py-2">

      {/* 1️⃣ COLUMNA IZQUIERDA – FILTROS */}
      <div className="flex items-center gap-3">
        {/* Filtro Desktop */}
        <button
          className={clsx(
            "hidden lg:flex h-8 w-8 items-center justify-center rounded border border-primary_sokso",
            showFilters && "active"
          )}
          onClick={handleShowFilters}
          type="button"
        >
          <Funnel size={16} weight="fill" color={ "#8331A7"} />
        </button>

        {/* Filtro Mobile */}
        <button
          className={clsx(
            "lg:hidden h-8 w-8 flex items-center justify-center rounded border border-primary_sokso",
            mobileFiltersOpen && "active text-white"
          )}
          onClick={handleMobileFilters}
          type="button"
        >
          <Funnel size={16} weight="fill" color={ "#8331A7"} />
        </button>
      </div>

      {/* 2️⃣ COLUMNA CENTRAL – CATÁLOGOS SI EXISTEN */}
      <div
        className={clsx(
          "flex justify-center items-center gap-2 overflow-x-auto sm:overflow-visible",
          hasCatalogos ? "w-[300px]" : "flex-1"
        )}
      >
        {hasCatalogos && (
          <CatalogosTipoFilter
            tiposCatalogo={filtrosCatalogs}
            isLoading={isLoadingFiltrosCatalogs}
            filtrosActuales={filtrosActuales}
            filtrosCatalogs={filtrosCatalogs}
            setFiltros={setFiltros}
          />
        )}
      </div>

      {/* 3️⃣ COLUMNA DERECHA – ORDEN + CARRITO */}
      <div className="flex items-center gap-3">

        {/* ORDEN solo en Desktop */}
        <div className="hidden lg:flex">
          <OrderFilter
            setFiltros={setFiltros}
            filtrosActuales={filtrosActuales}
            isLoadingProductos={isLoadingProductos}
          />
        </div>

        {/* CARRITO */}
        {(isScrolled && render) && (
          <button
            className="cart-icon relative p-1 flex items-center cursor-pointer"
            onClick={toggleCart}
            type="button"
          >
            <ShoppingCartSimple size={28} className="text-primary_sokso" />
            <span className="quantity cart-quantity absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary_sokso text-xs text-white">
              {getTotalQuantity()}
            </span>
          </button>
        )}
      </div>
    </div>

  );
};

export default HeadCategory;