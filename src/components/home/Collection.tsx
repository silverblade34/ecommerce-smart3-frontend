'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules'
import 'swiper/css/bundle'
import { useRouter } from 'next/navigation'
import { storyblokEditable } from '@storyblok/react'

interface CollectionItem {
  nombre: string
  imagen: {
    filename: string
    alt?: string
  }
  valor_filtro: string
  boton_color: string
  color_texto_boton: string
  status: boolean
  _uid: string
  component: string
  _editable?: string
}

interface CollectionBannerProps {
  blok: {
    titulo: string
    texto_boton: string
    enlace_boton: string
    color_texto: string
    colecciones: CollectionItem[]
    status: boolean
    _uid: string
    component: string
    _editable?: string
  }
}

const Collection: React.FC<CollectionBannerProps> = ({ blok }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  if (!blok.status) return null

  const handleTypeClick = (type: string) => {
    router.push(`${type}`)
  }

  const coleccionesActivas = blok.colecciones?.filter(item => item.status)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className="collection-block style-six md:pt-8 pt-8"
      {...storyblokEditable(blok)}
    >
      <div className="container">
        <div className="heading flex items-center justify-between gap-4 gap-y-2 flex-wrap">
          <div
            className="heading3"
            style={{ color: blok.color_texto || '#000' }}
          >
            {blok.titulo}
          </div>

          {blok.enlace_boton && (
            <Link
              href={blok.enlace_boton}
              className="text-button pb-1 border-b-2"
              style={{
                borderColor: blok.color_texto || '#000',
                color: blok.color_texto || '#000',
              }}
            >
              {blok.texto_boton}
            </Link>
          )}
        </div>

        <div className="list-collection md:mt-10 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[220px] bg-gray-200 dark:bg-gray-700 rounded-2xl"
                ></div>
              ))}
            </div>
          ) :
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              loop={true}
              scrollbar={{ hide: false }}
              modules={[Navigation, Autoplay, Scrollbar]}
              breakpoints={{
                576: { slidesPerView: 2, spaceBetween: 12 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1200: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="h-full pb-6"

            >
              {coleccionesActivas?.map((item) => (
                <SwiperSlide key={item._uid}>
                  <div
                    className="collection-item block relative rounded-2xl overflow-hidden cursor-pointer"
                    onClick={() => handleTypeClick(item.valor_filtro)}
                  >
                    <div className="bg-img">
                      <Image
                        src={item.imagen.filename}
                        width={1000}
                        height={600}
                        alt={item.imagen.alt || item.nombre}
                        className="w-full h-auto"
                      />
                    </div>
                    <div
                      className="collection-name heading5 text-center sm:bottom-8 bottom-4 lg:w-[200px] md:w-[160px] w-[100px] md:py-3 py-1.5 rounded-xl duration-500 absolute left-1/2 transform -translate-x-1/2"
                      style={{
                        backgroundColor: item.boton_color || '#fff',
                        color: item.color_texto_boton || '#000',
                      }}
                    >
                      {item.nombre}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>}

        </div>
      </div>
    </div>
  )
}

export default Collection
