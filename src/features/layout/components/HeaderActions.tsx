import React, { useState } from "react";
import { Bell, RefreshCw } from "lucide-react";
import { useSyncStatus } from "@/shared/hooks/useSyncStatus";
import { SyncStatusDrawer } from "@/features/tasbeeh/components/SyncStatusDrawer";

/**
 * 🛰️ SyncStatusIndicator
 *
 * A status indicator designed for the Sidebar.
 * Tapping it opens the detailed sync drawer.
 */
export const SyncStatusIndicator = () => {
  const { status, label } = useSyncStatus();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="group flex w-full items-center justify-between gap-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] text-base-content/60 hover:bg-base-200 hover:text-base-content"
        aria-label="View Sync Status"
      >
        <div className="flex items-center">
          <span className="tracking-tight">Cloud Backup</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-wider text-base-content/30 group-hover:text-base-content/50">
            {label}
          </span>
          <div className="relative flex h-2.5 w-2.5 items-center justify-center">
            {/* Ripple Rings */}
            {status !== "synced" && (
              <span
                className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                  status === "syncing" ? "bg-info" : "bg-warning"
                }`}
              ></span>
            )}

            {/* Core Dot */}
            <span
              className={`relative inline-flex h-2 w-2 rounded-full ${
                status === "synced"
                  ? "bg-success shadow-sm"
                  : status === "syncing"
                    ? "bg-info"
                    : "bg-warning"
              }`}
            ></span>
          </div>
        </div>
      </button>

      <SyncStatusDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        zIndexBase={250}
      />
    </>
  );
};

/**
 * 🔔 NotificationBell
 *
 * Placeholder for the notification trigger on the home screen.
 */
export const NotificationBell = () => {
  return (
    <button
      type="button"
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-base-200/50 text-base-content/70 transition-all hover:bg-base-200 active:scale-90"
      aria-label="Notifications"
    >
      <Bell size={18} />
      {/* Tiny notification dot if needed */}
      <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
      </span>
    </button>
  );
};
