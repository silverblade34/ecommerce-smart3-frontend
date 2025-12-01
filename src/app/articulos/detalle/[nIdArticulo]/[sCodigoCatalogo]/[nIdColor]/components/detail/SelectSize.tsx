import { Talla } from "@/lib/interfaces/articulo";
import { sizeOrder } from "@/utils/sizeOrder";
import clsx from "clsx";
import { useContext } from "react";
import { GuideSizeContext } from "../guide-size/hooks/guide-size.context";
// import { useEffect } from "react";

type Props = {
  sizes: Talla[] | null;
  selectedSize: number;
  setSize: (talla: number) => void;
  authenticated: boolean
};

const SelectSize = ({ selectedSize, setSize, sizes, authenticated }: Props) => {
  const { selectSize } = useContext(GuideSizeContext)




  if (!sizes) {
    return null
  }
  const ajustarTallas = (sizes: Talla[], isAuthenticated: boolean): Talla[] => {
    return sizes.map((size) => {
      if (!isAuthenticated && size.statusStock === "FUTURO") {
        return { ...size, disponible: true, nStockDisponible: size.nStockDisponible };
      }
      return size;
    });
  };

  const adjustedSizes = ajustarTallas(sizes, authenticated);

  const ordered = sizeOrder(adjustedSizes.map((s) => ({
    sTalla: s.sTalla,
    nStockDisponible: s.nStockDisponible,
  })));

  const orderedSizes = ordered
    .map((o) => adjustedSizes.find((s) => s.sTalla === o.sTalla))
    .filter((x): x is Talla => !!x);

  return (
    <section className="choose-size mt-5">
      <div className="heading flex items-center justify-between">
        <h2 className="text-title">
          Elige tu talla:{" "}
        </h2>
      </div>
      <div className="list-size mt-3 flex flex-wrap items-center gap-2">
        {sizes &&
          orderedSizes.map((item, index) => (
            <button
              className={clsx(
                item.sTalla === "freesize" ? "px-3 py-2" : "h-12 w-12",
                "text-button flex items-center justify-center rounded-full border border-line bg-white",
                selectedSize === item.nIdTalla ? "active" : "",
               item.nStockDisponible <= 0
                  ? "size-out-of-stock cursor-not-allowed bg-secondary text-secondary "
                  : "size-item"
              )}
              key={index}
              role="button"
              type="button"
              aria-label={`Select size ${item.sTalla}`}
              aria-pressed={selectedSize === item.nIdTalla}
              onClick={() => {
                  item.nStockDisponible !== 0 && selectSize(item.sTalla)
                  item.nStockDisponible !== 0 && setSize(item.nIdTalla)
                }
              }
            >
              {item.sTalla}
            </button>
          ))}
      </div>
    </section>
  );
};
export default SelectSize;
