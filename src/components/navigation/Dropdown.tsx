import { Vista } from "@/lib/interfaces/profile";
import { CaretRight } from "@phosphor-icons/react";
import clsx from "clsx";
import NavIcon from "./NavIcon";
import NavItem from "./NavItem";

type Props = {
  item: Vista;
  isOpen: boolean;
  toggleDropdown: () => void;
  childrenItems: Vista[];
  desktopSidebarOpen: boolean;
  closeSidebar: () => void;  // Añade esta línea
};

const Dropdown = ({
  item,
  isOpen,
  toggleDropdown,
  childrenItems,
  desktopSidebarOpen,
  closeSidebar
}: Props) => {
  return (
    <>
      {desktopSidebarOpen ? (
        <div className="space-y-1">
          <button
            className={clsx(
              "flex w-full items-center justify-between rounded-lg px-4 py-2",
              "text-gray-700 hover:bg-primary/10 hover:text-primary",
              "transition-colors duration-200",
              isOpen && "bg-primary/5"
            )}
            onClick={toggleDropdown}
          >
            <div className="flex items-center gap-2">
              <NavIcon iconName={item.sIcono} />
              <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                {item.sNombre}
              </span>
            </div>
            <span
              className="transition-transform duration-200"
              style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0)" }}
            >
              <CaretRight size={16} />
            </span>
          </button>

          <div
            className={clsx(
              "overflow-hidden transition-all duration-200",
              isOpen ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="space-y-1 pl-4">
              {childrenItems.map((childItem) => (
                <NavItem
                  key={childItem._id}
                  item={childItem}
                  desktopSidebarOpen={desktopSidebarOpen}
                  closeSidebar={closeSidebar}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <NavIcon iconName={item.sIcono} size={27} />
        </div>
      )}
    </>
  );
};

export default Dropdown;
