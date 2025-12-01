import {
  CentroModaDirectora,
  EditDirectoraForm,
} from "@/lib/interfaces/directora";
import GestionPedidos from "./GestionPedidos";
import ReturnDirectora from "./ReturnDirectora";

type Props = {
  centroModaDirectoa: CentroModaDirectora;
  updateDataDirectora: (
    data: EditDirectoraForm,
    idCliente: number
  ) => Promise<void>;
};

const PedidosDirectora = ({
  centroModaDirectoa,
  updateDataDirectora,
}: Props) => {
  return (
    <div className="flex flex-col space-y-10 p-5">
      <GestionPedidos
        horarios={centroModaDirectoa.directora.centroModa.horario}
        onSave={updateDataDirectora}
        nIdDirectora={centroModaDirectoa.directora.nIdDirectora}
      />
      {/* <DeliveryDirectora /> */}
      <ReturnDirectora
        horarios={centroModaDirectoa.directora.centroModa.horario}
        onSave={updateDataDirectora}
        nIdDirectora={centroModaDirectoa.directora.nIdDirectora}
      />
    </div>
  );
};

export default PedidosDirectora;
