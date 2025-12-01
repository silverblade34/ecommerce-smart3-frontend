import { ProductosParams } from "@/lib/interfaces/articulo";
import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type Props = {
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  isLoadingProductos: boolean;
};

const SearchFilter = ({
  filtrosActuales,
  setFiltros,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState(filtrosActuales.buscar || "");

  // Callback con debounce para actualizar filtros
  const debouncedSetFiltros = useDebouncedCallback((value: string) => {
    if (value === "") {
      setFiltros({ buscar: undefined });
    } else if (value !== filtrosActuales.buscar) {
      setFiltros({ buscar: value });
    }
  }, 1000);

  // Actualiza el filtro con debounce mientras el usuario escribe
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetFiltros(value);
  };

  useEffect(() => {
    const inputIsFocused = document.activeElement?.tagName === "INPUT";
    if (!inputIsFocused) {
      setSearchTerm(filtrosActuales.buscar || "");
    }
  }, [filtrosActuales.buscar]);

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setFiltros({ buscar: undefined });
  };

  return (
    <div className="search-filter relative">
      <div className="flex h-10 items-center overflow-hidden rounded-lg border-2 border-primary_sokso">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="h-full w-full px-4 text-sm focus:outline-none"
        />
        <div className="border-l border-primary_sokso px-3">
          {searchTerm ? (
            <button
              type="button"
              onClick={clearSearch}
              className="flex h-full items-center text-secondary2 hover:text-primary_sokso"
              aria-label="Limpiar búsqueda"
            >
              <X size={18} weight="bold" />
            </button>
          ) : (
            <span className="flex h-full items-center text-secondary2">
              <MagnifyingGlass size={24} color="#8331A7"  />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
