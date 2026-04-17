import { useMemo, useState } from "react";
import { ChevronRight, Info, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";

import type {
  PrayerSlot,
  TasbeehCollectionGroupRow,
} from "@/features/tasbeeh/services/tasbeehDb";
import { SettingsActionSheet } from "@/features/settings/components/SettingsActionSheet";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";
import { SegmentedControl } from "@/shared/design-system/ui/SegmentedControl";
import { toast } from "@/shared/design-system/ui/useToast";

type CollectionDetails = {
  collection: TasbeehCollectionGroupRow;
  items: Array<{
    id: string;
    role: "start" | "main" | "end";
    targetCount: number;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    phrase: {
      id: string;
      arabic: string;
      transliteration: string;
      translation: string | null;
    } | null;
  }>;
};

const SLOT_LABEL: Record<PrayerSlot, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

function priorityLabel(priority: "low" | "normal" | "high") {
  if (priority === "high") return "Important";
  if (priority === "low") return "Optional";
  return "Standard";
}

function tagStyle(tag: string) {
  const palette = [
    "bg-primary/10 text-primary border-primary/20",
    "bg-secondary/10 text-secondary border-secondary/20",
    "bg-accent/10 text-accent border-accent/20",
    "bg-success/10 text-success border-success/20",
    "bg-warning/10 text-warning border-warning/20",
    "bg-info/10 text-info border-info/20",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1)
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length]!;
}

interface CollectionsCardProps {
  collection: TasbeehCollectionGroupRow;
  details: CollectionDetails | null;
}

