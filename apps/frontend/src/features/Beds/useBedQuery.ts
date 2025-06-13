import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

        // Merge local with external beds so no data is lost
        // Priority given to server data (fetchedBeds)
        const merged = mergeItems([...fetchedBeds, ...beds]);

        if (Array.isArray(fetchedBeds)) {
          console.log(
            `Setting ${merged.length} beds after merging ${beds.length} local and ${fetchedBeds.length} server beds`,
          );
          setBeds(merged);
          return merged;
        } else throw Error("Invalid response");
      } catch (error) {
        console.error("Error fetching beds", error);
        // Return local beds if server fetch fails
        return beds;
      }
    },
    // Refresh every 30 seconds in the background
    refetchInterval: 30000,
    // Important: this ensures initial fetch on page load
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // Prefer server data but show stale data while refreshing
    staleTime: 10000,
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
        return bed;
      }
      return null;
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

      // First add to store for immediate UI update
      addBedToStore(newBed);

      // Then persist to server
      try {
        const createdBed = await bedService.createBed(newBed);
        return createdBed;
      } catch (error) {
        console.error("Failed to save bed to server", error);
        // We still return the local bed to keep the UI working
        return newBed;
      }
    },
    onSuccess: () => {
      // Invalidate to trigger a refresh of the beds data
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
  });
};

// Update a bed
export const useUpdateBedMutation = () => {
  const queryClient = useQueryClient();
  const { updateBedInStore } = useBedStore((state) => state);

  return useMutation({
    mutationFn: async (updatedBed: Bed) => {
      // Update local store first for immediate UI feedback
      updateBedInStore(updatedBed);

      // Then update on server
      try {
        const result = await bedService.updateBed(updatedBed);
        return result;
      } catch (error) {
        console.error("Failed to update bed on server", error);
        return updatedBed;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
  });
};

// Delete a bed
export const useDeleteBedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteBedFromStore } = useBedStore((state) => state);

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from local store first
      deleteBedFromStore(id);

      // Then delete from server
      try {
        await bedService.deleteBed(id);
      } catch (error) {
        console.error("Failed to delete bed from server", error);
        // We don't restore the bed locally as that could be confusing
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["beds"] });
    },
  });
};
