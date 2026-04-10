import { useCallback, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  CalendarDays,
  FolderOpen,
  Play,
  Plus,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useTasbeehCatalog } from "@/features/tasbeeh/hooks/useTasbeeh";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { useUserTasbeehStore } from "@/features/customTasbeeh";
import { SquircleSheet } from "@/shared/components/SquircleSheet";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { UiButton } from "@/shared/components/ui/UiButton";
import type { Tasbeeh } from "@/shared/types/tasbeehCatalog";
import styles from "./Collections.module.css";

const RECOMMENDED_MAX = 6;
const SQUIRCLE_PILL = 22;
const SQUIRCLE_CARD = 18;
const SQUIRCLE_PANEL = 20;

function mergeSessionList(catalog: Tasbeeh[], user: Tasbeeh[]): Tasbeeh[] {
  const ids = new Set(catalog.map((t) => t.id));
  return [...catalog, ...user.filter((u) => !ids.has(u.id))];
}

function primaryCategory(item: Tasbeeh): string {
  const c = item.category?.[0];
  return c?.trim() ? c : "Dhikr";
}

export default function Collections() {
  const navigate = useNavigate();
  const prefersReduced = useReducedMotion();
  const { data: catalog = [], isLoading } = useTasbeehCatalog();
  const userItems = useUserTasbeehStore((s) => s.items);
  const setActiveTasbeeh = useTasbeehStore((s) => s.setActiveTasbeeh);

  const sessionList = useMemo(
    () => mergeSessionList(catalog, userItems),
    [catalog, userItems],
  );

  const recommended = useMemo(
    () => catalog.slice(0, RECOMMENDED_MAX),
    [catalog],
  );

  const [sheetItem, setSheetItem] = useState<Tasbeeh | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const closeSheet = useCallback(() => {
    setSheetItem(null);
    setShowDetails(false);
  }, []);

  const openSheet = useCallback((item: Tasbeeh) => {
    setShowDetails(false);
    setSheetItem(item);
  }, []);

  const startTasbeeh = useCallback(
    (item: Tasbeeh) => {
      const idx = sessionList.findIndex((t) => t.id === item.id);
      if (idx < 0) return;
      setActiveTasbeeh(item.id, idx);
      closeSheet();
      navigate("/home");
    },
    [sessionList, setActiveTasbeeh, closeSheet, navigate],
  );

  const handleContinueLast = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const handleDailySet = useCallback(() => {
    const first = sessionList[0];
    if (!first) return;
    setActiveTasbeeh(first.id, 0);
    navigate("/home");
  }, [sessionList, setActiveTasbeeh, navigate]);

  const pressable = prefersReduced
    ? ""
    : "transition-transform duration-150 active:scale-[0.98]";

  if (isLoading) {
    return (
      <div className="flex min-h-[min(320px,50dvh)] w-full flex-1 flex-col items-center justify-center bg-base-100">
        <motion.div
          animate={{ opacity: [0.35, 0.85, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="size-10 text-primary/40" aria-hidden />
        </motion.div>
        <p className="mt-6 text-sm text-base-content/50">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-base-100">
      <motion.main
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className={clsx(styles.container, "text-base-content")}
      >
        <p className="mb-0 text-base text-base-content/60">
          Choose your dhikr for today
        </p>

        {/* Quick actions */}
        <section className="mt-5" aria-label="Quick actions">
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <SmoothSquircle
              as="button"
              type="button"
              cornerRadius={SQUIRCLE_PILL}
              cornerSmoothing={1}
              borderWidth={1}
              onClick={handleContinueLast}
              className={clsx(
                styles.squircleBtn,
                "flex min-w-[148px] shrink-0 items-center gap-2 bg-base-300 px-4 py-3 text-left text-sm font-semibold text-base-content [&::before]:bg-primary/10 [&:hover::before]:bg-primary/15",
                pressable,
              )}
            >
              <Play className="size-4 shrink-0 text-primary" aria-hidden />
              Continue last
            </SmoothSquircle>
            <SmoothSquircle
              as="button"
              type="button"
              cornerRadius={SQUIRCLE_PILL}
              cornerSmoothing={1}
              borderWidth={1}
              onClick={handleDailySet}
              disabled={!sessionList.length}
              className={clsx(
                styles.squircleBtn,
                "flex min-w-[148px] shrink-0 items-center gap-2 bg-base-300 px-4 py-3 text-left text-sm font-semibold text-base-content [&::before]:bg-primary/10 [&:hover::before]:bg-primary/15 disabled:pointer-events-none disabled:opacity-40",
                pressable,
              )}
            >
              <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden />
              Daily set
            </SmoothSquircle>
          </div>
        </section>

        {/* Recommended */}
        <section className="mt-6" aria-labelledby="collections-recommended">
          <h2
            id="collections-recommended"
            className="mb-3 flex items-center gap-2 text-lg font-bold"
          >
            <Sparkles className="size-5 text-primary/80" aria-hidden />
            Recommended
          </h2>
          {recommended.length === 0 ? (
            <SmoothSquircle
              cornerRadius={SQUIRCLE_CARD}
              cornerSmoothing={1}
              borderWidth={1}
              className="bg-base-300 px-4 py-6 text-center text-sm text-base-content/60 [&::before]:bg-base-200/50"
            >
              No suggestions yet. Pull to refresh when you&apos;re online.
            </SmoothSquircle>
          ) : (
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {recommended.map((item) => (
                <SmoothSquircle
                  key={item.id}
                  as="button"
                  type="button"
                  cornerRadius={SQUIRCLE_CARD}
                  cornerSmoothing={1}
                  borderWidth={1}
                  onClick={() => openSheet(item)}
                  className={clsx(
                    styles.squircleBtn,
                    "w-[min(280px,calc(100vw-3rem))] shrink-0 snap-start bg-base-300 p-4 text-left shadow-sm hover:shadow-md [&::before]:bg-base-200",
                    pressable,
                  )}
                >
                  <p className="font-semibold leading-snug text-base-content">
                    {item.transliteration}
                  </p>
                  <p
                    className="Arabic-font mt-2 line-clamp-2 text-lg leading-relaxed text-base-content/90"
                    dir="rtl"
                  >
                    {item.text}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-base-content/60">
                    <span className="rounded-full bg-base-100/90 px-2.5 py-1">
                      Target: {item.target}
                    </span>
                    <span className="rounded-full bg-base-100/90 px-2.5 py-1">
                      {primaryCategory(item)}
                    </span>
                  </div>
                </SmoothSquircle>
              ))}
            </div>
          )}
        </section>

        {/* Your tasbeeh */}
        <section className="mt-6" aria-labelledby="collections-yours">
          <h2
            id="collections-yours"
            className="mb-3 flex items-center gap-2 text-lg font-bold"
          >
            <FolderOpen className="size-5 text-primary/80" aria-hidden />
            Your Tasbeeh
          </h2>
          {userItems.length === 0 ? (
            <div
              className={clsx(
                styles.personalEmptyFrame,
                "border border-dashed border-primary/35 bg-base-100",
              )}
            >
              <SmoothSquircle
                cornerRadius={SQUIRCLE_PANEL}
                cornerSmoothing={1}
                className="bg-primary/5 px-4 py-10 text-center"
              >
                <p className="text-base font-medium text-base-content/70">
                  No personal tasbeeh yet
                </p>
                <Link
                  to="/add"
                  className="btn btn-primary btn-sm mt-5 gap-2 rounded-full"
                >
                  <Plus className="size-4" aria-hidden />
                  Add Tasbeeh
                </Link>
              </SmoothSquircle>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {userItems.map((item) => (
                <SmoothSquircle
                  key={item.id}
                  as="button"
                  type="button"
                  cornerRadius={SQUIRCLE_CARD}
                  cornerSmoothing={1}
                  borderWidth={1}
                  onClick={() => openSheet(item)}
                  className={clsx(
                    styles.squircleBtn,
                    "flex w-full items-start gap-3 bg-base-300 p-4 text-left shadow-sm hover:shadow-md [&::before]:bg-primary/5 [&:hover::before]:bg-primary/10",
                    pressable,
                  )}
                >
                  <span className="badge badge-sm badge-primary shrink-0">
                    You
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug">{item.transliteration}</p>
                    <p
                      className="Arabic-font mt-1 line-clamp-2 text-base leading-relaxed"
                      dir="rtl"
                    >
                      {item.text}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-base-content/60">
                      <span className="rounded-full bg-base-100/80 px-2.5 py-1">
                        Target: {item.target}
                      </span>
                      <span className="rounded-full bg-base-100/80 px-2.5 py-1">
                        {primaryCategory(item)}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    className="size-5 shrink-0 text-base-content/30"
                    aria-hidden
                  />
                </SmoothSquircle>
              ))}
            </div>
          )}
        </section>
      </motion.main>

      {userItems.length > 0 ? (
        <Link
          to="/add"
          aria-label="Add custom tasbeeh"
          className="fixed z-960 flex size-14 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95"
          style={{
            right: "max(16px, env(safe-area-inset-right, 0px))",
            bottom: "calc(108px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <Plus className="size-7" strokeWidth={2} aria-hidden />
        </Link>
      ) : null}

      <SquircleSheet
        isOpen={sheetItem !== null}
        onClose={closeSheet}
        title={sheetItem?.transliteration ?? ""}
      >
        {sheetItem ? (
          <div className="flex flex-col gap-4">
            <p
              className="Arabic-font text-center text-2xl leading-relaxed text-base-content"
              dir="rtl"
            >
              {sheetItem.text}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-base-content/70">
              <span className="rounded-full bg-base-200 px-3 py-1">
                Target: {sheetItem.target}
              </span>
              <span className="rounded-full bg-base-200 px-3 py-1">
                {primaryCategory(sheetItem)}
              </span>
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <UiButton
                variant="primary"
                fullWidth
                label="Start Tasbeeh"
                icon={<Play className="size-4" aria-hidden />}
                onClick={() => startTasbeeh(sheetItem)}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm rounded-xl border border-base-300 font-semibold"
                onClick={() => setShowDetails((v) => !v)}
              >
                {showDetails ? "Hide details" : "View details"}
              </button>
            </div>

            {showDetails ? (
              <SmoothSquircle
                cornerRadius={SQUIRCLE_CARD}
                cornerSmoothing={1}
                borderWidth={1}
                className="mt-2 max-h-[42dvh] space-y-3 overflow-y-auto bg-base-300 p-4 text-sm leading-relaxed text-base-content/80 [&::before]:bg-base-200/45"
              >
                {sheetItem.meaningEn ? (
                  <p>
                    <span className="font-semibold text-base-content">Meaning: </span>
                    {sheetItem.meaningEn}
                  </p>
                ) : null}
                {sheetItem.benefitEn ? (
                  <p>
                    <span className="font-semibold text-base-content">Benefit: </span>
                    {sheetItem.benefitEn}
                  </p>
                ) : null}
                {sheetItem.reference?.hadith ? (
                  <p className="text-xs text-base-content/60">
                    {sheetItem.reference.grade ? `[${sheetItem.reference.grade}] ` : null}
                    {sheetItem.reference.hadith}
                  </p>
                ) : null}
                {!sheetItem.meaningEn &&
                !sheetItem.benefitEn &&
                !sheetItem.reference?.hadith ? (
                  <p className="text-base-content/50">No extra details for this phrase.</p>
                ) : null}
              </SmoothSquircle>
            ) : null}
          </div>
        ) : null}
      </SquircleSheet>
    </div>
  );
}
