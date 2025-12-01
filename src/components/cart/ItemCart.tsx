import { priceFormat } from "@/utils/priceFormat";
import { Minus, Plus } from "@phosphor-icons/react";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import clsx from "clsx";
import Image from "next/image";
import QuantityButton from "../common/buttons/QuantityButton";
import { ProductSelected } from "@/app/types/product.types";
import useCartStore from "@/context/cart/cart-store";
import { useSession } from "next-auth/react";
import { ClientCartTable } from "@/lib/interfaces/clientes";
import CatalogoBadge from "../common/etiquetas/CatalogoBadge";

type Props = {
  item: ProductSelected;
  removeFromCart: (id: number | string) => void;
  selectedStar?: ClientCartTable | null;

};

const ItemCart = ({
  item: {
    brand,
    id,
    image,
    name,
    maxQuantity,
    prices,
    quantity,
    color,
    sizeName,
    sTipoCatalogo,
    agotado,
    stockDisponible,
    articuloNoVigente
  },
  removeFromCart,
  selectedStar
}: Props) => {
  console.log("item", stockDisponible)
  const { addOneProductCart, removeOneProductCart } = useCartStore();
  const isDecreaseDisabled = quantity <= 1;
  const isIncreaseDisabled = quantity >= maxQuantity;

  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  const rol = session?.user?.rol?.sCodigo;

  const isDirector = isAuthenticated && rol === "DIR-EC-01";
  const isColaborador = isAuthenticated && rol === "COL-EC-01";
  const isFanatica = !isAuthenticated;

  const isGRATUITO = sTipoCatalogo?.toUpperCase() == "GRATIS"


  const displayPrice =
    isColaborador ? prices.nPrecioDirector
      : isDirector && !selectedStar ? prices.nPrecioPromotor
        : isDirector && (selectedStar?.sNumeroDocumento === "CD" || selectedStar?.sTipo === "CL") ? prices.nPrecioDirector
          : isFanatica ? prices.nPrecioSugerido
            : prices.nPrecioPromotor;


  return (
    <article
      key={id}
      className="item flex items-center justify-between gap-3 border-b border-line py-5"
    >
      <figure className="flex space-x-3">
        <div className="product-main block cursor-pointer">
          <div className="product-thumb relative overflow-hidden rounded-2xl bg-white">
            {/* {(sTipoCatalogo.toUpperCase() == "CYBER" || sTipoCatalogo.toUpperCase() == "PREVENTA") && (
              <div className={clsx("absolute left-2 top-1 z-10 h-5 w-5 rounded-full text-white flex items-center justify-center",
                sTipoCatalogo.toUpperCase() == "CYBER" ? "bg-pink " : "bg-cyan ")}>
                <p className="text-xs">{sTipoCatalogo.toUpperCase() == "PREVENTA" ? "P" : "C"}</p> 

              </div>
            )} */}

            <CatalogoBadge
              tipo={sTipoCatalogo}
              variant="circle"
              position="absolute left-2 top-1"
            />

            <div className="product-img h-full w-full">
              <Image
                src={image}
                width={90}
                height={90}
                alt={name}
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <figcaption className="flex flex-col justify-around">
          <div className="flex flex-col">
            <span className="text-xs capitalize text-secondary">{brand}</span>
            <span className="text-sm name text-button">{name}</span>
          </div>
          {sTipoCatalogo.toUpperCase() != "PREVENTA" && (
            <div className="flex flex-col items-start text-xs capitalize text-secondary2">
              <div>
                <span className="text-xs capitalize text-secondary2">
                  Color:{" "}
                </span>
                <span className="text-xs capitalize text-secondary">
                  {color.toLowerCase()}
                </span>
              </div>
              <div>
                <span className="text-xs capitalize text-secondary2">
                  Talla:{" "}
                </span>
                <span className="text-xs capitalize text-secondary">
                  {sizeName}
                </span>
              </div>
            </div>
          )}


        
            <div>
            {agotado && articuloNoVigente ? (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold text-white bg-gray-500 rounded">
                Artículo no vigente
              </span>
            ) : agotado && stockDisponible === 0 ? (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold text-white bg-red rounded">
                Stock Agotado
              </span>
            ) : stockDisponible && stockDisponible > 0 ? (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold text-white bg-[#EB5802] rounded">
                Stock disponible: {stockDisponible}
              </span>
            ) : null}
          </div>
        </figcaption>
      </figure>
      <div className="flex flex-col items-end justify-around">
        <button
          className="caption1 cursor-pointer rounded-full bg-red/10 p-1 font-semibold text-[#E85805] hover:bg-red/20"
          onClick={() => removeFromCart(id)}
        >
          <Trash size={16} />
        </button>
        <div className="flex flex-col items-center space-y-2">
        
          <span className="product-price text-title text-lg">
            {priceFormat(displayPrice * quantity)}
          </span>

          <div className="flex w-[90px] flex-shrink-0 items-center justify-between rounded-lg border border-line p-0.5 px-3">
            <QuantityButton
              onClick={() => removeOneProductCart(id)}
              disabled={isDecreaseDisabled || isGRATUITO}
              icon={Minus}
              size={17}
            />
            <span
              className={clsx(
                "font-semibold",
                quantity === 0 ? "disabled" : ""
              )}
            >
              {quantity}
            </span>
            <QuantityButton
              onClick={() => addOneProductCart(id)}
              icon={Plus}
              size={17}
              disabled={isIncreaseDisabled || isGRATUITO}
            />
          </div>
        </div>
      </div>

    </article >
  );
};

export default ItemCart;