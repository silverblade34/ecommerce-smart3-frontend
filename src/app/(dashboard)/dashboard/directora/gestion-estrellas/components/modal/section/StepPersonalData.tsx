import { StepValidation, ValidacionDocumento } from "@/hooks/useCreateClient";
import { GeneroCliente } from "@/lib/interfaces/clientes";
import { ClientPayload } from "@/lib/validations/cliente";
import { Input,  Select, SelectItem } from "@heroui/react";

import { Dispatch, SetStateAction, useEffect } from "react";
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
  validacionDocumento: ValidacionDocumento;
  genero: GeneroCliente[];
  setValue: UseFormSetValue<ClientPayload>;
  setStepValidations: Dispatch<SetStateAction<Record<number, StepValidation>>>;
  watch: UseFormWatch<ClientPayload>;
  clearErrors: UseFormClearErrors<ClientPayload>;
};

const StepPersonalData = ({
  register,
  validacionDocumento,
  errors,
  genero,
  setValue,
  setStepValidations,
  watch,
}: Props) => {
  const nombre = watch("infoCliente.sNombre");
  const apellidos = watch("infoCliente.sApellidos");
  const generoValue = watch("infoCliente.nIdGenero");
  const fechaNacimiento = watch("infoCliente.dtFechaNacimiento");

  // Calcular las fechas límite para la edad


  useEffect(() => {
    const isValid =
      !!nombre?.trim() &&
      !!apellidos?.trim() &&
      !!generoValue &&
      !!fechaNacimiento &&
      !errors.infoCliente?.sNombre &&
      !errors.infoCliente?.sApellidos &&
      !errors.infoCliente?.nIdGenero &&
      !errors.infoCliente?.dtFechaNacimiento;

    setStepValidations((prev) => ({
      ...prev,
      2: {
        isValid,
        errors: !isValid
          ? ["Por favor complete todos los campos correctamente"]
          : undefined,
      },
    }));
  }, [
    nombre,
    apellidos,
    generoValue,
    fechaNacimiento,
    errors.infoCliente?.sNombre,
    errors.infoCliente?.sApellidos,
    errors.infoCliente?.nIdGenero,
    errors.infoCliente?.dtFechaNacimiento,
    setStepValidations,
  ]);

  useEffect(() => {
    if (validacionDocumento.documentoValidado?.data) {
      const { name, fathers_lastname, mothers_lastname } =
        validacionDocumento.documentoValidado.data;
      setValue("infoCliente.sNombre", name);
      setValue(
        "infoCliente.sApellidos",
        `${fathers_lastname} ${mothers_lastname}`.trim()
      );
    }
  }, [validacionDocumento.documentoValidado, setValue]);

  // Manejar la validación y persistencia de la fecha
  // const handleDateChange = (value: CalendarDate | null) => {
  //   console.log("value", value)
  //   if (!value) {
  //     setValue("infoCliente.dtFechaNacimiento", null);
  //     return;
  //   }

  //   // Convertir CalendarDate a Date para la validación de Yup
  //   const date = new Date(value.year, value.month - 1, value.day);
  //   setValue("infoCliente.dtFechaNacimiento", date);
  //   clearErrors("infoCliente.dtFechaNacimiento");
  // };
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 100,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split('T')[0];
  const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  )
    .toISOString()
    .split('T')[0];

  return (
    <>
      

      <Select
        label="Género"
        placeholder="Seleccionar género"
        {...register("infoCliente.nIdGenero")}
        isInvalid={!!errors.infoCliente?.nIdGenero}
        errorMessage={errors.infoCliente?.nIdGenero?.message}
      >
        {genero.map(({ sNombre, nIdGenero }) => (
          <SelectItem key={nIdGenero} value={nIdGenero}>
            {sNombre}
          </SelectItem>
        ))}
      </Select>


      {/* <Input
        label="Fecha de nacimiento"
        onChange={(e) => handleDateChange(parseDate(e.target.value))}
        defaultValue=""
         type='date'
        min={minDate}
          max={maxDate}
        isInvalid={!!errors.infoCliente?.dtFechaNacimiento}
        errorMessage={
          errors.infoCliente?.dtFechaNacimiento?.message ||
          "La edad debe estar entre 18 y 100 años"
        }
      />
       */}
       <Input
          label="Fecha de nacimiento"
          type="date"
          min={minDate}
          max={maxDate}
          {...register("infoCliente.dtFechaNacimiento")}
          isInvalid={!!errors.infoCliente?.dtFechaNacimiento}
          errorMessage={
            errors.infoCliente?.dtFechaNacimiento?.message ||
            "La edad debe estar entre 18 y 100 años"
          }
        />
    </>
  );
};

export default StepPersonalData;