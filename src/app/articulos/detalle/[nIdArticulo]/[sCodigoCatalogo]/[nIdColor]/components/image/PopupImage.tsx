import ImageOpacity from "@/components/common/image/ImageOpacity";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import { MutableRefObject } from "react";
import SwiperCore from "swiper/core";
import "swiper/css/zoom";
import { Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import CloseButton from "./CloseButton";
type Props = {
  object: DetalleProducto;
  openPopupImg: boolean;
  setOpenPopupImg: (open: boolean) => void;
  swiperRef: MutableRefObject<SwiperCore | null>;
};

const PopupImage = ({
  object,
  openPopupImg,
  setOpenPopupImg,
  swiperRef,
}: Props) => (
  <div className={`popup-img   ${openPopupImg ? "open" : ""}`}>
    <CloseButton setOpenPopupImg={setOpenPopupImg} />
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      slidesPerGroup={1}
      modules={[Zoom, Navigation, Thumbs]}
      navigation={true}
      className="popupSwiper"
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      zoom={true}
    >
      {object.imagenes.map((item, index) => (
        <SwiperSlide
          key={index}
          onClick={() => {
            setOpenPopupImg(false);
          }}
          zoom={true}
        >
          <ImageOpacity
            src={
              (item.sNombreArchivo != "-" && item.sNombreArchivo) ||
              "/images/imagen-no-disponible.jpg"
            }
            width={1000}
            // priority
            height={1000}
            alt={item?.nIdImagen + " - " + item?.sNombreArchivo}
            className="product-cover aspect-auto w-full rounded-xl"
            onClick={(e) => {
              e.stopPropagation(); // prevent closing on image click
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
);

export default PopupImage;
