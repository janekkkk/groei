import app from "./app.ts";
import "./db/index.ts";

Deno.serve(app.fetch);
