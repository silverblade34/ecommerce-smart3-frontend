// import { StepValidation, ValidacionDocumento } from "@/hooks/useCreateClient";
// import { TipoDocumentoCliente } from "@/lib/interfaces/clientes";
// import { ClientPayload } from "@/lib/validations/cliente";
// import { validateDocumentService } from "@/server/actions/client";
// import { Alert, Button, Input, Select, SelectItem } from "@heroui/react";
// import {
//   Dispatch,
//   SetStateAction,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";
// import {
//   FieldErrors,
//   UseFormRegister,
//   UseFormReset,
//   UseFormWatch,
// } from "react-hook-form";

// type Props = {
//   register: UseFormRegister<ClientPayload>;
//   errors: FieldErrors<ClientPayload>;
//   tipoDocumento: TipoDocumentoCliente[];
//   watch: UseFormWatch<ClientPayload>;
//   reset: UseFormReset<ClientPayload>;
//   setStepValidations: Dispatch<SetStateAction<Record<number, StepValidation>>>;
//   validacionDocumento: ValidacionDocumento;
//   setValidacionDocumento: Dispatch<SetStateAction<ValidacionDocumento>>;
// };
// const StepDocument = ({
//   errors,
//   register,
//   tipoDocumento,
//   watch,
//   reset,
//   setStepValidations,
//   setValidacionDocumento,
//   validacionDocumento,
// }: Props) => {
//   const [isValidating, setIsValidating] = useState(false);

//   const dniDocumentType = useMemo(
//     () => tipoDocumento.find(({ sNombre }) => sNombre === "DNI"),
//     [tipoDocumento]
//   );

//   const documentNumber = watch("infoCliente.documentoCliente.sNumeroDocumento");
//   const documentType = watch("infoCliente.documentoCliente.nIdTipoDocumento");

//   useEffect(() => {
//     setStepValidations((prev) => ({
//       ...prev,
//       1: {
//         isValid:
//           !!validacionDocumento.documentoValidado &&
//           !errors.infoCliente?.documentoCliente,
//         errors: errors.infoCliente?.documentoCliente
//           ? ["Por favor complete todos los campos correctamente"]
//           : undefined,
//       },
//     }));
//   }, [
//     validacionDocumento.documentoValidado,
//     errors.infoCliente?.documentoCliente,
//     setStepValidations,
//   ]);

//   const handleValidateDocument = useCallback(
//     async (document: string) => {
//       handleClearSearch()
//       try {
//         setValidacionDocumento((prev) => ({ ...prev, documentError: null }));

//         if (!document) {
//           throw new Error("El número de documento es requerido");
//         }

//         if (!documentType) {
//           throw new Error("El tipo de documento es requerido");
//         }

//         setIsValidating(true);
//         const res = await validateDocumentService(document);
//         console.log(" RES",res)
//         if (res.success) {
//           setValidacionDocumento({
//             documentoValidado: res,
//             documentError: null,
//           });
//           setStepValidations((prev) => ({
//             ...prev,
//             1: {
//               isValid: true,
//               errors: undefined,
//             },
//           }));
//         } else {
//           setValidacionDocumento((prev) => ({
//             ...prev,
//             documentError:
//               res.message ||
//               "Datos no encontrados, por favor verifique o envíe ticket",
//           }));
//           setStepValidations((prev) => ({
//             ...prev,
//             1: {
//               isValid: false,
//               errors: ["El documento no es válido"],
//             },
//           }));
//         }

//         return res;
//       } catch (err) {
//         console.error("Error validating document:", err);
//         setValidacionDocumento((prev) => ({
//           ...prev,
//           documentError:
//             "Datos no encontrados, por favor verifique o envíe ticket",
//         }));
//         setStepValidations((prev) => ({
//           ...prev,
//           1: {
//             isValid: false,
//             errors: [
//               err instanceof Error
//                 ? err.message
//                 : "Error al validar el documento",
//             ],
//           },
//         }));
//         return null;
//       } finally {
//         setIsValidating(false);
//       }
//     },
//     [documentType, setStepValidations, setValidacionDocumento]
//   );

