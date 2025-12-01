import { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { rejectionReasons } from "../types";

interface DeleteModalProps {
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

const DeleteModal = ({
  isOpen,
  onClose,
  pedido,
  onConfirm,
  loading,
}: DeleteModalProps) => {
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
    <Modal isOpen={isOpen} onClose={handleClose} placement="center" className="mx-4" isDismissable={false}>
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-md">
            Eliminar Pedido
          </ModalHeader>
          <ModalBody>
            {pedido && (
              <div className="space-y-4">
                <div >
                  <p className="font-semibold text-xs">Estrella:</p>
                  <p className="text-xs">
                    {pedido.estrellaNombre}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-xs">Producto:</p>
                  <p className="text-xs">{pedido.productoNombre}</p>
                </div>
                <div>
                  <p className="font-semibold text-xs">Talla/Color:</p>
                  <p className="text-xs">{pedido.tallaColor}</p>
                </div>
                <div className="mt-4">
                  <Select
                    label="Motivo de eliminación"
                    placeholder="Seleccione un motivo"
                    selectedKeys={selectedReason ? [selectedReason] : []}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    variant="bordered"
                    size="md"
                  >
                    {rejectionReasons.map((reason) => (
                      <SelectItem key={reason.key} value={reason.key}>
                        {reason.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                {/* {selectedReason && (
                  <div className="mt-2 text-xs text-gray-500">
                    ¿Estás seguro de eliminar este pedido? Esta acción no se
                    puede deshacer.
                  </div>
                )} */}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={handleClose}
              // className="mr-2"
              isDisabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="text-white"
              color="success"
              onPress={handleConfirm}
              isDisabled={!selectedReason || loading}
              isLoading={loading}
            >
              Confirmar Eliminación
            </Button>
          </ModalFooter>
        </>

      </ModalContent>
    </Modal>
  );
};

export default DeleteModal;