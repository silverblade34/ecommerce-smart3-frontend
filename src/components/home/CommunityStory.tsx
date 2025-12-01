// 'use client'

// import React from 'react'
// import { useRouter } from 'next/navigation'
// import Image from 'next/image'

// const CommunityStory = () => {
//     const router = useRouter()

//     const handleDetailProduct = (productId: string) => {
//         // redirect to shop with category selected
//         router.push(`/product/default?id=${productId}`);
//     };

//     return (
//         <div className="community-story-block md:mt-20 mt-10">
//             <div className="container">
//                 <div className="heading3 text-center">Community Stories</div>
//                 <div className="mt-3 text-center">Trust - lovely guests</div>
//                 <div
//                     className='list-product grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-[30px] gap-[16px] md:mt-10 mt-6'>
//                     <div className="product-item block h-full relative aspect-[3/4] md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
//                         onClick={() => handleDetailProduct('53')}>
//                         <div className="bg-img w-full h-full">
//                             <iframe className="w-full h-full"
//                                 src="https://www.youtube.com/embed/lnTWVAyMHg0?si=jCD4v1XxwsVwCn64&controls=0&autoplay=1&mute=1&rel=0"
//                                 title="YouTube video player"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
//                         </div>
//                         <div
//                             className="product-infor flex items-center sm:gap-4 gap-2 absolute sm:left-5 left-3 sm:bottom-5 bottom-3 w-full">
//                             <div
//                                 className="product-img sm:w-[52px] w-10 sm:h-[52px] h-10 rounded-full overflow-hidden flex-shrink-0">
//                                 <Image width={5000} height={5000} src='/images/product/1000x1000.png' alt='8-1'
//                                     className='w-full h-full object-cover' />
//                             </div>
//                             <div className="product-name w-full">
//                                 <div className="text-white capitalize">Tinted eye Balm</div>
//                                 <div className="flex items-center gap-2 mt-1">
//                                     <div className="product-price text-white">$20.00</div>
//                                     <div className="product-origin-price caption1 text-white">
//                                         <del>$25.00</del>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="product-item block h-full aspect-[3/4] relative md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
//                         onClick={() => handleDetailProduct('45')}>
//                         <div className="bg-img h-full w-full">
//                             <iframe className="w-full h-full"
//                                 src="https://www.youtube.com/embed/SQKGyw0d-fU?si=TylurstsiRYdJkQ-&controls=0&autoplay=1&mute=1&rel=0"
//                                 title="YouTube video player"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
//                         </div>
//                         <div
//                             className="product-infor flex items-center sm:gap-4 gap-2 absolute sm:left-5 left-3 sm:bottom-5 bottom-3 w-full">
//                             <div
//                                 className="product-img sm:w-[52px] w-10 sm:h-[52px] h-10 rounded-full overflow-hidden flex-shrink-0">
//                                 <Image width={5000} height={5000} src='/images/product/1000x1000.png' alt='4-1'
//                                     className='w-full h-full object-cover' />
//                             </div>
//                             <div className="product-name w-full">
//                                 <div className="text-white capitalize">Tinted eye Balm</div>
//                                 <div className="flex items-center gap-2 mt-1">
//                                     <div className="product-price text-white">$20.00</div>
//                                     <div className="product-origin-price caption1 text-white">
//                                         <del>$25.00</del>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="product-item block h-full aspect-[3/4] relative md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
//                         onClick={() => handleDetailProduct('41')}>
//                         <div className="bg-img h-full w-full">
//                             <iframe className="h-full w-full"
//                                 src="https://www.youtube.com/embed/XFWoLiOKBt0?si=QdURubTrYAmvDLc0&controls=0&autoplay=1&mute=1&rel=0"
//                                 title="YouTube video player"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
//                         </div>
//                         <div
//                             className="product-infor flex items-center sm:gap-4 gap-2 absolute sm:left-5 left-3 sm:bottom-5 bottom-3 w-full">
//                             <div
//                                 className="product-img sm:w-[52px] w-10 sm:h-[52px] h-10 rounded-full overflow-hidden flex-shrink-0">
//                                 <Image width={5000} height={5000} src='/images/product/1000x1000.png' alt='3-1'
//                                     className='w-full h-full object-cover' />
//                             </div>
//                             <div className="product-name w-full">
//                                 <div className="text-white capitalize">Face Tan Booster</div>
//                                 <div className="flex items-center gap-2 mt-1">
//                                     <div className="product-price text-white">$15.00</div>
//                                     <div className="product-origin-price caption1 text-white">
//                                         <del>$20.00</del>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="product-item block h-full aspect-[3/4] relative md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
//                         onClick={() => handleDetailProduct('46')}>
//                         <div className="bg-img h-full w-full">
//                             <iframe className="h-full w-full"
//                                 src="https://www.youtube.com/embed/huOVTcPUc_4?si=yRH0DqbR02dAoqyW&controls=0&autoplay=1&mute=1&rel=0"
//                                 title="YouTube video player"
//                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
//                         </div>
//                         <div
//                             className="product-infor flex items-center sm:gap-4 gap-2 absolute sm:left-5 left-3 sm:bottom-5 bottom-3 w-full">
//                             <div
//                                 className="product-img sm:w-[52px] w-10 sm:h-[52px] h-10 rounded-full overflow-hidden flex-shrink-0">
//                                 <Image width={5000} height={5000} src='/images/product/1000x1000.png' alt='5-1'
//                                     className='w-full h-full object-cover' />
//                             </div>
//                             <div className="product-name w-full">
//                                 <div className="text-white capitalize">Tinted eye Balm</div>
//                                 <div className="flex items-center gap-2 mt-1">
//                                     <div className="product-price text-white">$20.00</div>
//                                     <div className="product-origin-price caption1 text-white">
//                                         <del>$25.00</del>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CommunityStory


