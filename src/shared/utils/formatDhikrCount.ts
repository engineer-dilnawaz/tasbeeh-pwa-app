/**
 * Formats dhikr counts for display: grouping (e.g. 10,000) and optional
 * minimum integer width (e.g. 09). Uses en-US grouping; swap locale later if needed.
 */
export function formatDhikrCount(
  value: number,
  options?: { minIntegerDigits?: number },
): string {
  const n = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  const minIntegerDigits = options?.minIntegerDigits ?? 2;
  return new Intl.NumberFormat("en-US", {
    minimumIntegerDigits: minIntegerDigits,
    maximumFractionDigits: 0,
    useGrouping: true,
  }).format(n);
}

/**
 * Characters before the “natural” formatted tail (e.g. `0` + AnimatedNumbers `9` → `09`;
 * `0` + `1,000` → `01,000`). Empty when padding does not apply.
 */
export function leadingFormatPrefix(
  value: number,
  minIntegerDigits: number,
): string {
  if (minIntegerDigits <= 1) return "";
  const n = Math.max(0, Math.floor(Number.isFinite(value) ? value : 0));
  const full = formatDhikrCount(n, { minIntegerDigits });
  const natural = formatDhikrCount(n, { minIntegerDigits: 1 });
  if (full === natural || !full.endsWith(natural)) return "";
  return full.slice(0, full.length - natural.length);
}
