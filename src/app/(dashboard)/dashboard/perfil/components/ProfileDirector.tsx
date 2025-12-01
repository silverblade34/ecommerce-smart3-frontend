import useDirectoraData from "@/hooks/useDirectoraData";
import { Card, CardBody, Spinner, Tab, Tabs } from "@heroui/react";
import PersonalDate from "./PersonalDate";
import ModaCenterDirectora from "./sections/ModaCenterDirectora";
import PedidosDirectora from "./sections/PedidosDirectora";
import GerentaEstrella from "./sections/GerentaEstrella";
import { useState } from "react";

type Props = {
  nIdCliente: number;
};

const ProfileDirector = ({ nIdCliente }: Props) => {
  const { error, loading, profile, centroModaDirectoa, updateDataDirectora, reload } =
    useDirectoraData(nIdCliente);

  const [selectedTab, setSelectedTab] = useState("data-estrella");

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }



  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!centroModaDirectoa) {
    return (
      <div className="p-4 text-center">
        No se encontraron datos del centro de moda.
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 text-center">No se encontraron datos del perfil.</div>
    );
  }

  return (
    <Tabs
      selectedKey={selectedTab}
      onSelectionChange={(key) => setSelectedTab(String(key))}
      items={[
        {
          id: "data-estrella",
          label: "Mis datos",
          content: <PersonalDate contact={false} profile={profile} />,
        },
        {
          id: "moda-directora",
          label: "Centro de Moda ",
          content: (
            <ModaCenterDirectora
              centroModaDirectoa={centroModaDirectoa}
              updateDataDirectora={updateDataDirectora}
              profile={profile}
              reload={reload}
            />
          ),
        },
        {
          id: "pedidos",
          label: "Gestión ",
          content: (
            <PedidosDirectora
              centroModaDirectoa={centroModaDirectoa}
              updateDataDirectora={updateDataDirectora}
            />
          ),
        },
        {
          id: "gerenta-directora",
          label: "Gerenta ",
          content: <GerentaEstrella gerenta={centroModaDirectoa.gerenta} />,
        },
      ]}
      className="relative w-full"
      variant="bordered"
    >
      {(item) => (
        <Tab
          key={item.id}
          title={
            <div className="flex items-center space-x-2">
              <span>{item.label}</span>
            </div>
          }
        >
          <Card>
            <CardBody>{item.content}</CardBody>
          </Card>
        </Tab>
      )}
    </Tabs>
  );
};

export default ProfileDirector;
