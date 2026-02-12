import type { Bed } from "@groei/common/src/models/Bed.ts";
import type { Seed } from "@groei/common/src/models/Seed.ts";

export function validateBedData(bedData: Partial<Bed>) {
  if (!bedData.name || typeof bedData.name !== "string") {
    throw new Error("Bed name is required and must be a string");
  }
  if (
    bedData.gridWidth !== undefined &&
    (!Number.isInteger(bedData.gridWidth) || bedData.gridWidth <= 0)
  ) {
    throw new Error("Grid width must be a positive integer");
  }
  if (
    bedData.gridHeight !== undefined &&
    (!Number.isInteger(bedData.gridHeight) || bedData.gridHeight <= 0)
  ) {
    throw new Error("Grid height must be a positive integer");
  }
}

export function validateSeedData(seedData: Partial<Seed>) {
  if (!seedData.name || typeof seedData.name !== "string") {
    throw new Error("Seed name is required and must be a string");
  }
}
