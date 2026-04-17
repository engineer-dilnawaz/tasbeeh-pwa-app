import React from "react";
import { Pencil, Plus, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Control } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

import { useCollectionComposerStore } from "../store/collectionComposerStore";
import type { CollectionFormValues } from "./CollectionComposerForm";

interface DraftTasbeehItemsSectionProps {
  control: Control<CollectionFormValues>;
}

export function DraftTasbeehItemsSection({
  control,
}: DraftTasbeehItemsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const draftItems = useCollectionComposerStore((s) => s.draftItems);
  const openAddItem = useCollectionComposerStore((s) => s.openAddItem);
  const openEditDraftItem = useCollectionComposerStore((s) => s.openEditDraftItem);
  const removeDraftItem = useCollectionComposerStore((s) => s.removeDraftItem);

  return (
    <Squircle
      cornerRadius={28}
      cornerSmoothing={0.92}
      className="surface-card p-4"
    >
      <FormField
        control={control}
        name="itemsCount"
        rules={{
          validate: (v) =>
            v > 0 ? true : "Add at least one tasbeeh item.",
        }}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center justify-between">
              <FormLabel required>Tasbeeh list</FormLabel>
              {draftItems.length > 0 ? (
                <button
                  type="button"
                  onClick={() => openAddItem()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-primary/10 px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                >
                  <Plus size={18} />
                  Add more
                </button>
              ) : null}
            </div>
            <FormControl>
              <input type="hidden" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {draftItems.length === 0 ? (
        <Squircle
          cornerRadius={20}
          cornerSmoothing={0.9}
          className="mt-3 px-4 py-7 text-center shadow-[inset_0_0_0_1px_hsl(var(--bc)/0.12)]"
        >
          <Text variant="body" weight="medium">
            No tasbeeh yet
          </Text>
          <Text variant="body" color="subtle" className="mt-1">
            Add at least one tasbeeh to create this collection.
          </Text>
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => openAddItem()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-primary/25 bg-transparent px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
            >
              <Plus size={16} />
              Add tasbeeh item
            </button>
          </div>
        </Squircle>
      ) : (
        <ul className="mt-3 list-none space-y-3 p-0">
          {draftItems.map((it) => (
            <motion.li
              key={it.id}
              layout
              whileTap={
                prefersReducedMotion ? undefined : { scale: 0.995 }
              }
              transition={{ duration: 0.12, ease: "easeOut" }}
            >
              <Squircle
                cornerRadius={20}
                cornerSmoothing={0.92}
                className="border border-base-content/10 bg-base-200/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-base font-semibold text-base-content">
                      {it.phrase.transliteration}
                    </div>
                    {it.phrase.translation ? (
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-base-content/65">
                        {it.phrase.translation}
                      </p>
                    ) : null}
                    {it.phrase.arabic ? (
                      <p
                        dir="rtl"
                        lang="ar"
                        className="mt-2 w-full text-right text-sm font-medium leading-relaxed wrap-break-word text-base-content/80"
                      >
                        {it.phrase.arabic}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEditDraftItem(it)}
                      aria-label="Edit item"
                      className="btn btn-square btn-ghost btn-sm text-base-content/70"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeDraftItem(it.id)}
                      aria-label="Remove from list"
                      className="btn btn-square btn-ghost btn-sm text-base-content/55 hover:text-error"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-base-content/12 bg-base-100/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-base-content/55">
                    {it.role}
                  </span>
                  <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    Target {it.targetCount}
                  </span>
                </div>
              </Squircle>
            </motion.li>
          ))}
        </ul>
      )}
    </Squircle>
  );
}
