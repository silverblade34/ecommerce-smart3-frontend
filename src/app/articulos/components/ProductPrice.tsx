import { Precios } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import { useSession } from "next-auth/react";

type Props = {
  precios: Precios;
  tipo?: string;
};

const ProductPrice = ({ precios, tipo }: Props) => {

  const { data: session, status } = useSession();

  const isAuthenticated = status === "authenticated";
  const isDirector =
    isAuthenticated && session?.user?.rol?.sCodigo === "DIR-EC-01";
  const isColaborador =
    isAuthenticated && session?.user?.rol?.sCodigo === "COL-EC-01";
  const isEstrella =
    isAuthenticated &&
    (session?.user?.rol?.sCodigo === "EST-TD-EC-01" ||
      session?.user?.rol?.sCodigo === "EST-EC-01");

  return (
    <div className="relative z-[1] mt-1 flex flex-col items-start gap-1 duration-300">
      {!isAuthenticated && (
        <div className="text-xs text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
          P. Regular :{" "}
          <span className="text-lg md:text-xl font-semibold ">
            {priceFormat(precios.nPrecioSugerido)}
          </span>
        </div>
      )}

      {isAuthenticated && isColaborador && (
        <>
          <div className="text-xs text-gray-500 border-b-2 border-dashed border-gray-300 px-2">
            P. Regular:{" "}
            <span className="text-lg  font-semibold ">
              {priceFormat(precios.nPrecioSugerido)}
            </span>
          </div>
          <div className="text-xs text-white bg-primary_sokso rounded-lg px-5 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
            P. Colaborador:{" "}
            <span className="text-lg md:text-xl font-semibold">
              {priceFormat(precios.nPrecioDirector)}
            </span>
          </div>
        </>
      )}

      {isAuthenticated && isEstrella && (
        <>
          <div className="text-xs text-gray-500  border-b-2 border-dashed border-gray-300 px-2">
            P. Regular:{" "}
            <span className="text-lg  font-semibold">
              {priceFormat(precios.nPrecioSugerido)}
            </span>
          </div>
          <div className="text-xs text-white bg-primary_sokso rounded-lg px-2 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
            P. Estrella:{" "}
            <span className="text-lg  font-semibold">
              {priceFormat(precios.nPrecioPromotor)}
            </span>
          </div>
        </>
      )}

      {isDirector && (
        <>
          <div className="text-xs text-gray-500 border-b-2 border-dashed border-gray-300 px-2">
            P. Regular:{" "}
            <span className="text-lg  font-semibold">
              {priceFormat(precios.nPrecioSugerido)}
            </span>
          </div>
          <div className="text-xs text-gray-500 border-b-2 border-dashed border-gray-300 px-2">
            {tipo?.toUpperCase() == "SHOWROOM" ? 'P. Directora' : 'P. Estrella:'}: {" "}
            <span className="text-lg  font-semibold">
              {priceFormat(precios.nPrecioPromotor)}
            </span>
          </div>
          <div className="text-xs text-white bg-primary_sokso rounded-lg px-2 py-0.5 shadow-[0_4px_15px_rgba(128,0,255,0.4)]">
            {tipo?.toUpperCase() == "SHOWROOM" ? 'P. Showroom' : 'P. P. Directora:'}: {" "}
            <span className="text-lg  font-semibold">
              {priceFormat(precios.nPrecioDirector)}
            </span>
          </div>
        </>
      )}


    </div>
  );
};

export default ProductPrice;
