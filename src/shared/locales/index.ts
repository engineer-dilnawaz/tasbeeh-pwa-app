import { en } from "./en";

const DICT = en;

type LeafPaths<TObj, Prefix extends string = ""> = {
  [K in keyof TObj & string]: TObj[K] extends Record<string, unknown>
    ? LeafPaths<TObj[K], `${Prefix}${K}.`>
    : `${Prefix}${K}`;
}[keyof TObj & string];

export type LocaleKey = LeafPaths<typeof DICT>;

export function t(key: LocaleKey) {
  const parts = key.split(".");
  let cur: unknown = DICT;

  for (const p of parts) {
    if (typeof cur !== "object" || cur === null || !(p in cur)) return key;
    cur = (cur as Record<string, unknown>)[p];
  }

  return typeof cur === "string" ? cur : key;
}

