import { EditDirectoraForm, Horario } from "@/lib/interfaces/directora";
import { Card, CardBody, Divider, Input } from "@heroui/react";
import { useState } from "react";

type Props = {
  horarios: Horario;
  onSave?: (data: EditDirectoraForm, idCliente: number) => Promise<void>;
  nIdDirectora: number;
};

const ReturnDirectora = ({ horarios, onSave, nIdDirectora }: Props) => {
  // Initialize state with values from props

  const [formData, setFormData] = useState({
    plazoCambioEC: horarios?.nPlazoCambioEC?.toString() || "1",
    costoEnvio: horarios?.nCostoEnvio?.toString() || "0",
  });


  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSave = async () => {
    if (!onSave) return;

    setIsLoading(true);
    try {
      await onSave(
        {
          nPlazoCambioEC: parseInt(formData.plazoCambioEC) || 1,
          nCostoEnvio: parseInt(formData.costoEnvio),
        },
        nIdDirectora
      );
    } catch (error) {
      console.error("Error saving return settings:", error);
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
              Gestión Devoluciones
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Configura los plazos y costos para cambios y devoluciones
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                type="number"
                label="Plazo Devolución"
                value={formData?.plazoCambioEC}
                min={0}
                endContent={<div className="text-sm text-gray-500">día(s)</div>}
                onChange={(e) =>
                  handleInputChange("plazoCambioEC", e.target.value)
                }
                classNames={{
                  label: "text-sm text-gray-600 font-medium",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />

              <Input
                type="text"
                label="Costo de envío"
                value={formData?.costoEnvio}
                endContent={
                  <div className="text-sm text-gray-500">por UND</div>
                }
                onChange={(e) =>
                  handleInputChange("costoEnvio", e.target.value)
                }
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
              "Actualizar Devoluciones"
            )}
          </button>
        </div>
      </CardBody>
    </Card>
  );
};

export default ReturnDirectora;
