'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Scrollbar } from 'swiper/modules'
import { useRouter } from 'next/navigation'
import { storyblokEditable } from '@storyblok/react'
import 'swiper/css/bundle'

interface TendenciaItem {
  _uid: string
  nombre: string
  imagen: { filename: string }
  valor_filtro: string
  color_texto_boton?: string
  status?: boolean
}

interface TrendingNowProps {
  blok: {
    titulo: string
    color_texto?: string
    colecciones: TendenciaItem[]
    status?: boolean
  }
}

// const TrendingNow = ({ blok }: TrendingNowProps) => {
  const TrendingNow: React.FC<TrendingNowProps> = ({ blok }) => {
  
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(true)

    if (blok?.status === false) return null



  const handleTypeClick = (type: string) => {
    router.push(`${type}`)
  }

  const colecciones = blok.colecciones?.filter(item => item.status)


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])



    console.log(blok.colecciones)

  return (
    <div {...storyblokEditable(blok)} className="trending-block style-six md:pt-16 pt-10">
      <div className="container">
        <div
          className="heading3 text-center"
          style={{ color: blok.color_texto || '#000' }}
        >
          {blok.titulo}
        </div>

        <div className="list-trending section-swiper-navigation style-small-border style-outline md:mt-10 mt-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[200px] bg-gray-200 dark:bg-gray-700 rounded-full"
                ></div>
              ))}
            </div>
          ) :
            <Swiper
              spaceBetween={12}
              slidesPerView={2}
              // navigation
              // loop={true}
              modules={[Navigation, Autoplay,Scrollbar]}
              breakpoints={{
                576: { slidesPerView: 3, spaceBetween: 12 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                992: { slidesPerView: 5, spaceBetween: 20 },
                1290: { slidesPerView: 6, spaceBetween: 30 },
              }}
              className="h-full"
            >
              {colecciones?.map((item) => (
               
                  <SwiperSlide key={item._uid}>
                    <div
                      className="trending-item block relative cursor-pointer"
                      onClick={() => handleTypeClick(item.valor_filtro)}
                    >
                      <div className="bg-img rounded-full overflow-hidden">
                        <Image
                          src={item.imagen?.filename || '/images/placeholder.png'}
                          width={1000}
                          height={1000}
                          alt={item.nombre}
                          priority
                          className="w-full"
                        />
                      </div>
                      <div className="trending-name text-center mt-5 duration-500">
                        <span
                          className="heading5"
                          style={{ color: item.color_texto_boton || '#000' }}
                        >
                          {item.nombre}
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                
              ))}
            </Swiper>
          }
        </div>
      </div>
    </div>
  )
}

export default TrendingNow
