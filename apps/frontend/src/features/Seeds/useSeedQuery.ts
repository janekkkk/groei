import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

        // Merge local with external seeds so no data is lost.
        const merged = mergeItems([...seeds, ...fetchedSeeds]);
        console.log({ seeds, fetchedSeeds, merged });

        if (Array.isArray(fetchedSeeds)) setSeeds(merged);
        else throw Error("Invalid response");
      } catch (error) {
        console.error("Error fetching seeds", error);
      }
    },
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
      }
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
      addSeedToStore(newSeed);
      seedService.createSeed(newSeed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] }); // Refetch seeds
    },
  });
};

// Update a seed
export const useUpdateSeedMutation = () => {
  const queryClient = useQueryClient();
  const { updateSeedInStore } = useSeedStore((state) => state);

  return useMutation({
    mutationFn: async (updatedSeed: Seed) => {
      updateSeedInStore(updatedSeed);
      seedService.updateSeed(updatedSeed);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] }); // Refetch seeds
    },
  });
};

// Delete a seed
export const useDeleteSeedMutation = () => {
  const queryClient = useQueryClient();
  const { deleteSeedFromStore } = useSeedStore((state) => state);

  return useMutation({
    mutationFn: async (id: string) => {
      deleteSeedFromStore(id);
      seedService.deleteSeed(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seeds"] }); // Refetch seeds
    },
  });
};
