import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Select, SelectItem } from "@heroui/react";
import { rejectionReasons } from "../types";
import { useState } from "react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: {
    id: string;
    estrellaNombre: string;
    productoNombre: string;
    tallaColor: string
  } | null;
  onConfirm: (pedidoId: string, motivo: string) => void;
  loading: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  pedido,
  onConfirm,
  loading,
}) => {
  const [selectedReason, setSelectedReason] = useState("");

  const handleConfirm = () => {
    if (pedido && selectedReason) {
      onConfirm(pedido.id, selectedReason);
      setSelectedReason("");
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} placement={"center"} className="mx-4" isDismissable={false}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-md">
          Rechazar Pedido
        </ModalHeader>
        <ModalBody>
          {pedido && (
            <div className="space-y-4">
              <div >
                <p className="font-semibold text-xs">Estrella:</p>
                <p className="text-xs">{pedido.estrellaNombre}</p>
              </div>
              <div>
                <p className="font-semibold text-xs">Producto:</p>
                <p className="text-xs">{pedido.productoNombre}</p>
              </div>
              <div>
                <p className="font-semibold text-xs">Talla/Color:</p>
                <p className="text-xs">{pedido.tallaColor}</p>
              </div>

              <Select
                label="Motivo de rechazo"
                placeholder="Seleccione un motivo"
                onChange={(e) => setSelectedReason(e.target.value)}
                size="md"
                variant="bordered"
              >
                {rejectionReasons.map((reason) => (
                  <SelectItem key={reason.key} value={reason.key} >
                    {reason.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={handleClose}>
            Cancelar
          </Button>
          <Button
            isLoading={loading}
            color="success"
            onPress={handleConfirm}
            isDisabled={!selectedReason || loading}
            className="text-white"
          >
            Confirmar Rechazo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RejectModal;