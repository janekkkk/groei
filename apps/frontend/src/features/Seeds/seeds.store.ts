import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Seed } from "@bladwijzer/common/src/models/Seed";

interface SeedStore {
  seeds: Seed[];
  addSeed: (seed: Seed) => void;
  updateSeed: (seed: Seed) => void;
}

export const useSeedStore = create<SeedStore>()(
  devtools(
    persist(
      (set) => ({
        seeds: [],
        addSeed: (seed) => set((state) => ({ seeds: [...state.seeds, seed] })),
        updateSeed: (seed) =>
          set((state) => ({
            seeds: state.seeds.map((s) => (s.id === seed.id ? seed : s)),
          })),
      }),
      { name: "seedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
