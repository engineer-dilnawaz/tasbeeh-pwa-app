import { motion, AnimatePresence } from "framer-motion";
import { useLottie } from "lottie-react";
import { Globe, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/services/auth/useAuth";
import { firebaseReady } from "@/services/firebase/app";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import appLogo from "@/assets/lottie/app-logo.json";

import {
  Form,
  Input,
  signInSchema,
  registerSchema,
  emailOnlySchema,
  type RegisterFormData,
} from "@/shared/components/forms";

import styles from "./SignIn.module.css";
import formStyles from "@/shared/components/forms/Form.module.css";

function LogoLottie() {
  const { View } = useLottie({ animationData: appLogo, loop: true });
  return <div className={styles.lottiePlayer}>{View}</div>;
}

export default function SignIn() {
  const navigate = useNavigate();
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
    signInFacebook,
    signInAnonymously,
    requestPasswordResetEmail,
  } = useAuth();

  // Redirection: If user is already signed in, go home immediately
  useEffect(() => {
    if (user && status === "ready") {
      navigate("/home", { replace: true });
    }
  }, [user, status, navigate]);

  const [mode, setMode] = useState<"signIn" | "register">("signIn");
  const [useMagicLink, setUseMagicLink] = useState(false);
  
  const [magicSent, setMagicSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);

  // Determine which schema controls the submit blocker based on switch states
  const activeSchema = useMagicLink 
    ? emailOnlySchema 
    : (mode === "signIn" ? signInSchema : registerSchema);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(activeSchema) as any,
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (user || !firebaseReady || status === "unconfigured") {
    return (
      <motion.main
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        className={styles.root}
        transition={{ duration: 0.25 }}
      >
        <div className={styles.inner}>
          <div className={styles.lottieWrapper}>
            <LogoLottie />
          </div>
          <h1 className={styles.title}>{t("auth.unavailableTitle")}</h1>
          <p className={styles.subtitle}>{t("auth.unavailableHint")}</p>
          <p className={styles.registerRow}>
            <Link to="/settings" style={{ color: "var(--accent)" }}>
              {t("nav.settings")}
            </Link>
          </p>
        </div>
      </motion.main>
    );
  }

  const clearFeedback = () => {
    clearLastError();
    setMagicSent(false);
    setResetSent(false);
    form.clearErrors("root");
  };

  const onSubmitForm = async (data: RegisterFormData) => {
    clearFeedback();
    setBusy(true);

    try {
      if (useMagicLink) {
        await sendMagicLink(data.email);
        setMagicSent(true);
      } else if (mode === "register") {
        await registerEmailPassword(data.email, data.password, data.firstName, data.lastName);
      } else {
        await signInEmailPassword(data.email, data.password);
      }
    } catch {
      // errors handled by auth provider internally
    } finally {
      setBusy(false);
    }
  };

  const onForgotPassword = async () => {
    const isEmailOk = await form.trigger("email");
    const email = form.getValues("email");
    if (!isEmailOk || !email) return;

    clearFeedback();
    setBusy(true);
    try {
      await requestPasswordResetEmail(email);
      setResetSent(true);
    } catch {
      // handled by provider
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    clearFeedback();
    setBusy(true);
    try { await signInGoogle(); } catch {} finally { setBusy(false); }
  };

  const onFacebook = async () => {
    clearFeedback();
    setBusy(true);
    try { await signInFacebook(); } catch {} finally { setBusy(false); }
  };

  const onGuestLogin = async () => {
    clearFeedback();
    setBusy(true);
    try { await signInAnonymously(); } catch {} finally { setBusy(false); }
  };

  const authBusy = busy || status === "loading" || form.formState.isSubmitting;
  const displayError = lastError;

  return (
    <motion.main
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      className={styles.root}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.inner}>
        <div className={styles.lottieWrapper}>
          <LogoLottie />
        </div>

        <h1 className={styles.title}>
          {mode === "register" ? "Create Account" : t("auth.title")}
        </h1>
        <p className={styles.subtitle}>
          {mode === "register"
            ? "Create a free account to automatically sync your Tasbeeh counts and streaks across all your devices securely."
            : "Sign in via Email & Password, Social Auth, Magic Link or seamlessly continue as a Guest."}
        </p>
        
        {resetSent && <p className={styles.hintOk}>{t("auth.resetSent")}</p>}
        {magicSent && <p className={styles.hintOk}>{t("auth.magicSent")}</p>}

        <Form form={form} onSubmit={onSubmitForm} className={styles.formSection}>
          
          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden", display: "flex", gap: "12px", width: "100%" }}
              >
                <div style={{ flex: 1 }}>
                  <Input 
                    name="firstName" 
                    type="text" 
                    placeholder="First name" 
                    autoComplete="given-name" 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <Input 
                    name="lastName" 
                    type="text" 
                    placeholder="Last name" 
                    autoComplete="family-name" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Input 
            name="email" 
            type="email" 
            placeholder={t("auth.email")} 
            autoComplete="email" 
          />
          
          <AnimatePresence initial={false}>
            {!useMagicLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <Input 
                  name="password" 
                  type="password" 
                  placeholder={t("auth.password")} 
                  autoComplete={mode === "register" ? "new-password" : "current-password"} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <Input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="Confirm password" 
                  autoComplete="new-password" 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: "hidden" }}
              >
                <div className={formStyles.fieldError} role="alert">
                  {displayError}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {mode === "signIn" && (
            <div className={styles.actionsRow}>
              <label className={styles.switchLabel}>
                <div className={`${styles.switch} ${useMagicLink ? styles.switchActive : ""}`}>
                  <motion.div 
                    className={styles.switchHandle} 
                    animate={{ x: useMagicLink ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </div>
                <input 
                  type="checkbox" 
                  className={styles.hiddenCheckbox} 
                  checked={useMagicLink} 
                  onChange={(e) => {
                    setUseMagicLink(e.target.checked);
                    form.clearErrors();
                  }} 
                />
                <span className={styles.switchText}>Sign in with link</span>
              </label>

              <AnimatePresence>
                {!useMagicLink && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                  >
                    <button
                      type="button"
                      className={styles.forgotLink}
                      disabled={busy}
                      onClick={() => void onForgotPassword()}
                    >
                      {t("auth.forgotPassword")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <button type="submit" className={styles.primaryBtn} disabled={authBusy}>
            {mode === "register" 
              ? t("auth.submitRegister") 
              : (useMagicLink ? "Send Login Link" : t("auth.submitSignIn"))}
          </button>
          
          {mode === "signIn" && (
            <button
              type="button"
              className={styles.secondaryBtn}
              disabled={authBusy}
              onClick={() => void onGuestLogin()}
            >
              <UserCircle size={18} />
              Continue as Guest
            </button>
          )}
        </Form>

        {mode === "signIn" && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.divider} role="separator">
              {t("auth.dividerOr")}
            </div>

            <div className={styles.socialRow}>
              <button
                type="button"
                className={styles.socialBtn}
                disabled={authBusy}
                onClick={() => void onGoogle()}
              >
                <Globe size={18} strokeWidth={2.5} />
                Google
              </button>

              <button
                type="button"
                className={styles.socialBtn}
                disabled={authBusy}
                onClick={() => void onFacebook()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                </svg>
                Facebook
              </button>
            </div>
          </motion.div>
        )}

        <div className={styles.registerRow}>
          {mode === "signIn" ? "Don't have an account?" : "Already have an account?"}
          <button
            type="button"
            className={styles.registerToggle}
            onClick={() => {
              setMode(mode === "signIn" ? "register" : "signIn");
              setUseMagicLink(false);
              clearFeedback();
              form.reset();
            }}
          >
            {mode === "signIn" ? "Register" : "Sign In"}
          </button>
        </div>
      </div>
    </motion.main>
  );
}
