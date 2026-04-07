import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { installGlobalErrorHandlers } from "@/services/crashlytics";
import {
  getSentryReactRootOptions,
  initSentry,
} from "@/services/sentry/initSentry";
import { initAppFont } from "@/shared/lib/font";
import { applyThemeToDocument, readStoredDaisyTheme } from "@/shared/lib/theme";
import "@/shared/styles/dubai-font.css";
import "@/shared/styles/global.css";
import App from "@/App.tsx";
import { AppProviders } from "@/app/providers.tsx";
import { registerServiceWorker } from "@/pwa/register";

// 🏆 Early Guard: Log errors as early as humanly possible
window.onerror = (message, source, lineno, colno, error) => {
  console.error("🏁 CRITICAL_EARLY_BOOT_ERROR:", {
    message,
    source,
    lineno,
    colno,
    error,
  });
  return false;
};

try {
  // Sentry must be first, but it must NOT crash the app
  initSentry();
} catch (e) {
  console.error("🚨 SENTRY_INIT_FAILED:", e);
}

try {
  installGlobalErrorHandlers();
  applyThemeToDocument(readStoredDaisyTheme());
  initAppFont();

  const rootEl = document.getElementById("root")!;
  const root = createRoot(rootEl, getSentryReactRootOptions());

  root.render(
    <StrictMode>
      <AppProviders>
        <App />
      </AppProviders>
    </StrictMode>,
  );
} catch (e) {
  console.error("🆘 APP_BOOT_FAILED:", e);
}

// Service worker is optional, keep it at the end
try {
  registerServiceWorker();
} catch (e) {
  console.warn("⚠️ SW_REGISTRATION_FAILED (ignoring):", e);
}
