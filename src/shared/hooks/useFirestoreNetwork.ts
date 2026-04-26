import { useEffect } from "react";
import { disableNetwork, enableNetwork } from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { logger } from "@/shared/utils/logger";

/**
 * Hook to manage Firestore network state based on browser connectivity.
 * This prevents Firestore from constantly attempting to sync while offline,
 * which silences "ERR_INTERNET_DISCONNECTED" errors in the console.
 */
export function useFirestoreNetwork() {
  useEffect(() => {
    const handleOnline = async () => {
      try {
        await enableNetwork(db);
        logger.info("Firebase: Network enabled (back online)");
      } catch (err) {
        logger.error("Firebase: Error enabling network", err);
      }
    };

    const handleOffline = async () => {
      try {
        await disableNetwork(db);
        logger.info("Firebase: Network disabled (offline mode)");
      } catch (err) {
        logger.error("Firebase: Error disabling network", err);
      }
    };

    // Initialize state
    if (!navigator.onLine) {
      void handleOffline();
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
}
