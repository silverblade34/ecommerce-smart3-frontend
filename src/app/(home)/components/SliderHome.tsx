"use client";

import { useEffect, useState } from "react";
import { handleClickBannerWhatsappSokso } from "@/analitycs/filters";
import Image from "next/image";
import Link from "next/link";
import "swiper/css/bundle";
import "swiper/css/effect-fade";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { BannersService } from "@/server/actions/client";
import useAuthStore from "@/context/user/auth-store";


const SliderHome = () => {
  const [hasPreventa, setHasPreventa] = useState(false);
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuthStore();


  useEffect(() => {
    const idCliente = profile?.cliente?.nIdCliente ?? 0;

    // Leer preventa desde localStorage
    const raw = localStorage.getItem("catalog-filter");
    const data = raw ? JSON.parse(raw) : null;
    const gratuito =
      Array.isArray(data?.data) &&
      data.data.some(
        (item: { sDescripcionTipoCatalogo: string }) =>
          item.sDescripcionTipoCatalogo.toUpperCase() === "GRATIS"
      );

    setHasPreventa(gratuito);
      console.log("Cargando banners para cliente:", idCliente, "Con preventa:", gratuito);
    const loadBanners = async () => {
      try {
        const res = await BannersService(idCliente);

        if (res.success) {
          console.log("Respuesta del servicio de banners:", res.bannersPermitidos);
          const mapped = (res.bannersPermitidos || []).map((b: any) => ({
            id: b.nIdBanner,
            alt: b.sNombre,
            imageDesktop: b.sLinkWeb,
            imageMobile: b.sLinkMobile,
            link: b.sHipervinculo || "#",
            target: b.target || "",
            sBono: b.sBono || "",
            sMeta: b.sMeta || "",
    
          }));
            const bannerWithExtra = mapped.find( (b: { sBono: string; sMeta: string; }) => (b.sBono && b.sBono.trim() !== "") || (b.sMeta && b.sMeta.trim() !== "")
  );

  if (bannerWithExtra) {
    console.log("📦 Guardando sBono y sMeta en localStorage:", bannerWithExtra);

    localStorage.setItem("banner_sBono", bannerWithExtra.sBono || "");
    localStorage.setItem("banner_sMeta", bannerWithExtra.sMeta || "");
  }
          setBanners(mapped);
        }
      } catch (e) {
        console.error("Error cargando banners:", e);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
  }, [ profile?.cliente?.nIdCliente]);

  // Si el banner requiere preventa, lo filtramos
  const filteredData = banners.filter((item) =>
    item.preventa ? hasPreventa : true
  );

  return (
    <div className="slider-block style-one bg-linear w-full h-full">
      <div className="slider-main h-full w-full overflow-hidden">
        {!loading && (
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop
            pagination={{ clickable: true }}
            modules={[Pagination, Autoplay]}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            onSlideChange={(swiper) => {
              const currentSlide = filteredData[swiper.realIndex];
              if (
                swiper.params.autoplay &&
                typeof swiper.params.autoplay !== "boolean"
              ) {
                swiper.params.autoplay.delay =
                  currentSlide?.id === 5
                    ? 1000
                    : currentSlide?.id === 1
                    ? 8000
                    : 4000;
                swiper.autoplay.start();
              }
            }}
            className="h-full relative dots-white overflow-hidden !w-full"
          >
            {filteredData.map(
              ({ alt, id, imageDesktop, imageMobile, link, target }) => (
                <SwiperSlide key={id}>
                  <Link
                    href={link}
                    target={target}
                    id={
                      link.includes("whatsapp")
                        ? "link-whatsapp-sokso"
                        : undefined
                    }
                    onClick={
                      link.includes("whatsapp")
                        ? handleClickBannerWhatsappSokso
                        : undefined
                    }
                  >
                    <div className="slider-item h-full w-full relative overflow-hidden cursor-pointer">
                      <div className="w-full relative">
                        <Image
                          src={imageDesktop}
                          alt={alt}
                          width={2560}
                          height={1080}
                          priority
                          className="w-full h-full object-cover hidden sm:block"
                        />
                        <Image
                          src={imageMobile}
                          alt={alt}
                          width={2560}
                          height={1080}
                          priority
                          className="object-cover block sm:hidden"
                        />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              )
            )}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default SliderHome;
