import { DatosEstrella, Pedido } from "../types";
import { Pagination, Button, getKeyValue, Spinner, Chip, Image, Accordion, AccordionItem } from "@heroui/react";
import { Check, CheckSquare, LineVertical, LinkSimple, Plus, Trash, WhatsappLogo, XSquare } from "@phosphor-icons/react";
import { priceFormat } from '@/utils/priceFormat';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import clsx from "clsx";
import { useCallback } from "react";
import Link from "next/link";
import { ProductoDetalle, ProductoDetalles } from "@/lib/global";

dayjs.extend(utc);
const statusColorMap: {
  [key: string]: "success" | "warning" | "primary" | "secondary";
} = {
  REGULAR: "success",
  CYBER: "warning",
  PREVENTA: "primary",
  GRATIS: "secondary",
};

interface MobileViewProps {
  tipo: string
  pedidosData: Pedido[];
  loading: boolean;
  selectedStatus: string;
  selectedPedidos: string[];
  selectAll: boolean;
  onSelectPedido: (id: string) => void;
  onSelectAll: () => void;
  // onConfirmPedido: (id: string) => void;
  onConfirmPedido: (id: string, tipo: string) => void;
  onRejectPedido: (pedido: Pedido) => void;
  onDeletePedido: (pedido: Pedido) => void;
  onConfirmSelected: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectMultiplePedidos: (ids: string[]) => void;
}

