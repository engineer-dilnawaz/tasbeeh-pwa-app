import { setUserId as analyticsSetUserId } from "firebase/analytics";
import { getAnalyticsInstance } from "@/services/analytics/instance";

/** Associates subsequent Analytics/Crashlytics reports with a stable user id (e.g. Firebase Auth `uid`). */
export function setCrashlyticsUserId(userId: string | null): void {
  const a = getAnalyticsInstance();
  if (!a) return;
  analyticsSetUserId(a, userId);
}
