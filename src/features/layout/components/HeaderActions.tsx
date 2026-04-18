import React, { useState } from "react";
import { Bell } from "lucide-react";
import { useSyncStatus } from "@/shared/hooks/useSyncStatus";
import { SyncStatusDrawer } from "@/features/tasbeeh/components/SyncStatusDrawer";

/**
 * 🛰️ SyncStatusIndicator
 * 
 * A minimal DaisyUI-based status dot that pulses based on 
 * synchronization state. Tapping it opens the detailed drawer.
 */
export const SyncStatusIndicator = () => {
  const { status, label } = useSyncStatus();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusClass = () => {
    switch (status) {
      case "offline":
        return "status-warning animate-pulse";
      case "syncing":
        return "status-info animate-ping";
      case "synced":
        return "status-success";
      default:
        return "";
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsDrawerOpen(true)}
        className="group flex h-8 items-center gap-1.5 rounded-full bg-base-200 px-2.5 transition-all active:scale-95"
        aria-label="View Sync Status"
      >
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          {/* Ripple Rings (only if syncing or offline/error) */}
          {status !== "synced" && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
              status === "syncing" ? "bg-info" : "bg-warning"
            }`}></span>
          )}
          
          {/* Core Dot */}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${
            status === "synced" ? "bg-success shadow-sm" : 
            status === "syncing" ? "bg-info" : "bg-warning"
          }`}></span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider text-base-content/50 group-hover:text-base-content/80">
          {label}
        </span>
      </button>

      <SyncStatusDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
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
