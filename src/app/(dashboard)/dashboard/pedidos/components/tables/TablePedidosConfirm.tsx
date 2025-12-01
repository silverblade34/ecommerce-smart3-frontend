
import { useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import { Pedido, statusOptions } from "./types";
import { usePedidosData } from "./hooks/usePedidosData";
import { usePedidosActions } from "./hooks/usePedidosActions";
import DesktopView from "./views/DesktopView";
import MobileView from "./views/MobileView";
import { Select, SelectItem, Input, Selection } from "@heroui/react";
import { MagnifyingGlass, ArrowsClockwise } from "@phosphor-icons/react";
import DeleteModal from "./modals/DeleteModal";
import RejectModal from "./modals/RejectModal";
import StockModal from "./modals/StockModal";
import { DuplicateModal } from "./modals/DuplicateModal";
// import { DuplicateModal } from "./modals/DuplicateModal";
type TipoCatalogo = "CYBER" | "PREVENTA" | "REGULAR" | "GRATIS";



const PedidosConfirmar = () => {
  const isMobile = useIsMobile();
  const savedTipoCatalogo = localStorage.getItem("tipoCatalogo") || "REGULAR"
  const [selectedStatus, setSelectedStatus] = useState("POR_CONFIRMAR");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedTipoCatalogo, setSelectedTipoCatalogo] = useState(savedTipoCatalogo);

  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [selectedPedidos, setSelectedPedidos] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockErrorMessage, setStockErrorMessage] = useState("");
  const [stockErrorPedidoId, setStockErrorPedidoId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const [pedidoToAction, setPedidoToAction] = useState<{
    id: string;
    estrellaNombre: string;
    productoNombre: string;
    tallaColor: string;
  } | null>(null);

  const {
    pedidos,
    pedidosData,
    loading,
    refetch,
    searchValue,
    setSearchValue,
    nombreEstrella,
    tiposCatalogo,
    ultimaSincronizacion,
    cantidadesPendientes
  } = usePedidosData(
    selectedTipoCatalogo,
    selectedStatus,
    currentPage,
    rowsPerPage
  );
  const clearSelection = () => {
    setSelectedKeys(new Set([]));
    setSelectedPedidos([]);
    setSelectAll(false);
  };
  const {
    loadingAction,
    handleConfirmarPedido,
    handleRejectPedido,
    handleDeletePedido,
    // handleConfirmSelectedAll,
    handleMultipleConfirmar,
    handleRejectFromStockModal,


    // handleForceConfirm,
    duplicateModalData,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    // handleRejectDuplicate,
  } = usePedidosActions(
    refetch,
    clearSelection,
    selectedTipoCatalogo,
    {
      setIsStockModalOpen,
      setStockErrorMessage,
      setStockErrorPedidoId,
      stockErrorPedidoId,
    }
  );



  const handleSelectionChange = (selection: Selection) => {
    setSelectedKeys(selection);
    if (selection === "all") {
      setSelectedPedidos(pedidosData?.map((p) => p.id));
      setSelectAll(true);
    } else {
      const selectedArray = Array.from(selection as Set<string>);
      setSelectedPedidos(selectedArray);
      setSelectAll(selectedArray.length === pedidosData.length);
    }
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    const newSelectedPedidos = newSelectAll
      ? pedidosData.map((pedido) => pedido.id)
      : [];
    setSelectedPedidos(newSelectedPedidos);
    setSelectAll(newSelectAll);
    setSelectedKeys(
      newSelectAll ? new Set(pedidosData.map((p) => p.id)) : new Set([])
    );
  };

  const handleSelectPedido = (code: string) => {
    const newSelectedPedidos = selectedPedidos.includes(code)
      ? selectedPedidos.filter((pedidoCode) => pedidoCode !== code)
      : [...selectedPedidos, code];
    setSelectedPedidos(newSelectedPedidos);
    setSelectAll(newSelectedPedidos.length === pedidosData.length);
    setSelectedKeys(new Set(newSelectedPedidos));
  };

  const openActionModal = (
    pedido: Pedido,
    actionType: 'delete' | 'reject'
  ) => {
    setPedidoToAction({
      id: pedido.id,
      estrellaNombre: `${pedido.datosEstrella.sNombre} ${pedido.datosEstrella.sApellidos}`,
      productoNombre: pedido.datosItem.descripcion,
      tallaColor: `${pedido.datosItem.talla}` + " - " + `${pedido.datosItem.color}`
    });
    return actionType === 'delete' ? setIsDeleteModalOpen(true) : setIsRejectModalOpen(true);
  };

  const handleActionConfirm = async (
    pedidoId: string,
    motivo: string,
    actionType: 'delete' | 'reject'
  ) => {
    const actionHandler = actionType === 'delete'
      ? handleDeletePedido
      : handleRejectPedido;

    const success = await actionHandler(pedidoId, motivo);
    if (success) {
      return actionType === 'delete' ? setIsDeleteModalOpen(false) : setIsRejectModalOpen(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    if (value == "CONFIRMADO") {
      localStorage.setItem("tipoCatalogo", "");
      setSelectedTipoCatalogo("")
    } else {
      setSelectedTipoCatalogo(savedTipoCatalogo)
    }
    setCurrentPage(1);
    setSelectedKeys(new Set([]));
    setSelectedPedidos([]);
    setSelectAll(false);
  };

  const handleTipoCatalogoChange = (value: string) => {
    localStorage.setItem("tipoCatalogo", value);

    setSelectedTipoCatalogo(value);
    setCurrentPage(1);
  };


  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setStockErrorPedidoId(null);
    setStockErrorMessage("");
  };


  const handleSelectMultiplePedidos = (nuevosSeleccionados: string[]) => {
    setSelectedPedidos(nuevosSeleccionados);
  };
  return (
    <div className="pb-4 ">
      <div className="w-full justify-between sm:flex items-center pt-2">
        <Select
          className="w-full sm:w-64  col-span-1 mb-2"
          selectedKeys={[selectedStatus]}
          onChange={(e) => handleStatusChange(e.target.value)}
          disallowEmptySelection
          variant="flat"
          color="secondary"
          size="sm"

        >
          {statusOptions.map((item) => (
            <SelectItem key={item.key} value={item.key} className="text-xs">
              {item.label}
            </SelectItem>
          ))}
        </Select>

        {selectedStatus === "POR_CONFIRMAR" && !loading && (
          <div className="grid grid-cols-3 gap-3 mb-2 sm:flex sm:justify-between">
            {tiposCatalogo?.map((tipo: string) => {
              const key = tipo.toUpperCase() as TipoCatalogo;
              const cantidad = cantidadesPendientes[key];
              const estaSeleccionado = selectedTipoCatalogo === tipo;

              return (
                <button
                  key={tipo}
                  className={`cart-icon relative flex w-24 cursor-pointer items-center justify-center rounded-lg border-2 p-1
            ${estaSeleccionado
                      ? 'border-primary_sokso bg-primary_sokso text-white'
                      : 'border-primary_sokso bg-white text-primary_sokso'
                    }`}
                  onClick={() => handleTipoCatalogoChange(tipo)}
                >
                  <p className="text-xs">
                    {tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase() : ""}{/*SE QUITÓ VENTA FLASH == "Cyber" ? "Venta Flash" : tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase()*/}
                  </p>
                  <span className={`absolute right-0 top-0 -mr-1 -mt-1 flex h-5 w-5 items-center justify-center rounded-full text-xs
                        ${cantidad > 0 ? 'bg-red text-white' : 'bg-gray-200 text-gray-600'}
                      `}>
                    {cantidad}
                  </span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      <Input
        color="secondary"
        variant="flat"
        className="w-full sm:max-w-[100%] mb-4 sm:hidden"
        placeholder="Búsqueda por nombre o dni de la estrella"
        startContent={<MagnifyingGlass className="h-5 w-5 text-gray-500" />}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        isClearable
        onClear={() => setSearchValue("")}
      />

      {ultimaSincronizacion && selectedStatus == "POR_CONFIRMAR" && (
        <div className="flex justify-end mb-4 items-center gap-2">
          <span className="text-xs text-gray-400">
            Últ. actualización: {ultimaSincronizacion}
          </span>

          <button onClick={() => refetch()}>
            <ArrowsClockwise size={20} color="#006FEE" weight="bold" />
          </button>
        </div>
      )}

      {/* {isMobile ? ( */}
      <MobileView
        tipo={selectedTipoCatalogo}
        pedidosData={pedidosData}
        loading={loading || loadingAction.confirm || loadingAction.massive}
        selectedStatus={selectedStatus}
        selectedPedidos={selectedPedidos}
        selectAll={selectAll}
        onSelectPedido={handleSelectPedido}
        onSelectAll={handleSelectAll}
        onConfirmPedido={handleConfirmarPedido}
        onRejectPedido={(pedido) => openActionModal(pedido, 'reject')}
        onDeletePedido={(pedido) => openActionModal(pedido, 'delete')}
        onConfirmSelected={
          // nombreEstrella === "" && selectAll
          //   ? handleConfirmSelectedAll
          //   : 
          () => handleMultipleConfirmar(selectedPedidos)
        }
        onSelectMultiplePedidos={handleSelectMultiplePedidos}
        currentPage={currentPage}
        totalPages={pedidos?.data?.totalPages || 1}
        onPageChange={handlePageChange}
      />
      {/* ) : (
        <DesktopView
          tipo={selectedTipoCatalogo}
          pedidosData={pedidosData}
          loading={loading || loadingAction.confirm || loadingAction.massive}
          selectedStatus={selectedStatus}
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
          onConfirmPedido={handleConfirmarPedido}
          onRejectPedido={(pedido) => openActionModal(pedido, 'reject')}
          onDeletePedido={(pedido) => openActionModal(pedido, 'delete')}
          onConfirmSelected={
            // (nombreEstrella === "" && selectedKeys === "all")
            //   ? handleConfirmSelectedAll
            //   :
               () => handleMultipleConfirmar(selectedPedidos)
          }
          currentPage={currentPage}
          totalPages={pedidos?.data?.totalPages || 1}
          onPageChange={handlePageChange}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      )} */}
      <StockModal
        isOpen={isStockModalOpen}
        onClose={handleCloseStockModal}
        errorMessage={stockErrorMessage}
        onConfirmReject={handleRejectFromStockModal}
        loading={loadingAction.reject}
      />
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        pedido={pedidoToAction}
        onConfirm={(id, motivo) => handleActionConfirm(id, motivo, 'delete')}
        loading={loadingAction.delete}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        pedido={pedidoToAction}
        onConfirm={(id, motivo) => handleActionConfirm(id, motivo, 'reject')}
        loading={loadingAction.reject}
      />
      <DuplicateModal
        isOpen={isDuplicateModalOpen}
        onClose={() => setIsDuplicateModalOpen(false)}
        // onConfirm={handleForceConfirm}
        // onReject={handleRejectDuplicate} 
        duplicateData={duplicateModalData}
        loading={loadingAction.confirm}
        loadingReject={loadingAction.reject}
      />
    </div>
  );
};

export default PedidosConfirmar;