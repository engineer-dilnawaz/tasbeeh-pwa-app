/**
 * Reusable Tailwind class strings. Green = default accent; `html.accent-purple` switches brand to purple.
 */
export const twUi = {
  accentText:
    "text-green-700 accent-purple:text-purple-600 dark:text-green-400 dark:accent-purple:text-purple-400",
  accentTextStrong:
    "text-green-800 accent-purple:text-purple-700 dark:text-green-300 dark:accent-purple:text-purple-300",
  accentBg:
    "bg-green-600 accent-purple:bg-purple-600 dark:bg-green-500 dark:accent-purple:bg-purple-500",
  accentSoftBg:
    "bg-green-100 accent-purple:bg-purple-100 dark:bg-green-950/45 dark:accent-purple:bg-purple-950/45",
  accentSoftBorder:
    "border-green-200 accent-purple:border-purple-200 dark:border-green-800 dark:accent-purple:border-purple-800",
  accentOutline:
    "outline-green-600 accent-purple:outline-purple-600 dark:outline-green-400 dark:accent-purple:outline-purple-400",
  ringAccent:
    "ring-green-600 accent-purple:ring-purple-600 dark:ring-green-400 dark:accent-purple:ring-purple-400",
  mutedText: "text-slate-500 dark:text-slate-400",
  bodyText: "text-slate-800 dark:text-slate-100",
  secondaryText: "text-slate-600 dark:text-slate-300",
  cardBg: "bg-white dark:bg-slate-900/85",
  cardElevated: "bg-slate-100 dark:bg-slate-800/90",
  borderSubtle: "border border-slate-200 dark:border-slate-700",
  overlay: "bg-slate-950/55 dark:bg-slate-950/70",
  pagePad: "px-3 pt-2 pb-4",
  screenTitle:
    "font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight",
  squircleCard:
    "rounded-[22px] border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900/80 px-[18px] py-4",
  arabic:
    "block font-arabic text-xl leading-normal rtl text-right text-slate-900 dark:text-slate-100",
} as const;
