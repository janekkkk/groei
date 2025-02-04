import { Bed, BedDTO } from "@groei/common/src/models/Bed";
import { dateService } from "@/shared/date.service";

class BedService {
  private static readonly baseUrl = import.meta.env.VITE_API_URI + "/beds";

  async fetchBeds(): Promise<Bed[]> {
    const response = await fetch(BedService.baseUrl);

    return response.json().then((beds: BedDTO[]) => {
      return beds.map(
        (bed: BedDTO) =>
          ({
            ...bed,
            createdAt: dateService.convertDate(bed.createdAt),
            updatedAt: dateService.convertDate(bed.updatedAt),
            deletedAt: bed.deletedAt
              ? dateService.convertDate(bed.deletedAt)
              : undefined,
          }) as Bed,
      );
    });
  }

  async fetchBed(id: string): Promise<Bed> {
    const response = await fetch(`${BedService.baseUrl}/${id}`);

    return response.json().then((bed: BedDTO) => ({
      ...bed,
      createdAt: dateService.convertDate(bed.createdAt),
      updatedAt: dateService.convertDate(bed.updatedAt),
      deletedAt: bed.deletedAt
        ? dateService.convertDate(bed.deletedAt)
        : undefined,
    }));
  }

  async createBed(bed: Bed): Promise<Bed> {
    const response = await fetch(BedService.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bed,
        createdAt: dateService.formatedTimestamp(bed.createdAt),
        updatedAt: dateService.formatedTimestamp(bed.updatedAt),
        deletedAt: bed.deletedAt
          ? dateService.formatedTimestamp(bed.deletedAt)
          : undefined,
      }),
    });

    return response.json();
  }

  async updateBed(bed: Bed): Promise<Bed> {
    const response = await fetch(`${BedService.baseUrl}/${bed.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bed,
        createdAt: dateService.formatedTimestamp(bed.createdAt),
        updatedAt: dateService.formatedTimestamp(bed.updatedAt),
        deletedAt: bed.deletedAt
          ? dateService.formatedTimestamp(bed.deletedAt)
          : undefined,
      }),
    });

    return response.json();
  }

  async deleteBed(id: string): Promise<void> {
    const response = await fetch(`${BedService.baseUrl}/${id}`, {
      method: "DELETE",
    });

    return response.json();
  }
}

export const bedService = new BedService();
