"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import * as XLSX from "xlsx";
import { Eye, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import {
  deleteProductoDevolucionService,
  ListProductosDetalles,
} from "@/server/actions/devoluciones";
import {
  DataProductos,
  DetalleDetalle,
  DataDetalle,
} from "@/lib/interfaces/devoluciones";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const formatDate = (fechaStr: string) => {
  if (!fechaStr) return "Fecha no disponible";
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const DetalleDev = () => {
  const [clientsDevolucion, setClientsDevolucion] = useState<
    DataProductos | undefined
  >(undefined);
  const [filteredClientes, setFilteredClientes] = useState<DataDetalle[] | null>([]);
  const [isOpenMap, setIsOpenMap] = useState<Record<number, boolean>>({});
  const [isOpenDetailMap, setIsOpenDetailMap] = useState<
    Record<string, boolean>
  >({});

  const [selectedDetalle, setSelectedDetalle] = useState<DetalleDetalle | null>(
    null
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusDev, setStatusDev] = useState("");

  const [filterType, setFilterType] = useState<
    "dni" | "estrella" | "modelo" | ""
  >("");
  const [filterValue, setFilterValue] = useState("");
const [selectedSubDetalle, setSelectedSubDetalle] = useState<any>(null);
const { 
  isOpen: isOpenSubDetalle, 
  onOpen: onOpenSubDetalle, 
  onOpenChange: onOpenChangeSubDetalle 
} = useDisclosure();

 
  const router = useRouter();
  const searchParams = useSearchParams();

  const fetchPedidos = async (id: string) => {
    try {
      const numericId = Number(id);
      const response = await ListProductosDetalles(numericId);
      if (response.status ) {
        setClientsDevolucion(response.data);
        setFilteredClientes(response.data?.detalles || []);
      } else {
         router.back()
      }
    } catch (error) {
      console.error("Error cargando pedidos:", error);
    }
  };

  useEffect(() => {
    const id = searchParams.get("ids");
    const estadoDev = searchParams.get("estado") ?? "";
    setStatusDev(estadoDev);
    if (id) fetchPedidos(id);
  }, [searchParams]);

  const toggleCliente = (index: number) => {
    setIsOpenMap((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleDetalle = (key: string) => {
    setIsOpenDetailMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDeleteProducto = async () => {
    if (!selectedDetalle) {
      setIsOpenModal(false);
      return;
    }
    setIsSending(true);

    const response = await deleteProductoDevolucionService(
      selectedDetalle.idDetalle
    );
    if (response.success) {
      toast.success("Devolución eliminada correctamente");
      const id = searchParams.get("ids");
      if (id) fetchPedidos(id);
    }

    setIsSending(false);
    setIsOpenModal(false);
  };
  const exportarExcel = () => {
    if (!filteredClientes?.length) return;

    type ExcelRow = {
      "Numero de Devolución": string;
      "Fecha de Registro": string;
      Tipo: string;
      "Nombre de Estrella": string;
      Producto: string;
      Color: string;
      Talla: string;
      Cantidad: string;
      "Cantidad Aceptada": string | number;
      Precio: string | number;
      "Total Estrella": string;
      "AUT. Dev": string;
      "OV Origen": string;
      "Fecha Envio": string;
      "Fecha de Emisión": string;
    };
    const rows: ExcelRow[] = [];
    console.log(filteredClientes, "filteredClientes");
    filteredClientes.forEach((cliente) => {
      cliente.detalles.forEach((detalle) => {
        rows.push({
          "Numero de Devolución": clientsDevolucion?.sNumeroDevolucion || "",
          "Fecha de Registro": dayjs(detalle.dtFechaRegistro).format(
            "DD/MM/YYYY"
          ),
          Tipo: detalle?.sTipoDevolucion || "",
          "Nombre de Estrella": cliente.sNombreCliente,
          Producto: detalle.sNombreProducto,
          Talla: detalle.sTalla,
          Color: detalle.sColor,
          Cantidad: detalle.nCantidad,
          "Cantidad Aceptada": clientsDevolucion?.cantidad_aceptados ?? "",
          Precio: detalle.nPrecio,
          "Total Estrella": " ",
          "AUT. Dev": " ",
          "OV Origen": detalle.subDetalle?.sFactura || "",
          "Fecha Envio": "",
          "Fecha de Emisión": "",
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Devoluciones");

    XLSX.writeFile(wb, "detalle_devoluciones.xlsx");
  };

  useEffect(() => {
    if (!clientsDevolucion || !Array.isArray(clientsDevolucion.detalles)) {
      setFilteredClientes([]);
      return;
    }

    const filtro = filterValue.trim().toLowerCase();

    if (!filtro || !filterType) {
      setFilterValue("")
      setFilteredClientes(clientsDevolucion.detalles);
      return;
    }

    const filtrados = clientsDevolucion.detalles
      .map((cliente) => {
        if (!cliente || !cliente.detalles || cliente.detalles.length === 0)
          return null;

        if (filterType === "estrella") {
          return cliente.sNombreCliente?.toLowerCase().includes(filtro)
            ? cliente
            : null;
        }

        if (filterType === "dni") {
          return cliente.sNumeroDocumento?.toLowerCase().includes(filtro)
            ? cliente
            : null;
        }

        if (filterType === "modelo") {
          const detallesFiltrados = cliente.detalles.filter((detalle) =>
            detalle.sNombreProducto?.toLowerCase().includes(filtro)
          );

          if (detallesFiltrados.length === 0) return null;

          return {
            ...cliente,
            detalles: detallesFiltrados,
          };
        }

        return null;
      })
      .filter(Boolean) as typeof clientsDevolucion.detalles;

    setFilteredClientes(filtrados);
  }, [filterValue, filterType, clientsDevolucion]);
  console.log("Filtered Clientes:", clientsDevolucion);
  return (
    <div className="space-y-6">
      <Button
        onPress={() => router.back()}
        className="bg-primary_sokso text-white px-6 py-2"
      >
        ← Volver
      </Button>

      <div className="bg-white p-4 rounded-md shadow-sm space-y-4">
        {clientsDevolucion && (
          <>
            <div className="flex justify-between items-center px-4">
              <p className="text-sm font-medium">
                DEVOLUCIÓN: {clientsDevolucion.sTipo}
              </p>
              <p>
                <span className="bg-primary_sokso text-white px-3 py-1 rounded-md inline-block text-sm font-medium">
                  {clientsDevolucion.sNumeroDevolucion}
                </span>
              </p>
            </div>
            <p className="text-center text-lg font-semibold">
              CANTIDAD REGISTRADOS: {clientsDevolucion.cantidad}
            </p>
          </>
        )}

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Select
            label="Buscar por"
            selectedKeys={filterType ? [filterType] : []}
            className="w-full sm:w-48"
            onChange={(e) =>
              setFilterType(e.target.value as "dni" | "estrella" | "modelo")
            }
          >
            <SelectItem key="dni" value="dni">
              DNI
            </SelectItem>
            <SelectItem key="estrella" value="estrella">
              Nombre de Estrella
            </SelectItem>
            <SelectItem key="modelo" value="modelo">
              Código de Modelo
            </SelectItem>
          </Select>

          {filterType && (
            <>
              <Input
                type="search"
                placeholder="Escriba el valor a buscar"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="flex-1"
                isClearable
                onClear={() => setFilterValue("")}
              />
              <Button
                color="secondary"
                // variant="bordered"
                onPress={() => setFilterValue("")}>
                Limpiar

              </Button>
            </>
          )}
        </div>

      </div>
      <div className="w-full flex gap-4">
        <Button className="bg-success text-white" onPress={exportarExcel}>
          Descargar Excel
        </Button>

        {clientsDevolucion?.sTipo && statusDev == "ABIERTO" && (
          <Button
            className="bg-primary_sokso text-white"
            onPress={() => {
              const tipo = clientsDevolucion.sTipo.toLowerCase();
       
              if (tipo === "garantía" || tipo === "garantia") {
                router.push("/dashboard/devoluciones/garantia/nuevo");
              } else if (tipo === "cambio") {
                router.push("/dashboard/devoluciones/cambio/nuevo");
              } else {
                toast.error("Tipo de devolución no reconocido");
              }
            }}
          >
            Agregar{" "}
            {clientsDevolucion.sTipo.charAt(0).toUpperCase() +
              clientsDevolucion.sTipo.slice(1).toLowerCase()}
          </Button>
        )}
      </div>

      {filteredClientes?.map((cliente, idxCliente) => {
        const totalPrecio = cliente.detalles.reduce(
          (acc, detalle) =>
            acc +
            (Number(detalle.nPrecio) || 0) * (Number(detalle.nCantidad) || 1),
          0
        );
        const totalProductos = cliente.detalles.reduce(
          (acc, detalle) => acc + (Number(detalle.nCantidad) || 0),
          0
        );
        console.log("Rendering cliente:", cliente);
        return (
          <section
            key={cliente.sIdCliente}
            className="rounded-md shadow-sm mb-4 bg-white overflow-hidden"
          >
            <div
              className="flex flex-col  w-full border-2 border-primary_sokso bg-[#e9d7f2] text-primary_sokso font-semibold p-2 cursor-pointer"
              onClick={() => toggleCliente(idxCliente)}
            >
              <p className="text-xs">{cliente.sNombreCliente}</p>
              <div className="flex justify-between items-center">
                <p className="text-xs">{cliente.sNumeroDocumento}</p>

                <p className="text-xs">S/. {totalPrecio.toFixed(2)}</p>
           <p className="text-primary_sokso px-2 py-1 rounded-md text-xs font-medium">
  {
    // cantidad de detalles aprobados
    cliente.detalles.filter(d => d.sEstadoEvaluacion === "APROBADO").length
  }
  /
  {
    // total de detalles
    cliente.detalles.length
  }
</p>          </div>
            </div>

            <div
              className={`${isOpenMap[idxCliente] ? "block" : "hidden"
                } bg-white p-4`}
            >
              {cliente.detalles.map((detalle, idxDetalle) => {
                const idKey = `${idxCliente}-${idxDetalle}`;
                return (
                  <div
                    key={detalle.idDetalle}
                    className="mb-4 border-b border-gray-200 pb-4"
                  >
                    <div className="flex justify-between items-start sm:items-center mb-2">
                      <div className="flex flex-col sm:gap-1">
                        <b className="block sm:hidden text-[10px] leading-[15px]">
                          {detalle.sNombreProducto || "Sin detalle"}
                        </b>
                        <p className="text-[10px] sm:text-sm font-medium leading-[15px]">
                          Tipo: {detalle.sTipoDevolucion}
                        </p>
                      </div>
                      <div className="flex justify-end gap-x-2">
  <span
    className={`capitalize px-2 py-1 text-center rounded text-sm 
      ${detalle.sEstadoEvaluacion === "APROBADO" ? "bg-success text-white" : ""}
          ${detalle.sEstadoEvaluacion === "PENDIENTE" ? "bg-primary text-white" : ""}
      ${detalle.sEstadoEvaluacion === "RECHAZADO" ? "bg-danger text-white" : ""}`}
      
  >
    {detalle.sEstadoEvaluacion.replace(/_/g, ' ').toLowerCase()}
  </span>

  {(detalle.sEstadoEvaluacion === 'ACEPTADO' || detalle.sEstadoEvaluacion === 'RECHAZADO') && (
    <Button
  isIconOnly
  size="sm"
  className={`text-white ${detalle.sEstadoEvaluacion === "APROBADO" ? "bg-success" : "bg-danger"}`}
  onClick={() => {
    setSelectedSubDetalle(detalle.detalleRechazado); // 👈 guardamos el subDetalle
    onOpenSubDetalle(); // 👈 abrimos modal
  }}
>
  <Eye size={18} />
</Button>
  )}
  
</div>
                      {(statusDev == "ABIERTO" || statusDev == "CERRADO") && (
                        <Button
                          isIconOnly
                          variant="light"
                          onPress={() => {
                            setSelectedDetalle(detalle);
                            setIsOpenModal(true);
                          }}
                          className="self-start"
                        >
                          <Trash size={20} color="#FF0000" />
                        </Button>
                      )}
                    </div>

                    <div className="flex flex-row gap-4 items-start">
                      <div className="w-1/3 min-w-[100px] sm:w-32 max-w-[150px]">
                        <Image
                          src={
                            detalle.sImagenProducto ||
                            "/images/imagen-no-disponible.jpg"
                          }
                          alt={detalle.sNombreProducto}
                          width={90}
                          height={90}
                          className="rounded-md w-full h-auto object-cover shadow-md border-gray-50 border-2"
                        />
                      </div>

                      <div className="w-2/3 flex flex-col gap-1 flex-grow">
                        <p className="hidden sm:block text-sm">
                          {detalle.sNombreProducto}
                        </p>
                        <p className="text-xs">
                          N°: {detalle.subDetalle?.sFactura}
                        </p>
                        <p className="text-xs">
                          Talla: {detalle.sTalla || "Sin detalle"}
                        </p>
                        <p className="text-xs">
                          Color: {detalle.sColor || "Sin detalle"}
                        </p>
                        <p className="text-xs">
                          Precio: {detalle.nPrecio || "Sin detalle"}
                        </p>
                        <p className="text-xs">
                          Cantidad: {detalle.nCantidad || "Sin detalle"}
                        </p>
                        <p className="text-xs">
                          Registro: {formatDate(detalle.dtFechaRegistro)}
                        </p>
                      </div>
                    </div>

                   {detalle.sTipoDevolucion !== "SHOWROOM" && (
  <div className="flex justify-end mt-2">
    <p
      className={`font-bold cursor-pointer text-xs bg-primary_sokso p-2 rounded-md ${
        isOpenDetailMap[idKey] ? "text-white" : "text-white"
      }`}
      onClick={() => toggleDetalle(idKey)}
    >
      Ver detalles
    </p>
  </div>
)}

                    {isOpenDetailMap[idKey] && (
                      <section className="border-t-2 border-gray-200 pt-4 mt-2 text-[10px]">
                        <div className="mb-4">

                          <p className="text-xs">
                            <a className="font-bold ">Motivo:</a>{" "}
                            {detalle.subDetalle?.sMotivo}
                          </p>
                          {!["Cambio por talla", "Busco otra opción"].includes(detalle.subDetalle?.sMotivo || "") && (
                            <p className="text-xs">
                              <a className="font-bold">Detalle Motivo:</a> {detalle.subDetalle?.sDetalle}
                            </p>
                          )}
                        </div>
                        {!["Cambio por talla", "Busco otra opción"].includes(
                          detalle.subDetalle?.sMotivo || ""
                        ) && (
                            <>
                              <p className="">Detalle:</p>
                              <div className="flex flex-wrap gap-4">
                                {detalle.subDetalle?.fotos?.map((foto, index) => (
                                  <Image
                                    key={index}
                                    src={foto}
                                    alt={`Foto ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="rounded-md w-20 h-20 object-cover shadow-md border-gray-50 border-2"
                                  />
                                ))}
                              </div>
                            </>
                          )}
                      </section>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <Modal
        isOpen={isOpenModal}
        onOpenChange={() => setIsOpenModal(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>¿Estás seguro de que deseas eliminar esta devolución?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsOpenModal(false)} color="default">
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteProducto}
              isLoading={isSending}
              isDisabled={isSending}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
<Modal
  isOpen={isOpenSubDetalle}
  onOpenChange={onOpenChangeSubDetalle}
  size="lg"
  scrollBehavior="inside"
>
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">
          Motivo: {selectedSubDetalle?.sDescripcion}
        </ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
            {selectedSubDetalle?.sUrlContenido &&
              selectedSubDetalle.sUrlContenido
                .split("|") // 👈 separo por "|"
                .map((foto: string, idx: number) => (
                  <a
                    key={idx}
                    href={foto.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={foto.trim()}
                      alt={`foto-${idx}`}
                      width={150}
                      height={150}
                      className="rounded-lg object-cover border shadow-sm cursor-pointer hover:opacity-80"
                    />
                  </a>
                ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" color="danger" onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>


    </div>
  );
};

export default DetalleDev;
