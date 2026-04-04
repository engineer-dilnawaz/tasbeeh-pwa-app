import { createContext } from "react";
import type { FeatureFlags, LocaleCode, RemoteConfigStatus, TranslationTree } from "./types";

export type RemoteConfigContextValue = {
  status: RemoteConfigStatus;
  lastFetchError: Error | null;
  locale: LocaleCode;
  /** `default_locale` from RC after fetch (what Firebase says the default should be) */
  remoteDefaultLocale: LocaleCode;
  /** `true` if `tasbeeh_locale` is set in localStorage (overrides remote default until cleared) */
  hasDeviceLocaleOverride: boolean;
  /** Where each key resolved from — use to verify Console publish */
  sources: { default_locale: string; feature_flags: string };
  supportedLocales: LocaleCode[];
  setLocale: (code: LocaleCode) => void;
  /** Clear device locale and switch to current Remote Config `default_locale` */
  applyRemoteDefaultLocale: () => void;
  flags: FeatureFlags;
  i18n: TranslationTree;
  refresh: () => Promise<void>;
  t: (key: string) => string;
};

export const RemoteConfigContext = createContext<RemoteConfigContextValue | null>(null);
