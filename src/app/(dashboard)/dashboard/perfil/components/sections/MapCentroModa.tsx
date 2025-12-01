import React from "react";
import { Ubicacion } from "@/lib/interfaces/clientes";
import { MapPin,  NavigationArrow } from "@phosphor-icons/react";

type Props = {
  ubicacion: Ubicacion;
};

const MapCentroModa = ({ ubicacion }: Props) => {
  return (
    <div className="rounded-xl">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Ubicación del centro
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Información sobre la ubicación de tu centro de moda
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-5">
          {/* Agrupación de distrito, provincia y departamento */}
          <div className="flex flex-col space-y-2">
            {/* <span className="text-sm font-medium text-gray-700">
              Ubicación política
            </span> */}

          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-gray-700">
              Dirección completa
            </span>
            <div className="flex items-start space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full">
                <MapPin
                  className="w-5 h-5 text-secondary2_sokso"
                  weight="bold"
                />
              </div>
              <span className="flex-1 text-base text-gray-800 font-medium break-words">
              <p> {ubicacion?.sDireccion || "No registrado"}</p> 
              <p>{ubicacion?.sDepartamento || "No registrado"}-{ubicacion?.sProvincia || "No registrado"}-{ubicacion?.sDistrito || "No registrado"}</p>
              </span>
            </div>
          </div>

            {/* <div className="flex items-start space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-4">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full mt-1">
                <Globe
                  className="w-5 h-5 text-secondary2_sokso"
                  weight="bold"
                />
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-1 gap-2 md:gap-4">
                <div>
                  <p className="text-base text-gray-800 font-medium">
                    {ubicacion?.sDepartamento || "No registrado"}-{ubicacion?.sProvincia || "No registrado"}-{ubicacion?.sDistrito || "No registrado"}
                  </p>
                </div>
              </div>
            </div> */}
          </div>

          {/* Dirección completa */}
         
        </div>

        {/* Coordenadas con estilo especial */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-100 pt-4">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="flex items-center justify-center w-10 h-10 bg-yellow/10 rounded-full mr-3">
              <NavigationArrow className="w-5 h-5 text-yellow" weight="bold" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700 block">
                Coordenadas
              </span>
              <span className="text-base text-gray-800 font-medium">
                {ubicacion?.nLatitud}, {ubicacion?.nLongitud}
              </span>
            </div>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default MapCentroModa;
