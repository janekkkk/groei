import { text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * https://orm.drizzle.team/docs/guides/timestamp-default-value#sqlite
 */
export const timestamps = {
  createdAt: text()
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text()
    .notNull()
    .default(sql`(current_timestamp)`)
    .$onUpdate(() => sql`(current_timestamp)`),
  deletedAt: text(),
};