//   const handleClearSearch = useCallback(() => {
//     const currentInfo = watch("infoCliente");
//     reset({
//       infoCliente: {
//         ...watch("infoCliente"),
//         documentoCliente: {
//           ...currentInfo.documentoCliente, // <-- Mantiene sNumeroDocumento
//           nIdTipoDocumento: dniDocumentType?.nIdTipoDocumento,
//         },
//         sNombre: "", // También limpiar nombres y apellidos
//         sApellidos: "",
//       },
//     });

//     setValidacionDocumento({
//       documentoValidado: undefined,
//       documentError: null,
//     });

//     setStepValidations((prev) => ({
//       ...prev,
//       1: {
//         isValid: false,
//         errors: undefined,
//       },
//     }));
//   }, [
//     reset,
//     dniDocumentType,
//     setStepValidations,
//     watch,
//     setValidacionDocumento,
//   ]);
//   return (
//     <div className="col-span-2 space-y-4">
//       <Select
//         label="Tipo de documento"
//         placeholder="Seleccionar tipo de documento"
//         {...register("infoCliente.documentoCliente.nIdTipoDocumento")}
//         isInvalid={!!errors.infoCliente?.documentoCliente?.nIdTipoDocumento}
//         errorMessage={
//           errors.infoCliente?.documentoCliente?.nIdTipoDocumento?.message
//         }
//       >
//         {dniDocumentType ? (
//           <SelectItem
//             key={dniDocumentType.nIdTipoDocumento}
//             value={dniDocumentType.nIdTipoDocumento}
//           >
//             {dniDocumentType.sNombre}
//           </SelectItem>
//         ) : null}
//       </Select>

//       <div className="flex gap-2 items-end">
//   {/* Input con altura completa */}
//   <div className="flex-1">
//     <Input
//       label="Número de documento"
//       placeholder="Ingrese número de documento"
//       value={watch("infoCliente.documentoCliente.sNumeroDocumento") || ""}
//       {...register("infoCliente.documentoCliente.sNumeroDocumento")}
//       isInvalid={!!errors.infoCliente?.documentoCliente?.sNumeroDocumento}
//       errorMessage={errors.infoCliente?.documentoCliente?.sNumeroDocumento?.message}
//       className="w-full"
//     />
//   </div>

//   {/* Contenedor de botones con misma altura */}
//   <div className="flex gap-2">
//     <Button
//       type="button"
//       color="primary"
//       isDisabled={
//         isValidating || !documentNumber || !documentType || documentNumber.length == 7
//       }
//       isLoading={isValidating}
//       onPress={() => handleValidateDocument(documentNumber)}
//       className={`min-h-[var(--input-height)] ${validacionDocumento.documentoValidado ? "bg-primary_sokso" : ""}`}
//     >
//       Validar
//     </Button>

//     {validacionDocumento.documentoValidado && (
//       <Button
//         type="button"
//         variant="light"
//         onPress={handleClearSearch}
//         className="border border-gray-300 min-h-[var(--input-height)]"
//       >
//         Limpiar
//       </Button>
//     )}
//   </div>
// </div>

//       <Input
//         label="Nombres"
//         placeholder="Ingrese nombres"
//         {...register("infoCliente.sNombre")}
//         value={validacionDocumento.documentoValidado?.data?.name }
//         isInvalid={!!errors.infoCliente?.sNombre}
//         errorMessage={errors.infoCliente?.sNombre?.message}
//         readOnly
//       />
//       <Input
//         label="Apellidos"
//         placeholder="Ingrese apellidos"
//         readOnly
//         {...register("infoCliente.sApellidos")}
//         value={
//           validacionDocumento.documentoValidado?.data?.fathers_lastname &&
//           validacionDocumento.documentoValidado?.data?.mothers_lastname
//             ? `${validacionDocumento.documentoValidado?.data?.fathers_lastname} ${validacionDocumento.documentoValidado?.data?.mothers_lastname}`
//             : ""
//         }
//         isInvalid={!!errors.infoCliente?.sApellidos}
//         errorMessage={errors.infoCliente?.sApellidos?.message}
//       />
//       {/* Mensajes de estado */}
//       {validacionDocumento.documentoValidado &&
//         !validacionDocumento.documentError && (
//           <Alert color={"success"} title={`Documento validado correctamente`} />
//         )}

