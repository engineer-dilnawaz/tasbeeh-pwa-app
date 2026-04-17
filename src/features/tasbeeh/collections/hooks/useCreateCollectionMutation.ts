import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCollection } from "@/features/tasbeeh/services/collectionsRepository";

import type { CreateCollectionDraft } from "../types";
import { tasbeehQueryKeys } from "../queryKeys";

export function useCreateCollectionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (draft: CreateCollectionDraft) => {
      const created = await createCollection({
        title: draft.title,
        description: draft.description,
        scheduleType: draft.scheduleType,
        timesPerDay: draft.timesPerDay,
        slots: draft.slots,
        slotExpiryPolicy: draft.slotExpiryPolicy,
        priority: draft.priority,
        reminderPolicy: draft.reminderPolicy,
        tags: draft.tags,
        reference: draft.reference ?? undefined,
        items: draft.items,
      });
      await queryClient.invalidateQueries({
        queryKey: tasbeehQueryKeys.collections(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["tasbeeh", "collection"],
      });
      return created;
    },
  });
}
