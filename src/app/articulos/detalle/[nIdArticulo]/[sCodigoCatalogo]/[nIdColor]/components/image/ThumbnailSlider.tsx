// import ImageOpacity from "@/components/common/image/ImageOpacity";
// import { DetalleProducto } from "@/lib/interfaces/articulo";
// import SwiperCore from "swiper/core";
// import { Navigation, Thumbs } from "swiper/modules";
// import { Swiper, SwiperSlide } from "swiper/react";

// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/pagination';


// // import required modules
// import { FreeMode, Pagination } from 'swiper/modules';

// type Props = {
//   object: DetalleProducto;
//   setThumbsSwiper: (swiper: SwiperCore) => void;
// };

// const ThumbnailSlider = ({ object, setThumbsSwiper }: Props) => (
//   <Swiper
//   slidesPerView={4}
//         spaceBetween={0}
//         freeMode={true}
//         pagination={{
//           clickable: true,
//         }}
//         modules={[FreeMode, Pagination]}
//         className="mySwiper"
//   >
//     {object.imagenes.map((item, index) => (
//       <SwiperSlide key={index}>
//         <ImageOpacity
//           src={
//             (item.sNombreArchivo != "" && item.sNombreArchivo) ||
//             "/images/imagen-no-disponible.jpg"
//           }
//           priority
//           width={100}
//           height={100}
//           alt={item?.nIdImagen + " - " + item?.sNombreArchivo}
//           className="product-cover aspect-auto w-full rounded-xl"
//         />
//       </SwiperSlide>
//     ))}
//   </Swiper>
// );

// export default ThumbnailSlider;
import ImageOpacity from "@/components/common/image/ImageOpacity";
import { DetalleProducto } from "@/lib/interfaces/articulo";
import SwiperCore from "swiper/core";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
// import "swiper/css/pagination";

// Modules
import { FreeMode, Pagination } from "swiper/modules";

type Props = {
  object: DetalleProducto;
  setThumbsSwiper: (swiper: SwiperCore) => void;
};

const ThumbnailSlider = ({ object, setThumbsSwiper }: Props) => (
  <Swiper
    onSwiper={setThumbsSwiper}
    direction="horizontal"
    slidesPerView={4}
    spaceBetween={0}
    freeMode
    // pagination={{ clickable: true }}
    modules={[FreeMode, Pagination]}
    breakpoints={{
      768: {
        direction: "vertical",
        slidesPerView: 4,
        spaceBetween: 0,
      },
    }}
    className="mySwiper md:h-[400px] md:max-h-[400px] md:overflow-y-auto"
  >
    {object.imagenes.map((item, index) => (
      <SwiperSlide key={index}>
        <ImageOpacity
          src={
            item.sNombreArchivo !== ""
              ? item.sNombreArchivo
              : "/images/imagen-no-disponible.jpg"
          }
          // priority
          width={100}
          height={100}
          alt={`${item.nIdImagen} - ${item.sNombreArchivo}`}
          className="product-cover aspect-auto w-full rounded-xl"
        />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default ThumbnailSlider;
