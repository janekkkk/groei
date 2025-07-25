import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.ts";
import { usersTable } from "../db/schema.ts";

const router = new Hono();

router.get("/:email", async (c) => {
  const email = c.req.param("email");
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return c.json(result[0]);
});

export default router;