const MobileView: React.FC<MobileViewProps> = ({
  onSelectMultiplePedidos,

  tipo,
  pedidosData,
  loading,
  selectedStatus,
  selectedPedidos,
  selectAll,
  onSelectPedido,
  onSelectAll,
  onConfirmPedido,
  onRejectPedido,
  onDeletePedido,
  onConfirmSelected,
  currentPage,
  totalPages,
  onPageChange,
}) => {

  const renderCell = useCallback(
    (pedido: Pedido, columnKey: string | number) => {
      const cellValue = getKeyValue(pedido, columnKey);
      switch (columnKey) {
        case "estrella":
          const { sNombre, dni, sApellidos } = pedido.datosEstrella;
          return (
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{sNombre + " " + sApellidos}</span>
              <span className="text-xs">{dni}</span>
            </div>
          );
        case "monto":
          const precioTotal = pedido.montoTotal;
          return (
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{priceFormat(precioTotal)}</span>
            </div>
          );
        case "precio":
          return (
            <div className="flex flex-col">
              <span className="text-xs font-semibold">{priceFormat(pedido.precio)}</span>
            </div>
          );
        case "fecha":
          return (
            <div className="flex flex-col">
              <span className="text-xs font-semibold">
                {dayjs(pedido.fecha).utc().format("DD/MM HH:mm")}
              </span>
            </div>
          );
        case "fechaConfirmado":
          return (
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold">
                F. Confirmación {dayjs(pedido.fechaAccion).utc().format("DD/MM HH:mm")}
              </span>
            </div>
          );
        case "sOrigenPedido":
          return (
            <div className="flex w-full">
              {pedido.sOrigenPedido && (
                <Chip
                  variant="flat"
                  color={
                    pedido.sOrigenPedido?.toUpperCase().includes("DIRECTOR")
                      ? 'success'
                      : pedido.sOrigenPedido?.toUpperCase().includes("ESTRELLA")
                        ? 'warning'
                        : 'danger'
                  }
                >
                  <p className="text-xs">{('SMART' + " " + pedido.sOrigenPedido?.toUpperCase()) || ''}</p>
                </Chip>
              )}
              <div className="ml-auto">
                <Chip
                  variant="flat"
                  color={statusColorMap[pedido.tipoCatalogo?.toUpperCase() || "REGULAR"] || "default"}
                >
                  <p className="text-xs">
                    {pedido.tipoCatalogo }{/*se quitó VENTA FLASH == "CYBER" ? "Venta Flash" : pedido.tipoCatalogo*/}
                  </p>
                </Chip>
              </div>
            </div>
          );
        case "enviar":
          return (
            <div className="flex flex-col">
              <Button
                isIconOnly
                className="bg-transparent"
                isDisabled={!pedido.datosEstrella?.sNumeroCelular}
                onPress={() => {
                  if (pedido.datosEstrella?.sNumeroCelular) {
                    const phoneNumber = pedido.datosEstrella.sNumeroCelular.replace(/\D/g, '');
                    const whatsappUrl = `https://wa.me/51${phoneNumber}`;
                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                <WhatsappLogo size={24} color={
                  pedido.datosEstrella?.sNumeroCelular
                    ? "#3DAB25"
                    : "#cccccc"
                } />
              </Button>
            </div>
          );
        case "producto":
          const { descripcion, imagen, color, talla } = pedido.datosItem;
          return (
            <>
              <div className="flex justify-start items-center">
                {/* <Avatar src={imagen == null ? "/images/imagen-no-disponible.jpg" : imagen} size="lg" /> */}
                <Image
                  key={pedido.id}
                  src={imagen || "/images/imagen-no-disponible.jpg"}
                  alt={descripcion}
                  width={50}
                  height={50}
                  className="rounded-md size-28 object-cover"
                // radius="lg"
                />
                <div className="ml-2 text-default-800">
                  <p className="text-xs text-gray">{pedido.fechaAccion != null ? 'F. Pedido ' + dayjs(pedido.fecha).utc().format("DD/MM HH:mm") : null}</p>
                  <p className="text-xs font-semibold">{descripcion}</p>
                  <p className="text-xs">{color}</p>
                  <p className="text-xs">{talla}</p>
                  <p className="text-xs">Cant: {pedido.cantidad}</p>
                </div>
              </div>
            </>
          );
        default:
          return <span className="text-xs text-gray-600">{cellValue}</span>;
      }
    },
    []
  );

  const onSelectAllByEstrella = (idCliente: number, pedidos: Pedido[]) => {
    const pedidosIds = pedidos.map((p) => p.id);
    const todosSeleccionados = pedidosIds.every((id) => selectedPedidos.includes(id));
    if (todosSeleccionados) {
      const nuevosSeleccionados = selectedPedidos.filter(id => !pedidosIds.includes(id));
      onSelectMultiplePedidos(nuevosSeleccionados);
    } else {
      const nuevosSeleccionados = Array.from(new Set([...selectedPedidos, ...pedidosIds]));
      onSelectMultiplePedidos(nuevosSeleccionados);
    }
  };

  const productosPorEstrella = pedidosData.reduce((acc: Record<number, { estrella: DatosEstrella; productos: Pedido[] }>, producto) => {
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

  const estrellasOrdenadas = Object.values(productosPorEstrella)
    .sort((a, b) => {
      const apellidoA = a.estrella.sApellidos.toLowerCase();
      const apellidoB = b.estrella.sApellidos.toLowerCase();
      return apellidoA.localeCompare(apellidoB);
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner
          label="Cargando pedidos..."
          color="secondary"
          size="md"
          classNames={{
            label: "text-md font-medium",
          }}
        />
      </div>
    );
  }

  if (pedidosData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500 text-lg font-medium">
          {selectedStatus === "POR_CONFIRMAR"
            ? "No hay pedidos pendientes"
            : "No hay pedidos confirmados"}
        </p>
      </div>
    );
  }
  return (
    <div className="">
      {selectedStatus == "POR_CONFIRMAR" && pedidosData.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onSelectAll}
              className="h-5 w-5 rounded border-gray-300 bg-primary focus:ring-primary"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              {selectAll ? "Quitar selección" : "Seleccionar todos"}
            </span>
          </div>
          {selectedPedidos.length > 0 && (
            <Button
              startContent={<Check className="h-5 w-5" />}
              onPress={onConfirmSelected}
              color="primary"
              className="bg-primary"
              size="sm"
            >
              Confirmar ({pedidosData
                .filter((p) => selectedPedidos.includes(p.id))
                .reduce((sum, p) => sum + p.cantidad, 0)} unid.)
            </Button>
          )}
        </div>
      )}
      <div className="grid grid-cols-1">
        {estrellasOrdenadas.map((grupo) => (
          <Accordion key={grupo.estrella.nIdCliente}
          >
            <AccordionItem
              key={grupo.estrella.nIdCliente}
              indicator={({ isOpen }) => (
                <div className="text-primary_sokso">
                  {isOpen ? (
                    <LineVertical size={20} weight="bold" />
                  ) : (
                    <Plus size={20} weight="bold" />
                  )}
                </div>
              )}
              title={
                <div className="items-center rounded-lg border-2 border-primary_sokso p-2 bg-[#e9d7f2]">
                  <div className="grid grid-cols-1">
                    <p className="text-center text-md font-semibold text-primary_sokso">
                      {grupo.estrella.sApellidos} {grupo.estrella.sNombre}
                    </p>
                    <p className="text-md text-center text-primary_sokso">
                      {grupo.estrella.dni}
                    </p>

                    <div className="flex justify-between px-2">
                      <p className="text-xs sm:text-sm font-bold">
                        ({grupo.productos.reduce((sum, p) => sum + p.cantidad, 0)} unidades
                        {
                          selectedStatus === "POR_CONFIRMAR" && (
                            <>{" / "}
                              {grupo.productos
                                .filter(p => selectedPedidos.includes(p.id))
                                .reduce((sum, p) => sum + p.cantidad, 0)
                              }{" "}seleccionadas
                            </>
                          )
                        })
                      </p>
                      <p className="text-xs sm:text-sm font-bold">
                        S/.  {grupo.productos.reduce((sum, p) => sum + p.montoTotal, 0).toFixed(2)}
                      </p>
                    </div>

                  </div>
                </div>
              }
              className="bg-transparent rounded-lg"
            >
              {selectedStatus === "POR_CONFIRMAR" && (
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-5 w-5 rounded accent-primary_sokso border-gray-300 focus:ring-primary_sokso"
                    checked={grupo.productos.every(p => selectedPedidos.includes(p.id))}
                    ref={(el) => {
                      if (el) {
                        const todos = grupo.productos.every(p => selectedPedidos.includes(p.id));
                        const ninguno = grupo.productos.every(p => !selectedPedidos.includes(p.id));
                        el.indeterminate = !todos && !ninguno;
                      }
                    }}
                    onChange={() => onSelectAllByEstrella(grupo.estrella.nIdCliente, grupo.productos)}
                  />
                  <a className="text-xs font-bold ml-2">Seleccionar grupo</a>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {grupo.productos.map((producto, i) => (

                  <li
                    key={producto.id}
                    className={clsx(
                      "grid w-full grid-cols-2 rounded-lg border-t-1  p-4 shadow-md mt-2  space-x-4",
                      {
                        "bg-[#FEE7EF] border-1 border-red": producto.esDuplicado == true,
                        "bg-white border-1 border-primary_sokso": producto.esDuplicado == false,
                      }
                    )}
                  >
                    <div className="col-span-2 flex items-center justify-between border-b border-line pb-1">
                      {selectedStatus === "POR_CONFIRMAR" && (
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedPedidos.includes(producto.id)}
                            onChange={() => onSelectPedido(producto.id)}
                            className="h-5 w-5 rounded "
                          />
                        </div>
                      )}
                      {selectedStatus === "CONFIRMADO"
                        ? renderCell(producto, "sOrigenPedido")
                        : null}
                      {renderCell(producto, "enviar")}
                    </div>
                    {/* <div className="col-span-2 flex items-center justify-between border-b border-line pb-1"> */}
                    {/* {renderCell(producto, "estrella")} */}

                    {/* </div> */}
                    <div className="col-span-2 flex items-center justify-between border-b border-line pb-1">
                      {renderCell(producto, "producto")}
                      <div>
                        {selectedStatus == "POR_CONFIRMAR" ? <span className="text-xs font-light">Precio: {renderCell(producto, "precio")}</span> : null}
                        <span className="text-xs font-light">Total: {renderCell(producto, "monto")}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center justify-between ">
                      <div className="flex space-x-2">
                        <Link
                          href={`/articulos/detalle/${producto.datosItem.urlEcommerce}`}
                          className="cursor-pointer rounded-full border bg-primary_sokso p-0.5 text-white"
                        >
                          <LinkSimple size={18} />
                        </Link>
                        {producto.fechaAccion == null ? renderCell(producto, "fecha") : renderCell(producto, "fechaConfirmado")}
                      </div>
                      <div className="flex items-end justify-end space-x-2">
                        {producto.sAccionDirectora != null ? (
                          producto.puedeEliminar ?
                            <Button
                              isIconOnly
                              className="bg-transparent"
                              onPress={() => onDeletePedido(producto)}
                            >
                              <Trash size={24} color="#cc0000" weight="fill" />
                            </Button>
                            : null

                        ) : (
                          <>
                          
                            <Button
                              isIconOnly
                              className="bg-transparent"
                              onPress={() => onRejectPedido(producto)}
                            >
                              <XSquare size={28} color="#cc0000" weight="fill" />
                            </Button>
                            <Button
                              isIconOnly
                              className="bg-transparent"
                              onPress={() => onConfirmPedido(producto.id, tipo)}
                            >
                              <CheckSquare
                                size={28}
                                color="#3DAB25"
                                weight="fill"
                              />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>

                ))}
              </div>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default MobileView;