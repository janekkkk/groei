import { Seed } from "@bladwijzer/common/src/models/Seed";

class SeedService {
  private static readonly baseUrl = import.meta.env.VITE_API_URI + "/seeds";

  async fetchSeeds(): Promise<Seed[]> {
    const response = await fetch(SeedService.baseUrl);

    return response.json();
  }

  async fetchSeed(id: number): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${id}`);

    return response.json();
  }

  async createSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(SeedService.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seed),
    });

    return response.json();
  }

  async updateSeed(seed: Seed): Promise<Seed> {
    const response = await fetch(`${SeedService.baseUrl}/${seed.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(seed),
    });

    return response.json();
  }

  async deleteSeed(id: number): Promise<void> {
    const response = await fetch(`${SeedService.baseUrl}/${id}`, {
      method: "DELETE",
    });

    return response.json();
  }
}

export const seedService = new SeedService();
