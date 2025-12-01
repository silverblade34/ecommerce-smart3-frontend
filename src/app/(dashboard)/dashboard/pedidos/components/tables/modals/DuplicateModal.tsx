import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { Circle, FlagBanner, Siren, Warning } from "@phosphor-icons/react";
import { ResultadoPedido } from "../types";

interface DuplicateModalProps {
  isOpen: boolean;
  onClose: () => void;
  duplicateData?: ResultadoPedido | null;
  loading: boolean;
  loadingReject?: boolean;
}

export const DuplicateModal = ({
  isOpen,
  onClose,
  duplicateData,
  loading,
  loadingReject,
}: DuplicateModalProps) => {
  // Agrupar items por ID interno de la estrella
  const groupedItems = duplicateData?.itemsInvolucrados.reduce((acc, item) => {
    const idInterno = item.estrella.idInterno;
    if (!acc[idInterno]) {
      acc[idInterno] = {
        estrella: item.estrella,
        productos: []
      };
    }
    acc[idInterno].productos.push(item);
    return acc;
  }, {} as Record<string, { estrella: any; productos: any[] }>);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" placement={'center'} isDismissable={false}>
      <ModalContent className="mx-4">
        <ModalHeader className="text-lg font-semibold text-red-600 justify-center">
          <Warning size={28} color="#ead12e" weight="fill" />  ¡Stock agotado!
        </ModalHeader>
        <ModalBody className="max-h-[50vh] overflow-y-auto">
          <div className="space-y-4">
            <p className="text-md">

              Los siguientes productos ya no se encuentran disponibles, debido a su alta demanda en estos momentos.

            </p>
            <p className="text-md">
              🛍️ Productos Rechazados: Stock Insuficiente
            </p>
            <div className=" rounded-lg p-2 mt-2">
              {groupedItems && Object.entries(groupedItems).map(([idInterno, grupo], grupoIndex) => (
                <div key={idInterno} className="mb-4">
                  <div className="font-bold text-md">
                    {grupo.estrella.nombre} {grupo.estrella.apellidos}
                  </div>
                  <div>
                    {grupo.productos.map((producto, prodIndex) => (
                      <div key={`${idInterno}-${prodIndex}`}>
                        <div className="flex justify-between">
                          <span className="text-sm">
                            ● {producto.descripcion} - {producto.color} - {producto.talla}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {grupoIndex < Object.keys(groupedItems).length - 1 && (
                    <div className=" flex border-t my-3"></div>
                  )}
                </div>
              ))}
            </div>
            {/* <div className="flex mt-4">

              <FlagBanner size={20} color="#eb0505" weight="fill" />
              <p className="text-md">
                Recuerda que el stock se reserva al momento de confirmar tu pedido.
              </p>
            </div> */}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};