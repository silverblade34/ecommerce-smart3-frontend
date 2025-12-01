import { usePedidosStore } from "@/context/devoluciones/tracking-store";
import { useDetalleDevoluciones } from "@/hooks/devolutions/useDevolution";
import { DetalleDevolutiom } from "@/lib/interfaces/devoluciones";
import { deleteProductoDevolucionService } from "@/server/actions/devoluciones";
import { Formats } from "@/utils/formats";
import {
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { CaretDown, Cube, Trash } from "@phosphor-icons/react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  sNumeroDevolucion: string;
  detalle: (DetalleDevolutiom & { sNombreEstrella: string })[];
  refresh: () => void;

}

export const ItemDetail = ({ sNumeroDevolucion, detalle ,refresh}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenDetail, setIsOpenDetail] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState<number | null>(null);
  const { removeSelectedPedido, selectedPedidos } = usePedidosStore();
  const [datosEliminar, setDatosEliminar] = useState({ numDevolucion: '', idDetalle: '' })
  const { listDetalleDevoluciones } = useDetalleDevoluciones([]);
  const router = useRouter();

  const handleDeleteProducto = async () => {
    const total = detalle.filter(d => d.sNumeroDevolucion === datosEliminar.numDevolucion).length;
    console.log(total)
    try {
      const response = await deleteProductoDevolucionService(datosEliminar.idDetalle);
      if (response.success) {
        toast.success("Devolución eliminada correctamente");
        if (total == 1) {
          removeSelectedPedido(datosEliminar.numDevolucion);
        }
        console.log(selectedPedidos.length)
        if (selectedPedidos.length == 1 && total == 1) {
          router.push(`/dashboard/devoluciones`
          );
        }
        refresh();
      }
      setIsOpenModal(false);
    } catch (error) {
      toast.error("Hubo un problema al eliminar la devolución");
    }
  };

  const handleSeleccion = (numDevolucion: string, idDetalle: string) => {
    setIsOpenModal(true)
    setDatosEliminar({ numDevolucion: numDevolucion, idDetalle: idDetalle })
  }

  return (
    <div className="rounded-xl shadow-md bg-white overflow-hidden transition-all">
      <div
        className="flex justify-between items-center bg-purple-100 text-purple-800 font-semibold px-4 py-3 cursor-pointer hover:bg-purple-200 transition-colors"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-3">
          <span className="bg-primary_sokso p-2 rounded-full">
            <Cube size={18} color="#FFFFFF" weight="fill" />
          </span>
          <p className="text-md">{sNumeroDevolucion}</p>
        </div>
        <CaretDown
          weight="fill"
          size={20}
          color="#5e5555"
          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </div>
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {detalle.map((prod, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 ">
              <header className="flex items-center rounded-md">
                <p className="text-purple-800 font-semibold text-sm md:text-md mb-2">{prod.sNombreEstrella}</p>
              </header>
              <Divider></Divider>
              <div className="flex justify-between items-start sm:items-center mb-2">
                <div className="flex flex-col sm:gap-1">
                  <b className="text-sm  mt-2">
                    {prod.sNombreProducto || ""}
                  </b>
                  <p className="text-[10px] sm:text-sm font-medium leading-[15px] sm:leading-normal">
                    Tipo: {prod.sTipoDevolucion}
                  </p>
                </div>
                <Button
                  isIconOnly
                  variant="light"
                  onPress={() => handleSeleccion(prod.sNumeroDevolucion, prod.idDetalle)}
                  className="self-start"
                >
                  <Trash size={20} color="#FF0000" />
                </Button>
              </div>
              <div className="flex flex-row gap-4 items-start">
                <div className="w-1/3 min-w-[100px] sm:w-32 sm:min-w-0 max-w-[150px]">
                  <Image
                    src={
                      prod.sImagenProducto || "/images/imagen-no-disponible.jpg"
                    }
                    alt={prod.sNombreProducto}
                    width={120}
                    height={100}
                    className="rounded-md w-full h-auto object-cover shadow-md border-gray-50 border-2"
                  />
                </div>
                <div className="w-2/3 flex flex-col gap-1 flex-grow sm:w-auto">
                  <div className="flex flex-col gap-1 text-xs md:text-sm">
                    <p className="text-xs md:text-sm">
                      Talla: {prod.sTalla.replace("TALLA", "")}
                    </p>
                    <p className="text-xs md:text-sm">
                      Color: {prod.sColor || "Sin prod"}
                    </p>
                    <p className="text-xs md:text-sm">
                      Precio: s/. {prod.nPrecio || "Sin prod"}
                    </p>
                    <p className="text-xs md:text-sm">
                      Cantidad: {prod.nCantidad || "Sin prod"}
                    </p>
                  </div>
                  <p className="text-xs md:text-sm">
                    Registro:{" "}
                    {Formats.toDate(prod.dtFechaRegistro as unknown as Date)}
                  </p>
                </div>
              </div>
             {prod.sTipoDevolucion !== "SHOWROOM" && (
  <div className="mt-4 border-t">
    <p className="mt-2 text-sm text-gray-600">
      Motivo: {prod.subDetalle?.sMotivo}
    </p>
    {prod.subDetalle?.sMotivo !== "Cambio por talla" &&
      prod.subDetalle?.sMotivo !== "Busco otra opción" && (
        <>
          <p className="mt-2 text-sm text-gray-600">
            Detalle: {prod.subDetalle?.sDetalle}
          </p>
          {prod.subDetalle?.fotos?.length > 0 && (
            <div className="flex justify-center mt-3 gap-3 flex-wrap">
              {prod.subDetalle.fotos.map((foto, i) => (
                <Image
                  key={i}
                  src={foto || "/images/imagen-no-disponible.jpg"}
                  alt={`Foto`}
                  width={60}
                  height={60}
                  className="rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}
        </>
      )}
  </div>
)}

            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isOpenModal}
        onOpenChange={() => setIsOpenModal(false)}
        placement="center"
      >
        <ModalContent>
          <ModalHeader>Confirmar Eliminación</ModalHeader>
          <ModalBody>
            <p>¿Estás seguro de que deseas eliminar esta devolución?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setIsOpenModal(false)} color="default">
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteProducto}

            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </div>
  );
};
