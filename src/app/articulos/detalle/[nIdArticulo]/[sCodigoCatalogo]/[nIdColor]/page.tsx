"use client";

import { useDetalleProducto } from "@/hooks/useDetalleProducto";
import clsx from "clsx";
import { useParams } from "next/navigation";
import Breadcrumb from "./components/Breadcrumb";
import VariantProduct from "./components/detail/VariantProduct";
import VariantGratuito from "./components/detail/VariantGratuito";
import VariantShowroom from "./components/detail/VariantShowroom";
import ImageProduct from "./components/image/ImageProduct";
import DescriptionProduct from "./components/detail/DescriptionProduct";
import ModalActivo from "./components/ModalActivo";
import ModalOferta from "./components/ModalOferta";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/pagination";
import { useSession } from "next-auth/react";
import SkeletonProduct from "@/components/common/skeleton/SkeletonProduct";
import VariantPremio from "./components/detail/VariantPremio";

export default function ArticuloDetailPage() {
  const { nIdArticulo, nIdColor, sCodigoCatalogo } = useParams<{
    nIdArticulo: string;
    nIdColor: string;
    sCodigoCatalogo: string;
  }>();


  const {
    // recomendaciones,
    // isLoadingRecomendaciones,
    producto,
    setTallaSeleccionada,
    tallaSeleccionada,
    modal,
    handleModal,
    handleModalOferta,
    modalOferta,
    isLoading
  } = useDetalleProducto(
    nIdArticulo || "",
    nIdColor || "",
    sCodigoCatalogo || ""
  );
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Verificar los parámetros después de llamar al hook
  if (!nIdArticulo || !nIdColor || !sCodigoCatalogo) {
    return null;
  }
  console.log(producto)

  console.log("producto", producto?.catalogo?.sTipoCatalogo.toUpperCase())
  return (

    <main className={clsx("product-detail grouped")}>

      {isLoading ? (
        <SkeletonProduct />
      ) : (
        <>
          <Breadcrumb />

          <article className="featured-product underwear pb-10  ">
            <div className="container flex flex-wrap justify-between gap-y-6">
              {producto && <ImageProduct variant={producto} />}

              {/*TIPOS : REGULAR - CYBER - PREVENTA - PREMIOS - SHOWROOM - PREVENTA CATALOGO - CATALOGO GRATUITO */}

              {/* SIN LA OPCION DE HACER PEDIDOS */}
              {producto && producto.catalogo?.sTipoCatalogo.toUpperCase() === "PREMIOS" && (
                <VariantPremio
                  product={producto}
                  tallaSeleccionada={tallaSeleccionada}
                  setTallaSeleccionada={setTallaSeleccionada}
                />
              )}

              {(producto && producto.catalogo?.sTipoCatalogo.toUpperCase() == "REGULAR" ||
                producto && producto.catalogo?.sTipoCatalogo.toUpperCase() == "CYBER" ||
                producto && producto.catalogo?.sTipoCatalogo.toUpperCase() == "PREVENTA" ||
                producto && producto.catalogo?.sTipoCatalogo.toUpperCase() == "PREVENTA CATALOGO"
              ) &&
                (
                  <VariantProduct
                    product={producto}
                    tallaSeleccionada={tallaSeleccionada}
                    setTallaSeleccionada={setTallaSeleccionada}
                  />
                )}

                {(
                producto && producto.catalogo?.sTipoCatalogo.toUpperCase() == "SHOWROOM" 
              ) &&
                (
                  <VariantShowroom
                    product={producto}
                    tallaSeleccionada={tallaSeleccionada}
                    setTallaSeleccionada={setTallaSeleccionada}
                  />
                )}

              {/*SE PIDE COMO MAXIMO UNA UNIDAD */}
              {producto && producto.catalogo?.sTipoCatalogo.toUpperCase() === "GRATIS" && (
                <VariantGratuito
                  product={producto}
                  tallaSeleccionada={tallaSeleccionada}
                  setTallaSeleccionada={setTallaSeleccionada}
                />
              )}



            </div>
          </article>

          <div className="z-50 relative bg-white pb-10">
            {(producto && producto?.catalogo?.sTipoCatalogo.toUpperCase() != "GRATIS" &&
              producto && producto?.catalogo?.sTipoCatalogo.toUpperCase() != "PREMIOS" &&
              producto && producto?.catalogo?.sTipoCatalogo.toUpperCase() != "PREVENTA CATALOGO"
            ) && (
                <DescriptionProduct
                  detallesAdicionales={producto.detallesAdicionales}
                />
              )}
          </div>


          {/**RECOMENDACIONES */}
          {!isAuthenticated && (
            producto && producto.alternativeInfo && (
              <ModalActivo
                modal={modal}
                handleModal={handleModal}
                producto={producto}
              />
            )
          )}
          {!isAuthenticated && (
            producto && producto.proximaOferta && (
              <ModalOferta
                modal={modalOferta}
                handleModal={handleModalOferta}
                producto={producto}
              />
            )
          )}
        </>
      )}
    </main>
  );
}
