"use client";
import SkeletonFilterItem from "@/components/common/skeleton/SkeletonFilterItem";
import { CatalogoFiltro, ProductosParams } from "@/lib/interfaces/articulo";
import { XCircle } from "@phosphor-icons/react";

type Props = {
  tiposCatalogo: {
    nIdCatalogo: number;
    sCodigoCatalogo: string;
    nIdTipoCatalogo: number;
    sNombreComercial: string;
    sDescripcion: string;
    sEstadoDescripcion: string;
    cantidadProductos: number;
    sDescripcionTipoCatalogo: string;
  }[];
  isLoading: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  filtrosCatalogs: CatalogoFiltro[];
};

const CatalogosTipoFilter = ({
  tiposCatalogo,
  isLoading,
  filtrosActuales,
  setFiltros,
  filtrosCatalogs,
}: Props) => {
  // 🔹 Manejar cambio de filtro
  // const handleChange = (item: {
  //     nIdTipoCatalogo: number;
  //     nIdCatalogo: number;
  //     sDescripcionTipoCatalogo: string;
  //     sCodigoCatalogo: string;
  //     sEstadoDescripcion?: string;
  //     dFechaInicio?: string;
  //   }) => {
  //     const tipo = item.sDescripcionTipoCatalogo?.toUpperCase() || "";
  //     const estado = item.sEstadoDescripcion?.toUpperCase() || "";
  //     const fechaFutura = item.dFechaInicio;

  //     const isActive =

  //       filtrosActuales.nIdTipoCatalogo === item.nIdTipoCatalogo &&
  //       (Array.isArray(filtrosActuales.nIdCatalogo)
  //         ? filtrosActuales.nIdCatalogo.includes(item.nIdCatalogo)
  //         : filtrosActuales.nIdCatalogo === item.nIdCatalogo);

  //     if (isActive) {
  //       // 🔸 Desactivar filtro
  //       setFiltros({ nIdTipoCatalogo: undefined, nIdCatalogo: undefined });
  //       localStorage.removeItem("catalogoActivo");
  //       localStorage.removeItem("catalogoFechaFutura");
  //     } else {
  //       // 🔸 Activar filtro
  //       const newFilters: Partial<ProductosParams> = {
  //         nIdTipoCatalogo: item.nIdTipoCatalogo,
  //         nIdCatalogo: [item.nIdCatalogo],
  //       };
  //       setFiltros(newFilters);

  //       // 🎃 Guardar en localStorage solo si es CYBER FUTURO
  //       if (tipo === "CYBER" && estado === "FUTURO" && fechaFutura) {
  //         localStorage.setItem("catalogoActivo", "CYBER HALLOWEEN");
  //         localStorage.setItem("catalogoFechaFutura", fechaFutura);
  //         console.log("🎃 catalogoActivo creado -> CYBER HALLOWEEN");
  //         console.log("🗓 Fecha futura guardada:", fechaFutura);
  //       } else {
  //         localStorage.removeItem("catalogoActivo");
  //         localStorage.removeItem("catalogoFechaFutura");
  //       }
  //     }
  //   };


  // const handleChange = (itemId: number) => {
  //   if (filtrosActuales.nIdTipoCatalogo === itemId) {
  //     setFiltros({ nIdTipoCatalogo: undefined });
  //   } else {
  //     setFiltros({ nIdTipoCatalogo: itemId });
  //   }
  // };

  const handleChange = (item: typeof tiposCatalogo[number]) => {
    const isActive = filtrosActuales.nIdTipoCatalogo === item.nIdTipoCatalogo;

    if (isActive) {
      // Deseleccionar → quitar de la URL
      setFiltros({
        nIdTipoCatalogo: undefined,
        nomTipoPedido: undefined,
      });
    } else {
      // Seleccionar → agregar a la URL
      setFiltros({
        nIdTipoCatalogo: item.nIdTipoCatalogo,
        nomTipoPedido: item.sDescripcionTipoCatalogo,
      });
    }
  };


  // 🔹 Filtrar tipos visibles (sin REGULAR)
  const tiposVisibles = tiposCatalogo.filter((item) => {
    const tipo = item.sDescripcionTipoCatalogo.toUpperCase();
    if (tipo === "REGULAR") return false;
    return [
      "CYBER",
      "PREVENTA",
      "PREMIOS",
      "GRATIS",
      "SHOWROOM",
      "PREVENTA CATALOGO",
    ].includes(tipo);
  });

  // 🔹 Nombre visible especial
  const getDisplayName = (item: typeof tiposCatalogo[number]) => {

    const tipo = item.sDescripcionTipoCatalogo?.toUpperCase() || "";
    const codigo = item.sCodigoCatalogo?.toUpperCase() || "";
    const estado = item.sEstadoDescripcion?.toUpperCase() || "";

    // 🎃 Caso especial: Cyber Halloween solo si está en estado FUTURO
    // if (codigo === "CYBVAR2025VR05" && tipo === "CYBER") return "CYBER XD";
    // if (codigo === "CYBVAR2025VR03" && tipo === "CYBER") return "CYBER HALLOWEEN";
    // if (codigo === "CYBVAR2025VR20" && tipo === "CYBER") return "CYBER ANIVERSARIO";
    // if (codigo === "CYBVAR2025VR21" && tipo === "CYBER") return "CYBER HALLOWEEN";
    // if (tipo === "CYBER") return "CYBER";
    if (tipo === "GRATIS") return "Catálogo Gratuito";
    if (tipo === "PREVENTA CATALOGO") return "Catálogos";

    return item.sDescripcionTipoCatalogo;
  };

  return (
    <div className="w-full">
      <div className="grid grid-flow-col auto-cols-max gap-2 px-2 py-1 min-w-full">
        {isLoading
          ? Array.from({ length: 7 }).map((_, index) => (
            <SkeletonFilterItem key={index} index={index} />
          ))
          : tiposVisibles.map((estilo) => {
            const tipo = estilo.sDescripcionTipoCatalogo.toUpperCase();
            const codigo = estilo.sCodigoCatalogo?.toUpperCase();
            const isSpecial = [
              "CYBER",
              "PREVENTA",
              "PREMIOS",
              "GRATIS",
              "SHOWROOM",
              "PREVENTA CATALOGO",
            ].includes(tipo);

            const isActive =
              filtrosActuales.nIdTipoCatalogo === estilo.nIdTipoCatalogo

            // (filtrosActuales.nIdTipoCatalogo === estilo.nIdTipoCatalogo &&
            // (Array.isArray(filtrosActuales.nIdCatalogo)
            //   ? filtrosActuales.nIdCatalogo.includes(estilo.nIdCatalogo)
            //   : filtrosActuales.nIdCatalogo === estilo.nIdCatalogo));

            const baseClasses =
              "relative flex items-center justify-center px-3 py-2 rounded-lg border-2 font-bold text-sm transition-all duration-300 ease-in-out whitespace-nowrap w-full";
            const specialClasses =
              "bg-gradient-to-r from-pink to-purple text-white hover:from-purple hover:to-pink hover:text-white";
            const activeClasses = "border-pink";
            const pulseClasses = "animate-pulse-strong";

            return (
              <button
                key={estilo.nIdCatalogo}
                onClick={() => handleChange(estilo)}
                className={`${baseClasses} ${isSpecial ? specialClasses : ""
                  } ${isActive ? activeClasses : ""} ${isSpecial ? pulseClasses : ""
                  }`}
              >
                <div className="flex items-center">
                  <span className="text-sm whitespace-nowrap">
                    ¡{getDisplayName(estilo)}!
                  </span>
                </div>
                {isActive && (
                  <XCircle size={16} weight="fill" className="ml-1" />
                )}
              </button>
            );
          })}
      </div>

      <style jsx>{`
        @keyframes pulse-strong {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0px rgba(255, 0, 255, 0.4);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 16px rgba(255, 0, 255, 0.7);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0px rgba(255, 0, 255, 0.4);
          }
        }
        .animate-pulse-strong {
          animation: pulse-strong 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default CatalogosTipoFilter;