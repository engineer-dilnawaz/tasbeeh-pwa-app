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

initSentry();
installGlobalErrorHandlers();
applyThemeToDocument(readStoredDaisyTheme());
initAppFont();

const rootEl = document.getElementById("root")!;
createRoot(rootEl, getSentryReactRootOptions()).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);

registerServiceWorker();
