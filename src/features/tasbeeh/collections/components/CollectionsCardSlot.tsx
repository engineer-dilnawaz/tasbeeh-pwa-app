import type { UseQueryResult } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

import { getCollectionDetails } from "@/features/tasbeeh/services/collectionsRepository";
import type { TasbeehCollectionGroupRow } from "@/features/tasbeeh/services/tasbeehDb";
import { Skeleton } from "@/shared/design-system/ui/Skeleton";

import { CollectionsCard } from "./CollectionsCard";

type CollectionDetails = Awaited<ReturnType<typeof getCollectionDetails>>;

const EASE = [0.22, 1, 0.36, 1] as const;

interface CollectionsCardSlotProps {
  collection: TasbeehCollectionGroupRow;
  detailQuery: UseQueryResult<CollectionDetails, Error>;
  onAddToDaily: (collection: any) => void;
}

/**
 * Skeleton and real card must not share one layout box: the skeleton is always
 * “full” height while some cards are shorter (e.g. no recitation block), which made
 * `max(skeleton, card)` leave a huge empty gap before the next list item.
 * We mount one at a time (`AnimatePresence` + `mode="wait"`) so list height always
 * matches the visible block only.
 */
export function CollectionsCardSlot({
  collection,
  detailQuery,
  onAddToDaily,
}: CollectionsCardSlotProps) {
  const showSkeleton = detailQuery.isPending && detailQuery.data == null;

  return (
    <div className="relative w-full min-w-0">
      <AnimatePresence initial={false} mode="wait">
        {showSkeleton ? (
          <motion.div
            key={`${collection.id}-skeleton`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="w-full"
          >
            <Skeleton variant="collectionCard" />
          </motion.div>
        ) : (
          <motion.div
            key={`${collection.id}-card`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="w-full"
          >
            <CollectionsCard
              collection={collection}
              details={detailQuery.data ?? null}
              onAddToDaily={onAddToDaily}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
