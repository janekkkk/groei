import { eq } from "drizzle-orm";
import { db } from "../index.ts";
import { gridItemTable } from "../schema.ts";

// Run the migration
console.log("Starting migration to add position column to grid_item_table...");

try {
  // Execute SQL directly since we're doing a simple alter table
  await db.run(`
      ALTER TABLE grid_item_table
          ADD COLUMN position INTEGER;
  `);

  console.log("Migration completed successfully!");

  // Update existing records to have a position based on their ID
  // This ensures existing data will have some position value
  const gridItems = await db.query.gridItemTable.findMany();

  for (const item of gridItems) {
    if (item.position === null || item.position === undefined) {
      await db
        .update(gridItemTable)
        .set({ position: item.id }) // Using ID as a temporary position
        .where(eq(gridItemTable.id, item.id));
    }
  }

  console.log("Existing records have been updated with position values");
} catch (error) {
  console.error("Migration failed:", error);
  Deno.exit(1);
}

// Exit the process
Deno.exit(0);
