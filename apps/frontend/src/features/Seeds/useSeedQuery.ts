import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Seed } from "@groei/common/src/models/Seed";
import { seedService } from "@/features/Seeds/seed.service";
import { useSeedStore } from "@/features/Seeds/seeds.store";
import { mergeItems } from "@/shared/merge.helper";

// Fetch seeds
export const useSeedsQuery = () => {
  const { setSeeds, seeds } = useSeedStore((state) => state);

  return useQuery({
    queryKey: ["seeds"],
    queryFn: async () => {
      try {
        const fetchedSeeds = await seedService.fetchSeeds();
        console.log("fetch seeds");

        // Merge local with external seeds so no data is lost
        // Priority given to server data (fetchedSeeds)
        const merged = mergeItems([...fetchedSeeds, ...seeds]);

        if (Array.isArray(fetchedSeeds)) {
          console.log(
            `Setting ${merged.length} seeds after merging ${seeds.length} local and ${fetchedSeeds.length} server seeds`,
          );
          setSeeds(merged);
          return merged;
        } else throw Error("Invalid response");
      } catch (error) {
        console.error("Error fetching seeds", error);
        // Return local seeds if server fetch fails
        return seeds;
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

// Fetch a single seed
export const useSeedQuery = (id: string) => {
  const { updateSeedInStore } = useSeedStore((state) => state);

  return useQuery({
    queryKey: ["seed", id],
    queryFn: async () => {
      const seed = await seedService.fetchSeed(id);
      if (seed.id) {
        updateSeedInStore(seed);
        return seed;
      }
      return null;
    },
    enabled: !!id,
  });
};

// Create a seed
export const useCreateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { addSeedToStore } = useSeedStore((state) => state);

  return useMutation({
    mutationFn: async (newSeed: Seed) => {
      console.log("create seed", { newSeed });

      // First add to store for immediate UI update
      addSeedToStore(newSeed);

      // Then persist to server
      try {
        const createdSeed = await seedService.createSeed(newSeed);
        return createdSeed;
      } catch (error) {
        console.error("Failed to save seed to server", error);
        // We still return the local seed to keep the UI working
        return newSeed;
      }
    },
    onSuccess: () => {
      // Invalidate to trigger a refresh of the seeds data
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
    },
  });
};

// Update a seed
export const useUpdateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { updateSeedInStore } = useSeedStore((state) => state);

  return useMutation({
    mutationFn: async (updatedSeed: Seed) => {
      // Update local store first for immediate UI feedback
      updateSeedInStore(updatedSeed);

      // Then update on server
      try {
        const result = await seedService.updateSeed(updatedSeed);
        return result;
      } catch (error) {
        console.error("Failed to update seed on server", error);
        return updatedSeed;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
    },
  });
};

// Delete a seed
export const useDeleteSeedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteSeedFromStore } = useSeedStore((state) => state);

  return useMutation({
    mutationFn: async (id: string) => {
      // Delete from local store first
      deleteSeedFromStore(id);

      // Then delete from server
      try {
        await seedService.deleteSeed(id);
      } catch (error) {
        console.error("Failed to delete seed from server", error);
        // We don't restore the seed locally as that could be confusing
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] });
    },
  });
};
