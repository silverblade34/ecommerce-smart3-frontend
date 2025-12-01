
"use client";
import { useEcommerce } from "@/hooks/useEcommerce";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Filters from "./filters/FIlters";
import FiltersMovile from "./filters/FiltersMovile";
import Pagination from "./filters/Pagination";
import HeadCategory from "./HeadCategory";
import ProductCard from "./ProductCard";
import ProductSkeleton from "./ProductSkeleton";
import SelectedFilters from "./filters/SelectedFilters";
import { useSession } from "next-auth/react";
import SliderHome from "@/app/(home)/components/SliderHome";
import WhatsappButton from "@/components/common/WhatsappButton";
import { OfflineMessage } from "@/components/common/OfflineMessage";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { NetworkStatusBanner } from "@/components/common/NetworkStatusBanner";
import ContadorHome from "@/app/(home)/components/ContadorHome";
import BonoHome from "@/app/(home)/components/BonoHome";



const ProductList = ({ params }: { params?: { slug?: string[] } }) => {//
  const {
    filtrosActuales,
    filtrosDisponibles,
    isLoadingFiltros,
    isLoadingProductos,
    paginaActual,
    productos,
    resetFiltros,
    setFiltros,
    setPagina,
    totalPaginas,
    totalProductos,
    handleMobileFilters,
    handleShowFilters,
    headerRef,
    isScrolled,
    isScrolledPagination,
    mobileFiltersOpen,
    paginationBotRef,
    showFilters,
    filtrosCatalogs,
    isLoadingFiltrosCatalogs,
    isNetworkError,
    fetchProductos
  } = useEcommerce();

  const isOnline = useOnlineStatus();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  // const [hasPreventa, setHasPreventa] = useState(false);


  const dataFilter = {
    totalItems: totalProductos,
    totalPages: totalPaginas,
    currentPage: paginaActual,
    pageSize: filtrosActuales.limit || 10,
  };

  const hasFilters = () => {
    return (
      filtrosActuales.nIdCategoria !== undefined ||
      filtrosActuales.nIdMarca !== undefined ||
      filtrosActuales.nIdGenero !== undefined ||
      filtrosActuales.nIdTipo !== undefined ||
      (filtrosActuales.colores && filtrosActuales.colores.length > 0) ||
      filtrosActuales.precioMin !== undefined ||
      filtrosActuales.precioMax !== undefined ||
      (filtrosActuales.tallas && filtrosActuales.tallas.length > 0) ||
      filtrosActuales.nIdTipoCatalogo !== undefined ||
      filtrosActuales.nIdEstilo !== undefined ||
      filtrosActuales.nIdCatalogo !== undefined
    );
  };



  return (
    <>
      {/* Banner de estado de conexión */}
      <NetworkStatusBanner />

      <div
        ref={headerRef}
        className={`fixed z-[20] w-full max-w-7xl border-b border-secondary2 bg-white px-4 transition-all duration-300 md:px-6 lg:px-8 
          ${isScrolled ? "top-0 bg-white" : "top-18 bg-white"
          }`}
      >
        <HeadCategory
          count={totalProductos}
          pagination={dataFilter}
          handleShowFilters={handleShowFilters}
          showFilters={showFilters}
          mobileFiltersOpen={mobileFiltersOpen}
          handleMobileFilters={handleMobileFilters}
          isScrolled={isScrolled}
          isLoading={isLoadingProductos || isLoadingFiltros}
          filtrosActuales={filtrosActuales}
          setFiltros={setFiltros}
          isLoadingProductos={isLoadingProductos}
          filtrosDisponibles={filtrosDisponibles}
          isLoadingFiltros={isLoadingFiltros}
          filtrosCatalogs={filtrosCatalogs}
          isLoadingFiltrosCatalogs={isLoadingFiltrosCatalogs}
        />

        <SelectedFilters
          filtrosActuales={filtrosActuales}
          filtrosDisponibles={filtrosDisponibles}
          setFiltros={setFiltros}
          resetFiltros={resetFiltros}
          filtrosCatalogs={filtrosCatalogs}
        />
      </div>

      <div
        className={clsx(
          "flex w-full justify-between space-y-1 px-1 lg:mx-auto lg:space-x-10 lg:space-y-0",
          isAuthenticated ? "mt-32" : "my-20"
        )}
      >
        {/* Filtros desktop */}
        <div
          className={clsx(
            "relative hidden ",
            showFilters ? "lg:block lg:w-1/4" : "lg:hidden"
          )}
        >
          <Filters
            showFilters={showFilters}
            isScrolled={isScrolled}
            filtrosDisponibles={filtrosDisponibles}
            isLoadingFiltros={isLoadingFiltros}
            filtrosActuales={filtrosActuales}
            setFiltros={setFiltros}
            isAuthenticated={isAuthenticated}
          />
        </div>

        {/* Filtros mobile */}
        <FiltersMovile
          resetFiltros={resetFiltros}
          filtrosDisponibles={filtrosDisponibles}
          isLoadingFiltros={isLoadingFiltros}
          mobileFiltersOpen={mobileFiltersOpen}
          handleMobileFilters={handleMobileFilters}
          filtrosActuales={filtrosActuales}
          setFiltros={setFiltros}
        />

        <div className="flex-1 flex flex-col lg:px-2 w-2/3">
          <div
            className={clsx(
              "relative flex justify-center items-center w-full mb-4 transition-all duration-300",
              "lg:w-full",
              hasFilters() ? "mt-20" : "mt-4"
            )}
          >
            <div className="w-full max-w-8xl  overflow-hidden rounded-md shadow-md">
              <SliderHome />
            </div>

          </div>

          {typeof window !== "undefined" && localStorage.getItem("catalogoActivo") && (
            <div
              className={clsx(
                "relative flex justify-center items-center w-full mb-4 transition-all duration-300",
                "lg:w-full",
                hasFilters() ? "mt-0" : "mt-0"
              )}
            >
              <div className="w-full max-w-8xl overflow-hidden rounded-md shadow-md">
                <ContadorHome />

              </div>
            </div>
          )}
          {isAuthenticated && (
            <div className="w-full max-w-8xl overflow-hidden rounded-md shadow-md">
              <BonoHome />
            </div>
          )}
          {totalPaginas > 1 && (
            <div
              className={clsx(
                "z-50 flex",
                !isAuthenticated ? "top-20" : isScrolled && "mt-10",
                isScrolled && hasFilters()
                  ? "top-36 lg:top-30"
                  : "top-20",
                isScrolled && !isScrolledPagination
                  ? "list-pagination-scroll fixed z-50 max-w-7xl items-start justify-start rounded-lg border border-line bg-white px-3 py-2"
                  : "list-pagination items-center justify-start"
              )}
            >
              <Pagination
                pageCount={totalPaginas}
                setPagina={setPagina}
                isLoadingProductos={isLoadingProductos}
                paginaActual={paginaActual}
              />
            </div>
          )}

          {/* Productos */}
          <div className="list-product-block w-full overflow-y-auto">
            {/* Mostrar mensaje offline si no hay internet y no hay productos en caché */}
            {!isOnline && productos.length === 0 && !isLoadingProductos ? (
              <OfflineMessage
                onRetry={() => fetchProductos()}
                message="No se pueden cargar los productos sin conexión"
              />
            ) : isNetworkError && productos.length === 0 && !isLoadingProductos ? (
              <OfflineMessage
                onRetry={() => fetchProductos()}
                message="Error de conexión al cargar los productos"
              />
            ) : (
              <div
                className={clsx(
                  "list-product hide-product-sold mt-7 grid grid-cols-2 gap-[20px] sm:gap-[10px]",
                  showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4",
                  isLoadingProductos && "w-full"
                )}
              >
                {isLoadingProductos
                  ? Array.from({ length: showFilters ? 6 : 8 }).map((_, index) => (
                    <ProductSkeleton key={index} />
                  ))
                  : productos.length > 0 &&
                  productos.map((producto, index) => (
                    <ProductCard
                      key={producto.nIdArticulo || index}
                      product={producto}
                    />
                  ))}
                {!isLoadingProductos && productos.length === 0 && isOnline && (
                  <div className="flex w-full flex-col items-center justify-center px-2">
                    <p className="text-gray-500 text-lg">
                      No se encontraron productos
                    </p>
                    <button
                      className="mt-4 rounded-md bg-primary_sokso px-4 py-2 text-white"
                      onClick={resetFiltros}
                    >
                      Borrar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {totalPaginas > 1 && (
            <div
              ref={paginationBotRef}
              className="list-pagination mt-7 flex w-full items-center justify-start md:my-5"
            >
              <Pagination
                pageCount={totalPaginas}
                setPagina={setPagina}
                isLoadingProductos={isLoadingProductos}
                paginaActual={paginaActual}
              />
            </div>
          )}
        </div>
      </div>
      <div className="mb-10 mt-10">

      </div>
      <WhatsappButton />
      <div className="mb-10 mt-10">

      </div>
    </>
  );
};

export default ProductList;