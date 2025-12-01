"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Checkbox,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Spinner,
  Divider,
  useDisclosure,
} from "@heroui/react";
import { Alarm, Eye, MagnifyingGlass, ShareFat } from "@phosphor-icons/react";
import {
  ListProductosHistorial,
} from "@/server/actions/devoluciones";
import { EnvioList, HistorialDev } from "@/lib/interfaces/devoluciones";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useTrackingDevoluciones } from "@/hooks/devolutions/useDevolution";
import { usePedidosStore } from "@/context/devoluciones/tracking-store";
import FiltroDevoluciones from "../FiltroDevoluciones";
import Link from "next/link";
import { datosEstado } from "@/lib/data/menu-data";
import { useRouter } from "next/navigation";
import Pagination from "../Pagination";

dayjs.extend(utc)

const statusStyleMap: { [key: string]: string } = {
  abierto: "bg-success text-white",
  cerrado: "bg-danger text-white",
  enviado: "bg-yellow text-white",
  recogido: "bg-success text-white",
  no_recogido: "bg-danger text-white",
  "en almacen": "bg-pink text-white",
  revision: "bg-blue text-white",
  completado: "bg-purple text-white",
};

const CardPedidosConfirm = () => {

  const { pedidos, loading, buscar, pagination } = useTrackingDevoluciones()
  const { selectedPedidos, addSelectedPedido, removeSelectedPedido } = usePedidosStore()
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [detallesVisibles, setDetallesVisibles] = useState<number[]>([]);
  const [Historial, setHistorial] = useState<HistorialDev[] | undefined>(
    undefined
  );
  ;
  const handleSelectPedido = (pedido: EnvioList) => {
    const isSelected = selectedPedidos.some((p) => p.id === pedido.id)
    if (isSelected) {
      removeSelectedPedido(pedido.sNumeroDevolucion)
    } else {
      addSelectedPedido(pedido)
    }
  }

  const router = useRouter();

  const abrirModalHistorial = async (id: number) => {
    const response = await ListProductosHistorial(id);
    if ("status" in response && response.status === false) {
      console.error("Error en la respuesta:", response.res);
      return;
    }
    setHistorial(response.data);
    onOpen()
  };

  const toggleDetalles = (pedidoId: number) => {
    setDetallesVisibles(prev =>
      prev.includes(pedidoId)
        ? prev.filter(id => id !== pedidoId)
        : [...prev, pedidoId]
    );
  };

  // Mapa con prioridad de estados
const estadoOrden: { [key: string]: number } = {
  "ABIERTO": 1,
"CERRADO": 2,
  "ENVIADO": 3,
  "EN ALMACÉN": 4,
  "COMPLETADO": 5
};

// Función para ordenar pedidos
const pedidosOrdenados = [...pedidos].sort((a, b) => {
  // 1. Comparar estados según prioridad
  const estadoA = estadoOrden[a.sEstado.toUpperCase()] ?? 999;
  const estadoB = estadoOrden[b.sEstado.toUpperCase()] ?? 999;

  if (estadoA !== estadoB) {
    return estadoA - estadoB; // primero los de mayor prioridad
  }

  // 2. Si tienen el mismo estado, ordenar por fecha (más reciente primero)
  const fechaA = dayjs(a.dtFechaCreacion).valueOf();
  const fechaB = dayjs(b.dtFechaCreacion).valueOf();

  return fechaB - fechaA;
});
  const renderPedidoCard = (pedido: EnvioList) => {
    const statusStyle =
      statusStyleMap[pedido.sEstado.toLowerCase()] || "bg-gray-300 text-black";
    return (
      pedido.cantidad > 0 && (
        <Card key={pedido.sNumeroDevolucion} className="shadow-md">
          <CardHeader className="bg-primary_sokso text-white p-3 rounded flex  sm:flex-row sm:items-center justify-between gap-2">

            <div className="flex flex-col sm:flex-row">
              <span className="text-base font-semibold mr-4">
                Devolución por {pedido.sTipoDevolucion}
              </span>

              {pedido.sEstado === "ABIERTO" ? (
                <Chip
                  className="bg-white text-[#8331A7] px-3 py-1"
                  size="sm"
                  variant="flat"
                >
                  <div className="flex items-center gap-1 text-xs">
                    <Alarm size={16} color="#8331A7" />
                    {Math.round(pedido.dias_restantes) == 0 ?
                      "Último día para registrar" : Math.round(pedido.dias_restantes) + " días para cerrar"
                    }
                  </div>
                </Chip>
              ) : (
                pedido.sEstado === "CERRADO" && (
                  <Chip className="bg-white text-[#C93618] px-3 py-1" size="sm" variant="flat">
                    <div className="flex items-center gap-1  text-xs">
                      <Alarm size={16} color="#C93618" />
                      Tiempo agotado
                    </div>
                  </Chip>
                )
              )}

            </div>

            {(pedido.sEstado === "ABIERTO" || pedido.sEstado === "CERRADO") &&
              <Checkbox
                isSelected={selectedPedidos.some((p) => p.id === pedido.id)}
                onChange={() => handleSelectPedido(pedido)}
              />
            }
          </CardHeader>

          <CardBody>
            <div className="grid grid-cols-2">
              <div className="flex flex-col  gap-y-2 sm:flex-wrap">
                <p className="text-sm "> <strong>N° Pedido: </strong> {pedido.nro_pedido}  </p>
                <p className="text-sm">  <strong>Fecha Apertura:</strong>{" "}
                  {dayjs(pedido.dtFechaCreacion).utc().format("DD/MM/YYYY")}
                </p>
                <p className="text-sm ">  <strong>Cantidad Registrada:</strong> {pedido.cantidad}</p>
              </div>
              <div className="flex  gap-2 flex-col mx-2">
                <div className="flex justify-end gap-x-2">
                  <span className={`capitalize px-2 py-1 text-center rounded text-sm ${statusStyle}`}>
                    {pedido.sEstado.replace(/_/g, ' ').toLowerCase()}
                  </span>

                  {(pedido.sEstado.toLowerCase() === 'recogido' || pedido.sEstado.toLowerCase() === 'no_recogido') && (
                    <Button
                      isIconOnly
                      size="sm"
                      className={`text-white ${pedido.sEstado.toLowerCase() === "recogido"
                        ? "bg-success"
                        : "bg-danger"
                        }`}
                      onPress={() => abrirModalHistorial(pedido.id)}
                    >
                      <Eye size={18} />
                    </Button>
                  )}

                </div>
                <div className="flex justify-end  sm:flex-row gap-1 items-end mt-4">
                  <Button
                    size="sm"
                    className=" bg-[#473B8C] text-white w-32 "
                    startContent={<MagnifyingGlass size={16} />}
                    onPress={() =>
                      router.push(
                        `/dashboard/devoluciones/productos?ids=${pedido.id}&estado=${pedido.sEstado}&number=${pedido.sNumeroDevolucion}`
                      )
                    }
                  >
                    Ver Productos
                  </Button>
                </div>
              </div>
            </div>

            <Divider className="mt-4"></Divider>
            {(pedido.sEstado.toLowerCase() != "abierto" && pedido.sEstado.toLowerCase() != "cerrado") && (
              <div className="flex font-bold text-sm m-2 cursor-pointer gap-x-2"
                onClick={() => toggleDetalles(pedido.id)}>
                <MagnifyingGlass size={18} /> Ver Detalles Adicionales
              </div>
            )}

            {detallesVisibles.includes(pedido.id) && (
              <div className="mt-4 space-y-1 text-sm bg-gray-100 p-3 rounded">
                <p className="text-sm">
                  <strong>Agencia:</strong> {pedido.agencia}
                </p>
                <p className="text-sm">
                  <strong>Cant. Bulto:</strong> {pedido.bultos}
                </p>
                <p className="text-sm">
                  <strong>Fecha Envío:</strong>{" "}
                  {dayjs(pedido.fechaEnvio).format("DD/MM/YYYY")}
                </p>
                <p className="text-sm">
                  <strong>Tiempo Llegada:</strong> {pedido.tiempoLlegada} días
                </p>
                <p className="text-sm">
                  <strong>Días de recojo:</strong> {pedido.diasRecojo}
                </p>

                {pedido.fechaRecojo && (
                  <p className="text-sm">
                    <strong>Día de recojo aprox.:</strong>{" "}
                    {dayjs(pedido.fechaRecojo).format("DD/MM/YYYY")}
                  </p>
                )}
                {datosEstado.map(config => {
                  if (pedido.sEstado.toLowerCase() === config.state) {
                    return config.fields.map(field => (
                      pedido[field.key] && (
                        <p key={field.key} className="text-sm">
                          <strong>{field.label}:</strong> {dayjs(pedido[field.key]).format("DD/MM/YYYY")}
                        </p>
                      )
                    ));
                  }
                  return null;
                })}
              </div>
            )}
          </CardBody>
        </Card>
      ))
  };
  console.log(pedidos)
  return (
    <>
      <div className="space-y-4 mb-4">
        <FiltroDevoluciones onBuscar={buscar} />
        {loading ? (
          <div className="flex justify-center">
            <Spinner color="secondary" label="Cargando devoluciones..."></Spinner>
          </div>
        ) : pedidos.length == 0 ? (
          <p className="text-sm text-center">
            Sin registro de devoluciones.
          </p>
        ) : (

          <div className="grid grid-cols-1  gap-4">
          <div className="flex justify-end items-center">
  {selectedPedidos.length > 0 && (
    <Button
      color="primary"
      size="sm"
      className="w-32"
      onClick={() => router.push("/dashboard/devoluciones/detalle")}
    >
      <ShareFat size={18} weight="fill" /> Enviar
    </Button>
  )}
</div>

          {pedidosOrdenados.map(renderPedidoCard)}


            {pagination && pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={(page) => buscar(undefined, undefined, undefined, undefined, page)}
              />
            )}
          </div>
        )
        }
      </div>

      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange} scrollBehavior="inside">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Historial de Recojo
          </ModalHeader>
          <ModalBody className="max-h-[500px] overflow-y-auto">
            {Historial && Historial.length > 0 ? (
              Historial.slice().reverse().map((item, index) => (
                <div key={index} className="mb-4 border-b pb-3">
                  <div className="flex justify-between items-center">
                    <span>
                      {dayjs(item.dtFechaCreacion).format("DD/MM/YYYY HH:mm")}
                    </span>
                    <span
                      className={`text-sm text-white px-2 py-1 rounded ${item.sEstadoNuevo === "RECOGIDO"
                        ? "bg-success"
                        : item.sEstadoNuevo === "NO_RECOGIDO"
                          ? "bg-danger"
                          : "bg-primary_sokso"
                        }`}
                    >
                      {item.sEstadoNuevo.replace("_", " ")}
                    </span>
                  </div>
                  {item.sComentarios && (
                    <p className="text-sm mt-2 text-gray-800">
                      {item.sComentarios}
                    </p>
                  )}
                  {item.sUrlFoto && (
                    <div className="mt-2">
                      <img
                        src={item.sUrlFoto}
                        alt="Foto del historial"
                        className="w-full max-w-xs rounded shadow"
                      />
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-gray-500">
                No hay historial disponible.
              </p>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardPedidosConfirm;