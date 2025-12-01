"use client";
import CloseButton from "@/components/common/buttons/CloseButton";
import useAuthStore from "@/context/user/auth-store";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useState } from "react";
import FormLogin from "./auth/FormLogin";
import FormRecuperar from "./auth/FormRecuperar";
import { LoginIcon } from "../common/icons/LoginIcon";
import { Sparkle } from "@phosphor-icons/react";
import { motion } from 'framer-motion';

const ModalAuth = () => {
  const { handleModal, modal } = useAuthStore();
  const [section, setSection] = useState<"login" | "recovery">("login");
  const handleSection = () => {
    if (section === "login") {
      setSection("recovery");
    } else {
      setSection("login");
    }
  };

  return (
    <Transition show={modal}>
      <Dialog className="relative z-[200]" onClose={handleModal}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" fixed inset-0 bg-secondary_sokso bg-opacity-40 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <CloseButton
                  onClick={handleModal}
                  right="right-5"
                  top="top-3"
                />
                <div className="w-full p-2">
                  <div className="flex justify-center mb-4">
                    <LoginIcon />
                  </div>
{/*                  
                   <img
            src="/images/preventa-02.gif"
            alt="Aviso de migración tecnológica"
            className="w-full h-[100px] object-cover mb-4"
          />  */}
                 
                  <header className="flex justify-center text-gray-700 text-center text-lg">
                    {section === "login"
                      ?
                      // <a className="flex items-center gap-2">¡SOKSO SMART SE RENUEVA!  <Sparkle size={28} color="#fff70a" weight="fill" /></a>
                      <a className=" gap-2 font-normal">
                        <motion.span
                          animate={{
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="flex items-center"
                        >
                          ¡SOKSO SMART SE RENUEVA!
                          <Sparkle
                            size={20}
                            color="#fff70a"
                            weight="fill"
                            className="ml-2"

                          />
                        </motion.span>

                      </a>
                      //"Bienvenido a Sokso Smart"
                      : "Recuperar contraseña"}
                  </header>

                  {section === "recovery" ? <FormRecuperar /> : <FormLogin />}
                  <button
                    className="text-md flex w-full items-center justify-center text-center text-secondary_sokso hover:underline"
                    type="button"
                    onClick={handleSection}
                  >
                    {section === "login"
                      ? "¿Olvidaste tu contraseña?"
                      : "Iniciar sesión"}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalAuth;
