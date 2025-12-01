import { Profile } from "@/lib/interfaces/profile";
import DataTodos from "./sections/DataTodos";
import PasswordUpdate from "./sections/PasswordUpdate";


type Props = {
  profile: Profile;
  contact?: boolean;

};
// TODO: AQUI AGREGAR EL CAMPO DE DEPARTAMENTO PROVINCIA Y DISTRITO, LATITUD Y LONGITUD EN CASO LO TENGA
const PersonalDate = ({ contact = false, profile }: Props) => {
  return (
    <div className="flex flex-col space-y-10 p-5">
      <DataTodos profile={profile}  />
      {/* {contact && <ContactDirectora />} */}
      <PasswordUpdate profile={profile} />
    </div>
  );
};

export default PersonalDate;
