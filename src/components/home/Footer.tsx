

'use client'
import Image from "next/image";
import Link from "next/link";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { useState, useEffect } from "react";

interface FooterLink extends SbBlokData {
  texto: string;
  url: string;
}

interface FooterColumn extends SbBlokData {
  titulo: string;
  link: FooterLink[];
}

interface InfoEmpresa extends SbBlokData {
  correo: string;
  telefono: string;
  direccion: string;
}

interface FooterBlok extends SbBlokData {
  fondo_color: string;
  texto_color: string;
  logo_imagen?: {
    filename: string;
    alt?: string;
  };
  columnas: FooterColumn[];
  info_empresa: InfoEmpresa[];
}

const Footer: React.FC<{ blok: FooterBlok }> = ({ blok }) => {
  const empresa = blok.info_empresa?.[0];
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div
      id="footer"
      className="footer"
      {...storyblokEditable(blok)}
      style={{
        backgroundColor: blok.fondo_color,
        color: blok.texto_color,
      }}
    >
      <div className="footer-main">
        <div className="container">
          <div className="content-footer pb-[10px] flex justify-between flex-wrap gap-y-4">
            <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
              <Link href={'/'} className="logo block mb-4">
                {blok.logo_imagen?.filename ? (
                  <Image
                    src={blok.logo_imagen.filename}
                    alt={blok.logo_imagen.alt || 'Logo'}
                    width={200}
                    height={80}
                    className="object-contain"
                  />
                ) : (
                  <div className="heading4">Sokso</div>
                )}
              </Link>

              {empresa && (
                <div className="flex gap-3 mt-3">
                  <div className="flex flex-col">
                    <span className="text-button">Correo:</span>
                    <span className="text-button mt-3">Teléfono:</span>
                    <span className="text-button mt-3">Dirección:</span>
                  </div>
                  <div className="flex flex-col">
                    <span>{empresa.correo}</span>
                    <span className="mt-3">{empresa.telefono}</span>
                    <span className="mt-3 pt-px">{empresa.direccion}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full md:mt-8 mb-8">
              <div className="list-nav flex justify-center basis-full max-md:flex-col max-md:gap-0 gap-8">
                {blok.columnas?.map((columna) => (
                  <div
                    key={columna._uid}
                    {...storyblokEditable(columna)}
                    className={`
                      item flex flex-col basis-1/3 
                      max-md:basis-full 
                      max-md:border-y
                      max-md:border-gray-600 
                      max-md:pb-4
                      ${isMobile ? 'accordion' : ''}
                    `}
                  >
                    <div
                      className={`
                        text-button-uppercase pb-3 font-bold
                        max-md:flex max-md:justify-between max-md:items-center 
                        max-md:cursor-pointer max-md:py-3
                        ${isMobile ? 'accordion-toggle' : ''}
                      `}
                      onClick={() => isMobile && toggleAccordion(columna._uid || columna.titulo)}
                    >
                      {columna.titulo}
                      {isMobile && (
                        <span className="text-lg font-bold transition-transform duration-300">
                          {activeAccordion === columna._uid ? '−' : '+'}
                        </span>
                      )}
                    </div>

                    <div
                      className={`
                        ${isMobile ? 'accordion-content transition-all duration-300 ease-in-out' : ''}
                        ${isMobile && activeAccordion !== columna._uid ? 'max-md:max-h-0 max-md:overflow-hidden' : 'max-md:max-h-96'}
                        ${!isMobile ? 'block' : ''}
                      `}
                    >
                      {columna.link?.map((lnk) => (
                        <Link
                          key={lnk._uid}
                          href={`${lnk.url}`}
                          className="caption1 has-line-before duration-300 w-fit block pt-2 hover:opacity-70 transition-opacity ml-1.5"
                        >
                          {lnk.texto}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .has-line-before {
          position: relative;
          padding-left: 16px;
        }
        .has-line-before::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 1px;
          width: 8px;
          background-color: currentColor;
        }
        
        @media (max-width: 768px) {
          .accordion-content {
            transition: max-height 0.3s ease-out;
          }
        }
      `}</style>
    </div>
  );
};

export default Footer;