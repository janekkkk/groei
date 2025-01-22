import { eq } from "drizzle-orm";
import { usersTable } from "./schema.ts";
import { db } from "./index.ts";

const main = async () => {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    email: "john@example.com",
    avatar: "https://example.com/avatar.jpg",
  };

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);

  await db
    .update(usersTable)
    .set({
      email: "example@example.com",
    })
    .where(eq(usersTable.email, user.email));
  console.log("User info updated!");
};

main();
