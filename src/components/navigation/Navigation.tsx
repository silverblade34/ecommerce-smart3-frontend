import { Vista } from "@/lib/interfaces/profile";
import clsx from "clsx";
import NavItem from "./NavItem";

type Props = {
  navigation: Vista[];
  desktopSidebarOpen: boolean;
  closeSidebar: () => void;  // Añade esta prop
};

const Navigation = ({ navigation, desktopSidebarOpen, closeSidebar }: Props) => {
  return (
    <div className="flex h-full w-full">
      <nav className={clsx("mx-auto mt-10 flex w-full flex-col px-5 text-secondary_sokso")}>
        {navigation.map((item) => (
          <NavItem
            key={item._id}
            item={item}
            desktopSidebarOpen={desktopSidebarOpen}
            closeSidebar={closeSidebar}  // Pasamos la función aquí
          />
        ))}
      </nav>
    </div>
  );
};
export default Navigation;
