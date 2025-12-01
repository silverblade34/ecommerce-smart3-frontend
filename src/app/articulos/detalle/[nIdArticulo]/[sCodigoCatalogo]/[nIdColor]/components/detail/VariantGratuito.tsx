
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import { useSession } from "next-auth/react";
import OrderProduct from "./OrderProduct";
import SelectColor from "./SelectColor";
import SelectSize from "./SelectSize";
import useStockStore from "@/context/stock/stock-store";
import SkeletonSize from "@/components/common/skeleton/SkeletonSize";
import { Button, Divider } from "@heroui/react";
import { ArrowBendDoubleUpRight, ArrowSquareIn } from "@phosphor-icons/react";
import { handleClickExclusivePreview } from "@/analitycs/filters";
import { usePathname } from "next/navigation";

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
    isAuthenticated && session?.user?.rol?.sCodigo == "EST-TD-EC-01" || isAuthenticated && session?.user?.rol?.sCodigo == "EST-EC-01";
  


  const { stockTallas } = useStockStore();
  return (
    <>
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
              P. Regular : <span className="text-lg md:text-xl font-semibold">{priceFormat(product.precios.nPrecioSugerido)}</span>
            </div>
          )}
          {isAuthenticated && isColaborador && (
            <>

              <div className=" text-md text-gray-600 border-b-2 border-dashed border-gray-300 py-0.5">
                P. Regular : <span className="text-lg md:text-xl">{priceFormat(product.precios.nPrecioSugerido)}</span>
              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                P. Colaborador : <span className="text-lg md:text-xl font-semibold">{priceFormat(product.precios.nPrecioDirector)}</span>
              </div>
            </>
          )}

          {isAuthenticated && isEstrella && (
            <>

              <div className="text-md text-gray-600 border-b-2 border-dashed border-gray-300 px-5">
                P. Regular : <span className="text-lg md:text-xl">{priceFormat(product.precios.nPrecioSugerido)}</span>

              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                P. Estrella : <span className="text-lg md:text-xl font-semibold">{priceFormat(product.precios.nPrecioPromotor)}</span>
              </div>
            </>
          )}

          {isDirector && (
            <>
              <div className=" text-md  text-gray-600 border-b-2 border-dashed border-gray-300  px-5">

                P. Regular : <span className="text-lg md:text-xl">{priceFormat(product.precios.nPrecioSugerido)}</span>
              </div>
              <div className="text-md  text-gray-600 border-b-2 border-dashed border-gray-300  px-5">
                P. Estrella : <span className="text-lg md:text-xl">{priceFormat(product.precios.nPrecioPromotor)} </span>
              </div>
              <div className="text-md text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
                Precio Directora: <span className="text-lg md:text-xl font-semibold">{priceFormat(product.precios.nPrecioDirector)}</span>
              </div>
            </>
          )}

        </div>
        {/* {product?.catalogo?.sCodigoCatalogo == "PRECT2025CD10D" && (
          <div className="flex items-center gap-3 border border-gray-200 rounded-lg bg-primary_sokso text-white p-3 mt-4 shadow-md">
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
              />
            </svg>

           
            <p className="font-semibold text-sm md:text-base">
              Consulta <span className="underline">disponibilidad</span> con tu
              <span className="italic">Director@</span>
            </p>
          </div>
        )} */}
        <div className="flex justify-end mt-6">
          <Button
            as="a"
            href={product.catalogo.sCodigoCatalogo=="PRECAT2025CZ11" ?"https://sokso.aflip.in/e2c921c5e8.html#page/1" : "https://sokso.aflip.in/c82411ccec.html" }
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
        <section className="list-action mt-6">
          <OrderProduct product={product} tallaSeleccionada={tallaSeleccionada} sizes={stockTallas} />
        </section>
      </section>
      
      {/* Versión Web */}
      <div className="relative justify-center w-full max-w-3xl mx-auto aspect-video hidden md:flex">
        <iframe
          src= {product.catalogo.sCodigoCatalogo=="PRECAT2025CZ11" ?"https://www.youtube.com/embed/BZNEOP-HIgQ" : "https://www.youtube.com/embed/3CEI11xROn8" }
          title="YouTube Shorts"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
        />
      </div>

      {/* Versión Móvil */}
      <div className="flex justify-center w-full max-w-3xl mx-auto aspect-video md:hidden">

        <iframe
          width="400"
          height="500"
          src={product.catalogo.sCodigoCatalogo=="PRECAT2025CZ11" ?"https://www.youtube.com/embed/BZNEOP-HIgQ" : "https://www.youtube.com/embed/3CEI11xROn8"} 
          title="YouTube Shorts"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="rounded-lg shadow-lg"
        />
      </div>

    </>
  );
};

export default VariantProduct;
