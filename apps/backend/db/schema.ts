import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
  numberOfSeedsPerGridCell: integer(),
  variety: text(),
  daysToMaturity: integer(),
  notes: text(),
  ...timestamps,
});

export const bedTable = sqliteTable("bed_table", {
  id: text()
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  name: text().notNull(),
  description: text(),
  sowDate: text("sow_date"),
  gridWidth: integer("grid_width"),
  gridHeight: integer("grid_height"),
  gridData: text("grid_data"), // JSON array of seedIds or null for empty cells
  ...timestamps,
});
