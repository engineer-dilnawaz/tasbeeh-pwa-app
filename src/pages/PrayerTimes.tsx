import { motion } from "framer-motion";
import { NavHeader } from "@/shared/components/NavHeader/NavHeader";
import { Clock, MapPin, Loader2 } from "lucide-react";
import { usePrayerTimes } from "@/features/tasbeeh/hooks/usePrayerTimes";
import { useGeolocation } from "@/shared/hooks/useGeolocation";
import { useSettingsStore } from "@/features/settings/store/settingsStore";
import { useResolvedPalette } from "@/shared/components/ui/palette";
import { useMemo } from "react";

/**
 * Robust formatter for prayer timings.
 * Converts between 12h and 24h formats based on user preference.
 */
function formatDisplayTime(timeStr: string, is24h: boolean) {
  if (!timeStr) return "";
  
  // Normalize string (remove potential extra spaces)
  const cleanTime = timeStr.trim();
  
  // Detect if already has AM/PM
  const is12hFormat = /AM|PM/i.test(cleanTime);
  
  if (is24h) {
    if (!is12hFormat) return cleanTime; // Already 24h (HH:mm)
    
    // Convert 12h to 24h
    const [time, modifier] = cleanTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  } else {
    if (is12hFormat) return cleanTime; // Already 12h
    
    // Convert 24h to 12h
    let [hours, minutes] = cleanTime.split(":").map(Number);
    const modifier = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    
    return `${hours}:${minutes.toString().padStart(2, '0')} ${modifier}`;
  }
}

export default function PrayerTimes() {
  const palette = useResolvedPalette();
  const { latitude, longitude, loading: locationLoading, error: locationError } = useGeolocation();
  const { use24HourFormat } = useSettingsStore();

  const { data: monthResponse, isPending: dataLoading, isError } = usePrayerTimes(
    latitude, 
    longitude
  );

  const isPending = locationLoading || dataLoading;

  const todayResponse = useMemo(() => {
    if (!monthResponse) return null;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    return monthResponse.find(d => d.date === todayStr) || monthResponse[0];
  }, [monthResponse]);

  const timings = todayResponse?.times;

  const prayerList = timings ? [
    { name: "Fajr", time: timings.Fajr },
    { name: "Dhuhr", time: timings.Dhuhr },
    { name: "Asr", time: timings.Asr },
    { name: "Maghrib", time: timings.Maghrib },
    { name: "Isha", time: timings.Isha },
  ] : [];

  return (
    <div className="min-h-dvh">
      <NavHeader title="Prayer Times" />
      
      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-3 py-2 pb-4"
      >
        <div style={{ textAlign: "center", marginBottom: "32px", marginTop: "16px" }}>
          <p style={{ color: palette.textMuted, fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            PRECISION SPIRITUAL TIMINGS
          </p>
        </div>

        {isPending && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 0", gap: "16px" }}>
            <Loader2 className="animate-spin" size={36} color={palette.accent} />
            <p style={{ fontSize: "13px", color: palette.textMuted, fontWeight: 700 }}>
              {locationLoading ? "Determining Coordinates..." : "Calculating Foundation..."}
            </p>
          </div>
        )}

        {(isError || locationError) && !isPending && (
          <div className="squircle-card" style={{ color: palette.accent, border: `1px solid ${palette.accentSubtle}`, textAlign: "center" }}>
            <p style={{ fontWeight: 800, marginBottom: "4px" }}>Local Override Active</p>
            <p style={{ fontSize: "13px" }}>Geolocation restricts non-HTTPS origins. Defaulting to Karachi, Pakistan.</p>
          </div>
        )}

        {todayResponse && !isPending && (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: palette.accentSubtle, padding: "10px 16px", borderRadius: "12px", color: palette.accent }}>
                <MapPin size={18} />
                <span style={{ fontSize: "15px", fontWeight: 800 }}>Karachi / Current Area</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {prayerList.map((p, idx) => {
                const formatted = formatDisplayTime(p.time, use24HourFormat);
                const hasModifier = /AM|PM/i.test(formatted);
                const [timeOnly, ...rest] = formatted.split(" ");
                const modifier = rest.join(" ");

                return (
                  <div 
                    key={idx} 
                    className="squircle-card" 
                    style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      padding: "20px"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ padding: "8px", background: palette.bg, borderRadius: "8px", color: palette.accent }}>
                        <Clock size={16} />
                      </div>
                      <span style={{ fontSize: "17px", fontWeight: 800, color: palette.textPrimary }}>{p.name}</span>
                    </div>
                    <span style={{ fontSize: "18px", fontWeight: 800, fontFamily: "tabular-nums", color: palette.textPrimary }}>
                      {timeOnly} {hasModifier && <span style={{ fontSize: "12px", opacity: 0.6 }}>{modifier}</span>}
                    </span>
                  </div>
                );
              })}
            </div>

            {todayResponse.hijri_date && (
              <div style={{ marginTop: "32px", textAlign: "center", borderTop: `1px solid ${palette.border}`, paddingTop: "24px" }}>
                <p style={{ fontSize: "15px", color: palette.textPrimary, fontWeight: 800 }}>
                  {new Date(todayResponse.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p style={{ fontSize: "13px", color: palette.accent, fontWeight: 700, marginTop: "4px" }}>
                  {todayResponse.hijri_date.day} {todayResponse.hijri_date.month?.en || ""} {todayResponse.hijri_date.year} AH
                </p>
              </div>
            )}
          </>
        )}
      </motion.main>
    </div>
  );
}
