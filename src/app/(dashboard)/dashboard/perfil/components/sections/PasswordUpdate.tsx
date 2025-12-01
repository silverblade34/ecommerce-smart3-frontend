import ButtonSubmit from "@/components/common/buttons/ButtonSubmit";
import Form from "@/components/common/Form";
import PasswordInput from "@/components/common/inputs/PasswordInput";
import { ResetPass } from "@/components/layout/auth/ResetPasswordModal";
import usePasswrodStore from "@/context/user/password-store";
import { Profile } from "@/lib/interfaces/profile";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Lock, ShieldCheck, User } from "@phosphor-icons/react";
import { signIn, useSession } from "next-auth/react";
import { SubmitHandler } from "react-hook-form";
type Props = {
  profile: Profile;
};
const PasswordUpdate = ({ profile }: Props) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: session } = useSession();

  const { loading, change_password } = usePasswrodStore();

  const onSubmit: SubmitHandler<ResetPass> = async (data) => {
    const res = await change_password(data);
    if (!res) return;
    const username = session?.user.sNombreUsuario;
    const password = data.newPassword;
    signIn("credentials", {
      username,
      password,
      callbackUrl: "/",
      redirect: true,
    });
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
    <div className="rounded-xl ">
      <div className="p-1 space-y-2">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">Acceso Smart</h2>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona tus credenciales de acceso
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-gray-700">Usuario</span>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
              <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full">
                <User className="w-5 h-5 text-primary_sokso" weight="bold" />
              </div>
              <span className="text-base text-gray-800 font-medium">
                {profile?.usuario.sNombreUsuario || "No registrado"}
              </span>
            </div>
          </div>

          <div className="flex flex-col ">
            <span className="text-sm font-medium text-gray-700">
              Contraseña
            </span>
            <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-1">
              <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full">
                <Lock className="w-5 h-5 text-primary_sokso" weight="bold" />
              </div>
              <span className="text-base text-gray-800 font-medium">
                ••••••••
              </span>
              <Button
                className="ml-auto bg-primary_sokso hover:bg-primary_sokso/90 transition-colors text-white"
                onPress={onOpen}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        classNames={{
          base: "border-0",
          header: "border-b pb-4",
          body: "py-6",
          footer: "border-t pt-4",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <Form<ResetPass>
              onSubmit={onSubmit}
              className="flex flex-col  py-4"
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
                    <ModalHeader className="flex flex-col gap-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        Actualizar Contraseña
                      </h3>
                      <p className="text-sm text-gray-500">
                        Ingresa tu contraseña actual y la nueva contraseña
                      </p>
                    </ModalHeader>

                    <ModalBody>
                      <div className="flex flex-col">
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
                    </ModalBody>

                    <ModalFooter>
                      <div className="flex justify-end gap-3 w-full">
                        <Button
                          color="default"
                          variant="light"
                          onPress={onClose}
                        >
                          Cancelar
                        </Button>
                        <ButtonSubmit>
                          {loading && "Cargando..."}
                          {!loading && <span>Cambiar</span>}
                          <ShieldCheck size={20} className="ml-2" />
                        </ButtonSubmit>
                      </div>
                    </ModalFooter>
                  </>
                );
              }}
            </Form>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PasswordUpdate;
