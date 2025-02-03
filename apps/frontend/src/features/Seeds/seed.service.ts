import { Seed, SeedDTO } from "@groei/common/src/models/Seed";

class SeedService {
  private static readonly baseUrl = import.meta.env.VITE_API_URI + "/seeds";

  async fetchSeeds(): Promise<Seed[]> {
    const response = await fetch(SeedService.baseUrl);

    return response.json().then((seeds: SeedDTO[]) => {
      return seeds.map((seed) => ({
        ...seed,
        tags: seed.tags?.split(","),
        createdAt: new Date(seed.createdAt),
        updatedAt: new Date(seed.updatedAt),
        deletedAt: seed.deletedAt ? new Date(seed.deletedAt) : undefined,
      }));
    });
  }

  async fetchSeed(id: string): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${id}`);

    return response.json().then((seed: SeedDTO) => ({
      ...seed,
      tags: seed.tags?.split(","),
      createdAt: new Date(seed.createdAt),
      updatedAt: new Date(seed.updatedAt),
      deletedAt: seed.deletedAt ? new Date(seed.deletedAt) : undefined,
    }));
  }

  async createSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(SeedService.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...seed, tags: seed?.tags?.join(",") }),
    });

    return response.json();
  }

  async updateSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${seed.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...seed, tags: seed?.tags?.join(",") }),
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
