import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tasbeehRepository } from "../api/tasbeeh.repository";
import type { TasbeehSequenceDoc } from "@/shared/types/tasbeehCatalog";

export const TASBEEH_QUERY_KEYS = {
  catalog: ["tasbeeh", "catalog"] as const,
  unsynced: ["tasbeeh", "unsynced"] as const,
};

/**
 * Hook to retrieve the tasbeeh catalog.
 * Flattening into a simple Tasbeeh list for backwards compatibility 
 * with existing Home Counter components.
 */
export function useTasbeehCatalog() {
  const query = useQuery({
    queryKey: TASBEEH_QUERY_KEYS.catalog,
    queryFn: () => tasbeehRepository.getAll(),
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
  });

  // Pull items from the sequences for the local app to consume
  const flattened = query.data?.flatMap(seq => seq.items) ?? [];
  
  return {
    ...query,
    data: flattened,
    sequences: query.data, // Access to raw sequences if needed
  };
}

/**
 * Mutation hook to save a collection (Sequence).
 */
export function useSaveSequence() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (_seq: TasbeehSequenceDoc) => {
        // Simple shim if we want to save local only first
        return Promise.resolve(); // we don't handle local sequence editing here yet
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: TASBEEH_QUERY_KEYS.catalog });
    },
  });
}

/**
 * Hook to manually trigger a sync of pending collections.
 */
export function useTasbeehSync() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => tasbeehRepository.syncPending(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASBEEH_QUERY_KEYS.catalog });
    },
  });
}
