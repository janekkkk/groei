import { sqliteTable, text, int } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.ts";
import { relations } from "drizzle-orm";

export const usersTable = sqliteTable("users_table", {
  name: text().notNull(),
  email: text().primaryKey().notNull().unique(),
  avatar: text(),
});

export const seedsTable = sqliteTable("seeds_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  sowFrom: text(),
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

export const bedTable = sqliteTable("bed_table", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text(),
  gridWidth: int(),
  gridHeight: int(),
  ...timestamps,
});

export const bedRelations = relations(bedTable, ({ many }) => ({
  grid: many(gridItemTable),
}));

export const gridItemTable = sqliteTable("grid_item_table", {
  id: int().primaryKey({ autoIncrement: true }),
  index: int().notNull(),
  ...timestamps,
});

export const gridRelations = relations(gridItemTable, ({ one }) => ({
  gridItem: one(bedTable, {
    fields: [gridItemTable.id],
    references: [bedTable.id],
  }),
}));
