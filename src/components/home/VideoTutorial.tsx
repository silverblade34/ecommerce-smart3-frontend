
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import * as Icon from "@phosphor-icons/react/dist/ssr"
import { storyblokEditable } from "@storyblok/react"

interface VideoItem {
  _uid: string
  titulo: string
  imagen_fondo: {
    filename: string
    alt?: string
  }
  video_url: string
  component: string
}

interface VideoTutorialProps {
  blok: {
    _uid: string
    items: VideoItem[]
  }
}

const VideoTutorial = ({ blok }: VideoTutorialProps) => {
  const [activeVideo, setActiveVideo] = useState<string>(blok.items?.[0]?._uid || '')
  const [openVideo, setOpenVideo] = useState<boolean>(false)

  const handleActiveVideo = (id: string) => {
    setActiveVideo(id)
  }

  const activeItem = blok.items.find(item => item._uid === activeVideo)

  return (
    <>
      <div
        {...storyblokEditable(blok)}
        className="video-tutorial-block md:mt-10 mt-10 bg-linear relative max-sm:flex max-sm:flex-col-reverse"
      >
        {/* LISTA DE CATEGORÍAS */}
        <div className="container">
          <div className="list-category w-fit lg:py-[160px] sm:py-10 py-10">
            {blok.items.map((item, index) => (
              <div
                key={item._uid}
                onClick={() => handleActiveVideo(item._uid)}
                className={`item flex items-center gap-3 cursor-pointer ${index !== 0 ? 'sm:mt-7 mt-4' : ''} ${activeVideo === item._uid ? 'active' : ''}`}
              >
                <Icon.CaretDoubleRight size={24} />
                <div className="heading4 inline-block">{item.titulo}</div>
              </div>
            ))}
          </div>
        </div>

        {/* LISTA DE VIDEOS */}
        <div className="list-video sm:absolute max-sm:relative top-0 right-0 bottom-0 w-1/2 max-sm:w-full">
          {blok.items.map((item) => (
            <div
              key={item._uid}
              className={`bg-video w-full h-full ${activeVideo === item._uid ? 'active' : ''}`}
              data-item={item._uid}
            >
              <div className="bg-img w-full h-full">
                <Image
                  src={item.imagen_fondo?.filename || '/images/banner/video-cos2.png'}
                  width={3000}
                  height={3000}
                  alt={item.imagen_fondo?.alt || 'bg-img'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="btn-play absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-white sm:w-20 w-16 sm:h-20 h-16 rounded-full flex items-center justify-center duration-500 hover:bg-black hover:text-white"
                onClick={() => setOpenVideo(true)}
              >
                <Icon.Play size={30} weight="fill" />
              </div>
            </div>
          ))}
        </div>

        {/* MODAL DEL VIDEO */}
        <div className={`modal-video-block`} onClick={() => setOpenVideo(false)}>
          <div
            className={`modal-video-main ${openVideo ? 'open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            {activeItem?.video_url ? (
              <iframe
                src={activeItem.video_url}
                title={activeItem.titulo}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            ) : (
              <iframe
                src="https://www.youtube.com/embed/CxZI6R1VKJY"
                title="Default video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              ></iframe>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default VideoTutorial
