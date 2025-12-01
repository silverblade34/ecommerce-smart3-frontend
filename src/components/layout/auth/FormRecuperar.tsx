"use client";
import usePasswrodStore from "@/context/user/password-store";
import { ShieldCheck } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import SelectOptionPassword from "./SelectOptionPassword";
import SendUsername from "./SendUsername";
import { OptionRestorePassword } from "@/lib/interfaces/profile";

const FormRecuperar = () => {
  const {
    loading,
    result,
    search_username,
    options,
    send_message,
    loading_message,
    success,
    reset,
  } = usePasswrodStore();

  // Estado para almacenar la opción seleccionada
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    reset(); // Se ejecuta solo una vez al montar el componente
  }, [reset]);

  useEffect(() => {
    if (selectedOption === "email") {
      console.log("El usuario seleccionó email");
    }
  }, [selectedOption]);

  const handleSendMessage = (option: OptionRestorePassword) => {
    setSelectedOption(option.type); // Ahora guardamos correctamente el `type`
    send_message(option);
  };
  return (
    <>
      {!loading && result && options.length > 0 && (
        <SelectOptionPassword
          name={result.sNombre}
          options={options}
          send_message={handleSendMessage}
          loading_message={loading_message}
          reset={reset}
        />
      )}

      {!success && !result && options.length === 0 && (
        <SendUsername search_username={search_username} loading={loading} />
      )}

      {success && (
        <div className="flex flex-col items-center space-y-4 pb-4">
          <ShieldCheck
            size={100}
            className="text-primary_sokso ml-2 rounded-full border-2 border-primary_sokso p-2"
          />
          <h2 className="text-gray-600">¡Mensaje enviado!</h2>
          <label
            htmlFor="form-text"
            className="form-label text-gray-800 text-center !text-[.875rem]"
          >
            {selectedOption === "email"
              ? "Se ha enviado la nueva contraseña a tu correo."
              : selectedOption === "sms"
              ? "Se ha enviado la nueva contraseña a tu teléfono."
              : "Se ha enviado la nueva contraseña a tu correo o teléfono."}
          </label>
        </div>
      )}
    </>
  );
};

export default FormRecuperar;
