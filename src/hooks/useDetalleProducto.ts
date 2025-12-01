import { Articulo, DetalleProducto } from "@/lib/interfaces/articulo";
import { getDetalleProductoService, getProductosRecomendadosService, getStockTallas } from "@/server/actions/articulo";
import { useCallback, useEffect, useState } from "react";
import useStockStore from "@/context/stock/stock-store";

interface UseDetalleProductoReturn {
  // Datos
  producto: DetalleProducto | null;
  recomendaciones: Articulo[] | null;
  isLoadingRecomendaciones: boolean
  // Estados
  isLoading: boolean;
  error: string | null;

  // Métodos
  fetchProducto: (
    nIdArticulo: string,
    nIdColor: string,
    sCodigoCatalogo: string
  ) => Promise<void>;

  // Estado de selección
  tallaSeleccionada: number | null;
  setTallaSeleccionada: (tallaId: number | null) => void;

  // Métodos de utilidad
  getTallaDisponible: (nIdTalla: number) => boolean;
  getColorUrl: (nIdColor: string) => string | undefined;

  // Estado del modal
  modal: boolean;
  handleModal: () => void;

  modalOferta: boolean;
  handleModalOferta: () => void;
}

export function useDetalleProducto(
  initialNIdArticulo?: string,
  initialNIdColor?: string,
  initialSCodigoCatalogo?: string
): UseDetalleProductoReturn {
  // Estados para el producto
  const { setStockTallas } = useStockStore();
  const [producto, setProducto] = useState<DetalleProducto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [modalOferta, setModalOferta] = useState(false);
  const [recomendaciones, setRecomendaciones] = useState<Articulo[] | null>(null);
  const [isLoadingRecomendaciones, setIsLoadingRecomendaciones] = useState<boolean>(false);

  // Estado para la talla seleccionada
  const [tallaSeleccionada, setTallaSeleccionada] = useState<number | null>(
    null
  );


  //  const fetchRecomendaciones = async (productoData: DetalleProducto) => {
  //   setIsLoadingRecomendaciones(true);
  //   try {
  //     const nIdDirectora = localStorage.getItem("nIdDirectora");
  //     const response = await getProductosRecomendadosService(
  //       productoData.modelo.nIdModelo,
  //       productoData.colorSeleccionado.nIdColor,
  //       productoData.catalogo?.sCodigoCatalogo || '',
  //       nIdDirectora ? Number(nIdDirectora) : 0
  //     );
  //     if (response.status === 200) {
  //       setRecomendaciones(response.data);
  //     }
  //   } catch (err) {
  //     console.error("Error obteniendo recomendaciones:", err);
  //   } finally {
  //     setIsLoadingRecomendaciones(false);
  //   }
  // };

  // // Obtener el detalle del producto
  // const fetchProducto = useCallback(
  //   async (nIdArticulo: string, nIdColor: string, sCodigoCatalogo: string) => {
  //     try {
  //       setIsLoading(true);
  //       setError(null);
  //       const nIdDirectora = localStorage.getItem("nIdDirectora");
  //       const response = await getDetalleProductoService(
  //         nIdArticulo,
  //         nIdColor,
  //         sCodigoCatalogo,
  //         Number(nIdDirectora)
  //       );
  //       if (response.status === 200 && response.data) {
  //         setProducto(response.data);
  //         setTimeout(() => {
  //           fetchRecomendaciones(response.data);
  //         }, 100);
  //         // Si hay tallas disponibles, seleccionar la primera por defecto
  // if (response.data.tallas && response.data.tallas.length > 0) {
  //   const primeraTallaDisponible = response.data.tallas.find(
  //     (talla) => talla.disponible
  //   );
  //   if (primeraTallaDisponible) {
  //     setTallaSeleccionada(primeraTallaDisponible.nIdTalla);
  //   } else {
  //     setTallaSeleccionada(response.data.tallas[0].nIdTalla);
  //   }
  // }
  // if (response.data.alternativeInfo) {
  //   setModal(true);
  // }
  // if (response.data.proximaOferta) {
  //   setModalOferta(true);
  // }
  //       } else {
  //         setError(response.message);
  //         toast.error(response.message);
  //       }
  //     } catch (err) {
  //       console.error("Error obteniendo detalle del producto:", err);
  //       setError("No se pudo cargar el detalle del producto");
  //       toast.error("Error al cargar el detalle del producto");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   []
  // );


  // Verificar si una talla está disponible

  const fetchRecomendaciones = async (
    nIdArticulo: string,
    nIdColor: string,
    sCodigoCatalogo: string,
    nIdDirectora?: number
  ) => {
    try {
      const response = await getProductosRecomendadosService(
        Number(nIdArticulo), // Asumo que nIdModelo es igual a nIdArticulo
        nIdColor,
        sCodigoCatalogo,
        nIdDirectora ?? 0
      );
      if (response.status === 200) {
        setRecomendaciones(response.data);
      }
    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
      setRecomendaciones([]);
    }
  };

  // Función principal
  const fetchProducto = useCallback(async (
    nIdArticulo: string,
    nIdColor: string,
    sCodigoCatalogo: string
  ) => {
    try {
      setIsLoading(true);
      const nIdDirectora = Number(localStorage.getItem("nIdDirectora") || 0);
      const response = await getDetalleProductoService(
        nIdArticulo,
        nIdColor,
        sCodigoCatalogo,
        nIdDirectora
      );

      if (response.status === 200 && response.data) {
        setProducto(response.data);

        useStockStore.getState().setStockInfo({
          nIdArticulo: Number(response.data.nIdArticulo),
          nIdColor: response.data.colorSeleccionado.nIdColor,
          nIdListaPrecio: response.data.nIdListaPrecio,
        });

        // const stock = await getStockTallas(
        //   Number(response.data.nIdArticulo),
        //   String(nIdColor),
        //   response.data.nIdListaPrecio ?? 0
        // );
        // if (Array.isArray(stock)) {
        //   setStockTallas(stock);
        // }
        // if (response.data.tallas && response.data.tallas.length > 0) {
        //   const primeraTallaDisponible = response.data.tallas.find(
        //     (talla) => talla.disponible
        //   );
        //   console.log()
        //   if (primeraTallaDisponible) {
        //     console.log("primeraTallaDisponible", primeraTallaDisponible)
        //     setTallaSeleccionada(primeraTallaDisponible.nIdTalla);
        //   } else {
        //     setTallaSeleccionada(response.data.tallas[0].nIdTalla);
        //   }
        // }
        if (response.data.alternativeInfo) {
          setModal(true);
        }
        if (response.data.proximaOferta) {
          setModalOferta(true);
        }


        getStockTallasRes(
          Number(response?.data?.nIdArticulo ?? 0),
          response?.data?.colorSeleccionado?.nIdColor ?? "",
          Number(response?.data?.nIdListaPrecio ?? 0)
        );


        // setTimeout(() => {
        //   fetchRecomendaciones(
        //     nIdArticulo,
        //     nIdColor,
        //     sCodigoCatalogo,
        //     nIdDirectora !== 0 ? nIdDirectora : undefined
        //   );
        // }, 100);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);


  const getStockTallasRes = async (
    nIdArticulo: number,
    nIdColor: string,
    nIdListaPrecio: number,

  ) => {
    try {
      const stock = await getStockTallas(
        Number(nIdArticulo),
        nIdColor,
        Number(nIdListaPrecio)
      );
      if (Array.isArray(stock)) {
        setStockTallas(stock);
        if (stock) {
          const primeraTallaDisponible = stock?.find(
            (talla) => talla.disponible
          );
          console.log()
          if (primeraTallaDisponible) {
            setTallaSeleccionada(primeraTallaDisponible.nIdTalla);
          } else {
            setTallaSeleccionada(stock[0].nIdTalla);
          }
        }
      }


    } catch (error) {
      console.error("Error cargando recomendaciones:", error);
    }
  };


  const getTallaDisponible = useCallback(
    (nIdTalla: number) => {
      if (!producto) return false;
      const talla = producto.tallas.find((t) => t.nIdTalla === nIdTalla);
      return talla ? talla.disponible : false;
    },
    [producto]
  );

  // Obtener la URL para un color específico
  const getColorUrl = useCallback(
    (nIdColor: string) => {
      if (!producto) return undefined;
      const color = producto.coloresDisponibles.find(
        (c) => c.nIdColor === nIdColor
      );
      if (color && producto.catalogo) {
        return `/articulos/detalle/${producto.nIdArticulo}/${producto.catalogo.sCodigoCatalogo}/${color.nIdColor}`;
      }
      return undefined;
    },
    [producto]
  );

  // Cargar el producto inicial si se proporcionan los parámetros
  useEffect(() => {
    if (initialNIdArticulo && initialNIdColor && initialSCodigoCatalogo) {
      fetchProducto(
        initialNIdArticulo,
        initialNIdColor,
        initialSCodigoCatalogo
      );
    }
  }, [
    initialNIdArticulo,
    initialNIdColor,
    initialSCodigoCatalogo,
    fetchProducto,
  ]);

  const handleModal = () => {
    setModal(!modal);
  };

  const handleModalOferta = () => {
    setModalOferta(!modalOferta);
  };

  return {
    // Datos
    producto,
    recomendaciones,
    isLoadingRecomendaciones,
    // Estados
    isLoading,
    error,

    // Métodos
    fetchProducto,

    // Estado de selección
    tallaSeleccionada,
    setTallaSeleccionada,

    // Métodos de utilidad
    getTallaDisponible,
    getColorUrl,

    // Estado del modal
    modal,
    handleModal,

    modalOferta,
    handleModalOferta,


  };
}
