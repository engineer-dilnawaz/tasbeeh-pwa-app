import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { installGlobalErrorHandlers } from "@/services/crashlytics";
import { applyThemeToDocument, readStoredTheme } from "@/shared/lib/theme";
import "@/shared/styles/global.css";
import App from "@/App.tsx";
import { AppProviders } from "@/app/providers.tsx";
import { registerServiceWorker } from "@/pwa/register";

installGlobalErrorHandlers();
applyThemeToDocument(readStoredTheme());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);

registerServiceWorker();
