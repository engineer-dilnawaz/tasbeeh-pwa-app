import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPhrase,
  updatePhrase,
} from "@/features/tasbeeh/services/collectionsRepository";
import type { TasbeehPhraseRow } from "@/features/tasbeeh/services/tasbeehDb";

import { tasbeehQueryKeys } from "../queryKeys";

type PhraseDraft = Pick<TasbeehPhraseRow, "transliteration"> &
  Partial<Pick<TasbeehPhraseRow, "arabic" | "translation">>;

export function useCreatePhraseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: PhraseDraft) => createPhrase(draft),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: tasbeehQueryKeys.phrases() });
    },
  });
}

export function useUpdatePhraseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: string; draft: PhraseDraft }) =>
      updatePhrase(args.id, args.draft),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: tasbeehQueryKeys.phrases() });
    },
  });
}
