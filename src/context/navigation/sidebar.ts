import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface SidebarStore {
  sidebar: boolean;
  hover: boolean;
  mobile: boolean;
  setHover: (isHover: boolean) => void;
  setSidebar: (isOpen: boolean) => void;
  setMobile: (isMobile: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      sidebar: false,
      hover: false,
      setHover: (isHover: boolean) => set({ hover: isHover }),
      setSidebar: (isOpen: boolean) => set({ sidebar: isOpen }),
      mobile: false,
      setMobile: (isMobile: boolean) => set({ mobile: isMobile }),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ sidebar: state.sidebar }),
    }
  )
);

export default useSidebarStore;
