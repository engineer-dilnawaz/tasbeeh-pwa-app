import { useState, useEffect } from "react";
import { tasbeehDb } from "@/features/tasbeeh/services/tasbeehDb";
import { useLiveQuery } from "dexie-react-hooks";

export type SyncStatusType = "offline" | "syncing" | "synced";

/**
 * 🛰️ useSyncStatus Hook
 * 
 * Monitors the application's synchronization state by combining
 * network availability with the status of local database records.
 */
export const useSyncStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Query Dexie for any records that haven't been synced yet
  // This uses useLiveQuery to automatically update the UI when the DB changes
  const pendingCount = useLiveQuery(
    async () => {
      const counts = await Promise.all([
        tasbeehDb.tasbeehCollection.where("syncStatus").equals("pending").count(),
        tasbeehDb.userProgress.where("syncStatus").equals("pending").count(),
        tasbeehDb.progressEvents.where("syncStatus").equals("pending").count(),
        tasbeehDb.appConfig.where("syncStatus").equals("pending").count(),
        tasbeehDb.tasbeehCollections.where("syncStatus").equals("pending").count(),
        tasbeehDb.tasbeehPhrases.where("syncStatus").equals("pending").count(),
        tasbeehDb.collectionItems.where("syncStatus").equals("pending").count(),
      ]);
      return counts.reduce((acc, count) => acc + count, 0);
    },
    [],
    0
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getStatus = (): SyncStatusType => {
    if (!isOnline) return "offline";
    if (pendingCount > 0) return "syncing";
    return "synced";
  };

  const status = getStatus();

  return {
    status,
    isOnline,
    pendingCount,
    // Labels for the Drawer
    label: status === "offline" ? "Offline" : status === "syncing" ? "Syncing..." : "Synced",
    description: status === "offline" 
      ? "Your progress is saved locally and will sync when you're back online."
      : status === "syncing" 
      ? `Synchronizing ${pendingCount} change${pendingCount > 1 ? 's' : ''} with your cloud account.`
      : "All your zikr, streaks, and settings are securely backed up in the cloud.",
  };
};
