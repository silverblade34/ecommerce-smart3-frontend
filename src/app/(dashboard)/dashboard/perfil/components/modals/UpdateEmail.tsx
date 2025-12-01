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

interface UpdateEmailProps {
  id: number;
  email?: string;
  onUpdated?: () => void;
}

const CodeInputs: FC<{
  codeValue: string;
  updateCodeValue: (index: number, value: string) => void;
  onResend: () => void;
  isLoading: boolean;
}> = ({ codeValue, updateCodeValue, onResend, isLoading }) => (
  <div className="flex flex-col space-y-4">
    <div className="text-sm text-gray-600 text-center">
      Ingresa el código de verificación enviado a tu correo
    </div>
    <div className="flex justify-center gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <Input
          key={index}
          type="text"
          maxLength={1}
          classNames={{
            input: "text-center text-xl font-semibold h-12 w-12",
            inputWrapper: [
              "hover:border-primary_sokso focus-within:!border-primary_sokso",
              "transition-all duration-200 ease-in-out",
              codeValue[index] && "border-primary_sokso/50",
            ].join(" "),
          }}
          value={codeValue[index] || ""}
          isDisabled={isLoading}
          onChange={(e) => {
            const value = e.target.value;
            if (!/^\d*$/.test(value)) return; // Solo permitir números
            updateCodeValue(index, value);
            if (value && index < 3) {
              const nextInput = document.querySelector(
                `input[name=code-${index + 1}]`
              );
              (nextInput as HTMLInputElement)?.focus();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !codeValue[index] && index > 0) {
              const prevInput = document.querySelector(
                `input[name=code-${index - 1}]`
              );
              (prevInput as HTMLInputElement)?.focus();
            }
            if (e.key === "ArrowLeft" && index > 0) {
              const prevInput = document.querySelector(
                `input[name=code-${index - 1}]`
              );
              (prevInput as HTMLInputElement)?.focus();
            }
            // Handle right arrow
            if (e.key === "ArrowRight" && index < 3) {
              const nextInput = document.querySelector(
                `input[name=code-${index + 1}]`
              );
              (nextInput as HTMLInputElement)?.focus();
            }
          }}
          onPaste={(e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData("text");
            const numbers = pastedData.replace(/\D/g, "").slice(0, 4);
            numbers.split("").forEach((num, idx) => {
              if (idx < 4) updateCodeValue(idx, num);
            });
          }}
          name={`code-${index}`}
        />
      ))}
    </div>
    <div className="text-center text-sm text-gray-500 mt-2">
      ¿No recibiste el código?
      <button
        onClick={onResend}
        disabled={isLoading}
        className="text-primary_sokso hover:underline ml-1 disabled:opacity-50 disabled:no-underline"
      >
        Reenviar
      </button>
    </div>
  </div>
);

const UpdateEmail: FC<UpdateEmailProps> = ({ email:initialEmail, id ,onUpdated}) => {
    const [currentPhone, setCurrentPhone] = useState(initialEmail || "");
  
  const {
    isOpen,
    onOpen,
    closeModal,
    value,
    isCodeSent,
    setValue,
    handleSendCode,
    codeValue,
    updateCodeValue,
    handleVerifyCode,
    handleResendCode,
    isLoading,
    handleUpdateValue
  } = useValidateContact({
    id,
    medium: "email",
    initialValue: initialEmail || "",
  });


  const handleOpenModal = () => {
    setValue(currentPhone || ""); // Establece el valor actual al abrir el modal
    onOpen();
  };

  // Función para manejar la actualización exitosa
  const handleSuccessfulUpdate = (newPhone: string) => {
    setCurrentPhone(newPhone);
    closeModal();
    onUpdated?.(); 

  };

  return (
    <div>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-700">Correo</span>
        <div className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-1">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full">
              <Envelope className="w-5 h-5 text-primary_sokso" weight="bold" />
            </div>
            <span className="text-base text-gray-800 font-medium">
              {currentPhone || "No registrado"}
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
        isDismissable={false}
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
                  Actualizar Correo
                </h3>
                <p className="text-sm text-gray-500">
                  Ingresa tu nuevo correo y te enviaremos un código de
                  verificación
                </p>
              </ModalHeader>

              <ModalBody>
                {!isCodeSent ? (
                  <div className="space-y-6">
                    <Input
                      label="Correo electrónico"
                      placeholder="ejemplo@correo.com"
                      type="email"
                      value={value}
                      isDisabled={isLoading}
                      startContent={
                        <Envelope className="text-gray-400 w-4 h-4 flex-shrink-0" />
                      }
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !isLoading && value) {
                          handleSendCode();
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-primary_sokso hover:bg-primary_sokso/90 text-white"
                      onPress={handleSendCode}
                      isLoading={isLoading}
                      isDisabled={!value}
                      spinner={
                        <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                      }
                    >
                      Enviar código de verificación
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <CodeInputs
                      codeValue={codeValue}
                      updateCodeValue={updateCodeValue}
                      onResend={handleResendCode}
                      isLoading={isLoading}
                    />
                    <Button
                      className="w-full bg-primary_sokso hover:bg-primary_sokso/90 text-white"
                      onPress={async () => {
                        const isValid = await handleVerifyCode();
                        if (isValid) {
                          const updateSuccess = await handleUpdateValue();
                          if (updateSuccess) {
                            handleSuccessfulUpdate(value);
                          }
                        }
                      }}
                      isLoading={isLoading}
                      isDisabled={codeValue.length !== 4}
                    >
                      Verificar código
                    </Button>
                  </div>
                )}
              </ModalBody>
              
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UpdateEmail;
