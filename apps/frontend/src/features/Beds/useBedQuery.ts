import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bed } from "@groei/common/src/models/Bed";
import { bedService } from "@/features/Beds/bed.service";
import { useBedStore } from "@/features/Beds/beds.store";
import { mergeItems } from "@/shared/merge.helper";

// Fetch beds with consistent prioritization of server data
export const useBedsQuery = () => {
  const { setBeds, beds } = useBedStore((state) => state);

  return useQuery({
    queryKey: ["beds"],
    queryFn: async () => {
      try {
        const fetchedBeds = await bedService.fetchBeds();

        if (!Array.isArray(fetchedBeds)) {
          throw Error("Invalid response from server");
        }

        // Important: Convert dates properly for correct comparison in mergeItems
        const normalizedServerBeds = fetchedBeds.map((bed) => ({
          ...bed,
          createdAt: new Date(bed.createdAt),
          updatedAt: new Date(bed.updatedAt),
          deletedAt: bed.deletedAt ? new Date(bed.deletedAt) : undefined,
        }));

        // When merging, mergeItems will select the most recently updated version of each item
        const merged = mergeItems([...normalizedServerBeds, ...beds]);

        console.log(
          `Merged beds: server=${fetchedBeds.length}, local=${beds.length}, result=${merged.length}`,
        );

        // Update the store with the merged results
        setBeds(merged);

        return merged;
      } catch (error) {
        console.error("Error fetching beds:", error);
        // Return current beds on error to avoid disrupting the UI
        return beds;
      }
    },
    // Force refresh on component mount and window focus
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // More frequent refetching for better sync (every minute)
    refetchInterval: 60000,
  });
};

// Fetch a single bed
export const useBedQuery = (id: string) => {
  const { updateBedInStore, beds } = useBedStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["bed", id],
    queryFn: async () => {
      try {
        const bed = await bedService.fetchBed(id);

        if (bed && bed.id) {
          // Normalize dates for proper comparison
          const normalizedBed = {
            ...bed,
            createdAt: new Date(bed.createdAt),
            updatedAt: new Date(bed.updatedAt),
            deletedAt: bed.deletedAt ? new Date(bed.deletedAt) : undefined,
          };

          // Update in store
          updateBedInStore(normalizedBed);

          // Also update in query cache to ensure consistency
          queryClient.setQueryData(["beds"], (oldData: Bed[] = []) => {
            return mergeItems([normalizedBed, ...oldData]);
          });

          return normalizedBed;
        }

        // If server fetch fails, return from local store
        const localBed = beds.find((b) => b.id === id);
        return localBed || null;
      } catch (error) {
        console.error(`Error fetching bed ${id}:`, error);
        // Return from local store on error
        return beds.find((b) => b.id === id) || null;
      }
    },
    enabled: !!id,
  });
};

// Create a bed
export const useCreateBedMutation = () => {
  const queryClient = useQueryClient();
  const { addBedToStore } = useBedStore();

  return useMutation({
    mutationFn: async (newBed: Bed) => {
      // Ensure dates are properly set
      const bedToCreate = {
        ...newBed,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // First update local store for immediate UI response
      addBedToStore(bedToCreate);

      try {
        // Then persist to server
        const createdBed = await bedService.createBed(bedToCreate);
        return createdBed;
      } catch (error) {
        console.error("Failed to create bed on server:", error);
        // Still return the local version so UI remains functional
        return bedToCreate;
      }
    },
    meta: {
      onSuccess: (createdBed: Bed) => {
        // Update query cache
        queryClient.setQueryData(["beds"], (oldData: Bed[] = []) => {
          return mergeItems([createdBed, ...oldData]);
        });

        // Invalidate to trigger a refresh
        queryClient.invalidateQueries({ queryKey: ["beds"] });
      },
    },
  });
};

// Update a bed
export const useUpdateBedMutation = () => {
  const queryClient = useQueryClient();
  const { updateBedInStore } = useBedStore();

  return useMutation({
    mutationFn: async (updatedBed: Bed) => {
      // Always update the timestamp when making changes
      const bedToUpdate = {
        ...updatedBed,
        updatedAt: new Date(),
      };

      // Update local store first
      updateBedInStore(bedToUpdate);

      try {
        // Then update on server
        const result = await bedService.updateBed(bedToUpdate);
        return result;
      } catch (error) {
        console.error("Failed to update bed on server:", error);
        return bedToUpdate;
      }
    },
    meta: {
      onSuccess: (updatedBed: Bed) => {
        // Update query cache
        queryClient.setQueryData(["beds"], (oldData: Bed[] = []) => {
          return mergeItems([
            updatedBed,
            ...oldData.filter((bed) => bed.id !== updatedBed.id),
          ]);
        });

        // Also update the individual bed query if it exists
        queryClient.setQueryData(["bed", updatedBed.id], updatedBed);

        // Invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["beds"] });
      },
    },
  });
};

// Delete a bed
export const useDeleteBedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteBedFromStore } = useBedStore();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from local store first
      deleteBedFromStore(id);

      try {
        // Then delete from server
        await bedService.deleteBed(id);
        return id;
      } catch (error) {
        console.error("Failed to delete bed from server:", error);
        return id;
      }
    },
    meta: {
      onSuccess: (id: string) => {
        // Remove from query cache
        queryClient.setQueryData(["beds"], (oldData: Bed[] = []) => {
          return oldData.filter((bed) => bed.id !== id);
        });

        // Remove the individual bed query if it exists
        queryClient.removeQueries({ queryKey: ["bed", id] });

        // Invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["beds"] });
      },
    },
  });
};
