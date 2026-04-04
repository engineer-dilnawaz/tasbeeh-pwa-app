import { ONBOARDING_COMPLETED_STORAGE_KEY } from "@/shared/config/constants";

/** Persisted locally; replace with remote profile (e.g. Firebase) when accounts sync onboarding state. */
export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(): void {
  try {
    localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, "1");
  } catch {
    /* ignore quota / private mode */
  }
}
