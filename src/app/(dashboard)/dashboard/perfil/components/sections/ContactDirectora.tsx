import TitleSection from "@/components/common/ui/TitleSection";
import useAuthStore from "@/context/user/auth-store";
import { Button, Input } from "@heroui/react";
import { notFound } from "next/navigation";
import React from "react";

const ContactDirectora = () => {
  const { profile } = useAuthStore();

  if (!profile) return notFound();
  const {
    cliente: {},
  } = profile;

  return (
    <div className="border-b-2 border-secondary2_sokso pb-4">
      <TitleSection text="Datos de Contacto" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 ">
        <Input type="text" label="Celular" defaultValue="984334543" />
        <Input type="text" label="Teléfono" defaultValue="334543" />
        <Input type="email" label="Correo" defaultValue="juan@gmail.com" />
      </div>
      <div>
        <Button className="mt-4 bg-primary_sokso text-white ">Editar</Button>
      </div>
    </div>
  );
};

export default ContactDirectora;
