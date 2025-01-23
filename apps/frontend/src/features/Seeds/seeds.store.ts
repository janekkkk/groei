import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Seed } from "@bladwijzer/common/src/models/Seed";

interface SeedStore {
  seeds: Seed[];
  addSeedToStore: (seed: Seed) => void;
  updateSeedInStore: (seed: Seed) => void;
  deleteSeedFromStore: (id: number) => void;
  setSeeds: (seeds: Seed[]) => void;
}

export const useSeedStore = create<SeedStore>()(
  devtools(
    persist(
      (set) => ({
        seeds: [],
        addSeedToStore: (seed) =>
          set((state) => ({ seeds: [...state.seeds, seed] })),
        updateSeedInStore: (seed: Seed) =>
          set((state) => ({
            seeds: state.seeds.map((s) => (s.id === seed.id ? seed : s)),
          })),
        deleteSeedFromStore: (id: number) =>
          set((state) => ({
            seeds: state.seeds.filter((s) => s.id !== id),
          })),
        setSeeds: (seeds) => set({ seeds }),
      }),
      { name: "seedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
