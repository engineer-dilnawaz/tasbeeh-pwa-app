import type { PineGreenPalette } from "./types";

/** Maps palette keys to CSS custom properties, e.g. pineGreen700 → --pine-green-700 */
export function pineGreenKeyToCssVar(key: keyof PineGreenPalette): `--${string}` {
  const m = /^pineGreen(\d+)$/.exec(key);
  if (!m) throw new Error(`Invalid pine green key: ${String(key)}`);
  return `--pine-green-${m[1]}`;
}

export function applyPineGreenPaletteToRoot(
  colors: PineGreenPalette,
  root: HTMLElement = document.documentElement,
) {
  (Object.keys(colors) as (keyof PineGreenPalette)[]).forEach((key) => {
    root.style.setProperty(pineGreenKeyToCssVar(key), colors[key]);
  });
}
