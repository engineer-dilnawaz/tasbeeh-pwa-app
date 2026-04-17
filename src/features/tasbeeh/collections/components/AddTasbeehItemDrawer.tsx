import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight, Info, Pencil, Trash2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Drawer } from "@/shared/design-system/ui/Drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { Tooltip } from "@/shared/design-system/ui/Tooltip";

import type {
  CollectionItemRole,
  TasbeehPhraseRow,
} from "@/features/tasbeeh/services/tasbeehDb";

import { useCollectionComposerStore } from "../store/collectionComposerStore";
import { clampComposerTarget } from "../utils/phraseFormUtils";

const roleOptions: Array<{ label: string; value: CollectionItemRole }> = [
  { value: "start", label: "Start" },
  { value: "main", label: "Main" },
  { value: "end", label: "End" },
];

interface CustomTargetFormValues {
  customCount: string;
}

function buildCustomTargetSchema(targetPresets: number[]) {
  return z.object({
    customCount: z.string().superRefine((val, ctx) => {
      const trimmed = val.trim();
      if (!trimmed.length) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a count",
        });
        return;
      }
      if (!/^\d+$/u.test(trimmed)) {
        ctx.addIssue({
          code: "custom",
          message: "Use digits only (1–9999)",
        });
        return;
      }
      const raw = Number.parseInt(trimmed, 10);
      const clamped = clampComposerTarget(raw);
      if (clamped !== raw) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a whole number between 1 and 9999",
        });
        return;
      }
      if (targetPresets.includes(clamped)) {
        ctx.addIssue({
          code: "custom",
          message: "This count is already available — select it above.",
        });
      }
    }),
  });
}

interface CustomTargetCountFormProps {
  targetPresets: number[];
  placeholderCount: number;
  onApply: (clamped: number) => void;
}

