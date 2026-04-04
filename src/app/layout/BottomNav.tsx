import { BarChart2, Home, Plus, Settings, Library } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { Squircle } from "@squircle-js/react";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";

const ICON = { size: 24 as const, strokeWidth: 2.5 as const };

export function BottomNav() {
  const { t } = useRemoteConfig();
  const location = useLocation();

  const isAddActive = location.pathname === "/add";

  return (
    <div className="bottom-nav-container">
      {/* 
          The "Hump": Replaced ::after with a specialized Squircle component 
          to match the organic smoothing of the main bar.
      */}
      <div className="bottom-nav-hump">
        <Squircle 
          cornerRadius={45} 
          cornerSmoothing={1} 
          className="bottom-nav-hump__inner"
        />
      </div>

      <Squircle 
        cornerRadius={28} 
        cornerSmoothing={1} 
        className="bottom-nav" 
      >
        <NavLink to="/home" end className={navLinkClass}>
          <Home {...ICON} className="bottom-nav__glyph" aria-hidden />
          <span>{t("nav.home")}</span>
        </NavLink>

        <NavLink to="/collections" className={navLinkClass}>
          <Library {...ICON} className="bottom-nav__glyph" aria-hidden />
          <span>Collections</span>
        </NavLink>

        {/* Center Action Spacer for the floating button */}
        <div className="bottom-nav__spacer" />

        <NavLink to="/stats" className={navLinkClass}>
          <BarChart2 {...ICON} className="bottom-nav__glyph" aria-hidden />
          <span>{t("nav.stats")}</span>
        </NavLink>

        <NavLink to="/settings" className={navLinkClass}>
          <Settings {...ICON} className="bottom-nav__glyph" aria-hidden />
          <span>{t("nav.settings")}</span>
        </NavLink>
      </Squircle>

      {/* Floating Center Action Button With Squircle Circle Smoothing */}
      <NavLink 
        to="/add" 
        className={`bottom-nav__action ${isAddActive ? 'bottom-nav__action--active' : ''}`}
      >
        <Squircle 
          cornerRadius={32} 
          cornerSmoothing={1} 
          className="bottom-nav__action-inner"
        >
          <Plus size={32} strokeWidth={3} />
        </Squircle>
      </NavLink>
    </div>
  );
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return `bottom-nav__link${isActive ? " bottom-nav__link--active" : ""}`;
}
