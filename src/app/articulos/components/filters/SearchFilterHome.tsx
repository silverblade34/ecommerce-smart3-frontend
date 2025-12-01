
"use client";

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

  const useDebounce = (value: string, delay: number = 800) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => clearTimeout(handler);
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearch = useDebounce(searchTerm, 800);

  // const toSlug = (text: string) => {
  //   return text
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .replace(/ñ/g, "n")
  //     .replace(/[^a-zA-Z0-9 ]/g, "")
  //     .trim()
  //     .toLowerCase()
  //     .replace(/\s+/g, "-");
  // };

  const toSlug = (text: string) => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/ñ/g, "n")              
    .replace(/[^a-zA-Z0-9 -]/g, "") 
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");          
};

  // const navegarConBusqueda = (value?: string) => {
  //   const text = (value ?? searchTerm).trim();

  //   if (text === "" && (pathname === "/" || pathname === "/articulos")) {
  //     return;
  //   } 

  //   const slug = toSlug(text);

  //   if (slug === "") {
  //     router.push("/articulos");
  //     return;
  //   }

  //   let basePath = pathname;

  //   if (!basePath.startsWith("/articulos")) {
  //     basePath = "/articulos";
  //   }

  //   basePath = basePath.replace(/\/buscar\/[^/]+/, "");
  //   const newPath = `${basePath}/buscar/${slug}`;

  //   router.push(newPath);
  // };



  const navegarConBusqueda = (value?: string) => {
    const valor = (value ?? searchTerm).trim();
  const slug = toSlug(valor);

  if (slug === "") {
    router.push("/articulos");
    return;
  }

  let segments = pathname.split("/").filter(Boolean);

  if (segments[0] !== "articulos") {
    segments = ["articulos"];
  }

  const detalleIndex = segments.indexOf("detalle");
  if (detalleIndex !== -1) {
    segments = segments.slice(0, detalleIndex);
  }

  const buscarIndex = segments.indexOf("buscar");
  if (buscarIndex !== -1) {
    segments = segments.slice(0, buscarIndex);
  }

  let basePath = "/" + segments.join("/");

  const newPath = `${basePath}/buscar/${slug}`;

  router.push(newPath);
};


useEffect(() => {
  if (debouncedSearch === filtrosActuales.buscar) return;
  
  if (debouncedSearch.trim() === "") return;

  navegarConBusqueda(debouncedSearch);
}, [debouncedSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") navegarConBusqueda();
  };

  // const clearSearch = () => {
  //   setSearchTerm("");

  //   if (pathname === "/" || pathname === "") return;

  //   if (!pathname.includes("/buscar/")) return;

  //   const cleanedPath = pathname.replace(/\/buscar\/[^/]+/, "");
  //   console.log(cleanedPath)
  //   router.replace(cleanedPath || "/articulos");
  // };


  const clearSearch = () => {
  setSearchTerm("");

  const segments = pathname.split("/").filter(Boolean);

  const buscarIndex = segments.indexOf("buscar");
  if (buscarIndex !== -1) {

    segments.splice(buscarIndex, 2);
  }

  const cleanedPath = "/" + segments.join("/");

  router.replace(cleanedPath || "/articulos");
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
            <button type="button" onClick={() => navegarConBusqueda()}>
              <MagnifyingGlass size={24} color="#8331A7" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilterHome;
