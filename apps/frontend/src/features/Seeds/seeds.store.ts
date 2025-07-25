import type { Seed } from "@groei/common/src/models/Seed";
import { create } from "zustand";
import { devtools, type PersistStorage, persist } from "zustand/middleware";
import { indexedDBStorage } from "@/core/store/indexedDbStorage";

interface SeedStore {
  seeds: Seed[];
  addSeedToStore: (seed: Seed) => void;
  updateSeedInStore: (seed: Seed) => void;
  deleteSeedFromStore: (id: string) => void;
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
        deleteSeedFromStore: (id: string) =>
          set((state) => ({
            seeds: state.seeds.filter((s) => s.id !== id),
          })),
        setSeeds: (seeds) => set({ seeds }),
      }),
      {
        name: "seedStore",
        storage: indexedDBStorage as unknown as PersistStorage<SeedStore>,
      },
    ),
  ),
);
