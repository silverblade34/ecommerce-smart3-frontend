import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import SwiperCore from "swiper/core";
import Image from "next/image";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import ImageMagnifier from "@/components/common/image/ImageMagnifier";
import MarqueeSoon from "@/components/common/image/MarqueeSoon";
import UltimaOportunidad from "@/components/common/image/UltimaOportunidad";
import { MutableRefObject } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import CatalogoBadge from "@/components/common/etiquetas/CatalogoBadge";

type Props = {
  object: DetalleProducto;
  setOpenPopupImg: (open: boolean) => void;
  swiperRef: MutableRefObject<SwiperCore | null>;
  thumbsSwiper: SwiperCore | null;
};

const MainImageSlider = ({
  object,
  setOpenPopupImg,
  swiperRef,
  thumbsSwiper,
}: Props) => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  console.log(object.catalogo)
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={0}
      thumbs={{
        swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
      }}
      modules={[Thumbs]}
      className="mySwiper2 overflow-hidden rounded-2xl border border-line"
    >

      {object.imagenes.length > 0 ? (
        object.imagenes.map((item, index) => (
          <SwiperSlide
            key={index}
            onClick={() => {
              swiperRef.current?.slideTo(index);
              setOpenPopupImg(true);
            }}
          >
            <ImageMagnifier
              src={
                item.sNombreArchivo !== "-" && item.sNombreArchivo
                  ? item.sNombreArchivo
                  : "/images/imagen-no-disponible.jpg"
              }
              width={1000}
              height={1000}
              alt={`${item.nIdImagen} - ${item.sNombreArchivo}`}
              magnifieWidth={100}
              magnifierHeight={100}
              zoomLevel={1.5}
              tipoCatalogo={object.catalogo.sTipoCatalogo}
            />

            {!isAuthenticated &&
              new Date(object.catalogo.dFechaHoraInicio) > new Date() && (
                <MarqueeSoon />
              )}
            {!isAuthenticated && object.ultimaOportunidad && (
              <UltimaOportunidad />
            )}
          </SwiperSlide>
        ))

      ) : (
        <div>
          {/* {(object.catalogo.sTipoCatalogo.toUpperCase() == "CYBER" || object.catalogo.sTipoCatalogo.toUpperCase() == "PREVENTA") && (
            <div className={clsx("absolute left-3 top-3 z-30 rounded-lg p-1 text-xs text-white",
              object.catalogo.sTipoCatalogo.toUpperCase() == "CYBER" ? "bg-pink " : "bg-cyan ")}>
              {object.catalogo.sCodigoCatalogo=="PRECT2025CD10D" || object.catalogo.sCodigoCatalogo=="PRECT2025CD10T"? "Catálogo" :  object.catalogo.sTipoCatalogo.toUpperCase() =="PREVENTA" ? "Catálogo Gratuito" : object.catalogo.sTipoCatalogo.toUpperCase() } 
            </div>
          )} */}
          <CatalogoBadge
            tipo={object.catalogo.sTipoCatalogo}
            codigo={object.catalogo.sCodigoCatalogo}
            position="absolute left-3 top-3"
          />
          <Image
            src="/images/imagen-no-disponible.jpg"
            width={1000}
            height={1000}
            alt="default"
          />
          {!isAuthenticated &&
            new Date(object.catalogo.dFechaHoraInicio) > new Date() && (
              <MarqueeSoon />
            )}
          {!isAuthenticated && object.ultimaOportunidad && (
            <UltimaOportunidad />
          )}
        </div>
      )}
    </Swiper>
  );
};

export default MainImageSlider;
