import { ClienteEstrella, ClientTableResponse, } from "@/lib/interfaces/clientes";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import {
  Browsers,
  Calendar,
  CalendarCheck,
  Coins,
  Envelope,
  MapPin,
  MapTrifold,
  Phone,
  Tag,
  User,
} from "@phosphor-icons/react";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)
interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const DetailItem = ({ icon, label, value }: DetailItemProps) => (
  <div className="flex items-start gap-3">
    <div className="text-default-400 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-default-400">{label}</p>
      <p className="text-sm text-default-700">{value || "No especificado"}</p>
    </div>
  </div>
);

interface ClientDetailModalProps {
  client?: ClienteEstrella;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ClientDetailModal({
  client,
  isOpen,
  onOpenChange,
}: ClientDetailModalProps) {
  if (!client) return null;
  // console.log("Client Details:", client);

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat("es-PE", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date);
  // };

  // const formatOnlyDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return new Intl.DateTimeFormat("es-PE", {
  //     day: "2-digit",
  //     month: "2-digit",
  //     year: "numeric",
  //   }).format(date);
  // };

  const [departamento, provincia, distrito] = client.sUbigeoResumen.split(':').map(s => s.trim());

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h3 className="text-xl font-bold">Detalles del Cliente</h3>
              {/*} <p className="text-sm text-default-500">
                ID: {client.nIdCliente}
              </p> */}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información Personal */}
                <Card>
                  <CardHeader>
                    <h4 className="text-md font-semibold ">
                      Información Personal
                    </h4>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="space-y-4">
                      <DetailItem
                        icon={<User size={20} />}
                        label="Nombres Completos"
                        value={`${client.sNombre} ${client.sApellidos}`}
                      />
                      <DetailItem
                        icon={<Tag size={20} />}
                        label="Documento"
                        value={client.sNumeroDocumento}
                      />
                      <DetailItem
                        icon={<Calendar size={20} />}
                        label="Fecha de Registro"
                        value={dayjs(client.dtFechaCreacion).utc().format("DD/MM/YYYY HH:mm")}
                      />
                      <DetailItem
                        icon={<Calendar size={20} />}
                        label="Fecha de Nacimiento"
                        value={dayjs(client.dtFechaNacimiento).utc().format("DD/MM/YYYY")}
                      />
                      <DetailItem
                        icon={<Browsers size={20} />}
                        label="Origen"
                        value={`${client.sOrigenRegistro == "Ecommerce" ? "Registro Directo" : "Registro Smart"}`}
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* Información de Contacto */}
                <Card>
                  <CardHeader>
                    <h4 className="text-md font-semibold ">
                      Información de Contacto
                    </h4>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="space-y-4">
                      <DetailItem
                        icon={<Phone size={20} />}
                        label="Teléfono"
                        value={client.sTelefono}
                      />
                      <DetailItem
                        icon={<Envelope size={20} />}
                        label="Correo Electrónico"
                        value={client.sEmail}
                      />
                      <DetailItem
                        icon={<MapPin size={20} />}
                        label="Dirección"
                        value={client.sDireccion}
                      />
                      <DetailItem
                        icon={<MapTrifold size={20} />}
                        label="Departamento"
                        value={departamento}
                      />
                      <DetailItem
                        icon={<MapTrifold size={20} />}
                        label="Provincia"
                        value={provincia}
                      />
                      <DetailItem
                        icon={<MapTrifold size={20} />}
                        label="Distrito"
                        value={distrito}
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* Información de Contacto */}
                <Card>
                  <CardHeader>
                    <h4 className="text-md font-semibold ">
                      Información de Venta
                    </h4>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <div className="space-y-4">
                      <DetailItem
                        icon={<CalendarCheck size={20} />}
                        label="Fecha Última Compra"
                        value=""
                      />
                      <DetailItem
                        icon={<Coins size={20} />}
                        label="Monto Última Compra"
                        value=""
                      />
                    </div>
                  </CardBody>
                </Card>

                {client.sTipoCliente == "Colaborador" && (
                  <Card>
                    <CardHeader>
                      <h4 className="text-md font-semibold">Información Adicional</h4>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                      <div className="space-y-4">
                        <DetailItem
                          icon={<CalendarCheck size={20} />}
                          label="Tipo de Cliente"
                          value={client.sTipoCliente || "No especificado"}
                        />
                        <DetailItem
                          icon={<MapPin size={20} />}
                          label="Centro de Labores"
                          value={client.sCentroLabores || "No especificado"}
                        />
                      </div>
                    </CardBody>
                  </Card>
                )}

              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
