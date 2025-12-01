import { useState } from "react";
import { toast } from "react-toastify";
import {
  confirmarPedidoAPI,
  confirmarTodosAPI,
  eliminarPedidoAPI,
  rechazarPedidoAPI,
} from "@/server/actions/pedido";
import { ResultadoPedido } from "../types";
import { signOut } from "next-auth/react";


export const usePedidosActions = (
  refetch: () => void,
  clearSelection: () => void,
  selectedTipoCatalogo: string,
  {
    setIsStockModalOpen,
    setStockErrorMessage,
    setStockErrorPedidoId,
    stockErrorPedidoId
  }: {
    setIsStockModalOpen: (value: boolean) => void;
    setStockErrorMessage: (msg: string) => void;
    setStockErrorPedidoId: (id: string | null) => void;
    stockErrorPedidoId: string | null;
  }
) => {
  const [loadingAction, setLoadingAction] = useState({
    confirm: false,
    reject: false,
    delete: false,
    massive: false,
  });

  const [duplicateModalData, setDuplicateModalData] = useState<ResultadoPedido | null>(null);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [currentPedidoId, setCurrentPedidoId] = useState<string | null>(null);


  const handleRejectPedido = async (pedidoId: string, motivo: string) => {
    setLoadingAction(prev => ({ ...prev, reject: true }));
    try {
      const response = await rechazarPedidoAPI(pedidoId, "RECHAZADO", motivo);
      if (!response) {
        toast.error("No se recibió una respuesta del servidor.");
        return false;
      }
      if (response.success) {
        toast.success(response.message);
        await refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error("Error en handleUpdateStatus:", error);
      toast.error("Ocurrió un error inesperado al actualizar el estado.");
      return false;
    } finally {
      setLoadingAction(prev => ({ ...prev, reject: false }));
    }
  };

  const handleRejectDuplicate = async () => {
    if (!currentPedidoId) return;

    setLoadingAction(prev => ({ ...prev, reject: true }));
    try {
      const success = await handleRejectPedido(currentPedidoId, "PEDIDO DUPLICADO");
      if (success) {
        setIsDuplicateModalOpen(false);
      }
      return success;
    } finally {
      setLoadingAction(prev => ({ ...prev, reject: false }));
      setCurrentPedidoId(null);
    }
  };
  const handleRejectFromStockModal = async () => {
    if (!stockErrorPedidoId) return;
    try {
      const response = await rechazarPedidoAPI(stockErrorPedidoId, "RECHAZADO", "PRODUCTO AGOTADO");
      if (!response) {
        toast.error("No se recibió una respuesta del servidor.");
        return false;
      }
      if (response.status === 401) {
        localStorage.clear();
        signOut({ callbackUrl: "/" });
      }
      if (response.success) {
        toast.success(response.message);
        setIsStockModalOpen(false);
        setStockErrorPedidoId(null);
        setStockErrorMessage("");
        await refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error("Error en handleUpdateStatus:", error);
      toast.error("Ocurrió un error inesperado al actualizar el estado.");
      return false;
    } finally {
      setLoadingAction(prev => ({ ...prev, delete: false }));
    }



  };
  const handleDeletePedido = async (pedidoId: string, motivo: string) => {
    setLoadingAction(prev => ({ ...prev, delete: true }));
    try {
      const response = await eliminarPedidoAPI(pedidoId, "ELIMINADO", motivo);
      if (!response) {
        toast.error("No se recibió una respuesta del servidor.");
        return false;
      }
      if (response.status === 401) {
        localStorage.clear();
        signOut({ callbackUrl: "/" });
      }
      if (response.success) {
        toast.success(response.message);
        await refetch();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error("Error en handleUpdateStatus:", error);
      toast.error("Ocurrió un error inesperado al actualizar el estado.");
      return false;
    } finally {
      setLoadingAction(prev => ({ ...prev, delete: false }));
    }
  };


  const handleConfirmarPedido = async (pedidoId: string, tipo: string) => {

    try {
      setLoadingAction(prev => ({ ...prev, confirm: true }));
      const response = await confirmarPedidoAPI(pedidoId, "CONFIRMADO");
      console.log("respo12", response)
      if (!response) {
        toast.error("No se recibió una respuesta del servidor.");
        return false;
      }
      console.log("respo12", response)
      if (response.status === 401) {
        localStorage.clear();
        signOut({ callbackUrl: "/" });
      }

      if (response.success) {
        toast.success("Pedido confirmado correctamente");
        await refetch();
        clearSelection();
        return true;
      } else {
        if (response.isStockError) {
          setStockErrorMessage(response.message || "Error de stock");
          setStockErrorPedidoId(pedidoId);
          setIsStockModalOpen(true);
          return false;
        } else if (response.isDuplicate) {
          setDuplicateModalData(response.data);
          setIsDuplicateModalOpen(true);
        } else {
          toast.error(response.message || "Error al confirmar");
        }
        return false;
      }
    } catch (error) {
      console.log(error)
      toast.error("Error inesperado");
      return false;
    } finally {
      setLoadingAction(prev => ({ ...prev, confirm: false }));
    }
  };

  const handleMultipleConfirmar = async (selectedPedidos: string[]) => {

    if (selectedPedidos.length === 0) {
      toast.warning("No hay pedidos seleccionados");
      return;
    }
    setLoadingAction(prev => ({ ...prev, confirm: true }));
    try {
      const response = await confirmarTodosAPI(selectedTipoCatalogo, selectedPedidos);
      if (!response) {
        toast.error("No se recibió una respuesta del servidor.");
        return false;
      }
      if (response.status === 401) {
        localStorage.clear();
        signOut({ callbackUrl: "/" });
      }
      if (response.success) {
        if (response.data.itemsInvolucrados.length > 0) {
          setDuplicateModalData(response.data);
          setIsDuplicateModalOpen(true);
        } else {
          toast.success(response.message);
        }
        await refetch();
        clearSelection();
        return true;
      } else {
        toast.error(response.message);
        return false;
      }
    } catch (error) {
      console.error("Error en handleUpdateStatus:", error);
      toast.error("Ocurrió un error inesperado al actualizar el estado.");
      return false;
    } finally {
      setLoadingAction(prev => ({ ...prev, confirm: false }));
    }

  };



  return {
    loadingAction,
    handleConfirmarPedido,
    handleRejectPedido,
    handleDeletePedido,
    // handleConfirmSelectedAll,
    handleMultipleConfirmar,
    // handleForceConfirm,
    duplicateModalData,
    isDuplicateModalOpen,
    setIsDuplicateModalOpen,
    handleRejectDuplicate,

    handleRejectFromStockModal,
    setIsStockModalOpen
  };
};