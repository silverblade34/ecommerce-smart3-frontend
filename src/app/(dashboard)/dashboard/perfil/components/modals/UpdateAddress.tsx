import { useValidateContact } from "@/hooks/useValidateContact";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Envelope, Pencil } from "@phosphor-icons/react";
import { FC, useState } from "react";

interface UpdateAddressProps {
  id: number;
  address?: string;
}

const UpdateAddress: FC<UpdateAddressProps> = ({ address: initialAddress, id }) => {
  const [currentAddress, setCurrentPhone] = useState(initialAddress || "");


  const {
    isOpen,
    onOpen,
    closeModal,
    value, 
    setValue,
    isLoading,
    handleUpdateDireccionValue
  } = useValidateContact({
    id,
    medium: "email",
    initialValue: initialAddress || "",
  });


  const handleOpenModal = () => {
    setValue(currentAddress || ""); // Establece el valor actual al abrir el modal
    onOpen();
  };

  // Función para manejar la actualización exitosa
  const handleSuccessfulUpdate = (newPhone: string) => {
    setCurrentPhone(newPhone);
    closeModal();
  };
  return (
    <div>
      <div className="flex flex-col ">
        <span className="text-sm font-medium text-gray-700">Dirección</span>
        <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full">
              <Envelope className="w-5 h-5 text-primary_sokso" weight="bold" />
            </div>
            <span className="text-base text-gray-800 font-medium">
              {currentAddress || "No registrada"}
            </span>
          </div>
          <Button
            isIconOnly
            className="bg-primary_sokso hover:bg-primary_sokso/90 transition-colors"
            onPress={handleOpenModal}
          >
            <Pencil className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={closeModal}
        placement="center"
        isDismissable
        classNames={{
          base: "border-0",
          header: "border-b pb-4",
          body: "py-6",
          footer: "border-t pt-4",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold text-gray-900">
                  Actualizar Dirección
                </h3>
                <p className="text-sm text-gray-500">
                  Ingresa la nueva dirección del cliente
                </p>
              </ModalHeader>

              <ModalBody>
                <div className="space-y-6">
                  <Input
                    label="Dirección"
                    placeholder="Av. Principal 123, Lima"
                    type="text"
                    value={value}
                    isDisabled={isLoading}
                    classNames={{
                      label: "text-small font-medium",
                      input: "text-small",
                      inputWrapper: [
                        "border-gray-200",
                        "transition-all duration-200",
                        value && "border-primary_sokso/50",
                      ].join(" "),
                    }}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  {/* <Button
                    className="w-full bg-primary_sokso hover:bg-primary_sokso/90 text-white"
                    onPress={handleSave}
                    isLoading={isLoading}
                    isDisabled={!value}
                    spinner={
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    }
                  >
                    Guardar dirección
                  </Button> */}
                  <Button
                    className="w-full bg-primary_sokso hover:bg-primary_sokso/90 text-white"
                    onPress={async () => { 
                      const updateSuccess = await handleUpdateDireccionValue();
                      if (updateSuccess) {
                        handleSuccessfulUpdate(value);
                      }

                    }}
                    isLoading={isLoading}
                    isDisabled={value==""}
                  >
                   Guardar Cambios
                  </Button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateAddress;
