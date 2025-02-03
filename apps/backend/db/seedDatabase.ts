import { eq } from "drizzle-orm";
import { seedsTable, usersTable } from "./schema.ts";
import { db } from "./index.ts";
import { User } from "@groei/common/src/models/user.ts";
import { Month, PlantHeight, SeedDTO } from "@groei/common/src/models/Seed.ts";

const main = async () => {
  const user: User = {
    name: "Janek",
    email: "ikben@janekozga.nl",
    avatar: "https://example.com/avatar.jpg",
  };

  const seed: SeedDTO = {
    id: crypto.randomUUID(),
    name: "Tomaat",
    variety: "Cherry",
    sowFrom: Month.March,
    sowTill: Month.July,
    plantFrom: Month.April,
    plantTill: Month.July,
    harvestFrom: Month.August,
    harvestTill: Month.October,
    expirationDate: "2022-03-01",
    url: "https://example.com/tomato",
    plantHeight: PlantHeight.Short,
    plantDistance: 50,
    numberOfSeedsPerGridCell: 2,
    daysToMaturity: 60,
    quantity: 10,
    notes: "This is a note",
    tags: "tomato, cherry, red",
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
  };

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");

  await db.delete(seedsTable).where(eq(seedsTable.id, seed.id));
  console.log("Seed deleted!");

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  await db.insert(seedsTable).values(seed);
  console.log("New seed created!");

  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);

  //   await db
  //     .update(usersTable)
  //     .set({
  //       email: "example@example.com",
  //     })
  //     .where(eq(usersTable.email, user.email));
  //   console.log("User info updated!");
};

main();
