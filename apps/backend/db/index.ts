import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "npm:@libsql/client/node";
import * as schema from "./schema.ts";

const client = createClient({ url: process.env.DB_FILE_NAME! });

export const db = drizzle({
  client,
  casing: "snake_case",
  schema: schema,
});
