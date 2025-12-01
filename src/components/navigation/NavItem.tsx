import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import Dropdown from "./Dropdown";
import NavIcon from "./NavIcon";
import { Vista } from "@/lib/interfaces/profile";
import { useSession } from "next-auth/react";
import useAuthStore from "@/context/user/auth-store";

type Props = {
  item: Vista;
  desktopSidebarOpen: boolean;
  closeSidebar: () => void;  // Añade esta prop
};

  const NavItem = ({ item, desktopSidebarOpen, closeSidebar }: Props) => {
  const { profile } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);


  const CD = profile?.cliente?.directora?.centroModa?.sNombreComercial;
  const nIdCliente = profile?.cliente?.nIdCliente;

  // const nIdDirectora = localStorage.getItem("nIdDirectora");
  const { data: session } = useSession()


  return (
    <div className={clsx(
      "transition-all duration-200 overflow-hidden",
      item.children
        ? "pb-2 pl-0"
        : "my-2 rounded-lg hover:bg-primary/10 active:bg-primary/20"
    )}>
      {item.children ? (
        <Dropdown
          item={item}
          isOpen={isOpen}
          toggleDropdown={() => setIsOpen((prev) => !prev)}
          childrenItems={item.children}
          desktopSidebarOpen={desktopSidebarOpen}
          closeSidebar={closeSidebar}
        />
      ) : (
        <>
          {desktopSidebarOpen ? (
            <>
              {
                //68c42f7ecd804209e7df1058 es Cuenta Corriente /  68c04eb0a886b01050f6c2fb es premios / 68cd5ed822575733be68e510 listado de estrellas
                item._id == "68c04eb0a886b01050f6c2fb" || item._id == "68c42f7ecd804209e7df1058" && item.sUrl || item._id == "68cd5ed822575733be68e510" ?
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    prefetch={false}
                    href={
                      item.sUrl +
                      (item._id === "68c42f7ecd804209e7df1058"
                        ? "?nIdDirectora=" + nIdCliente :
                        item._id === "68cd5ed822575733be68e510" ?
                          "?nIdCliente=" + nIdCliente :
                          "?usuario=" + CD)
                    }
                    className={clsx("block py-2 px-4")}
                    onClick={closeSidebar}
                  >
                    <div className="flex justify-start  items-center gap-3 text-gray-700 hover:text-primary">
                      <NavIcon iconName={item.sIcono} size={18} />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {item.sNombre}
                      </span>
                    </div>
                  </Link>
                  :

                  item.sUrl ? (
                    <Link
                      prefetch={false}
                      href={item.sUrl}
                      className={clsx("block py-2 px-4")}
                      onClick={closeSidebar}  // Aquí cerramos el sidebar
                    >
                      <div className="flex justify-start  items-center gap-3 text-gray-700 hover:text-primary">
                        <NavIcon iconName={item.sIcono} size={18} />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.sNombre}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className={clsx("block py-2 px-4")}>
                      <div className="flex justify-start items-center gap-3 text-gray-700 hover:text-primary">
                        <NavIcon iconName={item.sIcono} size={18} />
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.sNombre}
                        </span>
                      </div>
                    </div>
                  )}
            </>
          ) : (
            <div className="flex justify-left">
              <NavIcon iconName={item.sIcono} size={27} />
            </div>
          )}
        </>
      )
      }
    </div >
  );
};

export default NavItem;
