export interface Seed {
  id: number;
  sowFrom?: Month;
  sowTill?: Month;
  plantFrom?: Month;
  plantTill?: Month;
  harvestFrom?: Month;
  harvestTill?: Month;
  expirationDate?: string;
  url?: string;
  plantHeight?: PlantHeight;
  plantDistance?: number;
  numberOfSeedsPerGridCell: number;
  name: string;
  variety?: string;
  daysToMaturity?: number;
  quantity?: number;
  notes?: string;
  tags?: string[];
  // photo?: File | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface SeedDTO extends Seed {
  tags: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum PlantHeight {
  Short = "Short",
  Medium = "Medium",
  Tall = "Tall",
  Huge = "Huge",
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
