import clsx from "clsx";
import { useEffect } from "react";
import { FONT_MAP, type AppFontId } from "@/shared/config/appFonts";
import { ensureGoogleFontLoaded } from "@/shared/lib/font";

const PREVIEW_TEXT = "Ya Salam Ya Momeen Ya Allah";

export function FontOptionCards({
  options,
  selectedId,
  onSelect,
}: {
  options: readonly { id: AppFontId; label: string }[];
  selectedId: AppFontId;
  onSelect: (id: AppFontId) => void;
}) {
  useEffect(() => {
    for (const { id } of options) {
      ensureGoogleFontLoaded(id);
    }
  }, [options]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = opt.id === selectedId;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={clsx(
              "flex min-h-[100px] w-full flex-col rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 ease-out",
              active
                ? "border-primary bg-primary/12 shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_28%,transparent)]"
                : "border-base-300 bg-base-100/70 active:scale-[0.99]",
            )}
          >
            <span className="text-[0.9375rem] font-extrabold tracking-tight text-base-content">
              {opt.label}
            </span>
            <p
              className="mt-2.5 flex-1 text-[0.95rem] font-medium leading-snug text-base-content/90 transition-[font-family] duration-300 ease-out"
              style={{ fontFamily: FONT_MAP[opt.id] }}
            >
              {PREVIEW_TEXT}
            </p>
          </button>
        );
      })}
    </div>
  );
}
