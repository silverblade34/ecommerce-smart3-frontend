"use client";
import React, { useEffect, useState } from "react";
import {
  CentroModaEstrella,
  PagosActivos,
  Transporte,
} from "@/lib/interfaces/clientes";
import Image from "next/image";
import { PagosActivosService } from "@/server/actions/client";

type Props = {
  transporte: Transporte;
  centroModa: CentroModaEstrella;
  formaPago?: {
    nIdFormaPago: number;
    sNombre: string;
    sNameIcon: string;
  }[];
};

const PaymentCenterModa = ({ centroModa }: Props) => {
  const [pagosActivos, setPagosActivos] = useState<PagosActivos>();

  useEffect(() => {
    PagosActivosService(centroModa.directora.nIdDirectora).then((res) => {
      setPagosActivos(res);
    });
  }, []);

  return (
    <div className="rounded-xl">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Medios de Pago
          </h2>
          {/* <p className="text-sm text-gray-500 mt-1">
            Opciones de pago 
          </p> */}
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Aplicativo de pago */}
          <div className="flex flex-col space-y-3">
            {/* <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-secondary2_sokso/10 rounded-full">
                <CreditCard
                  className="w-4 h-4 text-secondary2_sokso"
                  weight="bold"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Aplicativo
              </span>
            </div> */}

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-wrap gap-6">
                {pagosActivos?.data?.map(({ formaPago }) => (
                  <div
                    key={formaPago.nIdFormaPago}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="relative w-14 h-14 bg-white p-2 rounded-lg shadow-sm flex items-center justify-center">
                      <Image
                        src={formaPago.sNameIcon}
                        alt={`${formaPago.sNombre} logo`}
                        width={50}
                        height={50}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {formaPago.sNombre}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transferencias */}
          {/* <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-secondary2_sokso/10 rounded-full">
                <Bank className="w-4 h-4 text-secondary2_sokso" weight="bold" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Transferencia
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex flex-wrap gap-3">
                <div className="bg-[#B848CA] px-5 py-2 rounded-lg text-white font-medium text-sm shadow-sm">
                  BCP
                </div>
                <div className="bg-[#B848CA] px-5 py-2 rounded-lg text-white font-medium text-sm shadow-sm">
                  INTERBANK
                </div>
              </div>
            </div>
          </div> */}

          {/* Información del Medio de Pago */}
          {/* <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-secondary2_sokso/10 rounded-full">
                <CurrencyCircleDollar
                  className="w-4 h-4 text-secondary2_sokso"
                  weight="bold"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Método de Pago
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full">
                  <CurrencyCircleDollar
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nombre del método</p>
                  <p className="text-base font-medium text-gray-800">
                    {medioPago.sNombre || "No especificado"}
                  </p>
                </div>
              </div>
            </div>
          </div> */}

          {/* Servicio de Transporte */}
          {/* <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-6 h-6 bg-secondary2_sokso/10 rounded-full">
                <Truck
                  className="w-4 h-4 text-secondary2_sokso"
                  weight="bold"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Servicio de Transporte
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full">
                    <Truck
                      className="w-5 h-5 text-secondary2_sokso"
                      weight="bold"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">
                      Empresa de transporte
                    </p>
                    <p className="text-base font-medium text-gray-800">
                      {transporte.sRazonSocial || "No especificado"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-secondary2_sokso/10 rounded-full">
                    <CreditCard
                      className="w-5 h-5 text-secondary2_sokso"
                      weight="bold"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">RUC</p>
                    <p className="text-base font-medium text-gray-800">
                      {transporte.sRuc || "No especificado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentCenterModa;
