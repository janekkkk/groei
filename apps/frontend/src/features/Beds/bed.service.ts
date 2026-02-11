import type { Bed, BedDTO } from "@groei/common/src/models/Bed";

class BedService {
  private static readonly baseUrl = `${import.meta.env.VITE_API_URI}/beds`;

  async fetchBeds(): Promise<Bed[]> {
    const response = await fetch(BedService.baseUrl);
    return response.json();
  }

  async fetchBed(id: string): Promise<Bed> {
    const response = await fetch(`${BedService.baseUrl}/${id}`);
    return response.json();
  }

  async createBed(bed: Bed): Promise<Bed> {
    const response = await fetch(BedService.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bed),
    });
    return response.json();
  }

  async updateBed(bed: Bed): Promise<Bed> {
    const response = await fetch(`${BedService.baseUrl}/${bed.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bed),
    });
    return response.json();
  }

  async deleteBed(id: string): Promise<void> {
    await fetch(`${BedService.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }
}

export const bedService = new BedService();
