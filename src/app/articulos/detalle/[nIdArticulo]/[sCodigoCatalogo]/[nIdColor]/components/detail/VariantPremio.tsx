
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { priceFormat } from "@/utils/priceFormat";
import { useSession } from "next-auth/react";
import OrderProduct from "./OrderProduct";
import SelectColor from "./SelectColor";
import SelectSize from "./SelectSize";
import useStockStore from "@/context/stock/stock-store";
import SkeletonSize from "@/components/common/skeleton/SkeletonSize";
import { Button, Divider } from "@heroui/react";
import { ArrowBendDoubleUpRight, ArrowSquareIn, Link } from "@phosphor-icons/react";
import { handleClickExclusivePreview } from "@/analitycs/filters";

type Props = {
  product: DetalleProducto;
  tallaSeleccionada: number | null;
  setTallaSeleccionada: (talla: number) => void;
};


const VariantPremio = ({
  product,
  tallaSeleccionada,
  setTallaSeleccionada,
}: Props) => {

  const catalogoLinks: Record<string, string> = {
    "CATCLUBZAPT10I": "https://sokso.aflip.in/6e7fec8a66.html",
    "CATCLUBZAPT10A": "https://sokso.aflip.in/6e7fec8a66.html",
    "CATCABALLKID7A": "https://sokso.aflip.in/f9c54fadab.html",
    "CATCABALLKID7I": "https://sokso.aflip.in/f9c54fadab.html",
  };

  const defaultUrl = "https://sokso.aflip.in/62377d92e4.html";

  return (
    <>
      <section className="product-info w-full md:w-2/5 md:pl-2 lg:pl-[15px]">
        <header className="flex justify-between">
          <div>
            <h1 className="heading4 mt-1">{product.sDescripcion}</h1>
          </div>
        </header>


        <div className="flex justify-center items-center mt-6">
          <Button
            as="a"
            href={catalogoLinks[product?.catalogo?.sCodigoCatalogo] ?? defaultUrl}
            target="_blank"
            rel="noopener noreferrer"
            id="btn-ver-adelanto-exclusivo"
            onPress={handleClickExclusivePreview}
            className="bg-[#717FFF] text-white shadow-lg animate-bounce"
           
          >
            <ArrowSquareIn size={20} color="#ffffff" weight="fill" />
             Ver Catálogo Completo
          </Button>
        </div>

      </section>

    </>
  );
};

export default VariantPremio;
