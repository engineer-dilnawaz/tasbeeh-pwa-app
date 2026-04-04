import { islamicApiInstance } from "@/services/api/islamicApiInstance";
import type { PrayerTimeDayResponse, PrayerTimeSuccessResponse } from "./types";

/**
 * Fetch daily prayer times for a given location (Lat/Lon or Address).
 * Priority is given to Latitude and Longitude for high precision.
 * Fallback to Karachi, Pakistan coordinates if localization fails.
 */
export async function fetchPrayerTimes(
  lat?: number | null,
  lon?: number | null,
  address?: string
): Promise<PrayerTimeDayResponse[]> {
  const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

  // Default to Karachi, Pakistan (approx coordinates) if no location is provided
  const latitude = lat ?? 24.8607;
  const longitude = lon ?? 67.0011;

  /**
   * IslamicAPI /prayer-time/ Priority (Updated to V1 Docs):
   * lat, lon, and date (YYYY-MM for full month)
   */
  const params: any = {
    date: currentMonth,
  };

  if (lat && lon) {
    params.lat = lat;
    params.lon = lon;
  } else if (address) {
    params.address = address.trim();
  } else {
    // Karachi Fallback
    params.lat = latitude;
    params.lon = longitude;
  }

  const { data } = await islamicApiInstance.get<PrayerTimeSuccessResponse>(
    "/prayer-time/",
    { params }
  );

  if (!data || data.status !== "success" || !data.data) {
    throw new Error("Failed to fetch prayer times from IslamicAPI.");
  }

  // Response data is an array of daily objects for the month
  return data.data;
}
