import {
  DocumentoValidado,
  GeneroCliente,
  TipoDocumentoCliente,
  Ubigeo,
} from "@/lib/interfaces/clientes";
import {
  getGenerosService,
  getTipoDocumentoService,
  getUbigeoService,
} from "@/server/actions/client";
import { useCallback, useEffect, useState } from "react";

export const STEPS = [
  { title: "Documento", description: "Validación de documento" },
  { title: "Datos Personales", description: "Información básica" },
  { title: "Ubicación", description: "Dirección y ubicación" },
  { title: "Contacto", description: "Información de contacto" },
] as const;
export interface StepValidation {
  isValid: boolean;
  errors?: string[];
}
export interface ValidacionDocumento {
  documentoValidado: DocumentoValidado | undefined;
  documentError: string | null;
}
export interface UbicacionState {
  selectedDepartamento: string | null;
  selectedProvincia: string | null;
  selectedDistrito: string | null;
  departamento: Ubigeo | null;
  provincia: Ubigeo | null;
  distrito: Ubigeo | null;
}

const initialUbicacionState: UbicacionState = {
  selectedDepartamento: null,
  selectedProvincia: null,
  selectedDistrito: null,
  departamento: null,
  provincia: null,
  distrito: null,
};
export const useCreateClient = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const handlePrevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const [stepValidations, setStepValidations] = useState<
    Record<number, StepValidation>
  >({
    1: { isValid: false },
    2: { isValid: false },
    3: { isValid: false },
    4: { isValid: false },
  });

  const [ubigeo, setUbigeo] = useState<Ubigeo[]>([]);
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumentoCliente[]>(
    []
  );
  const [genero, setGenero] = useState<GeneroCliente[]>([]);
  const [ubicacion, setUbicacion] = useState<UbicacionState>(
    initialUbicacionState
  );
  const updateUbicacion = useCallback((updates: Partial<UbicacionState>) => {
    setUbicacion((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);
  useEffect(() => {
    if (!ubicacion.selectedDepartamento) {
      updateUbicacion({
        departamento: null,
        provincia: null,
        distrito: null,
      });
      return;
    }

    const departamento =
      ubigeo.find((item) => item.sCodigo === ubicacion.selectedDepartamento) ||
      null;

    updateUbicacion({
      departamento,
      provincia: null,
      distrito: null,
    });
  }, [ubicacion.selectedDepartamento, ubigeo, updateUbicacion]);

  useEffect(() => {
    if (!ubicacion.selectedProvincia || !ubicacion.departamento?.hijos) {
      updateUbicacion({
        provincia: null,
        distrito: null,
      });
      return;
    }

    const provincia =
      ubicacion.departamento.hijos.find(
        (item) => item.sCodigo === ubicacion.selectedProvincia
      ) || null;

    updateUbicacion({
      provincia,
      distrito: null,
    });
  }, [ubicacion.selectedProvincia, ubicacion.departamento, updateUbicacion]);

  useEffect(() => {
    if (!ubicacion.selectedDistrito || !ubicacion.provincia?.hijos) {
      updateUbicacion({ distrito: null });
      return;
    }

    const distrito =
      ubicacion.provincia.hijos.find(
        (item) => item.sCodigo === ubicacion.selectedDistrito
      ) || null;

    updateUbicacion({ distrito });
  }, [ubicacion.selectedDistrito, ubicacion.provincia, updateUbicacion]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string>("");

  // phone verification

  //document validation
  const [validacionDocumento, setValidacionDocumento] =
    useState<ValidacionDocumento>({
      documentoValidado: undefined,
      documentError: null,
    });

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [generosData, ubigeoData, tipoDocumentoData] = await Promise.all([
          getGenerosService(),
          getUbigeoService(),
          getTipoDocumentoService(),
        ]);

        setGenero(generosData);
        setUbigeo(ubigeoData);
        setTipoDocumento(tipoDocumentoData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar datos iniciales"
        );
        console.error("Error loading initial data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const resetAll = useCallback(() => {
    setIsPhoneVerified(false);
    setVerificationCode("");
    setValidacionDocumento({
      documentoValidado: undefined,
      documentError: null,
    });
    setUbicacion(initialUbicacionState);
    setStepValidations({
      1: { isValid: false },
      2: { isValid: false },
      3: { isValid: false },
      4: { isValid: false },
    });
    setCurrentStep(1);
  }, []);

  return {
    currentStep,
    setCurrentStep,
    handlePrevStep,
    stepValidations,
    setStepValidations,
    resetAll,
    isLoading,
    setIsLoading,

    //initial data
    genero,
    ubigeo,
    tipoDocumento,

    // document validation
    validacionDocumento,
    setValidacionDocumento,

    // location
    ubicacion,
    setUbicacion,
    error,

    // phone verification
    isPhoneVerified,
    setIsPhoneVerified,
    verificationCode,
    setVerificationCode,
  };
};
