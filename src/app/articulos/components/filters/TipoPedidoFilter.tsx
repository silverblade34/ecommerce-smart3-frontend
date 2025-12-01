import SkeletonFilterItem from "@/components/common/skeleton/SkeletonFilterItem";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Minus, Plus, X } from "@phosphor-icons/react";

type Props = {
  tipo: {
    nIdTipoCatalogo: number;
    sDescripcion: string;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const GenderFilter = ({
  tipo,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {
  const handleGenderChange = (idpedido: number, nomPedido:string) => {
    if (filtrosActuales.nIdTipoPedido === idpedido) {
      // Si ya está seleccionado, lo deseleccionamos
      setFiltros({ nIdTipoPedido: undefined , nomTipoPedido:undefined});
    } else {
      // Si no está seleccionado, lo seleccionamos
      setFiltros({ nIdTipoPedido: idpedido, nomTipoPedido: nomPedido });
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
          <span className="heading6">Tipo Pedido</span>
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
          : tipo?.map((tipo) => {
              const isActive = filtrosActuales.nIdTipoPedido === tipo.nIdTipoCatalogo;
              return (
                <button
                  key={tipo.nIdTipoCatalogo}
                  className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${
                    isActive ? "active hover:border-red hover:text-red" : ""
                  }`}
                  onClick={() => handleGenderChange(tipo.nIdTipoCatalogo, tipo.sDescripcion)}
                >
                  <div className="caption1 capitalize">
                    {tipo.sDescripcion}
                  </div>
                  {isActive && <X className="text-secondary" />}
                </button>
              );
            })}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default GenderFilter;
