import type { Seed } from "@groei/common/src/models/Seed";
import { create } from "zustand";

interface SeedStore {
  seeds: Seed[];
  setSeeds: (seeds: Seed[] | ((prev: Seed[]) => Seed[])) => void;
  updateSeed: (seed: Seed) => void;
  removeSeed: (id: string) => void;
}

export const useSeedStore = create<SeedStore>((set) => ({
  seeds: [],
  setSeeds: (seeds) =>
    set((state) => ({
      seeds: typeof seeds === "function" ? seeds(state.seeds) : seeds,
    })),
  updateSeed: (seed) =>
    set((state) => ({
      seeds: state.seeds.map((s) => (s.id === seed.id ? seed : s)),
    })),
  removeSeed: (id) =>
    set((state) => ({
      seeds: state.seeds.filter((s) => s.id !== id),
    })),
}));
