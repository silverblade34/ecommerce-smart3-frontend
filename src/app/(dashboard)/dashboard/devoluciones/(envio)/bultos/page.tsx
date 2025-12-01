"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input } from "@heroui/react";
import { Plus, Minus } from "@phosphor-icons/react";
import { usePedidosStore } from "@/context/devoluciones/tracking-store";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter, useSearchParams } from "next/navigation";
import {
  GenerarBultosService,
  getResumenByDevolutionsAction,
  PDFBultosService,
} from "@/server/actions/devoluciones";



interface Bultos {
  id: number;
  cantidad: number;
}

type BultoResponse = {
  header: {
    sNombreComercial: string;
    sNombreCliente: string;
    sNombreEmpresa: string;
    sRucEmpresa: string;
  };
  Body: {
    nDoc: string;
    nDevolucion: string;
  };
  footer: {
    section1: {
      nTotalBultos: number;
      nTotalUnidades: string;
    };
    section2: {
      nBultos: string;
      nUnidadPorBulto: string;
    };
  };
};

const BultosForm = () => {
  const router = useRouter();
  const { push } = useRouter();
  const { setBultos } = usePedidosStore();
  const [bultos, setBultosLocal] = useState<Bultos[]>([{ id: 1, cantidad: 1 }]);
  const [nombreDirectora, setNombreDirectora] = useState("");
  const searchParams = useSearchParams();
  const [resumenDevs, setResumenDevs] = useState({
    sNombreGeneral: "",
    nCantidad: 0,
    mappperIdentificador: [] as {
      id: number;
      sNumeroDevolucion: string;
    }[],
  });


  const { selectedPedidos, removeSelectedPedido } = usePedidosStore();


  const ids = useMemo(
    () => selectedPedidos.map(p => p.sNumeroDevolucion),
    [selectedPedidos]
  );



  const cantidadTotal = Number(searchParams.get("cantidad") || 0);
  // const ids = searchParams.get("ids")?.split(",") || [];

  const hasDisable = useMemo(() => {
    const totalBultos = bultos.reduce((acc, bulto) => acc + bulto.cantidad, 0);
    return totalBultos >= resumenDevs.nCantidad;
  }, [bultos, resumenDevs.nCantidad]);
useEffect(() => {
  const fetchResumen = async () => {
    if (ids.length === 0) return; // evita la llamada si no hay ids
    try {
      const resumenDevolutions = await getResumenByDevolutionsAction(ids);
      if (resumenDevolutions) {
        setResumenDevs(resumenDevolutions.data);
      }
    } catch (error) {
      console.error("Error cargando resumen de devoluciones:", error);
    }
  };

  fetchResumen();
}, [ids]);

  const totalProductos = bultos.reduce((acc, bulto) => acc + bulto.cantidad, 0);

  const handleChange = (id: number, value: number) => {
    if (value < 1) {
      toast.warning("La cantidad mínima por bulto es 1.");
      return;
    }

    const totalSinActual = bultos
      .filter((b) => b.id !== id)
      .reduce((acc, b) => acc + b.cantidad, 0);

    if (totalSinActual + value > resumenDevs.nCantidad) {
      toast.warning(`No puedes exceder el total de ${resumenDevs.nCantidad} productos.`);
      return;
    }

    const updatedBultos = bultos.map((bulto) =>
      bulto.id === id ? { ...bulto, cantidad: value } : bulto
    );
    setBultosLocal(updatedBultos);
  };

  const agregarBulto = () => {
    const sumaBultos = bultos.reduce((acc, bulto) => acc + bulto.cantidad, 0);
    if (sumaBultos >= resumenDevs.nCantidad) {
      toast.warning(`No puedes agregar más de ${cantidadTotal} bultos.`);
      return;
    }
    setBultosLocal([...bultos, { id: bultos.length + 1, cantidad: 1 }]);
  };

  const quitarBulto = () => {
    if (bultos.length > 1) setBultosLocal(bultos.slice(0, -1));
  };

  const generarPDF = async () => {
    if (totalProductos !== resumenDevs.nCantidad) {
      toast.warning("El total de productos debe coincidir con la cantidad ingresada en los bultos.");
      return;
    }

    try {
      const devoluciones = resumenDevs.mappperIdentificador.map((dev) => ({
        id: dev.id.toString(),
        sNumeroDevolucion: dev.sNumeroDevolucion,
      }));

      const payload = {
        devoluciones,
        bultos: bultos.map((b) => ({ nCantidad: b.cantidad })),
      };

      const generarResponse = await GenerarBultosService(payload);
      if (!generarResponse.success) {
        toast.error(generarResponse.message || "Error al generar los bultos.");
        return;
      }

      const bultosid = generarResponse.bultoCabecera.nIdBultoCabecera;
      const pdfResponse = await PDFBultosService(bultosid);
      const data = pdfResponse.data;

      const totalUnidades = data.reduce((acc: number, bulto: BultoResponse) => {
        const unidades = parseInt(bulto.footer.section2.nUnidadPorBulto) || 0;
        return acc + unidades;
      }, 0);

      const doc = new jsPDF({ orientation: "portrait" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      data.forEach((bulto: BultoResponse, index: number) => {
        if (index > 0) doc.addPage();

        autoTable(doc, {
          body: [[bulto.header.sNombreComercial || ""]],
          styles: {
            halign: "center",
            fontSize: 15,
            fontStyle: "bold",
            cellPadding: 3,
          },
          margin: { top: 5 },
        });

        autoTable(doc, {
          body: [
            ["De:", bulto.header.sNombreCliente],
            ["Para:", bulto.header.sNombreEmpresa],
            ["RUC:", bulto.header.sRucEmpresa],
            ["N° Devolución:", bulto.Body.nDevolucion],
          ],
          styles: {
            cellPadding: 3,
            fontSize: 12,
          },
          margin: { top: 10 },
          columnStyles: {
            0: { fontStyle: "bold", cellWidth: 40 },
            1: { cellWidth: "auto" },
          },
        });

        autoTable(doc, {
          body: [
            [
              "TOTAL DE BULTOS:",
              bulto.footer.section1.nTotalBultos,
              "N° BULTO:",
              bulto.footer.section2.nBultos,
            ],
            [
              "TOTAL DE UNIDADES:",
              totalUnidades,
              "CANT. BULTO:",
              bulto.footer.section2.nUnidadPorBulto,
            ],
          ],
          styles: {
            cellPadding: 5,
            fontSize: 12,
            fontStyle: "bold",
          },
          margin: { top: 5 },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: "auto" },
          },
        });
      });

      handleRegister(bultosid);
      doc.save("Rotulo_Devolucion.pdf");
    } catch (error) {
      console.error("Error generando PDF:", error);
    }
  };

  const handleRegister = (nIdBultoCabecera: string) => {
    setBultos(bultos.length);
    push(
      `/dashboard/devoluciones/registro?id=${nIdBultoCabecera}&numero=${resumenDevs.sNombreGeneral}&cantidad=${bultos.length}`
    );
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <Button onPress={() => router.back()} className="bg-primary_sokso text-white px-6 py-2">
          ← Volver
        </Button>
      </div>

      <div className="p-6 max-w-md mx-auto space-y-4 bg-gray-50 rounded-lg shadow-lg">
        <div className="flex justify-center items-center">
          <h1 className="text-lg font-bold">Devolución Seleccionada</h1>
        </div>
        <div className="flex justify-center items-center">
          <span className="text-xs font-semibold bg-primary_sokso text-white px-3 py-1 rounded-md">
            {resumenDevs.sNombreGeneral}
          </span>
        </div>
        <p className="text-xs font-semibold text-right">
          TOTAL DE PRODUCTOS: {resumenDevs.nCantidad}
        </p>
        <div className="p-2 bg-primary_sokso text-white text-center font-bold text-xs rounded-md">
          Coloca las unidades por cada bulto
        </div>

        <div className="space-y-2">
          {bultos.map((bulto, index) => (
            <div
              key={bulto.id}
              className="flex items-center justify-center text-center space-x-2"
            >
              <span className="w-32 font-bold">Bulto {index + 1}:</span>

              <Button
                isIconOnly
                size="sm"
                onPress={() => handleChange(bulto.id, bulto.cantidad - 1)}
                className="bg-red text-white px-2"
                isDisabled={bulto.cantidad <= 1}
              >
                <Minus />
              </Button>

              <Input
                type="number"
                value={bulto.cantidad.toString()}
                disabled
                className="w-20 text-center"
              />

              <Button
                isIconOnly
                size="sm"
                onPress={() => handleChange(bulto.id, bulto.cantidad + 1)}
                className="bg-success text-white px-2"
                isDisabled={
                  bultos.reduce((acc, b) => acc + b.cantidad, 0) >= resumenDevs.nCantidad
                }
              >
                <Plus />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button onPress={quitarBulto} className="bg-red text-white">
            <Minus />
            Quitar Bulto
          </Button>
          <Button
            onPress={agregarBulto}
            className="bg-[#6baf18] text-white"
            isDisabled={hasDisable}
          >
            <Plus />
            Agregar Bulto
          </Button>
        </div>

        <Button
          className="w-full bg-primary_sokso text-white"
          onPress={generarPDF}
        >
          Generar Rótulo
        </Button>
      </div>
    </>
  );
};

export default BultosForm;