//       {validacionDocumento.documentError && (
//         <Alert color={"danger"} title={validacionDocumento.documentError} />
//       )}
//     </div>
//   );
// };

// export default StepDocument;

import { StepValidation, ValidacionDocumento } from "@/hooks/useCreateClient";
import { TipoDocumentoCliente } from "@/lib/interfaces/clientes";
import { ClientPayload } from "@/lib/validations/cliente";
import { validateDocumentService } from "@/server/actions/client";
import { Alert, Button, Input, Select, SelectItem } from "@heroui/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FieldErrors,
  UseFormRegister,
  UseFormReset,
  UseFormWatch,
} from "react-hook-form";

type Props = {
  register: UseFormRegister<ClientPayload>;
  errors: FieldErrors<ClientPayload>;
  tipoDocumento: TipoDocumentoCliente[];
  watch: UseFormWatch<ClientPayload>;
  reset: UseFormReset<ClientPayload>;
  setStepValidations: Dispatch<SetStateAction<Record<number, StepValidation>>>;
  validacionDocumento: ValidacionDocumento;
  setValidacionDocumento: Dispatch<SetStateAction<ValidacionDocumento>>;
};
const StepDocument = ({
  errors,
  register,
  tipoDocumento,
  watch,
  reset,
  setStepValidations,
  setValidacionDocumento,
  validacionDocumento,
}: Props) => {
  const [isValidating, setIsValidating] = useState(false);

  const dniDocumentType = useMemo(
    () => tipoDocumento.find(({ sNombre }) => sNombre === "DNI"),
    [tipoDocumento]
  );

  const documentNumber = watch("infoCliente.documentoCliente.sNumeroDocumento");
  const documentType = watch("infoCliente.documentoCliente.nIdTipoDocumento");

  useEffect(() => {
    setStepValidations((prev) => ({
      ...prev,
      1: {
        isValid:
          !!validacionDocumento.documentoValidado &&
          !errors.infoCliente?.documentoCliente,
        errors: errors.infoCliente?.documentoCliente
          ? ["Por favor complete todos los campos correctamente"]
          : undefined,
      },
    }));
  }, [
    validacionDocumento.documentoValidado,
    errors.infoCliente?.documentoCliente,
    setStepValidations,
  ]);

  const handleValidateDocument = useCallback(
    async (document: string) => {
      try {
        setValidacionDocumento((prev) => ({ ...prev, documentError: null }));

        if (!document) {
          throw new Error("El número de documento es requerido");
        }

        if (!documentType) {
          throw new Error("El tipo de documento es requerido");
        }

        setIsValidating(true);
        const res = await validateDocumentService(document);
        console.log(res)
        if (res.success) {
          setValidacionDocumento({
            documentoValidado: res,
            documentError: null,
          });
          setStepValidations((prev) => ({
            ...prev,
            1: {
              isValid: true,
              errors: undefined,
            },
          }));
        } else {
          setValidacionDocumento((prev) => ({
            ...prev,
            documentError:
              res.message ||
              "Datos no encontrados, por favor verifique o envíe ticket",
          }));
          setStepValidations((prev) => ({
            ...prev,
            1: {
              isValid: false,
              errors: ["El documento no es válido"],
            },
          }));
        }

        return res;
      } catch (err) {
        console.error("Error validating document:", err);
        setValidacionDocumento((prev) => ({
          ...prev,
          documentError:
            "Datos no encontrados, por favor verifique o envíe ticket",
        }));
        setStepValidations((prev) => ({
          ...prev,
          1: {
            isValid: false,
            errors: [
              err instanceof Error
                ? err.message
                : "Error al validar el documento",
            ],
          },
        }));
        return null;
      } finally {
        setIsValidating(false);
      }
    },
    [documentType, setStepValidations, setValidacionDocumento]
  );

  const handleClearSearch = useCallback(() => {
    reset({
      infoCliente: {
        ...watch("infoCliente"),
        documentoCliente: {
          sNumeroDocumento: "", // Asegurar que se limpia el número de documento
          nIdTipoDocumento: dniDocumentType?.nIdTipoDocumento,
        },
        sNombre: "", // También limpiar nombres y apellidos
        sApellidos: "",
      },
    });

    setValidacionDocumento({
      documentoValidado: undefined,
      documentError: null,
    });

    setStepValidations((prev) => ({
      ...prev,
      1: {
        isValid: false,
        errors: undefined,
      },
    }));
  }, [
    reset,
    dniDocumentType,
    setStepValidations,
    watch,
    setValidacionDocumento,
  ]);
  return (
    <div className="col-span-2 space-y-4">
      <Select
        label="Tipo de documento"
        placeholder="Seleccionar tipo de documento"
        {...register("infoCliente.documentoCliente.nIdTipoDocumento")}
        isInvalid={!!errors.infoCliente?.documentoCliente?.nIdTipoDocumento}
        errorMessage={
          errors.infoCliente?.documentoCliente?.nIdTipoDocumento?.message
        }
      >
        {dniDocumentType ? (
          <SelectItem
            key={dniDocumentType.nIdTipoDocumento}
            value={dniDocumentType.nIdTipoDocumento}
          >
            {dniDocumentType.sNombre}
          </SelectItem>
        ) : null}
      </Select>

      <div className="flex gap-2 items-end">
  {/* Input con altura completa */}
  <div className="flex-1">
    <Input
      label="Número de documento"
      placeholder="Ingrese número de documento"
      value={watch("infoCliente.documentoCliente.sNumeroDocumento") || ""}
      {...register("infoCliente.documentoCliente.sNumeroDocumento")}
      isInvalid={!!errors.infoCliente?.documentoCliente?.sNumeroDocumento}
      errorMessage={errors.infoCliente?.documentoCliente?.sNumeroDocumento?.message}
      className="w-full"
       maxLength={8}
    />
  </div>

  {/* Contenedor de botones con misma altura */}
  <div className="flex gap-2">
    <Button
      type="button"
      color="primary"
      isDisabled={
        isValidating || !documentNumber || !documentType || documentNumber.length == 7
      }
      isLoading={isValidating}
      onPress={() => handleValidateDocument(documentNumber)}
      className={`min-h-[var(--input-height)] ${validacionDocumento.documentoValidado ? "bg-primary_sokso" : ""}`}
    >
      Validar
    </Button>

    {validacionDocumento.documentoValidado && (
      <Button
        type="button"
        variant="light"
        onPress={handleClearSearch}
        className="border border-gray-300 min-h-[var(--input-height)]"
      >
        Limpiar
      </Button>
    )}
  </div>
</div>

      <Input
        label="Nombres"
        placeholder="Ingrese nombres"
        {...register("infoCliente.sNombre")}
        value={validacionDocumento.documentoValidado?.data?.name }
        isInvalid={!!errors.infoCliente?.sNombre}
        errorMessage={errors.infoCliente?.sNombre?.message}
        readOnly
      />
      <Input
        label="Apellidos"
        placeholder="Ingrese apellidos"
        readOnly
        {...register("infoCliente.sApellidos")}
        value={
          validacionDocumento.documentoValidado?.data?.fathers_lastname &&
          validacionDocumento.documentoValidado?.data?.mothers_lastname
            ? `${validacionDocumento.documentoValidado?.data?.fathers_lastname} ${validacionDocumento.documentoValidado?.data?.mothers_lastname}`
            : ""
        }
        isInvalid={!!errors.infoCliente?.sApellidos}
        errorMessage={errors.infoCliente?.sApellidos?.message}
      />
      {/* Mensajes de estado */}
      {validacionDocumento.documentoValidado &&
        !validacionDocumento.documentError && (
          <Alert color={"success"} title={`Documento validado correctamente`} />
        )}

      {validacionDocumento.documentError && (
        <Alert color={"danger"} title={validacionDocumento.documentError} />
      )}
    </div>
  );
};

export default StepDocument;
