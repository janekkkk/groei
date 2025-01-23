import { text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const timestamps = {
  updatedAt: text().default(sql`(current_timestamp)`),
  createdAt: text()
    .default(sql`(current_timestamp)`)
    .notNull(),
  deletedAt: text().default(sql`(current_timestamp)`),
};
