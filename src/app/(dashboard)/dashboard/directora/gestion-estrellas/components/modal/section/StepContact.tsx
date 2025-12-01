import {
  Dispatch,
  SetStateAction,
  // useCallback,
  useEffect,
  useState,
} from "react";

import { StepValidation } from "@/hooks/useCreateClient";
import { ClientPayload } from "@/lib/validations/cliente";
// import { sendCodeService } from "@/server/actions/client";
// import { Alert, Button, Input, InputOtp } from "@heroui/react";
import { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { Input } from "@heroui/react";
// import { toast } from "react-toastify";

type Props = {
  register: UseFormRegister<ClientPayload>;
  errors: FieldErrors<ClientPayload>;
  watch: UseFormWatch<ClientPayload>;

  isPhoneVerified: boolean;
  setIsPhoneVerified: (value: boolean) => void;
  verificationCode: string;
  setVerificationCode: (value: string) => void;

  setStepValidations: Dispatch<SetStateAction<Record<number, StepValidation>>>;
};
const StepContact = ({
  errors,
  register,
  watch,
  isPhoneVerified,
  // setIsPhoneVerified,
  // verificationCode,
  // setVerificationCode,
  setStepValidations,
}: Props) => {
  // const [phoneCode, setPhoneCode] = useState<number | null>(null);
  // const [isValidatingPhone, setIsValidatingPhone] = useState(false);
  const [showVerificationSection] = useState(false);
  // const [verificationError, setVerificationError] = useState<string | null>(
  //   null
  // );

// const handleSendPhoneCode = useCallback(async (phone: string) => {
//   try {
//     setIsValidatingPhone(true);
//     setVerificationError(null);

//     const response = await sendCodeService("sms", phone);
//     console.log("response", response);

//     // Validar si el número ya está registrado
//     if (response.success === false || response.message === "El número de teléfono ya está registrado") {
//       toast.warning(response.message || "El número ya está registrado");
//       return null;
//     }

//     // Validar si se envió correctamente el código
//     if (response.code && response.message === "Código de verificación enviado correctamente al teléfono") {
//       setPhoneCode(response.code);
//       setShowVerificationSection(true);
//       // console.log("Phone code:", response.code);
//       return response;
//     }

//     // En cualquier otro caso, mostrar un mensaje genérico
//     toast.error("No se pudo enviar el código de verificación");
//     return null;

//   } catch (err) {
//     console.error("Error sending phone code", err);
//     setVerificationError("Error al enviar el código");
//     return null;
//   } finally {
//     setIsValidatingPhone(false);
//   }
// }, []);

  // const verifyPhoneCode = useCallback(
  //   (inputCode: number) => {
  //     if (inputCode === phoneCode) {
  //       setIsPhoneVerified(true);
  //       setVerificationError(null);
  //       setShowVerificationSection(false);
  //       return true;
  //     }
  //     setVerificationError("Código incorrecto");
  //     return false;
  //   },
  //   [phoneCode, setIsPhoneVerified]
  // );

  // const handleClearVerification = useCallback(() => {
  //   setIsPhoneVerified(false);
  //   setPhoneCode(null);
  //   setVerificationCode("");
  //   setShowVerificationSection(false);
  //   setVerificationError(null);
  // }, [setIsPhoneVerified, setVerificationCode]);

  // ... resto del código de efectos ...
  const watchEmail = watch("infoCliente.contacto.sEmail");
  const watchPhone = watch("infoCliente.contacto.sTelefono");

  useEffect(() => {
    setStepValidations((prev) => ({
      ...prev,
      4: {
        isValid:
          !!watchEmail?.trim() &&
          !!watchPhone?.trim() &&
          !errors.infoCliente?.contacto?.sEmail &&
          !errors.infoCliente?.contacto?.sTelefono ,
          // &&  isPhoneVerified,

        errors: errors.infoCliente?.contacto
          ? ["Por favor complete todos los campos correctamente"]
          : undefined,
      },
    }));
  }, [
    watchEmail,
    watchPhone,
    errors.infoCliente?.contacto?.sEmail,
    errors.infoCliente?.contacto?.sTelefono,
    // isPhoneVerified,
    setStepValidations,
    errors.infoCliente?.contacto,
    // verificationCode,
  ]);
  return (
    <>
      <Input
        label="Correo electrónico"
        placeholder="Ingrese correo electrónico"
        {...register("infoCliente.contacto.sEmail")}
        isInvalid={!!errors.infoCliente?.contacto?.sEmail}
        errorMessage={errors.infoCliente?.contacto?.sEmail?.message}
      
      />
      <Input
        label="Número telefónico"
        placeholder="Ingrese número telefónico"
        {...register("infoCliente.contacto.sTelefono")}
        isDisabled={showVerificationSection || isPhoneVerified}
        isInvalid={!!errors.infoCliente?.contacto?.sTelefono}
        errorMessage={errors.infoCliente?.contacto?.sTelefono?.message}
      />


      {/* <div className="col-span-2 space-y-4">
        <div className="flex gap-2">
          <Input
            label="Número telefónico"
            placeholder="Ingrese número telefónico"
            {...register("infoCliente.contacto.sTelefono")}
            isDisabled={showVerificationSection || isPhoneVerified}
            isInvalid={!!errors.infoCliente?.contacto?.sTelefono}
            errorMessage={errors.infoCliente?.contacto?.sTelefono?.message}
            className="flex-1"
          />
          <div className="flex items-end gap-2">
            {!isPhoneVerified ? (
              <Button
                type="button"
                isDisabled={
                  watch("infoCliente.contacto.sTelefono")?.length !== 9 ||
                  showVerificationSection
                }
                isLoading={isValidatingPhone}
                onPress={() =>
                  handleSendPhoneCode(watch("infoCliente.contacto.sTelefono"))
                }
                className="min-w-[120px]"
              >
                Enviar código
              </Button>
            ) : (
              <Button
                type="button"
                variant="light"
                onPress={handleClearVerification}
                className="min-w-[120px] border border-gray-300"
              >
                Cambiar número
              </Button>
            )}
          </div>
        </div>

        {showVerificationSection && !isPhoneVerified && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="text-sm text-gray-600">
              Se ha enviado un código de verificación a su número telefónico
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <InputOtp
                  length={4}
                  value={verificationCode}
                  onValueChange={setVerificationCode}
                  className="gap-2"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  type="button"
                  onPress={() => verifyPhoneCode(Number(verificationCode))}
                  isDisabled={verificationCode.length !== 4}
                >
                  Verificar
                </Button>
                <Button
                  type="button"
                  variant="light"
                  isLoading={isValidatingPhone}
                  onPress={() =>
                    handleSendPhoneCode(watch("infoCliente.contacto.sTelefono"))
                  }
                  className="border border-gray-300"
                >
                  Reenviar
                </Button>
              </div>
            </div>
            {verificationError && (
              <Alert color={"danger"} title={verificationError} />
            )}
          </div>
        )}

        {isPhoneVerified && (
          <Alert
            color={"success"}
            title={`Número telefónico verificado correctamente`}
          />
        )}
      </div> */}
    </>
  );
};

export default StepContact;
