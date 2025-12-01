import clsx from "clsx";
import React from "react";
import Image from "next/image";
import { ColorDisponible, ColorSeleccionado } from "@/lib/interfaces/articulo";
import Link from "next/link";

type Props = {
  catalogo: string
  colors: ColorDisponible[];
  selectedColor: ColorSeleccionado;
};

const SelectColor = ({ colors, selectedColor }: Props) => {
  return (
    <section className="choose-color">
      <h2 className="text-title">
        Color :{" "}
        <span className="text-title color">
          {selectedColor.sDenominacion}
        </span>
      </h2>
      <div className="list-color mt-3 flex flex-wrap items-center gap-2 ">
        {colors.map((item, index) => (
          <Link
            prefetch={false}
            className={clsx(
              "color-item relative h-12 w-12 rounded-xl duration-300",
              selectedColor.nIdColor === item.nIdColor ? "active" : ""
            )}
            key={index}
            aria-label={`Select color ${item.sColorEcommerce}`}
            aria-pressed={selectedColor.nIdColor === item.nIdColor}
            href={`/articulos/detalle/${item.nIdModelo}/${item.sCodigoCatalogo}/${item.nIdColor}`}
          >
            <figure>
              <div >
                {/*className="product-thumb relative overflow-hidden rounded-2xl bg-white" {(catalogo == "CYBER" || catalogo == "PREVENTA") && (
                  <div className={clsx("absolute left-1 top-1 z-10 h-3 w-3 rounded-full text-white flex items-center justify-center",
                    catalogo == "CYBER" ? "bg-pink " : "bg-cyan ")}>
                    <p className="text-xs items-center ">{catalogo == "PREVENTA" ? "p" : "c"}</p>
                  </div>
                )} */}
                <Image
                  src={
                    item.imagen.sNombreArchivo &&
                      item.imagen.sNombreArchivo != "-"
                      ? item.imagen.sNombreArchivo
                      : "/images/imagen-no-disponible.jpg"
                  }
                  width={50}
                  height={50}
                  alt={`${item.sDenominacion} - ${item.imagen.sNombreArchivo}`}
                  className="rounded-xl "
                />
              </div>
              <figcaption className="sr-only">
                {item.sDenominacion}
              </figcaption>
            </figure>
            <span className="tag-action caption2 rounded-sm bg-black px-1.5 py-0.5 capitalize text-white">
              {item.sDenominacion}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
export default SelectColor;
