import { Seed } from "@bladwijzer/common/src/models/Seed";

export interface Bed {
  notes: string | readonly string[] | number | undefined;
  id?: number;
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
