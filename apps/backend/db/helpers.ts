import { integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/**
 * https://orm.drizzle.team/docs/guides/timestamp-default-value#sqlite
 */
export const timestamps = {
  createdAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
  updatedAt: integer({ mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => sql`(unixepoch())`),
  deletedAt: integer({ mode: "timestamp" }).$onUpdate(() => sql`(unixepoch())`),
};
