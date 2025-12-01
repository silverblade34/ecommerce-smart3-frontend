import { BolsaResponse, BolsasResponse, DatosEstrella, ProductoDetalle } from '@/lib/global';
import { getDetalleBolsa, getTrackingDirectora } from '@/server/actions/pedido';
import { useState, useEffect } from 'react';
import * as XLSX from "xlsx-js-style";
import dayjs from 'dayjs';
import { toast } from 'react-toastify';


export const useBolsas = (
  tipoCatalogo: string,
  estado: null,
  nomEstrella: string,
  page: number = 1,
  limit: number = 10,
) => {
  const [bolsas, setBolsas] = useState<BolsasResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchBolsas = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getTrackingDirectora(
          // Number(stored),
          nomEstrella,
          page,
          limit);
          console.log("Response de tracking:", response);
        if (!response) {
          throw new Error('No se encontraron datos de bolsas');
        }

        setBolsas(response);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Error desconocido al cargar bolsas'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBolsas();
  }, [tipoCatalogo, estado, nomEstrella, page, limit]);

  return {
    bolsas,
    loading,
    error,

  };
};


export const useDetalleBolsa = (
  bolsaId: string,
  nomEstrella: string,
  page: number = 1,
  limit: number = 10
) => {
  const [detalle, setDetalle] = useState<BolsaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageLocal, setPages] = useState({ page: 1, limit: 10, total: 0, totalPages: 0 });
  const [filtrosActuales, setFiltrosActuales] = useState({ bolsaId: "", nomEstrella: "" });
  const [isloadingExcel, setLoadingExcel] = useState(false);



  const fetchDetalle = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getDetalleBolsa(bolsaId, nomEstrella, page, limit);

      if (response.status) {
        setDetalle(response?.data);
        setPages(response?.data?.paginacion);
        setFiltrosActuales({ bolsaId, nomEstrella })
        setLoading(false);
        // throw new Error('No se encontraron datos del pedido');
      } else {
        setDetalle(null)
        setLoading(false);
      }


    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido al cargar detalle'
      );
      setLoading(false);
      // } finally {
      //   setLoading(false);
    }
  };

