import { useQuery } from "@tanstack/react-query";

import { listPhrases } from "@/features/tasbeeh/services/collectionsRepository";

import { tasbeehQueryKeys } from "../queryKeys";

export function usePhrasesQuery() {
  return useQuery({
    queryKey: tasbeehQueryKeys.phrases(),
    queryFn: () => listPhrases(),
    staleTime: Number.POSITIVE_INFINITY,
  });
}
