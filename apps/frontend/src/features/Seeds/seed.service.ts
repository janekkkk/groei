import { Seed, SeedDTO } from "@groei/common/src/models/Seed";
import { dateService } from "@/shared/date.service";

class SeedService {
  private static readonly baseUrl = import.meta.env.VITE_API_URI + "/seeds";

  async fetchSeeds(): Promise<Seed[]> {
    const response = await fetch(SeedService.baseUrl);

    return response.json().then((seeds: SeedDTO[]) => {
      return seeds.map(
        (seed: SeedDTO) =>
          ({
            ...seed,
            createdAt: dateService.convertDate(seed.createdAt),
            updatedAt: dateService.convertDate(seed.updatedAt),
            deletedAt: seed.deletedAt
              ? dateService.convertDate(seed.deletedAt)
              : undefined,
          }) as Seed,
      );
    });
  }

  async fetchSeed(id: string): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${id}`);

    return response.json().then((seed: SeedDTO) => ({
      ...seed,
      createdAt: dateService.convertDate(seed.createdAt),
      updatedAt: dateService.convertDate(seed.updatedAt),
      deletedAt: seed.deletedAt
        ? dateService.convertDate(seed.deletedAt)
        : undefined,
    }));
  }

  async createSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(SeedService.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...seed,
        createdAt: dateService.formatedTimestamp(seed.createdAt),
        updatedAt: dateService.formatedTimestamp(seed.updatedAt),
        deletedAt: seed.deletedAt
          ? dateService.formatedTimestamp(seed.deletedAt)
          : undefined,
      }),
    });

    return response.json();
  }

  async updateSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${seed.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...seed,
        createdAt: dateService.formatedTimestamp(seed.createdAt),
        updatedAt: dateService.formatedTimestamp(seed.updatedAt),
        deletedAt: seed.deletedAt
          ? dateService.formatedTimestamp(seed.deletedAt)
          : undefined,
      }),
    });

    return response.json();
  }

  async deleteSeed(id: string): Promise<void> {
    const response = await fetch(`${SeedService.baseUrl}/${id}`, {
      method: "DELETE",
    });

    return response.json();
  }
}

export const seedService = new SeedService();
