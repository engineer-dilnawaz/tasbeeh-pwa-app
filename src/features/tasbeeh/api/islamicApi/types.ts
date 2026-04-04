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
};
