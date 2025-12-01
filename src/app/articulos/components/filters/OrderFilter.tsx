import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Field,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CaretDown } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

// Opciones de ordenamiento adaptadas al nuevo formato de API
const options = [
  { id: 4, name: "Lo más nuevo", data: "Lo más nuevo", value: "nombreDesc" },
  {
    id: 2,
    name: "Precio Bajo a Alto",
    data: "Precio Bajo a Alto",
    value: "precioAsc",
  },
  {
    id: 1,
    name: "Precio Alto a Bajo",
    data: "Precio Alto a Bajo",
    value: "precioDesc",
  },
];
type Props = {
  isLoadingProductos: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const OrderFilter = ({
  isLoadingProductos,
  filtrosActuales,
  setFiltros,
}: Props) => {
  // Inicializar el estado selected basado en el ordenamiento actual
  const [selected, setSelected] = useState(() => {
    const currentOrder = filtrosActuales.ordenar;
    return (
      options.find((option) => option.value === currentOrder) || options[0]
    );
  });

  // Actualizar el estado selected cuando cambia filtrosActuales.ordenar
  useEffect(() => {
    const currentOrder = filtrosActuales.ordenar;
    const matchingOption = options.find(
      (option) => option.value === currentOrder
    );
    if (matchingOption && matchingOption.id !== selected.id) {
      setSelected(matchingOption);
    }
  }, [filtrosActuales.ordenar, selected.id]);

  const handleType = (option: {
    id: number;
    name: string;
    data: string;
    value: string;
  }) => {
    setSelected(option);

    setFiltros({ ordenar: option.value });
  };

  return (
    <>
      {isLoadingProductos ? (
        <div className="animate-pulse flex h-10 w-40 space-x-5 rounded-lg bg-secondary2/60" />
      ) : (
        <div className="relative">
          <Field>
            {/* <Label className="text-gray-700 block text-xs">Ordenar por</Label> */}
            <Listbox
              value={selected}
              onChange={handleType}
              name="select-filter"
            >
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg border border-primary_sokso bg-white py-2 pl-3 pr-8 text-left text-xs",
                  "border-gray-300 focus-visible:ring-purple-500 border focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75"
                )}
              >
                {selected.name}
                <CaretDown
                  className="text-gray-400 pointer-events-none absolute right-2.5 top-2.5"
                  aria-hidden="true"
                />
              </ListboxButton>
              <ListboxOptions
                className={clsx(
                  "absolute mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none",
                  "transition duration-100 ease-in"
                )}
              >
                {options.map((option) => (
                  <ListboxOption
                  
                    key={option.id}
                    data-order={option.data}
                    value={option}
                    className={clsx(
                      "relative cursor-pointer select-none py-2 pl-2 pr-4",
                      selected.id === option.id
                        ? "bg-primary_sokso bg-opacity-70 text-white"
                        : "text-gray-900 hover:bg-primary_sokso hover:text-white"
                    )}
                  >
                    <span
                      className={clsx(
                        "block truncate",
                        selected.id === option.id
                          ? "font-medium"
                          : "font-normal"
                      )}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {option.name}
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Listbox>
          </Field>
        </div>
      )}
    </>
  );
};

export default OrderFilter;
