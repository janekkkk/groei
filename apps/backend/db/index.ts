import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "npm:@libsql/client/node";

const client = createClient({ url: process.env.DB_FILE_NAME! });
export const db = drizzle({ client, casing: "snake_case" });
