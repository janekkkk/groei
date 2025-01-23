import { Hono } from "hono";
import { db } from "../db/index.ts";
import { bedTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { Bed } from "@bladwijzer/common/src/models/Bed.ts";

const router = new Hono();

router.get("/", async (c) => {
  const result = await db.select().from(bedTable);
  return c.json(result);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db
    .select()
    .from(bedTable)
    .where(eq(bedTable.id, Number(id)));
  return c.json(result[0]);
});

router.post("/", async (c) => {
  const bed = await c.req.json<Bed>();
  await db.insert(bedTable).values(bed);
  console.log({ bed: bed });

  return c.json(bed);
});

export default router;