const handleExportToExcel = async (numeroPedido: string) => {
  try {
    console.log("Exportando a Excel con filtros:", filtrosActuales.bolsaId);
    console.log("Nombre de estrella:", filtrosActuales.nomEstrella);
    console.log("Página actual:", pageLocal.page);
    console.log("Total de páginas:", pageLocal.total);

    setLoadingExcel(true);
    const response = await getDetalleBolsa(
      filtrosActuales.bolsaId,
      filtrosActuales.nomEstrella,
      pageLocal.page,
      pageLocal.total
    );
    if (!response?.data) return;

    const detalles = response.data;
    console.log("Detalles para exportar:", detalles);
    const wb = XLSX.utils.book_new();
    const wsData: (string | number)[][] = [];

    const soloOV = numeroPedido?.split("-")?.[1] || numeroPedido;

    wsData.push(
      ["Pedido N°:", soloOV, "Fecha Pedido:", dayjs(detalles.fechaPedido).format("DD/MM/YYYY"), "Fecha Envio:", "", "", ""],
      [],
      [],
      []
    );

    const productosPorEstrella = detalles.productos.reduce((acc: Record<number, { estrella: DatosEstrella; productos: ProductoDetalle[] }>, producto) => {
      const estrellaId = producto.datosEstrella.nIdCliente;
      if (!acc[estrellaId]) {
        acc[estrellaId] = {
          estrella: producto.datosEstrella,
          productos: []
        };
      }
      acc[estrellaId].productos.push(producto);
      return acc;
    }, {});

const gruposOrdenados = Object.values(productosPorEstrella).sort((a, b) => {
      const nombreA = `${a.estrella.sApellidos} ${a.estrella.sNombre}`.toLocaleUpperCase("es-PE");
      const nombreB = `${b.estrella.sApellidos} ${b.estrella.sNombre}`.toLocaleUpperCase("es-PE");
      return nombreA.localeCompare(nombreB, "es", { sensitivity: "base" });
    });

    // Recorremos ya ordenados
    gruposOrdenados.forEach(({ estrella, productos }) => {
      const tipoClienteOriginal = estrella.tipoCliente?.toUpperCase() || "ESTRELLA";

      // ✅ Considerar CLIENTE FINAL y ESTRELLA TIENDA como ESTRELLA
      const tipoCliente = ["CLIENTE FINAL", "ESTRELLA TIENDA"].includes(tipoClienteOriginal)
        ? "ESTRELLA"
        : tipoClienteOriginal;

      const nombreCompleto = `${estrella.sApellidos} ${estrella.sNombre}`.toLocaleUpperCase("es-PE");
      const tituloEstrella = `${nombreCompleto} - (${productos.length})`;

      let labelPrecio = "Precio";
      let labelSubTotal = "SubTotal";

      switch (tipoCliente) {
        case "ESTRELLA":
          labelPrecio = "Precio Estrella";
          labelSubTotal = "ST. Estrella";
          break;
        case "COLABORADOR":
          labelPrecio = "Precio Colaborador";
          labelSubTotal = "ST. Colaborador";
          break;
        case "DIRECTORA":
          labelPrecio = "Precio CD";
          labelSubTotal = "ST. CD";
          break;
      }

      const esEstrella = tipoCliente === "ESTRELLA";

      wsData.push([tituloEstrella]);

      wsData.push([
        "item", "SCS", "Producto", "Catálogo", "Talla", "Cant. Pedida",
        "Cant. Conf", "Cant. Despachada", labelPrecio, labelSubTotal, "Precio CD", "ST. CD"
      ]);

      productos.forEach((producto, index) => {
        const precioFinal = esEstrella
          ? Number(producto.datosItem.precioEstrella)
          : Number(producto.datosItem.precioDirectora);

        const subtotalFinal = precioFinal * (producto.cantidadDespachada || 0);

        wsData.push([
          index + 1,
          "SCS",
          `${producto.datosItem.descripcion} - ${producto.datosItem.color}`,
          producto.datosItem.catalogo,
          producto.datosItem.talla?.replace(/^TALLA\s*/i, ""),
          producto.cantidad,
          producto.cantidadConfirmada || 0,
          producto.cantidadDespachada || 0,
          precioFinal,
          subtotalFinal,
          Number(producto.datosItem.precioDirectora),
          Number(producto.datosItem.precioDirectora) * (producto.cantidadDespachada || 0)
        ]);
      });

      const totalPedida = productos.reduce((sum, p) => sum + p.cantidad, 0);
      const totalConf = productos.reduce((sum, p) => sum + (p.cantidadConfirmada ?? 0), 0);
      const totalDespachada = productos.reduce((sum, p) => sum + (p.cantidadDespachada ?? 0), 0);
      const subtotalEstrella = productos.reduce((sum, p) => {
        const precio = esEstrella
          ? Number(p.datosItem.precioEstrella)
          : Number(p.datosItem.precioDirectora);
        return sum + (precio * (p.cantidadDespachada || 0));
      }, 0);
      const subtotalCD = productos.reduce((sum, p) =>
        sum + (Number(p.datosItem.precioDirectora) * (p.cantidadDespachada || 0)), 0);

      const igvEstrella = subtotalEstrella / 1.18;
      const igvCD = subtotalCD / 1.18;
      const totalEstrella = subtotalEstrella - igvEstrella;
      const totalCD = subtotalCD - igvCD;

      wsData.push(
        [],
        [],
        ["", "", "", "", "", totalPedida, totalConf, totalDespachada, "SubTotal", igvEstrella, "", igvCD],
        ["", "", "", "", "", "", "", "", "Igv:", totalEstrella, "", totalCD],
        ["", "", "", "", "", "", "", "", "Total:", subtotalEstrella, "", subtotalCD],
        []
      );
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const purpleStyle = {
      fill: { fgColor: { rgb: "8331A7" } },
      font: { color: { rgb: "FFFFFF" }, bold: true },
      alignment: { horizontal: "center" }
    };
    const titleEstrellaStyle = {
      fill: { fgColor: { rgb: "D9D2E9" } },
      font: { color: { rgb: "000000" }, bold: true },
      alignment: { horizontal: "left" }
    };

    ["A1", "B1", "C1", "D1", "E1"].forEach((cell) => {
      if (ws[cell]) ws[cell].s = purpleStyle;
    });

    Object.keys(ws).forEach((cellRef) => {
      const cell = ws[cellRef];
      if (!cell) return;
      const match = cellRef.match(/\d+/);
      if (!match) return;
      const rowNum = parseInt(match[0]);

      if (typeof cell.v === "string" && cell.v.match(/\(.+\) - \(\d+\)$/)) {
        cell.s = titleEstrellaStyle;
      }

      if (typeof cell.v === "string" && cell.v.toLowerCase() === "item") {
        for (let col = 0; col < 12; col++) {
          const letra = String.fromCharCode(65 + col);
          const celda = `${letra}${rowNum}`;
          if (ws[celda]) ws[celda].s = purpleStyle;
        }
      }

      if (typeof cell.v === "number") {
        const col = cellRef.replace(/[0-9]/g, "");
        if (["I", "J", "K", "L"].includes(col)) {
          cell.t = "n";
          cell.z = '"S/ "#,##0.00';
        }
      }
    });

    ws["!cols"] = [
      { wch: 10 }, { wch: 15 }, { wch: 40 }, { wch: 20 }, { wch: 10 },
      { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
      { wch: 15 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Pedido");
    XLSX.writeFile(wb, `Pedido_${soloOV}.xlsx`);
  } catch (error) {
    console.error("Error al exportar Excel:", error);
    toast.error("Error al exportar Excel");
  } finally {
    setLoadingExcel(false);
  }
};




  useEffect(() => {
    if (bolsaId) {
      fetchDetalle();
    }
  }, [bolsaId, nomEstrella, page]);



  return {
    detalle,
    loading,
    error,
    handleExportToExcel,
    isloadingExcel

  };
};