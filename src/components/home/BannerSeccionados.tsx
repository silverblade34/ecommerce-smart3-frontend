
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'
import type { SbBlokData } from '@storyblok/react'

interface BannerItem extends SbBlokData {
  imagen: {
    filename: string
    alt?: string
  }
  titulo: string
  subtitulo: string
  url: string
  texto_color?: string
  status: boolean
}

interface BannerInferiorEstaticoProps {
  blok: {
    columnas: string
    secciones: BannerItem[]
  } & SbBlokData
}

const BannerInferiorEstatico = ({ blok }: BannerInferiorEstaticoProps) => {
  if (!blok.status) return null

  const gridCols =
    blok.columnas === '3'
      ? 'lg:grid-cols-3 md:grid-cols-2'
      : 'lg:grid-cols-2 md:grid-cols-2'

  return (
    <div {...storyblokEditable(blok)} className="banner-block">
      <div className="container">
        <div className={`list-banner grid ${gridCols} lg:gap-[30px] gap-[20px]`}>
          {blok.secciones
            .filter((item) => item.status)
            .map((item) => (
              <Link
                key={item._uid}
                {...storyblokEditable(item)}
                href={item.url || '#'}
               className={`banner-item relative block duration-500`}

              >
                <div className="banner-img w-full rounded-2xl overflow-hidden">
                  <Image
                    src={item.imagen.filename}
                    width={600}
                    height={400}
                    alt={item.imagen.alt || 'banner'}
                    className="w-full duration-500 object-cover"
                  />
                </div>
                <div className="banner-content absolute left-[30px] top-1/2 -translate-y-1/2">
                  <div
                    className="heading6"
                    style={{ color: item.texto_color || '#000' }}
                  >
                    {item.titulo}
                  </div>
                  <div
                    className="caption1 font-semibold text-black relative inline-block pb-1 border-b-2 border-black duration-500 mt-2"
                    style={{ color: item.texto_color || '#000' }}
                  >
                    {item.subtitulo}
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}

export default BannerInferiorEstatico
