import { Profile } from "@/lib/interfaces/profile";
import { useSession } from "next-auth/react";
import UpdatePhone from "../modals/UpdatePhone";
import UpdateEmail from "../modals/UpdateEmail";
import UpdateAddress from "../modals/UpdateAddress";
import { ArrowSquareIn, MapTrifold } from "@phosphor-icons/react";
import { Button } from "@heroui/react";
import { handleClickExclusivePreview } from "@/analitycs/filters";




type Props = {
  profile: Profile;
};

const DataTodos = ({ profile }: Props) => {
  const { data } = useSession();



  const userRole: string | undefined = data?.user.rol.sCodigo;
  const isDirector = userRole === "DIR-EC-01";
const Director = (() => {
  if (typeof window === 'undefined') return false; // evitar errores en SSR

  try {
    const estrellaData = JSON.parse(localStorage.getItem('estrella-storage') || '{}');
    return estrellaData?.state?.sTipo === 'Director';
  } catch (error) {
    console.error('Error leyendo estrella-storage:', error);
    return false;
  }
})();
 
const Abigail = (() => {
  if (typeof window === 'undefined') return false; // evitar errores en SSR

  try {
    const estrellaData = JSON.parse(localStorage.getItem('estrella-storage') || '{}');
    return estrellaData?.state?.idCliente == 81387;
  } catch (error) {
    console.error('Error leyendo estrella-storage:', error);
    return false;
  }
})();

  const {
    cliente: {
      nIdCliente: clientId,
      infoCliente: {
        contactoCliente: { sTelefono: phone, sEmail: email },
        direccionCliente: { sDireccion: address },
      },
    },
  } = profile;


  // // Ejecutar `useEstrellaData` siempre
  // const { centroModaEstrella } = useEstrellaData(clientId);

  // // Validar si existe ubicación
  // // const existUbicacion =
  // //   !isDirector &&
  // //   centroModaEstrella?.directora?.centroModa?.ubicacion !== null;

  // //   console.log("data", profile)
    
    return (
    <div className="w-full ">
{Abigail && (
<div className="flex justify-end mt-6">
        <Button
          as="a"
          href="https://sokso.aflip.in/a4e6767898.html"
          target="_blank"
          rel="noopener noreferrer"
          id="btn-ver-adelanto-exclusivo"
          onPress={handleClickExclusivePreview}
          className="bg-[#717FFF] text-white shadow-lg animate-bounce"
        >
          <ArrowSquareIn size={20} color="#ffffff" weight="fill" />
          Ver Adelanto Exclusivo
        </Button>
      </div>)}

      <div className="p-1 space-y-6">

       <div className="flex flex-col border-b border-gray-200 pb-4">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
    {Director ? 'Datos de tu empresa' : 'Datos Personales'}
  </h2>
  <p className="text-sm text-gray-500 mt-1">
    {Director
      ? 'Gestiona la información fiscal y comercial de tu empresa'
      : 'Gestiona tu información de contacto'}
  </p>
</div>

        {/* Mostrar datos adicionales solo si es director */}
        {isDirector && (
          <div >
            {/* <p className="font-bold uppercase">{profile.cliente.directora?.factura.ubigeo.sNombre}</p> */}
            <p className="font-bold uppercase">Razón Social : <a className="font-normal">{profile.cliente.infoCliente?.sRazonSocial}</a></p>
            <p className="font-bold">RUC : <a className="font-normal">{profile.cliente.directora?.factura.sRuc}</a></p>
            <p className="font-bold uppercase">Dirección Fiscal : <a className="font-normal">{profile.cliente.directora?.factura.sDireccionFiscal}</a></p>
            <p className="font-bold uppercase">Correo factura: <a className="font-normal">{profile.cliente.directora?.factura.sCorreo}</a></p>
            <p className="font-bold uppercase">Director(a): <a className="font-normal">{profile.cliente.infoCliente.sNombre}{" "} {profile.cliente.infoCliente.sApellidos}</a></p>
            <p className="font-bold">DNI: <a className="font-normal">{profile.cliente.infoCliente?.documento.sNumeroDocumento}</a></p>
          </div>

        )}
         
         {!isDirector && (
        <div className="flex flex-col space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <UpdatePhone phone={phone} id={clientId} />
            <UpdateEmail email={email} id={clientId} />
            <UpdateAddress address={address}  id={clientId} />
          {/* Dirección separada en Departamento / Provincia / Distrito */}
         <div className="flex flex-col">
<span className="text-sm font-medium text-gray-700">Departamento</span>

<div className="flex  items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-1">
  <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full mr-3">
    <MapTrifold className="w-5 h-5 text-primary_sokso" weight="bold" />
  </div>

  <div className="flex flex-col md:flex-row md:space-x-6 text-base text-gray-800 font-medium">
    <span>{profile.cliente.infoCliente?.direccionCliente?.ubigeo?.sUbigeoResumen?.split(':')[0]?.trim() || "Departamento no disponible"}</span>
   
</div>
    </div>
<span className="text-sm font-medium text-gray-700">Provincia</span>

<div className="flex  items-center bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-1">
  <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full mr-3">
    <MapTrifold className="w-5 h-5 text-primary_sokso" weight="bold" />
  </div>

  <div className="flex flex-col md:flex-row md:space-x-6 text-base text-gray-800 font-medium">
    
    <span>{profile.cliente.infoCliente?.direccionCliente?.ubigeo?.sUbigeoResumen?.split(':')[1]?.trim() || "Provincia no disponible"}</span>
   
</div>
    </div>

<span className="text-sm font-medium text-gray-700">Distrito</span>

<div className="flex  bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-1  items-center ">
  <div className="flex items-center justify-center w-10 h-10 bg-primary_sokso/10 rounded-full mr-3">
    <MapTrifold className="w-5 h-5 text-primary_sokso" weight="bold" />
  </div>

  <div className="flex flex-col md:flex-row md:space-x-6 text-base text-gray-800 font-medium">
   
    <span>{profile.cliente.infoCliente?.direccionCliente?.ubigeo?.sUbigeoResumen?.split(':')[2]?.trim() || "Distrito no disponible"}</span>
  </div>
</div>
</ div>
          </div>
        </div>
       
    

         )}
      </div>

      {/* {!isDirector &&
        existUbicacion &&
        centroModaEstrella?.directora?.centroModa?.ubicacion && (
          <MapCentroModa
            ubicacion={centroModaEstrella.directora.centroModa.ubicacion}
          />
        )} */}
    </div>
  );
};

export default DataTodos;
