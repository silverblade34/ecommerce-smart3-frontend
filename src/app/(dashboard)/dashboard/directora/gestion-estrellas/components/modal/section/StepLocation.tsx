import { StepValidation, UbicacionState } from "@/hooks/useCreateClient";
import { Ubigeo } from "@/lib/interfaces/clientes";
import { ClientPayload } from "@/lib/validations/cliente";
import { Input, Select, SelectItem } from "@heroui/react";
import React, { useCallback, useEffect } from "react";
import {
  FieldErrors,
  UseFormClearErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<ClientPayload>;
  errors: FieldErrors<ClientPayload>;
  watch: UseFormWatch<ClientPayload>;
  setValue: UseFormSetValue<ClientPayload>;
  ubigeo: Ubigeo[];
  setUbicacion: React.Dispatch<React.SetStateAction<UbicacionState>>;
  ubicacion: UbicacionState;
  setStepValidations: React.Dispatch<
    React.SetStateAction<Record<number, StepValidation>>
  >;
  clearErrors: UseFormClearErrors<ClientPayload>;
};

const StepLocation = ({
  register,
  errors,
  watch,
  setValue,
  ubigeo,
  setUbicacion,
  ubicacion,
  setStepValidations,
  clearErrors,
}: Props) => {
  const handleLocationChange = useCallback(
    (level: "departamento" | "provincia" | "distrito", value: string) => {
      setUbicacion((prev) => ({
        ...prev,
        [`selected${level.charAt(0).toUpperCase() + level.slice(1)}`]: value,
      }));

      if (level === "distrito") {
        setValue("infoCliente.direccionCliente.sCodigoUbigeo", value || "");
        clearErrors("infoCliente.direccionCliente.sCodigoUbigeo");
      } else {
        setValue("infoCliente.direccionCliente.sCodigoUbigeo", "");
      }
    },
    [setUbicacion, setValue, clearErrors]
  );

  const renderLocationSelect = useCallback(
    (
      label: string,
      items: Ubigeo[],
      level: "departamento" | "provincia" | "distrito"
    ) => {
      // Obtener el valor seleccionado según el nivel
      const selectedValue =
        ubicacion[
          level === "departamento"
            ? "selectedDepartamento"
            : level === "provincia"
            ? "selectedProvincia"
            : "selectedDistrito"
        ];

      return (
        <div className="mb-4 w-full">
     <Select
  className="w-full"
  label={label}
  value={selectedValue || ""}
  defaultSelectedKeys={[selectedValue || ""]}
  onChange={(e) => handleLocationChange(level, e.target.value)}
  isInvalid={!!errors.infoCliente?.direccionCliente?.sCodigoUbigeo}
  errorMessage={
    errors.infoCliente?.direccionCliente?.sCodigoUbigeo?.message
  }
>
  {[...items]
    .sort((a, b) => a.sNombre.localeCompare(b.sNombre))
    .map((item) => (
      <SelectItem key={item.sCodigo} value={item.sCodigo}>
        {item.sNombre}
      </SelectItem>
    ))}
</Select>

        </div>
      );
    },
    [
      handleLocationChange,
      errors.infoCliente?.direccionCliente?.sCodigoUbigeo,
      ubicacion,
    ]
  );

  // Efecto para validar el paso cuando los campos están completos
  useEffect(() => {
    const isValid =
      !!watch("infoCliente.direccionCliente.sDireccion") &&
      !!ubicacion.selectedDepartamento &&
      !!ubicacion.selectedProvincia &&
      !!ubicacion.selectedDistrito &&
      !errors.infoCliente?.direccionCliente;

    setStepValidations((prev) => ({
      ...prev,
      3: {
        isValid,
        errors: !isValid
          ? ["Por favor complete todos los campos de ubicación"]
          : undefined,
      },
    }));
  }, [
    watch,
    ubicacion.selectedDepartamento,
    ubicacion.selectedProvincia,
    ubicacion.selectedDistrito,
    errors.infoCliente?.direccionCliente,
    setStepValidations,
  ]);

  return (
    <>
    <div className="grid grid-cols-2 gap-4">
      <Input
        label="Dirección"
     
        placeholder="Ingrese la dirección completa"
        {...register("infoCliente.direccionCliente.sDireccion")}
        isInvalid={!!errors.infoCliente?.direccionCliente?.sDireccion}
        errorMessage={errors.infoCliente?.direccionCliente?.sDireccion?.message}
      />

      {renderLocationSelect("Departamento", ubigeo, "departamento")}
      </div>
      <div className="grid grid-cols-2 gap-4">
      {ubicacion.departamento?.hijos &&
        renderLocationSelect(
          "Provincia",
          ubicacion.departamento.hijos,
          "provincia"
        )}

      {ubicacion.provincia?.hijos &&
        renderLocationSelect("Distrito", ubicacion.provincia.hijos, "distrito")}
    </div>
    
      {errors.infoCliente?.direccionCliente?.sCodigoUbigeo && (
        <div className="text-red-500 text-sm mt-1 col-span-2">
          {errors.infoCliente.direccionCliente.sCodigoUbigeo.message}
        </div>
      )}
    </>
  );
};
export default StepLocation;
