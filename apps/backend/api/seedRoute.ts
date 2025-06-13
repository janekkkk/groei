import { Hono } from "hono";
import { SeedDTO } from "@groei/common/src/models/Seed.ts";
import { db } from "../db/index.ts";
import { seedsTable } from "../db/schema.ts";
import { eq } from "drizzle-orm";
import {
  logCriticalError,
  logDatabaseOperation,
} from "../middleware/logging.ts";

const router = new Hono();

// Helper function to validate seed data
function validateSeedData(seedData: Record<string, unknown>) {
  if (!seedData.name || typeof seedData.name !== "string") {
    throw new Error("Seed name is required and must be a string");
  }
  if (
    seedData.numberOfSeedsPerGridCell !== undefined &&
    (typeof seedData.numberOfSeedsPerGridCell !== "number" ||
      !Number.isInteger(seedData.numberOfSeedsPerGridCell) ||
      seedData.numberOfSeedsPerGridCell <= 0)
  ) {
    throw new Error("Number of seeds per grid cell must be a positive integer");
  }
  if (
    seedData.daysToMaturity !== undefined &&
    (typeof seedData.daysToMaturity !== "number" ||
      !Number.isInteger(seedData.daysToMaturity) ||
      seedData.daysToMaturity <= 0)
  ) {
    throw new Error("Days to maturity must be a positive integer");
  }
}

// Get all seeds
router.get("/", async (c) => {
  try {
    logDatabaseOperation("SELECT", "seedsTable", "fetchAll");

    const result = await db.select().from(seedsTable).all();

    logDatabaseOperation(
      "SELECT_RESULT",
      "seedsTable",
      `Found ${result.length} seeds`,
    );

    return c.json(result);
  } catch (error) {
    logCriticalError(
      "GET_ALL_SEEDS",
      error instanceof Error ? error : new Error(String(error)),
    );
    return c.json({ error: "Failed to fetch seeds" }, 500);
  }
});

// Get a single seed by ID
router.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "Seed ID is required" }, 400);
    }

    logDatabaseOperation("SELECT", "seedsTable", `fetchById: ${id}`);

    const result = await db
      .select()
      .from(seedsTable)
      .where(eq(seedsTable.id, id));

    if (!result || result.length === 0) {
      return c.json({ error: "Seed not found" }, 404);
    }

    logDatabaseOperation("SELECT_RESULT", "seedsTable", `Found seed: ${id}`);

    return c.json(result[0]);
  } catch (error) {
    logCriticalError(
      "GET_SEED_BY_ID",
      error instanceof Error ? error : new Error(String(error)),
      { seedId: c.req.param("id") },
    );
    return c.json({ error: "Failed to fetch seed" }, 500);
  }
});

// Create a new seed
router.post("/", async (c) => {
  try {
    const seed = await c.req.json<SeedDTO>();

    logDatabaseOperation("CREATE_SEED_START", "seedsTable", {
      seedName: seed.name,
      seedId: seed.id,
    });

    // Validate seed data
    validateSeedData(seed);

    // Generate ID if not provided
    if (!seed.id) {
      seed.id = crypto.randomUUID();
    }

    // Set timestamps
    const now = new Date().toISOString();
    seed.createdAt = now;
    seed.updatedAt = now;

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      await tx.insert(seedsTable).values(seed);

      // Fetch the created seed to ensure it was saved correctly
      const createdSeed = await tx
        .select()
        .from(seedsTable)
        .where(eq(seedsTable.id, seed.id!));

      if (!createdSeed || createdSeed.length === 0) {
        throw new Error("Failed to create seed - seed not found after insert");
      }

      return createdSeed[0];
    });

    logDatabaseOperation("CREATE_SEED_SUCCESS", "seedsTable", {
      seedId: result.id,
      seedName: result.name,
    });

    return c.json(result, 201);
  } catch (error) {
    logCriticalError(
      "CREATE_SEED",
      error instanceof Error ? error : new Error(String(error)),
    );
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to create seed" }, 500);
  }
});

// Update a seed by ID
router.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const seed = await c.req.json<SeedDTO>();

    if (!id) {
      return c.json({ error: "Seed ID is required" }, 400);
    }

    logDatabaseOperation("UPDATE_SEED_START", "seedsTable", {
      seedId: id,
      seedName: seed.name,
    });

    // Validate seed data
    validateSeedData(seed);

    // Set updated timestamp
    seed.updatedAt = new Date().toISOString();

    // Use transaction to ensure data consistency
    const result = await db.transaction(async (tx) => {
      // Check if seed exists
      const existingSeed = await tx
        .select()
        .from(seedsTable)
        .where(eq(seedsTable.id, id));

      if (!existingSeed || existingSeed.length === 0) {
        throw new Error("Seed not found");
      }

      // Update the seed
      await tx.update(seedsTable).set(seed).where(eq(seedsTable.id, id));

      // Fetch the updated seed
      const updatedSeed = await tx
        .select()
        .from(seedsTable)
        .where(eq(seedsTable.id, id));

      if (!updatedSeed || updatedSeed.length === 0) {
        throw new Error("Failed to update seed - seed not found after update");
      }

      return updatedSeed[0];
    });

    logDatabaseOperation("UPDATE_SEED_SUCCESS", "seedsTable", {
      seedId: result.id,
      seedName: result.name,
    });

    return c.json(result);
  } catch (error) {
    logCriticalError(
      "UPDATE_SEED",
      error instanceof Error ? error : new Error(String(error)),
      { seedId: c.req.param("id") },
    );
    if (error instanceof Error && error.message === "Seed not found") {
      return c.json({ error: "Seed not found" }, 404);
    }
    if (error instanceof Error) {
      return c.json({ error: error.message }, 400);
    }
    return c.json({ error: "Failed to update seed" }, 500);
  }
});

// Delete a seed by ID
router.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    if (!id) {
      return c.json({ error: "Seed ID is required" }, 400);
    }

    logDatabaseOperation("DELETE_SEED_START", "seedsTable", { seedId: id });

    // Use transaction to ensure data consistency
    await db.transaction(async (tx) => {
      // Check if seed exists
      const existingSeed = await tx
        .select()
        .from(seedsTable)
        .where(eq(seedsTable.id, id));

      if (!existingSeed || existingSeed.length === 0) {
        throw new Error("Seed not found");
      }

      logDatabaseOperation("DELETE_SEED_FOUND", "seedsTable", {
        seedId: id,
        seedName: existingSeed[0].name,
      });

      // Delete the seed
      await tx.delete(seedsTable).where(eq(seedsTable.id, id));
    });

    logDatabaseOperation("DELETE_SEED_SUCCESS", "seedsTable", { seedId: id });

    return c.json({ message: "Seed deleted successfully", id }, 200);
  } catch (error) {
    logCriticalError(
      "DELETE_SEED",
      error instanceof Error ? error : new Error(String(error)),
      { seedId: c.req.param("id") },
    );
    if (error instanceof Error && error.message === "Seed not found") {
      return c.json({ error: "Seed not found" }, 404);
    }
    return c.json({ error: "Failed to delete seed" }, 500);
  }
});

export default router;
