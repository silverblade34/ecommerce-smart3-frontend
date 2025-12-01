import { useValidateContact } from "@/hooks/useValidateContact";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";
import { Pencil, Phone } from "@phosphor-icons/react";
import { FC, useState } from "react";

interface UpdatePhoneProps {
  id: number;
  phone?: string;
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
      Ingresa el código de verificación enviado a tu celular
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
              "hover:border-primary focus-within:!border-primary",
              "transition-all duration-200 ease-in-out",
              codeValue[index] && "border-primary/50",
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
        className="text-primary hover:underline ml-1 disabled:opacity-50 disabled:no-underline"
      >
        Reenviar
      </button>
    </div>
  </div>
);

const UpdatePhone: FC<UpdatePhoneProps> = ({ phone: initialPhone, id ,onUpdated}) => {
  const [currentPhone, setCurrentPhone] = useState(initialPhone || "");
  
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
    handleUpdateValue,
    isLoading,
  } = useValidateContact({
    id,
    medium: "sms",
    initialValue: initialPhone || "",
  });


  const handleOpenModal = () => {
    setValue(currentPhone || ""); // Establece el valor actual al abrir el modal
    onOpen();
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericValue = input.replace(/\D/g, "");
    if (numericValue.length > 0 && numericValue[0] !== "9") return;
    const truncatedValue = numericValue.slice(0, 9);
    setValue(truncatedValue);
  };

  const isValidPhoneNumber = value.length === 9 && value.startsWith("9");

  const handleSuccessfulUpdate = (newPhone: string) => {
    setCurrentPhone(newPhone);
    closeModal();
    onUpdated?.(); 
  };

  return (
    <div>
      <div className="flex flex-col ">
        <span className="text-sm font-medium text-gray-700">Celular</span>
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-1 transition-colors hover:bg-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary_sokso/10">
              <Phone className="h-5 w-5 text-primary_sokso" weight="bold" />
            </div>
            <span className="text-base font-medium text-gray-800">
              {currentPhone || "No registrado"}
            </span>
          </div>
          <Button
            isIconOnly
            className="bg-primary_sokso transition-colors hover:bg-primary_sokso/90"
             onPress={handleOpenModal}
          >
            <Pencil className="h-4 w-4 text-white" />
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={closeModal}
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
                  Actualizar Celular
                </h3>
                <p className="text-sm text-gray-500">
                  Ingresa tu nuevo número y te enviaremos un código de
                  verificación
                </p>
              </ModalHeader>

              <ModalBody>
                {!isCodeSent ? (
                  <div className="space-y-6">
                    <Input
                      label="Número de celular"
                      placeholder="Ej: 999888777"
                      type="tel"
                      value={value}
                      isDisabled={isLoading}
                      startContent={
                        <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      }
                      description={
                        !isValidPhoneNumber && value.length > 0
                          ? "El número debe empezar con 9 y tener 9 dígitos"
                          : ""
                      }
                      isInvalid={!isValidPhoneNumber && value.length > 0}
                      classNames={{
                        label: "text-small font-medium",
                        input: "text-small",
                        inputWrapper: [
                          "border-gray-200",
                          "transition-all duration-200",
                          value && isValidPhoneNumber && "border-primary/50",
                          value && !isValidPhoneNumber && "border-danger",
                        ].join(" "),
                      }}
                      onChange={handlePhoneChange}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          !isLoading &&
                          isValidPhoneNumber
                        ) {
                          handleSendCode();
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-primary_sokso hover:bg-primary_sokso/90 text-white"
                      onPress={handleSendCode}
                      isLoading={isLoading}
                      isDisabled={!isValidPhoneNumber}
                      spinner={
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50  border-t-white" />
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

export default UpdatePhone