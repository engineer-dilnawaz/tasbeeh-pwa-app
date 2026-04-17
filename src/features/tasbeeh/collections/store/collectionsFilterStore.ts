import { create } from "zustand";

import {
  defaultCollectionListFilters,
  type CollectionListFilters,
} from "@/features/tasbeeh/collections/utils/collectionListFilters";

interface CollectionsFilterState {
  filters: CollectionListFilters;
  setFilters: (filters: CollectionListFilters) => void;
  resetFilters: () => void;
}

export const useCollectionsFilterStore = create<CollectionsFilterState>()(
  (set) => ({
    filters: { ...defaultCollectionListFilters },
    setFilters: (filters) => set({ filters: { ...filters } }),
    resetFilters: () => set({ filters: { ...defaultCollectionListFilters } }),
  }),
);
