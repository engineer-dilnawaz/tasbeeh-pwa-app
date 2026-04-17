import { useQuery } from "@tanstack/react-query";

import { listCollections } from "@/features/tasbeeh/services/collectionsRepository";
import type { TasbeehCollectionGroupRow } from "@/features/tasbeeh/services/tasbeehDb";

import { tasbeehQueryKeys } from "../queryKeys";

interface CollectionsState {
  isLoading: boolean;
  collections: TasbeehCollectionGroupRow[];
  isListError: boolean;
  listError: Error | null;
}

export function useCollections(): CollectionsState {
  const listQuery = useQuery({
    queryKey: tasbeehQueryKeys.collections(),
    queryFn: () => listCollections(),
  });

  return {
    isLoading: listQuery.isPending,
    collections: listQuery.data ?? [],
    isListError: listQuery.isError,
    listError:
      listQuery.error instanceof Error ? listQuery.error : null,
  };
}
