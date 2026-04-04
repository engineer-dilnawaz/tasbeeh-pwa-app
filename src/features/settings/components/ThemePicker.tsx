import type { ThemeId } from "@/shared/config/constants";
import { THEME_MENU_CARDS } from "@/features/settings/themeMenu";

type ThemePickerProps = {
  theme: ThemeId;
  onSelect: (id: ThemeId) => void;
};

export function ThemePicker({ theme, onSelect }: ThemePickerProps) {
  return (
    <div className="settings-group settings-group--appearance">
      <h4 className="appearance-title">Theme</h4>
      <p className="settings-hint">Choose a look — tap a card to apply</p>
      <div className="theme-grid">
        {THEME_MENU_CARDS.map((card) => {
          const active = theme === card.id;
          return (
            <button
              key={card.id}
              type="button"
              className={active ? "theme-btn active" : "theme-btn"}
              data-theme={card.id}
              aria-pressed={active}
              onClick={() => onSelect(card.id)}
            >
              <span className={`theme-preview ${card.previewClass}`} />
              <span className="theme-name">{card.name}</span>
              <span className="theme-tag">{card.tag}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
