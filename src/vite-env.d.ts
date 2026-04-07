/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_RELEASE?: string;
  /** When `"true"`, send Sentry events during `yarn dev` (default: production only). */
  readonly VITE_SENTRY_ENABLE_IN_DEV?: string;
  /** Default `"true"`. Set to `"false"` to disable IP etc. per Sentry SDK. */
  readonly VITE_SENTRY_SEND_DEFAULT_PII?: string;
}

declare module "virtual:pwa-register" {
  export function registerSW(options?: {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
  }): (reloadPage?: boolean) => void;
}
