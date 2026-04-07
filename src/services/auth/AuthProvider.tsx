import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { trackLogin, trackSignUp } from "@/services/analytics";
import { setCrashlyticsUserId } from "@/services/crashlytics";
import { auth as firebaseAuth } from "@/services/firebase/app";
import { tasbeehRepository } from "@/features/tasbeeh/api/tasbeeh.repository";
import { syncUserDocument } from "@/services/firebase/users";
import { formatAuthError } from "./errors";
import {
  registerWithEmailPassword,
  requestPasswordResetEmail as sendPasswordReset,
  signInWithEmailPassword,
} from "./actions/emailPassword";
import {
  clearStoredEmailForSignIn,
  completeSignInWithEmailLink,
  isCurrentUrlEmailSignInLink,
  readStoredEmailForSignIn,
  sendEmailSignInLink,
  storeEmailForSignIn,
} from "./actions/emailLink";
import { signInWithGoogle } from "./actions/google";
import { signInWithFacebook } from "./actions/facebook";
import { signInAnonymouslyUser } from "./actions/anonymous";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./authContext";
import { twUi } from "@/shared/lib/twUi";

function EmailLinkSplash() {
  const { t } = useRemoteConfig();
  return (
    <div className={`px-3 pb-4 pt-12`}>
      <p className={`${twUi.screenTitle} text-[1.1rem]`}>{t("auth.completing")}</p>
    </div>
  );
}

/** One completion per page load (avoids duplicate sign-in attempts under React Strict Mode). */
let emailLinkCompletionOnce: Promise<void> | null = null;

/** Previous Firebase uid — used to detect real sign-out vs initial null session. */
let lastFirebaseUid: string | null = null;

function runEmailLinkCompletion(navigate: NavigateFunction): Promise<void> {
  if (!firebaseAuth || !isCurrentUrlEmailSignInLink(firebaseAuth)) {
    return Promise.resolve();
  }

  if (!emailLinkCompletionOnce) {
    emailLinkCompletionOnce = (async () => {
      let email = readStoredEmailForSignIn();
      if (!email) {
        email = window.prompt("Confirm the email address you used to request the sign-in link.") ?? "";
      }
      if (!email) {
        void navigate("/sign-in", { replace: true });
        return;
      }

      try {
        await completeSignInWithEmailLink(firebaseAuth!, email, window.location.href);
        clearStoredEmailForSignIn();
        trackLogin("email_link");
        void navigate("/home", { replace: true });
      } catch {
        clearStoredEmailForSignIn();
        void navigate("/sign-in", { replace: true });
      }
    })().finally(() => {
      emailLinkCompletionOnce = null;
    });
  }

  return emailLinkCompletionOnce;
}

function EmailLinkCompletion({ onDone }: { onDone: () => void }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!firebaseAuth) {
      onDone();
      return;
    }

    if (!isCurrentUrlEmailSignInLink(firebaseAuth)) {
      onDone();
      return;
    }

    void runEmailLinkCompletion(navigate).finally(() => {
      onDone();
    });
  }, [navigate, onDone]);

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() => (firebaseAuth ? "loading" : "unconfigured"));
  const [user, setUser] = useState<User | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [emailLinkPending, setEmailLinkPending] = useState(() =>
    Boolean(firebaseAuth && isCurrentUrlEmailSignInLink(firebaseAuth)),
  );

  const clearLastError = useCallback(() => setLastError(null), []);

  useEffect(() => {
    if (!firebaseAuth) return;

    let syncCleanup: (() => void) | null = null;

    const unsub = onAuthStateChanged(firebaseAuth, (next) => {
      const nextUid = next?.uid ?? null;
      if (next) {
        void syncUserDocument(next).catch(() => {});
        syncCleanup = tasbeehRepository.initRealtimeSync();
      } else {
        if (syncCleanup) {
          syncCleanup();
          syncCleanup = null;
        }
        if (lastFirebaseUid !== null) {
          // You could optionally clear local DB on sign out
          // tasbeehLocal.clear(); 
        }
      }
      lastFirebaseUid = nextUid;
      setUser(next);
      setCrashlyticsUserId(next?.uid ?? null);
      setStatus("ready");
    });

    return () => {
      unsub();
      if (syncCleanup) syncCleanup();
    };
  }, []);

  const signInEmailPassword = useCallback(async (email: string, password: string) => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await signInWithEmailPassword(firebaseAuth, email, password);
      trackLogin("password");
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const registerEmailPassword = useCallback(async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      const cred = await registerWithEmailPassword(firebaseAuth, email, password, firstName, lastName);
      trackSignUp("password");
      try {
        await syncUserDocument(cred.user);
      } catch {
        /* Rules / network — onAuthStateChanged will call syncUserDocument again */
      }
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const sendMagicLink = useCallback(async (email: string) => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await sendEmailSignInLink(firebaseAuth, email);
      storeEmailForSignIn(email);
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await signInWithGoogle(firebaseAuth);
      trackLogin("google");
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const signInFacebook = useCallback(async () => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await signInWithFacebook(firebaseAuth);
      trackLogin("facebook");
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const signInAnonymously = useCallback(async () => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await signInAnonymouslyUser(firebaseAuth);
      trackLogin("anonymous");
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const requestPasswordResetEmail = useCallback(async (email: string) => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await sendPasswordReset(firebaseAuth, email);
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!firebaseAuth) return;
    setLastError(null);
    try {
      await firebaseSignOut(firebaseAuth);
    } catch (e) {
      setLastError(formatAuthError(e));
      throw e;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
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
      signOut,
    }),
    [
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
      signOut,
    ],
  );

  if (emailLinkPending && firebaseAuth) {
    return (
      <AuthContext.Provider value={value}>
        <EmailLinkCompletion onDone={() => setEmailLinkPending(false)} />
        <EmailLinkSplash />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
