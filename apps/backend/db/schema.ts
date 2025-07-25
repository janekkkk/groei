import { relations } from "drizzle-orm";
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

export const gridItemTable = sqliteTable("grid_item_table", {
  id: integer().notNull().primaryKey({ autoIncrement: true }),
  seedId: text().references(() => seedsTable.id, { onDelete: "set null" }),
  bedId: text()
    .notNull()
    .references(() => bedTable.id, { onDelete: "cascade" }),
  position: integer(), // Store the position index for grid cells
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
  ...timestamps,
});

export const bedRelations = relations(bedTable, ({ many }) => ({
  grid: many(gridItemTable),
}));

export const gridItemRelations = relations(gridItemTable, ({ one }) => ({
  seed: one(seedsTable, {
    fields: [gridItemTable.seedId],
    references: [seedsTable.id],
  }),
  bed: one(bedTable, {
    fields: [gridItemTable.bedId],
    references: [bedTable.id],
  }),
}));
