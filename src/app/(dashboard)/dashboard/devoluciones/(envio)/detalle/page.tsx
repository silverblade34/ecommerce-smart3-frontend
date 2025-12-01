"use client";
import { ClientDevolution, DetalleDevolutiom } from "@/lib/interfaces/devoluciones";
import {
  getListEnvioByIdCodeAction,
  getResumenByDevolutionsAction,
} from "@/server/actions/devoluciones";
import {
  Button,
  Chip,
  Spinner,
} from "@heroui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import { ItemDetail } from "../components/item-detail/ItemDetail";
import { useDetalleDevoluciones } from "@/hooks/devolutions/useDevolution";
import { usePedidosStore } from "@/context/devoluciones/tracking-store";
import { Warning } from "@phosphor-icons/react";

const DetallePedidos = () => {

  const { selectedPedidos, removeSelectedPedido } = usePedidosStore();

  const ids = useMemo(
    () => selectedPedidos.map(p => p.sNumeroDevolucion),
    [selectedPedidos]
  );

  const { loading, detalleDevolucion, refresh } = useDetalleDevoluciones(ids);

  const router = useRouter();


  const handleConfirmClick = () => {
    router.push(
      `/dashboard/devoluciones/bultos`
    );
  };


  const todosDetalles = detalleDevolucion.flatMap(c =>
    c.detalles.map(det => ({
      ...det,
      sNombreEstrella: c.sNombreCliente
    }))
  );

  const grupos = todosDetalles.reduce((acc, det) => {
    if (!acc[det.sNumeroDevolucion]) acc[det.sNumeroDevolucion] = [];
    acc[det.sNumeroDevolucion].push(det);
    return acc;
  }, {} as Record<string, (DetalleDevolutiom & { sNombreEstrella: string })[]>);

  return (
    <div className="space-y-6">

      <Button
        onPress={() => router.back()}
        className="bg-primary_sokso text-white px-5 py-2 rounded-lg shadow-sm hover:bg-primary_sokso/90 flex items-center gap-2"
      >
        <span>←</span> Volver
      </Button>
      <div className="bg-white rounded-md p-2 space-y-4">
        <p className="text-xl font-bold text-center border-b border-gray-200 pb-2">
          Devoluciones a Enviar
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {selectedPedidos.map((p, i) => (
            <Chip
              color="secondary"
              variant="flat"
              key={i}
              onClose={selectedPedidos.length > 1 ? () => removeSelectedPedido(p.sNumeroDevolucion) : undefined}
              className="px-3 py-1 rounded-full text-sm shadow-sm"
            >
              {p.sNumeroDevolucion}
            </Chip>
          ))}
        </div>

        <div className="flex items-center justify-center p-2 rounded-lg shadow-sm ">
          <p className="text-sm text-red leading-snug">
            Verifica los productos que enviarás. Si no tienes el producto físicamente,
            procede a{" "}
            <span className="text-red-600 font-semibold underline">
              eliminarlo
            </span>{" "}
            de tu lista.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">

        {loading ? <div className="flex justify-center"> <Spinner label="Cargando devoluciones..." color="secondary" size="md"></Spinner></div> :
          <>
            {Object.entries(grupos).map(([numeroDev, detalles]) => (
              <ItemDetail
                key={numeroDev}
                sNumeroDevolucion={numeroDev}
                detalle={detalles}
                refresh={refresh}
              />
            ))}

          </>
        }
      </div>
      {todosDetalles.length > 0 && (
        <div className="flex justify-center">
          <Button
            onPress={handleConfirmClick}
            className="bg-primary_sokso text-white px-6 py-2"
          >
            CONFIRMAR
          </Button>
        </div>
      )}
    </div>
  );
};

export default DetallePedidos;