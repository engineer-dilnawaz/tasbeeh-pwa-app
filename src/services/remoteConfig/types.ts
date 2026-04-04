export type LocaleCode = "en" | "ur" | "ar";

export type FeatureFlags = {
  ayatSection: boolean;
  hadithSection: boolean;
  statsV2: boolean;
  installPrompt: boolean;
  remoteTheming: boolean;
};

/** locale → message key → string */
export type TranslationTree = Record<string, Record<string, string>>;

export type RemoteConfigStatus = "loading" | "ready" | "error" | "unavailable";
