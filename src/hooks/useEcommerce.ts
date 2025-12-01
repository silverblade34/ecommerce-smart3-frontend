

import { CatalogoFiltro, Producto, ProductosParams } from "@/lib/interfaces/articulo";
import {
  getEcommerceFiltersService,
  getEcommerceProductosService,
  getFiltrosCatalogs,
} from "@/server/actions/articulo";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { toast } from "react-toastify";

export interface EcommerceFilters {
  marcas: {
    nIdMarca: number;
    sNombreMarca: string;
    cantidad: number;
  }[];
  categorias: {
    nIdCategoria: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  generos: {
    nIdGenero: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  tipos: {
    nIdTipo: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  colores: {
    nIdColor: string;
    sDenominacion: string;
    sColorEcommerce: string;
    cantidad: number;
  }[];
  rangoPrecio: {
    min: number;
    max: number;
  };
  estilos: {
    nIdEstilo: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  tallas: {
    nIdTalla: number;
    sTalla: string;
    sDescripcion: string;
    cantidad: number;
  }[];
  tiposCatalogo: {
    nIdTipoCatalogo: number;
    sDescripcion: string;
    cantidad: number;
  }[];
  catalogos: {
    nIdCatalogo: number;
    nIdTipoCatalogo: number;
    sCodigoCatalogo: string;
    sNombreComercial: string;
    sDescripcion: string;
    sEstadoDescripcion: string;
    cantidadProductos: number;
    sDescripcionTipoCatalogo: string;
  }[];
  tipo_pedido: {
    nIdTipoCatalogo: number;
    sDescripcion: string;
  }[];
}

interface UseEcommerceReturn {
  productos: Producto[];
  filtrosDisponibles: EcommerceFilters | null;
  totalProductos: number;
  totalPaginas: number;
  paginaActual: number;
  isLoadingProductos: boolean;
  isLoadingFiltros: boolean;
  error: string | null;
  isNetworkError: boolean;

  // Filtros actuales

  filtrosActuales: ProductosParams;
  fetchProductos: (newFilters?: ProductosParams) => Promise<void>;
  fetchFiltrosDisponibles: () => Promise<void>;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  setPagina: (pagina: number) => void;
  resetFiltros: () => void;
  isScrolled: boolean;
  isScrolledPagination: boolean;
  headerRef: React.RefObject<HTMLDivElement>;
  paginationBotRef: React.RefObject<HTMLDivElement>;
  showFilters: boolean;
  mobileFiltersOpen: boolean;
  handleShowFilters: () => void;
  handleMobileFilters: () => void;
  filtrosCatalogs: CatalogoFiltro[]
  isLoadingFiltrosCatalogs: boolean
}

export function useEcommerce(): UseEcommerceReturn {
  const userActionRef = useRef(false);

  const [hasProcessedUrlParams, setHasProcessedUrlParams] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasUrlParams, setHasUrlParams] = useState(false);
  const pathname = usePathname();

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const toSlugBuscar = (text: string) =>
    text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")          // quitar acentos
      .replace(/ñ/g, "n")                        // reemplazar ñ
      .replace(/[^a-z0-9 -]+/g, "")             // permitir letras, números, espacios y guiones
      .trim()
      .replace(/\s+/g, "-")                   // reemplazar espacios por guiones
      .replace("_", " ");

  const fromSlug = (slug: string) =>
    slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());


  const fromSlugBuscar = (slug: string) =>
    slug
      .replace(/_/g, " ")             // Reemplaza _ por espacio
      .replace(/\b\w/g, (l) => l)

  // Estados para almacenar datos
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filtrosCatalogs, setFiltrosCatalogs] = useState<CatalogoFiltro[]>([]);
  const [filtrosDisponibles, setFiltrosDisponibles] = useState<EcommerceFilters | null>(null);
  const [totalProductos, setTotalProductos] = useState<number>(0);
  const [totalPaginas, setTotalPaginas] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const [isLoadingProductos, setIsLoadingProductos] = useState<boolean>(true);
  const [isLoadingFiltros, setIsLoadingFiltros] = useState<boolean>(true);
  const [isLoadingFiltrosCatalogs, setIsLoadingFiltrosCatalogs] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNetworkError, setIsNetworkError] = useState<boolean>(false);

