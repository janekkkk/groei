import { Seed } from "@/features/Seeds/seeds.model";

export interface Bed {
  notes: string | readonly string[] | number | undefined;
  id?: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  grid: GridItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GridItem {
  index: number;
  seed?: Seed;
}
