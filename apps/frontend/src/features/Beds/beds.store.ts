import type { Bed } from "@groei/common/src/models/Bed";
import { create } from "zustand";

interface BedStore {
  beds: Bed[];
  setBeds: (beds: Bed[] | ((prev: Bed[]) => Bed[])) => void;
  updateBed: (bed: Bed) => void;
  removeBed: (id: string) => void;
}

export const useBedStore = create<BedStore>((set) => ({
  beds: [],
  setBeds: (beds) =>
    set((state) => ({
      beds: typeof beds === "function" ? beds(state.beds) : beds,
    })),
  updateBed: (bed) =>
    set((state) => ({
      beds: state.beds.map((b) => (b.id === bed.id ? bed : b)),
    })),
  removeBed: (id) =>
    set((state) => ({
      beds: state.beds.filter((b) => b.id !== id),
    })),
}));
