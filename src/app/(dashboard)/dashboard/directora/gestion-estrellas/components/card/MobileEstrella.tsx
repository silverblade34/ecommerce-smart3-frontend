import { ClienteEstrella, ClientTableResponse } from "@/lib/interfaces/clientes";
import { Button, Card, CardBody } from "@heroui/react";
import {
  Calendar,
  PaperPlaneTilt,
  Phone,
  User,
  WhatsappLogo,
} from "@phosphor-icons/react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)


const MobileCard = ({
  cliente,
  onViewDetails,
}: {
  cliente: ClienteEstrella;
  onViewDetails: (cliente: ClienteEstrella) => void;
}) => {
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

  return (
    <Card className="w-full mb-4">
      <CardBody className="gap-4">
        <div className="flex flex-col gap-3">
          {/* Encabezado con nombre y documento */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="text-default-400" size={20} />
                <div>
                  <p className="font-medium text-default-900">
                    {`${cliente.sNombre} ${cliente.sApellidos}`}
                  </p>
                  <p className="text-xs text-default-500">
                    {cliente.sNumeroDocumento}
                  </p>
                </div>
              </div>
              {/*   <Chip size="sm" variant="flat" className="capitalize">
                {cliente.sNumeroDocumento}
              </Chip> */}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${cliente.sTelefono}`}
                className="hover:text-blue-500"
              >
                <Phone className="text-default-400 cursor-pointer" size={18} />
              </a>
              <a
                href={`https://wa.me/${cliente.sTelefono}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-500"
              >
                <WhatsappLogo
                  className="text-default-400 cursor-pointer"
                  size={18}
                />
              </a>
              <p className="text-sm">{cliente.sTelefono}</p>
            </div>
            <div className="flex items-center gap-2">
              <PaperPlaneTilt className="text-default-400" size={18} />
              <p className="text-sm text-default-600"> {cliente.sOrigenRegistro=="Ecommerce" ? "Directo" : "Smart"}
              </p>
            </div>
            <div className="flex items-center">
              <Calendar className="text-default-400" size={18} />
              <p className="text-sm text-default-600 ml-2">
                {dayjs(cliente.dtFechaCreacion).utc().format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={() => onViewDetails(cliente)}
              className="font-medium w-full sm:w-auto"
            >
              Ver detalles
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MobileCard;
