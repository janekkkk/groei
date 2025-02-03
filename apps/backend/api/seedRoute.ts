import { Hono } from "hono";
import { SeedDTO } from "@groei/common/src/models/Seed.ts";
import { db } from "../db/index.ts";
import { seedsTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";

const router = new Hono();

router.get("/", async (c) => {
  const result = await db.select().from(seedsTable);
  return c.json(result);
});

router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const result = await db
    .select()
    .from(seedsTable)
    .where(eq(seedsTable.id, id));
  return c.json(result[0]);
});

router.post("/", async (c) => {
  const seed = await c.req.json<SeedDTO>();
  await db.insert(seedsTable).values(seed);
  console.log({ seed });

  return c.json(seed);
});

export default router;
