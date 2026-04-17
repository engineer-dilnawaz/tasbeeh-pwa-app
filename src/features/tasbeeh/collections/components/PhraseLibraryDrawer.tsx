import React from "react";
import { Info } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";

import { Drawer } from "@/shared/design-system/ui/Drawer";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { TextInput } from "@/shared/design-system/ui/TextInput";
import { Tooltip } from "@/shared/design-system/ui/Tooltip";
import { toast } from "@/shared/design-system/ui/useToast";

import type { TasbeehPhraseRow } from "@/features/tasbeeh/services/tasbeehDb";

import {
  useCreatePhraseMutation,
  useUpdatePhraseMutation,
} from "../hooks/usePhraseMutations";
import { useCollectionComposerStore } from "../store/collectionComposerStore";
import { filterArabicScriptInput } from "../utils/phraseFormUtils";

interface PhraseCreateFormValues {
  transliteration: string;
  arabic: string;
  translation: string;
}

interface PhraseLibraryDrawerProps {
  phrases: TasbeehPhraseRow[];
}

export function PhraseLibraryDrawer({ phrases }: PhraseLibraryDrawerProps) {
  const prefersReducedMotion = useReducedMotion();
  const createMutation = useCreatePhraseMutation();
  const updateMutation = useUpdatePhraseMutation();

  const phraseCreateForm = useForm<PhraseCreateFormValues>({
    mode: "onSubmit",
    defaultValues: {
      transliteration: "",
      arabic: "",
      translation: "",
    },
  });

  const isPhraseSheetOpen = useCollectionComposerStore(
    (s) => s.isPhraseSheetOpen,
  );
  const closePhraseSheet = useCollectionComposerStore((s) => s.closePhraseSheet);
  const phraseSheetMode = useCollectionComposerStore((s) => s.phraseSheetMode);
  const phraseQuery = useCollectionComposerStore((s) => s.phraseQuery);
  const phrasePickSelectedIds = useCollectionComposerStore(
    (s) => s.phrasePickSelectedIds,
  );
  const draftItems = useCollectionComposerStore((s) => s.draftItems);
  const editingItemId = useCollectionComposerStore((s) => s.editingItemId);
  const phraseSheetEditingId = useCollectionComposerStore(
    (s) => s.phraseSheetEditingId,
  );
  const isCreatePhraseTipOpen = useCollectionComposerStore(
    (s) => s.isCreatePhraseTipOpen,
  );
  const setDraftPhraseId = useCollectionComposerStore((s) => s.setDraftPhraseId);

  const setPhraseSheetMode = useCollectionComposerStore(
    (s) => s.setPhraseSheetMode,
  );
  const setPhraseQuery = useCollectionComposerStore((s) => s.setPhraseQuery);
  const setPhraseSheetEditingId = useCollectionComposerStore(
    (s) => s.setPhraseSheetEditingId,
  );
  const setCreatePhraseTipOpen = useCollectionComposerStore(
    (s) => s.setCreatePhraseTipOpen,
  );
  const togglePhrasePick = useCollectionComposerStore((s) => s.togglePhrasePick);
  const syncDraftItemPhraseByPhraseId = useCollectionComposerStore(
    (s) => s.syncDraftItemPhraseByPhraseId,
  );

  const phraseSheetEditingIdRef = React.useRef<string | null>(null);
  React.useLayoutEffect(() => {
    phraseSheetEditingIdRef.current = phraseSheetEditingId;
  }, [phraseSheetEditingId]);

  const createPhraseTipRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!isCreatePhraseTipOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = createPhraseTipRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setCreatePhraseTipOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
    };
  }, [isCreatePhraseTipOpen, setCreatePhraseTipOpen]);

  React.useEffect(() => {
    if (phraseSheetMode !== "create_new") setCreatePhraseTipOpen(false);
  }, [phraseSheetMode, setCreatePhraseTipOpen]);

  const lastPhraseFormSeedId = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (!phraseSheetEditingId || phraseSheetMode !== "create_new") {
      lastPhraseFormSeedId.current = null;
      return;
    }
    const p = phrases.find((x) => x.id === phraseSheetEditingId) ?? null;
    if (!p) return;
    if (lastPhraseFormSeedId.current === phraseSheetEditingId) return;
    lastPhraseFormSeedId.current = phraseSheetEditingId;
    phraseCreateForm.reset({
      transliteration: p.transliteration,
      arabic: p.arabic ?? "",
      translation: p.translation ?? "",
    });
  }, [phraseSheetEditingId, phraseSheetMode, phrases, phraseCreateForm]);

  const filteredPickPhrases = React.useMemo(() => {
    const usedPhraseIds = new Set(draftItems.map((it) => it.phrase.id));
    const editingItem =
      editingItemId != null
        ? draftItems.find((it) => it.id === editingItemId) ?? null
        : null;
    const editingPhraseId = editingItem?.phrase.id ?? null;

    const qTrim = phraseQuery.trim();
    const base = phrases.filter((p) => {
      if (!editingItemId) {
        return !usedPhraseIds.has(p.id);
      }
      if (editingPhraseId && p.id === editingPhraseId) return true;
      return !usedPhraseIds.has(p.id);
    });
    if (!qTrim) return base;
    const q = qTrim.toLowerCase();
    const qRaw = qTrim;
    return base.filter(
      (p) =>
        p.transliteration.toLowerCase().includes(q) ||
        (p.translation ?? "").toLowerCase().includes(q) ||
        (p.arabic ?? "").includes(qRaw),
    );
  }, [draftItems, editingItemId, phrases, phraseQuery]);

  const showPickPhraseNoResults =
    phraseSheetMode === "pick_existing" &&
    phraseQuery.trim().length > 0 &&
    filteredPickPhrases.length === 0;

  const handleClose = () => {
    closePhraseSheet();
    phraseCreateForm.reset({
      transliteration: "",
      arabic: "",
      translation: "",
    });
  };

  const handleUseThisPhrase = () => {
    const id = phrasePickSelectedIds[0];
    if (!id) return;
    setDraftPhraseId(id);
    handleClose();
  };

  return (
    <Drawer
      isOpen={isPhraseSheetOpen}
      onClose={handleClose}
      title="Phrase"
      snapPoints={["80%"]}
      scrollable={false}
      presentation="height"
      contentPaddingBottomPx={0}
    >
      <div className="relative flex h-full min-h-0 flex-col">
        <div
          className={`flex-1 overflow-y-auto no-scrollbar px-3 pt-0 ${
            phraseSheetMode === "create_new"
              ? "pb-[calc(124px+env(safe-area-inset-bottom,0px))]"
              : "pb-[calc(88px+env(safe-area-inset-bottom,0px))]"
          }`}
        >
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card px-4 py-4"
          >
            <SegmentedControl
              value={phraseSheetMode}
              onChange={(v) => {
                setPhraseSheetMode(v);
                if (v === "pick_existing") {
                  setPhraseSheetEditingId(null);
                  phraseCreateForm.reset({
                    transliteration: "",
                    arabic: "",
                    translation: "",
                  });
                } else if (v === "create_new" && !phraseSheetEditingIdRef.current) {
                  phraseCreateForm.reset({
                    transliteration: "",
                    arabic: "",
                    translation: "",
                  });
                }
              }}
              options={[
                { value: "pick_existing", label: "Pick existing" },
                { value: "create_new", label: "Create new" },
              ]}
              size="sm"
              uppercase={false}
              activeTextClassName="text-base-content"
            />

            <AnimatePresence mode="wait" initial={false}>
              {phraseSheetMode === "pick_existing" ? (
                <motion.div
                  key="phrase-pick"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -8 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="mt-4">
                    <TextInput
                      label="Search"
                      value={phraseQuery}
                      onChange={(e) => setPhraseQuery(e.target.value)}
                      placeholder="Search phrases…"
                      variant="ghost"
                      className="bg-base-200"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    {showPickPhraseNoResults ? (
                      <Squircle
                        cornerRadius={20}
                        cornerSmoothing={0.92}
                        className="bg-base-200 px-4 py-5"
                      >
                        <Text variant="body" weight="semibold">
                          No phrases found
                        </Text>
                        <Text
                          variant="caption"
                          color="subtle"
                          className="mt-2 max-w-prose leading-snug"
                        >
                          Nothing in your library matches this search. Start
                          adding it by tapping the button below.
                        </Text>
                        <div className="mt-4">
                          <Squircle
                            cornerRadius={100}
                            cornerSmoothing={0.92}
                            asChild
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setPhraseSheetEditingId(null);
                                phraseCreateForm.reset({
                                  transliteration: phraseQuery.trim(),
                                  arabic: "",
                                  translation: "",
                                });
                                setPhraseSheetMode("create_new");
                              }}
                              className="flex h-12 w-full items-center justify-center bg-primary/15 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/25"
                            >
                              Add this phrase
                            </button>
                          </Squircle>
                        </div>
                      </Squircle>
                    ) : (
                      filteredPickPhrases.map((p, idx) => {
                        const isChecked =
                          phrasePickSelectedIds.length === 1 &&
                          phrasePickSelectedIds[0] === p.id;
                        return (
                          <Squircle
                            key={p.id}
                            cornerRadius={20}
                            cornerSmoothing={0.92}
                            asChild
                          >
                            <div
                              role="button"
                              tabIndex={0}
                              aria-pressed={isChecked}
                              onClick={() => togglePhrasePick(p.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  togglePhrasePick(p.id);
                                }
                              }}
                              className={`flex w-full cursor-pointer items-stretch gap-3 px-4 py-4 text-left outline-none transition-colors duration-200 ease-out focus-visible:ring-2 focus-visible:ring-primary/35 ${
                                isChecked ? "bg-primary/10" : "bg-base-200"
                              }`}
                            >
                              <div className="flex min-h-0 w-10 shrink-0 flex-col items-center self-stretch pt-[22px] pb-1">
                                <span
                                  className={`shrink-0 text-center text-[12px] font-bold tabular-nums transition-colors duration-200 ease-out ${
                                    isChecked
                                      ? "text-primary"
                                      : "text-base-content/35"
                                  }`}
                                >
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                                {p.isNewlyCreated ? (
                                  <div
                                    className="pointer-events-none mt-auto mb-2 inline-flex origin-center -rotate-90 select-none rounded-full bg-primary/15 px-2 py-1 text-[8px] font-semibold uppercase tracking-widest whitespace-nowrap text-primary"
                                    aria-label="Newly created phrase"
                                  >
                                    New
                                  </div>
                                ) : null}
                              </div>

                              <div className="min-w-0 flex-1">
                                <Text
                                  variant="caption"
                                  color={isChecked ? "primary" : "subtle"}
                                  weight="semibold"
                                  className="transition-colors duration-200 ease-out"
                                >
                                  Transliteration
                                </Text>
                                <Text
                                  variant="body"
                                  color={isChecked ? "primary" : "base"}
                                  weight="semibold"
                                  className="mt-0.5 truncate transition-colors duration-200 ease-out"
                                >
                                  {p.transliteration}
                                </Text>

                                <div className="mt-2">
                                  <Text
                                    variant="caption"
                                    color={isChecked ? "primary" : "subtle"}
                                    weight="semibold"
                                    className="transition-colors duration-200 ease-out"
                                  >
                                    Arabic
                                  </Text>
                                  <Text
                                    variant="body"
                                    color={isChecked ? "primary" : "base"}
                                    weight="medium"
                                    dir="rtl"
                                    className="mt-0.5 w-full text-right wrap-break-word leading-relaxed transition-colors duration-200 ease-out"
                                  >
                                    {p.arabic ?? "—"}
                                  </Text>
                                </div>

                                <div className="mt-2">
                                  <Text
                                    variant="caption"
                                    color={isChecked ? "primary" : "subtle"}
                                    weight="semibold"
                                    className="transition-colors duration-200 ease-out"
                                  >
                                    Translation
                                  </Text>
                                  <Text
                                    variant="body"
                                    color={isChecked ? "primary" : "subtle"}
                                    className="mt-0.5 line-clamp-2 normal-case transition-colors duration-200 ease-out"
                                  >
                                    {p.translation ?? "—"}
                                  </Text>
                                </div>
                              </div>

                              <div
                                className="flex w-10 shrink-0 items-start justify-center pt-[18px]"
                                onClick={(e) => e.stopPropagation()}
                                onKeyDown={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="radio"
                                  name="add-item-phrase-pick"
                                  value={p.id}
                                  className={`radio radio-sm ${
                                    isChecked ? "radio-primary" : ""
                                  }`}
                                  checked={isChecked}
                                  onChange={() => togglePhrasePick(p.id)}
                                  aria-label="Select phrase"
                                />
                              </div>
                            </div>
                          </Squircle>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="phrase-create"
                  initial={
                    prefersReducedMotion ? false : { opacity: 0, y: 10 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  exit={
                    prefersReducedMotion ? undefined : { opacity: 0, y: -8 }
                  }
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Form {...phraseCreateForm}>
                    <div className="mt-4">
                      <FormField
                        control={phraseCreateForm.control}
                        name="transliteration"
                        rules={{
                          required: "Transliteration is required.",
                          validate: (v) => {
                            const t = (v ?? "").trim();
                            if (t.length < 2) {
                              return "Use at least two letters.";
                            }
                            return true;
                          },
                        }}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between gap-2">
                              <FormLabel required className="mb-0">
                                Transliteration
                              </FormLabel>
                              <div ref={createPhraseTipRef} className="shrink-0">
                                <Tooltip
                                  content={
                                    <>
                                      Latin transliteration is required so you
                                      can find this phrase everywhere in the app.
                                      Arabic and meaning are optional—add them now
                                      or come back later. The Arabic field accepts
                                      Arabic script only (Latin letters are removed
                                      as you type).
                                    </>
                                  }
                                  open={isCreatePhraseTipOpen}
                                  placement="left"
                                  variant="neutral"
                                  trigger="manual"
                                  useSkeleton={false}
                                  contentClassName="max-w-[320px] min-w-[220px]"
                                >
                                  <button
                                    type="button"
                                    aria-label="About phrase fields"
                                    onClick={() =>
                                      setCreatePhraseTipOpen(
                                        !isCreatePhraseTipOpen,
                                      )
                                    }
                                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base-content/10 bg-base-content/5 text-base-content/70"
                                  >
                                    <Info size={16} />
                                  </button>
                                </Tooltip>
                              </div>
                            </div>
                            <FormControl>
                              <TextInput
                                {...field}
                                placeholder="e.g. SubhanAllah"
                                variant="ghost"
                                className="bg-base-200"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription>
                              How you say it in Latin letters (required).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={phraseCreateForm.control}
                        name="arabic"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Arabic (optional)</FormLabel>
                            <FormControl>
                              <TextInput
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    filterArabicScriptInput(e.target.value),
                                  )
                                }
                                placeholder="سُبْحَانَ الله"
                                variant="ghost"
                                className="bg-base-200 text-right"
                                dir="rtl"
                                lang="ar"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription>
                              Arabic script only—Latin letters are removed as you
                              type.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4">
                      <FormField
                        control={phraseCreateForm.control}
                        name="translation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Translation (optional)</FormLabel>
                            <FormControl>
                              <TextInput
                                {...field}
                                placeholder="Short meaning in your own words"
                                variant="ghost"
                                className="bg-base-200"
                                autoComplete="off"
                              />
                            </FormControl>
                            <FormDescription>
                              Plain language is fine—whatever helps you remember.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </Form>
                </motion.div>
              )}
            </AnimatePresence>
          </Squircle>
        </div>

        {phraseSheetMode === "pick_existing" ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div className="pointer-events-auto px-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-2">
              <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                <button
                  type="button"
                  onClick={handleUseThisPhrase}
                  disabled={phrasePickSelectedIds.length === 0}
                  className="flex h-14 w-full items-center justify-center bg-neutral px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Use this phrase
                </button>
              </Squircle>
            </div>
          </div>
        ) : (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-base-100 via-base-100/95 to-transparent pt-12">
            <div className="pointer-events-auto px-3 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-2">
              <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                <button
                  type="button"
                  onClick={() =>
                    void phraseCreateForm.handleSubmit(async (values) => {
                      const t = values.transliteration.trim();
                      const ar = values.arabic.trim();
                      const tr = values.translation.trim();
                      const editingId = phraseSheetEditingIdRef.current;

                      if (editingId) {
                        const updated = await updateMutation.mutateAsync({
                          id: editingId,
                          draft: {
                            transliteration: t,
                            arabic: ar,
                            translation: tr,
                          },
                        });
                        syncDraftItemPhraseByPhraseId(editingId, updated);
                        phraseCreateForm.reset({
                          transliteration: "",
                          arabic: "",
                          translation: "",
                        });
                        setPhraseSheetEditingId(null);
                        setDraftPhraseId(updated.id);
                        setPhraseSheetMode("pick_existing");
                        toast("Phrase updated", {
                          variant: "success",
                          description: `“${updated.transliteration}” is saved to your library.`,
                        });
                        return;
                      }

                      const created = await createMutation.mutateAsync({
                        transliteration: t,
                        arabic: ar,
                        ...(tr ? { translation: tr } : {}),
                      });
                      phraseCreateForm.reset({
                        transliteration: "",
                        arabic: "",
                        translation: "",
                      });
                      setDraftPhraseId(created.id);
                      toast("New phrase created", {
                        variant: "success",
                        description: `“${created.transliteration}” is in your library.`,
                      });
                      handleClose();
                    })()
                  }
                  className="flex h-14 w-full items-center justify-center bg-neutral px-4 text-sm font-semibold text-white"
                >
                  {phraseSheetEditingId ? "Save phrase" : "Create phrase"}
                </button>
              </Squircle>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
