import {
  CentroModaDirectora,
  EditDirectoraForm,
} from "@/lib/interfaces/directora";
import ShcheduleCenterModaEdit from "./ShcheduleCenterModaEdit";
import MapCentroModa from "./MapCentroModa";
import { Profile } from "@/lib/interfaces/profile";
import UpdatePhone from "../modals/UpdatePhone";
import UpdateEmail from "../modals/UpdateEmail";

type Props = {
  profile: Profile;
  centroModaDirectoa: CentroModaDirectora;
  updateDataDirectora: (
    data: EditDirectoraForm,
    idCliente: number
  ) => Promise<void>;
  reload: () => Promise<void>;
};

const ModaCenterDirectora = ({
  centroModaDirectoa,
  updateDataDirectora,
  profile,
  reload
}: Props) => {

  const {
    cliente: {
      nIdCliente: clientId,
      infoCliente: {
        contactoCliente: { sTelefono: phone, sEmail: email },
      },
    },
  } = profile;

  const existUbicacion = centroModaDirectoa?.directora?.centroModa?.ubicacion !== null;



  return (
    <div className="flex flex-col space-y-10 p-5">

      {existUbicacion && (
        <MapCentroModa
          ubicacion={centroModaDirectoa?.directora?.centroModa?.ubicacion}
        />
      )}
      <ShcheduleCenterModaEdit
        horarios={centroModaDirectoa?.directora?.centroModa?.horario}
        onSave={updateDataDirectora}
        nIdDirectora={centroModaDirectoa?.directora?.nIdDirectora}
      />

      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UpdatePhone phone={phone} id={clientId} onUpdated={reload} />
          <UpdateEmail email={email} id={clientId} onUpdated={reload} />
        </div>
        {/* <AddressCard address={address} /> */}
      </div>
      {/* <PaymentCenterModaEdit /> */}
    </div>
  );
};

export default ModaCenterDirectora;