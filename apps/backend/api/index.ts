import { Hono } from "hono";
import seedRoute from "./seedRoute.ts";
import userRoute from "./userRoute.ts";
import bedRoute from "./bedRoute.ts";

const router = new Hono();

router.get("/", ({ json }) =>
  json({
    message: "API - 👋🌎🌍🌏",
  }),
);

router.route("/seeds", seedRoute);
router.route("/user", userRoute);
router.route("/beds", bedRoute);

export default router;
