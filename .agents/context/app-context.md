---
generated: true
lastScanned: "2026-04-02"
---

# Tasbeeh Flow — project context (generated)

Single snapshot of the repo for agents. Authoritative philosophy and boundaries: `.cursor/rules/tasbeeh-architecture.mdc`, `tasbeeh-guardian.mdc`, `Tasbeeh-PWA-Workspace-Rules.mdc`.

## 1. Project metadata

| Field | Value |
|--------|--------|
| **package.json `name`** | `tasbeeh-flow` |
| **Display / PWA (Vite manifest)** | name **Tasbeeh Flow**, short_name **Tasbeeh**, description *A calm and minimal tasbeeh app for daily dhikr* (`vite.config.ts` → `VitePWA.manifest`) |
| **HTML `<title>`** | Tasbeeh Flow (`index.html`) |
| **Static `public/manifest.json`** | Older copy (*Tasbeeh Counter*); production PWA manifest comes from **vite-plugin-pwa** build output |

| Tool | Version (from `package.json`) |
|------|-------------------------------|
| React / React DOM | ^19.2.4 |
| Vite | ^8.0.3 |
| TypeScript | ^6.0.2 |
| React Router DOM | ^7.13.2 |
| TanStack React Query | ^5.96.1 |
| Zustand | ^5.0.12 |
| Firebase | ^12.11.0 |
| Framer Motion | ^12.38.0 |
| vite-plugin-pwa | ^1.2.0 |

**Scripts:** `dev` (Vite `--host`), `build` (`tsc -b && vite build`), `icons` (`node scripts/generate-app-icons.mjs` — Lottie → favicon/PWA PNGs; devDeps: canvas, jsdom, sharp, lottie-web), `lint`, `preview`.

**Path alias:** `@/*` → `./src/*` (`tsconfig.app.json`, `vite.config.ts`).

## 2. Architecture overview (`src/`)

High-level zones:

| Area | Role |
|------|------|
| `app/` | Router, root providers wiring (see `providers.tsx`), `AppLayout` + `BottomNav` |
| `pages/` | Route-level screens: splash, onboarding, sign-in, home, add, stats, settings, email-link fallback |
| `features/` | Domain modules: `tasbeeh/` (store, hooks, API, UI), `settings/` (theme picker, menu metadata), `stats/`, `customTasbeeh/` (barrel exports) |
| `services/` | Firebase app, Firestore helpers, auth (provider + actions), remote config, analytics, crashlytics, shared `queryClient` |
| `shared/` | Theme (`shared/theme/`, `shared/lib/theme.ts`), config/constants, hooks, styles (`global.css`), components, utils (responsiveness, video cache, day rotation), types |
| `assets/` | `lottie/app-logo.json`; onboarding videos imported from `@/assets/videos/*.mp4` (paths used in splash preload + onboarding) |
| `pwa/` | `register.ts` — `virtual:pwa-register` service worker |

**Entry:** `main.tsx` — crashlytics handlers, `applyThemeToDocument(readStoredTheme())`, global CSS, `App` inside `AppProviders`, `registerServiceWorker()`.

## 3. Router, providers, layout

**Provider order** (`app/providers.tsx`): `QueryClientProvider` → `BrowserRouter` → `RemoteConfigProvider` → `AuthProvider`.

**Routes** (`app/router.tsx`):

| Path | Screen |
|------|--------|
| `/` | Splash |
| `/onboarding` | Onboarding |
| `/sign-in` | Sign in |
| `/auth/email-link` | Email link fallback |
| `/home`, `/add`, `/stats`, `/settings` | Inside `AppLayout` (bottom nav) |

**Layout:** `AppLayout` wraps `Outlet` + `BottomNav`; main shell uses `.app` / `.app--with-bottom-nav` from global CSS (max-width ~500px centered).

**Splash behavior (current):** After min splash duration + auth resolved, session flag set, **`navigate("/onboarding", { replace: true })`** (see `pages/splash/index.tsx`). Also preloads onboarding videos via `preloadVideos`.

## 4. State and data-fetching

| Layer | Usage |
|-------|--------|
| **Zustand** | `features/tasbeeh/store/tasbeehStore.ts` — tasbeeh list, count, streak, etc.; **persist** middleware |
| **TanStack Query** | Shared `services/queryClient.ts` (staleTime 60s, retry 1, no refetch on focus); used for remote/API-backed data (e.g. tasbeeh query, Firestore test hooks) |
| **Remote config** | `RemoteConfigProvider` + `useRemoteConfig` — i18n strings, feature flags |

Keep client domain state (Zustand) separate from server cache (React Query) per project rules.

## 5. Services and external integrations

| Service | Location | Notes |
|---------|----------|--------|
| Firebase app | `services/firebase/app.ts` | Auth + app init; `firebaseReady` guard in UI |
| Firestore | `services/firebase/firestore/` | Instance + test collection hook |
| Auth | `services/auth/` | `AuthProvider`, `useAuth`, email/password, Google, email link; `config.ts` for public app name + email link URL |
| Remote Config | `services/remoteConfig/` | Defaults, parse/merge, `RemoteConfigProvider` |
| Analytics | `services/analytics/` | Screen tracking, `track` helpers |
| Crashlytics | `services/crashlytics/` | Global error handlers, user id, reporting |

