import type { Seed } from "@groei/common/src/models/Seed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { seedService } from "@/features/Seeds/seed.service";
import { useSeedStore } from "@/features/Seeds/seeds.store";

// Fetch all seeds
export const useSeedsQuery = () => {
  const { setSeeds } = useSeedStore();

  return useQuery({
    queryKey: ["seeds"],
    queryFn: async () => {
      const seeds = await seedService.fetchSeeds();
      setSeeds(seeds);
      return seeds;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch a single seed
export const useSeedQuery = (id: string) => {
  return useQuery({
    queryKey: ["seed", id],
    queryFn: () => seedService.fetchSeed(id),
    enabled: !!id,
  });
};

// Create a seed
export const useCreateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { setSeeds } = useSeedStore();

  return useMutation({
    mutationFn: (newSeed: Seed) => seedService.createSeed(newSeed),
    onSuccess: (createdSeed) => {
      // Update list query
      queryClient.setQueryData(["seeds"], (oldSeeds: Seed[] = []) => [
        createdSeed,
        ...oldSeeds,
      ]);
      // Update store
      setSeeds((prev) => [createdSeed, ...prev]);
    },
  });
};

// Update a seed
export const useUpdateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { updateSeed } = useSeedStore();

  return useMutation({
    mutationFn: (updatedSeed: Seed) => seedService.updateSeed(updatedSeed),
    onSuccess: (result) => {
      queryClient.setQueryData(["seeds"], (oldSeeds: Seed[] = []) =>
        oldSeeds.map((s) => (s.id === result.id ? result : s)),
      );
      queryClient.setQueryData(["seed", result.id], result);
      updateSeed(result);
    },
  });
};

// Delete a seed
export const useDeleteSeedMutation = () => {
  const queryClient = useQueryClient();
  const { removeSeed } = useSeedStore();

  return useMutation({
    mutationFn: (id: string) => seedService.deleteSeed(id),
    onSuccess: (_result, deletedId) => {
      queryClient.setQueryData(["seeds"], (oldSeeds: Seed[] = []) =>
        oldSeeds.filter((s) => s.id !== deletedId),
      );
      queryClient.removeQueries({ queryKey: ["seed", deletedId] });
      removeSeed(deletedId);
    },
  });
};