  const [filtrosActuales, setFiltrosActuales] = useState<ProductosParams>(() => {
    if (typeof window === 'undefined') {
      return { page: 1 };
    }

    const savedPage = localStorage.getItem("ecommerceFilters");
    return {
      page: savedPage ? parseInt(savedPage) : 1
    };
  });

  // UI - Referencias para elementos DOM
  const headerRef = useRef<HTMLDivElement | null>(null);
  const paginationBotRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrolledPagination, setIsScrolledPagination] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtrosQueAfectanResultados = useMemo(() => {
    const { page, limit, orderBy, ...filtrosReales } = filtrosActuales;
    return filtrosReales;
  }, [filtrosActuales]);


  const mapItemByTipo = (tipo: string, item: any) => {

    switch (tipo) {
      case "marcas":
        return { id: item.nIdMarca, nombre: item.sNombreMarca };
      case "categorias":
        return { id: item.nIdCategoria, nombre: item.sDescripcion };
      case "generos":
        return { id: item.nIdGenero, nombre: item.sDescripcion };
      case "colores":
        return { id: item.nIdColor, nombre: item.sDenominacion };
      case "estilos":
        return { id: item.nIdEstilo, nombre: item.sDescripcion };
      case "tallas":
        return { id: item.nIdTalla, nombre: item.sDescripcion };
      case "catalogos":
        return { id: item.nIdCatalogo, nombre: item.sNombreComercial };
      case "tipos":
        return { id: item.nIdTipo, nombre: item.sDescripcion };
      case "precios":
        return { id: null, nombre: `${item.precioMin}-${item.precioMax}` };
      case "tipo_pedido":
        return { id: item.nIdTipoCatalogo, nombre: item.sDescripcion };
      default:
        return null;
    }
  };

  // LOAD INICIAL
  useEffect(() => {
    const loadInitialData = async () => {
      const pathSegments = pathname.split("/").filter(segment =>
        segment && segment !== "articulos"
      );
      const hasParams = pathSegments.length > 0;
      setHasUrlParams(hasParams);

      if (!isInitialLoad) return;
      try {
        if (hasParams) {
          const cached = localStorage.getItem(CACHE_KEY_FILTROS);
          const now = Date.now();
          if (cached) {
            const parsed = JSON.parse(cached);
            if (now - parsed.timestamp < CACHE_DURATION_FILTROS) {
              const filtrosCache = parsed.data.data;

              setFiltrosDisponibles(filtrosCache);
              setIsLoadingFiltros(false);
              const nuevosFiltros = parseUrlParamsToFiltersWithData(pathSegments, filtrosCache);

              if (Object.keys(nuevosFiltros).length > 0) {

                // console.log(nuevosFiltros)
                //validar cuando viene de home 
                setFiltrosActuales(prev => ({ ...prev, ...nuevosFiltros, page: 1 }));//validar para que se mantenga en la pagina o colocar el page en la ruta
              }
              setIsInitialLoad(false);
              setHasProcessedUrlParams(true);
              return;
            } else {
              await loadFiltrosAndProcessUrl(pathSegments);
            }
          } else {
            await loadFiltrosAndProcessUrl(pathSegments);
          }
        } else {
          await fetchProductos();
          setTimeout(() => fetchFiltrosDisponibles().catch(console.error), 500);
        }
      } catch (error) {
        await fetchProductos();
      } finally {
        setIsInitialLoad(false);
      }
    };

    const loadFiltrosAndProcessUrl = async (pathSegments: string[]) => {
      await fetchFiltrosDisponibles();

      await new Promise((resolve) => {
        const checkFiltros = () => {
          if (filtrosDisponibles) {
            resolve(true);
          } else {
            setTimeout(checkFiltros, 100);
          }
        };
        checkFiltros();
      });

      const nuevosFiltros = parseUrlParamsToFilters(pathSegments);
      if (Object.keys(nuevosFiltros).length > 0) {
        setFiltrosActuales(prev => ({ ...prev, ...nuevosFiltros }));
      }
      setHasProcessedUrlParams(true);
    };

    loadInitialData();
  }, [isInitialLoad, hasUrlParams, pathname]);


  //SEGMENTOS ACTUALIZACION DE URL
  useEffect(() => {
    // if (isInitialLoad || !hasProcessedUrlParams) {
    //   return;
    // }
    if (!userActionRef.current) {
      return;
    }
    // Resetear flag
    userActionRef.current = false;

    const segmentos: string[] = [];
    const tipos = [
      { clave: "marca", nombres: "nomMarca" },
      { clave: "color", nombres: "nomColor" },
      { clave: "genero", nombres: "nomGenero" },
      { clave: "categoria", nombres: "nomCategoria" },
      { clave: "tipo", nombres: "nomTipo" },
      { clave: "estilo", nombres: "nomEstilo" },
      { clave: "talla", nombres: "nomTalla" },
      { clave: "catalogo", nombres: "nomCatalogo" },
      { clave: "pedido", nombres: "nomTipoPedido" },
    ];
    if (filtrosActuales.buscar && filtrosActuales.buscar.trim() !== "") {
      segmentos.push("buscar", toSlugBuscar(filtrosActuales.buscar.trim()));
    }
    tipos.forEach(({ clave, nombres }) => {
      const nombresSel = filtrosActuales[nombres as keyof ProductosParams];
      if (Array.isArray(nombresSel) && nombresSel.length > 0) {
        const slugs = (nombresSel as string[]).map(toSlug).join(",");
        segmentos.push(clave, slugs);
      } else if (typeof nombresSel === "string" && nombresSel.trim() !== "") {
        segmentos.push(clave, toSlug(nombresSel));
      }
    });
    if (
      filtrosActuales.precioMin !== undefined ||
      filtrosActuales.precioMax !== undefined
    ) {
      segmentos.push("precio", `${filtrosActuales.precioMin ?? 0}-${filtrosActuales.precioMax ?? 0}`
      );
    }
    const newPath =
      segmentos.length > 0
        ? `/articulos/${segmentos.join("/")}`
        : "/articulos/";

    if (window.location.pathname !== newPath) {
      window.history.replaceState(null, "", newPath);
    }
  }, [filtrosActuales, isInitialLoad, hasProcessedUrlParams]);


  const parseUrlParamsToFilters = (pathSegments: string[]): Partial<ProductosParams> => {
    if (!filtrosDisponibles) {
      return {};
    }
    return parseUrlParamsToFiltersWithData(pathSegments, filtrosDisponibles);
  };

  const parseUrlParamsToFiltersWithData = (
    pathSegments: string[],
    filtrosData: EcommerceFilters
  ): Partial<ProductosParams> => {
    const nuevosFiltros: Partial<ProductosParams> = {};
    const tipos = [
      { clave: "marca", campoId: "nIdMarca", campoNombre: "nomMarca", tipoLista: "marcas" },
      { clave: "categoria", campoId: "nIdCategoria", campoNombre: "nomCategoria", tipoLista: "categorias" },
      { clave: "genero", campoId: "nIdGenero", campoNombre: "nomGenero", tipoLista: "generos" },
      { clave: "color", campoId: "colores", campoNombre: "nomColor", tipoLista: "colores" },
      { clave: "estilo", campoId: "nIdEstilo", campoNombre: "nomEstilo", tipoLista: "estilos" },
      { clave: "talla", campoId: "tallas", campoNombre: "nomTalla", tipoLista: "tallas" },
      { clave: "catalogo", campoId: "nIdCatalogo", campoNombre: "nomCatalogo", tipoLista: "catalogos" },
      { clave: "tipo", campoId: "nIdTipo", campoNombre: "nomTipo", tipoLista: "tipos" },
      { clave: "precio", campoId: "precio", campoNombre: "precio", tipoLista: "precios" },
      { clave: "buscar", campoId: "buscar", campoNombre: "buscar", tipoLista: null },
      { clave: "pedido", campoId: "nIdTipoCatalogo", campoNombre: "nomTipoPedido", tipoLista: "tipo_pedido" },
    ];

    for (let i = 0; i < pathSegments.length; i += 2) {

      const tipoClave = pathSegments[i];
      const valorSlug = pathSegments[i + 1];

      if (!tipoClave || !valorSlug) continue;

      if (tipoClave === "buscar") {
        const valor = fromSlugBuscar(valorSlug)?.trim();

        if (valor) {
          nuevosFiltros.buscar = valor;
        }
        continue;
      }

      const tipoConfig = tipos.find(t => t.clave === tipoClave);
      if (!tipoConfig) continue;


      if (tipoClave === "precio") {
        const [minStr, maxStr] = valorSlug.split("-");
        const precioMin = parseFloat(minStr);
        const precioMax = parseFloat(maxStr);
        if (!isNaN(precioMin) && !isNaN(precioMax)) {
          nuevosFiltros.precioMin = precioMin;
          nuevosFiltros.precioMax = precioMax;
        }
        continue;
      }

      const nombres = valorSlug.split(",").map(fromSlug);
      const ids: number[] = [];
      const nombresValidos: string[] = [];
      for (const nombre of nombres) {
        const id = getIdByNombreWithData(tipoConfig.tipoLista, nombre, filtrosData);

        if (id !== null) {
          ids.push(id);
          nombresValidos.push(nombre);
        }
      }
      if (ids.length > 0) {
        if (tipoConfig.campoId === "nIdTipoCatalogo") {
          nuevosFiltros[tipoConfig.campoId as keyof ProductosParams] = ids[0] as any;
          nuevosFiltros[tipoConfig.campoNombre as keyof ProductosParams] = nombresValidos[0] as any;
        } else {
          nuevosFiltros[tipoConfig.campoId as keyof ProductosParams] = ids as any;
          nuevosFiltros[tipoConfig.campoNombre as keyof ProductosParams] = nombresValidos as any;
        }
      }

    }
    // console.log(nuevosFiltros)
    return nuevosFiltros;
  };

  const getIdByNombreWithData = (
    tipo: string | null,
    nombre: string,
    filtrosData: EcommerceFilters
  ) => {
    if (!tipo) return null;

    const lista = (filtrosData as any)?.[tipo];
    if (!lista || !Array.isArray(lista)) {
      return null;
    }

    const normalizados = lista
      .map((item) => mapItemByTipo(tipo, item))
      .filter(Boolean) as { id: number; nombre: string }[];

    const item = normalizados.find(
      (f) => toSlug(f.nombre) === toSlug(nombre)
    );
    // console.log("item buscado", item)
    return item ? item.id : null;
  };

  useEffect(() => {
    const reprocessUrlIfNeeded = async () => {
      if (hasUrlParams && !hasProcessedUrlParams && filtrosDisponibles && isInitialLoad) {
        const pathSegments = pathname.split("/").filter(s => s && s !== "articulos");
        const nuevosFiltros = parseUrlParamsToFilters(pathSegments);

        if (Object.keys(nuevosFiltros).length > 0) {
          setFiltrosActuales(prev => ({ ...prev, ...nuevosFiltros }));
        }
        setHasProcessedUrlParams(true);
      }
    };
    reprocessUrlIfNeeded();
  }, [filtrosDisponibles, hasUrlParams, hasProcessedUrlParams, isInitialLoad, pathname]);

  useEffect(() => {
    const loadProductsWithFilters = async () => {
      if (hasProcessedUrlParams || !hasUrlParams) {
        const hasRealFilters = Object.keys(filtrosActuales).some(key =>
          !['page', 'limit', 'orderBy', 'ordenar'].includes(key)
        );
        const pathSegments = pathname.split("/").filter(segment =>
          segment && segment !== "articulos"
        );
        const hasParams = pathSegments.length > 0;

        if (!hasParams || (hasParams && hasRealFilters)) {
          await fetchProductos();
        }
      }
    };
    loadProductsWithFilters();
  }, [filtrosActuales, hasProcessedUrlParams, hasUrlParams]);



  const CACHE_KEY = "catalog-filter";
  const CACHE_DURATION_MS = 0.5 * 60 * 1000;
  useEffect(() => {
    const fetchCatalogos = async () => {
      const cached = localStorage.getItem(CACHE_KEY);
      const now = Date.now();
      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < CACHE_DURATION_MS) {
          setFiltrosCatalogs(parsed.data);
          setIsLoadingFiltrosCatalogs(false);
          return;
        }
      }
      try {
        const response = await getFiltrosCatalogs();
        if (response) {
          setFiltrosCatalogs(response);
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ data: response, timestamp: now })
          );
        } else {
          setFiltrosCatalogs([]);
        }
      } catch (err) {
        setFiltrosCatalogs([]);
      } finally {
        setIsLoadingFiltrosCatalogs(false);
      }
    };
    fetchCatalogos();
  }, []);


  const CACHE_KEY_FILTROS = "list-filter";
  const CACHE_DURATION_FILTROS = 60 * 60 * 1000;//60
  const fetchFiltrosDisponibles = useCallback(
    async (newFilters?: ProductosParams) => {

      const cached = localStorage.getItem(CACHE_KEY_FILTROS);
      const now = Date.now();
      if (cached) {
        const parsed = JSON.parse(cached);
        if (now - parsed.timestamp < CACHE_DURATION_FILTROS) {
          setFiltrosDisponibles(parsed.data.data);
          setIsLoadingFiltros(false);
          return;
        }
      }
      try {
        setIsLoadingFiltros(true);
        setError(null);
        setIsNetworkError(false);
        
        const nIdDirectoraStr = localStorage.getItem("nIdDirectora");
        const nIdDirectora = nIdDirectoraStr ? Number(nIdDirectoraStr) : null;

        const currentFilters = {
          ...filtrosQueAfectanResultados,
          ...(newFilters ? (() => {
            const { page, limit, orderBy, ordenar, ...filtrosRealesNuevos } = newFilters;
            return filtrosRealesNuevos;
          })() : {}),
          ...(nIdDirectora ? { nIdDirectora } : {}),
        };

        const response = await getEcommerceFiltersService(currentFilters);


        if (response.status === 200) {
          // console.log(response.data)
          setFiltrosDisponibles(response.data);
          localStorage.setItem(
            CACHE_KEY_FILTROS,
            JSON.stringify({ data: response, timestamp: now })
          );
        } else {
          setError(response.message);
        }
      } catch (err) {
        console.log(err)
        
        // Detectar error de red
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setIsNetworkError(true);
          setError("No hay conexión a internet");
        } else {
          setIsNetworkError(false);
          setError("No se pudieron cargar los filtros disponibles");
          toast.error("Error al cargar los filtros disponibles");
        }

        setError("eee");

      } finally {

        setIsLoadingFiltros(false);
      }
    },
    [filtrosActuales]
  );


  const fetchProductos = useCallback(
    async (newFilters?: ProductosParams) => {
      try {
        setIsLoadingProductos(true);
        setError(null);
        setIsNetworkError(false);
        
        const nIdDirectoraStr = localStorage.getItem("nIdDirectora");
        const nIdDirectora = nIdDirectoraStr ? Number(nIdDirectoraStr) : null;

        const currentFilters = {
          ...filtrosActuales,
          ...(newFilters || {}),
          ...(nIdDirectora ? { nIdDirectora } : {}),
        };
                          console.log("currentFilters", currentFilters)

        const response = await getEcommerceProductosService(currentFilters);

        if (response.status === 200) {
                  console.log("response PRODUCTO", response.data)

          setProductos(response.data);
          setTotalProductos(response.dataFilter.totalItems);
          setTotalPaginas(response.dataFilter.totalPages);
          setPaginaActual(response.dataFilter.currentPage);
        } else {
          setError(response.message);
          toast.error(response.message);
        }
      } catch (err) {
        console.error("Error obteniendo productos:", err);
        
        // Detectar error de red
        if (err instanceof TypeError && err.message.includes('fetch')) {
          setIsNetworkError(true);
          setError("No hay conexión a internet");
        } else {
          setIsNetworkError(false);
          setError("No se pudieron cargar los productos");
          toast.error("Error al cargar los productos");
        }
        setError("No se pudieron cargar los productos");
        toast.error("Error al cargar los productos");
      } finally {
        setIsLoadingProductos(false);
      }
    },
    [filtrosActuales]
  );


  const setFiltros = useCallback((newFilters: Partial<ProductosParams>) => {
    userActionRef.current = true;

    setFiltrosActuales((prev) => {
      const updatedFilters = {
        ...prev,
        ...newFilters,
        page: 1,
      };
      return updatedFilters;
    });
  }, []);


  const setPagina = useCallback((pagina: number) => {
    
    setFiltrosActuales((prev) => {
      const updatedFilters = {
        ...prev,
        page: pagina,
      };
      const page = pagina
      if (typeof window !== "undefined") {
        localStorage.setItem("ecommerceFilters", JSON.stringify(page));
      }
      return updatedFilters;
    });
  }, []);

  const resetFiltros = useCallback(() => {
    const defaultFilters = {
      page: 1,
      limit: 25,
    };

    const page = 1
    if (typeof window !== "undefined") {
      localStorage.setItem("ecommerceFilters", JSON.stringify(page));
      const path = `/articulos/`;
      window.history.replaceState(null, "", path);
    }

    setFiltrosActuales(defaultFilters);
  }, []);

  const handleShowFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleMobileFilters = useCallback(() => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  }, [mobileFiltersOpen]);

  // Efectos para scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPosition > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScrollPagination = () => {
      const scrollPosition = window.scrollY || document.documentElement.scrollTop;
      setIsScrolledPagination(
        scrollPosition > (paginationBotRef.current?.offsetTop || 0) - window.innerHeight
      );
    };
    window.addEventListener("scroll", handleScrollPagination);
    return () => window.removeEventListener("scroll", handleScrollPagination);
  }, []);


  // useEffect(() => {

  //   if (filtrosActuales.page === 1 && Object.keys(filtrosActuales).length > 2) {
 
  //     // Si no es la carga inicial, ejecutar secuencialmente
  //     const loadDataSequential = async () => {
  //       // 1. Productos primero
  //       await fetchProductos();
  //       // 2. Filtros después (solo si hay filtros reales)
  //       // const { page, limit, orderBy, ordenar, ...filtrosReales } =
  //       //   filtrosActuales;
  //       // const hayFiltrosReales = Object.keys(filtrosReales).length > 0;

  //       // if (hayFiltrosReales) {
  //       //   setTimeout(() => {
  //       //     fetchFiltrosDisponibles();
  //       //   }, 50);
  //       // }
  //     };
  //     loadDataSequential();
  //   } else {
  //     // Solo productos para cambios de página
  //     fetchProductos();
  //   }
  // }, [filtrosActuales]);

  return {
    productos,
    filtrosDisponibles,
    totalProductos,
    totalPaginas,
    paginaActual,
    isLoadingProductos,
    isLoadingFiltros,
    error,
    isNetworkError,

    // Filtros actuales

    filtrosActuales,
    fetchProductos,
    fetchFiltrosDisponibles,
    setFiltros,
    setPagina,
    resetFiltros,
    isScrolled,
    isScrolledPagination,
    headerRef,
    paginationBotRef,
    showFilters,
    mobileFiltersOpen,
    handleShowFilters,
    handleMobileFilters,
    filtrosCatalogs,
    isLoadingFiltrosCatalogs
  };
}