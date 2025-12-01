import React, { useState } from "react";
import { days } from "@/lib/data/default-data";
import { EditDirectoraForm, Horario } from "@/lib/interfaces/directora";
import {
  Select,
  SelectItem,
  TimeInput,
  Card,
  CardBody,
  Divider,
} from "@heroui/react";
import { Time } from "@internationalized/date";

type Props = {
  horarios: Horario;
  onSave?: (data: EditDirectoraForm, idCliente: number) => Promise<void>;
  nIdDirectora: number;
};

const GestionPedidos = ({ horarios, onSave, nIdDirectora }: Props) => {

  // Parse time string
  const parseTimeString = (timeStr: string): Time | null => {
    if (!timeStr) return null;

    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    return new Time(hours, minutes);
  };

  // State for form data
  const [formData, setFormData] = useState({
    closingDays: Array.isArray(horarios?.sDiasCierreEC)
      ? horarios.sDiasCierreEC || []
      : [],
    closingTime: parseTimeString(horarios?.sHoraCierreEC || "") || new Time(18, 0),
  });
  const [isLoading, setIsLoading] = useState(false);

  // Format time to string
  const formatTime = (time: Time): string => {
    return `${time.hour.toString().padStart(2, "0")}:${time.minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsLoading(true);
    try {
      await onSave(
        {
          sDiasCierreEC: formData.closingDays || 1,
          sHoraCierreEC: formatTime(formData.closingTime),
        },
        nIdDirectora
      );
    } catch (error) {
      console.error("Error saving order management settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col border-b border-gray-200 pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Gestión de Pedidos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
Configura los días y horarios en los que tus estrellas podrán realizar sus pedidos, según tu cronograma de cierre. La información que ingreses aquí será la que ellas visualizarán en Smart.

            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Select
                label="Días de cierre de pedido"
                placeholder="Selecciona los días"
                selectionMode="multiple"
                defaultSelectedKeys={formData.closingDays}
                onSelectionChange={(keys) => {
                  setFormData({
                    ...formData,
                    closingDays: Array.from(keys) as string[],
                  });
                }}
                classNames={{
                  label: "text-sm text-gray-600 font-medium",
                  trigger:
                    "border-gray-300 hover:border-primary_sokso data-[focus=true]:border-primary_sokso",
                }}
              >
                {days.map((day) => (
                  <SelectItem key={day.key} value={day.key}>
                    {day.label}
                  </SelectItem>
                ))}
              </Select>

              <TimeInput
                label="Hora de cierre"
                value={formData.closingTime}
                onChange={(time) => {
                  if (time) {
                    setFormData({ ...formData, closingTime: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600 font-medium",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
            </div>
          </div>
        </div>

        <Divider className="my-6" />

        <div className="flex justify-end">
          <button
            className="bg-primary_sokso hover:bg-primary_sokso/90 text-white px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-70"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Actualizando...</span>
                <span className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin inline-block"></span>
              </>
            ) : (
              "Actualizar Pedidos"
            )}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default GestionPedidos;
