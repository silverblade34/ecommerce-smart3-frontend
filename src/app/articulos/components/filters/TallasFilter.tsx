import SkeletonFilerLine from "@/components/common/skeleton/SkeletonFilerLine";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Props = {
  tallas: {
    nIdTalla: number;
    sTalla: string;
    sDescripcion: string;
    cantidad: number;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const TallasFilter = ({
  tallas,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  // Estado local para las tallas seleccionadas
  const [selectedTallas, setSelectedTallas] = useState<number[]>(
    filtrosActuales.tallas || []
  );

  // Actualizar el estado local cuando cambian los filtros actuales
  useEffect(() => {
    if (filtrosActuales.tallas) {
      setSelectedTallas(filtrosActuales.tallas);
    } else {
      setSelectedTallas([]);
    }
  }, [filtrosActuales.tallas]);

  // Manejar la selección/deselección de tallas
  const handleTallaToggle = (tallaId: number, nomTalla: string) => {
    let newSelectedTallas;
    let newSelectedNames: string[];

    if (selectedTallas.includes(tallaId)) {
      // Remover la talla si ya está seleccionada
      newSelectedTallas = selectedTallas.filter((id) => id !== tallaId);
      newSelectedNames = (filtrosActuales.nomTalla || []).filter(
        (name) => name !== nomTalla
      );
    } else {
      // Añadir la talla si no está seleccionada
      newSelectedTallas = [...selectedTallas, tallaId];
      newSelectedNames = [...(filtrosActuales.nomTalla || []), nomTalla];

    }

    setSelectedTallas(newSelectedTallas);

    // Actualizar los filtros globales
    if (newSelectedTallas.length === 0) {
      setFiltros({ tallas: undefined , nomTalla: undefined});
    } else {
      setFiltros({ tallas: newSelectedTallas , nomTalla: newSelectedNames});
    }
  };

  // Limpiar todas las tallas seleccionadas
  const clearAllTallas = () => {
    setSelectedTallas([]);
    setFiltros({ tallas: undefined });
  };

  return (
    <Disclosure
      as="div"
      className="filter-talla mt-8 border-b border-line pb-8"
      defaultOpen={filtrosActuales.tallas && filtrosActuales.tallas.length > 0}
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Tallas</span>
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
      <DisclosurePanel className="list-talla mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
        {isLoading ? (
          <SkeletonFilerLine />
        ) : (
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3">
              {tallas?.map((talla) => (
                <button
                  key={talla.nIdTalla}
                  className={`talla-item flex items-center justify-center gap-2 rounded-md border ${selectedTallas.includes(talla.nIdTalla)
                      ? "border-primary_sokso bg-primary_sokso text-white"
                      : "border-line"
                    } min-w-[42px] px-3 py-[5px]`}
                  onClick={() => handleTallaToggle(talla.nIdTalla, talla.sDescripcion)}
                  title={talla.sDescripcion || talla.sTalla}
                >
                  <div className="caption1 uppercase">{talla.sTalla}</div>
                  {selectedTallas.includes(talla.nIdTalla) && (
                    <X className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>

            {selectedTallas.length > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  className="flex items-center justify-center gap-1 text-xs text-primary_sokso"
                  onClick={clearAllTallas}
                >
                  <X className="h-4 w-4" />
                  <span>Limpiar selección</span>
                </button>
              </div>
            )}
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default TallasFilter;
