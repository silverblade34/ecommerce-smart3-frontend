import SkeletonFilterItem from "@/components/common/skeleton/SkeletonFilterItem";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus, X } from "@phosphor-icons/react";

type Props = {
  estilos: {
    nIdEstilo: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const EstiloFilter = ({
  estilos,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  const handleChange = (itemId: number, nomEstilo:string) => {
    if (filtrosActuales.nIdEstilo === itemId) {
      setFiltros({ nIdEstilo: undefined, nomEstilo:undefined });
    } else {
      setFiltros({ nIdEstilo: itemId, nomEstilo: nomEstilo });
    }
  };

  return (
    <Disclosure
      as="div"
      defaultOpen={false}
      className="filter-color mt-8 border-b border-line pb-8"
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Estilos</span>
          {/* <span className="text-gray-400">{cantidadEstilos}</span> */}
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
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
              <SkeletonFilterItem key={index} index={index} />
            ))
          : estilos?.map((estilo) => {
              const isActive = filtrosActuales.nIdEstilo === estilo.nIdEstilo;
              return (
                <button
                  key={estilo.nIdEstilo}
                  className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${
                    isActive ? "active hover:border-red hover:text-red" : ""
                  }`}
                  onClick={() => handleChange(estilo.nIdEstilo, estilo.sDescripcion)}
                >
                  <div className="caption1 capitalize">
                    {estilo.sDescripcion}
                  </div>
                  {isActive && <X className="text-secondary" />}
                </button>
              );
            })}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default EstiloFilter;
