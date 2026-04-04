import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ThemeId } from "@/shared/config/constants";
import { ThemePicker } from "@/features/settings/components/ThemePicker";
import { getPublicAppName } from "@/services/auth/config";
import { useAuth } from "@/services/auth/useAuth";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { firebaseReady } from "@/services/firebase/app";
import type { LocaleCode } from "@/services/remoteConfig/types";
import { applyThemeToDocument, persistTheme, readStoredTheme } from "@/shared/lib/theme";

export default function Settings() {
  const { user, status: authStatus, signOut } = useAuth();
  const publicAppName = getPublicAppName();
  const {
    t,
    status,
    lastFetchError,
    locale,
    remoteDefaultLocale,
    hasDeviceLocaleOverride,
    sources,
    supportedLocales,
    setLocale,
    applyRemoteDefaultLocale,
    flags,
    refresh,
  } = useRemoteConfig();
  const [theme, setTheme] = useState<ThemeId>(readStoredTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  const onSelect = (id: ThemeId) => {
    setTheme(id);
    applyThemeToDocument(id);
    persistTheme(id);
  };

  return (
    <motion.main
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      className="screen-pad"
    >
      <h1 className="screen-title">{t("nav.settings")}</h1>

      <div
        className="squircle-card"
        style={{ marginTop: "20px", fontSize: "13px", color: "var(--text-secondary)" }}
      >
        <p style={{ marginBottom: "8px", fontWeight: 600, color: "var(--text-primary)" }}>
          {t("settings.account.title")}
        </p>
        <p style={{ marginBottom: "6px" }}>
          <span style={{ color: "var(--text-muted)" }}>{t("settings.account.publicName")}: </span>
          <strong style={{ color: "var(--text-primary)" }}>{publicAppName}</strong>
        </p>
        <p className="settings-hint" style={{ marginBottom: "14px" }}>
          {t("settings.account.publicNameHint")}
        </p>
        {authStatus === "unconfigured" || !firebaseReady ? (
          <p className="settings-hint">{t("auth.unavailableHint")}</p>
        ) : user ? (
          <>
            <p style={{ marginBottom: "10px", wordBreak: "break-all" }}>
              <span style={{ color: "var(--text-muted)" }}>Email: </span>
              {user.email}
            </p>
            <button
              type="button"
              className="tap-btn"
              style={{ width: "100%", marginTop: "4px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              onClick={() => void signOut()}
            >
              <LogOut size={18} strokeWidth={2} aria-hidden />
              {t("auth.signOut")}
            </button>
          </>
        ) : (
          <Link to="/sign-in" className="secondary-btn" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            {t("settings.account.signInCta")}
          </Link>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <ThemePicker theme={theme} onSelect={onSelect} />
      </div>

      <div
        className="squircle-card"
        style={{ marginTop: "24px", fontSize: "13px", color: "var(--text-secondary)" }}
      >
        <p style={{ marginBottom: "8px", fontWeight: 600, color: "var(--text-primary)" }}>
          {t("settings.remote.title")}
        </p>
        <p className="settings-hint" style={{ marginBottom: "12px" }}>
          Status: {status}
          {lastFetchError ? ` — ${lastFetchError.message}` : ""}
        </p>

        <div
          style={{
            fontSize: "12px",
            lineHeight: 1.5,
            marginBottom: "12px",
            padding: "10px 12px",
            borderRadius: "12px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border)",
          }}
        >
          <p style={{ margin: "0 0 6px", color: "var(--text-muted)" }}>
            <strong style={{ color: "var(--text-primary)" }}>Remote Config debug</strong>
          </p>
          <p style={{ margin: 0 }}>
            <code>default_locale</code> from Firebase: <strong>{remoteDefaultLocale}</strong> —{" "}
            <span style={{ color: "var(--accent)" }}>{sources.default_locale}</span>
          </p>
          <p style={{ margin: "6px 0 0" }}>
            <code>feature_flags</code>: <span style={{ color: "var(--accent)" }}>{sources.feature_flags}</span>
          </p>
          <p style={{ margin: "6px 0 0" }}>
            App language (UI): <strong>{locale}</strong>
            {hasDeviceLocaleOverride ? (
              <>
                {" "}
                — saved on this device (overrides remote default until you reset).
              </>
            ) : (
              <> — follows Remote Config default (nothing in localStorage).</>
            )}
          </p>
        </div>

        {hasDeviceLocaleOverride && remoteDefaultLocale !== locale && (
          <button
            type="button"
            className="secondary-btn"
            style={{ marginBottom: "12px", width: "100%" }}
            onClick={() => applyRemoteDefaultLocale()}
          >
            Use Remote Config language ({remoteDefaultLocale.toUpperCase()})
          </button>
        )}

        <label className="setting-item" style={{ display: "flex", marginBottom: "12px" }}>
          <span className="setting-label">
            <span className="setting-name">{t("settings.remote.locale")}</span>
          </span>
          <select
            className="setting-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as LocaleCode)}
          >
            {supportedLocales.map((code) => (
              <option key={code} value={code}>
                {code.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <p style={{ fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
          {t("settings.remote.flags")}
        </p>
        <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.6 }}>
          {Object.entries(flags).map(([k, v]) => (
            <li key={k}>
              <code>{k}</code>: {v ? "on" : "off"}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="secondary-btn"
          style={{ marginTop: "14px", width: "100%" }}
          onClick={() => void refresh()}
        >
          {t("settings.remote.refresh")}
        </button>
      </div>

      <div
        className="squircle-card"
        style={{ marginTop: "16px", fontSize: "13px", color: "var(--text-secondary)" }}
      >
        <p style={{ marginBottom: "8px", fontWeight: 600, color: "var(--text-primary)" }}>
          Cloud backup
        </p>
        <p>
          Firebase:{" "}
          <strong style={{ color: firebaseReady ? "var(--accent)" : "var(--text-muted)" }}>
            {firebaseReady ? "configured" : "not configured"}
          </strong>
        </p>
        {!firebaseReady && (
          <p className="settings-hint" style={{ marginTop: "8px" }}>
            Copy <code>.env.example</code> to <code>.env.local</code> and add your Firebase web
            config.
          </p>
        )}
      </div>
    </motion.main>
  );
}
