import { Hono } from "hono";
import { compress } from "hono/compress";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import api from "./api/index.ts";
import { customLogger } from "./logger.ts";
import middlewares from "./middleware.ts";

const app = new Hono().basePath("/");

if (Deno.env.get("ENV") !== "test") {
  app.use("*", logger(customLogger));
}
app.use("*", compress());
app.use("*", cors());
app.use("*", secureHeaders());
app.route("/api", api);
app.get("/", (c) =>
  c.json({
    message: "🦄🌈✨👋🌎🌍🌏✨🌈🦄",
  }),
);

app.notFound(middlewares.notFound);

export default app;
