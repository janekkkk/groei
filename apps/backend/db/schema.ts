import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.ts";

export const usersTable = sqliteTable("users_table", {
  name: text().notNull(),
  email: text().primaryKey().notNull().unique(),
  avatar: text(),
});

export const seedsTable = sqliteTable("seeds_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  sowFrom: text().notNull(),
  sowTill: text(),
  plantFrom: text(),
  plantTill: text(),
  harvestFrom: text(),
  harvestTill: text(),
  expirationDate: text(),
  url: text(),
  plantHeight: int(),
  plantDistance: int(),
  numberOfSeedsPerGridCell: int(),
  variety: text(),
  daysToMaturity: int(),
  quantity: int(),
  notes: text(),
  tags: text(),
  photo: text(),
  ...timestamps,
});
