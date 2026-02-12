import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.ts";

const client = createClient({ url: process.env.DB_FILE_NAME || ":memory:" });

export const db = drizzle({
  client,
  casing: "snake_case",
  schema: schema,
});
