import { Directora } from "@/lib/interfaces/clientes";
import { Envelope, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react";
import Image from "next/image";

type Props = {
  directora: Directora;
};

const ModaCenterDataInfo = ({ directora }: Props) => {
  const { infoPersonal, centroModa } = directora;

  const direccionL = (
    <div>
      <p>{centroModa.ubicacion.sDireccion}</p>
      <p>
        {centroModa.ubicacion.sDepartamento} - {centroModa.ubicacion.sProvincia} - {centroModa.ubicacion.sDistrito}
      </p>
      {centroModa.ubicacion.nLatitud!=0 && centroModa.ubicacion.nLongitud!=0 &&(
        <p>
          <a
            href={`https://www.google.com/maps?q=${centroModa.ubicacion.nLatitud},${centroModa.ubicacion.nLongitud}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Ver en Google Maps
          </a>
        </p>
      )}
    </div>
  );

  return (
    <div className="rounded-xl">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Datos de tu centro de moda
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Información sobre tu centro y datos de contacto
          </p>
        </div>

        {/* Contenido principal */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna izquierda - Foto y nombre destacados */}
          <div className="w-full md:w-2/5 flex flex-col justify-center items-center space-y-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-secondary2_sokso/20 rounded-full blur-sm"></div>
              <Image
                src="/images/isotipo_sokso.png"
                alt="centro moda"
                className="relative rounded-full bg-white p-4 w-32 h-32 border-2 border-secondary2_sokso/30"
                width={128}
                height={128}
              />
            </div>

            <div className="w-full flex flex-col items-center space-y-3">
              <div className="w-11/12 px-4 py-3 rounded-xl bg-[#B848CA] shadow-sm shadow-[#B848CA]/30">
                <span className="text-xl font-bold uppercase text-white block text-center">
                  {centroModa.sNombreComercial}
                </span>
              </div>

              <div className="bg-secondary2_sokso/10 px-4 py-2 rounded-lg w-10/12">
                <span className="text-lg font-bold text-[#B848CA] block text-center">
                  {infoPersonal.sNombre} {infoPersonal.sApellidos}
                </span>
              </div>

              {/* <div className="flex items-center justify-center space-x-2 bg-white border border-secondary2_sokso/20 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-secondary2_sokso"></div>
                <span className="text-sm font-medium text-gray-700">
                  Zona:{" "}
                  <span className="font-bold text-secondary2_sokso">
                    {centroModa.sZona}
                  </span>
                </span>
              </div> */}
            </div>
          </div>



          {/* Columna derecha - Información de contacto */}
          <div className="w-full md:w-3/5">

           {/* Dirección */}
           <ContactInfo
                icon={
                  <MapPin
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                }
                label="Dirección"
                value={direccionL || "No registrado"}
              />


            <div className="grid grid-cols-1 gap-4">
            {/* WhatsApp */}
<ContactInfo
  icon={
    <WhatsappLogo
      className="w-5 h-5 text-secondary2_sokso"
      weight="bold"
    />
  }
  label="WhatsApp"
  value={
    infoPersonal.sTelefono ? (
      <a
        href={`https://wa.me/51${infoPersonal.sTelefono}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline"
      >
        {infoPersonal.sTelefono}
      </a>
    ) : (
      "No registrado"
    )
  }
/>

{/* Teléfono */}
<ContactInfo
  icon={
    <Phone
      className="w-5 h-5 text-secondary2_sokso"
      weight="bold"
    />
  }
  label="Teléfono"
  value={
    infoPersonal.sTelefono ? (
      <a
        href={`tel:${infoPersonal.sTelefono}`}
        className="text-black underline"
      >
        {infoPersonal.sTelefono}
      </a>
    ) : (
      "No registrado"
    )
  }
/>

{/* Email */}
<ContactInfo
  icon={
    <Envelope
      className="w-5 h-5 text-secondary2_sokso"
      weight="bold"
    />
  }
  label="Correo Electrónico"
  value={
    infoPersonal.sEmail ? (
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${infoPersonal.sEmail}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-black underline"
      >
        {infoPersonal.sEmail}
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
        <div className="flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full">
          {icon}
        </div>
        <span className="text-base text-gray-800 font-medium break-all">
          {value}
        </span>
      </div>
    </div>
  );
};

export default ModaCenterDataInfo;
