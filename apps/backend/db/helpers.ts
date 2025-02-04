import { text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * https://orm.drizzle.team/docs/guides/timestamp-default-value#sqlite
 */
export const timestamps = {
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  // .$onUpdate(() => new Date())
  // .$type<Date>(),
  updatedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  // .$onUpdate(() => new Date())
  // .$type<Date>(),
  deletedAt: text(),
  // .$onUpdate(() => new Date())
  // .$type<Date>(),
};
