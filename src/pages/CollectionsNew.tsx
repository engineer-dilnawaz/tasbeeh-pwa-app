import React from "react";
import { useNavigate } from "react-router-dom";

import {
  CollectionComposerForm,
  useCollectionComposerStore,
  useCreateCollectionMutation,
  usePhrasesQuery,
} from "@/features/tasbeeh/collections";

import { Text } from "@/shared/design-system/ui/Text";

export default function CollectionsNew() {
  const navigate = useNavigate();
  const { data: phrases = [], isPending, isError, error } = usePhrasesQuery();
  const createCollectionMutation = useCreateCollectionMutation();

  React.useEffect(
    () => () => {
      useCollectionComposerStore.getState().resetComposer();
    },
    [],
  );

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] items-center justify-center px-4">
        <Text variant="body" color="subtle">
          Loading phrases…
        </Text>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col items-center justify-center gap-2 px-4">
        <Text variant="body" weight="semibold">
          Could not load phrases
        </Text>
        <Text variant="caption" color="subtle" className="text-center">
          {error instanceof Error ? error.message : "Unknown error"}
        </Text>
      </div>
    );
  }

  return (
    <CollectionComposerForm
      phrases={phrases}
      onSubmit={async (draft) => {
        await createCollectionMutation.mutateAsync(draft);
        navigate("/collections", { replace: true });
      }}
    />
  );
}
