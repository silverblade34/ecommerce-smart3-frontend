"use client";

import CloseButton from "@/components/common/buttons/CloseButton";
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import useCartStore from "@/context/cart/cart-store";
import useEstrellaStore from "@/context/orders/start-store";
import { ClientCartTable } from "@/lib/interfaces/clientes";
import { priceFormat } from "@/utils/priceFormat";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Button } from "@heroui/react";
import { ShoppingCartSimple, WhatsappLogo } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DirectoraCart from "./DirectoraCart";
import ItemCart from "./ItemCart";
import { useCreatePedido } from '@/hooks/useOrderClient';
import { PedidoData } from "@/lib/global";
import { useEstrellasCart } from "@/hooks/carrito/useEstrellasCart";
import useAuthStore from "@/context/user/auth-store";


const ModalCart = () => {
  const {
    isOpen,
    toggleCart,
    productsCart,
    removeProductCart,
    getTotalPrice,
    makeMessageWhatsapp,
    getTotalQuantity,
    clearCart,
  } = useCartStore();

  const {
    nIdDirectora,
    nombreCompletoCliente,
    setEstrellaSeleccionada,
    sTipo,
    idCliente,
  } = useEstrellaStore();

  const {
    estrellasCart,
    loadingCart,
  } = useEstrellasCart();

  const pathname = usePathname();
  const { profile } = useAuthStore();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isFanatica = !isAuthenticated
  const isDirector = isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01"
  const isColaborador = isAuthenticated && session?.user?.rol?.sCodigo === "COL-EC-01"
  const isEstrella =
    isAuthenticated && session?.user?.rol?.sCodigo == "EST-TD-EC-01" || isAuthenticated && session?.user?.rol?.sCodigo == "EST-EC-01";
  const [selectedStar, setSelectedStar] = useState<ClientCartTable | null>(null);
  const { push } = useRouter();





  const closeModalCart = () => {
    toggleCart();
    if (!pathname?.includes('/articulos')) {
      push('/articulos');
    }
  };

   const closeXModalCart = () => {
    toggleCart();
    // if (!pathname?.includes('/articulos')) {
    //   push('/articulos');
    // }
  };


  const removeFromCart = (id: number | string) => {
    removeProductCart(id);
    if (productsCart.length == 1) {
      setSelectedStar(null);
    }
  };

  const totalDisplayPrice =
isFanatica  ? getTotalPrice().totalSugerido :
    isColaborador ? getTotalPrice().totalDirector
      : isDirector && !selectedStar ? getTotalPrice().totalPromotor
        : isDirector && (selectedStar?.sNumeroDocumento === "CD" || selectedStar?.sTipo === "CL") ? getTotalPrice().totalDirector
          : getTotalPrice().totalPromotor;

  const nivelPrecioSuffix =  isColaborador ? "CL"
    : isDirector ? (!selectedStar || selectedStar?.sNumeroDocumento === "CD") ? "DR"
      : selectedStar?.sTipo === "CL" ? "CL"
        : "ES"
      : "ES";

  const totalPrecio =  isFanatica  ? "" :  isColaborador ? "Colaborador"
    : isDirector ?
      isDirector && !selectedStar ? "Estrella" :
        (selectedStar?.sNumeroDocumento === "CD") ? "Director"
          : selectedStar?.sTipo === "ES" ? "Estrella"
            : "Colaborador"
      : "Estrella";

  const { loading, handleEnviarPedido } = useCreatePedido();

  const buildPayload = (allowDuplicates = false): PedidoData => {
    const selectedOptionIsDirectora = selectedStar?.sNumeroDocumento == "CD";

    const promotoraIdPayload =
      isEstrella || isColaborador
        ? { sPromotoraId: idCliente || 0 }
        : isDirector || !selectedOptionIsDirectora
          ? { sPromotoraId: selectedStar?.nIdCliente || 0 }
          : {};
    return {
      clienteId: nIdDirectora || 0,
      sUsuarioCreacionId: nombreCompletoCliente || "",
      permitirDuplicados: allowDuplicates,
      paraEstrella: isDirector || false,
      detalles: productsCart.map((product) => ({
        item: 212,
        sDescripcionProducto: product.name,
        nCantidad: product.quantity,
        sNivelPrecio: `${product.sNivelPrecioId}${nivelPrecioSuffix}`,
        sSkuHijo: product.sSkuHijo,
        ...promotoraIdPayload,
        sDepartamentoId: "DEP001",
        sTipoOperacionId: product.sTipoCatalogo,
        sUbicacionId: "LOC001",
        sUsuarioPedido: sTipo || "",

      })),
    };
  };

  const handleStarSelection = (star: ClientCartTable | null) => {
    setSelectedStar(star);
    if (star) {
      setEstrellaSeleccionada(
        star.nIdCliente,
        `${star.sNombre} ${star.sApellidos}`
      );
    } else {
      setEstrellaSeleccionada(null, null);
    }
  };

  const sendOrder = () => {
    const message = makeMessageWhatsapp(pathname);
    if (message === "" || message === undefined) return;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message || "")}`,
      "_blank"
    );
    clearCart();
  };

  const handleSubmitOrder = async () => {
    if (!productsCart.length) {

      toast.warning('El carrito está vacío');
      return;
    }
    const payload = buildPayload();
    await handleEnviarPedido(payload, true);
  };

  return (
    <>
      <Transition show={isOpen}>
        <Dialog className="relative z-[200]" onClose={toggleCart}>
          <TransitionChild
            enter="ease-in-out duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-75"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-secondary_sokso bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full ">
                <TransitionChild
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <DialogPanel className="pointer-events-auto m-5 w-screen max-w-[548px] overflow-hidden ">
                    <div className="flex h-full flex-col overflow-y-scroll rounded-3xl bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto ">
                        <header className="sticky top-0 flex items-center justify-between bg-white p-6 z-50">
                          <h2 className="heading5">Carrito de compras</h2>
                          <CloseButton
                            onClick={closeXModalCart}
                            right="right-3"
                            top="top-5"
                          />
                        </header>
                        <div className="mt-8  px-4 md:px-6">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="divide-gray-200  -my-6 divide-y"
                            >
                              {productsCart.length > 0 ? (
                                <>
{isAuthenticated &&
  localStorage.getItem("banner_sBono") &&
  localStorage.getItem("banner_sMeta") && (
    <div
      style={{
        background: "linear-gradient(90deg, #ff1493 0%, #ff69b4 100%)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "8px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        textAlign: "center",
      }}
    >
      <span style={{ fontSize: "15px" }}>
        <b>{profile?.cliente?.infoCliente?.sNombre}</b>, recuerda: si compras más
        de S/{localStorage.getItem("banner_sMeta")}, obtendrás tu bono de{" "}
        <b>S/{localStorage.getItem("banner_sBono")}</b>.
      </span>
    </div>
)}
                                  {!isAuthenticated && (
                                    <p className="animate-bounce rounded-xl bg-primary_sokso/25 py-2 text-center text-sm font-bold text-secondary_sokso">
                                      ¡Envía tu pedido ahora y asegura tu compra!
                                    </p>
                                  )}
                                  {isAuthenticated ? (
                                    isDirector ? (
                                      <><div className="w-full px-4 md:px-6 mb-4 my-2">
                                        <DirectoraCart
                                          selectedStar={selectedStar}
                                          onStarSelected={handleStarSelection}
                                          estrellas={estrellasCart}
                                          loading={loadingCart} />
                                      </div>
                                     </>


                                    ) : null
                                  ) : null}
                                  {productsCart.map((product) => (
                                    <ItemCart
                                      key={product.id}
                                      item={product}
                                      removeFromCart={removeFromCart}
                                      selectedStar={selectedStar}
                                    />
                                  ))}
                                </>
                              ) : (
                                <div className="mt-5 flex flex-col items-center justify-center text-center text-secondary_sokso">
                                  <ShoppingCartSimple size={50} weight="thin" />
                                  <span>No hay productos en el carrito</span>
                                </div>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <footer className=" footer-modal">

                        <div className="flex items-center justify-between px-4 pt-6 md:px-6">
                          <span className="heading6">Cantidad</span>
                          <span className="heading6">{getTotalQuantity()}</span>
                        </div>
                        <div className="flex items-center justify-between px-4 pt-6 md:px-6">
                          <span className="heading6">Total {totalPrecio}</span>
                          <div>

                            <span className="heading6">
                              {priceFormat(totalDisplayPrice)}
                            </span>
                          </div>
                        </div>

                        <div className="block-button p-4 text-center md:p-6">
                          <div className="grid grid-cols-2 gap-2 gap-y-2">
                            <Button
                              onPress={closeModalCart}
                              className="border border-black bg-white text-black  rounded-md"
                            >
                              SEGUIR COMPRANDO
                            </Button>

                            {isAuthenticated ? (
                              isDirector ? (
                                <Button
                                  onPress={() => handleSubmitOrder()}
                                  isDisabled={
                                    getTotalQuantity() === 0 || !selectedStar
                                  }
                                  className="w-full bg-primary_sokso text-white  rounded-md"
                                  id="send-order-cart"
                                  color="primary"
                                  isLoading={loading}
                                >
                                  ENVIAR PEDIDO
                                </Button>
                              ) : (
                                <Button
                                  onPress={() => handleSubmitOrder()}
                                  isDisabled={getTotalQuantity() === 0}
                                  className="w-full bg-primary_sokso  text-white rounded-md"
                                  id="send-order-cart"
                                  color="primary"
                                  isLoading={loading}
                                >
                                  ENVIAR PEDIDO
                                </Button>
                              )
                            ) : (
                              <PrimaryButton
                                onClick={sendOrder}
                                type="button"
                                title="Enviar pedido"
                                disabled={getTotalQuantity() === 0}
                                icon={WhatsappLogo}
                                size={17}
                                id="send-order-cart"
                              />
                            )}
                          </div>
                        </div>
                      </footer>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalCart;
