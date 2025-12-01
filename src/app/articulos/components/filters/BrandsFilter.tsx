import SkeletonFilerLine from "@/components/common/skeleton/SkeletonFilerLine";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Check, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  marcas: {
    nIdMarca: number;
    sNombreMarca: string;
    cantidad: number;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const BrandsFilter = ({
  marcas,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);




  // Estado para marcas seleccionadas
  const [selectedBrands, setSelectedBrands] = useState<number[]>(() => {
    return Array.isArray(filtrosActuales.nIdMarca)
      ? filtrosActuales.nIdMarca
      : [];
  });

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar marcas por término de búsqueda
  const filteredBrands = marcas?.filter((marca) =>
    marca.sNombreMarca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actualizar cuando cambie el filtro actual
  useEffect(() => {
    if (Array.isArray(filtrosActuales.nIdMarca) && filtrosActuales.nIdMarca.length > 0) {
      setSelectedBrands(filtrosActuales.nIdMarca);
    } else {
      setSelectedBrands([]);
    }
  }, [filtrosActuales.nIdMarca]);

  // Cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Manejar selección de marca
  const handleBrandToggle = (marcaId: number, nomMarca: string) => {
    let newSelectedBrands;
    let newSelectedNames: string[];


    if (selectedBrands.includes(marcaId)) {
      newSelectedBrands = selectedBrands.filter((id) => id !== marcaId);
      newSelectedNames = (filtrosActuales.nomMarca || []).filter(
        (name) => name !== nomMarca
      );
    } else {
      newSelectedBrands = [...selectedBrands, marcaId];
      newSelectedNames = [...(filtrosActuales.nomMarca || []), nomMarca];

    }

    setSelectedBrands(newSelectedBrands);

    if (newSelectedBrands.length === 0) {
      setFiltros({ nIdMarca: undefined, nomMarca: undefined });
    } else {
      setFiltros({
        // nIdMarca: newSelectedBrands,
        // nomMarca: newSelectedBrands
        //   .map(id => marcas.find(m => m.nIdMarca === id)?.sNombreMarca || "")
      nIdMarca: newSelectedBrands, nomMarca: newSelectedNames  
      });
    }
  };

  // Limpiar todas las marcas seleccionadas
  const clearAllBrands = () => {
    setSelectedBrands([]);
    setFiltros({ nIdMarca: undefined, nomMarca: undefined });
  };


//     useEffect(() => {
//   console.log("marcas", marcas);
//   console.log("selectedBrands", selectedBrands);
// }, [marcas, selectedBrands]);


  return (
    <Disclosure
      as="div"
      className="filter-color mt-8 border-b border-line pb-8"
      defaultOpen={selectedBrands.length > 0}
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Marcas</span>
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
      <DisclosurePanel className="mt-4">
        {isLoading ? (
          <SkeletonFilerLine />
        ) : (
          <div className="w-full">
            <div className="relative" ref={dropdownRef}>
              {/* Botón para abrir el dropdown */}
              <button
                type="button"
                className="w-full flex items-center justify-between border border-line rounded-lg py-2 px-3 text-sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span>
                  {selectedBrands.length > 0
                    ? `${selectedBrands.length} marca${selectedBrands.length > 1 ? "s" : ""
                    } seleccionada${selectedBrands.length > 1 ? "s" : ""}`
                    : "Seleccionar marcas"}
                </span>
                <Plus
                  size={16}
                  className={`transition-transform ${isOpen ? "rotate-45" : ""
                    }`}
                />
              </button>

              {/* Dropdown */}
              {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md border border-line bg-white shadow-lg">
                  {/* Búsqueda */}
                  <div className="p-2 border-b border-line">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar marca..."
                        className="w-full border border-line rounded-md py-1 pl-8 pr-2 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <MagnifyingGlass
                        size={16}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  {/* Lista de marcas */}
                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredBrands?.length > 0 ? (
                      filteredBrands.map((marca) => (
                        <div
                          key={marca.nIdMarca}
                          className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleBrandToggle(marca.nIdMarca, marca.sNombreMarca)}
                        >
                          <div
                            className={`w-4 h-4 flex items-center justify-center rounded-sm border ${selectedBrands.includes(marca.nIdMarca)
                              ? "bg-primary_sokso border-primary_sokso"
                              : "border-gray-300"
                              }`}
                          >
                            {selectedBrands.includes(marca.nIdMarca) && (
                              <Check
                                size={12}
                                weight="bold"
                                className="text-white"
                              />
                            )}
                          </div>
                          <span className="text-sm">{marca.sNombreMarca}</span>
                          {/* <span className="text-xs text-gray-400 ml-auto">
                            ({marca.cantidad})
                          </span> */}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-3 text-center text-sm text-gray-500">
                        No se encontraron resultados
                      </div>
                    )}
                  </div>

                  {/* Botones de acción */}
                  {filteredBrands?.length > 0 && (
                    <div className="border-t border-line p-2 flex justify-between">
                      <button
                        type="button"
                        className="text-xs text-gray-500"
                        onClick={clearAllBrands}
                      >
                        Limpiar selección
                      </button>
                      <button
                        type="button"
                        className="text-xs text-primary_sokso font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Chips de marcas seleccionadas */}
            {/* {selectedBrands.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedBrands.map((id) => {
                  const marca = marcas?.find((m) => m.nIdMarca === id);
                  if (!marca) return null;

                  return (
                    <div
                      key={id}
                      className="flex items-center space-x-1 bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1"
                    >
                      <span className="text-xs">{marca.sNombreMarca}</span>
                      <button
                        type="button"
                        onClick={() => handleBrandToggle(id, "")}
                        className="text-primary_sokso"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )} */}
          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default BrandsFilter;
