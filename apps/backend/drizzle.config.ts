import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
  out: "./db",
  schema: "./db/schema.ts",
  dialect: "sqlite",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DB_FILE_NAME || ":memory:",
  },
});
