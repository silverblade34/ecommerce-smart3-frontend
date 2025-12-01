import React from "react";
import { Horario } from "@/lib/interfaces/clientes";
import { Time } from "@internationalized/date";
import { TimeInput } from "@heroui/react";
import {
  Clock,
  Calendar,
  CalendarX,
  ArrowsClockwise,
  Truck,
} from "@phosphor-icons/react";
import { useSession } from "next-auth/react";


type Props = {
  horario: Horario;
};

const ScheduleCenterModa = ({ horario }: Props) => {
  const { data: session } = useSession();
  const isDirector = session?.user?.rol?.sCodigo === "DIR-EC-01";

  // Helper function to convert string time to Time object
  const stringToTime = (timeString: string): Time | null => {
    if (!timeString) return null;

    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      return new Time(hours, minutes);
    } catch (error) {
      console.error("Error parsing time:", error);
      return null;
    }
  };

  const lvInicio = stringToTime(horario.sHorarioAtencionInicoLV);
  const lvFin = stringToTime(horario.sHorarioAtencionFinLV);
  const sInicio = stringToTime(horario.sHorarioAtencionInicoS);
  const sFin = stringToTime(horario.sHorarioAtencionFinS);
  const refInicio = stringToTime(horario.sHorarioRefrigerioInicio);
  const refFin = stringToTime(horario.sHorarioRefrigerioFin);

  return (
    <div className="rounded-xl">
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200 pb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Horarios de Atención
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Información sobre los horarios y plazos de tu centro
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Sección de horarios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lunes a Viernes */}
            <TimeSection
              icon={
                <Clock
                  className="w-5 h-5 text-secondary2_sokso"
                  weight="bold"
                />
              }
              title="Lunes a Viernes"
              startTime={lvInicio || new Time(8, 0)}
              endTime={lvFin || new Time(18, 0)}
            />

            {/* Sábados */}
            <TimeSection
              icon={
                <Calendar
                  className="w-5 h-5 text-secondary2_sokso"
                  weight="bold"
                />
              }
              title="Sábados"
              startTime={sInicio || new Time(8, 0)}
              endTime={sFin || new Time(13, 0)}
            />
          </div>

          {/* Refrigerio */}
          <div className="pt-2">
            <TimeSection
              icon={
                <Clock
                  className="w-5 h-5 text-secondary2_sokso"
                  weight="bold"
                />
              }
              title="Refrigerio"
              startTime={refInicio}
              endTime={refFin}
              optional={true}
            />
          </div>

          {/* Información adicional */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-base font-medium text-gray-800 mb-4">
              Gestion de Pedidos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Hora de cierre */}
              <InfoItem
                icon={
                  <Clock
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                }
                label="Hora de cierre"
                value={horario.sHoraCierreEC || "No especificada"}
              />

              {/* Días de cierre */}
              <InfoItem
                icon={
                  <CalendarX
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                }
                label="Días de cierre"
                value={
                  horario.sDiasCierreEC?.length
                    ? horario.sDiasCierreEC.join(", ")
                    : "No especificados"
                }
              />

              {/* Plazo de cambio */}
              <InfoItem
                icon={
                  <ArrowsClockwise
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                }
                label="Plazo de cambio"
                value={`${horario.nPlazoCambioEC} días`}
              />

              {/* Plazo de cambio EC */}
              {isDirector && (
                <InfoItem
                  icon={
                    <ArrowsClockwise
                      className="w-5 h-5 text-secondary2_sokso"
                      weight="bold"
                    />
                  }
                  label="Plazo de cambio EC"
                  value={`${horario.nPlazoCambioEC} días`}
                />
              )}

              {/* Costo de envío */}
              <InfoItem
                icon={
                  <Truck
                    className="w-5 h-5 text-secondary2_sokso"
                    weight="bold"
                  />
                }
                label="Costo de envío"
                value={horario.nCostoEnvio.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para secciones de horario
const TimeSection = ({
  icon,
  title,
  startTime,
  endTime,
  optional = false,
}: {
  icon: React.ReactNode;
  title: string;
  startTime: Time | null;
  endTime: Time | null;
  optional?: boolean;
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-6 h-6 bg-secondary2_sokso/10 rounded-full">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-700">{title}</span>
      </div>

      <div
        className={`bg-gray-50 rounded-lg p-4 ${optional && !startTime && !endTime ? "opacity-60" : ""
          }`}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <TimeInput
            label="Desde"
            defaultValue={startTime}
            isReadOnly
            classNames={{
              base: "min-w-[140px]",
              label: "text-xs text-gray-500",
              innerWrapper: "bg-white border border-gray-200 rounded",
            }}
          />
          <TimeInput
            label="Hasta"
            defaultValue={endTime}
            isReadOnly
            classNames={{
              base: "min-w-[140px]",
              label: "text-xs text-gray-500",
              innerWrapper: "bg-white border border-gray-200 rounded",
            }}
          />
        </div>
      </div>
    </div>
  );
};

// Componente para ítems de información adicional
const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded-lg p-3">
      <div className="flex items-center justify-center w-8 h-8 bg-secondary2_sokso/10 rounded-full">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default ScheduleCenterModa;
