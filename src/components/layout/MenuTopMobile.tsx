import useMenuStore from "@/context/config/menu-store";
import { categoriasData, generosData, tiposData } from "@/lib/data/menu-data";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoIcon } from "../common/icons/LogoIcon";

const MenuTopMobile = () => {
  const { open, handleModal } = useMenuStore();
  const pathname = usePathname();
  const [openSubNavMobile, setOpenSubNavMobile] = useState<number | null>(null);

  const handleOpenSubNavMobile = (index: number) => {
    if (openSubNavMobile === index) {
      setOpenSubNavMobile(null);
    } else {
      setOpenSubNavMobile(index);
    }
  };

  return (
    <div id="menu-mobile" className={`${open ? "open" : ""}`}>
      <div className="menu-container bg-white h-full">
        <div className="container h-full">
          <div className="menu-main h-full overflow-hidden">
            <div className="heading py-2 relative flex items-center justify-center">
              <div
                className="close-menu-mobile-btn absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
                onClick={handleModal}
              >
                <X size={14} />
              </div>
              <Link
                prefetch={false}
                href={"/"}
                className="logo text-3xl font-semibold text-center"
              >
                <LogoIcon />
              </Link>
            </div>
            <div className="form-search relative mt-2">
              <MagnifyingGlass
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer"
              />
              <input
                type="text"
                placeholder="Buscar productos..."
                className=" h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4"
              />
            </div>
            <div className="list-nav mt-6">
              <ul>
                <li
                  className={`${openSubNavMobile === 1 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(1)}
                >
                  <a
                    href={"#!"}
                    className={`text-xl font-semibold flex items-center justify-between`}
                  >
                    Géneros
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </a>
                  <div className="sub-nav-mobile">
                    <div
                      className="back-btn flex items-center gap-3"
                      onClick={() => handleOpenSubNavMobile(1)}
                    >
                      <CaretLeft />
                      Atras
                    </div>
                    <div className="list-nav-item w-full grid grid-cols-2 pt-2 pb-6">
                      <ul>
                        {generosData.map(({ link, title, id }) => (
                          <li key={id}>
                            <Link
                              prefetch={false}
                              href={link}
                              className={`nav-item-mobile text-secondary duration-300 ${pathname === "/homepages/marketplace"
                                ? "active"
                                : ""
                                }`}
                            >
                              {title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>

                <li
                  className={`${openSubNavMobile === 3 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(3)}
                >
                  <a
                    href={"#!"}
                    className="text-xl font-semibold flex items-center justify-between mt-5"
                  >
                    Categorias
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </a>
                  <div className="sub-nav-mobile">
                    <div
                      className="back-btn flex items-center gap-3"
                      onClick={() => handleOpenSubNavMobile(3)}
                    >
                      <CaretLeft />
                      Atras
                    </div>
                    <div className="list-nav-item w-full pt-3 pb-12">
                      <div className="">
                        <ul className="nav-link grid grid-cols-2 gap-5 gap-y-6 justify-between">
                          {categoriasData.map(({ link, title, id }) => (
                            <li key={id}>
                              <Link
                                prefetch={false}
                                href={link}
                                className={`link text-secondary duration-300 ${pathname === "/shop/breadcrumb-img"
                                  ? "active"
                                  : ""
                                  }`}
                              >
                                {title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
                <li
                  className={`${openSubNavMobile === 2 ? "open" : ""}`}
                  onClick={() => handleOpenSubNavMobile(2)}
                >
                  <a
                    href={"#!"}
                    className={`text-xl font-semibold flex items-center justify-between  mt-5`}
                  >
                    Tipos
                    <span className="text-right">
                      <CaretRight size={20} />
                    </span>
                  </a>
                  <div className="sub-nav-mobile">
                    <div
                      className="back-btn flex items-center gap-3"
                      onClick={() => handleOpenSubNavMobile(2)}
                    >
                      <CaretLeft />
                      Atras
                    </div>
                    <div className="list-nav-item w-full grid grid-cols-2 pt-2 pb-6">
                      <ul>
                        {tiposData.map(({ link, title, id }) => (
                          <li key={id}>
                            <Link
                              prefetch={false}
                              href={link}
                              className={`nav-item-mobile text-secondary duration-300 ${pathname === "/homepages/marketplace"
                                ? "active"
                                : ""
                                }`}
                            >
                              {title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTopMobile;
