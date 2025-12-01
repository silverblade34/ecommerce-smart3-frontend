
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'

interface BannerInferiorEstaticoProps {
  blok: {
    secciones: {
      _uid: string
      component: string
      imagen: {
        filename: string
      }
      titulo: string
      subtitulo: string
      texto_color: string
      url: string
      status: boolean
    }[]
  }
}

const BannerInferiorEstatico = ({ blok }: BannerInferiorEstaticoProps) => {
  return (
    <div
      className="banner-block style-one grid sm:grid-cols-2 gap-5 md:pt-12 pt-10"
      {...storyblokEditable(blok)}
    >
      {blok.secciones
        ?.filter((item) => item.status)
        .map((item) => (
          <Link
            key={item._uid}
            href={item.url || '#'}
            className="banner-item relative block overflow-hidden duration-500"
            {...storyblokEditable(item)}
          >
            <div className="banner-img">
              {item.imagen?.filename && (
                <Image
                  src={item.imagen.filename}
                  width={2000}
                  height={1300}
                  alt={item.titulo || 'banner'}
                  priority={true}
                  className="duration-1000"
                />
              )}
            </div>
            <div className="banner-content absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
              <div
                className="heading2"
                style={{ color: item.texto_color || '#fff' }}
              >
                {item.titulo}
              </div>
              <div
                className="text-button relative inline-block pb-1 border-b-2 mt-2"
                style={{
                  color: item.texto_color || '#fff',
                  borderColor: item.texto_color || '#fff',
                }}
              >
                {item.subtitulo}
              </div>
            </div>
          </Link>
        ))}
    </div>
  )
}

export default BannerInferiorEstatico
