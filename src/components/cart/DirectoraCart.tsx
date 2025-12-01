import useEstrellaStore from "@/context/orders/start-store";
import { useEstrellasCart } from "@/hooks/carrito/useEstrellasCart";
import { ClientCartTable, ClientTableResponse } from "@/lib/interfaces/clientes";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { CaretDown, Check, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface DirectoraCartProps {
  selectedStar: ClientCartTable | null;
  onStarSelected: (star: ClientCartTable | null) => void;
  estrellas: ClientCartTable[];
  loading: boolean;
}

const DirectoraCart = ({
  selectedStar,
  onStarSelected,

}: DirectoraCartProps) => {
  const { nIdDirectora, nombreCompletoCliente, nombreEstrellaSeleccionada } = useEstrellaStore();
  const [query, setQuery] = useState("");
  const [cargaInicial, setCarga] = useState(true);
  const [debouncedQuery] = useDebounce(query, 1000);

  const {
    estrellasCart,
    loadingCart,
    getEstrellasCart
  } = useEstrellasCart();

  useEffect(() => {
    if (nombreEstrellaSeleccionada == null) {
      onStarSelected(null);
    }
    // getEstrellasCart("");
  }, []);

  useEffect(() => {
    getEstrellasCart(debouncedQuery);
  }, [debouncedQuery]);

  useEffect(() => {
 
    getEstrellasCart("");
    setCarga(false)
  }, []);


  const filteredEstrellas = [
    {
      nIdCliente: nIdDirectora || 0,
      sNombre: "",
      sApellidos: nombreCompletoCliente || '',
      sRazonSocial: null,
      sNumeroDocumento: "CD",
      sTelefono: "",
      sEmail: "",
      dtFechaRegistro: "",
      sDireccion: "",
      sDistrito: "",
      sProvincia: "",
      sDepartamento: "",
      dFechaNacimiento: "",
      sOrigen: "",
      detailWork: null,
      sNombreComercial: "",
      sTipo: ""
    },
    ...(estrellasCart || []),
  ];

  const handleClean = () => {
    onStarSelected(null);
    setQuery("")
  }

  if (cargaInicial) {
    return (
      <div className="animate-pulse flex flex-col space-y-3">
        <div className="h-4 bg-secondary2/40 rounded w-24 mb-2"></div>
        <div className="h-10 bg-secondary2/40 rounded-lg w-full"></div>
      </div>
    );
  }

  return (
    <Combobox value={selectedStar} onChange={onStarSelected} >
      <div className="relative mt-4">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left border-3 border-primary_sokso  bg-white focus:outline-none">
          <ComboboxInput
            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-primary_sokso focus:outline-none focus:ring-0"
            displayValue={(estrella: ClientTableResponse | null) =>
              estrella ? `${estrella.sNombre} ${estrella.sApellidos}` : ""
            }
            placeholder="Asignar pedido a"
            onChange={(event) => setQuery(event.target.value)}
          />
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
            <span onClick={handleClean}>
              <Trash size={18} color="#DB4444" />
            </span>
            <CaretDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {loadingCart ? (
            <div className="flex justify-center py-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary_sokso border-t-transparent" />
            </div>
          ) : (filteredEstrellas.length === 0 && query !== "") ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
              No se encontraron resultados.
            </div>
          ) : (
            filteredEstrellas
              .filter(estrella => query === "" || estrella.sNumeroDocumento !== "CD")
              .map((estrella) => (
                <ComboboxOption
                  key={estrella.nIdCliente}
                  value={estrella}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-4 ${active
                      ? "bg-primary_sokso/10 text-primary_sokso"
                      : "text-gray-900"
                    }`
                  }
                >
                  {({ selected, active }) => (
                    <>
                      <div className="flex flex-col">
                        <span
                          className={`block truncate ${selected ? "font-xs" : "font-normal"
                            }`}
                        >
                          {estrella.sNombre} {estrella.sApellidos}
                        </span>
                        <span className="block truncate text-xs text-gray-500">
                          {estrella.sNumeroDocumento}
                        </span>
                      </div>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 right-3 flex items-center ${active
                            ? "text-primary_sokso"
                            : "text-primary_sokso"
                            }`}
                        >
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ComboboxOption>
              ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default DirectoraCart;