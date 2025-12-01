import { STEPS, useCreateClient } from "@/hooks/useCreateClient";
import { Profile } from "@/lib/interfaces/profile";
import { ClientPayload, clientPayloadSchema } from "@/lib/validations/cliente";
import { createClientService, sendCodeService } from "@/server/actions/client";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import StepContact from "./section/StepContact";
import StepDocument from "./section/StepDocument";
import StepLocation from "./section/StepLocation";
import StepPersonalData from "./section/StepPersonalData";
import StepIndicator from "./ui/StepIndicator";
import useAuthStore from "@/context/user/auth-store";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  // profile: Profile;
}

const ModalCreateClient = ({
  isOpen,
  onOpenChange,
  onSuccess,
  // profile,
}: Props) => {
  const {
    currentStep,
    setCurrentStep,
    handlePrevStep,
    stepValidations,
    setStepValidations,
    tipoDocumento,
    setValidacionDocumento,
    validacionDocumento,
    genero,
    ubigeo,
    setUbicacion,
    ubicacion,
    resetAll,
    isLoading,
    setIsLoading,
    isPhoneVerified,
    setIsPhoneVerified,
    verificationCode,
    setVerificationCode,
  } = useCreateClient();
 const  profile  = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<ClientPayload>({
    resolver: yupResolver(clientPayloadSchema),
    mode: "onChange",
    defaultValues: {
      sCodigoRol: "EST-EC-01",
      nIdTipoCliente: 2,
      nIdOrigenRegistro: 1,
      infoCliente: {
        nIdEstadoCivil: 1,
        documentoCliente: {
          sPaisEmisor: "PERU",
          nIdTipoPersona: 1,
        },
        direccionCliente: {
          nLatitud: 0,
          nLongitud: 0,
        },
        contacto: {
          sTelefonoAlternativo: "",
          sCorreoResponsablePagoFactura: "",
        },
      },
      finanzasCliente: {
        nIdMetodoPago: 1,
        nLimiteCredito: 0,
        sMonedaPrincipal: "PEN",
        sMonedaSecundaria: "PEN",
        sTerminos: "",
      },
      interlocutores: [
        {
          sCodInterlocutor: "DIR-01",
          nPadreId: profile?.profile?.cliente.nIdCliente,
        },
      ],
    },
  });

   

  useEffect(() => {
    if (isOpen) {
      reset();
      resetAll();
    }
  }, [isOpen, reset, resetAll]);

  const handleClose = useCallback(() => {
    reset();
    resetAll();
    onOpenChange(false);
  }, [reset, onOpenChange, resetAll]);

  const onSubmit: SubmitHandler<ClientPayload> = async (data) => {
    setIsLoading(true);

    try {
      const phone = watch("infoCliente.contacto.sTelefono");

      const response = await sendCodeService("sms", phone);
      //existe duplicados
      if (response.success === false || response.message === "El número de teléfono ya está registrado") {
        toast.warning(response.message || "El número ya está registrado");
        return null;
      }
      //si se envió correctamente el código - eliminar el envio de codigo backend
      if (response.code && response.message === "Código de verificación enviado correctamente al teléfono") {
        const res = await createClientService(data);
        if (!res.success) {
          toast.error(res.message ?? "Ocurrió un error al registrar el cliente");
        } else {
          onSuccess?.();
          toast.success("Cliente creado correctamente");
          handleClose();
        }

      } else {
        toast.error("Hubo un error al validar la existencia del N° de teléfono");
      }

      // En cualquier otro caso, mostrar un mensaje genérico

    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Ocurrió un error al registrar el invitado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateCurrentStep = async () => {
    let isValid = false;
    let stepErrors: string[] = [];
    switch (currentStep) {
      case 1: // Document step
        isValid = await trigger([
          "infoCliente.documentoCliente.nIdTipoDocumento",
          "infoCliente.documentoCliente.sNumeroDocumento",
        ]);
        stepErrors = Object.values(errors)
          .map((error) => error.message)
          .filter((message): message is string => message !== undefined);
        break;
      case 2:
        isValid = await trigger([
          "infoCliente.sNombre",
          "infoCliente.sApellidos",
          "infoCliente.nIdGenero",
          "infoCliente.dtFechaNacimiento",
        ]);
        stepErrors = Object.values(errors)
          .map((error) => error.message)
          .filter((message): message is string => message !== undefined);
        break;
      case 3:
        isValid = await trigger([
          "infoCliente.direccionCliente.sDireccion",
          "infoCliente.direccionCliente.sCodigoUbigeo",
        ]);
        break;
      case 4:
        isValid =
          (await trigger([
            "infoCliente.contacto.sEmail",
            "infoCliente.contacto.sTelefono",
          ])) && isPhoneVerified;
        break;
    }

    setStepValidations((prev) => ({
      ...prev,
      [currentStep]: { isValid, errors: stepErrors },
    }));

    return isValid;
  };
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepDocument
            register={register}
            errors={errors}
            tipoDocumento={tipoDocumento}
            watch={watch}
            reset={reset}
            setStepValidations={setStepValidations}
            validacionDocumento={validacionDocumento}
            setValidacionDocumento={setValidacionDocumento}
          />
        );
      case 2:
        return (
          <StepPersonalData
            register={register}
            errors={errors}
            validacionDocumento={validacionDocumento}
            setStepValidations={setStepValidations}
            genero={genero}
            setValue={setValue}
            watch={watch}
            clearErrors={clearErrors}
          />
        );
      case 3:
        return (
          <StepLocation
            register={register}
            errors={errors}
            ubigeo={ubigeo}
            watch={watch}
            setValue={setValue}
            setUbicacion={setUbicacion}
            ubicacion={ubicacion}
            setStepValidations={setStepValidations}
            clearErrors={clearErrors}
          />
        );
      case 4:
        return (
          <StepContact
            register={register}
            errors={errors}
            watch={watch}
            isPhoneVerified={isPhoneVerified}
            setIsPhoneVerified={setIsPhoneVerified}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            setStepValidations={setStepValidations}
          />
        );
      default:
        return null;
    }
  };

  const handleNextStep = async () => {
    const isCurrentStepValid = await validateCurrentStep();
    if (isCurrentStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    } else {
      toast.error(
        "Por favor complete todos los campos requeridos antes de continuar"
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      placement="auto"
      onOpenChange={handleClose}
      isDismissable={false}
      isKeyboardDismissDisabled={true}
      classNames={{
        backdrop: "bg-secondary_sokso bg-opacity-30",
        footer: "border-t-[1px] pb-10",
        base: "w-full max-w-2xl",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(
              (data) => {
                console.log("Form submitted successfully:", data);
                onSubmit(data);
              },
              (errors) => {
                console.error("Validation errors:", errors);
                toast.error("Por favor complete todos los campos requeridos");
              }
            )}
          >
            <ModalHeader className="flex flex-col gap-1">
              Crear estrella
            </ModalHeader>

            <ModalBody className="w-full">
              <StepIndicator
                currentStep={currentStep}
                stepValidations={stepValidations}
              />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {renderStep()}
              </div>
            </ModalBody>

            <ModalFooter className="flex justify-between">
              <div>
                {currentStep > 1 && (
                  <Button
                    type="button"
                    // variant="light"
                    color="primary"
                    onPress={handlePrevStep}
                  >
                    Anterior
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  color="danger"

                  type="button"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                {currentStep === STEPS.length ? (
                  <Button
                    className="bg-primary_sokso text-white"
                    type="submit"
                    isLoading={isSubmitting || isLoading}
                    isDisabled={!stepValidations[currentStep].isValid}
                  >
                    Guardar
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onPress={handleNextStep}
                    color="primary"
                    className="bg-primary_sokso text-white "
                    isDisabled={!stepValidations[currentStep].isValid}
                  >
                    Siguiente
                  </Button>
                )}
              </div>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCreateClient;
