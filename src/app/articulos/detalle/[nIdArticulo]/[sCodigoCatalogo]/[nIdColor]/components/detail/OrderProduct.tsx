
import PrimaryButton from "@/components/common/buttons/PrimaryButton";
import QuantityButton from "@/components/common/buttons/QuantityButton";
import useCartStore from "@/context/cart/cart-store";
import { useOrderProduct } from "@/hooks/useOrderProduct";
import { DetalleProducto, Talla } from "@/lib/interfaces/articulo";
import { LIMIT_PRODUCT_CART as LPC } from "@/utils/const";
import { Minus, Plus, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import useStockStore from "@/context/stock/stock-store";
import { Button } from "@heroui/react";
import { ClockClockwise, Timer } from "@phosphor-icons/react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

type Props = {
  product: DetalleProducto;
  tallaSeleccionada: number | null;
  sizes: Talla[] | null;
};

const OrderProduct = ({ product, tallaSeleccionada, sizes }: Props) => {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const {
    quantity,
    handleIncreaseQuantity,
    handleDecreaseQuantity,
    handleAddToCart,
    makeMessageWhatsapp,
    handleAddToOrder,
    clearCart,
    tallaVariant: originalTallaVariant,
  } = useOrderProduct(product, tallaSeleccionada);


  const { toggleCart } = useCartStore();
  const { stockTallas } = useStockStore();

  const disponible = new Date(product.catalogo.dFechaHoraInicio).setHours(0, 0, 0, 0) <= new Date().setHours(0, 0, 0, 0);

  const tallaVariant2 = stockTallas?.find(
    (talla) => talla.nIdTalla === tallaSeleccionada
  );

  const tallaVariant = tallaVariant2 ?? tallaVariant2;

  const showContent = !!tallaVariant;

  const isDecreaseDisabled = quantity <= 1;
  const isIncreaseDisabled =
    !tallaVariant ||
    quantity === 0 ||
    quantity >= (tallaVariant?.nStockDisponible || 0) ||
    quantity >= LPC;

  const sendOrder = () => {
    handleAddToOrder();
    const message = makeMessageWhatsapp(pathname);
    if (message === "" || message === undefined) return;
    window.open(
      'https://api.whatsapp.com/send?text=${encodeURIComponent(message || "")}',
      "_blank"
    );
    clearCart();
  };

  const isGRATUITO = product?.catalogo?.sTipoCatalogo?.toUpperCase() == "GRATIS"

  const stockDisponiblePreventa = stockTallas?.reduce((acc, talla) => {
    if (talla.sTipoCatalogo == "PREVENTA") {
      return acc + (talla.nStockDisponible || 0);
    }
    return acc;
  }, 0) ?? 0;

  const stockConfirmadoPreventa = stockTallas?.reduce((acc, talla) => {
    if (talla.sTipoCatalogo == "PREVENTA") {
      return acc + (talla.nStockConfirmado || 0);
    }
    return acc;
  }, 0) ?? 0;


  return (
    <>
      {!showContent ? null : (
        <section>
          {product?.catalogo?.sStatusCatalogo == "INACTIVO" || product?.catalogo?.sStatusCatalogo == "FUTURO"  ?
            <div> 

            </div>
            :

            disponible && (
              <div className="text-title mt-5 flex flex-col justify-start">
                {tallaVariant.nStockDisponible <= 10 &&
                  tallaVariant.nStockDisponible > 0 && (
                    <p className="my-0.5 flex items-start justify-start space-x-2">
                      <span className="text-xs font-semibold text-black">
                        Stock en Línea:
                      </span>
                      <span className="text-xs text-red">
                        {tallaVariant.nStockDisponible === 1
                          ? "última unidad disponible"
                          : `Quedan ${tallaVariant.nStockDisponible} unidades`}
                      </span>
                    </p>
                  )}

                {tallaVariant.nStockDisponible > 10 && (
                  <p className="my-0.5 flex items-start justify-start space-x-2">
                    <span className="text-xs text-black">Stock en Línea:</span>
                    <span className="text-xs text-success">más de 10 unidades</span>
                  </p>
                )}

                {tallaVariant.nStockDisponible < 1 && (
                  <p className="p-0.5 text-xs text-red">Producto Agotado</p>
                )}


              </div>
            )}

          <div className="text-title mt-5 flex flex-col justify-start">
            <span className="mt-5">Cantidad:</span>
          </div>

          <div className="choose-quantity mt-3 flex items-center gap-5 gap-y-3 lg:justify-between">
            <div className="quantity-block flex w-[120px]  flex-shrink-0 items-center justify-between rounded-lg border border-line max-md:px-3 max-md:py-1.5 sm:w-[180px] md:p-3">
              <QuantityButton
                onClick={handleDecreaseQuantity}
                disabled={isDecreaseDisabled || isGRATUITO}
                icon={Minus}
                size={20}
              />
              <span
                className={clsx(
                  "body1 font-semibold",
                  quantity === 0 ? "disabled" : ""
                )}
              >
                {quantity}
              </span>
              <QuantityButton
                onClick={handleIncreaseQuantity}
                disabled={isIncreaseDisabled || isGRATUITO}
                icon={Plus}
                size={20}
              />
            </div>

            {
              //INACTIVOS
              product?.catalogo?.sStatusCatalogo == "FUTURO" ?
                (<Button
                  disabled
                  className="w-full h-auto py-1 bg-gray-200 text-gray-600 border border-gray-400 rounded-lg cursor-not-allowed hover:opacity-90 transition text-center flex flex-col items-center "
                >
                  <span className="flex text-sm"><ClockClockwise size={24} weight="bold" className="mr-2" />
                    Disponible a partir del  <br></br>
                    {new Intl.DateTimeFormat("es-PE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                      timeZone: "UTC",
                    }).format(new Date(product.catalogo.dFechaHoraInicio))}
                  </span>
                </Button>) :
                product?.catalogo?.sStatusCatalogo == "INACTIVO" ?
                  <Button
                    disabled
                    className="w-full h-auto py-1 bg-gray-200 text-gray-600 border border-gray-400 rounded-lg cursor-not-allowed hover:opacity-90 transition text-center flex flex-col items-center "
                  >
                    <span className="flex text-sm py-2"><ClockClockwise size={24} weight="bold" className="mr-2" />
                      Artículo no vigente <br></br>
                    </span>
                  </Button>
                  :
                  !isAuthenticated || (isAuthenticated && disponible) ? (
                    <PrimaryButton
                      disabled={quantity === 0}
                      aria-label="Añadir al carrito"
                      type="button"
                      title=" Añadir al carrito"
                      onClick={handleAddToCart}
                      color="border border-black bg-white text-black"
                    />
                  ) : (

                    //FUTUROS
                    <div>

                    </div>
                  )}

          </div>

          <div className="button-block mt-5">
            {isAuthenticated ? (
              <PrimaryButton
                disabled={quantity === 0}
                type="button"
                title="Ver carrito"
                id="send-order"
                size={30}
                onClick={toggleCart}
              />

            ) : (
              <PrimaryButton
                disabled={quantity === 0}
                type="button"
                title="Enviar pedido"
                id="send-order"
                icon={WhatsappLogo}
                size={30}
                onClick={sendOrder}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
};
export default OrderProduct