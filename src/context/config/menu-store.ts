import { create } from "zustand";

interface MenuState {
  open: boolean;
  loading: boolean;
  handleModal: () => void;
}

const useMenuStore = create<MenuState>((set) => ({
  open: false,
  loading: false,
  handleModal: () => set((state) => ({ open: !state.open })),
}));

export default useMenuStore;
