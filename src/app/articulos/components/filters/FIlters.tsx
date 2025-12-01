import BrandsFilter from "./BrandsFilter";
import ColorsFiler from "./ColorsFiler";
import GenderFilter from "./GenderFilter";
import RangePriceFilter from "./RangePriceFilter";
import TypesFilter from "./TypesFilter";
import CatalogosFilter from "./Catalogos";
import TipoPedidoFilter from "./TipoPedidoFilter";
import EstiloFilter from "./Estilo";
import TallasFilter from "./TallasFilter";
import { Transition } from "@headlessui/react";
import { EcommerceFilters } from "@/hooks/useEcommerce";
import { ProductosParams } from "@/lib/interfaces/articulo";
import CatFilter from "./CatFilter";
import SkeletonFilters from "./SkeletonFilters";
import { useState } from "react";

type Props = {
  filtrosDisponibles: EcommerceFilters | null;
  isLoadingFiltros: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  showFilters: boolean;
  isScrolled: boolean;
  isAuthenticated: boolean;
};
const Filters = ({
  filtrosDisponibles,
  isLoadingFiltros,
  filtrosActuales,
  setFiltros,
  showFilters,
  isScrolled,
  isAuthenticated,
}: Props) => {


  return (
    <div
      className={`z-100 bg-white ${isScrolled
        ? "top-24 pb-20"
        : "top-32 pb-28"
        } fixed h-full w-full max-w-xs overflow-y-auto `}

    >
      <Transition
        show={showFilters}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 transform -translate-x-10"
        enterTo="opacity-100 transform translate-x-0"
        leave="transition ease-in duration-200"
        leaveFrom="opacity-100 transform translate-x-0"
        leaveTo="opacity-0 transform -translate-x-10"
      >
        <div className="overflow-y-auto px-4 pt-10">
          <div className={`${isScrolled ? "mt-4" : "mt-10"} flex justify-between`}>
            <h2>Filtros</h2>
          </div>

          {/* ✅ Mostrar skeleton cuando está cargando */}
          {isLoadingFiltros ? (
            <SkeletonFilters />
          ) : (
            <>
            {/**Tipo de Pedido */}
            {/* {filtrosDisponibles?.tipo_pedido  && ( // && isAuthenticated
                <TipoPedidoFilter
                  tipo={filtrosDisponibles.tipo_pedido}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )} */}

           

              {/* Catálogos */}
              {filtrosDisponibles?.catalogos  && ( // && isAuthenticated
                <CatalogosFilter
                  catalogos={filtrosDisponibles.catalogos}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Marcas */}
              {filtrosDisponibles?.marcas && (
                <BrandsFilter
                  marcas={filtrosDisponibles.marcas}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Rango de Precios */}
              {filtrosDisponibles?.rangoPrecio && (
                <RangePriceFilter
                  rangoPrecio={filtrosDisponibles.rangoPrecio}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Géneros */}
              {filtrosDisponibles?.generos && (
                <GenderFilter
                  generos={filtrosDisponibles.generos}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Tipos */}
              {filtrosDisponibles?.tipos && (
                <TypesFilter
                  tipos={filtrosDisponibles.tipos}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Categorías */}
              {filtrosDisponibles?.categorias && (
                <CatFilter
                  categorias={filtrosDisponibles.categorias}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Estilos */}
              {filtrosDisponibles?.estilos &&  ( // isAuthenticated &&
                <EstiloFilter
                  estilos={filtrosDisponibles.estilos}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Colores */}
              {filtrosDisponibles?.colores && (
                <ColorsFiler
                  colores={filtrosDisponibles.colores}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}

              {/* Tallas */}
              {filtrosDisponibles?.tallas && (
                <TallasFilter
                  tallas={filtrosDisponibles.tallas}
                  isLoading={isLoadingFiltros}
                  filtrosActuales={filtrosActuales}
                  setFiltros={setFiltros}
                />
              )}
            </>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default Filters;