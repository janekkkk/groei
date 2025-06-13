import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Seed } from "@groei/common/src/models/Seed";
import { seedService } from "@/features/Seeds/seed.service";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { mergeItems } from "@/shared/merge.helper";

// Fetch seeds with consistent prioritization of server data
export const useSeedsQuery = () => {
  const { setSeeds, seeds } = useSeedStore((state) => state);

  return useQuery({
    queryKey: ["seeds"],
    queryFn: async () => {
      try {
        const fetchedSeeds = await seedService.fetchSeeds();

        if (!Array.isArray(fetchedSeeds)) {
          throw Error("Invalid response from server");
        }

        // Important: Convert dates properly for correct comparison in mergeItems
        const normalizedServerSeeds = fetchedSeeds.map((seed) => ({
          ...seed,
          createdAt: new Date(seed.createdAt),
          updatedAt: new Date(seed.updatedAt),
          deletedAt: seed.deletedAt ? new Date(seed.deletedAt) : undefined,
        }));

        // When merging, mergeItems will select the most recently updated version of each item
        const merged = mergeItems([...normalizedServerSeeds, ...seeds]);

        console.log(
          `Merged seeds: server=${fetchedSeeds.length}, local=${seeds.length}, result=${merged.length}`,
        );

        // Update the store with the merged results
        setSeeds(merged);

        return merged;
      } catch (error) {
        console.error("Error fetching seeds:", error);
        // Return current seeds on error to avoid disrupting the UI
        return seeds;
      }
    },
    // Force refresh on component mount and window focus
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    // More frequent refetching for better sync (every minute)
    refetchInterval: 60000,
  });
};

// Fetch a single seed
export const useSeedQuery = (id: string) => {
  const { updateSeedInStore, seeds } = useSeedStore();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["seed", id],
    queryFn: async () => {
      try {
        const seed = await seedService.fetchSeed(id);

        if (seed && seed.id) {
          // Normalize dates for proper comparison
          const normalizedSeed = {
            ...seed,
            createdAt: new Date(seed.createdAt),
            updatedAt: new Date(seed.updatedAt),
            deletedAt: seed.deletedAt ? new Date(seed.deletedAt) : undefined,
          };

          // Update in store
          updateSeedInStore(normalizedSeed);

          // Also update in query cache to ensure consistency
          queryClient.setQueryData(["seeds"], (oldData: Seed[] = []) => {
            return mergeItems([normalizedSeed, ...oldData]);
          });

          return normalizedSeed;
        }

        // If server fetch fails, return from local store
        const localSeed = seeds.find((s) => s.id === id);
        return localSeed || null;
      } catch (error) {
        console.error(`Error fetching seed ${id}:`, error);
        // Return from local store on error
        return seeds.find((s) => s.id === id) || null;
      }
    },
    enabled: !!id,
  });
};

// Create a seed
export const useCreateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { addSeedToStore } = useSeedStore();

  return useMutation({
    mutationFn: async (newSeed: Seed) => {
      // Ensure dates are properly set
      const seedToCreate = {
        ...newSeed,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // First update local store for immediate UI response
      addSeedToStore(seedToCreate);

      try {
        // Then persist to server
        const createdSeed = await seedService.createSeed(seedToCreate);
        return createdSeed;
      } catch (error) {
        console.error("Failed to create seed on server:", error);
        // Still return the local version so UI remains functional
        return seedToCreate;
      }
    },
    meta: {
      onSuccess: (createdSeed: Seed) => {
        // Update query cache
        queryClient.setQueryData(["seeds"], (oldData: Seed[] = []) => {
          return mergeItems([createdSeed, ...oldData]);
        });

        // Invalidate to trigger a refresh
        queryClient.invalidateQueries({ queryKey: ["seeds"] });
      },
    },
  });
};

// Update a seed
export const useUpdateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { updateSeedInStore } = useSeedStore();

  return useMutation({
    mutationFn: async (updatedSeed: Seed) => {
      // Always update the timestamp when making changes
      const seedToUpdate = {
        ...updatedSeed,
        updatedAt: new Date(),
      };

      // Update local store first
      updateSeedInStore(seedToUpdate);

      try {
        // Then update on server
        const result = await seedService.updateSeed(seedToUpdate);
        return result;
      } catch (error) {
        console.error("Failed to update seed on server:", error);
        return seedToUpdate;
      }
    },
    meta: {
      onSuccess: (updatedSeed: Seed) => {
        // Update query cache
        queryClient.setQueryData(["seeds"], (oldData: Seed[] = []) => {
          return mergeItems([
            updatedSeed,
            ...oldData.filter((seed) => seed.id !== updatedSeed.id),
          ]);
        });

        // Also update the individual seed query if it exists
        queryClient.setQueryData(["seed", updatedSeed.id], updatedSeed);

        // Invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["seeds"] });
      },
    },
  });
};

// Delete a seed
export const useDeleteSeedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteSeedFromStore } = useSeedStore();

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from local store first
      deleteSeedFromStore(id);

      try {
        // Then delete from server
        await seedService.deleteSeed(id);
        return id;
      } catch (error) {
        console.error("Failed to delete seed from server:", error);
        return id;
      }
    },
    meta: {
      onSuccess: (id: string) => {
        // Remove from query cache
        queryClient.setQueryData(["seeds"], (oldData: Seed[] = []) => {
          return oldData.filter((seed) => seed.id !== id);
        });

        // Remove the individual seed query if it exists
        queryClient.removeQueries({ queryKey: ["seed", id] });

        // Invalidate to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["seeds"] });
      },
    },
  });
};
