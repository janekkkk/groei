import app from "./app.ts";
import "./db/index.ts";

Deno.serve(
  { port: process.env.PORT, hostname: process.env.HOSTNAME },
  app.fetch,
);
