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

  const seeds: SeedDTO[] = [
    {
      id: crypto.randomUUID(),
      name: "Tomaat",
      variety: "San Marzano 2",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.April,
      plantTill: Month.July,
      harvestFrom: Month.April,
      harvestTill: Month.October,
      plantHeight: PlantHeight.CLIMBER,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Peterselie",
      variety: "Gigante d'Italia",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.April,
      plantTill: Month.July,
      harvestFrom: Month.April,
      harvestTill: Month.October,
      expirationDate: "2024-01-07",
      plantHeight: PlantHeight.MEDIUM,
      numberOfSeedsPerGridCell: 2,
    },
    {
      id: crypto.randomUUID(),
      name: "Witte Spitskool",
      variety: "Express",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.April,
      plantTill: Month.May,
      harvestFrom: Month.June,
      harvestTill: Month.October,
      expirationDate: "2027-01-07",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Spinazie",
      variety: "Viroflex Winterreuzen",
      sowFrom: Month.February,
      sowTill: Month.November,
      plantFrom: Month.March,
      plantTill: Month.December,
      expirationDate: "2027-01-07",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Tuinboon",
      variety: "Witkiem",
      sowFrom: Month.February,
      sowTill: Month.May,
      plantFrom: Month.February,
      plantTill: Month.May,
      harvestFrom: Month.June,
      harvestTill: Month.July,
      expirationDate: "2027-01-07",
      plantHeight: PlantHeight.CLIMBER,
      numberOfSeedsPerGridCell: 4,
      preSprout: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Veldsla",
      variety: "Grote Noord Hollandse",
      sowFrom: Month.February,
      sowTill: Month.October,
      plantFrom: Month.February,
      plantTill: Month.October,
      expirationDate: "2024-01-01",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 9,
    },
    {
      id: crypto.randomUUID(),
      name: "Tomaat",
      variety: "Roma",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.April,
      plantTill: Month.July,
      harvestFrom: Month.April,
      harvestTill: Month.October,
      plantHeight: PlantHeight.CLIMBER,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Tomaat",
      variety: "Sweety",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.April,
      plantTill: Month.July,
      harvestFrom: Month.April,
      harvestTill: Month.October,
      plantHeight: PlantHeight.CLIMBER,
      numberOfSeedsPerGridCell: 1,
      expirationDate: "2024-01-01",
    },
    {
      id: crypto.randomUUID(),
      name: "Sugarsnap",
      variety: "Jessy",
      sowFrom: Month.February,
      sowTill: Month.July,
      plantFrom: Month.March,
      plantTill: Month.July,
      expirationDate: "2024-01-01",
      plantHeight: PlantHeight.MEDIUM,
      numberOfSeedsPerGridCell: 9,
      preSprout: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Wintererwt",
      variety: "Doperwt Feltham First",
      sowFrom: Month.February,
      sowTill: Month.July,
      plantFrom: Month.March,
      plantTill: Month.July,
      expirationDate: "2024-01-01",
      plantHeight: PlantHeight.MEDIUM,
      numberOfSeedsPerGridCell: 9,
      preSprout: true,
    },
    {
      id: crypto.randomUUID(),
      name: "Broccoli",
      variety: "Calabrese Natalino",
      sowFrom: Month.February,
      sowTill: Month.April,
      plantFrom: Month.April,
      plantTill: Month.July,
      harvestFrom: Month.July,
      harvestTill: Month.November,
      expirationDate: "2025-01-07",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Boerenkool",
      variety: "Westlandse Herfst Laat",
      sowFrom: Month.January,
      sowTill: Month.April,
      plantFrom: Month.April,
      plantTill: Month.June,
      harvestFrom: Month.November,
      harvestTill: Month.January,
      expirationDate: "2027-01-07",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 1,
    },
    {
      id: crypto.randomUUID(),
      name: "Radijs",
      variety: "Sparkler 2",
      sowFrom: Month.February,
      sowTill: Month.March,
      plantFrom: Month.March,
      plantTill: Month.August,
      harvestFrom: Month.May,
      harvestTill: Month.November,
      expirationDate: "2024-01-07",
      plantHeight: PlantHeight.SHORT,
      numberOfSeedsPerGridCell: 9,
    },
  ] as SeedDTO[];

  const bed: BedDTO = {
    id: crypto.randomUUID(),
    name: "Voorbeeldbed",
    sowDate: "2022-03-01",
    gridWidth: 5,
    gridHeight: 5,
  } as BedDTO;

  const gridItem: GridItemDTO = {
    index: 1,
    seedId: seeds[0].id,
    bedId: bed.id,
  };

  await db.delete(usersTable).where(eq(usersTable.email, user.email));
  console.log("User deleted!");

  await db.delete(seedsTable).where(eq(seedsTable.id, seeds[0].id));
  console.log("Seed deleted!");

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  for (const seed of seeds) {
    await db.insert(seedsTable).values(seed);
  }
  console.log("New seeds created!");

  // await db.insert(bedTable).values(bed);
  // console.log("New bed created!");
  //
  // await db.insert(gridItemTable).values(gridItem);
  // console.log("New grid item created!");
};

main();
