'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css/bundle'
import 'swiper/css/effect-fade'
import { storyblokEditable } from '@storyblok/react'

interface ImagenStoryblok {
  id: number
  alt: string
  name: string
  focus: string
  title: string
  filename: string
  copyright?: string
  fieldtype?: string
}

interface SlideBannerPrincipal {
  _uid: string
  component: string
  titulo: string
  subtitulo: string
  button_text: string
  button_link: {
    id: string
    url: string
    linktype: string
    fieldtype: string
    cached_url: string
  }
  imagen_web: ImagenStoryblok
  imagen_mobile: ImagenStoryblok
  duracion: string
  status: boolean
  type: string
  _editable?: string
}

interface BannerPrincipalImagenProps {
  blok: {
    status?: boolean
    component: string
    slides: SlideBannerPrincipal[]
    _uid?: string
    _editable?: string
  }
}

const SliderFour: React.FC<BannerPrincipalImagenProps> = ({ blok }) => {

  if (!blok.status) return null

  return (
    <div
      {...storyblokEditable(blok)}
      className="slider-block style-one w-full"
    >
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: true }}
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: parseInt(blok.slides[0]?.duracion || '4000'),
        }}
        className="relative w-full"
      >
        {blok.slides.map((slide) => (
          <SwiperSlide key={slide._uid}>
            <Link
              href={slide.button_link?.url || "#"}
              className="relative w-full block cursor-pointer"
            >
              <div className="
                relative w-full
                md:aspect-[1920/652]
                aspect-[680/910]
              ">
                {slide.imagen_mobile?.filename && (
                  <Image
                    src={slide.imagen_mobile.filename}
                    alt={slide.imagen_mobile.alt || slide.titulo || 'Banner mobile'}
                    fill
                    className="object-cover block md:hidden"
                    priority
                  />
                )}

                {slide.imagen_web?.filename && (
                  <Image
                    src={slide.imagen_web.filename}
                    alt={slide.imagen_web.alt || slide.titulo || 'Banner desktop'}
                    fill
                    className="object-cover hidden md:block"
                    priority
                  />
                )}
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                {slide.subtitulo && (
                  <div className="text-sub-display mb-2 md:mb-4">
                    {slide.subtitulo}
                  </div>
                )}

                {slide.titulo && (
                  <div className="text-display md:mt-5 mt-2 max-w-4xl">
                    {slide.titulo}
                  </div>
                )}

                {slide.button_text && (
                  <div className="button-main bg-white text-black hover:bg-black hover:text-white md:mt-8 mt-4 px-6 py-3 rounded-lg transition-all duration-300 font-medium">
                    {slide.button_text}
                  </div>
                )}
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default SliderFour