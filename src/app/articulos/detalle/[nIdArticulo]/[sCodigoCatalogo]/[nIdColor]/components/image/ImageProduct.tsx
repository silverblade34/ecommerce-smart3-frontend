import "swiper/css";
import { useRef, useState } from "react";
import { Navigation, Thumbs } from "swiper/modules";
import SwiperCore from "swiper/core";
import MainImageSlider from "./MainImageSlider";
import ThumbnailSlider from "./ThumbnailSlider";
import PopupImage from "./PopupImage";
import { DetalleProducto } from "@/lib/interfaces/articulo";

// Instalar los módulos de Swiper fuera del componente
// Esto no es un Hook de React, por lo que está bien usarlo fuera del componente
// eslint-disable-next-line react-hooks/rules-of-hooks
SwiperCore.use([Navigation, Thumbs]);

type Props = {
  variant: DetalleProducto;
};

const ImageProduct = ({ variant }: Props) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [openPopupImg, setOpenPopupImg] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore | null>(null);

  return (
    <section className="list-img w-full md:w-3/5 md:pr-[45px]">
      <MainImageSlider
        object={variant}
        setOpenPopupImg={setOpenPopupImg}
        swiperRef={swiperRef}
        thumbsSwiper={thumbsSwiper}
      />
      <div className="md:max-h-[20px]">
      {variant.imagenes.length > 1 && (
        <ThumbnailSlider object={variant} setThumbsSwiper={setThumbsSwiper} />
      )}
      </div>
      <PopupImage
        object={variant}
        openPopupImg={openPopupImg}
        setOpenPopupImg={setOpenPopupImg}
        swiperRef={swiperRef}
      />
    </section>
  );
};

export default ImageProduct;
