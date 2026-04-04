import { motion } from "framer-motion";
import { Globe, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getPublicAppName } from "@/services/auth/config";
import { useAuth } from "@/services/auth/useAuth";
import { firebaseReady } from "@/services/firebase/app";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";

import styles from "./SignIn.module.css";

export default function SignIn() {
  const { t } = useRemoteConfig();
  const {
    status,
    user,
    lastError,
    clearLastError,
    signInEmailPassword,
    registerEmailPassword,
    sendMagicLink,
    signInGoogle,
    requestPasswordResetEmail,
    signOut,
  } = useAuth();

  const [mode, setMode] = useState<"signIn" | "register">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const publicName = getPublicAppName();

  if (user) {
    return (
      <motion.main
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className={styles.root}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.inner}>
          <div className={styles.stateCard}>
            <h1 className={styles.stateTitle}>{t("auth.signedInTitle")}</h1>
            <p className={styles.hint}>{user.email}</p>
            <p className={`${styles.hint} settings-hint`}>{t("auth.signedInHint")}</p>
          </div>
          <div className={styles.actionsStack}>
            <button type="button" className="secondary-btn" onClick={() => void signOut()}>
              {t("auth.signOut")}
            </button>
          </div>
          <p className={styles.linksRow}>
            <Link to="/settings">{t("nav.settings")}</Link>
            <span aria-hidden>·</span>
            <Link to="/home" style={{ color: "var(--text-muted)" }}>
              {t("auth.backHome")}
            </Link>
          </p>
        </div>
      </motion.main>
    );
  }

  if (!firebaseReady || status === "unconfigured") {
    return (
      <motion.main
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className={styles.root}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.inner}>
          <div className={styles.hero}>
            <p className={styles.brand}>{publicName}</p>
            <h1 className={styles.title}>{t("auth.unavailableTitle")}</h1>
            <p className={styles.subtitle}>{t("auth.unavailableHint")}</p>
          </div>
          <p className={styles.footer}>
            <Link to="/settings" style={{ color: "var(--accent)" }}>
              {t("nav.settings")}
            </Link>
          </p>
        </div>
      </motion.main>
    );
  }

  const onSubmitPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearLastError();
    setBusy(true);
    try {
      if (mode === "register") {
        await registerEmailPassword(email, password);
      } else {
        await signInEmailPassword(email, password);
      }
    } catch {
      /* lastError set in provider */
    } finally {
      setBusy(false);
    }
  };

  const onSendMagicLink = async (e: FormEvent) => {
    e.preventDefault();
    clearLastError();
    setBusy(true);
    setMagicSent(false);
    try {
      await sendMagicLink(magicEmail);
      setMagicSent(true);
    } catch {
      /* lastError set */
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    clearLastError();
    setBusy(true);
    try {
      await signInGoogle();
    } catch {
      /* lastError set */
    } finally {
      setBusy(false);
    }
  };

  const onForgotPassword = async () => {
    clearLastError();
    setResetSent(false);
    setBusy(true);
    try {
      await requestPasswordResetEmail(email);
      setResetSent(true);
    } catch {
      /* lastError set in provider */
    } finally {
      setBusy(false);
    }
  };

  const authBusy = busy || status === "loading";

  return (
    <motion.main
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className={styles.root}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.inner}>
        <header className={styles.hero}>
          <p className={styles.brand}>{publicName}</p>
          <h1 className={styles.title}>{t("auth.title")}</h1>
          <p className={styles.subtitle}>{t("auth.subtitle")}</p>
        </header>

        {lastError && (
          <div className={styles.alert} role="alert">
            {lastError}
          </div>
        )}

        <section aria-labelledby="auth-google-heading">
          <p id="auth-google-heading" className={styles.sectionLabel}>
            {t("auth.googleSection")}
          </p>
          <button
            type="button"
            className={styles.googleBtn}
            disabled={authBusy}
            onClick={() => void onGoogle()}
          >
            <Globe size={22} strokeWidth={2} aria-hidden />
            {t("auth.signInGoogle")}
          </button>
        </section>

        <div className={styles.divider} role="separator">
          {t("auth.dividerOr")}
        </div>

        <section className={styles.card} aria-labelledby="auth-email-heading">
          <p id="auth-email-heading" className={styles.sectionLabel}>
            {t("auth.sectionPassword")}
          </p>
          <div className={styles.segment}>
            <button
              type="button"
              className={mode === "signIn" ? "secondary-btn" : "ghost-btn"}
              style={{ flex: 1 }}
              onClick={() => {
                setMode("signIn");
                setResetSent(false);
                clearLastError();
              }}
            >
              {t("auth.modeSignIn")}
            </button>
            <button
              type="button"
              className={mode === "register" ? "secondary-btn" : "ghost-btn"}
              style={{ flex: 1 }}
              onClick={() => {
                setMode("register");
                setResetSent(false);
                clearLastError();
              }}
            >
              {t("auth.modeRegister")}
            </button>
          </div>
          <form onSubmit={onSubmitPassword}>
            <label className={`setting-item ${styles.field}`} style={{ display: "block" }}>
              <span className="setting-label">
                <span className="setting-name">{t("auth.email")}</span>
              </span>
              <input
                className="setting-select"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className={`setting-item ${styles.field}`} style={{ display: "block" }}>
              <span className="setting-label">
                <span className="setting-name">{t("auth.password")}</span>
              </span>
              <input
                className="setting-select"
                type="password"
                autoComplete={mode === "register" ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </label>
            {mode === "signIn" && (
              <div className={styles.forgotRow}>
                <button
                  type="button"
                  className="auth-text-btn"
                  disabled={busy || !email.trim()}
                  onClick={() => void onForgotPassword()}
                >
                  {t("auth.forgotPassword")}
                </button>
                {resetSent && <p className={styles.hintOk}>{t("auth.resetSent")}</p>}
              </div>
            )}
            <button type="submit" className={styles.submitBtn} disabled={busy}>
              {mode === "register" ? t("auth.submitRegister") : t("auth.submitSignIn")}
            </button>
          </form>
        </section>

        <section
          className={`${styles.card} ${styles.cardElevated}`}
          aria-labelledby="auth-magic-heading"
        >
          <p id="auth-magic-heading" className={styles.magicHeading}>
            <Mail size={16} strokeWidth={2.2} aria-hidden />
            <span>{t("auth.magicTitle")}</span>
          </p>
          <p className={styles.magicHint}>{t("auth.magicHint")}</p>
          <form onSubmit={onSendMagicLink}>
            <label className={`setting-item ${styles.field}`} style={{ display: "block" }}>
              <span className="setting-label">
                <span className="setting-name">{t("auth.email")}</span>
              </span>
              <input
                className="setting-select"
                type="email"
                autoComplete="email"
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className="secondary-btn" style={{ width: "100%" }} disabled={busy}>
              {t("auth.sendMagicLink")}
            </button>
          </form>
          {magicSent && <p className={styles.hintOk}>{t("auth.magicSent")}</p>}
        </section>

        <footer className={styles.footer}>
          <Link to="/home">{t("auth.backHome")}</Link>
        </footer>
      </div>
    </motion.main>
  );
}
