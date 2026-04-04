import { BarChart2, Home, PlusCircle, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";

const ICON = { size: 26 as const, strokeWidth: 2 as const };

export function BottomNav() {
  const { t } = useRemoteConfig();
  return (
    <nav className="bottom-nav" aria-label="Primary">
      <NavLink to="/home" end className={navLinkClass}>
        <Home {...ICON} className="bottom-nav__glyph" aria-hidden />
        <span>{t("nav.home")}</span>
      </NavLink>
      <NavLink to="/add" className={navLinkClass}>
        <PlusCircle {...ICON} className="bottom-nav__glyph" aria-hidden />
        <span>{t("nav.add")}</span>
      </NavLink>
      <NavLink to="/stats" className={navLinkClass}>
        <BarChart2 {...ICON} className="bottom-nav__glyph" aria-hidden />
        <span>{t("nav.stats")}</span>
      </NavLink>
      <NavLink to="/settings" className={navLinkClass}>
        <Settings {...ICON} className="bottom-nav__glyph" aria-hidden />
        <span>{t("nav.settings")}</span>
      </NavLink>
    </nav>
  );
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `bottom-nav__link squircle-nav${isActive ? " bottom-nav__link--active" : ""}`;
}
