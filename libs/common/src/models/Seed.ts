export interface Seed {
  id: string;
  name: string;
  variety?: string;
  numberOfSeedsPerGridCell: number;
  germinationType: GerminationType;
  sowFrom?: Month;
  sowTill?: Month;
  plantFrom?: Month;
  plantTill?: Month;
  harvestFrom?: Month;
  harvestTill?: Month;
  expirationDate?: string;
  url?: string;
  plantHeight?: PlantHeight;
  daysToMaturity?: number;
  preSprout?: boolean;
  perennial?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export type SeedDTO = Seed;

export enum GerminationType {
  COLD = "Cold",
  WARM = "Warm",
  DARK = "Dark",
  LIGHT = "Light",
}

export enum PlantHeight {
  SHORT = "SHORT",
  MEDIUM = "MEDIUM",
  TALL = "TALL",
  CLIMBER = "CLIMBER",
}

export enum Month {
  January = "January",
  February = "February",
  March = "March",
  April = "April",
  May = "May",
  June = "June",
  July = "July",
  August = "August",
  September = "September",
  October = "October",
  November = "November",
  December = "December",
}
