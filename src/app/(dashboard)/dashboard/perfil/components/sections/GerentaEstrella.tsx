import { Gerenta } from "@/lib/interfaces/clientes";
import { Envelope, Star, WhatsappLogo } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

type Props = {
  gerenta: Gerenta;
};

const GerentaEstrella = ({ gerenta }: Props) => {
  return (
    <div className="rounded-xl">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Gerente de Negocio
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Información de contacto de tu gerente asignado
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-5">
          {/* Información principal del gerente */}
          <div className="rounded-xl bg-primary_sokso/20 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              {/* Imagen con efecto */}
              <div className="relative">
                <div className="absolute -inset-1 bg-secondary2_sokso/20 rounded-full blur-sm"></div>
                <Image
                  src="/images/isotipo_sokso.png"
                  alt="Gerente"
                  className="relative rounded-full bg-white p-3 border-2 border-secondary2_sokso/30"
                  width={88}
                  height={88}
                />
              </div>

              {/* Datos del gerente */}
              <div className="flex flex-col items-center sm:items-start space-y-3">
                <div className="relative">
                  <div className="absolute -inset-1 bg-[#B848CA]/20 rounded-xl blur-[2px]"></div>
                  <div className="relative w-full px-5 py-3 rounded-xl bg-[#B848CA] shadow-sm shadow-[#B848CA]/30">
                    <span className="text-xl font-bold uppercase text-white block text-center sm:text-left">
                      {gerenta.sNombreCompleto ||
                        `${gerenta.sNombre} ${gerenta.sApellidos}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Star weight="fill" className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold uppercase text-secondary_sokso">
                    Gerente de negocio
                  </span>
                </div>

                {gerenta.sNumeroDocumento && (
                  <div className="bg-white/80 px-3 py-1 rounded-full border border-secondary2_sokso/10">
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">DNI:</span>{" "}
                      {gerenta.sNumeroDocumento}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

      {/* Información de contacto */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* WhatsApp */}
  <ContactInfo
    icon={
      <WhatsappLogo
        className="w-5 h-5 text-green-600"
        weight="bold"
      />
    }
    label="WhatsApp"
    value={
      gerenta.sTelefono ? (
        <a
          href={`https://wa.me/51${gerenta.sTelefono}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          {gerenta.sTelefono}
        </a>
      ) : (
        "No registrado"
      )
    }
  />

  {/* Email */}
  <ContactInfo
    icon={
      <Envelope className="w-5 h-5 text-blue-600" weight="bold" />
    }
    label="Correo Electrónico"
    value={
      gerenta.sEmail ? (
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${gerenta.sEmail}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-black underline"
        >
          {gerenta.sEmail}
        </a>
      ) : (
        "No disponible"
      )
    }
  />
</div>

        </div>
      </div>
    </div>
  );
};

// Componente de información de contacto
const ContactInfo = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <div className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
          {icon}
        </div>
        <span className="text-base text-gray-800 font-medium break-all">
          {value}
        </span>
      </div>
    </div>
  );
};

export default GerentaEstrella;
