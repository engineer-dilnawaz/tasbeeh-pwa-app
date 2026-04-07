import clsx from "clsx";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Circle,
  Flame,
  RotateCcw,
  Undo2,
  Vibrate,
  VibrateOff,
} from "lucide-react";
import { useTasbeehCatalog } from "@/features/tasbeeh/hooks/useTasbeeh";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";
import { AnimatedDhikrCount } from "@/shared/components/AnimatedDhikrCount";
import { SquircleSheet } from "@/shared/components/SquircleSheet";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { UiButton } from "@/shared/components/ui/UiButton";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { formatDhikrCount } from "@/shared/utils/formatDhikrCount";
import {
  HAPTIC_COMPLETION_PATTERN,
  HAPTIC_TAP_MS,
  readUserVibrationDisabled,
  safeVibrate,
  subscribeVibrationPrefChanged,
  writeUserVibrationDisabled,
} from "@/shared/utils/haptics";
import type { Tasbeeh } from "@/shared/types/tasbeehCatalog";
import { ProgressRing } from "./ProgressRing";
import { HomeDhikrCounterSkeleton } from "./HomeDhikrCounterSkeleton";
import styles from "./HomeDhikrCounter.module.css";

const IDLE_MS = 36_000;

const SPARK_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

export function HomeDhikrCounter() {
  const { t } = useRemoteConfig();
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const countBtnHadPointerDownRef = useRef(false);
  const sparkGroupId = useId();

  const { data: tasbeehList = [], isLoading } = useTasbeehCatalog();

  const count = useTasbeehStore((s) => s.count);
  const currentIndex = useTasbeehStore((s) => s.currentIndex);
  const allowCompletionUndo = useTasbeehStore((s) => s.allowCompletionUndo);
  const increment = useTasbeehStore((s) => s.increment);
  const undoLastTap = useTasbeehStore((s) => s.undoLastTap);
  const resetCurrentRound = useTasbeehStore((s) => s.resetCurrentRound);
  const streak = useTasbeehStore((s) => s.streak);
  const completedIndicesToday = useTasbeehStore(
    (s) => s.completedIndicesToday ?? [],
  );
  const dailyGoal = useTasbeehStore((s) => s.dailyGoal ?? 4);

  const [celebrate, setCelebrate] = useState(false);
  const [completedLabel, setCompletedLabel] = useState("");
  const [lastTap, setLastTap] = useState(() => Date.now());
  const [idleHint, setIdleHint] = useState(false);
  const [resetSheetOpen, setResetSheetOpen] = useState(false);
  const [vibrationOff, setVibrationOff] = useState(readUserVibrationDisabled);

  const current = tasbeehList[currentIndex] ?? tasbeehList[0];
  const target = current?.target ?? 100;
  const remaining = Math.max(0, target - count);

  const todayDone = completedIndicesToday.length;
  const goalDisplay = Math.min(dailyGoal, tasbeehList.length);
  const canUndo = count > 0 || allowCompletionUndo;

  const idleMotionTransition = useMemo(
    () =>
      prefersReduced
        ? { duration: 0.12 }
        : { duration: 0.32, ease: [0.16, 1, 0.3, 1] as const },
    [prefersReduced],
  );

  /** Haptics are intentionally not tied to "reduce motion" — that setting is for animation. */
  const pulseHaptic = useCallback(
    (pattern: number | number[]) => {
      if (vibrationOff) return;
      safeVibrate(pattern);
    },
    [vibrationOff],
  );

  useEffect(() => {
    const id = window.setTimeout(() => setIdleHint(true), IDLE_MS);
    return () => clearTimeout(id);
  }, [lastTap]);

  useEffect(() => {
    const sync = () => setVibrationOff(readUserVibrationDisabled());
    const unsub = subscribeVibrationPrefChanged(sync);
    const onFocus = () => sync();
    window.addEventListener("focus", onFocus);
    return () => {
      unsub();
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const toggleVibration = useCallback(() => {
    setVibrationOff((off) => {
      const nextDisabled = !off;
      writeUserVibrationDisabled(nextDisabled);
      if (!nextDisabled) {
        safeVibrate(HAPTIC_TAP_MS);
      }
      return nextDisabled;
    });
  }, []);

  const onCountPointerDown = useCallback(
    (e: PointerEvent<HTMLButtonElement>) => {
      if (e.button !== 0) return;
      countBtnHadPointerDownRef.current = true;
      const {
        count: c,
        currentIndex: i,
      } = useTasbeehStore.getState();
      const tcount = tasbeehList[i]?.target ?? 100;
      if (c + 1 < tcount) pulseHaptic(HAPTIC_TAP_MS);
    },
    [pulseHaptic, tasbeehList],
  );

  const onTap = useCallback(() => {
    setIdleHint(false);
    setLastTap(Date.now());
    const hadPointerDown = countBtnHadPointerDownRef.current;
    countBtnHadPointerDownRef.current = false;

    const r = increment(target, current?.transliteration ?? "Dhikr", tasbeehList.length);
    if (r.completed) {
      setCompletedLabel(r.label);
      if (!prefersReduced) setCelebrate(true);
      window.setTimeout(() => setCelebrate(false), 1200);
      pulseHaptic([...HAPTIC_COMPLETION_PATTERN]);
      queueMicrotask(() => dialogRef.current?.showModal());
    } else if (!hadPointerDown) {
      pulseHaptic(HAPTIC_TAP_MS);
    }
  }, [increment, prefersReduced, pulseHaptic, target, current?.transliteration, tasbeehList.length]);

  const onUndo = useCallback(() => {
    if (!canUndo) return;
    setIdleHint(false);
    setLastTap(Date.now());
    
    const prevLen = Math.max(tasbeehList.length, 1);
    const prevItemIdx = (currentIndex - 1 + prevLen) % prevLen;
    const prevTarget = tasbeehList[prevItemIdx]?.target ?? 100;
    
    undoLastTap(prevTarget, tasbeehList.length);
  }, [canUndo, undoLastTap, currentIndex, tasbeehList]);

  if (isLoading || !tasbeehList.length) {
    return <HomeDhikrCounterSkeleton />;
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-6 self-center pb-4 ">
      {/* 1. Spiritual context — squircle surface, strong separation from page */}
      <SmoothSquircle
        cornerRadius={24}
        cornerSmoothing={1}
        className="w-full border border-base-300 bg-base-100 shadow-xl ring-1 ring-base-content/10"
        style={{ boxSizing: "border-box" }}
      >
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          <p
            className="text-center text-[1.35rem] font-semibold leading-snug tracking-tight text-base-content sm:text-2xl"
            dir="rtl"
          >
            {current?.text ?? ""}
          </p>
          <p className="text-center text-sm font-medium leading-relaxed text-base-content/80">
            {current?.transliteration ?? ""}
          </p>
          {current?.meaningEn ? (
            <p className="m-0 text-center text-sm font-semibold italic text-primary/90">
              {current.meaningEn}
            </p>
          ) : null}
          <p
            className="m-0 text-center text-xs leading-relaxed text-base-content/55"
            dir="rtl"
          >
            {current?.urdu ?? ""}
          </p>
          {current?.benefitEn ? (
            <p className="m-0 flex gap-2 rounded-box border border-base-300 bg-base-200/70 p-3 text-left text-xs font-medium leading-relaxed text-base-content/80">
              <span aria-hidden>💡</span>
              <span>{current.benefitEn}</span>
            </p>
          ) : null}
        </div>
      </SmoothSquircle>

      {/* Motivation strip */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-semibold text-base-content/80">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-base-200/80 px-3 py-1.5">
          <Flame className="size-4 text-warning" aria-hidden />
          {t("home.streakLabel") || "Streak"}: {streak}{" "}
          {t("home.streakDays") || "days"}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary">
          {t("home.todayProgress") || "Today"}: {todayDone}/{goalDisplay}
        </span>
      </div>

      {/* 2–3. Focus + tap (ring + counter inside) */}
      <div className="relative flex flex-col items-center gap-3">
        <p className="m-0 max-w-[300px] text-center text-xs text-base-content/50">
          {t("home.counterHint") ||
            "Tap the large button after each recitation."}
        </p>

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onPointerDown={onCountPointerDown}
          onClick={onTap}
          className={clsx(
            "relative flex cursor-pointer flex-col items-center justify-center rounded-full border-2 border-primary/40 bg-base-100 p-2 outline-none transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-base-300",
            styles.tapGlow,
          )}
          aria-label={t("home.tapToCountAria") || "Add one dhikr"}
        >
          <ProgressRing count={count} target={target} size={220}>
            <AnimatedDhikrCount
              value={count}
              minIntegerDigits={2}
              prefersReducedMotion={Boolean(prefersReduced)}
              className="tabular-nums"
              style={{
                fontSize: "clamp(2.35rem, 11vw, 3rem)",
                fontWeight: 900,
                color: "var(--color-primary)",
                lineHeight: 1,
              }}
            />
            <span className="mt-1 text-sm font-bold tabular-nums text-base-content/50">
              / {formatDhikrCount(target, { minIntegerDigits: 1 })}
            </span>
          </ProgressRing>
        </motion.button>

        <p className="m-0 text-center text-sm font-medium text-base-content/60">
          {remaining > 0
            ? `${formatDhikrCount(remaining, { minIntegerDigits: 1 })} ${
                t("home.counterTapsLeft") || "taps to go"
              }`
            : ""}
        </p>
      </div>

      {/* Idle nudge — animate height + margin so layout below doesn’t jump */}
      <motion.div
        className="w-full overflow-hidden"
        initial={false}
        animate={{
          maxHeight: idleHint ? 220 : 0,
          opacity: idleHint ? 1 : 0,
          marginBottom: idleHint ? 12 : 0,
        }}
        transition={idleMotionTransition}
        aria-hidden={!idleHint}
      >
        <div
          role="alert"
          className={clsx(
            "alert alert-warning alert-soft justify-center text-center text-sm font-semibold leading-snug shadow-sm",
            !idleHint && "pointer-events-none",
          )}
        >
          <span>
            {t("home.idleNudge") ||
              "Still here? A calm breath, then continue when you are ready."}
          </span>
        </div>
      </motion.div>

      {/* 4. Sequence */}
      <div className="w-full">
        <p className="mb-2 ml-0.5 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-base-content/45">
          {t("home.sequenceTitle") || "Your sequence"}
        </p>
        <ul className="flex flex-col gap-1.5 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-sm">
          {tasbeehList.map((item: Tasbeeh, idx: number) => {
            const isCurrent = idx === currentIndex;
            const doneToday = completedIndicesToday.includes(idx);
            return (
              <li
                key={`${item.transliteration}-${idx}`}
                aria-current={isCurrent ? "step" : undefined}
                className={clsx(
                  "flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  isCurrent &&
                    "border border-success/30 bg-success/10 text-base-content shadow-sm",
                  !isCurrent && doneToday && "opacity-55",
                  !isCurrent && !doneToday && "bg-base-200/50",
                )}
              >
                <div
                  className={clsx(
                    "flex min-w-0 flex-1 items-center gap-2",
                    !isCurrent && "text-base-content/65",
                  )}
                >
                  <span
                    className="flex size-5 shrink-0 items-center justify-center"
                    aria-hidden
                  >
                    {isCurrent ? (
                      <ArrowRight
                        className="size-[18px] text-success"
                        strokeWidth={2.5}
                      />
                    ) : doneToday ? (
                      <Check className="size-4" strokeWidth={2.5} />
                    ) : (
                      <Circle className="size-3.5" strokeWidth={2} />
                    )}
                  </span>
                  <p
                    className={clsx(
                      "min-w-0 leading-snug",
                      isCurrent ? "font-semibold" : "font-medium",
                    )}
                  >
                    {item.transliteration}
                  </p>
                </div>
                {isCurrent ? (
                  <div className="inline-grid *:[grid-area:1/1] shrink-0 self-center">
                    <div
                      className="status status-success animate-ping"
                      aria-hidden
                    />
                    <span className="status status-success status-md" />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 6. Actions — full-width equal secondary buttons */}
      <div className="flex w-full gap-2 border-t border-base-300/60 pt-4">
        <button
          type="button"
          className="btn btn-soft btn-sm h-11 min-h-11 flex-1 basis-0 min-w-0 rounded-xl px-2 font-semibold shadow-sm"
          onClick={() => {
            setIdleHint(false);
            setResetSheetOpen(true);
          }}
          title={t("home.actionResetTitle") || "Reset count for this dhikr"}
        >
          <span className="flex min-w-0 items-center justify-center gap-1.5">
            <RotateCcw className="size-4 shrink-0 opacity-90" aria-hidden />
            <span className="truncate">{t("home.actionReset") || "Reset"}</span>
          </span>
        </button>
        <button
          type="button"
          className="btn btn-soft btn-sm h-11 min-h-11 flex-1 basis-0 min-w-0 rounded-xl px-2 font-semibold shadow-sm disabled:opacity-40"
          disabled={!canUndo}
          onClick={onUndo}
          title={t("home.actionUndoTitle") || "Undo last tap"}
        >
          <span className="flex min-w-0 items-center justify-center gap-1.5">
            <Undo2 className="size-4 shrink-0 opacity-90" aria-hidden />
            <span className="truncate">{t("home.actionUndo") || "Undo"}</span>
          </span>
        </button>
        <button
          type="button"
          className={clsx(
            "btn btn-soft btn-sm h-11 min-h-11 flex-1 basis-0 min-w-0 rounded-xl px-2 font-semibold shadow-sm",
            vibrationOff && "opacity-80",
          )}
          aria-label={
            vibrationOff
              ? t("home.vibrationTurnOn") || "Turn vibration on"
              : t("home.vibrationTurnOff") || "Turn vibration off"
          }
          aria-pressed={!vibrationOff}
          title={
            vibrationOff
              ? t("home.vibrationTurnOn") || "Turn vibration on"
              : t("home.vibrationTurnOff") || "Turn vibration off"
          }
          onClick={toggleVibration}
        >
          <span className="flex min-w-0 items-center justify-center gap-1.5">
            {vibrationOff ? (
              <VibrateOff className="size-4 shrink-0 opacity-90" aria-hidden />
            ) : (
              <Vibrate className="size-4 shrink-0 opacity-90" aria-hidden />
            )}
            <span className="truncate">
              {t("home.actionHaptics") || "Haptics"}
            </span>
          </span>
        </button>
      </div>

      <SquircleSheet
        isOpen={resetSheetOpen}
        onClose={() => setResetSheetOpen(false)}
        title={t("home.resetSheetTitle") || "Reset this dhikr?"}
      >
        <p className="mb-6 px-0.5 text-center text-sm font-semibold leading-relaxed text-base-content/75">
          {t("home.resetSheetBody") ||
            "Your count for the current dhikr will go back to zero. Daily progress and history stay as they are."}
        </p>
        <div className="flex flex-col gap-3">
          <UiButton
            label={t("home.resetSheetConfirm") || "Reset count"}
            variant="danger"
            fullWidth
            onClick={() => {
              setIdleHint(false);
              resetCurrentRound();
              setLastTap(Date.now());
              setResetSheetOpen(false);
            }}
          />
          <UiButton
            label={t("home.resetSheetCancel") || "Cancel"}
            variant="secondary"
            fullWidth
            onClick={() => setResetSheetOpen(false)}
          />
        </div>
      </SquircleSheet>

      {/* Celebration overlay (CSS sparks) */}
      {celebrate ? (
        <div className={styles.celebration} aria-hidden>
          {SPARK_ANGLES.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const dist = 96 + (i % 3) * 18;
            const tx = Math.cos(rad) * dist;
            const ty = Math.sin(rad) * dist;
            return (
              <span
                key={`${sparkGroupId}-${deg}`}
                className={styles.spark}
                style={
                  {
                    "--tx": `${tx}px`,
                    "--ty": `${ty}px`,
                    "--delay": `${i * 35}ms`,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      ) : null}

      {/* Completion modal — portal to body so fixed centering works (avoids transformed ancestors e.g. motion.main). */}
      {typeof document !== "undefined"
        ? createPortal(
            <dialog
              ref={dialogRef}
              className="modal modal-middle"
              onClose={() => setCompletedLabel("")}
            >
              <div className="modal-box max-w-sm border border-base-300 bg-base-100 text-center">
                <h3 className="text-lg font-bold text-base-content">
                  {t("home.completeTitle") || "Completed 🤍"}
                </h3>
                <p className="py-1 text-sm font-semibold text-primary">
                  {completedLabel}
                </p>
                <p className="text-sm leading-relaxed text-base-content/75">
                  {t("home.completeBody") ||
                    "May Allah accept it and multiply the reward."}
                </p>
                <p className="text-xs text-base-content/55">
                  {t("home.completeNext") ||
                    "The next dhikr is ready when you close this."}
                </p>
                <div className="modal-action justify-center">
                  <form method="dialog">
                    <button
                      type="submit"
                      className="btn btn-primary btn-wide rounded-xl"
                    >
                      {t("home.completeCta") || "Continue"}
                    </button>
                  </form>
                </div>
              </div>
              <form method="dialog" className="modal-backdrop">
                <button type="submit" className="text-transparent">
                  close
                </button>
              </form>
            </dialog>,
            document.body,
          )
        : null}
    </div>
  );
}
