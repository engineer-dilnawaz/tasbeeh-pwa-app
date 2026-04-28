export const ROUTES = {
  root: "/",

  home: "/home",
  homeCounter: "/home/:tasbeehId",
  homeReview: "/home/review",
  collection: "/collection",
  stats: "/stats",
  settings: "/settings",

  legacyTasbeehList: "/tasbeeh",
  legacyTasbeehCounter: "/tasbeeh/:tasbeehId",
} as const;

