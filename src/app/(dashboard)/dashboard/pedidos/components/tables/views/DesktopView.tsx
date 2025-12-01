import { Pedido } from "../types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Chip, Button, Tooltip,  Spinner, Selection, Input, Image } from "@heroui/react";
import { Check, CheckSquare, MagnifyingGlass, Trash, WhatsappLogo, XSquare } from "@phosphor-icons/react";
import { priceFormat } from '@/utils/priceFormat';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { columnsPedidosDirectora, columnsPedidosDirectoraConfirmados } from "@/lib/data/tables-data";
import { getKeyValue } from "@heroui/react";
import clsx from "clsx";
import { useCallback, useMemo } from "react";

dayjs.extend(utc);

const statusColorMap: {
  [key: string]: "success" | "warning" | "primary";
} = {
  REGULAR: "success",
  CYBER: "warning",
  PREVENTA: "primary",
};

interface DesktopViewProps {
  tipo:string
  pedidosData: Pedido[];
  loading: boolean;
  selectedStatus: string;
  selectedKeys: Selection;
  onSelectionChange: (keys: Selection) => void;
  onConfirmPedido: (id: string, tipo:string) => void;
  onRejectPedido: (pedido: Pedido) => void;
  onDeletePedido: (pedido: Pedido) => void;
  onConfirmSelected: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const DesktopView: React.FC<DesktopViewProps> = ({
  tipo,
  pedidosData,
  loading,
  selectedStatus,
  selectedKeys,
  onSelectionChange,
  onConfirmPedido,
  onRejectPedido,
  onDeletePedido,
  onConfirmSelected,
  currentPage,
  totalPages,
  onPageChange,
  searchValue,
  setSearchValue
}) => {

  const renderCell = useCallback(
    (pedido: Pedido, columnKey: string | number) => {
      const cellValue = getKeyValue(pedido, columnKey);
      switch (columnKey) {
        case "origen":
          return (
            <div className="flex w-full">
              {pedido.sOrigenPedido && (
                <Chip
                  className="text-xs py-4"
                  size="sm"
                  variant="flat"
                  color={
                    pedido.sOrigenPedido?.toUpperCase().includes("DIRECTOR")
                      ? 'success'
                      : pedido.sOrigenPedido?.toUpperCase().includes("ESTRELLA")
                        ? 'warning'
                        : 'danger'
                  }
                >
                  <p className="text-xs"> SMART</p>
                  <p className="text-xs "> {(pedido.sOrigenPedido?.toUpperCase().replace("TIENDA", "")) || ''} </p>
                </Chip>
              )}
            </div>
          );
        case "estrella":
          const { sNombre, sApellidos, dni } = pedido.datosEstrella;
          return (
            <div className="flex flex-col">
              <p className="text-xs font-semibold">{sNombre + " " + sApellidos} </p>
              <p className='text-xs'>{dni}</p>
            </div>
          );
        case "monto":
          const precioTotal = pedido.montoTotal;
          return (
            <div className="flex flex-col">
              <span className="text-xs">{priceFormat(precioTotal)}</span>
            </div>
          );
        case "catalogo":
          return (
            <Chip
              variant="flat"
              color={statusColorMap[pedido.tipoCatalogo || "REGULAR"] || "default"}
              size="sm"
            >
              <p className="text-xs">{pedido.tipoCatalogo?.toUpperCase() }</p>{/*SE QUITÓ VENTA FLASH =="CYBER" ? "Venta Flash" : pedido.tipoCatalogo?.toUpperCase()*/}
            </Chip>
          );
        case "precio":
          return (
            <div className="flex flex-col">
              <span className="text-xs">{priceFormat(pedido.precio)}</span>
            </div>
          );
        case "fecha":
          return (
            <div className="flex flex-col">
              <span className="text-xs">
                {dayjs(pedido.fecha).utc().format("DD/MM HH:mm")}
              </span>
            </div>
          );
        case "fechaConfirmado":
          return (
            <div className="flex flex-col">
              <span className="text-xs">
                {dayjs(pedido.fechaAccion).format("DD/MM HH:mm")}
              </span>
            </div>
          );
        case "enviar":
          return (
            <div className="flex flex-col">
              <Tooltip
                content={
                  pedido.datosEstrella?.sNumeroCelular
                    ? "Enviar mensaje por WhatsApp"
                    : "No hay número registrado"
                }
                showArrow={true}
                className={"bg-[#2564ab] text-white"}
              >
                <div>
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
                        ? "#2564ab"
                        : "#cccccc"
                    } />
                  </Button>
                </div>
              </Tooltip>
            </div>
          );
        case "producto":
          const { descripcion, imagen, color, talla } = pedido.datosItem;
          return (
            <>
              <div className="flex justify-start items-center">
                {/* <Avatar src={imagen == null ? "/images/imagen-no-disponible.jpg" : imagen} size="lg"  className="w-24"/> */}
                <Image
                  key={pedido.id}
                  src={imagen || "/images/imagen-no-disponible.jpg"}
                  alt={descripcion}
                  width={50}
                  height={50}
                  className="rounded-md size-28 object-cover"
                // radius="lg"
                />
                <div className="ml-2 text-default-800 text-start">
                  <p className="text-xs text-gray">{pedido.fechaAccion != null ? 'F. Pedido ' + dayjs(pedido.fecha).utc().format("DD/MM HH:mm") : null}</p>
                  <p className="text-xs font-semibold">{descripcion}</p>
                  <p className="text-xs">{color}</p>
                  <p className="text-xs">{talla}</p>
                  <p className="text-xs">Cant: {pedido.cantidad}</p>
                </div>
              </div>
            </>
          );
        case "actions":
          return (
            <div className="flex items-end justify-center space-x-2">
              {pedido.sAccionDirectora != null ? (
                <>
                  {pedido.puedeEliminar ?
                    <Tooltip
                      content="Eliminar Pedido"
                      showArrow={true}
                      className={"bg-[#cc0000] text-white"}
                    >
                      <Button
                        isIconOnly
                        className="bg-transparent"
                        onPress={() => onDeletePedido(pedido)}
                      >
                        <Trash size={24} color="#cc0000" weight="fill" />
                      </Button>
                    </Tooltip>
                    : null}
                </>
              ) : (
                <>
                  <Tooltip
                    content="Confirmar Pedido"
                    showArrow={true}
                    className={"bg-[#3DAB25] text-white"}
                  >
                    <Button
                      isIconOnly
                      className="bg-transparent"
                      onPress={() => onConfirmPedido(pedido.id, tipo)}
                    >
                      <CheckSquare size={28} color="#3DAB25" weight="fill" />
                    </Button>
                  </Tooltip>
                  <Tooltip
                    content="Rechazar Pedido"
                    showArrow={true}
                    className={"bg-[#cc0000] text-white"}
                  >
                    <Button
                      isIconOnly
                      className="bg-transparent"
                      onPress={() => onRejectPedido(pedido)}
                    >
                      <XSquare size={28} color="#cc0000" weight="fill" />
                    </Button>
                  </Tooltip>
                </>
              )}
              <Tooltip
                content={
                  pedido.datosEstrella?.sNumeroCelular
                    ? "Enviar mensaje"
                    : "No hay número registrado"
                }
                showArrow={true}
                className={"bg-[#3DAB25] text-white"}
              >
                <div>
                  <Button
                    isIconOnly
                    className="bg-transparent"
                    isDisabled={!pedido.datosEstrella?.sNumeroCelular}
                  >
                    <a
                      href={
                        pedido.datosEstrella?.sNumeroCelular
                          ? `https://web.whatsapp.com/send?phone=51${pedido.datosEstrella.sNumeroCelular}`
                          : "#"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        if (!pedido.datosEstrella?.sNumeroCelular) {
                          e.preventDefault();
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <WhatsappLogo size={26} color={
                        pedido.datosEstrella?.sNumeroCelular
                          ? "#3DAB25"
                          : "#3DAB25"
                      } />
                    </a>
                  </Button>
                </div>
              </Tooltip>
            </div>
          );
        default:
          return <span className="text-xs text-gray-600">{cellValue}</span>;
      }
    },
    []
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 py-2">
            {selectedKeys && (selectedKeys === "all" || selectedKeys.size > 0) && (
              <>
                <Chip
                  color="primary"
                  classNames={{
                    base: "bg-primary",
                    content: "text-white font-medium",
                  }}
                >
                  {selectedKeys === "all" ? pedidosData?.length : selectedKeys.size}{" "}
                  <a className="text-sm">seleccionados</a>
                </Chip>
                <Button
                  color="primary"
                  startContent={<Check size={22} />}
                  onPress={onConfirmSelected}
                  className="font-medium text-white"
                  size="sm"
                >
                  <p className="text-sm">Confirmar</p>
                </Button>
              </>
            )}
          </div>
          <Input
            color="default"
            variant="flat"
            className="w-full sm:max-w-[400px] hidden sm:block"
            placeholder="Búsqueda por nombre o DNI de la estrella"
            startContent={<MagnifyingGlass className="h-5 w-5 text-gray-500" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            isClearable
            onClear={() => setSearchValue("")}
          />
        </div>
      </div>
    );
  }, [selectedKeys, pedidosData?.length, onConfirmSelected, searchValue, setSearchValue]);

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

  return (
    <Table
      aria-label="Tabla de pedidos"
      selectionMode={selectedStatus === "POR_CONFIRMAR" ? "multiple" :"none"}// 
      selectedKeys={selectedKeys}
      onSelectionChange={onSelectionChange}
      topContent={topContent}
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={currentPage}
            total={totalPages}
            onChange={onPageChange}
          />
        </div>
      }
    >
      <TableHeader columns={selectedStatus === "POR_CONFIRMAR" ? columnsPedidosDirectora : columnsPedidosDirectoraConfirmados}>
        {(column) => (
          <TableColumn key={column.uid} align="center">
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={pedidosData} emptyContent="Aún no tienes pedidos">
        {(pedido) => (
          <TableRow
            key={pedido.id}
            className={clsx("border-t-1 bg-white p-4 shadow-md", {
              "bg-[#FEE7EF] border border-red": pedido.esDuplicado == true,
              "border-gray border-l-1 border-r-1": pedido.esDuplicado == false,
            })}
          >
            {(columnKey) => (
              <TableCell>{renderCell(pedido, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default DesktopView;