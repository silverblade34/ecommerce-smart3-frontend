'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { storyblokEditable } from '@storyblok/react'
import Link from 'next/link'
// import Product from '../Product/Product'

interface FiltroItem {
  nombre: string
  valor_filtro: string
  color_activo: string
  color_texto: string
  status: boolean
}

interface ProductoItem {
  nombre: string
  valor_filtro: string
  etiqueta?: string
  color_etiqueta?: string
  color_texto_etiqueta?: string
  color_precio?: string
  imagen?: {
    filename?: string
    alt?: string
  }
  precio_descuento?: string
  status?: boolean
  enlace_redireccion?: string
}

interface BestSellersProps {
  blok: {
    titulo: string
    filtros: FiltroItem[]
    productos: ProductoItem[]
    start: number
    limit: number
  }
}

const BestSellers: React.FC<BestSellersProps> = ({ blok }) => {
  const filtrosActivos = blok.filtros?.filter((f) => f.status) || []

  const [activeTab, setActiveTab] = useState<string>(
    filtrosActivos[0]?.valor_filtro || ''
  )

  const handleTabClick = (valor: string) => setActiveTab(valor)

  const productosActivos =
    blok.productos?.filter(
      (p) => p.status && p.valor_filtro === activeTab
    ) || []

  return (
    <div
      className="tab-features-block md:pt-4 pt-8"
      {...storyblokEditable(blok)}
    >
      <div className="container">
        <div className="heading flex items-center justify-between gap-5 flex-wrap">
          <div className="heading3">{blok.titulo || 'Best Sellers'}</div>

          <div className="menu-tab flex items-center gap-2 p-1 bg-surface rounded-2xl">
            {filtrosActivos.map((filtro) => (
              <div
                key={filtro.valor_filtro}
                className={`tab-item relative text-button-uppercase py-2 px-5 cursor-pointer duration-500`}
                onClick={() => handleTabClick(filtro.valor_filtro)}
                style={{
                  color:
                    activeTab === filtro.valor_filtro
                      ? filtro.color_texto
                      : '#666',
                }}
              >
                {activeTab === filtro.valor_filtro && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      backgroundColor: filtro.color_activo || '#fff',
                    }}
                  />
                )}
                <span className="relative z-[1]">{filtro.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="list-product hide-product-sold grid lg:grid-cols-4 grid-cols-2 sm:gap-[30px] gap-[20px] md:mt-10 mt-6">
          {productosActivos.length > 0 ? (
            productosActivos
              .slice(blok.start || 0, blok.limit || productosActivos.length)
              .map((prd, index) => (
                <Link
                  key={index}
                  href={`${prd.enlace_redireccion}`}  
                  className="relative border rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 bg-white block"
                >
                  <div
                    key={index}
                    className="relative border rounded-2xl overflow-hidden group shadow-sm hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    {prd.imagen?.filename && (
                      <img
                        src={prd.imagen.filename}
                        alt={prd.imagen.alt || prd.nombre}
                        className="w-full h-auto object-cover"
                      />
                    )}

                    {prd.etiqueta && (
                      <span
                        className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded-full uppercase"
                        style={{
                          backgroundColor: prd.color_etiqueta || '#000',
                          color: prd.color_texto_etiqueta || '#fff',
                        }}
                      >
                        {prd.etiqueta}
                      </span>
                    )}

                    <div className="p-2 flex flex-col justify-center text-center">
                      <h4 className="font-medium text-base ">{prd.nombre}</h4>

                      {/* Precio */}
                      {/* {prd.precio_descuento && (
                      <span
                        className="text-sm font-semibold"
                        style={{
                          color: prd.color_precio || '#000',
                        }}
                      >
                        S/ {prd.precio_descuento}
                      </span>
                    )} */}
                    </div>
                  </div>
                </Link>
              ))
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-10">
              No hay productos para este filtro.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BestSellers
