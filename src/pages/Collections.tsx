import { useQueries } from "@tanstack/react-query";
import React from "react";
import { useNavigate } from "react-router-dom";

import { CollectionsCardSlot } from "@/features/tasbeeh/collections/components/CollectionsCardSlot";
import { useCollections } from "@/features/tasbeeh/collections/hooks/useCollections";
import { tasbeehQueryKeys } from "@/features/tasbeeh/collections/queryKeys";
import { useCollectionsFilterStore } from "@/features/tasbeeh/collections/store/collectionsFilterStore";
import {
  applyCollectionListFilters,
  hasActiveCollectionFilters,
} from "@/features/tasbeeh/collections/utils/collectionListFilters";
import { getCollectionDetails } from "@/features/tasbeeh/services/collectionsRepository";
import { ErrorState } from "@/shared/design-system/ui/ErrorState";
import { Skeleton } from "@/shared/design-system/ui/Skeleton";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { ZeroState } from "@/shared/design-system/ui/ZeroState";

import { useLongPressTooltip } from "@/shared/design-system/hooks/useLongPressTooltip";
import { Tooltip } from "@/shared/design-system/ui/Tooltip";
import { Plus, SlidersHorizontal } from "lucide-react";

export default function Collections() {
  const navigate = useNavigate();
  const { isLoading, isListError, listError, collections } = useCollections();
  const listFilters = useCollectionsFilterStore((s) => s.filters);
  const resetFilters = useCollectionsFilterStore((s) => s.resetFilters);

  const filteredCollections = React.useMemo(
    () => applyCollectionListFilters(collections, listFilters),
    [collections, listFilters],
  );

  const filtersActive = hasActiveCollectionFilters(listFilters);

  const detailQueries = useQueries({
    queries: filteredCollections.map((c) => ({
      queryKey: tasbeehQueryKeys.collectionDetails(c.id),
      queryFn: () => getCollectionDetails(c.id),
    })),
  });

  const fabTip = useLongPressTooltip({ holdDelayMs: 420, visibleMs: 2000 });

  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4">
      {isListError ? (
        <ErrorState case="collections" message={listError?.message} />
      ) : isLoading ? (
        <>
          <Skeleton variant="collectionCard" />
          <Skeleton variant="collectionCard" />
        </>
      ) : collections.length === 0 ? (
        <ZeroState case="collections" />
      ) : (
        <>
          {filtersActive ? (
            <Squircle
              cornerRadius={20}
              cornerSmoothing={0.92}
              className="surface-card flex flex-wrap items-center justify-between gap-2 px-3 py-2.5"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <SlidersHorizontal
                  size={16}
                  className="shrink-0 text-base-content/45"
                  aria-hidden
                />
                <Text variant="caption" color="subtle" className="min-w-0 truncate">
                  {filteredCollections.length} of {collections.length} shown
                </Text>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  className="text-xs font-semibold text-primary"
                  onClick={() => navigate("/collections/filter")}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-xs font-semibold text-base-content/45"
                  onClick={() => resetFilters()}
                >
                  Clear
                </button>
              </div>
            </Squircle>
          ) : null}

          {filteredCollections.length === 0 ? (
            <Squircle
              cornerRadius={28}
              cornerSmoothing={0.92}
              className="surface-card flex flex-col gap-2 p-5 text-center"
            >
              <Text variant="heading" weight="semibold">
                No matches
              </Text>
              <Text variant="body" color="subtle" className="leading-relaxed">
                Nothing matches your filters. Try clearing them or adjusting the
                filter screen.
              </Text>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  className="text-sm font-semibold text-primary"
                  onClick={() => resetFilters()}
                >
                  Clear filters
                </button>
                <button
                  type="button"
                  className="text-sm font-semibold text-base-content/50"
                  onClick={() => navigate("/collections/filter")}
                >
                  Edit filters
                </button>
              </div>
            </Squircle>
          ) : (
            filteredCollections.map((c, index) => {
              const q = detailQueries[index];
              if (!q) return null;
              return (
                <CollectionsCardSlot
                  key={c.id}
                  collection={c}
                  detailQuery={q}
                />
              );
            })
          )}
        </>
      )}

      <div className="fixed inset-x-0 bottom-0 z-70 pointer-events-none">
        <div className="mx-auto flex w-full max-w-[480px] justify-end px-4 pb-[calc(112px+env(safe-area-inset-bottom,0px))] pointer-events-none">
          <Tooltip
            content="Add New Collection"
            open={fabTip.isOpen}
            placement="left"
            variant="neutral"
            trigger="manual"
          >
            <Squircle cornerRadius={15} cornerSmoothing={0.99} asChild>
              <button
                type="button"
                aria-label="Add new collection"
                {...fabTip.bind}
                onClick={() => {
                  if (fabTip.didLongPress) return;
                  navigate("/collections/new");
                }}
                className="pointer-events-auto inline-flex h-16 w-16 select-none touch-manipulation items-center justify-center bg-neutral text-2xl font-semibold leading-none text-white shadow-[0_14px_32px_rgba(0,0,0,0.28)]"
                style={{
                  WebkitTouchCallout: "none",
                  WebkitUserSelect: "none",
                  userSelect: "none",
                }}
              >
                <Plus />
              </button>
            </Squircle>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
