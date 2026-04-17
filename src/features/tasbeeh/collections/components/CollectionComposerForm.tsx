import React from "react";
import { AlertCircle, Check, ChevronRight, Pencil, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/design-system/ui/Form";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { TextInput } from "@/shared/design-system/ui/TextInput";

import type {
  PrayerSlot,
  ReminderPolicy,
  SlotExpiryPolicy,
  TasbeehPhraseRow,
  TasbeehReference,
  TasbeehScheduleType,
} from "@/features/tasbeeh/services/tasbeehDb";

import { AddTasbeehItemDrawer } from "./AddTasbeehItemDrawer";
import { DraftTasbeehItemsSection } from "./DraftTasbeehItemsSection";
import { PhraseLibraryDrawer } from "./PhraseLibraryDrawer";
import { useCollectionComposerStore } from "../store/collectionComposerStore";
import type { CreateCollectionDraft } from "../types";

export type { CreateCollectionDraft } from "../types";

type PriorityUi = "important" | "standard" | "optional";

export interface CollectionFormValues {
  title: string;
  description: string;
  itemsCount: number;
  tagInput: string;
  customSourceInput: string;
  referenceText: string;
  referenceUrl: string;
}

interface CollectionComposerFormProps {
  phrases: TasbeehPhraseRow[];
  onSubmit: (draft: CreateCollectionDraft) => Promise<void> | void;
}

const PRAYER_SLOTS: Array<{ id: PrayerSlot; label: string }> = [
  { id: "fajr", label: "Fajr" },
  { id: "dhuhr", label: "Dhuhr" },
  { id: "asr", label: "Asr" },
  { id: "maghrib", label: "Maghrib" },
  { id: "isha", label: "Isha" },
];

const URL_PREFIXES = ["https://", "http://", "www."] as const;

const validateUrl = (value: string) => {
  if (!value) return true;
  try {
    const url = new URL(
      value.startsWith("www.") ? `https://${value}` : value,
    );
    return (
      (url.protocol === "https:" || url.protocol === "http:") ||
      "Please enter a valid URL"
    );
  } catch {
    return "Please enter a valid URL";
  }
};

export function CollectionComposerForm({
  phrases,
  onSubmit,
}: CollectionComposerFormProps) {
  const prefersReducedMotion = useReducedMotion();

  const form = useForm<CollectionFormValues>({
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      itemsCount: 0,
      tagInput: "",
      customSourceInput: "",
      referenceText: "",
      referenceUrl: "",
    },
  });

  const {
    register,
    watch,
    setValue,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const referenceText = watch("referenceText");
  const referenceUrl = watch("referenceUrl");

  const [scheduleType, setScheduleType] =
    React.useState<TasbeehScheduleType>("prayer_specific");
  const [timesPerDay, setTimesPerDay] = React.useState<number>(1);
  const [selectedSlots, setSelectedSlots] = React.useState<PrayerSlot[]>(
    PRAYER_SLOTS.map((s) => s.id),
  );
  const [priorityUi, setPriorityUi] = React.useState<PriorityUi>("standard");
  const [slotExpiryPolicy, setSlotExpiryPolicy] =
    React.useState<SlotExpiryPolicy>("next_prayer");
  const [reminderPolicy, setReminderPolicy] =
    React.useState<ReminderPolicy>("gentle");
  const [tags, setTags] = React.useState<string[]>([]);
  const [referenceSourceType, setReferenceSourceType] =
    React.useState<TasbeehReference["sourceType"]>("none");
  const [customSourceName, setCustomSourceName] = React.useState("");
  const [isEditingCustomSource, setIsEditingCustomSource] =
    React.useState(false);

  const handleUrlPrefixClick = (prefix: string) => {
    const current = referenceUrl;
    if (!current.startsWith(prefix)) {
      let cleaned = current;
      for (const p of URL_PREFIXES) {
        if (cleaned.startsWith(p)) {
          cleaned = cleaned.slice(p.length);
          break;
        }
      }
      setValue("referenceUrl", prefix + cleaned, { shouldValidate: true });
    }
  };
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);
  const [isReferencePickerOpen, setIsReferencePickerOpen] =
    React.useState(false);

  const draftItems = useCollectionComposerStore((s) => s.draftItems);
  const pendingSelectTransliteration = useCollectionComposerStore(
    (s) => s.pendingSelectTransliteration,
  );
  const setPendingSelectTransliteration = useCollectionComposerStore(
    (s) => s.setPendingSelectTransliteration,
  );
  const setDraftPhraseId = useCollectionComposerStore(
    (s) => s.setDraftPhraseId,
  );
  React.useEffect(() => {
    if (!pendingSelectTransliteration) return;
    const match =
      phrases.find(
        (p) =>
          p.transliteration.trim().toLowerCase() ===
          pendingSelectTransliteration.trim().toLowerCase(),
      ) ?? null;
    if (!match) return;
    setDraftPhraseId(match.id);
    setPendingSelectTransliteration(null);
  }, [
    pendingSelectTransliteration,
    phrases,
    setDraftPhraseId,
    setPendingSelectTransliteration,
  ]);

  const slotsInnerRef = React.useRef<HTMLDivElement | null>(null);
  const slotsHeight = useMeasuredHeight(
    slotsInnerRef,
    scheduleType === "prayer_specific",
  );

  const scheduleOptions: Array<{ label: string; value: TasbeehScheduleType }> =
    [
      { value: "prayer_specific", label: "Prayer-specific" },
      { value: "anytime_today", label: "Anytime day" },
    ];

  const expiryOptions: Array<{ label: string; value: SlotExpiryPolicy }> = [
    { value: "next_prayer", label: "Next prayer" },
    { value: "day_end", label: "End of day" },
  ];

  const reminderOptions: Array<{ label: string; value: ReminderPolicy }> = [
    { value: "off", label: "Off" },
    { value: "gentle", label: "Gentle" },
    { value: "strong", label: "Strong" },
  ];

  const priorityOptions: Array<{ label: string; value: PriorityUi }> = [
    { value: "important", label: "Important" },
    { value: "standard", label: "Standard" },
    { value: "optional", label: "Optional" },
  ];

  const handleToggleSlot = (slot: PrayerSlot) => {
    setSelectedSlots((prev) => {
      if (prev.includes(slot)) return prev.filter((s) => s !== slot);
      return [...prev, slot];
    });
  };

  React.useEffect(() => {
    form.setValue("itemsCount", draftItems.length, { shouldDirty: true });
    if (draftItems.length > 0) {
      form.clearErrors("itemsCount");
    }
  }, [draftItems.length, form]);

  const handleCreate = form.handleSubmit(async (values) => {
    const items = useCollectionComposerStore.getState().draftItems;

    const reference =
      referenceSourceType === "none"
        ? null
        : {
            sourceType: referenceSourceType,
            ...(referenceSourceType === "custom" && customSourceName
              ? { book: customSourceName }
              : {}),
            ...(values.referenceText ? { text: values.referenceText } : {}),
            ...(values.referenceUrl ? { url: values.referenceUrl } : {}),
          };

    const draft: CreateCollectionDraft = {
      title: values.title.trim(),
      description: values.description?.trim() || null,
      scheduleType,
      timesPerDay:
        scheduleType === "prayer_specific" ? selectedSlots.length : timesPerDay,
      slots: scheduleType === "prayer_specific" ? selectedSlots : null,
      slotExpiryPolicy,
      priority:
        priorityUi === "important"
          ? "high"
          : priorityUi === "optional"
            ? "low"
            : "normal",
      reminderPolicy,
      tags,
      reference,
      items: items.map((it) => ({
        role: it.role,
        phraseId: it.phrase.id,
        targetCount: it.targetCount,
      })),
    };

    await onSubmit(draft);
    useCollectionComposerStore.getState().resetComposer();
  });

  const handleAddTag = () => {
    const t = getValues("tagInput").trim();
    if (t.length < 2) {
      setError("tagInput", { type: "minLength", message: "Tag too short" });
      return;
    }
    if (tags.includes(t)) {
      setError("tagInput", { type: "duplicate", message: "Tag already added" });
      return;
    }
    setTags((prev) => [...prev, t]);
    setValue("tagInput", "");
    clearErrors("tagInput");
  };

  const handleAddCustomSource = () => {
    const name = getValues("customSourceInput").trim();
    if (name.length < 2) {
      setError("customSourceInput", {
        type: "minLength",
        message: "Source name too short",
      });
      return;
    }
    setCustomSourceName(name);
    setIsEditingCustomSource(false);
    setValue("customSourceInput", "");
    clearErrors("customSourceInput");
  };

  const handleEditCustomSource = () => {
    setValue("customSourceInput", customSourceName);
    setIsEditingCustomSource(true);
  };

  const handleRemoveCustomSource = () => {
    setCustomSourceName("");
    setIsEditingCustomSource(false);
    setValue("customSourceInput", "");
    clearErrors("customSourceInput");
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-3 px-4 pt-4 pb-28">
      <Form {...form}>
        <form onSubmit={handleCreate} className="contents">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-3">
              {/* Basics */}
              <Squircle
                cornerRadius={28}
                cornerSmoothing={0.92}
                className="surface-card p-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  rules={{
                    required: "Collection name is required.",
                    minLength: {
                      value: 2,
                      message: "Collection name is too short.",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Collection name</FormLabel>
                      <FormControl>
                        <TextInput
                          {...field}
                          placeholder="Tasbeeh after Maghrib"
                          variant="bordered"
                          className="bg-base-200 border-base-300"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <TextInput
                            {...field}
                            placeholder="Optional description"
                            variant="bordered"
                            className="bg-base-200 border-base-300"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Squircle>

              {/* Schedule */}
              <Squircle
                cornerRadius={28}
                cornerSmoothing={0.92}
                className="surface-card p-4"
              >
                <Text variant="body" weight="semibold">
                  Schedule
                </Text>
                <div className="mt-2 space-y-3">
                  <SegmentedControl
                    value={scheduleType}
                    onChange={setScheduleType}
                    options={scheduleOptions}
                    size="sm"
                    uppercase={false}
                    activeTextClassName="text-base-content"
                  />

                  <AnimatePresence initial={false} mode="popLayout">
                    {scheduleType === "prayer_specific" ? (
                      <motion.div
                        key="slots"
                        layout
                        className="overflow-hidden"
                        initial={prefersReducedMotion ? false : "closed"}
                        animate={prefersReducedMotion ? undefined : "open"}
                        exit={prefersReducedMotion ? undefined : "closed"}
                        custom={slotsHeight}
                        variants={
                          prefersReducedMotion
                            ? undefined
                            : {
                                open: (h: number) => ({
                                  height: h,
                                  transition: {
                                    duration: 0.22,
                                    ease: [0.4, 0, 0.2, 1],
                                    when: "beforeChildren",
                                  },
                                }),
                                closed: {
                                  height: 0,
                                  transition: {
                                    duration: 0.22,
                                    ease: [0.4, 0, 0.2, 1],
                                    when: "afterChildren",
                                  },
                                },
                              }
                        }
                      >
                        <motion.div
                          variants={
                            prefersReducedMotion
                              ? undefined
                              : {
                                  open: {
                                    opacity: 1,
                                    transition: {
                                      duration: 0.12,
                                      ease: [0.2, 0, 0, 1],
                                    },
                                  },
                                  closed: {
                                    opacity: 0,
                                    transition: {
                                      duration: 0.12,
                                      ease: [0.2, 0, 0, 1],
                                    },
                                  },
                                }
                          }
                        >
                          <div ref={slotsInnerRef} className="origin-top">
                            <Text
                              variant="caption"
                              color="subtle"
                              weight="semibold"
                            >
                              Prayer slots
                            </Text>
                            <motion.div
                              className="mt-2 flex flex-wrap gap-2"
                              layout
                            >
                              {PRAYER_SLOTS.map((slot) => {
                                const isOn = selectedSlots.includes(slot.id);
                                return (
                                  <motion.div key={slot.id} layout>
                                    <motion.button
                                      type="button"
                                      aria-pressed={isOn}
                                      onClick={() => handleToggleSlot(slot.id)}
                                      className={`btn btn-sm rounded-full gap-1.5 ${
                                        isOn
                                          ? "btn-primary"
                                          : "bg-base-content/5 hover:bg-base-content/10 border border-base-content/10 text-base-content/80"
                                      }`}
                                      whileTap={
                                        prefersReducedMotion
                                          ? undefined
                                          : { scale: 0.98 }
                                      }
                                      transition={{
                                        duration: 0.12,
                                        ease: "easeOut",
                                      }}
                                    >
                                      <AnimatePresence initial={false}>
                                        {isOn ? (
                                          <motion.span
                                            key="check"
                                            initial={{ opacity: 0, scale: 0.6 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.6 }}
                                            transition={{
                                              duration: 0.14,
                                              ease: "easeOut",
                                            }}
                                            className="inline-flex items-center"
                                            aria-hidden
                                          >
                                            <Check size={14} />
                                          </motion.span>
                                        ) : null}
                                      </AnimatePresence>
                                      <span>{slot.label}</span>
                                    </motion.button>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  {scheduleType === "anytime_today" ? (
                    <div>
                      <Text variant="caption" color="subtle" weight="semibold">
                        Repeat
                      </Text>
                      <Text
                        variant="caption"
                        color="subtle"
                        className="mt-0.5 text-[11px] leading-tight truncate"
                      >
                        Aim to complete this collection {timesPerDay}× today.
                      </Text>
                      <div className="mt-2 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setTimesPerDay((v) => Math.max(1, v - 1))
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-content/15 text-base-content/70"
                        >
                          −
                        </button>
                        <Text
                          variant="heading"
                          weight="semibold"
                          className="w-12 text-center"
                        >
                          {timesPerDay}×
                        </Text>
                        <button
                          type="button"
                          onClick={() =>
                            setTimesPerDay((v) => Math.min(10, v + 1))
                          }
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-base-content/15 text-base-content/70"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </Squircle>

              <DraftTasbeehItemsSection control={form.control} />

              {/* Advanced */}
              <Squircle
                cornerRadius={28}
                cornerSmoothing={0.92}
                className="surface-card"
              >
                <button
                  type="button"
                  onClick={() => setIsAdvancedOpen((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-4 text-left"
                >
                  <div>
                    <Text variant="body" weight="semibold">
                      Advanced
                    </Text>
                    <Text variant="caption" color="subtle" className="mt-0.5">
                      Fine-tune reminders, priority, tags, and reference.
                    </Text>
                  </div>
                  <motion.div
                    animate={{ rotate: isAdvancedOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-base-content/40"
                  >
                    <ChevronRight size={18} />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isAdvancedOpen ? (
                    <motion.div
                      initial={
                        prefersReducedMotion ? false : { height: 0, opacity: 0 }
                      }
                      animate={
                        prefersReducedMotion
                          ? undefined
                          : { height: "auto", opacity: 1 }
                      }
                      exit={
                        prefersReducedMotion
                          ? undefined
                          : { height: 0, opacity: 0 }
                      }
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="pt-1">
                          <Text variant="body" weight="semibold">
                            Expiry
                          </Text>
                          <Text
                            variant="caption"
                            color="subtle"
                            className="mt-0.5"
                          >
                            When does a scheduled recitation “expire”?
                          </Text>
                          <div className="mt-2">
                            <SegmentedControl
                              value={slotExpiryPolicy}
                              onChange={setSlotExpiryPolicy}
                              options={expiryOptions}
                              size="sm"
                              uppercase={false}
                              activeTextClassName="text-base-content"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Text variant="body" weight="semibold">
                            Priority
                          </Text>
                          <div className="mt-2">
                            <SegmentedControl
                              value={priorityUi}
                              onChange={setPriorityUi}
                              options={priorityOptions}
                              size="sm"
                              uppercase={false}
                              activeTextClassName="text-base-content"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Text variant="body" weight="semibold">
                            Reminders
                          </Text>
                          <div className="mt-2">
                            <SegmentedControl
                              value={reminderPolicy}
                              onChange={setReminderPolicy}
                              options={reminderOptions}
                              size="sm"
                              uppercase={false}
                              activeTextClassName="text-base-content"
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <Text variant="body" weight="semibold">
                            Tags{" "}
                            <span className="text-base-content/50 font-semibold">
                              (optional)
                            </span>
                          </Text>
                          <div className="mt-2 flex items-center gap-1">
                            <TextInput
                              size="sm"
                              placeholder="e.g., after-prayer"
                              variant="ghost"
                              className="bg-base-200"
                              containerClassName="flex-1"
                              {...register("tagInput", {
                                minLength: {
                                  value: 2,
                                  message: "Tag too short",
                                },
                                validate: (val) =>
                                  !tags.includes(val.trim()) ||
                                  "Tag already added",
                              })}
                              onKeyDown={async (e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  await handleAddTag();
                                }
                              }}
                            />
                            <Squircle
                              cornerRadius={10}
                              cornerSmoothing={0.92}
                              asChild
                            >
                              <button
                                type="button"
                                onClick={handleAddTag}
                                className="inline-flex h-8 shrink-0 items-center justify-center bg-base-200 text-base-content px-4 text-sm font-semibold"
                              >
                                Add
                              </button>
                            </Squircle>
                          </div>
                          <AnimatePresence>
                            {errors.tagInput && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.25,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10 }}
                                  animate={{ y: 0 }}
                                  exit={{ y: -10 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                  }}
                                  className="flex items-start gap-1 pt-1"
                                >
                                  <AlertCircle
                                    size={12}
                                    className="shrink-0 text-error mt-px"
                                  />
                                  <span className="text-error font-semibold text-[11px] leading-snug">
                                    {errors.tagInput.message}
                                  </span>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {tags.length > 0 ? (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {tags.map((t) => (
                                <button
                                  key={t}
                                  type="button"
                                  onClick={() =>
                                    setTags((prev) =>
                                      prev.filter((x) => x !== t),
                                    )
                                  }
                                  className="inline-flex items-center rounded-full border border-base-content/15 bg-base-content/5 px-3 py-1.5 text-[11px] font-semibold text-base-content/70"
                                >
                                  {t}
                                  <span className="ml-2 text-base-content/40">
                                    ×
                                  </span>
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <Text variant="body" weight="semibold">
                            Reference{" "}
                            <span className="text-base-content/50 font-semibold">
                              (optional)
                            </span>
                          </Text>
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => setIsReferencePickerOpen(true)}
                              className="flex h-12 w-full items-center justify-between rounded-2xl bg-base-content/5 px-4 py-2 transition-colors hover:bg-base-content/10"
                            >
                              <Text
                                variant="body"
                                className={
                                  referenceSourceType === "none"
                                    ? "text-base-content/50"
                                    : "text-base-content font-medium"
                                }
                              >
                                {referenceSourceType === "none"
                                  ? "Choose a source"
                                  : referenceSourceType === "quran"
                                    ? "Qur’an"
                                    : referenceSourceType === "hadith"
                                      ? "Hadith"
                                      : referenceSourceType === "scholar"
                                        ? "Scholar"
                                        : "Custom"}
                              </Text>
                              <ChevronRight
                                size={16}
                                className="text-base-content/40"
                              />
                            </button>
                          </div>
                          <AnimatePresence>
                            {referenceSourceType === "custom" && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.25,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                              >
                                <motion.div
                                  initial={{ y: -10 }}
                                  animate={{ y: 0 }}
                                  exit={{ y: -10 }}
                                  transition={{
                                    duration: 0.25,
                                    ease: "easeInOut",
                                  }}
                                  className="mt-2"
                                >
                                  <AnimatePresence mode="wait">
                                    {!customSourceName ||
                                    isEditingCustomSource ? (
                                      <motion.div
                                        key="input"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                      >
                                        <div className="flex items-center gap-1">
                                          <TextInput
                                            size="sm"
                                            placeholder="Enter source name"
                                            variant="ghost"
                                            className="bg-base-content/5"
                                            containerClassName="flex-1"
                                            {...register(
                                              "customSourceInput",
                                              {
                                                minLength: {
                                                  value: 2,
                                                  message:
                                                    "Source name too short",
                                                },
                                              },
                                            )}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleAddCustomSource();
                                              }
                                            }}
                                          />
                                          <Squircle
                                            cornerRadius={10}
                                            cornerSmoothing={0.92}
                                            asChild
                                          >
                                            <button
                                              type="button"
                                              onClick={handleAddCustomSource}
                                              className="inline-flex h-8 shrink-0 items-center justify-center bg-base-content/5 text-base-content px-4 text-sm font-semibold"
                                            >
                                              {isEditingCustomSource
                                                ? "Save"
                                                : "Add"}
                                            </button>
                                          </Squircle>
                                        </div>
                                        <AnimatePresence>
                                          {errors.customSourceInput && (
                                            <motion.div
                                              initial={{
                                                height: 0,
                                                opacity: 0,
                                              }}
                                              animate={{
                                                height: "auto",
                                                opacity: 1,
                                              }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{
                                                duration: 0.25,
                                                ease: "easeInOut",
                                              }}
                                              className="overflow-hidden"
                                            >
                                              <motion.div
                                                initial={{ y: -10 }}
                                                animate={{ y: 0 }}
                                                exit={{ y: -10 }}
                                                transition={{
                                                  duration: 0.25,
                                                  ease: "easeInOut",
                                                }}
                                                className="flex items-start gap-1 pt-1"
                                              >
                                                <AlertCircle
                                                  size={12}
                                                  className="shrink-0 text-error mt-px"
                                                />
                                                <span className="text-error font-semibold text-[11px] leading-snug">
                                                  {errors.customSourceInput?.message}
                                                </span>
                                              </motion.div>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </motion.div>
                                    ) : (
                                      <motion.div
                                        key="display"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex items-center gap-2"
                                      >
                                        <div className="flex-1 rounded-xl bg-base-content/5 px-3 py-2">
                                          <Text
                                            variant="body"
                                            weight="medium"
                                            className="text-base-content"
                                          >
                                            {customSourceName}
                                          </Text>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={handleEditCustomSource}
                                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-content/5 text-base-content/70 hover:bg-base-content/10"
                                          aria-label="Edit source name"
                                        >
                                          <Pencil size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={handleRemoveCustomSource}
                                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-base-content/5 text-base-content/50 hover:bg-error/10 hover:text-error"
                                          aria-label="Remove source name"
                                        >
                                          <X size={14} />
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="mt-4 grid grid-cols-1 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <Text variant="body" weight="semibold">
                                  Text
                                </Text>
                                <Text
                                  variant="caption"
                                  color="subtle"
                                  className="text-[11px]"
                                >
                                  {referenceText.length}/120
                                </Text>
                              </div>
                              <Squircle
                                cornerRadius={18}
                                cornerSmoothing={0.9}
                                className="w-full bg-base-content/5 p-1"
                              >
                                <textarea
                                  {...register("referenceText", {
                                    maxLength: {
                                      value: 120,
                                      message: "Maximum 120 characters",
                                    },
                                  })}
                                  maxLength={120}
                                  placeholder="Optional short reference note"
                                  rows={3}
                                  className="w-full resize-none bg-transparent px-3 py-2 text-sm text-base-content outline-none placeholder:text-base-content/40"
                                />
                              </Squircle>
                              <AnimatePresence>
                                {errors.referenceText?.message ? (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-1.5 flex items-center gap-1 text-xs text-error"
                                  >
                                    <AlertCircle size={12} />
                                    {errors.referenceText.message}
                                  </motion.p>
                                ) : null}
                              </AnimatePresence>
                            </div>
                            <div>
                              <TextInput
                                label="URL"
                                {...register("referenceUrl", {
                                  validate: validateUrl,
                                })}
                                placeholder="Optional link"
                                variant="ghost"
                                size="sm"
                                className="bg-base-content/5"
                              />
                              <AnimatePresence>
                                {errors.referenceUrl?.message ? (
                                  <motion.p
                                    initial={{ opacity: 0, height: 0, y: -10 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-1.5 flex items-center gap-1 text-xs text-error"
                                  >
                                    <AlertCircle size={12} />
                                    {errors.referenceUrl.message}
                                  </motion.p>
                                ) : null}
                              </AnimatePresence>
                              <motion.div
                                className="mt-2 flex flex-wrap gap-1.5"
                                layout
                              >
                                {URL_PREFIXES.map((prefix) => {
                                  const isActive = referenceUrl.startsWith(prefix);
                                  return (
                                    <motion.button
                                      key={prefix}
                                      type="button"
                                      onClick={() => handleUrlPrefixClick(prefix)}
                                      className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
                                        isActive
                                          ? "bg-primary/15 text-primary font-medium"
                                          : "bg-base-content/5 text-base-content/60 hover:bg-base-content/10"
                                      }`}
                                      whileTap={
                                        prefersReducedMotion
                                          ? undefined
                                          : { scale: 0.96 }
                                      }
                                    >
                                      {prefix}
                                    </motion.button>
                                  );
                                })}
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </Squircle>
            </div>
          </motion.div>

          <div className="fixed inset-x-0 bottom-0 z-50 pt-12 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.00)_0%,rgba(0,0,0,0.05)_28%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.24)_100%)]">
            <div className="mx-auto w-full max-w-120 px-4 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
              <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
                <button
                  type="submit"
                  className="flex h-14 w-full items-center justify-center bg-neutral px-4 text-sm font-semibold text-white"
                >
                  Create collection
                </button>
              </Squircle>
            </div>
          </div>
        </form>
      </Form>

      <AddTasbeehItemDrawer phrases={phrases} />
      <PhraseLibraryDrawer phrases={phrases} />

      <Drawer
        isOpen={isReferencePickerOpen}
        onClose={() => setIsReferencePickerOpen(false)}
        title="Reference source"
        snapPoints={["auto"]}
        presentation="height"
      >
        <div className="flex flex-col gap-2 px-4 pb-4">
          {(
            [
              { value: "none", label: "None" },
              { value: "quran", label: "Qur'an" },
              { value: "hadith", label: "Hadith" },
              { value: "scholar", label: "Scholar" },
              { value: "custom", label: "Custom" },
            ] as const
          ).map((option) => {
            const isSelected = referenceSourceType === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setReferenceSourceType(option.value);
                  setIsReferencePickerOpen(false);
                }}
                className={`flex h-14 items-center justify-between rounded-2xl px-4 transition-colors active:scale-[0.98] ${
                  isSelected
                    ? "border border-primary bg-primary/10"
                    : "border border-transparent bg-base-content/5 hover:bg-base-content/10"
                }`}
              >
                <Text
                  variant="body"
                  weight={isSelected ? "semibold" : "medium"}
                  color={isSelected ? "primary" : "base"}
                >
                  {option.label}
                </Text>
                {isSelected ? (
                  <Check size={20} className="text-primary" />
                ) : null}
              </button>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
}

function useMeasuredHeight(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const [height, setHeight] = React.useState(0);

  React.useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setHeight(el.getBoundingClientRect().height);
    };

    update();

    if (typeof ResizeObserver === "undefined") {
      const id = window.setInterval(update, 200);
      return () => window.clearInterval(id);
    }

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, ref]);

  return height;
}
