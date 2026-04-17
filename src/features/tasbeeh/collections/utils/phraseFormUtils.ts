/** Arabic script and common Arabic-line punctuation — drops Latin and other scripts. */
export function filterArabicScriptInput(value: string): string {
  return [...value]
    .filter((ch) => {
      if (/\s/u.test(ch)) return true;
      if (ch === "\u0640" || ch === "\u200c" || ch === "\u200d") return true;
      if (/[\u060c\u061b\u061f]/u.test(ch)) return true;
      return /\p{Script=Arabic}/u.test(ch);
    })
    .join("");
}

export function clampComposerTarget(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.max(1, Math.min(9999, Math.round(value)));
}
