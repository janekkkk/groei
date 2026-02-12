import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.ts";
import { usersTable } from "../db/schema.ts";

const router = new Hono();

router.get("/:email", async (c) => {
  const email = c.req.param("email");

  if (!email) {
    return c.json({ error: "Email is required" }, 400);
  }

  try {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    });

    return user ? c.json(user) : c.json(null);
  } catch (error) {
    console.error("Error fetching user:", error);
    return c.json({ error: "Failed to fetch user" }, 500);
  }
});

export default router;