'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { storyblokEditable } from '@storyblok/react'

interface Historia {
  id: string
  video_url: string
  imagen_perfil: {
    filename: string
  }
  nombre: string
  precio: string
  precio_original: string
}

interface CommunityStoryProps {
  blok: {
    titulo: string
    subtitulo: string
    historias: Historia[]
    status: boolean
  }
}

const CommunityStory = ({ blok }: CommunityStoryProps) => {
  const router = useRouter()
  if (!blok.status) return null

  const handleDetailProduct = (id: string) => {
    router.push(`${id}`)
  }

  const getEmbedUrl = (url: string) => {
    try {
      let videoId = "";

      // Shorts → https://youtube.com/shorts/VIDEOID
      const shortMatch = url.match(/shorts\/([^?]+)/);
      if (shortMatch) {
        videoId = shortMatch[1];
      }

      // Watch → https://youtube.com/watch?v=VIDEOID
      const watchMatch = url.match(/[?&]v=([^&]+)/);
      if (!videoId && watchMatch) {
        videoId = watchMatch[1];
      }

      // Embed → https://www.youtube.com/embed/VIDEOID?si=xxxx
      const embedMatch = url.match(/embed\/([^?]+)/);
      if (!videoId && embedMatch) {
        videoId = embedMatch[1];
      }

      // Si encontramos un ID, armamos el embed correctamente
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1`;
      }

      return url; // fallback
    } catch {
      return url;
    }
  };




  return (
    <div {...storyblokEditable(blok)} className="community-story-block md:mt-10 mt-10">
      <div className="container">
        <div className="heading3 text-center">{blok.titulo}</div>
        <div className="mt-3 text-center">{blok.subtitulo}</div>

        {/* 🟩 Grid adaptable sin definir columnas desde el CMS */}
        <div className="list-product grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 md:gap-[30px] gap-[16px] md:mt-10 mt-6">
          {blok.historias?.map((historia, index) => (
            <div
              key={index}
              className="product-item block h-full relative aspect-[3/4] md:rounded-2xl rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleDetailProduct(historia.id)}
            >
              <div className="bg-img w-full h-full">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(historia.video_url)}
                  title={`video-${index}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>

              <div className="product-infor flex items-center sm:gap-4 gap-2 absolute sm:left-5 left-3 sm:bottom-5 bottom-3 w-full">
                <div className="product-img sm:w-[52px] w-10 sm:h-[52px] h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    width={500}
                    height={500}
                    src={historia.imagen_perfil?.filename || '/images/product/1000x1000.png'}
                    alt={historia.nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="product-name w-full">
                  <div className="text-white capitalize">{historia.nombre}</div>
                  {/* <div className="flex items-center gap-2 mt-1">
                    <div className="product-price text-white">{historia.precio}</div>
                    <div className="product-origin-price caption1 text-white">
                      <del>{historia.precio_original}</del>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CommunityStory
