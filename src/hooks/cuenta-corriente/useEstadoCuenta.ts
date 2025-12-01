import { EstadoCuentaResponse, RucCuentaCorriente } from "@/lib/global";
import { getCuentaCorrienteRUCService, getEstadoCuentaService } from "@/server/cuenta-corriente";
import { useCallback, useEffect, useState } from "react";
import * as XLSX from "xlsx-js-style";

export const useEstadoCuenta = (
  periodoCont: string,
  year: string
) => {
  const [data, setData] = useState<EstadoCuentaResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
const [ruc, setRuc] = useState<string | null>(null);
  const stored = localStorage.getItem("nIdDirectora") ?? 0;
  const [loadingExcel, setLoadingExcel] = useState<boolean>(false);

  const loadEstadoCuenta = useCallback(async () => {

    setLoading(true);
    setError(null);
    try {
    const result = await getCuentaCorrienteRUCService();
    console.log("RUC:", result);
    console.log("ID Directora:", stored);
    const directoraId = Number(stored);
    const rucEncontrado = result.find((item: { nIdDirectora: number; }) => item.nIdDirectora === directoraId);
    if (rucEncontrado) {
      setRuc(rucEncontrado.sRazonSocial);
    }

    } catch (err) {
      console.log(err)
      setError("Error al obtener estado de cuenta");
    } finally {
      setLoading(false);
    }


    try {
      const result = await getEstadoCuentaService(Number(stored), periodoCont, year);
      setData(result);
    } catch (err) {
      console.log(err)
      setError("Error al obtener estado de cuenta");
    } finally {
      setLoading(false);
    }
  }, [periodoCont, year]);

  useEffect(() => {
    loadEstadoCuenta();
  }, [loadEstadoCuenta]);


  const handleExportToExcel = () => {
    if (!data || !data.items) return;
    setLoadingExcel(true);

    const excelData = data.items.map((item, index) => ({
      ITEM: (index + 1).toString(),
      "TIPO DOCUMENTO": item.tipo || "",
      "Fec. de Emisión": item.trandate || "",
      "N° PED/DEV": item.textoAuxiliar100_5 || "",
      "N° Documento": item.documento || "",
      "Importe": `S/ ${Number(item.importe).toFixed(2)}`,
      "Saldo": `S/ ${Number(item.saldo).toFixed(2)}`
    }));

    excelData.push({
      ITEM: "TOTAL",
      "TIPO DOCUMENTO": "",
      "Fec. de Emisión": "",
      "N° PED/DEV": "",
      "N° Documento": "",
      "Importe": `S/ ${Number(data.resumen.totalFacturas).toFixed(2)}`,
      "Saldo": `S/ ${Number(data.resumen.saldoFinal).toFixed(2)}`
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    // Establecer ancho de columnas
    ws["!cols"] = [
      { width: 6 },
      { width: 20 },
      { width: 20 },
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 15 }
    ];

    // Aplicar estilo a cabecera: fondo morado (#800080), letras blancas (#FFFFFF), bold
    const headerStyle = {
      fill: { fgColor: { rgb: "800080" } },
      font: { color: { rgb: "FFFFFF" }, bold: true }
    };

    const headers = Object.keys(excelData[0]);
    headers.forEach((key, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: colIndex });
      if (!ws[cellAddress]) return;
      ws[cellAddress].s = headerStyle;
    });

    XLSX.utils.book_append_sheet(wb, ws, "Estado de Cuenta");

    // Usar writeFile con styles requiere XLSX-style (si no usas xlsx-style, esto se ignorará visualmente)
    XLSX.writeFile(wb, `EstadoCuenta_${new Date().toISOString().split("T")[0]}.xlsx`);

    setLoadingExcel(false);
  };

  return {
    loadingExcel,
    handleExportToExcel,
    data,
    loading,
    error,
    reload: loadEstadoCuenta,
     ruc,
  };
};