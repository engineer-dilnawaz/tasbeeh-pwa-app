import type { DaisyUiThemeName } from "@/shared/config/daisyUiThemes";

/**
 * Preview dot for a daisyUI theme. Variables come from nested `[data-theme]`.
 *
 * daisyUI `rootcolor` base sets `background` on *every* `[data-theme]` (page canvas).
 * Without clearing it, the wrapper paints `base-100` → a visible white/light square behind the circle.
 */
export function DaisyThemeSwatch({ theme }: { theme: DaisyUiThemeName }) {
  return (
    <div
      data-theme={theme}
      className="pointer-events-none inline-flex size-9 shrink-0 items-center justify-center"
      style={{
        background: "none",
        color: "inherit",
      }}
    >
      <div
        className="box-border size-full min-h-9 min-w-9 rounded-full border border-base-content/25 shadow-inner"
        style={{
          background:
            "linear-gradient(135deg, var(--color-base-200) 0%, var(--color-primary) 45%, var(--color-accent) 100%)",
        }}
        aria-hidden
      />
    </div>
  );
}
