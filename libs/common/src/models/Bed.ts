import type { Seed } from "./Seed.ts";

export interface Bed {
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  grid: GridItem[];
  description?: string;
  sowDate?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type BedDTO = Bed;

export interface GridItem {
  index: number;
  seed?: Seed;
}
