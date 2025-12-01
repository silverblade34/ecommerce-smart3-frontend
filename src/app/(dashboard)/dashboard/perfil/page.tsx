"use client";

import { useSession } from "next-auth/react";
import { Warning } from "@phosphor-icons/react";
import ProfileEstrella from "./components/ProfileEstrella";
import { Card, CardBody, CardHeader } from "@heroui/react";
import ProfileDirector from "./components/ProfileDirector";
interface ProfileComponentProps {
  nIdCliente: number;
}
const ALLOWED_ROLES: {
  [key: string]: React.ComponentType<ProfileComponentProps>;
} = {
  "EST-EC-01": ProfileEstrella,
  "COL-EC-01": ProfileEstrella,
  "EST-TD-EC-01": ProfileEstrella,
  "DIR-EC-01": ProfileDirector,
};
export const dynamic = "force-dynamic";
export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") {
    return null;
  }

  const userRole: string | undefined = session?.user?.rol?.sCodigo;
  const Component = ALLOWED_ROLES[userRole];

  if (!Component) {
    return (
      <Card className="border-danger-light mx-auto mt-8 max-w-md">
        <CardHeader className="flex gap-3">
          <Warning size={24} className="text-danger" />
          <div className="flex flex-col">
            <p className="text-lg font-semibold text-danger">Acceso Denegado</p>
            <p className="text-small text-default-500">Error de permisos</p>
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-default-600">
            Lo sentimos, tu rol actual no tiene permisos para acceder a esta
            sección. Si crees que esto es un error, por favor contacta al
            administrador del sistema.
          </p>
          <p className="mt-2 text-small text-default-500">
            Rol actual: {userRole || "No definido"}
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Component nIdCliente={session.user.nIdCliente} />
    </>
  );
}
