import { Hono } from "hono";
import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";
import { bedTable, gridItemTable } from "../db/schema.ts";
import { GridItem } from "@groei/common/src/models/Bed.ts";

const router = new Hono();

// Get all beds with their grid items and their seeds
router.get("/", async (c) => {
  const result = await db.query.bedTable.findMany({
    with: {
      grid: {
        with: {
          seed: true,
        },
      },
    },
  });

  return c.json(result);
});

// Get a single bed by ID with its grid items their seeds
router.get("/:id", async (c) => {
  const { id } = c.req.param();

  const result = await db.query.bedTable.findFirst({
    where: eq(bedTable.id, id),
    with: {
      grid: {
        with: {
          seed: true,
        },
      },
    },
  });

  return c.json(result);
});

// Create a new bed with grid items
router.post("/", async (c) => {
  const body = await c.req.json();
  const { grid, ...bedData } = body;

  const [newBed] = await db.insert(bedTable).values(bedData).returning();

  if (grid && grid.length) {
    await db.insert(gridItemTable).values(
      grid.map((gridItem: GridItem) => ({
        bedId: newBed.id,
        seedId: gridItem?.seedId?.id,
      })),
    );
  }

  return c.json(newBed, 201);
});

// Update a bed by ID
router.put("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  const { grid, ...bedData } = body;

  const [updatedBed] = await db
    .update(bedTable)
    .set(bedData)
    .where(eq(bedTable.id, id))
    .returning();

  if (!updatedBed) return c.notFound();

  if (grid) {
    await db.delete(gridItemTable).where(eq(gridItemTable.bedId, id));
    await db.insert(gridItemTable).values(
      grid.map((gridItem: GridItem) => ({
        bedId: id,
        seedId: gridItem?.seedId?.id,
      })),
    );
  }

  return c.json(updatedBed);
});

// Delete a bed by ID along with its grid items
router.delete("/:id", async (c) => {
  const { id } = c.req.param();

  await db.delete(gridItemTable).where(eq(gridItemTable.bedId, id));
  await db.delete(bedTable).where(eq(bedTable.id, id));

  return c.text("Deleted successfully");
});

export default router;
