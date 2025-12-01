"use client";
import {
  Chip,
  Tab,
  Tabs,
  Spinner,
  Pagination,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { priceFormat } from "@/utils/priceFormat";
import { MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { useBolsas } from "@/hooks/useTrackingDirectora";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from "next/navigation";
import clsx from "clsx";
dayjs.extend(utc);

const estadoOrden: { [key: string]: number } = {
  ABIERTO: 1,
  CERRADO: 2,
  "PREPARANDO PEDIDO": 3,
  FACTURADO: 4,
  DESPACHADO: 5,
  "EN TRÁNSITO": 6,
  "EN ZONA": 7,
  "EN DISTRIBUCIÓN": 8,
  ENTREGADO: 9,
};

const statusColorMap: {
  [key: string]: "success" | "warning" | "primary" | "secondary";
} = {
  Regular: "success",
  Cyber: "warning",
  Preventa: "primary",
    Gratis: "secondary",
};


const typeColorMap: {
  [key: string]: "success" | "danger";
} = {
  ABIERTO: "success",
  CERRADO: "danger",
};

const TableBag = () => {
  const router = useRouter();
  const [selectedStatus] = useState(null);
  const [nombreEstrella, setNombreEstrella] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const { bolsas, loading, error } = useBolsas(
    "REGULAR",
    selectedStatus,
    nombreEstrella,
    currentPage,
    rowsPerPage
  );

  useEffect(() => {
    setNombreEstrella(debouncedSearchValue);
    setCurrentPage(1);
  }, [debouncedSearchValue]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    onPageChange: (page: number) => setCurrentPage(page),
  });

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    if (bolsas?.data) {
      setPagination({
        page: bolsas.data.page,
        totalPages: bolsas.data.totalPages,
        onPageChange: handlePageChange,
      });
    }
  }, [bolsas, handlePageChange]);

  const SectionComponent = (label: string, value: string | number) => (
    // <div className="flex flex-col gap-1 rounded-lg bg-white p-1">
    //   <span className="text-xs font-bold text-black">{label} :</span>
    //   <span className="text-xs font-light text-black">{value}</span>
    // </div>
    <div className="flex justify-between w-full text-xs px-2">
      <span className="text-xs font-light text-black">{label} :</span>
      <span className="text-xs font-light text-black">{value} </span>
    </div>
  );

  const SectionComponentTitle = (label: string, value: string | number) => (
    <div className="flex flex-col gap-1 rounded-lg bg-white p-1">
      <span className="text-xs font-light text-black">
        {label} : {value}
      </span>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner label="Cargando bolsas..." color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!bolsas?.data?.items?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        No se encontraron bolsas
      </div>
    );
  }

  const transformedData = bolsas.data.items.flatMap((item) => {
    const tiposPedido = Object.keys(item).filter((key) => key !== "id");

    return tiposPedido.map((tipo) => {
      const pedido = item[tipo];
      return {
        tipo: tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(),
        codigo: pedido?.idPedidoCabecera || "",
        numeroPedido: pedido?.numeroPedidoNetsuite || "",
        cantidad: pedido?.cantidadTotal || 0,
        estado: pedido?.estadoCierre || "",
        cierre_pedido: pedido?.fechaProximaCorte
          ?
          dayjs(pedido.fechaProximaCorte).utc().format('DD/MM/YYYY HH:mm')
          : "",
        totalConfirmados: pedido?.resumen?.totalConfirmados || 0,
        detalle: {
          pagos: {
            total_directora: pedido?.resumen?.montoDirectora || 0,
            total_estrella: pedido?.resumen?.montoPromotor || 0,
            total_pagar:
              (pedido?.resumen?.montoDirectora || 0) +
              (pedido?.resumen?.totalIgv || 0) + (pedido?.resumen?.totalPercepcion || 0),
            igv: pedido?.resumen?.totalIgv || 0,
            percepcion: pedido?.resumen?.montoDirectora * 0.02 || 0,
            estado: pedido?.estadoPago || "",
          },
          datos_envio: {
            factura: pedido?.datosEnvio?.numeroFactura || "",
            guia: pedido?.datosEnvio?.numeroGuia || "",
            operador: pedido?.datosEnvio?.operador || "",
            cant_bultos: pedido?.datosEnvio?.cantidadBultos || 0,
            cant_despachados: pedido?.datosEnvio?.cantidadDespachada || 0,
          },
          seguimiento: {
            fecha_factura: pedido?.seguimiento?.fechaFacturacion
              ? new Date(
                pedido.seguimiento.fechaFacturacion
              ).toLocaleDateString()
              : "",
            fecha_envio: pedido?.seguimiento?.fechaEnvio
              ? new Date(pedido.seguimiento.fechaEnvio).toLocaleDateString()
              : "",
            fecha_pago: pedido?.seguimiento?.fechaPago
              ? new Date(pedido.seguimiento.fechaPago).toLocaleDateString()
              : "",
            lead_time: pedido?.seguimiento?.leadTime || "",
            compromiso: pedido?.seguimiento?.fechaCompromisoEntrega
              ? new Date(
                pedido.seguimiento.fechaCompromisoEntrega
              ).toLocaleDateString()
              : "",
            plazo:
              pedido?.estadoPago,
          },
        },
      };
    });
  });





  return (
    <div>

      <div className="grid gap-4">
        <div className="justify-end">
          <Button
            startContent={<Plus className="h-5 w-5" />}
            onPress={() => router.push("/articulos")}
            color="primary"
            className="bg-primary_sokso float-right mb-2 w-32"
            size="sm"
          >
            Nuevo pedido
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {transformedData.map((item) => (
            <Card key={item.codigo} className="rounded-lg shadow-sm">
              <CardHeader className="flex justify-between items-center p-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-medium">
                    N°. {item.numeroPedido}
                  </span>
                </div>
                <Chip variant="flat"
                  color={typeColorMap[item.estado] || "default"}
                  size="sm">
                  <p className="text-xs"> {item.estado}</p>
                </Chip>
              </CardHeader>
              <CardBody className="p-2">
                <div className=" gap-2 mb-4">
                  <Chip
                    variant="flat"
                    color={statusColorMap[item.tipo] || "default"}
                    size="sm"
                  >
                    <p className="text-xs">{item.tipo}</p>{/*QUITAR VENTA FLASH item.tipo.toUpperCase()=="CYBER" ? "Venta Flash": */}
                  </Chip>
                  {SectionComponentTitle("Fecha de Corte", item.cierre_pedido)}
                  {SectionComponentTitle("Cant. Pedido", item.cantidad)}
                  {SectionComponentTitle(
                    "Cant. Confirmado",
                    item.totalConfirmados
                  )}

                  <div className="col-span-2 flex justify-center mt-2">
                    <Link
                      prefetch={false}
                      href={`/dashboard/pedidos/directora/seguimiento/${item.codigo}`}
                      onClick={() => {
                        const resumenPedido = {
                          numeroPedido: item.numeroPedido,
                          cierre_pedido: item.cierre_pedido,
                          tipo: item.tipo,
                          cantidad: item.cantidad
                        };
                        localStorage.setItem("trackingDetalle", JSON.stringify(resumenPedido));
                      }}
                    >
                      <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        startContent={<MagnifyingGlass size={16} />}
                      >
                        <p className="text-xs">Ver productos</p>
                      </Chip>
                    </Link>
                  </div>
                </div>

                <Tabs
                  fullWidth
                  aria-label="Detalles del pedido"
                  color="primary"
                  variant="solid"
                >
                  <Tab key="pagos" title="Pagos">
                    <div className="grid grid-cols-1 gap-1 justify-center mt-2">
                      <div className="flex justify-between w-full text-xs px-2 mb-4">
                        <span className="text-xs font-light text-black">Total Estrella:</span>
                        <span className="text-xs font-light text-black mr-2.5">{priceFormat(item.detalle.pagos.total_estrella)}</span>
                      </div>
                      <div className="flex justify-between w-full text-xs px-2">
                        <span className="text-xs font-light text-black">Total Directora:</span>
                        <span className="text-xs font-light text-black">{priceFormat(item.detalle.pagos.total_directora)} + </span>
                      </div>
                      {/* <div className="flex justify-between w-full text-xs px-2 ">
                        <span className="text-xs font-light text-black">IGV:</span>
                        <span className="text-xs font-light text-black border-b-1 border-gray-600 w-16 text-right mr-2.5">{priceFormat(item.detalle.pagos.igv)}  </span>
                      </div>
                      <div className="flex justify-between w-full text-xs px-2 ">
                        <span className="text-xs font-light text-black">SubTotal:</span>
                        <span className="text-xs font-light text-black ">{priceFormat(item.detalle.pagos.total_directora + item.detalle.pagos.igv)} + </span>
                      </div> */}
                      <div className="flex justify-between w-full text-xs px-2">
                        <span className="text-xs font-light text-black">Percepción:</span>
                        <span className="text-xs font-light text-black border-b-1 border-gray-600 w-16 text-right mr-2.5">{priceFormat(item.detalle.pagos.percepcion)}</span>
                      </div>
                      <div className="flex justify-between w-full font-bold px-2">
                        <span className="text-xs text-black">Total a Pagar Director:</span>
                        <span className="text-xs text-black mr-2">{priceFormat(item.detalle.pagos.total_directora + item.detalle.pagos.percepcion)}</span>
                      </div>

                      <div className="col-span-1 flex justify-between w-full px-2 mt-2">
                        <span className="text-xs text-black">Estado Pago</span>
                        <span className={clsx(`text-xs font-medium`, item.detalle.pagos.estado == "PAGADO" ? `text-black` : `text-red`)} >
                          {item.detalle.pagos.estado.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </Tab>

                  {estadoOrden[item.estado.toUpperCase()] >= estadoOrden["FACTURADO"] && (
                    <Tab key="seguimiento" title="Seguimiento">
                      <div className="grid grid-cols-1 gap-1 justify-center mt-2">
                        {SectionComponent(
                          "Fecha Factura",
                          item.detalle.seguimiento.fecha_factura
                        )}
                        {SectionComponent(
                          "Fecha Pago",
                          item.detalle.seguimiento.fecha_pago
                        )}
                        {SectionComponent(
                          "Fecha Envío",
                          item.detalle.seguimiento.fecha_envio
                        )}

                        {SectionComponent(
                          "Lead Time",
                          item.detalle.seguimiento.lead_time
                        )}
                        {SectionComponent(
                          "Compromiso de Entrega",
                          item.detalle.seguimiento.compromiso
                        )}
                        {/* {SectionComponent(
                          "Plazo",
                          item.detalle.seguimiento.plazo
                        )} */}
                      </div>
                    </Tab>
                  )}
                  {estadoOrden[item.estado.toUpperCase()] >= estadoOrden["DESPACHADO"] && (
                    <Tab key="envio" title="Datos de Envío">
                      <div className="grid grid-cols-1 gap-1 justify-center mt-2">
                        {SectionComponent(
                          "N° Factura",
                          item.detalle.datos_envio.factura
                        )}
                        {SectionComponent(
                          "N° Guía",
                          item.detalle.datos_envio.guia
                        )}
                        {SectionComponent(
                          "Operador",
                          item.detalle.datos_envio.operador.replace("_", " ")
                        )}
                        {/* {SectionComponent(
                          "Can. Bultos",
                          item.detalle.datos_envio.cant_bultos
                        )} */}
                        {SectionComponent(
                          "Can. Despachados",
                          item.detalle.datos_envio.cant_despachados
                        )}
                      </div>
                    </Tab>
                  )}
                </Tabs>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={pagination.page}
          total={pagination.totalPages}
          onChange={pagination.onPageChange}
        />
      </div>
    </div>
  );
};

export default TableBag;