function CustomTargetCountForm({
  targetPresets,
  placeholderCount,
  onApply,
}: CustomTargetCountFormProps) {
  const schema = React.useMemo(
    () => buildCustomTargetSchema(targetPresets),
    [targetPresets],
  );

  const form = useForm<CustomTargetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { customCount: "" },
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  return (
    <Form {...form}>
      <form
        className="mt-3"
        onSubmit={form.handleSubmit((data) => {
          const clamped = clampComposerTarget(
            Number.parseInt(data.customCount.trim(), 10),
          );
          onApply(clamped);
          form.reset({ customCount: "" });
        })}
      >
        <FormField
          control={form.control}
          name="customCount"
          render={({ field, fieldState }) => (
            <FormItem className="flex w-full flex-col gap-1 space-y-0">
              <div className="grid w-full grid-cols-3 gap-2">
                <div className="col-span-2 min-w-0">
                  <FormControl>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      placeholder={String(placeholderCount)}
                      className={`h-10 w-full rounded-full border bg-base-content/5 px-3 text-sm font-semibold text-base-content outline-none focus-visible:ring-2 focus-visible:ring-primary/30 ${
                        fieldState.error
                          ? "border-error/80"
                          : "border-base-content/20"
                      }`}
                      {...field}
                    />
                  </FormControl>
                </div>
                <button
                  type="submit"
                  className="col-span-1 inline-flex h-10 w-full min-w-0 items-center justify-center self-start rounded-full border border-primary/45 bg-transparent px-2 text-[12px] font-semibold text-primary"
                >
                  Add
                </button>
              </div>
              <div className="w-full min-w-0">
                <FormMessage className="block w-full min-w-0" />
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/** Three slow left–right jiggles over 1.5s (matches gate auto-dismiss). */
const PHRASE_GATE_ROTATE: number[] = [
  0, -2.25, 0, 2.25, 0, -2.25, 0, 2.25, 0, -2.25, 0, 2.25, 0,
];
const PHRASE_GATE_TIMES: number[] = PHRASE_GATE_ROTATE.map(
  (_, i) => i / (PHRASE_GATE_ROTATE.length - 1),
);

function PhraseGateContent({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.span
      className="inline-block"
      animate={reduceMotion ? false : { rotate: PHRASE_GATE_ROTATE }}
      transition={
        reduceMotion
          ? undefined
          : {
              duration: 1.5,
              ease: "easeInOut",
              times: PHRASE_GATE_TIMES,
            }
      }
    >
      <span className="text-error-content font-black">
        Select a phrase first.
      </span>
    </motion.span>
  );
}

interface AddTasbeehItemDrawerProps {
  phrases: TasbeehPhraseRow[];
}

export function AddTasbeehItemDrawer({ phrases }: AddTasbeehItemDrawerProps) {
  const addItemStepsTipRef = React.useRef<HTMLDivElement | null>(null);
  const gateTipTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [phraseRequiredError, setPhraseRequiredError] = React.useState(false);
  const [gateTip, setGateTip] = React.useState<
    null | "phrase" | "target" | "role"
  >(null);
  const reduceMotion = useReducedMotion();

  const isAddItemOpen = useCollectionComposerStore((s) => s.isAddItemOpen);
  const closeAddItem = useCollectionComposerStore((s) => s.closeAddItem);
  const editingItemId = useCollectionComposerStore((s) => s.editingItemId);
  const hasSeenAddItemGuide = useCollectionComposerStore(
    (s) => s.hasSeenAddItemGuide,
  );
  const draftPhraseId = useCollectionComposerStore((s) => s.draftPhraseId);
  const draftTarget = useCollectionComposerStore((s) => s.draftTarget);
  const draftRole = useCollectionComposerStore((s) => s.draftRole);
  const targetPresets = useCollectionComposerStore((s) => s.targetPresets);
  const isCustomTargetOpen = useCollectionComposerStore(
    (s) => s.isCustomTargetOpen,
  );
  const didAdjustAddItemTarget = useCollectionComposerStore(
    (s) => s.didAdjustAddItemTarget,
  );
  const didAdjustAddItemRole = useCollectionComposerStore(
    (s) => s.didAdjustAddItemRole,
  );
  const isAddItemStepsTipOpen = useCollectionComposerStore(
    (s) => s.isAddItemStepsTipOpen,
  );
  const setDraftPhraseId = useCollectionComposerStore(
    (s) => s.setDraftPhraseId,
  );
  const setDraftTarget = useCollectionComposerStore((s) => s.setDraftTarget);
  const addTargetPreset = useCollectionComposerStore((s) => s.addTargetPreset);
  const toggleCustomTargetOpen = useCollectionComposerStore(
    (s) => s.toggleCustomTargetOpen,
  );
  const setDraftRole = useCollectionComposerStore((s) => s.setDraftRole);
  const setDidAdjustAddItemTarget = useCollectionComposerStore(
    (s) => s.setDidAdjustAddItemTarget,
  );
  const setDidAdjustAddItemRole = useCollectionComposerStore(
    (s) => s.setDidAdjustAddItemRole,
  );
  const setAddItemStepsTipOpen = useCollectionComposerStore(
    (s) => s.setAddItemStepsTipOpen,
  );
  const openPhrasePicker = useCollectionComposerStore(
    (s) => s.openPhrasePicker,
  );
  const removePhraseFromAddSelection = useCollectionComposerStore(
    (s) => s.removePhraseFromAddSelection,
  );
  const beginPhraseLibraryEdit = useCollectionComposerStore(
    (s) => s.beginPhraseLibraryEdit,
  );
  const addItemFromSheet = useCollectionComposerStore(
    (s) => s.addItemFromSheet,
  );
  const addItemAndAnotherFromSheet = useCollectionComposerStore(
    (s) => s.addItemAndAnotherFromSheet,
  );
  const selectedPhrase = phrases.find((p) => p.id === draftPhraseId) ?? null;

  const flashGateTip = React.useCallback(
    (which: "phrase" | "target" | "role") => {
      if (gateTipTimerRef.current) clearTimeout(gateTipTimerRef.current);
      setGateTip(which);
      gateTipTimerRef.current = setTimeout(() => {
        setGateTip(null);
        gateTipTimerRef.current = null;
      }, 1500);
    },
    [],
  );

  React.useEffect(() => {
    if (draftPhraseId) setPhraseRequiredError(false);
  }, [draftPhraseId]);

  React.useEffect(() => {
    if (!isAddItemOpen) {
      setPhraseRequiredError(false);
      setGateTip(null);
      if (gateTipTimerRef.current) {
        clearTimeout(gateTipTimerRef.current);
        gateTipTimerRef.current = null;
      }
    }
  }, [isAddItemOpen]);

  React.useEffect(
    () => () => {
      if (gateTipTimerRef.current) clearTimeout(gateTipTimerRef.current);
    },
    [],
  );

  React.useEffect(() => {
    if (!isAddItemStepsTipOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = addItemStepsTipRef.current;
      if (!el) return;
      if (e.target instanceof Node && el.contains(e.target)) return;
      setAddItemStepsTipOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, {
        capture: true,
      });
    };
  }, [isAddItemStepsTipOpen, setAddItemStepsTipOpen]);

  const handleAddItem = () => {
    const phrase = phrases.find((p) => p.id === draftPhraseId) ?? null;
    if (!phrase) {
      setPhraseRequiredError(true);
      flashGateTip("phrase");
      return;
    }
    const targetCount = clampComposerTarget(draftTarget);
    addItemFromSheet(phrase, targetCount);
  };

  const handleAddItemAndAnother = () => {
    if (editingItemId) return;
    const phrase = phrases.find((p) => p.id === draftPhraseId) ?? null;
    if (!phrase) {
      setPhraseRequiredError(true);
      flashGateTip("phrase");
      return;
    }
    addItemAndAnotherFromSheet(phrase, clampComposerTarget(draftTarget));
  };

  return (
    <Drawer
      isOpen={isAddItemOpen}
      onClose={closeAddItem}
      title={editingItemId ? "Edit tasbeeh item" : "Add tasbeeh item"}
      description={
        hasSeenAddItemGuide
          ? undefined
          : "Pick one phrase, set the target and role, then add it to your list."
      }
      snapPoints={["80%"]}
      scrollable={false}
      contentPaddingBottomPx={0}
      presentation="height"
    >
      <div className="relative flex h-full min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          <div className="px-2 pb-[calc(112px+env(safe-area-inset-bottom,0px))]">
            {!hasSeenAddItemGuide ? (
              <div className="relative mb-3">
                <Squircle
                  cornerRadius={22}
                  cornerSmoothing={0.9}
                  className="surface-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <Text variant="body" weight="semibold">
                      Steps
                    </Text>
                    <div className="h-9 w-9" aria-hidden />
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <ul className="steps steps-horizontal w-full">
                      <li className="step step-primary text-[12px] font-semibold">
                        Phrase
                      </li>
                      <li
                        className={`step text-[12px] font-semibold ${
                          draftPhraseId ? "step-primary" : ""
                        }`}
                      >
                        Target
                      </li>
                      <li
                        className={`step text-[12px] font-semibold ${
                          draftPhraseId &&
                          didAdjustAddItemTarget &&
                          (didAdjustAddItemRole || draftRole === "main")
                            ? "step-primary"
                            : ""
                        }`}
                      >
                        Role
                      </li>
                    </ul>
                  </div>
                </Squircle>

                <div
                  ref={addItemStepsTipRef}
                  className="absolute top-4 right-4"
                >
                  <Tooltip
                    content={
                      <>
                        Pick one phrase, set the target and role, then add it to
                        your list. After your first item, this sheet becomes
                        faster.
                      </>
                    }
                    open={isAddItemStepsTipOpen}
                    placement="left"
                    variant="neutral"
                    trigger="manual"
                    useSkeleton={false}
                    contentClassName="max-w-[360px] min-w-[240px]"
                  >
                    <button
                      type="button"
                      aria-label="How this works"
                      onClick={() =>
                        setAddItemStepsTipOpen(!isAddItemStepsTipOpen)
                      }
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-base-content/10 bg-base-content/5 text-base-content/70"
                    >
                      <Info size={16} />
                    </button>
                  </Tooltip>
                </div>
              </div>
            ) : null}

            <Squircle
              cornerRadius={22}
              cornerSmoothing={0.9}
              className="surface-card p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Text variant="caption" color="subtle" weight="semibold">
                    Phrase
                  </Text>
                  {phraseRequiredError && !selectedPhrase ? (
                    <p
                      className="mt-1 text-[11px] font-semibold text-error"
                      role="alert"
                    >
                      Phrase is required
                    </p>
                  ) : null}
                  {selectedPhrase ? (
                    <p className="mt-0.5 text-sm font-semibold text-primary">
                      Phrase selected
                    </p>
                  ) : null}
                </div>
                <Tooltip
                  trigger="manual"
                  open={!draftPhraseId && gateTip === "phrase"}
                  placement="top"
                  variant="error"
                  useSkeleton={false}
                  contentClassName="max-w-[min(100%,280px)] whitespace-normal text-center leading-snug px-4 py-3"
                  content={<PhraseGateContent reduceMotion={reduceMotion} />}
                >
                  <button
                    type="button"
                    onClick={openPhrasePicker}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-base-content/10 bg-base-content/5 px-3 py-2 text-[12px] font-semibold text-base-content/80"
                  >
                    Choose
                    <ChevronRight size={16} className="text-base-content/45" />
                  </button>
                </Tooltip>
              </div>

              {selectedPhrase ? (
                <ul className="mt-3 list-none space-y-2 p-0">
                  <motion.li
                    key={selectedPhrase.id}
                    layout
                    transition={{
                      duration: 0.2,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setDraftPhraseId(selectedPhrase.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setDraftPhraseId(selectedPhrase.id);
                        }
                      }}
                      className="flex w-full items-center gap-2 rounded-2xl border border-primary/35 bg-primary/10 px-3 py-2.5 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary/30"
                    >
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-base-content">
                        {selectedPhrase.transliteration}
                      </span>
                      <div
                        className="flex shrink-0 gap-0.5"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => beginPhraseLibraryEdit(selectedPhrase)}
                          aria-label={`Edit ${selectedPhrase.transliteration}`}
                          className="btn btn-square btn-ghost btn-sm text-base-content/65"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            removePhraseFromAddSelection(selectedPhrase.id)
                          }
                          aria-label={`Clear ${selectedPhrase.transliteration}`}
                          className="btn btn-square btn-ghost btn-sm text-base-content/50 hover:text-error"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.li>
                </ul>
              ) : (
                <Text
                  variant="caption"
                  color="subtle"
                  className="mt-3 block text-center"
                >
                  Tap Choose to pick one phrase from your library.
                </Text>
              )}
            </Squircle>

            <div className="relative mt-3">
              <Squircle
                cornerRadius={22}
                cornerSmoothing={0.9}
                className="relative surface-card p-4"
                style={{ WebkitUserSelect: "none", userSelect: "none" }}
              >
                <div
                  className={
                    draftPhraseId ? "" : "pointer-events-none select-none opacity-50"
                  }
                >
                  <Text variant="caption" color="subtle" weight="semibold">
                    Target count
                  </Text>

                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {targetPresets.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => {
                          setDraftTarget(n);
                          setDidAdjustAddItemTarget(true);
                        }}
                        className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                          draftTarget === n
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-base-content/10 bg-base-content/5 text-base-content/75"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => toggleCustomTargetOpen()}
                      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                        isCustomTargetOpen
                          ? "border-primary/30 bg-primary/10 text-primary"
                          : "border-dashed border-base-content/20 bg-base-content/5 text-base-content/70"
                      }`}
                    >
                      Add custom count
                    </button>
                  </div>

                  {isCustomTargetOpen ? (
                    <CustomTargetCountForm
                      key={targetPresets.join(",")}
                      targetPresets={targetPresets}
                      placeholderCount={draftTarget}
                      onApply={(clamped) => {
                        addTargetPreset(clamped);
                        setDraftTarget(clamped);
                        setDidAdjustAddItemTarget(true);
                        toggleCustomTargetOpen();
                      }}
                    />
                  ) : null}
                </div>
              </Squircle>
              {!draftPhraseId ? (
                <button
                  type="button"
                  aria-label="Select a phrase before setting target count"
                  className="absolute inset-0 z-10 rounded-[22px] bg-transparent"
                  onClick={() => flashGateTip("phrase")}
                />
              ) : null}
            </div>

            <div className="relative mt-3">
              <Squircle
                cornerRadius={22}
                cornerSmoothing={0.9}
                className="relative surface-card p-4"
                style={{ WebkitUserSelect: "none", userSelect: "none" }}
              >
                <div
                  className={
                    draftPhraseId ? "" : "pointer-events-none select-none opacity-50"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <Text variant="body" weight="semibold">
                      Role
                    </Text>
                    {!hasSeenAddItemGuide ? (
                      <Text
                        variant="caption"
                        color="subtle"
                        className="font-semibold"
                      >
                        Start shows first · End shows last
                      </Text>
                    ) : null}
                  </div>
                  <div className="mt-3">
                    <SegmentedControl
                      value={draftRole}
                      onChange={(next) => {
                        setDraftRole(next);
                        setDidAdjustAddItemRole(true);
                      }}
                      options={roleOptions}
                      size="sm"
                      uppercase={false}
                    />
                  </div>
                </div>
              </Squircle>
              {!draftPhraseId ? (
                <button
                  type="button"
                  aria-label="Select a phrase before setting role"
                  className="absolute inset-0 z-10 rounded-[22px] bg-transparent"
                  onClick={() => flashGateTip("phrase")}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
          <div className="pointer-events-auto px-2 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-2">
            <div className="grid gap-2 bg-transparent">
              <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="flex h-14 w-full items-center justify-center bg-neutral px-4 text-sm font-semibold text-white"
                >
                  {editingItemId ? "Save changes" : "Add to list"}
                </button>
              </Squircle>

              {hasSeenAddItemGuide && !editingItemId ? (
                <button
                  type="button"
                  onClick={handleAddItemAndAnother}
                  className="h-12 w-full rounded-full border border-base-content/10 bg-transparent px-4 text-sm font-semibold text-base-content/80"
                >
                  Add & add another
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
