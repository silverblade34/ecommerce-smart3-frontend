import { ClienteEstrella } from "@/lib/interfaces/clientes";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Chip,
  useDisclosure,
  Pagination,
  Spinner,
} from "@heroui/react";
import { CaretDown, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import React from "react";
import ClientDetailModal from "../modal/ModalDetalleCliente";
import useIsMobile from "@/hooks/useIsMobile";
import MobileCard from "../card/MobileEstrella";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const columns = [
  { name: "NOMBRES COMPLETOS", uid: "nombre", sortable: true },
  { name: "DOCUMENTO", uid: "sNumeroDocumento", sortable: true },
  { name: "CELULAR", uid: "sTelefono", sortable: true },
  { name: "FECHA REGISTRO", uid: "dFechaRegistro", sortable: true },
  { name: "ORIGEN", uid: "sOrigen", sortable: true },
  { name: "ACCIONES", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "nombre",
  "sNumeroDocumento",
  "sTelefono",
  "dFechaRegistro",
  "sOrigen",
  "actions",
];

type Props = {
  estrellas: ClienteEstrella[];
  loading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  onBuscar: () => void;
  onOpenCreate: () => void;
};

export default function TableEstrellas({
  estrellas,
  loading,
  page,
  totalPages,
  totalItems,
  search,
  setPage,
  setSearch,
  onBuscar,
  onOpenCreate,
}: Props) {
  const isMobile = useIsMobile();
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedClient, setSelectedClient] = React.useState<ClienteEstrella>();

  const handleViewDetails = (cliente: ClienteEstrella) => {
    setSelectedClient(cliente);
    onOpen();
  };

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const renderCell = React.useCallback(
    (estrella: ClienteEstrella, columnKey: React.Key) => {
      switch (columnKey) {
        case "nombre":
          return (
            <div className="flex flex-col">
              <p className="font-medium text-sm text-default-900">
                {`${estrella.sNombre} ${estrella.sApellidos}`}
              </p>
              <p className="text-xs text-default-500">{estrella.sEmail}</p>
            </div>
          );
        case "sNumeroDocumento":
          return (
            <Chip className="capitalize" size="sm" variant="flat">
              {estrella.sNumeroDocumento}
            </Chip>
          );
        case "sTelefono":
          return <p className="text-sm">{estrella.sTelefono}</p>;
        case "dFechaRegistro":
          return (
            <p className="text-sm text-default-600">
              {dayjs(estrella.dtFechaCreacion)
                .utc()
                .format("DD/MM/YYYY HH:mm")}
            </p>
          );
        case "sOrigen":
          return (
            <p className="text-sm text-default-600">
              {estrella.sOrigenRegistro === "Ecommerce"
                ? "Registro Directo"
                : "Registro Smart"}
            </p>
          );
        case "actions":
          return (
            <div className="flex justify-center">
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => handleViewDetails(estrella)}
              >
                Ver detalles
              </Button>
            </div>
          );
        default:
          return (
            <p className="text-sm text-default-600">{`${columnKey}`}</p>
          );
      }
    },
    [handleViewDetails]
  );

  const topContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-end">
        {/* 🔍 Input + botón Buscar */}
        <div className="flex w-full sm:max-w-[44%] gap-2">
          <Input
            isClearable
            placeholder="Buscar por nombre, documento o teléfono..."
            startContent={<MagnifyingGlass className="text-default-400" />}
            value={search}
            onClear={() => setSearch("")}
            onValueChange={setSearch}
            size="sm"
          />
          <Button
            color="primary"
            size="sm"
            className="bg-primary_sokso"
            onPress={onBuscar}
          >
            Buscar
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            onPress={onOpenCreate}
            color="primary"
            className="bg-primary_sokso"
            startContent={<Plus className="h-5 w-5" aria-hidden="true" />}
            size="sm"
          >
            Nueva Estrella
          </Button>

          {!isMobile && (
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<CaretDown className="text-small" />}
                  variant="flat"
                  size="sm"
                >
                  Columnas
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Columnas de la Tabla"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-default-500 text-sm">
          Total:{" "}
          <span className="font-medium text-default-700">{totalItems}</span>{" "}
          clientes
        </span>
      </div>
    </div>
  );

  return (
    <>
      {topContent}

      {isMobile ? (
        <div className="flex flex-col gap-4 mt-4">
          {estrellas.length === 0 ? (
            <div className="text-center text-default-500 py-8">
              No se encontraron clientes
            </div>
          ) : (
            estrellas.map((cliente) => (
              <MobileCard
                key={cliente.nIdCliente}
                cliente={cliente}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      ) : (
        <Table
          isHeaderSticky
          aria-label="Tabla de clientes estrellas"
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[600px]",
            th: "bg-default-100 text-default-800 text-xs",
            td: "py-3",
          }}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody
            isLoading={loading}
            loadingContent={<Spinner label="Cargando..." />}
            emptyContent={"No se encontraron clientes"}
            items={estrellas}
          >
            {(item) => (
              <TableRow key={item.nIdCliente}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-center mt-4">
        <Pagination
          total={totalPages}
          page={page}
          onChange={setPage}
          showControls
          size="sm"
          variant="flat"
          color="primary"
        />
      </div>

      <ClientDetailModal
        client={selectedClient}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    </>
  );
}
