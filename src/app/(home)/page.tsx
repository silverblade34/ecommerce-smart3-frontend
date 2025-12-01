


// import SliderFour from "@/components/Slider/SliderFour";
// import SliderHome from "./components/SliderHome";
// import WhatNew from "./components/WhatNew";
// import BannerTop from "@/components/Home4/BannerTop";
// import Collection from "@/components/Home6/Collection";
// import BestSellers from "@/components/Home4/BestSellers";
// import productData from '@/data/Product.json'
// import Banner from "@/components/Home1/Banner";
// import PopularProduct from "@/components/Home6/PopularProduct";
// import CommunityStory from "@/components/Cosmetic1/CommunityStory";
// import VideoTutorial from "@/components/Cosmetic2/VideoTutorial";
// import Instagram from "@/components/Home6/Instagram";
// import Footer from "@/components/Footer/Footer";
// import FlashSale from "@/components/Home6/FlashSale";
// import TrendingNow from "@/components/Home7/TrendingNow";
// import BannerSeccionados from "@/components/Home9/Banner";
// import { getStoryblokApi, StoryblokComponent } from "@storyblok/react";

// import "@/lib/storyblok"; 

// export default async function Home() {


//   const sb = getStoryblokApi();

//   // ✅ Usa variables de entorno o headers en lugar de window
//   const version =
//     process.env.VERCEL_ENV === 'preview' ||
//     process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
//       ? 'draft'
//       : 'published';

//   const { data } = await sb.get("cdn/stories/home", {
//     version,
//     resolve_links: 'url',
//   });

//   const story = data?.story;



//   return (
//     <>

//       {/* PEQUEÑO BANNER SUPERIOR INFORMATIVO SOLO TEXTO*/}
//       {story?.content?.banner_top_informativo && (
//         <BannerTop blok={story?.content?.banner_top_informativo?.[0]} />
//       )}

//       {/* BANNER SUPERIOR */}
//       {story?.content?.banner_principal_imagen && (
//         <div id="header" className="relative w-full">
//           <SliderFour blok={story?.content?.banner_principal_imagen?.[0]} />
//         </div>
//       )}

//       {/*CUENTA REGRESIVA CYBER - PREVENTA ETC /  ACTIVO - INACTIVO */}
//       {story?.content?.cronometro_cuenta_regresiva && (
//         < FlashSale blok={story?.content?.cronometro_cuenta_regresiva?.[0]} />
//       )}

//       {/* COLECCIONES CATEGORIA - ZAPATOS - CARTERAS ETC*/}
//       {story?.content?.colecciones && (
//         <Collection blok={story?.content?.colecciones?.[0]} />
//       )}


//       {/**TENDENCIAS ACTUALES - CIRCULARES */}
//       {story?.content?.tendencias && (
//         <TrendingNow blok={story?.content?.tendencias?.[0]} />
//       )}


//       {/* MOSTRAR 4 ARTICULOS SIN PRECIO POR CATEGORIA DINAMICA */}
//       {story?.content?.mas_vendidos && (
//         <BestSellers blok={story?.content?.mas_vendidos?.[0]} />
//       )}


//       {/*LOS MAS VENDIDOS - RECIEN LLEGADOS */}
//       {story?.content?.banner_inferior_estatico && (
//         <Banner blok={story?.content?.banner_inferior_estatico?.[0]} />
//       )}


//       {/*PRODUCTOS POPULARES -PUNTOS INFORMATIVOS- POR EL MOMENTO SOLO 2 */}
//       {story?.content?.productos_populares && (
//         <PopularProduct blok={story?.content?.productos_populares?.[0]} />
//       )}


//       {/**BANNER DIVIDIDOS EN 3 SECCIONES / 2 SECCIONES */}
//       {story?.content?.seccion_informativa_imagenes && (
//         <BannerSeccionados blok={story?.content?.seccion_informativa_imagenes?.[0]} />
//       )}


//       {/**4 Videos reproducidos automaticamente */}
//       {story?.content?.videos_automaticos && (
//         <CommunityStory blok={story?.content?.videos_automaticos?.[0]} />
//       )}


//       {/* Lista con sus respectivos videos reproducidos en un popup*/}
//       {story?.content?.video_popup && (
//         <VideoTutorial blok={story?.content?.video_popup?.[0]} />
//       )}


//       {/*Instagram */}
//       {story?.content?.instagram_post && (
//         <Instagram blok={story?.content?.instagram_post?.[0]} />
//       )}

//       {/**Footer */}
//       {story?.content?.footer && (
//         <Footer blok={story?.content?.footer?.[0]} />
//       )}



//       {/* <WhatNew /> */}

//     </>
//   );
// }





import { getStoryblokApi } from '@/lib/storyblok';
import { StoryblokStory } from '@storyblok/react/rsc';
import HomeClient from './HomeClient';

export default async function Home() {
  const { data } = await fetchData();

  return (
    <div className="page">
      <HomeClient story={data.story} />
    </div>
  );
}

export async function fetchData() {
  const storyblokApi = getStoryblokApi();
  
  // Determinar la versión basado en el ambiente
  const version = process.env.VERCEL_ENV === 'production' 
    ? 'published' 
    : 'draft';
  
  
  return await storyblokApi.get(`cdn/stories/home`, { 
    version: version,
    ...(version === 'published' && { cache: 'no-cache' })
  });

}

// import { getStoryblokApi } from '@/lib/storyblok';
// import { StoryblokStory } from '@storyblok/react/rsc';
// import HomeClient from './HomeClient';

// export default async function Home() {
//   const { data } = await fetchData();

//   return (
//     <div className="page">
//       <HomeClient story={data.story} />
//     </div>
//   );
// }

// export async function fetchData() {
//   const storyblokApi = getStoryblokApi();
//   return await storyblokApi.get(`cdn/stories/home`, { version: 'draft' });


// }
