/** Single name entry from Asma-ul-Husna API. @see https://islamicapi.com/doc/asma-ul-husna/ */
export type AsmaUlHusnaName = {
  number: number;
  name: string;
  transliteration: string;
  translation: string;
  meaning: string;
  /** Relative path e.g. `/audio/asma-ul-husna/rahman.mp3` */
  audio: string;
};

export type AsmaUlHusnaData = {
  names: AsmaUlHusnaName[];
  total: number;
  language: string;
  language_code: string;
  title: string;
  arabic_title: string;
  description: string;
  recitation_benefits: string;
  hadith: string;
};

export type AsmaUlHusnaSuccessResponse = {
  code: 200;
  status: "success";
  data: AsmaUlHusnaData;
};

export type AsmaUlHusnaErrorResponse = {
  code: number;
  status: "error";
  message: string;
}


export type PrayerTime = {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
    Imsak: string;
    Midnight: string;
};

export type PrayerTimeDate = {
    readable: string;
    timestamp: string;
    gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: { en: string };
        month: { number: number; en: string };
        year: string;
    };
};

export type HijriDate = {
    date: string;
    day: string;
    month: { number: number; en: string; ar: string };
    year: string;
};

export type PrayerTimeMeta = {
    latitude: number;
    longitude: number;
    timezone: string;
    method: {
        id: number;
        name: string;
        params: { Fajr: number; Isha: number };
    };
};

export type PrayerTimeDayResponse = {
    date: string;
    times: PrayerTime;
    hijri_date: HijriDate;
    prohibited_times?: {
      sunrise: { start: string; end: string };
      noon: { start: string; end: string };
      sunset: { start: string; end: string };
    };
};

export type PrayerTimeSuccessResponse = {
    code: number;
    status: "success";
    data: PrayerTimeDayResponse[];
    qibla?: { direction: { degrees: number } };
    timezone: { name: string; utc_offset: string };
};
