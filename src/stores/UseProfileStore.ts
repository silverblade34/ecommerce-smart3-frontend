// stores/useProfileStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Profile } from "@/lib/interfaces/profile";

interface ProfileStore {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;

}

const useProfileStore = create<ProfileStore>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
   
    }),
    {
      name: "profile-storage",
    }
  )
);

export default useProfileStore;