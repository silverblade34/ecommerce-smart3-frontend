export type ContactMedium = "sms" | "email";

interface UseValidateContactProps {
  medium: ContactMedium;
  initialValue?: string;
  id: number;
}

interface ValidationState {
  value: string;
  codeValue: string;
  verificationCode: string;
  isCodeSent: boolean;
  isCodeValid: boolean;
  isLoading: boolean;
}

import useAuthStore from "@/context/user/auth-store";
import {
  sendCodeService,
  updateDireccionService,
  updatePhoneEmailService,
} from "@/server/actions/client";
import { getMyClient } from "@/server/actions/users";
import { useDisclosure } from "@heroui/react";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";

const INITIAL_STATE: ValidationState = {
  value: "",
  codeValue: "",
  verificationCode: "",
  isCodeSent: false,
  isCodeValid: false,
  isLoading: false,
};

export const useValidateContact = ({
  medium,
  initialValue = "",
  id,
}: UseValidateContactProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [state, setState] = useState<ValidationState>({
    ...INITIAL_STATE,
    value: initialValue,
  });

  const resetFields = useCallback(() => {
    setState({
      ...INITIAL_STATE,
      value: initialValue,
    });
  }, [initialValue]);

  const handleSendCode = useCallback(async () => {
    try {
      if (!state.value) {
        toast.error("Ingresa un valor válido");
        return;
      }

      setState((prev) => ({ ...prev, isLoading: true }));
      const code = await sendCodeService(medium, state.value);
        console.log("code", code);

        if (code?.success === false && code.message) {
          // Caso cuando el número ya existe
          setState((prev) => ({ ...prev, isLoading: false }));
          toast.warning(code.message);
        } else if (code?.code && code.message) {
          // Caso cuando el código se envió correctamente
          setState((prev) => ({
            ...prev,
            verificationCode: code.code.toString(),
            isCodeSent: true,
            isLoading: false,
          }));

          toast.success(`Código de verificación enviado a ${state.value}`);
        } else {
          // Cualquier otro caso inesperado
          setState((prev) => ({ ...prev, isLoading: false }));
          toast.error("Ocurrió un error inesperado.");
        }

    } catch (error) {
      console.error('Error sending code', error);
      setState((prev) => ({ ...prev, isLoading: false }));
      toast.error('Error al enviar el código de verificación');
    }
  }, [medium, state.value]);

  const handleVerifyCode = useCallback(async () => {
    if (!state.codeValue) {
      toast.error("Ingresa el código de verificación");
      return false;
    }
  
    const isValid = state.codeValue === state.verificationCode;
  
    setState((prev) => ({
      ...prev,
      isCodeValid: isValid,
    }));
  
    toast[isValid ? "success" : "error"](
      isValid
        ? "Código de verificación correcto"
        : "Código de verificación incorrecto"
    );
  
    return isValid;
  }, [state.codeValue, state.verificationCode]);

  const handleUpdateValue = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await updatePhoneEmailService(id, medium, state.value);
      toast.success("Contacto actualizado correctamente");
      fetchProfile();
      closeModal();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return false; 
      } else {
        toast.error("Error al actualizar el contacto");
      }
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleUpdateDireccionValue = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const sCodigoUbigeo = "150101"
    const nLatitud=-10.5
    const nLongitud=-11.5

    try {
      await updateDireccionService(id,sCodigoUbigeo, state.value,nLatitud,nLongitud);
      toast.success("Dirección actualizada correctamente");
      fetchProfile();
      closeModal();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        return false; 
      } else {
        toast.error("Error al actualizar el contacto");
      }
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };


  const closeModal = useCallback(() => {
    resetFields();
    onOpenChange();
  }, [onOpenChange, resetFields]);

  const updateCodeValue = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    setState((prev) => {
      const currentCodeArray = prev.codeValue
        ? prev.codeValue.split("")
        : Array(4).fill("");

      currentCodeArray[index] = value;

      const newCode = currentCodeArray.join("");

      return {
        ...prev,
        codeValue: newCode,
      };
    });
  }, []);
  const { setProfile } = useAuthStore();

  const fetchProfile = async () => {
    const profile = await getMyClient();
    if (!profile) return;
    setProfile(profile);
  };

  const handleResendCode = useCallback(async () => {
    setState((prev) => ({ ...prev, codeValue: "", isCodeValid: false }));
    await handleSendCode();
  }, [handleSendCode]);

  return {
    ...state,
    isOpen,
    onOpen,
    closeModal,
    setValue: useCallback(
      (value: string) => setState((prev) => ({ ...prev, value })),
      []
    ),
    handleSendCode,
    updateCodeValue,
    handleVerifyCode,
    handleUpdateValue,
    handleResendCode,
    handleUpdateDireccionValue
  };
};
