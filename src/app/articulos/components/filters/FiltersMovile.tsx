import { EcommerceFilters } from "@/hooks/useEcommerce";
import { ProductosParams } from "@/lib/interfaces/articulo";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { Trash, X } from "@phosphor-icons/react";
import BrandsFilter from "./BrandsFilter";
import CatFilter from "./CatFilter";
import ColorsFiler from "./ColorsFiler";
import GenderFilter from "./GenderFilter";
import RangePriceFilter from "./RangePriceFilter";
import TypesFilter from "./TypesFilter";
import CatalogosFilter from "./Catalogos";
import EstiloFilter from "./Estilo";
import TallasFilter from "./TallasFilter";
import { useSession } from "next-auth/react";
import SkeletonFilters from "./SkeletonFilters";

type Props = {
  handleMobileFilters: () => void;
  mobileFiltersOpen: boolean;
  resetFiltros: () => void;
  filtrosDisponibles: EcommerceFilters | null;
  isLoadingFiltros: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const FiltersMovile = ({
  mobileFiltersOpen,
  handleMobileFilters,
  resetFiltros,
  filtrosDisponibles,
  isLoadingFiltros,
  filtrosActuales,
  setFiltros,
}: Props) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <Dialog
      open={mobileFiltersOpen}
      onClose={handleMobileFilters}
      className="relative z-[999] lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-25 p-4 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 z-40 flex">
        <DialogPanel
          transition
          className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out data-[closed]:translate-x-full"
        >
          <div className="flex items-center justify-between px-4">
            <h2 className="text-gray-900 text-lg font-medium">Filtros</h2>
            <button
              type="button"
              onClick={handleMobileFilters}
              className="text-gray-400 -mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2"
            >
              <span className="sr-only">Cerrar menu</span>
              <X aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>

          {/* Filters */}
          <div className="border-gray-200 mt-4 border-t p-4">
            <h3 className="sr-only">Categorias</h3>

            <div className={`mt-5 flex justify-between`}>
              <button
                type="button"
                onClick={resetFiltros}
                className="flex items-center justify-center rounded-md border border-primary_sokso bg-white px-2 py-1 text-xs text-primary_sokso"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span className="text-xs">Limpiar</span>
              </button>
            </div>
            {isLoadingFiltros ? (
              <SkeletonFilters />
            ) : (
              <>
                {/* Nuevo componente de filtros seleccionados */}
                {filtrosDisponibles?.catalogos && isAuthenticated && (
                  <CatalogosFilter
                    catalogos={filtrosDisponibles.catalogos}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}

                {filtrosDisponibles?.marcas && (
                  <BrandsFilter
                    marcas={filtrosDisponibles.marcas}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}


                {filtrosDisponibles?.rangoPrecio && (
                  <RangePriceFilter
                    rangoPrecio={filtrosDisponibles.rangoPrecio}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}

                {filtrosDisponibles?.generos && (
                  <GenderFilter
                    generos={filtrosDisponibles.generos}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}

                {filtrosDisponibles?.tipos && (
                  <TypesFilter
                    tipos={filtrosDisponibles.tipos}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}

                {filtrosDisponibles?.categorias && (
                  <CatFilter
                    categorias={filtrosDisponibles.categorias}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}
                {filtrosDisponibles?.estilos && isAuthenticated && (
                  <EstiloFilter
                    estilos={filtrosDisponibles.estilos}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}




                {filtrosDisponibles?.colores && (
                  <ColorsFiler
                    colores={filtrosDisponibles.colores}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}
                {filtrosDisponibles?.tallas && (
                  <TallasFilter
                    tallas={filtrosDisponibles.tallas}
                    isLoading={isLoadingFiltros}
                    filtrosActuales={filtrosActuales}
                    setFiltros={setFiltros}
                  />
                )}
              </>)}

          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FiltersMovile;
