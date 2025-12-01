"use client";
import Button from "@/components/common/buttons/Button";
import Form from "@/components/common/Form";
import PasswordInput from "@/components/common/inputs/PasswordInput";
import TextInput from "@/components/common/inputs/TextInput";
import PointsLoader from "@/components/common/loader/PointsLoader";
import useAuthStore from "@/context/user/auth-store";
import { ShieldCheck } from "@phosphor-icons/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SubmitHandler } from "react-hook-form";

interface Login extends Record<string, unknown> {
  username: string;
  password: string;
}
const FormLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { handleModal } = useAuthStore();

  const onSubmit: SubmitHandler<Login> = async (data) => {
    const { username, password } = data;
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
     

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
     
      if (res?.ok) {
        setLoading(false);
        window.location.reload();
        // localStorage.setItem("directoraFirstLogin", "true");
        handleModal();
      }
    } catch (error) {
      console.log("error", error);
      setError("Error en el login.");
      setLoading(false);
    }
  };
  return (
    <Form<Login>
      onSubmit={onSubmit}
      className="mx-auto flex  max-w-sm  flex-col space-y-7  sm:px-8 py-5 "
    >
      {({ register }) => (
        <>
          {/* <p className="text-gray-500 text-center text-sm">Si es la primera vez que ingresas, ingresa tu DNI</p> */}
          <span className="bg-primary_sokso/25 py-2 text-center text-xs  text-secondary_sokso rounded-md">Si eres una <a className=" font-bold ">Estrella Sokso</a> y es tu primer ingreso a esta nueva versión ,
             ingresa con tu  <a className=" font-bold ">número de DNI como usuario y contraseña</a>.</span>
          <div className="flex flex-col space-y-4">

            <TextInput
              id="username"
              required
              label="Usuario"
              placeholder="usuario"
              {...register("username")}

            />
            <PasswordInput
              id="password"
              required
              label="contraseña"
              placeholder="contraseña"
              color="black"
              {...register("password")}
            />
          </div>
          {error && (
            <p className="rounded-md border-l-4 border-red bg-red/5 py-2 text-center text-xs font-bold text-red">
              {error}
            </p>
          )}
          <Button disabled={loading} type="submit">
            {loading ? (
              <PointsLoader />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ShieldCheck size={20} className="ml-2" />
              </>
            )}
          </Button>
        </>
      )}
    </Form>
  );
};

export default FormLogin;
