import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Bed } from "./beds.model";

interface BedStore {
  beds: Bed[];
  addBed: (bed: Bed) => void;
}

export const useBedStore = create<BedStore>()(
  devtools(
    persist(
      (set) => ({
        beds: [],
        addBed: (bed) => set((state) => ({ beds: [...state.beds, bed] })),
      }),
      { name: "bedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
