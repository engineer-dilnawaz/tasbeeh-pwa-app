import type { ThemeId } from "@/shared/config/constants";
import { THEME_MENU_CARDS } from "@/features/settings/themeMenu";

type ThemePickerProps = {
  theme: ThemeId;
  onSelect: (id: ThemeId) => void;
};

export function ThemePicker({ theme, onSelect }: ThemePickerProps) {
  return (
    <div className="mb-3">
      <div className="grid grid-cols-2 gap-2.5">
        {THEME_MENU_CARDS.map((card) => {
          const active = theme === card.id;
          return (
            <button
              key={card.id}
              type="button"
              data-theme={card.id}
              aria-pressed={active}
              onClick={() => onSelect(card.id)}
              className={[
                "flex flex-col gap-1 rounded-3xl border p-3.5 text-left transition active:scale-[0.98]",
                active
                  ? "border-green-600 bg-green-50 shadow-md accent-purple:border-purple-600 accent-purple:bg-purple-50 dark:border-green-400 dark:bg-green-950/40 dark:accent-purple:border-purple-400 dark:accent-purple:bg-purple-950/35"
                  : "border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-900/60",
              ].join(" ")}
            >
              <span
                className={[
                  "h-10 w-full rounded-2xl border border-slate-200/80 shadow-inner",
                  card.previewClass === "preview-light" &&
                    "bg-gradient-to-br from-slate-100 via-white to-purple-100/60",
                  card.previewClass === "preview-dark" &&
                    "bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900/70",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <span className="text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                {card.name}
              </span>
              <span
                className={[
                  "text-[11px] font-bold uppercase tracking-wide",
                  active
                    ? "text-green-800 accent-purple:text-purple-900 dark:text-green-300 dark:accent-purple:text-purple-200"
                    : "text-slate-500 dark:text-slate-400",
                ].join(" ")}
              >
                {card.tag}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
