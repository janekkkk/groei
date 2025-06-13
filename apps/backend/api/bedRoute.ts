import { Hono } from "hono";
import { db } from "../db/index.ts";
import { eq } from "drizzle-orm";
import { bedTable, gridItemTable } from "../db/schema.ts";
import { BedDTO, GridItem } from "@groei/common/src/models/Bed.ts";

const router = new Hono();

// Helper function to validate bed data
function validateBedData(bedData: BedDTO) {
  if (!bedData.name || typeof bedData.name !== "string") {
    throw new Error("Bed name is required and must be a string");
  }
  if (
    bedData.gridWidth !== undefined &&
    (!Number.isInteger(bedData.gridWidth) || bedData.gridWidth <= 0)
  ) {
    throw new Error("Grid width must be a positive integer");
  }
  if (
    bedData.gridHeight !== undefined &&
    (!Number.isInteger(bedData.gridHeight) || bedData.gridHeight <= 0)
  ) {
    throw new Error("Grid height must be a positive integer");
  }
}

// Get all beds with their grid items and their seeds
router.get("/", async (c) => {
  try {
    const result = await db.query.bedTable.findMany({
      with: {
        grid: {
          with: {
            seed: true,
          },
        },
      },
    });

    // Transform the data to match the expected frontend format
    const transformedBeds = result.map((bed) => ({
      ...bed,
      grid: bed.grid.map((gridItem, index) => ({
        index,
        seed: gridItem.seed || undefined,
        bedId: gridItem.bedId,
        seedId: gridItem.seedId,
      })),
    }));

    return c.json(transformedBeds);
  } catch (error) {
    console.error("Error fetching beds:", error);
    return c.json({ error: "Failed to fetch beds" }, 500);
  }
});

// Get a single bed by ID with its grid items their seeds
router.get("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Bed ID is required" }, 400);
    }

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

    if (!result) {
      return c.json({ error: "Bed not found" }, 404);
    }

    // Transform the data to match the expected frontend format
    const transformedBed = {
      ...result,
      grid: result.grid.map((gridItem, index) => ({
        index,
        seed: gridItem.seed || undefined,
        bedId: gridItem.bedId,
        seedId: gridItem.seedId,
      })),
    };

    return c.json(transformedBed);
  } catch (error) {
    console.error("Error fetching bed:", error);
    return c.json({ error: "Failed to fetch bed" }, 500);
  }
});

// Create a new bed with grid items
router.post("/", async (c) => {
  try {
    const { grid, ...bedData } = await c.req.json();

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

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Insert the bed
      const [newBed] = await tx.insert(bedTable).values(bedData).returning();

      // Insert grid items if provided
      if (grid && Array.isArray(grid) && grid.length > 0) {
        const gridItems = grid
          .map((gridItem: GridItem) => ({
            bedId: newBed.id,
            seedId: gridItem?.seed?.id || null,
          }))
          .filter((item) => item.seedId); // Only insert items with actual seeds

        if (gridItems.length > 0) {
          await tx.insert(gridItemTable).values(gridItems);
        }
      }

      // Fetch the complete bed with grid items
      const completeBed = await tx.query.bedTable.findFirst({
        where: eq(bedTable.id, newBed.id),
        with: {
          grid: {
            with: {
              seed: true,
            },
          },
        },
      });

      return completeBed;
    });

    if (!result) {
      return c.json({ error: "Failed to create bed" }, 500);
    }

    // Transform the data to match the expected frontend format
    const transformedBed = {
      ...result,
      grid: result.grid.map((gridItem, index) => ({
        index,
        seed: gridItem.seed || undefined,
        bedId: gridItem.bedId,
        seedId: gridItem.seedId,
      })),
    };

    return c.json(transformedBed, 201);
  } catch (error) {
    console.error("Error creating bed:", error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create bed" }, 500);
  }
});

// Update a bed by ID
router.put("/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const { grid, ...bedData } = await c.req.json();

    if (!id) {
      return c.json({ error: "Bed ID is required" }, 400);
    }

    // Validate bed data
    validateBedData(bedData);

    // Set updated timestamp
    bedData.updatedAt = new Date().toISOString();

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Update the bed
      const [updatedBed] = await tx
        .update(bedTable)
        .set(bedData)
        .where(eq(bedTable.id, id))
        .returning();

      if (!updatedBed) {
        throw new Error("Bed not found");
      }

      // Update grid items if provided
      if (grid && Array.isArray(grid)) {
        // Delete existing grid items
        await tx.delete(gridItemTable).where(eq(gridItemTable.bedId, id));

        // Insert new grid items
        const gridItems = grid
          .map((gridItem: GridItem) => ({
            bedId: id,
            seedId: gridItem?.seed?.id || null,
          }))
          .filter((item) => item.seedId); // Only insert items with actual seeds

        if (gridItems.length > 0) {
          await tx.insert(gridItemTable).values(gridItems);
        }
      }

      // Fetch the complete updated bed with grid items
      const completeBed = await tx.query.bedTable.findFirst({
        where: eq(bedTable.id, id),
        with: {
          grid: {
            with: {
              seed: true,
            },
          },
        },
      });

      return completeBed;
    });

    if (!result) {
      return c.json({ error: "Bed not found" }, 404);
    }

    // Transform the data to match the expected frontend format
    const transformedBed = {
      ...result,
      grid: result.grid.map((gridItem, index) => ({
        index,
        seed: gridItem.seed || undefined,
        bedId: gridItem.bedId,
        seedId: gridItem.seedId,
      })),
    };

    return c.json(transformedBed);
  } catch (error) {
    console.error("Error updating bed:", error);
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to update bed" }, 500);
  }
});

// Delete a bed by ID along with its grid items
router.delete("/:id", async (c) => {
  try {
    const { id } = c.req.param();

    if (!id) {
      return c.json({ error: "Bed ID is required" }, 400);
    }

    // Use transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // First check if bed exists
      const existingBed = await tx.query.bedTable.findFirst({
        where: eq(bedTable.id, id),
      });

      if (!existingBed) {
        throw new Error("Bed not found");
      }

      // Delete grid items first (foreign key constraint)
      await tx.delete(gridItemTable).where(eq(gridItemTable.bedId, id));

      // Then delete the bed
      await tx.delete(bedTable).where(eq(bedTable.id, id));
    });

    return c.json({ message: "Bed deleted successfully", id }, 200);
  } catch (error) {
    console.error("Error deleting bed:", error);
    if (error instanceof Error && error.message === "Bed not found") {
      return c.json({ error: "Bed not found" }, 404);
    }
    return c.json({ error: "Failed to delete bed" }, 500);
  }
});

export default router;
