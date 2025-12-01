"use client";
import { useState } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import dayjs from "dayjs";
import { Broom, Funnel, MagnifyingGlass } from "@phosphor-icons/react";

const opcionesFiltro = [

  { value: "estrellaFilter", label: "Estrella" },
  { value: "productoFilter", label: "Código de Producto" },
  { value: "numeroDevolucion", label: "N° Devolución" },
  { value: "fechaDesde", label: "Rango de Fechas" },
  { value: "estado", label: "Estado" },
];
const opcionesEstado = [
  { value: "ABIERTO", label: "Abierto" },
  { value: "ENVIADO", label: "Enviado" },
   { value: "EN_ALMACEN", label: "En almacén" },
  { value: "COMPLETADO", label: "Completado" },
  { value: "CERRADO", label: "Cerrado" },
  { value: "REVISION", label: "Revisión" },
  { value: "RECOGIDO", label: "Recogido" },
  { value: "NO_RECOGIDO", label: "No recogido" },
];
const placeholders: Record<string, string> = {
  estrellaFilter: "Ingrese Nombre o DNI",
  productoFilter: "Ingrese código de producto",
  numeroDevolucion: "Ingrese N° de devolución",
};

interface Props {
  onBuscar: (
    filtroSeleccionado?: string,
    valorFiltro?: string,
    fechaDesde?: string,
    fechaHasta?: string
  ) => void;
}

export default function FiltroDevoluciones({ onBuscar }: Props) {
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string | undefined>(undefined);
  const [valorFiltro, setValorFiltro] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [selectKey, setSelectKey] = useState(0);

  const handleBuscar = () => {
    onBuscar(filtroSeleccionado, valorFiltro, fechaDesde, fechaHasta);
  };

  const handleLimpiar = () => {
    setFiltroSeleccionado(undefined);
    setSelectKey((prev) => prev + 1);
    setValorFiltro("");
    setFechaDesde("");
    setFechaHasta("");
    onBuscar();
  };

  console.log(filtroSeleccionado)
    console.log(valorFiltro)
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-white p-4 rounded-md m-2">
      <p className="text-xs font-bold">Buscar por:</p>
      <Select
        key={selectKey}
        placeholder="Seleccione..."
        className="sm:w-[200px] border-1 border-gray-500 rounded-lg"
        value={filtroSeleccionado}
        onChange={(e) => setFiltroSeleccionado(e.target.value)}


      >
        {opcionesFiltro.map((option) => (
          <SelectItem key={option.value} value={option.value} >
            {option.label}
          </SelectItem>
        ))}
      </Select>
        {filtroSeleccionado === "estado" && (
  <Select
    className="sm:w-[200px] border-1 border-gray-500 rounded-lg"
    value={valorFiltro}
    onChange={(e) => setValorFiltro(e.target.value)}
    placeholder="Seleccione estado"
  >
    {opcionesEstado.map((option) => (
      <SelectItem key={option.value} value={option.value}>
        {option.label}
      </SelectItem>
    ))}
  </Select>
)}
      {filtroSeleccionado && filtroSeleccionado !== "fechaDesde" && (
        <Input
          placeholder={placeholders[filtroSeleccionado] || "Ingrese valor"}
          className="sm:w-[300px] border-1 border-gray-500 rounded-lg"
          value={valorFiltro}
          onChange={(e) => setValorFiltro(e.target.value)}
          isClearable
          onClear={() => setValorFiltro("")}
        />
      )}

      {filtroSeleccionado === "fechaDesde" && (
        <div className="flex gap-2 items-center">
          <Input
            type="date"
            value={fechaDesde}
            max={fechaHasta || undefined} 
            onChange={(e) => setFechaDesde(e.target.value)}
          />

          <Input
            type="date"
            value={fechaHasta}
            min={fechaDesde || undefined}   
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
      )}


      <div className="flex justify-between space-x-2">
        {(valorFiltro != "" || filtroSeleccionado == "fechaDesde") && (
          <Button
            variant="flat"
            color="secondary"
            onPress={handleBuscar}
            // isDisabled={valorFiltro === ""}
            startContent={<MagnifyingGlass size={16} />}
          >
            Buscar
          </Button>
        )}
        {filtroSeleccionado != undefined && (
          <Button
            variant="flat"
            color="success"
            onPress={handleLimpiar}
            startContent={<Funnel size={16} />}

          >
            Restablecer
          </Button>
        )}
      </div>

    </div>
  );
}
