// import { Suspense } from "react";
// import Loading from "../loading";
// import { notFound } from "next/navigation";
// import ProductList from "../components/ProductList";


// export const dynamic = "force-dynamic";
// export default function ArticulosPage() {
//   return (
//     <div className="mx-auto flex max-w-7xl flex-col w-full">
//       <Suspense fallback={<Loading />}>
//         <ProductListContent />
//       </Suspense>
//     </div>
//   );
// }
// async function ProductListContent() {
//   try {
//     return  <ProductList />;
//   } catch (error) {
//     console.error("Error al obtener el filtro del producto:", error);
//     return notFound();
//   }
// }


import { Suspense } from "react";
import Loading from "../loading";
import ProductList from "../components/ProductList";

// export const dynamic = "force-dynamic";

export default function ArticulosPage({ params }: { params?: { slug?: string[] } }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col w-full">
      <Suspense fallback={<Loading />}>
        <ProductList params={params} />
      </Suspense>
    </div>
  );
}