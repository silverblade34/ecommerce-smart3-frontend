import { CatalogoFiltro, ProductosParams } from "@/lib/interfaces/articulo";
import { EcommerceFilters } from "@/hooks/useEcommerce";
import { X } from "@phosphor-icons/react";
import { priceFormat } from "@/utils/priceFormat";
import { useRouter } from "next/navigation";
type Props = {
  filtrosActuales: ProductosParams;
  filtrosDisponibles: EcommerceFilters | null;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
  resetFiltros: () => void;
  filtrosCatalogs: CatalogoFiltro[] | []
};

const SelectedFilters = ({
  filtrosActuales,
  filtrosDisponibles,
  setFiltros,
  resetFiltros,
  filtrosCatalogs
}: Props) => {

  // Verificar si hay algún filtro seleccionado
  const hasFilters = () => {
    return (
      filtrosActuales.nIdCategoria !== undefined ||
      filtrosActuales.nIdMarca !== undefined ||
      filtrosActuales.nIdGenero !== undefined ||
      filtrosActuales.nIdTipo !== undefined ||
      (filtrosActuales.colores && filtrosActuales.colores.length > 0) ||
      filtrosActuales.precioMin !== undefined ||
      filtrosActuales.precioMax !== undefined ||
      filtrosActuales.nIdEstilo !== undefined ||
      filtrosActuales.tallas !== undefined ||
      filtrosActuales.nIdTipoCatalogo !== undefined ||
      filtrosActuales.nIdCatalogo !== undefined
    );
  };
  const router = useRouter();

  // Eliminar un filtro específico
  const removeFilter = (filterType: string, value?: string, valueMultiple?: number) => {
    switch (filterType) {
      case "categoria":
        setFiltros({ nIdCategoria: undefined , nomCategoria:undefined});
        break;
      case "marca":
        if (filtrosActuales.nomMarca && filtrosActuales.nIdMarca) {
          const newMarca = filtrosActuales?.nomMarca?.filter(
            (marcaId) => marcaId !== value
          );
          const newMarcaid = filtrosActuales.nIdMarca.filter((_, i) => i !== Number(valueMultiple));
          setFiltros({
            nIdMarca: newMarcaid,
            nomMarca: newMarca
          });
        }
        break;
      case "genero":
        setFiltros({ nIdGenero: undefined, nomGenero: undefined });
        break;
      case "tipo":
        setFiltros({ nIdTipo: undefined, nomTipo: undefined });
        break;
      case "color":
        if (filtrosActuales.nomColor && filtrosActuales.colores) {
          const newColores = filtrosActuales?.nomColor?.filter(
            (colorId) => colorId !== value
          );
          const newColoresid = filtrosActuales.colores.filter((_, i) => i !== Number(valueMultiple));
          setFiltros({
            colores: newColoresid,
            nomColor: newColores
          });
        }
        break;
      case "precio":
        setFiltros({ precioMin: undefined, precioMax: undefined });
        break;

      case "estilo":
        setFiltros({ nIdEstilo: undefined, nomEstilo: undefined });
        break;
      case "talla":
        if (filtrosActuales.nomTalla && filtrosActuales.tallas) {
          const newTallas = filtrosActuales?.nomTalla?.filter(
            (colorId) => colorId !== value
          );
          const newTallasid = filtrosActuales.tallas.filter((_, i) => i !== Number(valueMultiple));
          setFiltros({
            tallas: newTallasid,
            nomTalla: newTallas
          });
        }
        break;
      case "tipoCatalogo":
        setFiltros({ nIdTipoCatalogo: undefined });
        router.push("/articulos");
        break;
      case "catalogo":
        if (filtrosActuales.nomCatalogo && filtrosActuales.nIdCatalogo) {
          // const newMarca = filtrosActuales?.nomCatalogo?.filter(
          //   (marcaId) => marcaId !== value
          // );
          const newMarca = filtrosActuales.nomCatalogo.filter((_, i) => i !== Number(valueMultiple));

          const newMarcaid = filtrosActuales.nIdCatalogo.filter((_, i) => i !== Number(valueMultiple));
          setFiltros({
            nIdCatalogo: newMarcaid,
            nomCatalogo: newMarca
          });
        }
        break;
        // setFiltros({ nIdCatalogo: undefined, nomCatalogo: undefined });
        break;
      default:
        break;
    }
  };

  // Obtener el nombre de la categoría seleccionada
  const getCategoriaSeleccionada = () => {
    if (filtrosActuales.nIdCategoria) {
      return filtrosActuales?.nomCategoria || "";
    }
    return "";
  };

  // Obtener el nombre del catalogo seleccionada CYBER / PREVENTA
  const getTipoCatalogoSeleccionado = () => {
    if (filtrosActuales.nIdTipoCatalogo && filtrosCatalogs) {
      const tipoCatalogo = filtrosCatalogs.find(
        (cat) => cat.nIdTipoCatalogo === filtrosActuales.nIdTipoCatalogo
      );
      return tipoCatalogo?.sDescripcionTipoCatalogo || "";
    }
    return "";
  };

  // Obtener el nombre de la marca seleccionada
  const getMarcaSeleccionada = (): { id: number; nombre: string }[] => {
    if (Array.isArray(filtrosActuales.nomMarca)) {
      return filtrosActuales.nomMarca.map((color, index) => ({
        id: index,
        nombre: color ?? ""
      }));
    }
    return [];
  };

  // Obtener el nombre del género seleccionado
  const getGeneroSeleccionado = () => {
    if (filtrosActuales.nIdGenero) {
      return filtrosActuales?.nomGenero || "";
    }
    return "";
  };

  // Obtener el nombre del estilo seleccionado
  const getEstiloSeleccionado = () => {
    if (filtrosActuales.nIdEstilo) {
      return filtrosActuales?.nomEstilo || "";
    }
    return "";
  };

  // Obtener el nombre del tipo seleccionado
  const getTipoSeleccionado = () => {
    if (filtrosActuales.nIdTipo) {
      return filtrosActuales.nomTipo || "";
    }
    return "";
  };

  // Obtener los nombres de los colores seleccionados
  const getColoresSeleccionados = (): { id: number; nombre: string }[] => {
    if (Array.isArray(filtrosActuales.nomColor)) {
      return filtrosActuales.nomColor.map((color, index) => ({
        id: index,
        nombre: color ?? ""
      }));
    }
    return [];
  };

  // Obtener los nombres de las tallas seleccionadas
  const getTallasSeleccionadas = (): { id: number; nombre: string }[] => {
    if (Array.isArray(filtrosActuales.nomTalla)) {
      return filtrosActuales.nomTalla.map((color, index) => ({
        id: index,
        nombre: color ?? ""
      }));
    }
    return [];
  };

  // const getCatalogoSeleccionado = () => {
  //   if (filtrosActuales.nomCatalogo != undefined) {
  //     return filtrosActuales.nomCatalogo || "";
  //   }
  //   return "";
  // };


  const getCatalogoSeleccionado = (): { id: number; nombre: string }[] => {
    if (Array.isArray(filtrosActuales.nomCatalogo)) {
      return filtrosActuales.nomCatalogo.map((color, index) => ({
        id: index,
        nombre: color ?? ""
      }));
    }
    return [];
  };

  // Verificar si hay rangos de precio seleccionados
  const hasPriceFilter = () => {
    return (
      filtrosActuales.precioMin !== undefined ||
      filtrosActuales.precioMax !== undefined
    );
  };

  // Si no hay filtros seleccionados, no mostramos nada
  if (!hasFilters()) {
    return null;
  }

  return (
    <div className="p-1 my-1">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium">Filtros seleccionados</h3>
        {hasFilters() && (
          <button
            onClick={resetFiltros}
            className="text-xs text-primary_sokso flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Limpiar todos
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {/* Catalogo CYBER / PREVENTA */}
        {filtrosActuales.nIdTipoCatalogo && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">
              Tipo de catálogo: {getTipoCatalogoSeleccionado()}
            </span>
            <button
              className="ml-1"
              onClick={() => removeFilter("tipoCatalogo")}
              aria-label="Eliminar filtro de tipo de catálogo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Categoría */}
        {filtrosActuales.nIdCategoria && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">
              Categoría: {getCategoriaSeleccionada()}
            </span>
            <button
              className="ml-1"
              onClick={() => removeFilter("categoria")}
              aria-label="Eliminar filtro de categoría"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Marca */}
        {getMarcaSeleccionada().map((marca, index) => (
          <div
            key={index}
            className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1"
          >
            <span className="text-xs">Marca: {marca.nombre}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("marca", marca.nombre, Number(index))}
              aria-label={`Eliminar filtro de marca ${marca.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Género */}
        {filtrosActuales.nIdGenero && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">Género: {getGeneroSeleccionado()}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("genero")}
              aria-label="Eliminar filtro de género"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Estilo */}
        {filtrosActuales.nIdEstilo && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">Estilo: {getEstiloSeleccionado()}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("estilo")}
              aria-label="Eliminar filtro de estilo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Tipo */}
        {filtrosActuales.nIdTipo && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">Tipo: {getTipoSeleccionado()}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("tipo")}
              aria-label="Eliminar filtro de tipo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Catalogo */}
        {/* {filtrosActuales.nIdCatalogo && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">
              Catálogo: {getCatalogoSeleccionado()}
            </span>
            <button
              className="ml-1"
              onClick={() => removeFilter("catalogo")}
              aria-label="Eliminar filtro de catálogo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )} */}

        {getCatalogoSeleccionado().map((marca, index) => (
          <div
            key={index}
            className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1"
          >
            <span className="text-xs">Catalogo: {marca.nombre}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("catalogo", marca.nombre, Number(index))}
              aria-label={`Eliminar filtro de marca ${marca.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}


        {/* Colores */}
        {getColoresSeleccionados().map((color, index) => (
          <div
            key={index}
            className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1"
          >
            <span className="text-xs">Color: {color.nombre}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("color", color.nombre, Number(index))}
              aria-label={`Eliminar filtro de color ${color.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Tallas */}
        {getTallasSeleccionadas().map((talla, index) => (
          <div
            key={talla.id}
            className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1"
          >
            <span className="text-xs">Talla: {talla.nombre}</span>
            <button
              className="ml-1"
              onClick={() => removeFilter("talla", talla.nombre, Number(index))}
              aria-label={`Eliminar filtro de talla ${talla.nombre}`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {/* Rango de Precio */}
        {hasPriceFilter() && (
          <div className="flex items-center text-xs bg-primary_sokso/10 text-primary_sokso rounded-full px-3 py-1">
            <span className="text-xs">
              Precio:{" "}
              {filtrosActuales.precioMin !== undefined
                ? priceFormat(filtrosActuales.precioMin)
                : "Min"}
              {" - "}
              {filtrosActuales.precioMax !== undefined
                ? priceFormat(filtrosActuales.precioMax)
                : "Max"}
            </span>
            <button
              className="ml-1"
              onClick={() => removeFilter("precio")}
              aria-label="Eliminar filtro de precio"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedFilters;