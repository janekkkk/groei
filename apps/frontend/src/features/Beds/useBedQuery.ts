import type { Bed } from "@groei/common/src/models/Bed";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bedService } from "@/features/Beds/bed.service";
import { useBedStore } from "@/features/Beds/beds.store";

// Fetch all beds
export const useBedsQuery = () => {
  const { setBeds } = useBedStore();

  return useQuery({
    queryKey: ["beds"],
    queryFn: async () => {
      const beds = await bedService.fetchBeds();
      setBeds(beds);
      return beds;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Fetch a single bed
export const useBedQuery = (id: string) => {
  return useQuery({
    queryKey: ["bed", id],
    queryFn: () => bedService.fetchBed(id),
    enabled: !!id,
  });
};

// Create a bed
export const useCreateBedMutation = () => {
  const queryClient = useQueryClient();
  const { setBeds } = useBedStore();

  return useMutation({
    mutationFn: (newBed: Bed) => bedService.createBed(newBed),
    onSuccess: (createdBed) => {
      // Update list query
      queryClient.setQueryData(["beds"], (oldBeds: Bed[] = []) => [
        createdBed,
        ...oldBeds,
      ]);
      // Update store
      setBeds((prev) => [createdBed, ...prev]);
    },
  });
};

// Update a bed
export const useUpdateBedMutation = () => {
  const queryClient = useQueryClient();
  const { updateBed } = useBedStore();

  return useMutation({
    mutationFn: (updatedBed: Bed) => bedService.updateBed(updatedBed),
    onSuccess: (result) => {
      queryClient.setQueryData(["beds"], (oldBeds: Bed[] = []) =>
        oldBeds.map((b) => (b.id === result.id ? result : b)),
      );
      queryClient.setQueryData(["bed", result.id], result);
      updateBed(result);
    },
  });
};

// Delete a bed
export const useDeleteBedMutation = () => {
  const queryClient = useQueryClient();
  const { removeBed } = useBedStore();

  return useMutation({
    mutationFn: (id: string) => bedService.deleteBed(id),
    onSuccess: (_result, deletedId) => {
      queryClient.setQueryData(["beds"], (oldBeds: Bed[] = []) =>
        oldBeds.filter((b) => b.id !== deletedId),
      );
      queryClient.removeQueries({ queryKey: ["bed", deletedId] });
      removeBed(deletedId);
    },
  });
};
