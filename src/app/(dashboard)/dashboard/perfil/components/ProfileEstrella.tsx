"use client";

import useEstrellaData from "@/hooks/useEstrellaData";

import { Card, CardBody, Spinner, Tab, Tabs } from "@heroui/react";
import React from "react";
import PersonalDate from "./PersonalDate";
import ModaCenterEstrella from "./sections/ModaCenterEstrella";
import GerentaEstrella from "./sections/GerentaEstrella";
import useAuthStore from "@/context/user/auth-store";


type Props = {
  nIdCliente: number;
};

const ProfileEstrella = ({ nIdCliente }: Props) => {
  const { centroModaEstrella, error, loading } = useEstrellaData(nIdCliente);
   const { profile } = useAuthStore();

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

  if (!centroModaEstrella) {
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
      items={[
        {
          id: "data-estrella",
          label: "Mis datos",
          content: <PersonalDate contact={false} profile={profile} />,
        },
        {
          id: "moda-estrella",
          label: "Centro de Moda",
          content: (
            <ModaCenterEstrella centroModaEstrella={centroModaEstrella} />
          ),
        },
        {
          id: "gerenta-estrella",
          label: "Gerenta",
          content: <GerentaEstrella gerenta={centroModaEstrella.gerenta} />,
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

export default ProfileEstrella;
