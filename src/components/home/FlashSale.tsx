'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { storyblokEditable } from '@storyblok/react'

type TimeUnit = 'dias' | 'horas' | 'minutos' | 'segundos'

interface Countdown {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

const getCountdown = (fechaObjetivo: string): Countdown => {
  const targetDate = new Date(fechaObjetivo)
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()

  if (diff <= 0) return { dias: 0, horas: 0, minutos: 0, segundos: 0 }

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const segundos = Math.floor((diff % (1000 * 60)) / 1000)

  return { dias, horas, minutos, segundos }
}

const FlashSale = ({ blok }: any) => {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState<Countdown>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    setTimeLeft(getCountdown(blok.fecha_objetivo))
    const timer = setInterval(() => {
      setTimeLeft(getCountdown(blok.fecha_objetivo))
    }, 1000)
    return () => clearInterval(timer)
  }, [mounted, blok.fecha_objetivo])

  if (!mounted || !blok.status) return null

  const isExpired =
    timeLeft.dias === 0 &&
    timeLeft.horas === 0 &&
    timeLeft.minutos === 0 &&
    timeLeft.segundos === 0

  if (isExpired) return null

  const units: TimeUnit[] = ['dias', 'horas', 'minutos', 'segundos']

  const getLabel = (unit: TimeUnit, value: number) => {
    switch (unit) {
      case 'dias':
        return value === 1 ? 'Día' : 'Días'
      case 'horas':
        return value === 1 ? 'Hora' : 'Horas'
      case 'minutos':
        return value === 1 ? 'Minuto' : 'Minutos'
      case 'segundos':
        return value === 1 ? 'Segundo' : 'Segundos'
      default:
        return unit
    }
  }

  return (
    <div
      className="flash-sale-block style-six w-full mt-8"
      style={{ backgroundColor: blok.bg_color, color: blok.text_color }}
      {...storyblokEditable(blok)}
    >
      <div className="container">
        <div className="text-content flex items-center justify-between max-lg:flex-col max-lg:justify-center max-lg:text-center gap-5 py-10">
          <div className="heading" style={{ color: blok.text_color }}>
            <div className="heading2">{blok.titulo}</div>
            <div className="body1 mt-3">{blok.subtitulo}</div>
          </div>

          <div className="countdown-time flex items-center gap-5 max-sm:gap-[18px]">
            {units.map((unit, i) => (
              <React.Fragment key={unit}>
                {i > 0 && <span className="heading4">:</span>}
                <div className="item flex flex-col items-center">
                  <div className="time heading1">
                    {timeLeft[unit] < 10 ? `0${timeLeft[unit]}` : timeLeft[unit]}
                  </div>
                  <div className="text-button-uppercase font-medium">
                    {getLabel(unit, timeLeft[unit])}
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>

          <Link
            href={blok.button_link?.url || '#'}
            className="button-main"
            style={{ backgroundColor: blok.button_color, color: blok.button_color_text }}
          >
            {blok.button_text}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FlashSale