export function CollectionsCard({ collection, details }: CollectionsCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<"start" | "main" | "end">(
    "main",
  );

  const [openDetailsSection, setOpenDetailsSection] = useState<
    "reference" | "tags" | "reminders" | "meta" | "items" | null
  >(null);
  const [openItemMetaId, setOpenItemMetaId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const tags = collection.tags ?? [];

  const descriptionText =
    collection.description ??
    "A beautiful daily practice designed to keep your heart steady. Recite with presence and calm, and let it become part of your rhythm after every prayer.";

  const recitationSlots = useMemo(() => {
    if (collection.scheduleType !== "prayer_specific" || !collection.slots)
      return [];
    return collection.slots;
  }, [collection.scheduleType, collection.slots]);

  const filteredItems =
    details?.items
      .filter((i) => i.role === roleFilter && i.phrase)
      .slice()
      .sort((a, b) => a.sortOrder - b.sortOrder) ?? [];

  const reference = collection.reference ?? { sourceType: "none" as const };
  const referenceDisplay =
    reference.sourceType !== "none"
      ? {
          title: reference.book ?? "Reference",
          body:
            reference.text ??
            reference.url ??
            reference.hadithNumber ??
            reference.verse ??
            "Reference available",
        }
      : {
          title: "Hadith reference (example)",
          body: "Sahih Muslim — Placeholder reference for UI. We'll wire real references when available.",
        };

  return (
    <>
      <Squircle
        cornerRadius={30}
        cornerSmoothing={0.99}
        className="surface-card w-full p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Text variant="heading" weight="semibold" className="truncate">
              {collection.title}
            </Text>
            <Text variant="caption" color="subtle" className="mt-1">
              Priority: {priorityLabel(collection.priority)}
            </Text>
          </div>
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => setIsDescriptionExpanded((v) => !v)}
            className="w-full text-left"
          >
            <Text
              variant="body"
              color="subtle"
              className={isDescriptionExpanded ? "" : "line-clamp-3"}
            >
              {descriptionText}
            </Text>
            <Text variant="caption" className="mt-1 text-primary font-semibold">
              {isDescriptionExpanded ? "Show less" : "See more"}
            </Text>
          </button>
        </div>

        {recitationSlots.length > 0 ? (
          <div className="mt-4">
            <Text variant="body" weight="semibold">
              Recitation Time:
            </Text>
            <div className="mt-2 flex flex-wrap gap-2">
              {recitationSlots.map((slot) => (
                <span
                  key={slot}
                  className="inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold text-primary"
                >
                  {SLOT_LABEL[slot]}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <Text variant="body" weight="semibold">
            Tasbeeh List
          </Text>
          <div className="mt-3">
            <SegmentedControl
              size="sm"
              uppercase={false}
              activeItemClassName="bg-white dark:bg-base-100"
              activeTextClassName="text-base-content"
              options={[
                { label: "Start", value: "start" },
                { label: "Main", value: "main" },
                { label: "End", value: "end" },
              ]}
              value={roleFilter}
              onChange={(value) => {
                setRoleFilter(value);
                setOpenItemId(null);
              }}
            />
          </div>
          <div className="mt-3 divide-y divide-base-content/8">
            {filteredItems.map((it) => {
              const isOpen = openItemId === it.id;
              return (
                <div key={it.id} className="py-3">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between text-left"
                    onClick={() => setOpenItemId(isOpen ? null : it.id)}
                  >
                    <Text variant="body" weight="medium">
                      {it.phrase!.transliteration}
                    </Text>
                    <motion.div
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-base-content/40"
                    >
                      <ChevronRight size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
                          <KeyValue title="Arabic" value={it.phrase!.arabic} />
                          <KeyValue
                            title="Transliteration"
                            value={it.phrase!.transliteration}
                          />
                          <KeyValue
                            title="Target"
                            value={`${it.targetCount}`}
                          />
                          <KeyValue
                            title="Role"
                            value={
                              it.role === "main"
                                ? "Main"
                                : it.role === "start"
                                  ? "Start"
                                  : "End"
                            }
                          />
                          <KeyValue
                            title="Translation"
                            value={it.phrase!.translation ?? "—"}
                          />
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredItems.length === 0 ? (
              <div className="py-3">
                <Text variant="body" color="subtle">
                  No items in this section.
                </Text>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
            <button
              type="button"
              onClick={() => {
                setIsActive((v) => !v);
                toast(isActive ? "Stopped" : "Started", {
                  variant: "info",
                  description:
                    "Progress wiring comes next — this is UI only for now.",
                });
              }}
              className={`flex h-14 w-full items-center justify-center px-4 text-sm font-semibold text-white ${
                isActive ? "bg-base-content/60" : "bg-neutral"
              }`}
            >
              {isActive ? "Stop Reciting" : "Start Reciting"}
            </button>
          </Squircle>

          <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
            <button
              type="button"
              onClick={() => setIsDetailsOpen(true)}
              className="flex h-14 w-full items-center justify-center border border-base-content/20 px-4 text-sm font-semibold"
            >
              Collection details
            </button>
          </Squircle>
        </div>
      </Squircle>

      <Drawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        snapPoints={["90%"]}
        title="Collection details"
        bottomInsetPx={0}
        scrollable
        presentation="height"
        contentPaddingBottomPx={64}
      >
        <div className="flex flex-col gap-3 pb-[max(180px,calc(env(safe-area-inset-bottom,0px)+140px))]">
          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4 py-3"
          >
            <AccordionSection
              title="Reference"
              isOpen={openDetailsSection === "reference"}
              onToggle={() =>
                setOpenDetailsSection((v) => {
                  if (v === "reference") {
                    setOpenItemMetaId(null);
                    return null;
                  }
                  return "reference";
                })
              }
            >
              <div className="pt-2">
                <KeyValue title="Source" value={referenceDisplay.title} />
                <div className="mt-3">
                  <KeyValue title="Details" value={referenceDisplay.body} />
                </div>
              </div>
            </AccordionSection>
          </Squircle>

          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4 py-3"
          >
            <AccordionSection
              title="Tags"
              isOpen={openDetailsSection === "tags"}
              onToggle={() =>
                setOpenDetailsSection((v) => {
                  if (v === "tags") {
                    setOpenItemMetaId(null);
                    return null;
                  }
                  return "tags";
                })
              }
            >
              <div className="pt-3">
                {tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${tagStyle(
                          tag,
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-base-content/50">
                    <Info size={16} />
                    <Text variant="body" color="subtle">
                      No tags added.
                    </Text>
                  </div>
                )}
              </div>
            </AccordionSection>
          </Squircle>

          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4 py-3"
          >
            <AccordionSection
              title="Reminders"
              isOpen={openDetailsSection === "reminders"}
              onToggle={() =>
                setOpenDetailsSection((v) => {
                  if (v === "reminders") {
                    setOpenItemMetaId(null);
                    return null;
                  }
                  return "reminders";
                })
              }
            >
              <div className="pt-2 grid grid-cols-2 gap-x-6 gap-y-4">
                <KeyValue
                  title="Schedule"
                  value={
                    collection.scheduleType === "prayer_specific"
                      ? "Prayer-specific"
                      : "Anytime today"
                  }
                />
                <KeyValue
                  title="Times per day"
                  value={`${collection.timesPerDay}`}
                />
                <KeyValue
                  title="Expiry policy"
                  value={
                    collection.slotExpiryPolicy === "next_prayer"
                      ? "Next prayer"
                      : "End of day"
                  }
                />
                <KeyValue
                  title="Reminder style"
                  value={
                    collection.reminderPolicy === "off"
                      ? "Off"
                      : collection.reminderPolicy === "gentle"
                        ? "Gentle"
                        : "Strong"
                  }
                />
              </div>
            </AccordionSection>
          </Squircle>

          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4 py-3"
          >
            <AccordionSection
              title="Meta"
              isOpen={openDetailsSection === "meta"}
              onToggle={() =>
                setOpenDetailsSection((v) => {
                  if (v === "meta") {
                    setOpenItemMetaId(null);
                    return null;
                  }
                  return "meta";
                })
              }
            >
              <div className="pt-2 grid grid-cols-2 gap-x-6 gap-y-4">
                <KeyValue
                  title="Created by"
                  value={collection.isDefault ? "System" : "You"}
                />
                <KeyValue
                  title="Sync"
                  value={
                    collection.syncStatus === "synced"
                      ? "Synced"
                      : "Not synced yet"
                  }
                />
                <KeyValue
                  title="Created at"
                  value={format(
                    new Date(collection.createdAt),
                    "MMMM dd, yyyy - hh:mm:a",
                  )}
                />
                <KeyValue
                  title="Updated at"
                  value={format(
                    new Date(collection.updatedAt),
                    "MMMM dd, yyyy - hh:mm:a",
                  )}
                />
              </div>
            </AccordionSection>
          </Squircle>

          <Squircle
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4 py-3"
          >
            <AccordionSection
              title="Tasbeeh List"
              isOpen={openDetailsSection === "items"}
              onToggle={() =>
                setOpenDetailsSection((v) => {
                  if (v === "items") {
                    setOpenItemMetaId(null);
                    return null;
                  }
                  return "items";
                })
              }
            >
              <div className="pt-2 divide-y divide-base-content/8">
                {(details?.items.filter((i) => i.phrase) ?? []).map((it) => {
                  const isOpen = openItemMetaId === it.id;
                  const orderLabel = getReadableOrderLabel(
                    details?.items ?? [],
                    it,
                  );
                  return (
                    <div key={it.id} className="py-3">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between text-left"
                        onClick={() => setOpenItemMetaId(isOpen ? null : it.id)}
                      >
                        <Text variant="body" weight="medium">
                          {it.phrase!.transliteration}
                        </Text>
                        <motion.div
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-base-content/40"
                        >
                          <ChevronRight size={18} />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {isOpen ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4">
                              <KeyValue title="Role" value={it.role} />
                              <KeyValue
                                title="Target"
                                value={`${it.targetCount}`}
                              />
                              <KeyValue title="Order" value={orderLabel} />
                              <KeyValue
                                title="Phrase id"
                                value={it.phrase!.id}
                              />
                              <KeyValue
                                title="Created at"
                                value={format(
                                  new Date(it.createdAt),
                                  "MMMM dd, yyyy - hh:mm:a",
                                )}
                              />
                              <KeyValue
                                title="Updated at"
                                value={format(
                                  new Date(it.updatedAt),
                                  "MMMM dd, yyyy - hh:mm:a",
                                )}
                              />
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </AccordionSection>
          </Squircle>

          <div className="mt-2 flex flex-col gap-3">
            <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
              <button
                type="button"
                onClick={() =>
                  toast("Update collection", {
                    variant: "info",
                    description: "Update flow is next.",
                  })
                }
                className="flex h-14 w-full items-center justify-center border border-base-content/20 px-4 text-sm font-semibold"
              >
                Update collection
              </button>
            </Squircle>

            <Squircle cornerRadius={100} cornerSmoothing={0.92} asChild>
              <button
                type="button"
                onClick={() => setShowDeleteSheet(true)}
                className="flex h-14 w-full items-center justify-center border border-error/35 bg-error/10 px-4 text-sm font-semibold text-error"
              >
                Delete collection
              </button>
            </Squircle>
          </div>

          <div className="h-[max(16px,env(safe-area-inset-bottom,0px))]" />
        </div>
      </Drawer>

      <SettingsActionSheet
        isOpen={showDeleteSheet}
        onClose={() => setShowDeleteSheet(false)}
        icon={Trash2}
        title="Delete collection"
        description="This will remove the collection from your device. Progress will remain once we wire it next."
        primaryButtonTitle="Delete"
        primaryCooldownSeconds={5}
        onPrimaryPress={() => {
          setShowDeleteSheet(false);
          setIsDetailsOpen(false);
          toast("Delete collection", {
            variant: "warning",
            description: "Delete flow placeholder. We’ll wire it next.",
          });
        }}
        iconWrapperClassName="border border-error/45 bg-error/12 text-error"
        primaryButtonClassName="bg-error text-white"
      />
    </>
  );
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between text-left"
        onClick={onToggle}
      >
        <Text variant="body" weight="semibold">
          {title}
        </Text>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-base-content/40"
        >
          <ChevronRight size={18} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function KeyValue({
  title,
  value,
  fullWidth,
}: {
  title: string;
  value: string;
  fullWidth?: boolean;
}) {
  const shouldFullWidth =
    fullWidth ??
    (isLongKeyValue(title, value) ||
      title.toLowerCase().includes("details") ||
      title.toLowerCase().includes("translation") ||
      title.toLowerCase().includes("arabic") ||
      title.toLowerCase().includes("transliteration"));

  return (
    <div className={`min-w-0 ${shouldFullWidth ? "col-span-2" : ""}`}>
      <Text variant="caption" color="subtle" weight="semibold">
        {title}
      </Text>
      <Text variant="body" className="mt-0.5 wrap-break-word">
        {value}
      </Text>
    </div>
  );
}

function isLongKeyValue(title: string, value: string) {
  const t = title.trim();
  const v = value.trim();
  if (v.length === 0) return false;
  if (v.includes("\n")) return true;
  if (v.length >= 34) return true;
  if (t.length + v.length >= 46) return true;
  return false;
}

function getReadableOrderLabel(
  allItems: CollectionDetails["items"],
  item: CollectionDetails["items"][number],
) {
  const sameRole = allItems
    .filter((i) => i.role === item.role)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const idx = sameRole.findIndex((i) => i.id === item.id);
  if (idx === -1) return "—";

  if (item.role === "end" && idx === sameRole.length - 1) return "Last";
  if (idx === 0) return "First";
  if (idx === 1) return "Second";
  if (idx === 2) return "Third";
  if (idx === 3) return "Fourth";
  if (idx === 4) return "Fifth";
  return `${idx + 1}th`;
}
