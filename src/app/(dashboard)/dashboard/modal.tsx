"use client";

import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { Button } from "@heroui/react";
import { useModalStore } from "@/context/cart/modal-store";
import useCartStore from "@/context/cart/cart-store";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useCreatePedido } from "@/hooks/useOrderClient";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

const DuplicadosModal = () => {
  const { isDuplicadosOpen, duplicateData, closeModal } = useModalStore();
  const { toggleCart } = useCartStore();
  const { data: session } = useSession();
  const isDirector = session?.user?.rol?.sCodigo === "DIR-EC-01";
  const { handleEnviarPedido, loading } = useCreatePedido();


  const handleForceConfirm = async () => {
    const datos = localStorage.getItem('duplicatePayload');
console.log(datos)
    if (datos) {
      try {
        const { finalPayload } = JSON.parse(datos);
        const pedidoData = {
          ...finalPayload,
          permitirDuplicados: true
        };
        await handleEnviarPedido(pedidoData, false)

      } catch (error) {
        console.error("Error:", error);
        toast.error("Error al enviar pedido");
      }
    } else {
      toast.error("No se encontró el pedido en almacenamiento");
    }
  };

  const handleBackToCart = () => {
    closeModal();
    toggleCart();
  };


  const duplicadosGratuito= duplicateData?.duplicados?.some(
    (item) => item.message.includes("GRATIS")
  );


  return (
    <Transition show={isDuplicadosOpen} as={Fragment}>
      <Dialog className="relative z-[200]" onClose={closeModal}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
        </TransitionChild>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <Dialog.Title className="text-xl font-bold border-b pb-2">
                  Alerta de producto duplicado
                </Dialog.Title>
                <div className="py-4">
                  <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {duplicateData?.duplicados?.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-gray-50">
                        <p className="font-medium text-gray-900">{item.nombreProducto}</p>
                        <p className="font-medium text-gray-900">Color: {item.colorProducto}</p>
                        <p className="font-medium text-gray-900">Talla: {item.tallaProducto}</p>
                        {isDirector ? (
                          <p className="text-amber-600 my-4">
                            {item?.message} registrado el  {dayjs(item.fechaPedido).utc().format('DD/MM/YYYY HH:mm')}
                          </p>)
                          : (
                            <p className="text-amber-600 my-4">
                              Ya existe un pedido con este mismo producto, registrado el {dayjs(item.fechaPedido).utc().format('DD/MM/YYYY HH:mm')}
                            </p>
                          )}

                      </div>
                    ))}

                  </div>
                  <p className="mt-2"> Puedes ingresar a tu <a className="font-bold"> {isDirector ? "Gestión de pedidos" : "Seguimiento de pedidos"}</a> para verificar los detalles. </p>
                  {!duplicadosGratuito && <p className="mt-6 text-gray-700">¿Deseas enviar este pedido?</p>}
                </div>
                <div className="border-t pt-3 flex justify-end gap-2">
                  {!duplicadosGratuito &&
                    <Button color="success" onPress={handleForceConfirm} className="text-white" isLoading={loading}>
                      Enviar Pedido
                    </Button>}
                  <Button color="primary" variant="flat" onPress={handleBackToCart}>
                    Volver al Carrito
                  </Button>
                </div>
              </Dialog.Panel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DuplicadosModal;