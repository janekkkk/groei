import { eq } from "drizzle-orm";
import { bedTable, gridItemTable, seedsTable, usersTable } from "./schema.ts";
import { db } from "./index.ts";
import { User } from "@groei/common/src/models/user.ts";
import { Month, PlantHeight, SeedDTO } from "@groei/common/src/models/Seed.ts";
import { BedDTO, GridItemDTO } from "@groei/common/src/models/Bed.ts";

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
    plantHeight: PlantHeight.SHORT,
    numberOfSeedsPerGridCell: 2,
    daysToMaturity: 60,
    notes: "This is a note",
  } as SeedDTO;

  const bed: BedDTO = {
    id: crypto.randomUUID(),
    name: "Bed 1",
    sowDate: "2022-03-01",
    gridWidth: 5,
    gridHeight: 5,
  } as BedDTO;

  const gridItem: GridItemDTO = {
    index: 1,
    seedId: seed.id,
    bedId: bed.id,
  };

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");

  await db.delete(seedsTable).where(eq(seedsTable.id, seed.id));
  console.log("Seed deleted!");

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  await db.insert(seedsTable).values(seed);
  console.log("New seed created!");

  await db.insert(bedTable).values(bed);
  console.log("New bed created!");

  await db.insert(gridItemTable).values(gridItem);
  console.log("New grid item created!");

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
