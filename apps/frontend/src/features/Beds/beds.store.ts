import { create } from "zustand";
import { persist, createJSONStorage, devtools } from "zustand/middleware";
import { indexedDbStorage } from "@/core/store/indexedDbStorage";
import { Bed } from "@groei/common/src/models/Bed";

interface BedStore {
  beds: Bed[];
  addBedToStore: (bed: Bed) => void;
  updateBedInStore: (bed: Bed) => void;
  deleteBedFromStore: (id: string) => void;
  setBeds: (beds: Bed[]) => void;
}

export const useBedStore = create<BedStore>()(
  devtools(
    persist(
      (set) => ({
        beds: [],
        addBedToStore: (bed) =>
          set((state) => ({ beds: [...state.beds, bed] })),
        updateBedInStore: (bed: Bed) =>
          set((state) => ({
            beds: state.beds.map((b) => (b.id === bed.id ? bed : b)),
          })),
        deleteBedFromStore: (id: string) =>
          set((state) => ({
            beds: state.beds.filter((b) => b.id !== id),
          })),
        setBeds: (beds) => set({ beds }),
      }),
      { name: "bedStore", storage: createJSONStorage(() => indexedDbStorage) },
    ),
  ),
);
