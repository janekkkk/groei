import { Seed, SeedDTO } from "@groei/common/src/models/Seed";

class SeedService {
  private static readonly baseUrl = import.meta.env.VITE_API_URI + "/seeds";

  private formatedTimestamp(newDate?: Date) {
    const d = newDate ?? new Date();
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0].replace(/:/g, "-");
    return `${date} ${time}`;
  }

  async fetchSeeds(): Promise<Seed[]> {
    const response = await fetch(SeedService.baseUrl);

    return response.json().then((seeds: SeedDTO[]) => {
      return seeds.map(
        (seed: SeedDTO) =>
          ({
            ...seed,
            tags: seed.tags?.split(","),
            createdAt: new Date(seed.createdAt),
            updatedAt: new Date(seed.updatedAt),
            deletedAt: seed.deletedAt ? new Date(seed.deletedAt) : undefined,
          }) as Seed,
      );
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
      body: JSON.stringify({
        ...seed,
        tags: seed?.tags?.join(","),
        createdAt: this.formatedTimestamp(seed.createdAt),
        updatedAt: this.formatedTimestamp(seed.updatedAt),
        deletedAt: seed.deletedAt
          ? this.formatedTimestamp(seed.deletedAt)
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
        tags: seed?.tags?.join(","),
        createdAt: this.formatedTimestamp(seed.createdAt),
        updatedAt: this.formatedTimestamp(seed.updatedAt),
        deletedAt: seed.deletedAt
          ? this.formatedTimestamp(seed.deletedAt)
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
