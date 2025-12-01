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
  colores: {
    nIdColor: string;
    sDenominacion: string;
    sColorEcommerce: string;
    cantidad: number;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const ColorsFiler = ({
  colores,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  // Estado local para los colores seleccionados
  const [selectedColors, setSelectedColors] = useState<string[]>(
    filtrosActuales.colores || []
  );

  // Actualizar el estado local cuando cambian los filtros actuales
  useEffect(() => {
    if (filtrosActuales.colores) {
      setSelectedColors(filtrosActuales.colores);
    } else {
      setSelectedColors([]);
    }
  }, [filtrosActuales.colores]);

  // Manejar la selección/deselección de colores
  const handleColorToggle = (colorId: string, nomColor: string) => {
    let newSelectedColors: string[];
    let newSelectedNames: string[];

    if (selectedColors.includes(colorId)) {
      // Remover el color si ya está seleccionado
      newSelectedColors = selectedColors.filter((id) => id !== colorId);
      newSelectedNames = (filtrosActuales.nomColor || []).filter(
        (name) => name !== nomColor
      );
    } else {
      // Añadir el color si no está seleccionado
      newSelectedColors = [...selectedColors, colorId];
      newSelectedNames = [...(filtrosActuales.nomColor || []), nomColor];
    }

    setSelectedColors(newSelectedColors);

    // Actualizar los filtros globales
    if (newSelectedColors.length === 0) {
      setFiltros({ colores: undefined, nomColor: undefined });
    } else {
      setFiltros({ colores: newSelectedColors, nomColor: newSelectedNames });
    }
  };


  // Limpiar todos los colores seleccionados
  const clearAllColors = () => {
    setSelectedColors([]);
    setFiltros({ colores: undefined });
  };

  const coloresUnicos = Array.from(
    new Map(colores.map((item) => [item.sDenominacion, item])).values()
  );

  return (
    <Disclosure
      as="div"
      className="filter-color mt-8 border-b border-line pb-8"
      defaultOpen={
        filtrosActuales.colores && filtrosActuales.colores.length > 0
      }
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Colores</span>
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
      <DisclosurePanel className="list-color mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
        {isLoading ? (
          <SkeletonFilerLine />
        ) : (
          <div className="w-full">
            <div className="flex flex-wrap items-center gap-3">
              {coloresUnicos?.map((color) => (
                <button
                  key={color.nIdColor}
                  className={`color-item flex items-center justify-center gap-2 rounded-full border ${selectedColors.includes(color.nIdColor)
                    ? "border-primary_sokso bg-primary_sokso/10 text-primary_sokso"
                    : "border-line"
                    } px-3 py-[5px]`}
                  onClick={() => handleColorToggle(color.nIdColor, color.sDenominacion)}
                >
                  <div className="caption1 capitalize">
                    {color.sDenominacion}
                  </div>
                  {selectedColors.includes(color.nIdColor) && (
                    <X className="text-primary_sokso" />
                  )}
                </button>
              ))}
            </div>

            {selectedColors.length > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  className="flex items-center justify-center gap-1 text-xs text-primary_sokso"
                  onClick={clearAllColors}
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

export default ColorsFiler;
