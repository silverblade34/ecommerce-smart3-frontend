
'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import { storyblokEditable, SbBlokData } from '@storyblok/react'
import 'swiper/css/bundle'

import {
  InstagramLogo,
  FacebookLogo,
  TiktokLogo,
  YoutubeLogo,
  TwitterLogo,
  LinkSimple,
  XLogo
} from '@phosphor-icons/react'

interface InstagramPostItem extends SbBlokData {
  component: 'instagram_post_item'
  imagen: {
    filename: string
    alt?: string
  }
  link: string
  status?: boolean
}

interface InstagramPost extends SbBlokData {
  component: 'instagram_post'
  titulo: string
  subtitulo: string
  imagenes: InstagramPostItem[]
  status?: boolean
}

function detectarIcono(link: string) {
  if (!link) {
    return <LinkSimple size={24} />
  }

  if (link.includes('instagram')) {
    return <InstagramLogo size={24} />
  }
  if (link.includes('facebook')) {
    return <FacebookLogo size={24} />
  }
  if (link.includes('tiktok')) {
    return <TiktokLogo size={24} />
  }
  if (link.includes('youtube')) {
    return <YoutubeLogo size={24} />
  }
  if (link.includes('twitter')) {
    return <TwitterLogo size={24} />
  }
  if (link.includes('twitter')) {
    return <XLogo size={24} />
  }

  return <LinkSimple size={24} />
}

const Instagram: React.FC<{ blok: InstagramPost }> = ({ blok }) => {
  const [isLoading, setIsLoading] = useState(true)

  if (blok.status === false) return null

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="instagram-block md:pt-8 pt-4 mb-4" {...storyblokEditable(blok)}>
      <div className="heading">
        <div className="heading3 text-center">{blok.titulo}</div>
        <div className="text-center mt-3">{blok.subtitulo}</div>
      </div>

      <div className="list-instagram md:mt-7 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[220px] bg-gray-200 dark:bg-gray-700 rounded-sm"
              ></div>
            ))}
          </div>
        ) : (
          <Swiper
            slidesPerView={2}
            loop={true}
            modules={[Autoplay]}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              500: { slidesPerView: 2 },
              680: { slidesPerView: 3 },
              992: { slidesPerView: 4 },
              1200: { slidesPerView: 5 },
            }}
          >
            {blok.imagenes?.map((item) => (
              <SwiperSlide key={item._uid}>
                <Link
                  href={item.link || '#'}
                  target="_blank"
                  className="item relative block overflow-hidden group"
                >
                  <Image
                    src={item.imagen?.filename || '/placeholder.png'}
                    width={500}
                    height={500}
                    alt={item.imagen?.alt || 'Social image'}
                    className="h-full w-full duration-500 relative"
                  />

                  <div className="icon w-12 h-12 bg-white group-hover:bg-black duration-500 flex items-center justify-center rounded-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]">
                    <div className="text-white">
                      {detectarIcono(item.link)}
                    </div>
                  </div>
                </Link>

              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  )
}

export default Instagram
