import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Bed } from "@bladwijzer/common/src/models/Bed";

interface BedStore {
  beds: Bed[];
  addBed: (bed: Bed) => void;
  updateBed: (bed: Bed) => void;
}

export const useBedStore = create<BedStore>()(
  devtools(
    persist(
      (set) => ({
        beds: [],
        addBed: (bed) => set((state) => ({ beds: [...state.beds, bed] })),
        updateBed: (bed) =>
          set((state) => ({
            beds: state.beds.map((b) => (b.id === bed.id ? bed : b)),
          })),
      }),
      { name: "bedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
