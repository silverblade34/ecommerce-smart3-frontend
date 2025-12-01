
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

import Page from "@/components/Page";
import BannerTop from "@/components/home/BannerTop";
import SliderFour from "@/components/home/SliderFour";
import FlashSale from "@/components/home/FlashSale";
import Collection from "@/components/home/Collection";
import TrendingNow from "@/components/home/TrendingNow";
import BestSellers from "@/components/home/BestSellers";
import Banner from "@/components/home/Banner";
import PopularProduct from "@/components/home/PopularProduct";
import BannerSeccionados from "@/components/home/BannerSeccionados";
import CommunityStory from "@/components/home/CommunityStory";
import VideoTutorial from "@/components/home/VideoTutorial";
import Instagram from "@/components/home/Instagram";
import Footer from "@/components/home/Footer";




export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_KEY_STORYBLOK,
  use: [apiPlugin],
  apiOptions: {
    region: 'eu',
  },
    bridge: true,
  components: {
    page : Page,
    banner_top_informativo: BannerTop, //banner solo texto
    banner_principal_imagen: SliderFour, //banner principal con imagenes
    cronometro_cuenta_regresiva: FlashSale, //cronometro de cuenta regresiva
    colecciones: Collection, // colecion de verano
    tendencias: TrendingNow, //tendencias actuales
    mas_vendidos: BestSellers, // mas vendidos
    banner_inferior_estatico: Banner, //baner inferios estatico de 2
    productos_populares: PopularProduct, //productos populares con puntos
    seccion_informativa_imagenes: BannerSeccionados, // 3 banner estaticos
    videos_automaticos: CommunityStory, //videos reproducidos auto
    video_popup: VideoTutorial, // video con popup 
    instagram_post : Instagram, // redes sociales
    footer : Footer //footer
  },

});