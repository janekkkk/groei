import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Seed } from "@/features/Seeds/seeds.model";

interface BedStore {
  seeds: Seed[];
  addSeed: (seed: Seed) => void;
}

export const useSeedStore = create<BedStore>()(
  devtools(
    persist(
      (set) => ({
        seeds: [],
        addSeed: (seed) => set((state) => ({ seeds: [...state.seeds, seed] })),
      }),
      { name: "seedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
