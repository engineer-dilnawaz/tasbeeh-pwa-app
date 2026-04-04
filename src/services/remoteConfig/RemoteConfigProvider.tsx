import { fetchAndActivate, getRemoteConfig } from "firebase/remote-config";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { app } from "@/services/firebase/app";
import { LOCALE_STORAGE_KEY, REMOTE_CONFIG_DEFAULTS } from "./defaults";
import { getParameterSourceName } from "./inspect";
import {
  readDefaultLocale,
  readFeatureFlags,
  readI18nTree,
  readSupportedLocales,
} from "./parseFromRemote";
import type { LocaleCode, RemoteConfigStatus } from "./types";
import { RemoteConfigContext } from "./remoteConfigContext";

function loadStoredLocale(): LocaleCode | null {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (!stored) return null;
    const supported = readSupportedLocales(null);
    if (supported.includes(stored as LocaleCode)) return stored as LocaleCode;
  } catch {
    /* ignore */
  }
  return null;
}

function hasDeviceLocaleOverride(): boolean {
  try {
    return Boolean(localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return false;
  }
}

export function RemoteConfigProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<RemoteConfigStatus>(() =>
    app ? "loading" : "unavailable",
  );
  const [lastFetchError, setLastFetchError] = useState<Error | null>(null);
  const [configEpoch, setConfigEpoch] = useState(0);
  const [overrideTick, setOverrideTick] = useState(0);

  const rc = useMemo(() => {
    if (!app) return null;
    const instance = getRemoteConfig(app);
    instance.settings.minimumFetchIntervalMillis = import.meta.env.DEV ? 0 : 60 * 60 * 1000;
    instance.defaultConfig = REMOTE_CONFIG_DEFAULTS;
    return instance;
  }, []);

  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const stored = loadStoredLocale();
    if (stored) return stored;
    return readDefaultLocale(null);
  });

  const setLocale = useCallback((code: LocaleCode) => {
    localStorage.setItem(LOCALE_STORAGE_KEY, code);
    setLocaleState(code);
    setOverrideTick((n) => n + 1);
  }, []);

  const applyRemoteDefaultLocale = useCallback(() => {
    if (!rc) return;
    try {
      localStorage.removeItem(LOCALE_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    const rd = readDefaultLocale(rc);
    const sup = readSupportedLocales(rc);
    if (sup.includes(rd)) setLocaleState(rd);
    setOverrideTick((n) => n + 1);
  }, [rc]);

  const afterFetch = useCallback(
    (instance: NonNullable<typeof rc>) => {
      setConfigEpoch((n) => n + 1);
      setStatus("ready");
      const hasOverride = hasDeviceLocaleOverride();
      if (!hasOverride) {
        const rd = readDefaultLocale(instance);
        const sup = readSupportedLocales(instance);
        if (sup.includes(rd)) {
          setLocaleState(rd);
        }
      }
    },
    [],
  );

  const refresh = useCallback(async () => {
    if (!rc) return;
    setLastFetchError(null);
    try {
      await fetchAndActivate(rc);
      afterFetch(rc);
    } catch (e) {
      setLastFetchError(e instanceof Error ? e : new Error(String(e)));
      setStatus("error");
    }
  }, [rc, afterFetch]);

  useEffect(() => {
    if (!rc) return;
    fetchAndActivate(rc)
      .then(() => {
        afterFetch(rc);
      })
      .catch((e) => {
        setLastFetchError(e instanceof Error ? e : new Error(String(e)));
        setStatus("error");
      });
  }, [rc, afterFetch]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(() => {
    void configEpoch;
    void overrideTick;
    const instance = rc;
    const flags = readFeatureFlags(instance);
    const i18n = readI18nTree(instance);
    const remoteDefaultLocale = readDefaultLocale(instance);

    const t = (key: string): string => {
      const fromLoc = i18n[locale]?.[key];
      if (fromLoc) return fromLoc;
      const fromEn = i18n.en?.[key];
      if (fromEn) return fromEn;
      return key;
    };

    return {
      status: app ? status : "unavailable",
      lastFetchError,
      locale,
      remoteDefaultLocale,
      hasDeviceLocaleOverride: hasDeviceLocaleOverride(),
      sources: {
        default_locale: getParameterSourceName(instance, "default_locale"),
        feature_flags: getParameterSourceName(instance, "feature_flags"),
      },
      supportedLocales: readSupportedLocales(instance),
      setLocale,
      applyRemoteDefaultLocale,
      flags,
      i18n,
      refresh,
      t,
    };
  }, [
    rc,
    status,
    lastFetchError,
    locale,
    setLocale,
    refresh,
    configEpoch,
    applyRemoteDefaultLocale,
    overrideTick,
  ]);

  return <RemoteConfigContext.Provider value={value}>{children}</RemoteConfigContext.Provider>;
}
