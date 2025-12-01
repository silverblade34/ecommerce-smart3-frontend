import ModalCart from "@/components/cart/ModalCart";
import ResetPasswordModal from "@/components/layout/auth/ResetPasswordModal";
import MenuTop from "@/components/layout/MenuTop";
import ModalAuth from "@/components/layout/ModalAuth";
import ProviderAuth from "@/components/providers/ProviderAuth";
import { ProviderToast } from "@/components/providers/ProviderToast";
import ProviderUI from "@/components/providers/ProviderUI";
import "@/styles/styles.scss";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SessionManager } from "@/components/layout/auth/SessionManager";
import DuplicadosModal from "./(dashboard)/dashboard/modal";
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import ModalMigracion from "@/components/modals/ModalMigracion";
import WhatsappButton from "@/components/common/WhatsappButton";
import { PWARegistration } from "@/components/PWARegistration";
import { InstallPromptBanner } from "@/components/InstallPromptBanner";
import { PWABannerWrapper } from "@/components/PWABannerWrapper";
import SessionRefresher from "@/hooks/useTokenRefresh";

import StoryblokProvider from "@/components/StoryblokProvider";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "Sokso Smart | Plataforma de Pedidos de Sokso",
  description:
    "Sokso Smart de Sokso es la plataforma digital exclusiva para promotoras y empresarias de Sokso, que permite gestionar pedidos de calzado, ropa y accesorios de manera rápida y sencilla.",
  keywords: [
    "Sokso smart",
    "plataforma sokso",
    "estrellas",
    "directoras",
    "pedidos sokso",
    "catálogos sokso",
    "pedido",
    "nuevos lanzamientos",
    "smart sokso",
    "calzados sokso",
  ],
  authors: [{ name: "Sokso Catálogos" }],
  openGraph: {
    title: "Sokso Smart – Tu Negocio en Línea con Sokso",
    description:
      "Smart Sokso es la plataforma digital exclusiva para promotoras y empresarias de Sokso, que permite gestionar pedidos de calzado, ropa y accesorios de manera rápida y sencilla.",
    url: "https://smart.sokso.com/",
    type: "website",
  },
  alternates: {
    canonical: "https://smart.sokso.com/",
  },
  verification: {
    google: "hXgvFcuu7Md-vIQNvfKhEsbUsbN-Qq8QA642PpjxlO4",
  },
  manifest: "/manifest.json?v=2",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sokso Smart",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/android/android-launchericon-192-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/android/android-launchericon-512-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/images/isotipo_sokso.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoryblokProvider>
      <html lang="es">
        <head>
          {/* Google Tag Manager */}
          <GoogleTagManager gtmId={process.env.G_TAG_MANAGER_ID || ''} />

        {/* Responsive */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#8331A7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sokso Smart" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-startup-image" href="/images/isotipo_sokso.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWARegistration />
        <InstallPromptBanner />
        <ProviderAuth>
          <SessionManager />
          <ProviderUI>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.G_TAG_MANAGER_ID}`}
                height='0'
                width='0'
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
            {/* Wrapper inteligente: padding solo si NO es PWA */}
            <PWABannerWrapper>
              <MenuTop />
            </PWABannerWrapper>
            {children}
            {/* <Footer /> */}
            <ModalAuth />
            <DuplicadosModal />
            <ModalCart />
            <ProviderToast />
            <ResetPasswordModal />
           <SessionRefresher />
            <div id="cookie-consent-container"></div>
          </ProviderUI>
          <ModalMigracion />
        </ProviderAuth>
      </body>

        <GoogleAnalytics gaId={process.env.G_ANALYTICS_ID || ''} />
      </html>
    </StoryblokProvider>
  );
}
