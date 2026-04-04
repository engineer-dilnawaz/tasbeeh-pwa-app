import { getValue, type RemoteConfig } from "firebase/remote-config";
import { REMOTE_CONFIG_DEFAULTS } from "./defaults";
import type { FeatureFlags, LocaleCode, TranslationTree } from "./types";

function parseJson<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const DEFAULT_FLAGS = parseJson<FeatureFlags>(
  REMOTE_CONFIG_DEFAULTS.feature_flags,
  {
    ayatSection: true,
    hadithSection: true,
    statsV2: false,
    installPrompt: true,
    remoteTheming: true,
  },
);

export function readDefaultLocale(rc: RemoteConfig | null): LocaleCode {
  const raw = rc ? getValue(rc, "default_locale").asString() : REMOTE_CONFIG_DEFAULTS.default_locale;
  return (raw as LocaleCode) || "en";
}

export function readSupportedLocales(rc: RemoteConfig | null): LocaleCode[] {
  const raw = rc
    ? getValue(rc, "supported_locales").asString()
    : REMOTE_CONFIG_DEFAULTS.supported_locales;
  return parseJson<LocaleCode[]>(raw, ["en", "ur", "ar"]);
}

export function readFeatureFlags(rc: RemoteConfig | null): FeatureFlags {
  const raw = rc ? getValue(rc, "feature_flags").asString() : REMOTE_CONFIG_DEFAULTS.feature_flags;
  return parseJson<FeatureFlags>(raw, DEFAULT_FLAGS);
}

function defaultI18nTree(): TranslationTree {
  return parseJson<TranslationTree>(REMOTE_CONFIG_DEFAULTS.i18n_strings, {});
}

/** Remote JSON overrides defaults per locale; missing keys fall back to bundled `defaults.ts`. */
function mergeTranslationTrees(remote: TranslationTree, defaults: TranslationTree): TranslationTree {
  const locales = new Set([...Object.keys(defaults), ...Object.keys(remote)]);
  const out: TranslationTree = {};
  for (const loc of locales) {
    out[loc] = { ...(defaults[loc] ?? {}), ...(remote[loc] ?? {}) };
  }
  return out;
}

export function readI18nTree(rc: RemoteConfig | null): TranslationTree {
  const defaults = defaultI18nTree();
  const raw = rc ? getValue(rc, "i18n_strings").asString() : REMOTE_CONFIG_DEFAULTS.i18n_strings;
  const remote = parseJson<TranslationTree>(raw, {});
  return mergeTranslationTrees(remote, defaults);
}
