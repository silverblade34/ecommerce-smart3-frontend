"use client";

import React from "react";
import Link from "next/link";
import { LogoIcon } from "../common/icons/LogoIcon";
import { ArrowRight, Phone } from "@phosphor-icons/react";

const NAV_ITEMS = [
  {
    title: "Información",
    links: [
      { label: "Contactanos", href: "/pages/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Preguntas Frecuentes", href: "/pages/faqs" },
    ],
  },
  {
    title: "Categorías",
    links: [
      { label: "Ropa", href: "/shop/breadcrumb1" },
      { label: "Calzado", href: "/shop/breadcrumb1" },
      { label: "Accesorios", href: "/shop/breadcrumb1" },
      { label: "Niños", href: "/shop/breadcrumb1" },
    ],
  },
  {
    title: "Servicios al cliente",
    links: [
      { label: "Política de devoluciones", href: "/pages/faqs" },
      { label: "Política de privacidad", href: "/pages/faqs" },
      { label: "Política de cookies", href: "/pages/faqs" },
      { label: "Política de envío", href: "/order-tracking" },
    ],
  },
];

const SOCIAL_LINKS = [
  { iconClass: "icon-facebook", href: "https://www.facebook.com/" },
  { iconClass: "icon-instagram", href: "https://www.instagram.com/" },
  { iconClass: "icon-twitter", href: "https://www.twitter.com/" },
  { iconClass: "icon-youtube", href: "https://www.youtube.com/" },
  { iconClass: "icon-pinterest", href: "https://www.pinterest.com/" },
];

const Footer = () => {
  return (
    <footer id="footer" className="footer">
      <section className="footer-main bg-surface">
        <div className="container">
          <article className="content-footer py-[60px] flex justify-between flex-wrap gap-y-8">
            <section className="company-infor basis-1/4 max-lg:basis-full pr-7">
              <Link prefetch={false} href="/articulos" className="logo">
                <LogoIcon />
              </Link>
              <address className="flex gap-3 mt-3 not-italic">
                <p className="flex items-center">
                  <Phone className="mr-2 w-5 h-5" /> <span>(01) 706 2906</span>
                </p>
              </address>
            </section>

            <nav
              className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full"
              aria-label="Footer Navigation"
            >
              <section className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                {NAV_ITEMS.map((section, index) => (
                  <article className="item flex flex-col basis-1/3" key={index}>
                    <h2 className="text-button-uppercase pb-3">
                      {section.title}
                    </h2>
                    <ul>
                      {section.links.map((link, idx) => (
                        <li key={idx} className="pt-2">
                          <Link
                            prefetch={false}
                            className="caption1 has-line-before duration-300 w-fit"
                            href={link.href}
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </section>

              <section className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                <h2 className="text-button-uppercase">Mi negocio</h2>
                <p className="caption1 mt-3">
                  Afíliate con nosotros y gana comisiones por cada venta
                </p>
                <div className="flex w-full mt-4">
                  <Link
                    prefetch={false}
                    href="https://minegocio.sokso.com/"
                    className="button-main flex items-center justify-center gap-2 md:mt-8 mt-3"
                  >
                    <span>Afiliarme</span>
                    <ArrowRight size={16} color="#fff" />
                  </Link>
                </div>
                <ul className="list-social flex items-center gap-6 mt-4">
                  {SOCIAL_LINKS.map((social, idx) => (
                    <li key={idx}>
                      <Link prefetch={false} href={social.href} target="_blank">
                        <span
                          className={`${social.iconClass} text-2xl text-black`}
                        ></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            </nav>
          </article>

          <section className="footer-bottom py-3 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
            <div className="left flex items-center gap-8">
              <p className="copyright caption1 text-secondary">
                ©2025 Sokso. Todos los derechos reservados.
              </p>
            </div>
          </section>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
