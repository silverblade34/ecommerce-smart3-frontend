import SkeletonFilerLine from "@/components/common/skeleton/SkeletonFilerLine";
import SkeletonFilterItem from "@/components/common/skeleton/SkeletonFilterItem";
import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Check, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

type Props = {
  catalogos: {
    nIdCatalogo: number;
    sCodigoCatalogo: string;
    sNombreComercial: string;
    sDescripcion: string;
    sEstadoDescripcion: string;
    cantidadProductos: number;
    sDescripcionTipoCatalogo: string
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const CatalogosFilter = ({
  catalogos,
  isLoading,
  filtrosActuales,
  setFiltros,
}: Props) => {


  // const handleChange = (itemId: number, nomCatalogo:string) => {
  //   if (filtrosActuales.nIdCatalogo === itemId) {
  //     setFiltros({ nIdCatalogo: undefined, nomCatalogo: undefined });
  //   } else {
  //     setFiltros({ nIdCatalogo: itemId ,nomCatalogo : nomCatalogo  });
  //   }
  // };



  // return (
  //   <Disclosure
  //     as="div"
  //     defaultOpen={true}
  //     className="filter-color mt-8 border-b border-line pb-8"
  //   >
  //     <h3 className="-my-3 flow-root">
  //       <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
  //         <span className="heading6">Catalogos</span>
  //         <span className="ml-6 flex items-center">
  //           <Plus
  //             aria-hidden="true"
  //             className="h-5 w-5 group-data-[open]:hidden"
  //           />
  //           <Minus
  //             aria-hidden="true"
  //             className="h-5 w-5 [.group:not([data-open])_&]:hidden"
  //           />
  //         </span>
  //       </DisclosureButton>
  //     </h3>
  //     <DisclosurePanel className="list-color mt-4 flex max-h-32 flex-wrap items-center gap-3 gap-y-4 overflow-auto">
  //       {isLoading
  //         ? Array.from({ length: 7 }).map((_, index) => (
  //             <SkeletonFilterItem key={index} index={index} />
  //           ))
  //         : catalogos.map((estilo) => {
  //             const isActive =
  //               filtrosActuales.nIdCatalogo === estilo.nIdCatalogo;
  //             return (
  //               <button
  //                 key={estilo.nIdCatalogo}
  //                 className={`color-item flex items-center justify-center gap-2 rounded-full border border-line px-3 py-[5px] ${
  //                   isActive ? "active hover:border-primary_sokso hover:text-primary_sokso" : ""
  //                 }`}
  //                 onClick={() => handleChange(estilo.nIdCatalogo, estilo.sNombreComercial)}
  //               >
  //                 <div className="caption1 capitalize">
  //                   {estilo.sNombreComercial}
  //                 </div>
  //                 {isActive && <X className="text-secondary" />}
  //               </button>
  //             );
  //           })}
  //     </DisclosurePanel>
  //   </Disclosure>
  // );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estado para catalogos seleccionadas
  const [selectedCatalogs, setSelectedBrands] = useState<number[]>(() => {
    return Array.isArray(filtrosActuales.nIdCatalogo)
      ? filtrosActuales.nIdCatalogo
      : [];
  });

  // Búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar catalogos por término de búsqueda
  const filteredBrands = catalogos?.filter((catalogo) =>
    catalogo.sNombreComercial.toLowerCase().includes(searchTerm.toLowerCase())
  );


  // Actualizar cuando cambie el filtro actual
  useEffect(() => {
    if (Array.isArray(filtrosActuales.nIdCatalogo) && filtrosActuales.nIdCatalogo.length > 0) {
      setSelectedBrands(filtrosActuales.nIdCatalogo);
    } else {
      setSelectedBrands([]);
    }
  }, [filtrosActuales.nIdCatalogo]);

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

  // Manejar selección de catalogo
  const handleBrandToggle = (catalogoId: number, nomCatalogo: string) => {
    let newSelectedCatalogs;
    let newSelectedNames: string[];


    if (selectedCatalogs.includes(catalogoId)) {
      newSelectedCatalogs = selectedCatalogs.filter((id) => id !== catalogoId);
      newSelectedNames = (filtrosActuales.nomCatalogo || []).filter(
        (name) => name !== nomCatalogo
      );
    } else {
      newSelectedCatalogs = [...selectedCatalogs, catalogoId];
      newSelectedNames = [...(filtrosActuales.nomCatalogo || []), nomCatalogo];

    }

    setSelectedBrands(newSelectedCatalogs);

    if (newSelectedCatalogs.length === 0) {
      setFiltros({ nIdCatalogo: undefined, nomCatalogo: undefined });
    } else {
      setFiltros({
        nIdCatalogo: newSelectedCatalogs, nomCatalogo: newSelectedNames
      });
    }
  };

  // Limpiar todas las catalogos seleccionadas
  const clearAllBrands = () => {
    setSelectedBrands([]);
    setFiltros({ nIdCatalogo: undefined, nomCatalogo: undefined });
  };

  return (
    <Disclosure
      as="div"
      className="filter-color mt-8 border-b border-line pb-8"
      defaultOpen={selectedCatalogs.length > 0}
    >
      <h3 className="-my-3 flow-root">
        <DisclosureButton className="text-gray-400 hover:text-gray-500 group flex w-full items-center justify-between bg-white py-3 text-sm">
          <span className="heading6">Catálogos</span>
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
                  {selectedCatalogs.length > 0
                    ? `${selectedCatalogs.length} catalogo${selectedCatalogs.length > 1 ? "s" : ""
                    } seleccionada${selectedCatalogs.length > 1 ? "s" : ""}`
                    : "Seleccionar catalogos"}
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
                        placeholder="Buscar catalogo..."
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

                  {/* Lista de catalogos */}
                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredBrands?.length > 0 ? (
                      filteredBrands.map((catalogo) => (
                        <div
                          key={catalogo.nIdCatalogo}
                          className="flex items-center space-x-2 py-1 px-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => handleBrandToggle(catalogo.nIdCatalogo, catalogo.sNombreComercial)}
                        >
                          <div
                            className={`w-4 h-4 flex items-center justify-center rounded-sm border ${selectedCatalogs.includes(catalogo.nIdCatalogo)
                              ? "bg-primary_sokso border-primary_sokso"
                              : "border-gray-300"
                              }`}
                          >
                            {selectedCatalogs.includes(catalogo.nIdCatalogo) && (
                              <Check
                                size={12}
                                weight="bold"
                                className="text-white"
                              />
                            )}
                          </div>
                          <span className="text-sm">{catalogo.sNombreComercial}</span>
                          {/* <span className="text-xs text-gray-400 ml-auto">
                            ({catalogo.cantidad})
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

          </div>
        )}
      </DisclosurePanel>
    </Disclosure>
  );

};

export default CatalogosFilter;
