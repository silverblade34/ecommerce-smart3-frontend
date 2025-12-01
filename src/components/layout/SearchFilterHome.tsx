import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  filtrosActuales: any;
};

const SearchFilterHome = ({ filtrosActuales }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(filtrosActuales.buscar || "");
  const toSlug = (text: string) => {
    return text
      .normalize("NFD")          
      .replace(/[\u0300-\u036f]/g, "") 
      .replace(/ñ/g, "n")
      .replace(/[^a-zA-Z0-9 ]/g, "") 
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");    
  };

const navegarConBusqueda = () => {
  const value = searchTerm.trim();

  const slug = toSlug(value);

  // 1️⃣ Si está vacío --> regresar a /articulos SIN búsqueda
  if (slug === "") {
    router.push("/articulos");
    return;
  }

  // 2️⃣ Siempre construir la ruta base a partir de /articulos
  let basePath = pathname;

  // Si NO estás dentro de /articulos, forzar base
  if (!basePath.startsWith("/articulos")) {
    basePath = "/articulos";
  }

  // 3️⃣ Eliminar cualquier búsqueda existente en la URL
  basePath = basePath.replace(/\/buscar\/[^/]+/, "");

  // 4️⃣ Agregar nueva búsqueda
  const newPath = `${basePath}/buscar/${slug}`;

  router.push(newPath);
};

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navegarConBusqueda();
  };

  const clearSearch = () => {
    setSearchTerm("");

    if (pathname === "/" || pathname === "") return;

    if (!pathname.includes("/buscar/")) return;

    const cleanedPath = pathname.replace(/\/buscar\/[^/]+/, "");
    router.push(cleanedPath || "/articulos");
  };

  useEffect(() => {
    setSearchTerm(filtrosActuales.buscar || "");
  }, [filtrosActuales.buscar]);

  return (
    <div className="search-filter relative">
      <div className="flex h-10 items-center overflow-hidden rounded-lg border-2 border-primary_sokso">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos..."
          className="h-full w-full px-4 text-sm focus:outline-none"
        />

        <div className="border-l border-primary_sokso px-3">
          {searchTerm ? (
            <button type="button" onClick={clearSearch}>
              <X size={18} />
            </button>
          ) : (
            <button type="button" onClick={navegarConBusqueda}>
              <MagnifyingGlass size={24} color="#8331A7" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterHome;