UI and features should consume Firebase/auth through these layers, not scatter raw SDK calls in pages.

## 6. Theme and color system

**Modes:** `light` | `dark` (`ThemeId` in `shared/config/constants.ts`). Stored in `localStorage` under `tasbeehSettings` (with theme key).

**Application:** `applyThemeToDocument` in `shared/lib/theme.ts` sets `document.body.dataset.theme` and:

- Updates `meta[name="theme-color"]` from `THEME_COLOR_META`
- Injects **pine green palette** into `document.documentElement` via `applyPineGreenPaletteToRoot(getThemeColors(theme))` — CSS vars `--pine-green-50` … `--pine-green-1000` from `shared/theme/default/colors.ts`, `dark/colors.ts`, shared ramp `pineGreen.ts`

**Global semantic UI:** `shared/styles/global.css` defines `:root` + `[data-theme="dark"]` and `[data-theme="light"]` with `--bg-*`, `--text-*`, `--accent`, `--card-*`, `--border`, `--tap-shadow`, `--streak-text`, etc. Body uses gradient + `::before` glow.

**Splash / scoped pages:** e.g. `pages/splash/splash.module.css` uses `var(--pine-green-700, #152b26)` for background.

| Theme | Semantic summary (from global CSS) |
|-------|-------------------------------------|
| Dark | Pine green surfaces, light text, lime accent |
| Light | Early Dawn–style backgrounds, pine accent, dark text |

## 7. Typography and spacing

- **Primary UI font:** Plus Jakarta Sans (Google Fonts in `index.html`).
- **Arabic / Urdu:** Amiri, Noto Nastaliq Urdu loaded for content where needed.
- **Responsive scale:** `shared/utils/responsiveness.ts` — `wp`, `hp`, `fp` vs baseline **375×812**; clamped scaling for web.
- **Design grid:** `shared/constants/design.constants.ts` — `DESIGN.SPACING` using `hp`/`wp` on a 4-point style grid.

## 8. Assets

| Location | Contents |
|----------|----------|
| `public/` | `favicon.svg`, `manifest.json` (legacy copy), `icons.svg`; **generated** `favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` via `yarn icons` |
| `src/assets/` | `lottie/app-logo.json`; onboarding `videos/*.mp4` (referenced in code) |
| **Icons in UI** | `lucide-react` (version ~1.7 — not all newer icon names exist); brand icons (e.g. Google) may be inline SVG where needed |

## 9. Responsiveness and layout

- Prefer `shared/utils/responsiveness.ts` (`wp`/`hp`/`fp`) when matching RN-style scaled layouts; CSS remains primary for most app chrome.
- `.app` max-width ~500px, centered — mobile-first PWA shell.

## 10. Folder and export conventions

- Path alias **`@/`** for all `src` imports.
- **Features:** expose public API via `features/*/index.ts` where present; avoid importing another feature’s internals from unrelated features.
- **Pages:** route-level composition; colocated `*.module.css` for splash, sign-in, onboarding (pattern).
- **Services:** single integration surface per domain (auth, firebase, remote config).

## 11. Component inventory (grouped)

| Component | Path | Role / notes |
|-----------|------|----------------|
| **Button** | `shared/components/Button/` | Framer Motion button, variants (primary/secondary/ghost/glass), pill/squircle, loading state, uses **Squircle** |
| **Squircle** | `shared/components/Squircle/` | Wrapper around `@squircle-js/react` `Squircle` |
| **SquircleCard** | `shared/components/SquircleCard.tsx` | Applies global `squircle-card` class |
| **ThemePicker** | `features/settings/components/ThemePicker.tsx` | Theme selection UI |
| **ProgressRing** | `features/tasbeeh/components/ProgressRing.tsx` | Home / tasbeeh progress visualization |

## 12. PWA and offline

- **vite-plugin-pwa:** `registerType: "autoUpdate"`; **dev** SW disabled (`devOptions.enabled: false`) to avoid caching breaking module loads.
- **Workbox:** precaches js/css/html/png/svg/ico/woff2; `navigateFallbackDenylist` excludes `/assets/`, `/src/`, static extensions; video `mp4|webm` **NetworkOnly**.
- **Registration:** `pwa/register.ts` → `registerSW({ immediate: true })` (uses `virtual:pwa-register` — ensure Vite/types include it for `tsc` if needed).

## 13. Codegen / reuse rules (mandatory)

- Reuse **shared/components** (`Button`, `Squircle`, `SquircleCard`) and global patterns before adding one-off UI.
- Use **theme tokens**: CSS variables from `global.css` + injected `--pine-green-*`; avoid arbitrary hex in new UI unless extending `shared/theme`.
- Respect **boundaries:** services for Firebase/auth; features don’t import other features’ internals; pages compose features + shared.
- **Remote copy:** Prefer `useRemoteConfig` / `t("key")` keys defined in `services/remoteConfig/defaults.ts` for user-visible strings.

## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
