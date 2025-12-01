import { DetalleProducto } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import { useSession } from "next-auth/react";
import OrderProduct from "./OrderProduct";
import SelectColor from "./SelectColor";
import SelectSize from "./SelectSize";
import useStockStore from "@/context/stock/stock-store";
import SkeletonSize from "@/components/common/skeleton/SkeletonSize";
import { Button } from "@heroui/react";
import { ArrowSquareIn } from "@phosphor-icons/react";
import { handleClickExclusivePreview } from "@/analitycs/filters";
import { GuideSizeProvider } from "../guide-size/hooks/guide-size-provider";
import { ActionGuideSize } from "../guide-size/components/ActionGuideSize";
import { SectionMessages } from "../guide-size/components/SectionMessages";

type Props = {
  product: DetalleProducto;
  tallaSeleccionada: number | null;
  setTallaSeleccionada: (talla: number) => void;
};

const VariantProduct = ({
  product,
  tallaSeleccionada,
  setTallaSeleccionada,
}: Props) => {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isDirector =
    isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01";

  const isColaborador =
    isAuthenticated && session?.user?.rol?.sCodigo === "COL-EC-01";

  const isEstrella =
    (isAuthenticated && session?.user?.rol?.sCodigo == "EST-TD-EC-01") ||
    (isAuthenticated && session?.user?.rol?.sCodigo == "EST-EC-01");

  const { stockTallas } = useStockStore();
  // SKGUIA_00001
  return (
    <GuideSizeProvider codeGuideSize={product.guiaTalla || "NA"} product={product}>
      <section className="product-info w-full md:w-2/5 md:pl-2 lg:pl-[15px]">
        <header className="flex justify-between">
          <div>
            <p className="caption2 font-semibold uppercase text-secondary">
              {product.categoria.sDescripcion} / {product.marca.sNombreMarca}
            </p>
            <h1 className="heading4 mt-1">{product.sDescripcion}</h1>
          </div>
        </header>

        <div className="mt-5 relative z-[1]  flex flex-col items-start gap-1 duration-300">
          {!isAuthenticated && (
            <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
              P. Regular :{" "}
              <span className="text-lg md:text-xl font-semibold">
                {priceFormat(product.precios.nPrecioSugerido)}
              </span>
            </div>
          )}
          {isAuthenticated && isColaborador && (
            <>
              <div className=" text-md text-gray-600 border-b-2 border-dashed border-gray-300 py-0.5">
                P. Regular :{" "}
                <span className="text-lg md:text-xl">
                  {priceFormat(product.precios.nPrecioSugerido)}
                </span>
              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                P. Colaborador :{" "}
                <span className="text-lg md:text-xl font-semibold">
                  {priceFormat(product.precios.nPrecioDirector)}
                </span>
              </div>
            </>
          )}

          {isAuthenticated && isEstrella && (
            <>
              <div className="text-md text-gray-600 border-b-2 border-dashed border-gray-300 px-5">
                P. Regular :{" "}
                <span className="text-lg md:text-xl">
                  {priceFormat(product.precios.nPrecioSugerido)}
                </span>
              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                P. Estrella :{" "}
                <span className="text-lg md:text-xl font-semibold">
                  {priceFormat(product.precios.nPrecioPromotor)}
                </span>
              </div>
            </>
          )}

          {isDirector && (
            <>
              <div className=" text-md  text-gray-600 border-b-2 border-dashed border-gray-300  px-5">
                P. Regular :{" "}
                <span className="text-lg md:text-xl">
                  {priceFormat(product.precios.nPrecioSugerido)}
                </span>
              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                P. Estrella :{" "}
                <span className="text-lg md:text-xl font-semibold">
                  {priceFormat(product.precios.nPrecioPromotor)}{" "}
                </span>
              </div>
            </>
          )}
        </div>

        {/* SOLO PARA PREVENTA CATALOGO */}
        {product?.catalogo?.sTipoCatalogo?.toUpperCase() ==
          "PREVENTA CATALOGO" && (
          <>
         {/*  <div className="my-4 bg-primary_sokso p-4 text-white rounded-md shadow-2xl">
              <p>Consultar disponibilidad con tu Director@</p>
            </div> */}

            <div className="flex justify-end mt-6">
              <Button
                as="a"
                href="https://sokso.aflip.in/c902146bdd.html"
                target="_blank"
                rel="noopener noreferrer"
                id="btn-ver-adelanto-exclusivo"
                onPress={handleClickExclusivePreview}
                className="bg-[#717FFF] text-white shadow-lg animate-bounce"
              >
                <ArrowSquareIn size={20} color="#ffffff" weight="fill" />
                Ver Adelanto Exclusivo
              </Button>
            </div>
          </>
        )}

        <section className="list-action mt-6">
          <SelectColor
            catalogo={product.catalogo.sTipoCatalogo}
            colors={product.coloresDisponibles}
            selectedColor={product.colorSeleccionado}
          />

          <ActionGuideSize />

          {stockTallas === null ? (
            <SkeletonSize />
          ) : (
            tallaSeleccionada && (
              <SelectSize
                sizes={stockTallas}
                selectedSize={tallaSeleccionada}
                setSize={setTallaSeleccionada}
                authenticated={isAuthenticated}
              />
            )
          )}
          <SectionMessages stockTallas={stockTallas} product={product} />
          <OrderProduct
            product={product}
            tallaSeleccionada={tallaSeleccionada}
            sizes={stockTallas}
          />
        </section>
      </section>

      {/* SOLO PARA PREVENTA CATALOGO */}
      {product?.catalogo?.sTipoCatalogo?.toUpperCase() ==
        "PREVENTA CATALOGO" && (
        <>
          {/* Version web */}
          <div className="relative justify-center w-full max-w-3xl mx-auto aspect-video hidden md:flex">
            <iframe
              src="https://www.youtube.com/embed/7NpujwhlKwM "
              title="YouTube Shorts"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            />
          </div>

          {/* Version Movil */}
          <div className="flex justify-center w-full max-w-3xl mx-auto aspect-video md:hidden">
            <iframe
              width="400"
              height="500"
              src="https://www.youtube.com/embed/7NpujwhlKwM "
              title="YouTube Shorts"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="rounded-lg shadow-lg"
            />
          </div>
        </>
      )}
    </GuideSizeProvider>
  );
};

export default VariantProduct;
