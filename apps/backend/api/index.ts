import { Hono } from "hono";
import seeds from "./seeds.ts";
import users from "./user.ts";

const router = new Hono();

router.get("/", ({ json }) =>
  json({
    message: "API - 👋🌎🌍🌏",
  }),
);

router.route("/seeds", seeds);
router.route("/user", users);

export default router;
