import { Hono } from "hono";
import { db } from "../db/index.ts";
import { bedTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import { BedDTO } from "@groei/common/src/models/Bed.ts";

const router = new Hono();

router.get("/", async (c) => {
  const result = await db.select().from(bedTable);
  return c.json(result);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db.select().from(bedTable).where(eq(bedTable.id, id));
  return c.json(result[0]);
});

router.post("/", async (c) => {
  const bed = await c.req.json<BedDTO>();
  await db.insert(bedTable).values(bed);
  return c.json(bed);
});

router.put("/:id", async (c) => {
  const id = c.req.param("id");
  const bed = await c.req.json<BedDTO>();
  await db.update(bedTable).set(bed).where(eq(bedTable.id, id));
  return c.json(bed);
});

router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(bedTable).where(eq(bedTable.id, id));
  return c.json({ id });
});

export default router;
