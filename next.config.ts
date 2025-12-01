import type { NextConfig } from "next";
import path from "path";
const nextConfig: NextConfig = {
  async redirects() {
    return [
      // NOTA: NO redirigir "/" aquí - el middleware se encarga de servir cleanup.html
      // que hace la limpieza de migración y luego redirige a /articulos
      // {
      //   source: '/mantenimiento',
      //   destination: '/articulos',
      //   permanent: false,
      // },
      // {
      //   source: '/',
      //   destination: '/articulos',
      //   permanent: false,
      // }
    ];
  },
  async headers() {
    return [
      // Headers para Service Worker
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      // Headers para manifest.json
      {
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // value: "public, max-age=31536000, immutable",
      // Headers para iconos PWA 
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      // Headers para Digital Asset Links (Google Play Protect verification)
      {
        source: "/.well-known/assetlinks.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
      // {
      //   // Solo aplicar headers de limpieza agresiva en la raíz
      //   source: "/",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      //     },
      //     {
      //       key: "Pragma",
      //       value: "no-cache",
      //     },
      //     {
      //       key: "Expires",
      //       value: "0",
      //     },
      //     {
      //       key: "Clear-Site-Data",
      //       value: '"cache"',
      //     },
      //   ],

      // },
      // {
      //   // Headers para prevenir cache en todas las páginas (excepto assets estáticos)
      //   // La limpieza en "/" se maneja en middleware.ts para evitar conflictos con redirects
      //   source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css)$).*)",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      //     },
      //     {
      //       key: "Pragma",
      //       value: "no-cache",
      //     },
      //     {
      //       key: "Expires",
      //       value: "0",
      //     },
      //   ],
      // },
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    remotePatterns: [
      {
        hostname: "oms-fotos.sokso.com",
        protocol: "https",
      },
      {
        hostname: "oms-fotos-qas.sokso.com",
        protocol: "https",
      },
    ],
    unoptimized: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    dynamicIO: true, // Permite uso dinámico de headers
    serverActions: {
      bodySizeLimit: '80mb',
    },
  },
};

export default nextConfig;

