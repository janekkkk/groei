import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bed } from "@groei/common/src/models/Bed";
import { bedService } from "@/features/Beds/bed.service";
import { useBedStore } from "@/features/Beds/beds.store";
import { mergeItems } from "@/shared/merge.helper";

// Fetch beds
export const useBedsQuery = () => {
  const { setBeds, beds } = useBedStore((state) => state);

  return useQuery({
    queryKey: ["beds"],
    queryFn: async () => {
      try {
        const fetchedBeds = await bedService.fetchBeds();
        console.log("fetch beds");

        // Merge local with external beds so no data is lost.
        const merged = mergeItems([...beds, ...fetchedBeds]);
        console.log({ beds, fetchedBeds, merged });

        if (Array.isArray(fetchedBeds)) setBeds(merged);
        else throw Error("Invalid response");
      } catch (error) {
        console.error("Error fetching beds", error);
      }
    },
  });
};

// Fetch a single bed
export const useBedQuery = (id: string) => {
  const { updateBedInStore } = useBedStore((state) => state);

  return useQuery({
    queryKey: ["bed", id],
    queryFn: async () => {
      const bed = await bedService.fetchBed(id);
      if (bed.id) {
        updateBedInStore(bed);
      }
    },
    enabled: !!id,
  });
};

// Create a bed
export const useCreateBedMutation = () => {
  const queryClient = useQueryClient();
  const { addBedToStore } = useBedStore((state) => state);

  return useMutation({
    mutationFn: async (newBed: Bed) => {
      console.log("create bed", { newBed });
      addBedToStore(newBed);
      bedService.createBed(newBed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] }); // Refetch beds
    },
  });
};

// Update a bed
export const useUpdateBedMutation = () => {
  const queryClient = useQueryClient();
  const { updateBedInStore } = useBedStore((state) => state);

  return useMutation({
    mutationFn: async (updatedBed: Bed) => {
      updateBedInStore(updatedBed);
      bedService.updateBed(updatedBed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] }); // Refetch beds
    },
  });
};

// Delete a bed
export const useDeleteBedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteBedFromStore } = useBedStore((state) => state);

  return useMutation({
    mutationFn: async (id: string) => {
      deleteBedFromStore(id);
      bedService.deleteBed(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] }); // Refetch beds
    },
  });
};
