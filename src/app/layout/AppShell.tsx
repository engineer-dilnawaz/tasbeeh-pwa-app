import { SlidersHorizontal, Menu, ArrowLeft, BookOpen, ChartColumnBig, House, Settings as SettingsIcon } from "lucide-react";
import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { BottomNav, type TabItem } from "@/shared/design-system/ui/BottomNav";
import { Toaster } from "@/shared/design-system/ui/Toast";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { Header } from "@/shared/design-system/ui/Header";
import { SyncStatusIndicator, NotificationBell } from "@/features/layout/components/HeaderActions";
import { AppSidebar } from "@/features/layout/components/AppSidebar";
import { useTheme } from "@/shared/design-system/hooks/useTheme";

const tabs: TabItem[] = [
  { id: "home", label: "Home", icon: <House size={20} />, badge: 3 },
  { id: "stats", label: "Stats", icon: <ChartColumnBig size={20} /> },
  { id: "collections", label: "Collections", icon: <BookOpen size={20} /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon size={20} /> },
];

const getTitle = (pathname: string) => {
  if (pathname.startsWith("/settings/feedback")) return "App Feedback";
  if (pathname.startsWith("/settings/about")) return "About App";
  if (pathname.startsWith("/settings/profile")) return "Edit Profile";
  if (pathname.startsWith("/settings")) return "Settings";
  if (pathname.startsWith("/collections/filter")) return "Filter";
  if (pathname.startsWith("/collections/new")) return "Add collection";
  if (pathname.startsWith("/collections")) return "Collections";
  if (pathname.startsWith("/stats")) return "Stats";
  return "Home";
};

export default function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const hydrateFromDb = useSettingsStore((state) => state.hydrateFromDb);
  const isHydrated = useSettingsStore((state) => state.isHydrated);
  const bottomNavVariant = useSettingsStore(
    (state) => state.appearance.bottomNavVariant ?? "bar",
  );
  const theme = useSettingsStore((state) => state.appearance.theme);

  // One-time hydration of settings from IndexedDB.
  // Keeps localStorage out of the loop entirely.
  React.useEffect(() => {
    if (!isHydrated) {
      void hydrateFromDb();
    }
  }, [hydrateFromDb, isHydrated]);

  // Keep DOM theme in sync with hydrated store.
  React.useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  const activeTab = location.pathname.startsWith("/settings")
    ? "settings"
    : location.pathname.startsWith("/collections")
      ? "collections"
      : location.pathname.startsWith("/stats")
        ? "stats"
        : "home";
  const shouldHideBottomNav =
    location.pathname.startsWith("/settings/feedback") ||
    location.pathname.startsWith("/settings/about") ||
    location.pathname.startsWith("/settings/profile") ||
    location.pathname.startsWith("/collections/new") ||
    location.pathname.startsWith("/collections/filter");
  const showHeaderBackForSubscreen =
    location.pathname.startsWith("/settings/feedback") ||
    location.pathname.startsWith("/settings/about") ||
    location.pathname.startsWith("/settings/profile") ||
    location.pathname.startsWith("/collections/new") ||
    location.pathname.startsWith("/collections/filter");
  const backTarget = location.pathname.startsWith("/collections/")
    ? "/collections"
    : "/settings";
  const isCollectionsList = location.pathname === "/collections";

  return (
    <div
      className={`min-h-dvh w-full bg-base-100 pt-[env(safe-area-inset-top,0px)] ${
        shouldHideBottomNav ? "pb-4" : "pb-28"
      }`}
    >
      <Header
        title={getTitle(location.pathname)}
        left={
          showHeaderBackForSubscreen ? (
            <button
              type="button"
              onClick={() => navigate(backTarget)}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-base-content/20 bg-base-200/55 text-base-content/80 transition-colors hover:bg-base-200"
            >
              <ArrowLeft size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-base-200/50 text-base-content/70 active:scale-90 transition-transform"
              aria-label="Open sidebar"
            >
              <Menu size={18} />
            </button>
          )
        }
        right={
          <div className="flex items-center gap-2">
            <SyncStatusIndicator />
            
            {isCollectionsList && (
              <button
                type="button"
                onClick={() => navigate("/collections/filter")}
                aria-label="Open collection filters"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-base-content/8 bg-transparent text-base-content/45 transition-opacity hover:opacity-80"
              >
                <SlidersHorizontal size={18} />
              </button>
            )}

            {activeTab === "home" && <NotificationBell />}
          </div>
        }
      />
      <AppSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <Outlet />
      <Toaster />
      {shouldHideBottomNav ? null : (
        <BottomNav
          variant={bottomNavVariant}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tabId) => {
            if (tabId === "stats") {
              navigate("/stats");
              return;
            }
            if (tabId === "settings") {
              navigate("/settings");
              return;
            }
            if (tabId === "collections") {
              navigate("/collections");
              return;
            }
            navigate("/home");
          }}
        />
      )}
    </div>
  );
}
