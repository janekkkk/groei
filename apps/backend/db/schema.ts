import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { timestamps } from "./helpers.ts";

export const usersTable = sqliteTable("users_table", {
  name: text().notNull(),
  email: text().primaryKey().notNull(),
  avatar: text(),
});

export const seedsTable = sqliteTable("seeds_table", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text().notNull(),
  germinationType: text(),
  preSprout: integer({ mode: "boolean" }),
  sowFrom: text(),
  sowTill: text(),
  plantFrom: text(),
  plantTill: text(),
  harvestFrom: text(),
  harvestTill: text(),
  expirationDate: text(),
  url: text(),
  plantHeight: text(),
  plantDistance: integer(),
  numberOfSeedsPerGridCell: integer(),
  variety: text(),
  daysToMaturity: integer(),
  quantity: integer(),
  notes: text(),
  tags: text(),
  photo: text(),
  ...timestamps,
});

export const gridItemTable = sqliteTable("grid_item_table", {
  id: integer().notNull().primaryKey({ autoIncrement: true }),
  bedId: text().references(() => bedTable.id),
  seedId: text().references(() => seedsTable.id),
});

export const bedTable = sqliteTable("bed_table", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text().notNull(),
  description: text(),
  sowDate: text(),
  gridWidth: integer(),
  gridHeight: integer(),
  ...timestamps,
});
