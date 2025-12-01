"use client";
import { sidebarDefaultAnimation } from "@/animations/sidebarAnimation";
import useSidebarStore from "@/context/navigation/sidebar";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Navigation from "./Navigation";

const Sidebar = () => {
  const { sidebar, hover, setHover , setMobile } = useSidebarStore();
  const { data: session, status } = useSession();
  const closeModalCart = () => {
    setMobile(false);
  };
  return (
    <motion.div
      className={clsx(
        "flex h-full flex-col bg-white shadow-lg",
        sidebar ? "w-[18rem]" : "w-[4rem]"
      )}
      onMouseEnter={() => !sidebar && setHover(true)}
      onMouseLeave={() => !sidebar && setHover(false)}
      {...sidebarDefaultAnimation(sidebar)}
    >
      {status === "authenticated" && (
        <AnimatePresence mode="wait">
          {hover && !sidebar ? (
            <motion.div
              key="expanded"
              className="fixed z-40 flex h-screen flex-col bg-white shadow-xl"
              initial={{ width: "4rem", x: 0 }}
              animate={{ width: "16rem", x: 0 }}
              exit={{ width: "4rem", x: 0 }}
              transition={{
                width: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <Navigation
                desktopSidebarOpen={true}
                navigation={session?.user.vistas}
                closeSidebar={closeModalCart}
              />
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Navigation
                desktopSidebarOpen={sidebar}
                navigation={session?.user.vistas}
                closeSidebar={closeModalCart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};
export default Sidebar;
