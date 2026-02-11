import type { SeedDTO } from "@groei/common/src/models/Seed.ts";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.ts";
import { seedsTable } from "../db/schema.ts";
import { validateSeedData } from "./utils.ts";

const router = new Hono();

// Get all seeds
router.get("/", async (c) => {
  try {
    const seeds = await db.select().from(seedsTable).all();
    return c.json(seeds);
  } catch (error) {
    console.error("Error fetching seeds:", error);
    return c.json({ error: "Failed to fetch seeds" }, 500);
  }
});

// Get a single seed by ID
router.get("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Seed ID is required" }, 400);
  }

  try {
    const seed = await db.query.seedsTable.findFirst({
      where: eq(seedsTable.id, id),
    });

    if (!seed) {
      return c.json({ error: "Seed not found" }, 404);
    }

    return c.json(seed);
  } catch (error) {
    console.error("Error fetching seed:", error);
    return c.json({ error: "Failed to fetch seed" }, 500);
  }
});

// Create a new seed
router.post("/", async (c) => {
  try {
    const seed = await c.req.json<SeedDTO>();

    // Validate seed data
    validateSeedData(seed);

    // Generate ID if not provided
    if (!seed.id) {
      seed.id = crypto.randomUUID();
    }

    // Set timestamps
    const now = new Date().toISOString();
    const seedToCreate = {
      ...seed,
      createdAt: now,
      updatedAt: now,
    };

    await db.insert(seedsTable).values(seedToCreate);

    return c.json(seedToCreate, 201);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error creating seed:", error);
    return c.json({ error: "Failed to create seed" }, 500);
  }
});

// Update a seed by ID
router.put("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Seed ID is required" }, 400);
  }

  try {
    const seed = await c.req.json<SeedDTO>();

    // Validate seed data
    validateSeedData(seed);

    // Check if seed exists
    const existing = await db.query.seedsTable.findFirst({
      where: eq(seedsTable.id, id),
    });

    if (!existing) {
      return c.json({ error: "Seed not found" }, 404);
    }

    // Update with new timestamp
    const seedToUpdate = {
      ...seed,
      updatedAt: new Date().toISOString(),
    };

    await db.update(seedsTable).set(seedToUpdate).where(eq(seedsTable.id, id));

    return c.json(seedToUpdate);
  } catch (error) {
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    console.error("Error updating seed:", error);
    return c.json({ error: "Failed to update seed" }, 500);
  }
});

// Delete a seed by ID
router.delete("/:id", async (c) => {
  const id = c.req.param("id");

  if (!id) {
    return c.json({ error: "Seed ID is required" }, 400);
  }

  try {
    const seed = await db.query.seedsTable.findFirst({
      where: eq(seedsTable.id, id),
    });

    if (!seed) {
      return c.json({ error: "Seed not found" }, 404);
    }

    await db.delete(seedsTable).where(eq(seedsTable.id, id));

    return c.json({ message: "Seed deleted successfully", id });
  } catch (error) {
    console.error("Error deleting seed:", error);
    return c.json({ error: "Failed to delete seed" }, 500);
  }
});

export default router;
