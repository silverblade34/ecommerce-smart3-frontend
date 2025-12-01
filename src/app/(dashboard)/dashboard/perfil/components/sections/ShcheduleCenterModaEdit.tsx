import { EditDirectoraForm, Horario } from "@/lib/interfaces/directora";
import { Button, Card, CardBody, Divider, TimeInput } from "@heroui/react";
import { Time } from "@internationalized/date";
import { CheckCircle, ClockClockwise, Coffee } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import {
  getFormaPagoService,
  PagosActivosService,
  sendMedioPagos,
} from "@/server/actions/client";
import {
  DataFormaPago,
  DataPagosActivos,
  IFormasPago,
} from "@/lib/interfaces/clientes";
import Image from "next/image";
import { toast } from "react-toastify";

type Props = {
  horarios: Horario;
  onSave?: (data: EditDirectoraForm, idCliente: number) => Promise<void>;
  nIdDirectora: number;
};

type ConfigSelect = {
  formasAgregadas: number[];
  formasEliminadas: number[];
};

// TODO: JEAN
const ScheduleCenterModaEdit = ({ horarios, onSave, nIdDirectora }: Props) => {
  const [configSelect, setConfigSelect] = useState<ConfigSelect>({
    formasAgregadas: [],
    formasEliminadas: [],
  });

  const [paymentMethods, setPaymentMethods] = useState<IFormasPago[]>([]);
  const [banks, setBanks] = useState<IFormasPago[]>([]);
  const [listaPagos, setListaPagos] = useState<DataFormaPago[]>([]);
  const [variante, setVariante] = useState(false);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await getFormaPagoService();
        const [methods, banks] = response.data;

        setPaymentMethods(methods.formasPago || []);
        setBanks(banks.formasPago || []);
        // console.log(setPaymentMethods);aqui
        // console.log(setBanks);
        // console.log("Métodos de pago:", methods.formasPago);
        // console.log("Bancos:", banks.formasPago);
      } catch (error) {
        console.error("Error al obtener las formas de pago:", error);
      }
    };

    const ListaMetodosActivos = async () => {
      try {
        const response = await PagosActivosService(nIdDirectora);
        const listaPagos = response.data
          .filter((pago: DataPagosActivos) => pago.nEstado === 1)
          .map((pago: DataPagosActivos) => pago.formaPago.nIdFormaPago); // Extraemos solo los IDs

        console.log("Formas de pago activas:", listaPagos);
        setListaPagos(
          response.data.map((pago: DataPagosActivos) => pago.formaPago)
        );
        console.log(setListaPagos);
        setConfigSelect((prev) => ({
          ...prev,
          formasAgregadas: listaPagos,
        }));
      } catch (error) {
        console.error("Error al obtener las formas de pago activas:", error);
      }
    };

    // Llamar ambas funciones
    fetchPaymentMethods();
    ListaMetodosActivos();
  }, [variante, nIdDirectora]);
  // Parse string time values into Time objects
  const parseTimeString = (timeStr: string): Time | null => {
    if (!timeStr) return null;

    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;

    return new Time(hours, minutes);
  };

  // Initialize state with values from props
  const [scheduleData, setScheduleData] = useState({
    weekdayStart:
      parseTimeString(horarios?.sHorarioAtencionInicoLV) || new Time(8, 0),
    weekdayEnd:
      parseTimeString(horarios?.sHorarioAtencionFinLV) || new Time(20, 0),
    saturdayStart:
      parseTimeString(horarios?.sHorarioAtencionInicoS) || new Time(9, 0),
    saturdayEnd:
      parseTimeString(horarios?.sHorarioAtencionFinS) || new Time(17, 0),
    breakStart:
      parseTimeString(horarios?.sHorarioRefrigerioInicio) || new Time(13, 0),
    breakEnd:
      parseTimeString(horarios?.sHorarioRefrigerioFin) || new Time(14, 0),
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper to format Time object to string (HH:MM)
  const formatTime = (time: Time): string => {
    return `${time.hour.toString().padStart(2, "0")}:${time.minute
      .toString()
      .padStart(2, "0")}`;
  };

  const handleSave = async () => {
        toast.success("Por el momento esta opción está deshabilitada")

    // if (!onSave) return;

    // setIsLoading(true);
    // try {
    //   await onSave(
    //     {
    //       sHorarioAtencionInicoLV: formatTime(scheduleData.weekdayStart),
    //       sHorarioAtencionFinLV: formatTime(scheduleData.weekdayEnd),
    //       sHorarioAtencionInicoS: formatTime(scheduleData.saturdayStart),
    //       sHorarioAtencionFinS: formatTime(scheduleData.saturdayEnd),
    //       sHorarioRefrigerioInicio: formatTime(scheduleData.breakStart),
    //       sHorarioRefrigerioFin: formatTime(scheduleData.breakEnd),
    //     },
    //     nIdDirectora
    //   );
    // } catch (error) {
    //   console.error("Error saving schedule:", error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const handleSelect = (id: number) => {
    setConfigSelect((prev) => {
      const isSelected = prev.formasAgregadas.includes(id);
      const isRemoved = prev.formasEliminadas.includes(id);

      if (isSelected) {
        // Si está en agregadas, lo quitamos y lo ponemos en eliminadas
        return {
          ...prev,
          formasAgregadas: prev.formasAgregadas.filter((item) => item !== id),
          formasEliminadas: [...prev.formasEliminadas, id],
        };
      } else if (isRemoved) {
        // Si estaba en eliminadas, lo quitamos de ahí y lo agregamos de nuevo
        return {
          ...prev,
          formasAgregadas: [...prev.formasAgregadas, id],
          formasEliminadas: prev.formasEliminadas.filter((item) => item !== id),
        };
      } else {
        // Si no estaba en ninguna lista, lo agregamos a agregadas
        return {
          ...prev,
          formasAgregadas: [...prev.formasAgregadas, id],
        };
      }
    });
  };

  const handleUpdate = async () => {
    toast.success("Por el momento esta opción está deshabilitada")
    // setIsLoading(true);
    // try {
    //   const response = await sendMedioPagos(
    //     nIdDirectora,
    //     configSelect.formasAgregadas,
    //     configSelect.formasEliminadas
    //   );
    //   console.log("Respuesta del servidor:", response);
    //   if (response.status == 201) {
    //     toast.success("Actualización exitosa")
    //   } else {
    //     toast.error("Hubo un problema al actualizar")
    //   }
    // } catch (error) {
    //   console.error("Error al actualizar métodos de pago:", error);
    // } finally {
    //   setIsLoading(false);
    //   setVariante(!variante);
    // }
  };


  return (
    <Card className="border border-gray-200 shadow-sm rounded-xl">
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col border-b border-gray-200 pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Horarios de Atención
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Los horarios determinan cuándo el centro está disponible para
              atender pedidos
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Weekdays Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <ClockClockwise
                className="mr-2 text-primary_sokso"
                size={20}
                weight="fill"
              />
              <span className="text-sm font-semibold uppercase text-gray-700">
                Lunes a Viernes
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                label="Desde"
                value={scheduleData.weekdayStart}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, weekdayStart: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
              <TimeInput
                label="Hasta"
                value={scheduleData.weekdayEnd}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, weekdayEnd: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
            </div>
          </div>

          {/* Saturday Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <ClockClockwise
                className="mr-2 text-primary_sokso"
                size={20}
                weight="fill"
              />
              <span className="text-sm font-semibold uppercase text-gray-700">
                Sábados
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                label="Desde"
                value={scheduleData.saturdayStart}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, saturdayStart: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
              <TimeInput
                label="Hasta"
                value={scheduleData.saturdayEnd}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, saturdayEnd: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
            </div>
          </div>

          {/* Break Section */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Coffee
                className="mr-2 text-primary_sokso"
                size={20}
                weight="fill"
              />
              <span className="text-sm font-semibold uppercase text-gray-700">
                Refrigerio
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TimeInput
                label="Desde"
                value={scheduleData.breakStart}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, breakStart: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
              <TimeInput
                label="Hasta"
                value={scheduleData.breakEnd}
                onChange={(time) => {
                  if (time) {
                    setScheduleData({ ...scheduleData, breakEnd: time });
                  }
                }}
                classNames={{
                  label: "text-sm text-gray-600",
                  inputWrapper:
                    "border-gray-300 hover:border-primary_sokso focus-within:border-primary_sokso",
                }}
              />
            </div>
          </div>
        </div>

        {/* <Divider className="my-6" /> */}

        {/**opcion deshabilitada temporalmente */}
        {/* <div className="flex justify-end">
          <Button
            className="bg-primary_sokso hover:bg-primary_sokso/90 text-white px-4 py-2"
            onPress={handleSave}
            isLoading={isLoading}
            spinner={
              <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
            }
          >
            Actualizar Horarios
          </Button>
        </div> */}

        <Divider className="my-6" />
        {/* <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col border-b border-gray-200 pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Medios de Pagos y Transferencia Activos
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lista de medios de pagos y bancos activos para los clientes
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            {listaPagos.map((method) => (
              <div
                key={method.nIdFormaPago}
                className="flex flex-col items-center border p-4 rounded-lg"
              >
                <Image
                  src={method.sNameIcon}
                  alt={method.sNombre}
                  className="w-16 h-16 rounded-md"
                  height={100}
                  width={100}
                />
                <span className="mt-2 text-sm font-medium">
                  {method.sNombre}
                </span>
                <span className="text-xs font-semibold text-green-500">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>

        <Divider className="my-6" /> */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col border-b border-gray-200 pb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Medios de Pagos y Transferencia disponibles
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Lista de medios de pagos y bancos disponibles para los clientes
            </p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
            {paymentMethods
              .filter(method => method.sNameIcon !== "1")
              .map((method) => (
                <div
                  key={method.nIdFormaPago}
                  className={`relative flex flex-col items-center border p-4 rounded-lg ${configSelect.formasAgregadas.includes(method.nIdFormaPago)
                    ? "bg-green-100"
                    : configSelect.formasEliminadas.includes(
                      method.nIdFormaPago
                    )
                      ? "bg-red-100"
                      : ""
                    }`}
                  onClick={() => handleSelect(method.nIdFormaPago)}
                >
                  {configSelect.formasAgregadas.includes(method.nIdFormaPago) && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                      <CheckCircle size={28} color="#22c55e" />
                    </div>
                  )}
                  {/* <Image
                  src={method.sNameIcon}
                  alt={method.sNombre}
                  className="w-16 h-16 rounded-md"
                  height={100}
                  width={100}
                /> */}
                  <Image
                    src={method.sNameIcon?.startsWith('http') || method.sNameIcon?.startsWith('/')
                      ? method.sNameIcon
                      : '/default-image.png'}
                    alt={method.sNombre}
                    className="w-16 h-16 rounded-md"
                    height={100}
                    width={100}
                  />
                  <span className="mt-2 text-sm font-medium">
                    {method.sNombre}
                  </span>
                </div>
              ))}

            {banks.map((method) => (
              <div
                key={method.nIdFormaPago}
                className={`relative flex flex-col items-center border p-4 rounded-lg ${configSelect.formasAgregadas.includes(method.nIdFormaPago)
                  ? "bg-green-100"
                  : configSelect.formasEliminadas.includes(
                    method.nIdFormaPago
                  )
                    ? "bg-red-100"
                    : ""
                  }`}
                onClick={() => handleSelect(method.nIdFormaPago)}
              >
                {configSelect.formasAgregadas.includes(method.nIdFormaPago) && (
                  <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                    <CheckCircle size={28} color="#22c55e" />
                  </div>
                )}
                {/* <Image
                  src={method.sNameIcon}
                  alt={method.sNombre}
                  className="w-16 h-16 rounded-md"
                  height={100}
                  width={100}
                /> */}
                <Image
                  src={method.sNameIcon?.startsWith('http') || method.sNameIcon?.startsWith('/')
                    ? method.sNameIcon
                    : '/default-image.png'}
                  alt={method.sNombre}
                  className="w-16 h-16 rounded-md"
                  height={100}
                  width={100}
                />
                <span className="mt-2 text-sm font-medium">
                  {method.sNombre}
                </span>
              </div>
            ))}
          </div>

          {/* <Divider className="my-6" /> */}
          {/* Botón para guardar selección 
          Deshabilitado Temporalmente
          */}
          {/* <div className="flex justify-end mt-4">
            <Button
              onPress={handleUpdate}
              className="bg-primary_sokso text-white px-4 py-2"
              isLoading={isLoading}
            >
              Actualizar Medios de Pago
            </Button>
          </div> */}
        </div>
      </CardBody>
    </Card>
  );
};

export default ScheduleCenterModaEdit;
