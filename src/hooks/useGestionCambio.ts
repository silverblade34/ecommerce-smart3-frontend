import { ClientTableResponse } from "@/lib/interfaces/clientes";
import { listClientesHijosService } from "@/server/actions/client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const formatDateForExcel = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};
export const useGestionCambio = () => {
  const [estrellas, setEstrellas] = useState<ClientTableResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const getEstrellas = async () => {
    setLoading(true);
    try {
      const clientes = await listClientesHijosService("DIR-01");
      setEstrellas(clientes);
    } catch (error) {
      console.error("Error al cargar estrellas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = () => {
    // Mapear los datos al formato requerido
    const excelData = estrellas.map((cliente) => ({
      ID: cliente.nIdCliente,
      DNI: cliente.sNumeroDocumento,
      "NOMBRES Y APELLIDOS": `${cliente.sNombre} ${cliente.sApellidos}`,
      "FECHA DE REGISTRO": formatDateForExcel(cliente.dtFechaRegistro),
      DIRECCION: cliente.sDireccion || "",
      DEPARTAMENTO: cliente.sDepartamento || "",
      PROVINCIA: cliente.sProvincia || "",
      DISTRITO: cliente.sDistrito || "",
      CORREO: cliente.sEmail || "",
      CELULAR: cliente.sTelefono || "",
    }));

    // Crear el libro de trabajo y la hoja
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Ajustar el ancho de las columnas
    const columnWidths = [
      { wch: 8 }, // ID
      { wch: 12 }, // DNI
      { wch: 40 }, // NOMBRES Y APELLIDOS
      { wch: 15 }, // FECHA DE REGISTRO
      { wch: 40 }, // DIRECCION
      { wch: 20 }, // DEPARTAMENTO
      { wch: 20 }, // PROVINCIA
      { wch: 20 }, // DISTRITO
      { wch: 30 }, // CORREO
      { wch: 15 }, // CELULAR
    ];
    ws["!cols"] = columnWidths;

    XLSX.utils.book_append_sheet(wb, ws, "Clientes");

    XLSX.writeFile(
      wb,
      `Clientes_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  useEffect(() => {
    getEstrellas();
  }, []);

  return {
    estrellas,
    loading,
    getEstrellas,
    handleExportToExcel,
  };
};
