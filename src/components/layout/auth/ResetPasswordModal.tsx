"use client";
import ButtonSubmit from "@/components/common/buttons/ButtonSubmit";
import Form from "@/components/common/Form";
import PasswordInput from "@/components/common/inputs/PasswordInput";
import RelojLoader from "@/components/common/loader/RelojLoader";
import usePasswrodStore from "@/context/user/password-store";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ShieldCheck } from "@phosphor-icons/react";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";

export interface ResetPass extends Record<string, unknown> {
  id: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordModal = () => {
  const { data: session, status } = useSession();
  const { loading, change_password } = usePasswrodStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user.bPassTemporal) {
      setShowModal(true);
    }
  }, [session, status]);

  const onSubmit: SubmitHandler<ResetPass> = async (data) => {
    const res = await change_password(data);
    if (!res) return;

    // Cerramos el modal
    setShowModal(false);

    // Esperamos un momento para que cierre visualmente el modal antes de redirigir
    setTimeout(() => {
      const username = session?.user.sNombreUsuario;
      const password = data.newPassword;
      signIn("credentials", {
        username,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    }, 300); // pequeña pausa para una UX suave
  };

  // const validatePassword = (value: string) => {
  //   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  //   return (
  //     regex.test(value) ||
  //     "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial."
  //   );
  // };
  const validatePassword = (value: string) => {
  return (
    value.length >= 6 ||
    "La contraseña debe tener al menos 6 caracteres."
  );
};

  return (
    <>
      {status === "loading" && <RelojLoader />}
      {status === "authenticated" && (
        <Dialog
          open={showModal}
          as="div"
          className="relative z-[999] focus:outline-none"
          onClose={() => {}} // Modal no se puede cerrar manualmente
        >
          <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto bg-black bg-opacity-50">
            <div className="flex min-h-full items-center justify-center p-4">
              <DialogPanel
                transition
                className="data-[closed]:transform-[scale(95%)] w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:opacity-0"
              >
                <DialogTitle
                  as="h3"
                  className="text-sokso-black text-xl font-bold"
                >
                  Cambiar contraseña
                </DialogTitle>
                <p className="text-sokso-black mt-2 text-sm/6">
                  Tu contraseña es temporal, por favor cámbiala.
                </p>
                <Form<ResetPass>
                  onSubmit={onSubmit}
                  className="flex flex-col space-y-7 py-4"
                >
                  {({ register, formState: { errors }, watch }) => {
                    const newPassword = watch("newPassword");
                    return (
                      <>
                        <input
                          type="hidden"
                          {...register("id")}
                          value={session?.user._id}
                        />
                        <div className="flex flex-col space-y-4">
                          <div>
                            <PasswordInput
                              id="currentPassword"
                              required
                              label="Contraseña actual"
                              placeholder="********"
                              color="#312A2A"
                              {...register("currentPassword")}
                            />
                            {errors.currentPassword && (
                              <span className="text-xs text-red">
                                {errors.currentPassword.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <PasswordInput
                              id="newPassword"
                              required
                              label="Nueva contraseña"
                              placeholder="********"
                              color="#312A2A"
                              {...register("newPassword", {
                                validate: validatePassword,
                              })}
                            />
                            {errors.newPassword && (
                              <span className="text-xs text-red">
                                {errors.newPassword.message}
                              </span>
                            )}
                          </div>
                          <div>
                            <PasswordInput
                              id="confirmPassword"
                              required
                              label="Confirmar contraseña"
                              placeholder="********"
                              color="#312A2A"
                              {...register("confirmPassword", {
                                validate: (value) =>
                                  value === newPassword ||
                                  "Las contraseñas no coinciden",
                              })}
                            />
                            {errors.confirmPassword && (
                              <span className="text-xs text-red">
                                {errors.confirmPassword.message}
                              </span>
                            )}
                          </div>
                        </div>

                        <ButtonSubmit>
                          {loading && "Cargando..."}
                          {!loading && <span>Restablecer</span>}
                          <ShieldCheck size={20} className="ml-2" />
                        </ButtonSubmit>
                      </>
                    );
                  }}
                </Form>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      )}
    </>
  );
};

export default ResetPasswordModal;
