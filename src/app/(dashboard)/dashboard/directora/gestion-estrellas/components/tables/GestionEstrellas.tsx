import { useGestionEstrellas } from "@/hooks/useGestionEstrellas";
import TableEstrellas from "./TableEstrellas";
import ModalCreateClient from "../modal/ModalCreateClient";
import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const GestionEstrellas = () => {
  const { data: session } = useSession();

  // Estados locales para paginación y búsqueda
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Hook de gestión
  const {
    estrellas,
    loading,
    totalPages,
    totalItems,
    getEstrellas,
  } = useGestionEstrellas(session?.user?.nIdCliente);

  // Modal de creación
  const {
    isOpen: isOpenCreate,
    onOpen: onOpenCreate,
    onOpenChange: onOpenChangeCreate,
  } = useDisclosure();

  // ✅ Llamar servicio al cargar con valores iniciales
  useEffect(() => {
    if (session?.user?.nIdCliente) {
      getEstrellas({ search: "", page: 1, limit: 25 });
    }
  }, [session]);

  // ✅ Actualizar datos al cambiar página
  useEffect(() => {
    if (session?.user?.nIdCliente) {
      getEstrellas({ search, page, limit: 25 });
    }
  }, [page]);

  const onSucessCreate = () => {
    localStorage.removeItem("star-management");
    getEstrellas({ search, page, limit: 25 });
    onOpenChangeCreate();
  };

  // ✅ Función para ejecutar búsqueda
  const handleBuscar = () => {
    setPage(1); // reinicia paginador
    getEstrellas({ search, page: 1, limit: 25 });
  };

  return (
    <div className="pb-2">
      <ModalCreateClient
        isOpen={isOpenCreate}
        onOpenChange={onOpenChangeCreate}
        onSuccess={onSucessCreate}
      />

      <TableEstrellas
        estrellas={estrellas}
        loading={loading}
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        onBuscar={handleBuscar} // 🔹 Nueva función
        onOpenCreate={onOpenCreate}
      />
    </div>
  );
};

export default GestionEstrellas;

