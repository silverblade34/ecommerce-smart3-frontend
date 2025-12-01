import { Producto } from "@/lib/interfaces/articulo";
import Image from "next/image";
import Link from "next/link";
import ProductPrice from "./ProductPrice";
import clsx from "clsx";
import CatalogoBadge from "@/components/common/etiquetas/CatalogoBadge";

type Props = {
  product: Producto;
};

const ProductCard = ({ product }: Props) => {
  const {
    sDescripcion,
    nIdColor,
    precios,
    imagenPrincipal,
    sCodigoCatalogo,
    nIdModelo,
    sTipoCatalogo,
    enStock,
    stock
  } = product;

  return (
    <>

        
      <Link
        prefetch={false}
        href={`/articulos/detalle/${nIdModelo}/${sCodigoCatalogo}/${nIdColor}`}
        className="product-item grid-type overflow-hidden rounded-2xl border border-line"
      >
        <div className="product-main block cursor-pointer">
          <div className="product-thumb relative overflow-hidden rounded-2xl bg-white">


            <CatalogoBadge
              tipo={sTipoCatalogo}
              codigo={sCodigoCatalogo}
              position="absolute right-3 top-3"
            />

            {/* Etiquetas según stock */}
            {stock?.cantidad <= 20 && stock?.cantidad > 0 && (
              <div className="absolute bottom-3 right-3 z-10 rounded-full bg-gradient-to-r from-yellow to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse">
                STOCK LIMITADO
              </div>
            )}

            {stock?.cantidad === 0 && (
              <div className="absolute bottom-3 right-3 z-10 rounded-full bg-gradient-to-r from-red to-red px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse scale-105">
                STOCK AGOTADO
              </div>
            )}
            <div className="product-img h-full w-full">
              <Image
                src={
                  imagenPrincipal.sNombreArchivo ||
                  "/images/imagen-no-disponible.jpg"
                }
                width={500}
                height={500}
                alt={sDescripcion}
                priority={true}
                className="h-full w-full object-cover duration-700"
              />
            </div>
          </div>
          <div className="product-infor mt-4 p-2 lg:mb-7">
            <div className="text-title duration-300 font-semibold text-gray-800">{sDescripcion}</div>
            {sTipoCatalogo?.toUpperCase() != "PREMIOS" && (
              <ProductPrice precios={precios}  tipo={sTipoCatalogo}/>
            )}
          </div>
        </div>
      </Link>
    </>
  );
};

export default ProductCard;
