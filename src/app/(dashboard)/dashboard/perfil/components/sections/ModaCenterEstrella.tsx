import { CentroModaEstrella } from "@/lib/interfaces/clientes";
import ModaCenterDataInfo from "./ModaCenterDataInfo";
import PaymentCenterModa from "./PaymentCenterModa";
import ScheduleCenterModa from "./ShcheduleCenterModa";

type Props = {
  centroModaEstrella: CentroModaEstrella;
};

const ModaCenterEstrella = ({ centroModaEstrella }: Props) => {

  return (
    <div className="flex flex-col space-y-10 p-5">
      <ModaCenterDataInfo directora={centroModaEstrella.directora} />

      <ScheduleCenterModa
        horario={centroModaEstrella.directora.centroModa.horario}
      />
      <PaymentCenterModa
        centroModa={centroModaEstrella}
        transporte={centroModaEstrella.directora.centroModa.transporte}
        formaPago={centroModaEstrella.directora.centroModa.formaPago}
      />
    </div>
  );
};

export default ModaCenterEstrella;
