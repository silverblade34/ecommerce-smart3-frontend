import { Profile } from "@/lib/interfaces/profile";
import { create } from "zustand";

interface AuthState {
  modal: boolean;
  loading: boolean;
  handleModal: () => void;
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  modal: false,
  loading: false,
  handleModal: () =>
    set((state) => {
      Object.keys(localStorage).forEach(key => {
        if (key !== "list-filter") {
          localStorage.removeItem(key);
        }
      });
      return { modal: !state.modal };
    }), profile: null,
  setProfile: (profile) => set({ profile }),
}));

export default useAuthStore;
