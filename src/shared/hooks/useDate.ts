import { useMemo } from "react";

type Locale = "en" | "ur" | "ar";

interface UseDateOptions {
  locale?: Locale;
  date?: Date;
}

/**
 * Custom hook to get formatted Gregorian and Hijri dates.
 * Supports multiple locales (en, ur, ar).
 */
export function useDate(options?: UseDateOptions) {
  const { locale = "en", date = new Date() } = options || {};

  return useMemo(() => {
    // 🌍 Locale mapping
    const localeMap: Record<Locale, string> = {
      en: "en-US",
      ur: "ur-PK",
      ar: "ar-SA",
    };

    const baseLocale = localeMap[locale];

    // 📅 Gregorian: "Thursday, 18 Apr 2024"
    const gregorian = new Intl.DateTimeFormat(baseLocale, {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);

    // 🌙 Hijri (Islamic calendar)
    const hijri = new Intl.DateTimeFormat(`${baseLocale}-u-ca-islamic`, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

    return {
      gregorian,
      hijri,
      full: `${gregorian} • ${hijri}`,
    };
  }, [locale, date]);
}
