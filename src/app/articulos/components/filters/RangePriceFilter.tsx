import SkeletonFilerLine from "@/components/common/skeleton/SkeletonFilerLine";
import { ProductosParams } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus } from "@phosphor-icons/react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useEffect, useState } from "react";

type Props = {
  rangoPrecio: {
    min: number;
    max: number;
  };
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const RangePriceFilter = ({
  rangoPrecio,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  // Inicializar con los valores actuales o los valores por defecto
  const [price, setPrice] = useState([
    filtrosActuales.precioMin || rangoPrecio.min,
    filtrosActuales.precioMax || rangoPrecio.max,
  ]);

  // Actualizar cuando cambien los rangos disponibles
  useEffect(() => {
    if (rangoPrecio) {
      setPrice([
        filtrosActuales.precioMin || rangoPrecio.min,
        filtrosActuales.precioMax || rangoPrecio.max,
      ]);
    }
  }, [rangoPrecio, filtrosActuales.precioMin, filtrosActuales.precioMax]);

  const handleApplyPriceRange = () => {
    setFiltros({
      precioMin: price[0],
      precioMax: price[1],
    });
  };

  return (
    <Disclosure
      as="div"
      defaultOpen={false}
      className="filter-price mt-8 border-b border-line pb-8"
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Precios</span>
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
      <DisclosurePanel>
        {isLoading ? (
          <SkeletonFilerLine />
        ) : (
          <>
            <Slider
              range
              value={[price[0], price[1]]}
              min={rangoPrecio.min}
              max={rangoPrecio.max}
              onChange={(value) => {
                setPrice(value as [number, number]);
              }}
              className="mt-5"
            />
            <div className="price-block mt-4 flex flex-wrap items-center justify-between">
              <div className="min flex items-center gap-1">
                <div>Min:</div>
                <div className="price-min">
                  <span>{priceFormat(price[0])}</span>
                </div>
              </div>
              <div className="min flex items-center gap-1">
                <div>Max:</div>
                <div className="price-max">
                  <span>{priceFormat(price[1])}</span>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-end">
              <button
                onClick={handleApplyPriceRange}
                className="mt-4 rounded-md bg-primary_sokso px-4 py-2 text-xs text-white"
              >
                Aplicar
              </button>
            </div>
          </>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default RangePriceFilter;
