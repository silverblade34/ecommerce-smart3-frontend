import { ProductosParams } from "@/lib/interfaces/articulo";
import {
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CaretDown } from "@phosphor-icons/react";
import clsx from "clsx";
import { useEffect, useState } from "react";

const options = [
  { id: 1, name: "25", data: "25" },
  { id: 2, name: "50", data: "50" },
  { id: 3, name: "100", data: "100" },
];

type Props = {
  isLoadingProductos: boolean;
  filtrosActuales: ProductosParams;
  setFiltros: (newFilters: Partial<ProductosParams>) => void;
};

const LimitPageFilter = ({
  isLoadingProductos,
  filtrosActuales,
  setFiltros,
}: Props) => {
  // Inicializar el estado selected basado en el limit actual
  const [selected, setSelected] = useState(() => {
    const currentLimit = filtrosActuales.limit?.toString() || "25";
    return options.find((option) => option.data === currentLimit) || options[0];
  });

  // Actualizar el estado selected cuando cambia filtrosActuales.limit
  useEffect(() => {
    const currentLimit = filtrosActuales.limit?.toString() || "25";
    const matchingOption = options.find(
      (option) => option.data === currentLimit
    );
    if (matchingOption && matchingOption.id !== selected.id) {
      setSelected(matchingOption);
    }
  }, [filtrosActuales.limit, selected.id]);

  const handleType = (option: { id: number; name: string; data: string }) => {
    setFiltros({ limit: parseInt(option.data) });
    setSelected(option);
    // Enviar evento de analytics
  };

  return (
    <>
      {isLoadingProductos ? (
        <div className="animate-pulse flex h-10 w-40 space-x-5 rounded-lg bg-secondary2/60" />
      ) : (
        <div className="relative">
          <Field>
            <Label className="text-gray-700 block text-xs">
              Mostrar por página
            </Label>
            <Listbox
              value={selected}
              onChange={handleType}
              name="select-filter"
            >
              <ListboxButton
                className={clsx(
                  "relative block w-full rounded-lg border border-line bg-white py-2 pl-3 pr-8 text-left text-sm",
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
                      "relative cursor-pointer select-none py-2 pl-10 pr-4",
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

export default LimitPageFilter;
