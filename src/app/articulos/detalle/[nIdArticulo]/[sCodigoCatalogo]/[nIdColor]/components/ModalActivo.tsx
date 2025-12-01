import CloseButton from "@/components/common/buttons/CloseButton";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { CursorClick, HandTap } from "@phosphor-icons/react/dist/ssr";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  modal: boolean;
  handleModal: () => void;
  producto: DetalleProducto;
};

const ModalActivo = ({
  handleModal: onClose,
  modal: isOpen,
  producto,
}: Props) => {
  const onCloseModal = () => {
    onClose();
  };

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isDirector =
    isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01";

  const displayPrice = isDirector
    ? producto.alternativeInfo.precios.nPrecioDirector
    : isAuthenticated
      ? producto.alternativeInfo.precios.nPrecioPromotor
      : producto.alternativeInfo.precios.nPrecioSugerido;

  const showOriginalPrice =
    isAuthenticated && producto.alternativeInfo.precios.nPrecioSugerido > 0;

  return (
    <Transition show={isOpen}>
      <Dialog className="relative z-[200]" onClose={onCloseModal}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className=" fixed inset-0 bg-secondary_sokso bg-opacity-75 transition-opacity" />
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
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <CloseButton
                  onClick={onCloseModal}
                  right="right-5"
                  top="top-3"
                />
                <div className="w-full p-2">
                  <header className=" text-gray-900 text-center text-xl font-bold">
                    Comprar ahora
                  </header>
                  <p className="text-center text-sm text-secondary">
                    {producto.alternativeInfo.message}
                  </p>
                  <div className="mt-2 flex flex-col items-center">
                    <Image
                      src={
                        producto.imagenes?.[0]?.sNombreArchivo ||
                        "/images/imagen-no-disponible.jpg"
                      }
                      alt={producto.imagenes?.[0]?.sNombreArchivo || "Imagen no disponible"}
                      width={300}
                      height={300}
                      className="rounded-md shadow-md"
                    />
                    <div className="text-gray-700 my-4 text-lg font-bold">
                      {showOriginalPrice && (
                        <div className="flex items-center space-x-4">
                          <span className="text-base font-bold text-secondary2_sokso">
                            Precio regular:
                          </span>
                          <span className="text-lg font-bold text-secondary2_sokso line-through">
                            {priceFormat(
                              producto.alternativeInfo.precios.nPrecioSugerido
                            )}
                          </span>
                        </div>
                      )}

                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-lg font-bold text-secondary_sokso">
                          Precio <strong>OFERTA:</strong>
                        </span>
                        <span className="text-2xl font-bold text-primary_sokso">
                          {priceFormat(displayPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Link
                      prefetch={false}
                      className="hover:bg-primary_sokso_hover flex cursor-pointer items-center justify-center  space-x-3 rounded-md bg-primary_sokso px-3 py-2 text-white transition-colors duration-300 ease-in-out"
                      href={`/articulos/detalle/${producto.modelo.nIdModelo}/${producto.alternativeInfo.catalogoActivo.sCodigoCatalogo}/${producto.colorSeleccionado.nIdColor}`}
                    >
                      <span className=" font-bold uppercase">
                        Comprar ahora
                      </span>
                      <CursorClick
                        size={24}
                        className="ml-2 hidden animate-bounce text-white md:block"
                      />
                      <HandTap
                        size={24}
                        className="ml-2 block animate-bounce text-white md:hidden"
                      />
                    </Link>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalActivo;
