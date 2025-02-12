import { Seed } from "./Seed.ts";

export interface Bed {
  notes: string | readonly string[] | number | undefined;
  id: string;
  name: string;
  gridWidth: number;
  gridHeight: number;
  grid: GridItem[];
  sowDate?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface BedDTO extends Bed {
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface GridItem {
  index: number;
  seed?: Seed;
}

export interface GridItemDTO extends GridItem {
  bedId: string;
  seedId?: string;
}
