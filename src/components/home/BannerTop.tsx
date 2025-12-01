'use client'

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import 'swiper/css/effect-fade'

import { storyblokEditable } from '@storyblok/react'

interface BannerTopProps {
    blok: {
        estado?: boolean
        bg_color?: string
        text_color?: string
        slides?: any[]
    }
}

const BannerTop: React.FC<BannerTopProps> = ({ blok }) => {


    if (!blok.estado) return null
    const bgColor = blok.bg_color || 'bg-black'
    const textColor = blok.text_color || 'text-white'
    const slides = blok.slides || []

    return (
        <div
            className={`banner-top style-four w-full py-3 `}
            {...storyblokEditable(blok)}
            style={{
                backgroundColor: bgColor,
            }}
        >
            <div className="container flex items-center justify-center">
                <div className="sm:w-2/3 w-full h-full bg-transparent">
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        loop={true}
                        navigation
                        modules={[Navigation, Autoplay]}
                        className="h-full relative flex items-center justify-center "
                        autoplay={{
                            delay: 1000, 
                            disableOnInteraction: false
                        }}
                    >
                        {slides.length > 0 ? (
                            slides.map((slide, index) => (
                                <SwiperSlide key={index} className='bg-transparent'  data-swiper-autoplay={slide.duracion || 2000}>
                                    <div
                                        className={`px-8 text-center `}
                                    >
                                        <p style={{ color: textColor }}>
                                            {slide.titulo}
                                        </p>
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <div
                                    className={` px-8 text-center ${textColor}`}
                                >
                                    No hay mensajes configurados
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default BannerTop
