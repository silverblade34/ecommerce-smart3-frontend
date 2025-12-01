
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Button } from "@heroui/react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
  onConfirmReject: () => void;
  loading?: boolean;
}

const StockModal: React.FC<Props> = ({
  isOpen,
  onClose,
  errorMessage,
  onConfirmReject,
  loading
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="opaque">
      <ModalContent>
        <ModalHeader className="text-red font-semibold">Alerta</ModalHeader>
        <ModalBody>
          <b className="text-sm text-black">{errorMessage}</b>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>Cancelar</Button>
          <Button color="danger" onPress={onConfirmReject} isLoading={loading}>
            Confirmar Rechazo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StockModal;
