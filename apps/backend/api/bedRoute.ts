import type { BedDTO, GridItem } from "@groei/common/src/models/Bed.ts";
import { eq, inArray } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.ts";
import { bedTable, seedsTable } from "../db/schema.ts";
import { validateBedData } from "./utils.ts";

const router = new Hono();

// Helper function to convert gridData JSON to GridItem array with seed objects
async function parseGridData(
  gridData: string | null,
  _gridWidth?: number | null,
  _gridHeight?: number | null,
) {
  if (!gridData) {
    return [];
  }

  try {
    const seedIds: (string | null)[] = JSON.parse(gridData);

    // Fetch all seeds referenced in the grid
    const nonNullSeedIds = seedIds.filter((id): id is string => !!id);
    let seedMap = new Map<string, unknown>();

    if (nonNullSeedIds.length > 0) {
      const seeds = await db
        .select()
        .from(seedsTable)
        .where(inArray(seedsTable.id, nonNullSeedIds));
      seedMap = new Map(seeds.map((seed) => [seed.id, seed]));
    }

    // Convert to GridItem array
    return seedIds.map((seedId, index) => ({
      index,
      seed: seedId ? seedMap.get(seedId) : undefined,
    }));
  } catch {
    return [];
  }
}

// Get all beds with their grid data
router.get("/", async (c) => {
  try {
    const beds = await db.select().from(bedTable).all();

    // Transform the data to match the expected frontend format
    const transformedBeds = await Promise.all(
      beds.map(async (bed) => ({
        ...bed,
        grid: await parseGridData(bed.gridData, bed.gridWidth, bed.gridHeight),
      })),
    );

    return c.json(transformedBeds);
  } catch (error) {
    console.error("Error fetching beds:", error);
    return c.json({ error: "Failed to fetch beds" }, 500);
  }
});

// Get a single bed by ID with grid data
router.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Bed ID is required" }, 400);
  }

  try {
    const bed = await db.query.bedTable.findFirst({
      where: eq(bedTable.id, id),
    });

    if (!bed) {
      return c.json({ error: "Bed not found" }, 404);
    }

    // Transform the data to match the expected frontend format
    const transformedBed = {
      ...bed,
      grid: await parseGridData(bed.gridData, bed.gridWidth, bed.gridHeight),
    };

    return c.json(transformedBed);
  } catch (error) {
    console.error("Error fetching bed:", error);
    return c.json({ error: "Failed to fetch bed" }, 500);
  }
});

// Create a new bed with grid data
router.post("/", async (c) => {
  try {
    const { grid, ...bedData } = await c.req.json<
      BedDTO & { grid?: GridItem[] }
    >();

    // Validate bed data
    validateBedData(bedData);

    // Generate ID if not provided
    if (!bedData.id) {
      bedData.id = crypto.randomUUID();
    }

    // Set timestamps
    const now = new Date().toISOString();
    bedData.createdAt = now;
    bedData.updatedAt = now;

    // Convert grid to JSON array of seedIds
    let gridData: string | undefined;
    if (grid && Array.isArray(grid) && grid.length > 0) {
      const gridSize =
        bedData.gridWidth && bedData.gridHeight
          ? bedData.gridWidth * bedData.gridHeight
          : grid.length;
      const seedIdArray: (string | null)[] = Array(gridSize).fill(null);

      for (const gridItem of grid) {
        if (gridItem.index >= 0 && gridItem.index < gridSize) {
          seedIdArray[gridItem.index] = gridItem.seed?.id || null;
        }
      }

      gridData = JSON.stringify(seedIdArray);
    }

    const [newBed] = await db
      .insert(bedTable)
      .values({
        ...bedData,
        gridData,
      })
      .returning();

    // Return the created bed with parsed grid
    const transformedBed = {
      ...newBed,
      grid: await parseGridData(
        newBed.gridData,
        newBed.gridWidth,
        newBed.gridHeight,
      ),
    };

    return c.json(transformedBed, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error creating bed:", error);
    return c.json({ error: "Failed to create bed" }, 500);
  }
});

// Update a bed by ID
router.put("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Bed ID is required" }, 400);
  }

  try {
    const { grid, ...bedData } = await c.req.json<
      BedDTO & { grid?: GridItem[] }
    >();

    // Validate bed data
    validateBedData(bedData);

    // Check if bed exists
    const existing = await db.query.bedTable.findFirst({
      where: eq(bedTable.id, id),
    });

    if (!existing) {
      return c.json({ error: "Bed not found" }, 404);
    }

    // Set updated timestamp
    bedData.updatedAt = new Date().toISOString();

    // Convert grid to JSON array of seedIds
    let gridData = existing.gridData;
    if (grid !== undefined && Array.isArray(grid)) {
      const gridWidth = bedData.gridWidth || existing.gridWidth;
      const gridHeight = bedData.gridHeight || existing.gridHeight;
      const gridSize =
        gridWidth && gridHeight ? gridWidth * gridHeight : grid.length;
      const seedIdArray: (string | null)[] = Array(gridSize).fill(null);

      for (const gridItem of grid) {
        if (gridItem.index >= 0 && gridItem.index < gridSize) {
          seedIdArray[gridItem.index] = gridItem.seed?.id || null;
        }
      }

      gridData = JSON.stringify(seedIdArray);
    }

    const [updatedBed] = await db
      .update(bedTable)
      .set({
        ...bedData,
        gridData,
      })
      .where(eq(bedTable.id, id))
      .returning();

    // Return the updated bed with parsed grid
    const transformedBed = {
      ...updatedBed,
      grid: await parseGridData(
        updatedBed.gridData,
        updatedBed.gridWidth,
        updatedBed.gridHeight,
      ),
    };

    return c.json(transformedBed);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error updating bed:", error);
    return c.json({ error: "Failed to update bed" }, 500);
  }
});

// Delete a bed by ID
router.delete("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Bed ID is required" }, 400);
  }

  try {
    const bed = await db.query.bedTable.findFirst({
      where: eq(bedTable.id, id),
    });

    if (!bed) {
      return c.json({ error: "Bed not found" }, 404);
    }

    await db.delete(bedTable).where(eq(bedTable.id, id));

    return c.json({ message: "Bed deleted successfully", id });
  } catch (error) {
    console.error("Error deleting bed:", error);
    return c.json({ error: "Failed to delete bed" }, 500);
  }
});

export default router;
