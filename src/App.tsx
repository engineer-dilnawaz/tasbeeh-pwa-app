import * as Sentry from "@sentry/react";
import type { FallbackRender } from "@sentry/react";
import { AppRouter } from "@/app/router";
import { DevLabButton } from "@/dev/DevLabButton";
import { twUi } from "@/shared/lib/twUi";

const sentryErrorFallback: FallbackRender = ({
  error,
  resetError,
  eventId,
}) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div
      className={`flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center ${twUi.bodyText}`}
    >
      <p className="m-0 text-lg font-bold">Something went wrong</p>
      <p className="m-0 max-w-sm text-sm leading-snug opacity-85 [word-break:break-word]">
        {message}
      </p>
      {eventId ? (
        <p className="m-0 text-xs opacity-60">Reference: {eventId}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={resetError}
          className={`cursor-pointer rounded-2xl border px-5 py-3 text-sm font-bold shadow-sm ${twUi.borderSubtle} ${twUi.cardBg} ${twUi.bodyText}`}
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.reload();
          }}
          className={`cursor-pointer rounded-2xl border-0 px-5 py-3 text-sm font-bold text-white ${twUi.accentBg}`}
        >
          Reload app
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Sentry.ErrorBoundary fallback={sentryErrorFallback} showDialog={false}>
      <AppRouter />
      {import.meta.env.DEV && <DevLabButton />}
    </Sentry.ErrorBoundary>
  );
}
