import { ArrowLeft, Notebook } from "@phosphor-icons/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Breadcrumb = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  return (
    <div className="container flex space-x-3 z-50 relative bg-white pb-10">
      {/* <Link
        prefetch={false}
        href={"/"}
        className="caption1 group flex  items-center justify-center space-x-4 rounded-lg bg-primary_sokso px-4 py-2 text-white hover:underline "
        id="link-to-category"
      >
        <ArrowLeft
          size={16}
          className="hover-group:translate-x-1 transform transition duration-300 ease-in-out group-hover:translate-x-1"
        />
        <span className="text-xs lg:text-sm">Ver todos los productos</span>
      </Link>
       */}
        <button
        onClick={() => router.back()}
        className="caption1 group flex items-center justify-center space-x-4 rounded-lg bg-primary_sokso px-4 py-2 text-white hover:underline"
        id="link-to-category"
      >
        <ArrowLeft
          size={16}
          className="hover-group:translate-x-1 transform transition duration-300 ease-in-out group-hover:translate-x-1"
        />
        <span className="text-xs lg:text-sm">Regresar</span>
      </button>
       {/* <button
        onClick={() => router.back()}
        className="caption1 group flex items-center justify-center space-x-4 rounded-lg bg-primary_sokso px-4 py-2 text-white hover:underline"
        id="link-to-category"
      >
        <ArrowLeft
          size={16}
          className="hover-group:translate-x-1 transform transition duration-300 ease-in-out group-hover:translate-x-1"
        />
        <span className="text-xs lg:text-sm">Ver todos los productos</span>
      </button> */}
      {!isAuthenticated && (
        <Link
          prefetch={false}
          href={`https://sokso.com/catalogos`}
          target="_blank"
          rel="noreferrer"
          className="caption1 group flex  items-center justify-center space-x-4 rounded-lg bg-primary-900 px-4 py-2 text-white hover:underline "
        >
          <Notebook
            size={16}
            className="hover-group:translate-x-1 transform transition duration-300 ease-in-out group-hover:translate-x-1"
          />
          <span className="text-xs lg:text-sm ">Menu catálogos</span>
        </Link>
      )}
    </div>
  );
};

export default Breadcrumb;
