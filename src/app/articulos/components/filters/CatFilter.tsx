import SkeletonFilterItem from "@/components/common/skeleton/SkeletonFilterItem";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus, X } from "@phosphor-icons/react";

type Props = {
  categorias: {
    nIdCategoria: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const CatFilter = ({
  categorias,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  const handleCategoryChange = (categoriaId: number , nomCategoria: string) => {
    if (filtrosActuales.nIdCategoria === categoriaId) {
      // Si ya está seleccionado, lo deseleccionamos
      setFiltros({ nIdCategoria: undefined, nomCategoria:undefined });
    } else {
      // Si no está seleccionado, lo seleccionamos
      setFiltros({ nIdCategoria: categoriaId, nomCategoria: nomCategoria });
    }
  };

  return (
    <Disclosure
      as="div"
      className="filter-color mt-8 border-b border-line pb-8"
      defaultOpen={filtrosActuales.nIdCategoria ? true : false}
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Categorías</span>
          <span className="ml-6 flex items-center">
            <Plus
              aria-hidden="true"
              className="h-5 w-5 group-data-[open]:hidden"
            />
            <Minus
              aria-hidden="true"
              className="h-5 w-5 [.group:not([data-open])_&]:hidden"
            />
          </span>
        </DisclosureButton>
      </h3>
      <DisclosurePanel
        unmount={false}
        className="list-color mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto"
      >
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <SkeletonFilterItem key={index} index={index} />
            ))
          : categorias?.map((categoria) => {
              const isActive =
                filtrosActuales.nIdCategoria === categoria.nIdCategoria;
              // Generar el ID a partir de sDescripcion
              const buttonId = `TAGCAT-${categoria.sDescripcion
                .toLowerCase()
                .replace(/\s+/g, "-")}`;

              return (
                <button
                  key={categoria.nIdCategoria}
                  id={buttonId} // Agregar el ID al botón
                  className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${
                    isActive ? "active hover:border-red hover:text-red" : ""
                  }`}
                  onClick={() => handleCategoryChange(categoria.nIdCategoria, categoria.sDescripcion)}
                >
                  <div className="caption1 capitalize">
                    {categoria.sDescripcion}
                  </div>
                  {isActive && <X className="text-secondary" />}
                </button>
              );
            })}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default CatFilter;
