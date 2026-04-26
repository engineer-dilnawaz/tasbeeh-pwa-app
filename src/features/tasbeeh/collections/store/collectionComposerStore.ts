import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "@/shared/utils/indexedDbStorage";

import type { CollectionItemRole, TasbeehPhraseRow } from "@/features/tasbeeh/services/tasbeehDb";

import type { DraftItem, PhraseSheetMode } from "../types";

const ADD_ITEM_GUIDE_KEY = "tasbeeh.addItemSheet.hasGuided.v1";

const DEFAULT_TARGET_PRESETS = [33, 99, 100, 313, 1000] as const;

function clampTarget(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(9999, Math.round(value)));
}

function newDraftItemId() {
  return `draft_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export interface CollectionComposerState {
  draftItems: DraftItem[];
  isAddItemOpen: boolean;
  editingItemId: string | null;
  draftRole: CollectionItemRole;
  draftTarget: number;
  targetPresets: number[];
  isCustomTargetOpen: boolean;
  draftPhraseId: string | null;
  didAdjustAddItemTarget: boolean;
  didAdjustAddItemRole: boolean;
  isAddItemStepsTipOpen: boolean;
  isPhraseSheetOpen: boolean;
  phraseSheetMode: PhraseSheetMode;
  phraseQuery: string;
  phrasePickSelectedIds: string[];
  phraseSheetEditingId: string | null;
  isCreatePhraseTipOpen: boolean;
  pendingSelectTransliteration: string | null;
  hasSeenAddItemGuide: boolean;
}

export interface CollectionComposerActions {
  resetComposer: () => void;
  openAddItem: () => void;
  closeAddItem: () => void;
  openEditDraftItem: (it: DraftItem) => void;
  setDraftPhraseId: (id: string | null) => void;
  setDraftTarget: (n: number) => void;
  adjustDraftTarget: (delta: number) => void;
  addTargetPreset: (count: number) => void;
  toggleCustomTargetOpen: () => void;
  setDraftRole: (role: CollectionItemRole) => void;
  setDidAdjustAddItemTarget: (v: boolean) => void;
  setDidAdjustAddItemRole: (v: boolean) => void;
  setAddItemStepsTipOpen: (v: boolean) => void;
  togglePhrasePick: (id: string) => void;
  openPhrasePicker: () => void;
  removePhraseFromAddSelection: (phraseId: string) => void;
  beginPhraseLibraryEdit: (phrase: TasbeehPhraseRow) => void;
  closePhraseSheet: () => void;
  setPhraseSheetMode: (mode: PhraseSheetMode) => void;
  setPhraseQuery: (q: string) => void;
  setPhraseSheetEditingId: (id: string | null) => void;
  setCreatePhraseTipOpen: (v: boolean) => void;
  setPendingSelectTransliteration: (v: string | null) => void;
  markAddItemGuideSeen: () => void;
  addItemFromSheet: (phrase: TasbeehPhraseRow, targetCount: number) => void;
  addItemAndAnotherFromSheet: (phrase: TasbeehPhraseRow, targetCount: number) => void;
  removeDraftItem: (id: string) => void;
  syncDraftItemPhraseByPhraseId: (
    phraseId: string,
    phrase: TasbeehPhraseRow,
  ) => void;
  setPhrasePickSelectedIds: (ids: string[]) => void;
  openPhraseSheet: () => void;
}

const initialComposerState = (): CollectionComposerState => ({
  draftItems: [],
  isAddItemOpen: false,
  editingItemId: null,
  draftRole: "main",
  draftTarget: 33,
  targetPresets: [...DEFAULT_TARGET_PRESETS],
  isCustomTargetOpen: false,
  draftPhraseId: null,
  didAdjustAddItemTarget: false,
  didAdjustAddItemRole: false,
  isAddItemStepsTipOpen: false,
  isPhraseSheetOpen: false,
  phraseSheetMode: "pick_existing",
  phraseQuery: "",
  phrasePickSelectedIds: [],
  phraseSheetEditingId: null,
  isCreatePhraseTipOpen: false,
  pendingSelectTransliteration: null,
  hasSeenAddItemGuide: false,
});

export const useCollectionComposerStore = create<
  CollectionComposerState & CollectionComposerActions
>()(
  persist(
    (set, get) => ({
      ...initialComposerState(),

      resetComposer: () => set(initialComposerState()),

      openAddItem: () => {
        set((s) => {
          const targetPresets =
            s.draftItems.length > 0 ? s.targetPresets : [...DEFAULT_TARGET_PRESETS];
          return {
            editingItemId: null,
            draftPhraseId: null,
            draftRole: "main",
            draftTarget: 33,
            targetPresets,
            isCustomTargetOpen: false,
            didAdjustAddItemTarget: false,
            didAdjustAddItemRole: false,
            phraseSheetMode: "pick_existing",
            phrasePickSelectedIds: [],
            isAddItemOpen: true,
          };
        });
      },

      closeAddItem: () =>
        set({
          isAddItemOpen: false,
          editingItemId: null,
        }),

      openEditDraftItem: (it) =>
        set((s) => {
          const clamped = clampTarget(it.targetCount);
          const targetPresets = s.targetPresets.includes(clamped)
            ? s.targetPresets
            : [...s.targetPresets, clamped];
          return {
            editingItemId: it.id,
            draftPhraseId: it.phrase.id,
            draftTarget: clamped,
            draftRole: it.role,
            targetPresets,
            isCustomTargetOpen: false,
            didAdjustAddItemTarget: true,
            didAdjustAddItemRole: it.role !== "main",
            phraseSheetMode: "pick_existing",
            phrasePickSelectedIds: [it.phrase.id],
            isAddItemOpen: true,
          };
        }),

      setDraftPhraseId: (id) =>
        set({
          draftPhraseId: id,
          phrasePickSelectedIds: id ? [id] : [],
        }),

      setDraftTarget: (n) => set({ draftTarget: clampTarget(n) }),

      adjustDraftTarget: (delta) =>
        set((s) => ({ draftTarget: clampTarget(s.draftTarget + delta) })),

      addTargetPreset: (count) =>
        set((s) => {
          const clamped = clampTarget(count);
          if (s.targetPresets.includes(clamped)) return s;
          return { targetPresets: [...s.targetPresets, clamped] };
        }),

      toggleCustomTargetOpen: () =>
        set((s) => ({ isCustomTargetOpen: !s.isCustomTargetOpen })),

      setDraftRole: (role) => set({ draftRole: role }),

      setDidAdjustAddItemTarget: (v) => set({ didAdjustAddItemTarget: v }),

      setDidAdjustAddItemRole: (v) => set({ didAdjustAddItemRole: v }),

      setAddItemStepsTipOpen: (v) => set({ isAddItemStepsTipOpen: v }),

      togglePhrasePick: (id) =>
        set((s) => {
          if (s.phrasePickSelectedIds.length === 1 && s.phrasePickSelectedIds[0] === id) {
            return { phrasePickSelectedIds: [] };
          }
          return { phrasePickSelectedIds: [id] };
        }),

      openPhrasePicker: () =>
        set((s) => {
          const sole = s.draftPhraseId ?? s.phrasePickSelectedIds[0] ?? null;
          return {
            phraseSheetEditingId: null,
            phraseSheetMode: "pick_existing",
            phrasePickSelectedIds: sole ? [sole] : [],
            isPhraseSheetOpen: true,
          };
        }),

      removePhraseFromAddSelection: (phraseId) =>
        set((s) => {
          if (s.draftPhraseId !== phraseId) {
            return {
              phrasePickSelectedIds: s.phrasePickSelectedIds.filter((x) => x !== phraseId),
            };
          }
          return { phrasePickSelectedIds: [], draftPhraseId: null };
        }),

      beginPhraseLibraryEdit: (phrase) =>
        set({
          phraseSheetEditingId: phrase.id,
          phraseSheetMode: "create_new",
          isPhraseSheetOpen: true,
        }),

      closePhraseSheet: () =>
        set((s) => ({
          isPhraseSheetOpen: false,
          isCreatePhraseTipOpen: false,
          phraseSheetEditingId: null,
          phrasePickSelectedIds: s.draftPhraseId ? [s.draftPhraseId] : [],
        })),

      setPhraseSheetMode: (mode) => set({ phraseSheetMode: mode }),

      setPhraseQuery: (q) => set({ phraseQuery: q }),

      setPhraseSheetEditingId: (id) => set({ phraseSheetEditingId: id }),

      setCreatePhraseTipOpen: (v) => set({ isCreatePhraseTipOpen: v }),

      setPendingSelectTransliteration: (v) =>
        set({ pendingSelectTransliteration: v }),

      markAddItemGuideSeen: () => {
        set({ hasSeenAddItemGuide: true });
      },

      addItemFromSheet: (phrase, targetCount) => {
        const { editingItemId, hasSeenAddItemGuide } = get();
        if (editingItemId) {
          set((s) => ({
            draftItems: s.draftItems.map((it) =>
              it.id === editingItemId
                ? { ...it, phrase, role: s.draftRole, targetCount }
                : it,
            ),
            editingItemId: null,
            isAddItemOpen: false,
          }));
        } else {
          set((s) => ({
            draftItems: [
              ...s.draftItems,
              {
                id: newDraftItemId(),
                role: s.draftRole,
                phrase,
                targetCount,
              },
            ],
            isAddItemOpen: false,
          }));
          if (!hasSeenAddItemGuide) {
            get().markAddItemGuideSeen();
          }
        }
      },

      addItemAndAnotherFromSheet: (phrase, targetCount) => {
        const { editingItemId, hasSeenAddItemGuide } = get();
        if (editingItemId) return;
        set((s) => ({
          draftItems: [
            ...s.draftItems,
            {
              id: newDraftItemId(),
              role: s.draftRole,
              phrase,
              targetCount,
            },
          ],
          draftPhraseId: null,
          phrasePickSelectedIds: [],
        }));
        if (!hasSeenAddItemGuide) {
          get().markAddItemGuideSeen();
        }
      },

      removeDraftItem: (id) =>
        set((s) => ({
          draftItems: s.draftItems.filter((it) => it.id !== id),
          editingItemId: s.editingItemId === id ? null : s.editingItemId,
        })),

      syncDraftItemPhraseByPhraseId: (phraseId, phrase) =>
        set((s) => ({
          draftItems: s.draftItems.map((it) =>
            it.phrase.id === phraseId ? { ...it, phrase } : it,
          ),
        })),

      setPhrasePickSelectedIds: (ids) =>
        set({
          phrasePickSelectedIds: ids.length <= 1 ? ids : [ids[0]!],
        }),

      openPhraseSheet: () => set({ isPhraseSheetOpen: true }),
    }),
    {
      name: "collection-composer-storage",
      storage: createJSONStorage(() => indexedDbStorage),
      partialize: (state) => ({ hasSeenAddItemGuide: state.hasSeenAddItemGuide }),
    },
  ),
);
