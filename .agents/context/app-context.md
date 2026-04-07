---
generated: true
lastScanned: "2026-04-03"
---

# Tasbeeh Flow — project context (generated)

Single snapshot of the repo for agents. Authoritative philosophy and boundaries: `.cursor/rules/tasbeeh-architecture.mdc`, `tasbeeh-guardian.mdc`, `Tasbeeh-PWA-Workspace-Rules.mdc`.

## 1. Project metadata

| Field | Value |
|--------|--------|
| **package.json `name`** | `tasbeeh-flow` |
| **Display / PWA (Vite manifest)** | name **Tasbeeh Flow**, short_name **Tasbeeh**, description *A calm and minimal tasbeeh app for daily dhikr* (`vite.config.ts` → `VitePWA.manifest`) |
| **HTML `<title>`** | Tasbeeh Flow (`index.html`) |
| **Static `public/manifest.json`** | May be an older copy; production PWA manifest comes from **vite-plugin-pwa** build output |

| Tool | Version (from `package.json`) |
|------|-------------------------------|
| React / React DOM | ^19.2.4 |
| Vite | ^8.0.3 |
| TypeScript | ^6.0.2 (target ES2023, `erasableSyntaxOnly`, strict) |
| React Router DOM | ^7.13.2 |
| TanStack React Query | ^5.96.1 |
| Zustand | ^5.0.12 |
| Firebase | ^12.11.0 |
| Framer Motion | ^12.38.0 |
| Lottie | `lottie-react` ^2.4.1 |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` ^4.3.6 |
| HTTP | `axios` ^1.14.0 |
| Onboarding swipe stack | `react-tinder-card` ^1.6.4 (uses `@react-spring/web` 9.5.5) |
| Shapes UI | `@squircle-js/react`, `corner-smoothing` |
| Icons | `lucide-react` ^1.7.0 |
| vite-plugin-pwa | ^1.2.0 |

**Scripts:** `dev` (Vite `--host`), `build` (`tsc -b && vite build`), `icons` (`node scripts/generate-app-icons.mjs` — Lottie → favicon/PWA PNGs; devDeps: canvas, jsdom, sharp, lottie-web), `lint`, `preview`.

**Path alias:** `@/*` → `./src/*` (`tsconfig.app.json`, `vite.config.ts` `resolve.alias`).

## 2. Architecture overview (`src/`)

| Area | Role |
|------|------|
| `app/` | `providers.tsx`, `router.tsx`, `layout/AppLayout.tsx`, `layout/BottomNav.tsx` |
| `pages/` | Splash, onboarding, sign-in, home, collections, spiritual content (ayat/hadith/asma/community), prayer/qibla, add, stats, settings, privacy, terms, data-deletion, email-link fallback |
| `dev/` | **DEV-only:** `DesignLab` + screens (foundations, components, patterns); lazy routes in `router.tsx` when `import.meta.env.DEV` |
| `features/` | `tasbeeh/` (store, hooks, `api/` including IslamicAPI client + remote tasbeeh), `settings/` (theme UI, `settingsStore`, menu metadata), `stats/`, `customTasbeeh/` |
| `services/` | Firebase app, Firestore helpers, auth (provider + actions incl. anonymous/facebook paths in tree), `services/api/islamicApiInstance.ts` (shared Axios for IslamicAPI), remote config, analytics, crashlytics, `queryClient` |
| `shared/` | Theme (`shared/theme/`, `shared/lib/theme.ts`, `cssVars.ts`), config/constants/contact/data, hooks, styles (`global.css`, `dubai-font.css`), components, utils (responsiveness, video cache, onboarding completion, day rotation), types |
| `assets/` | Lottie JSON (`app-logo`, `pluse-arrow`); onboarding **videos** imported as `@/assets/videos/*.mp4` in splash/onboarding (ensure files exist locally) |
| `pwa/` | `register.ts` — `virtual:pwa-register` service worker |

**Entry:** `main.tsx` — crashlytics handlers, `applyThemeToDocument(readStoredTheme())`, Dubai + global CSS, `App` inside `AppProviders`, `registerServiceWorker()`.

## 3. Router, providers, layout

**Provider order** (`app/providers.tsx`): `QueryClientProvider` → `BrowserRouter` → `RemoteConfigProvider` → `AuthProvider`.

**Routes** (`app/router.tsx`):

| Path | Screen |
|------|--------|
| `/` | Splash |
| `/onboarding` | Onboarding (video deck; guarded if onboarding already completed) |
| `/sign-in` | Sign in |
| `/privacy`, `/terms`, `/data-deletion` | Legal / policy pages |
| `/auth/email-link` | Email link fallback |
| **DEV only** | `/design-lab`, `/design-lab/foundations`, `/design-lab/components`, `/design-lab/patterns` (lazy + `Suspense`) |
| **Inside `AppLayout`:** | `/home`, `/collections`, `/ayat`, `/hadith`, `/asma-ul-husna`, `/asma-ul-husna/favorites`, `/community`, `/prayer-times`, `/qibla`, `/add`, `/stats`, `/settings` |

**Layout:** `AppLayout` wraps `Outlet` + `BottomNav`; shell uses `.app` / `.app--with-bottom-nav` from global CSS (max-width ~500px centered).

**Splash routing (current):** After min duration + auth resolved, session splash flag set: **signed-in → `/home`**; else **onboarding completed (localStorage) → `/sign-in`**; else **`/onboarding`**. Onboarding completion flag: `ONBOARDING_COMPLETED_STORAGE_KEY` in `shared/config/constants.ts`, helpers in `shared/utils/onboardingCompletion.ts`.

## 4. State and data-fetching

| Layer | Usage |
|-------|--------|
| **Zustand** | `features/tasbeeh/store/tasbeehStore.ts` — tasbeeh list, counts, streak, persist; `features/settings/store/settingsStore.ts` — settings domain |
| **TanStack Query** | `services/queryClient.ts` (staleTime 60s, retry 1, no refetch on focus); hooks such as `useTasbeehQuery`, `usePrayerTimes`, `useAsmaUlHusna`, Firestore test |
| **Remote config** | `RemoteConfigProvider` + `useRemoteConfig` — i18n strings, feature flags |
| **Local/session** | `tasbeehSettings` (theme in localStorage); `tasbeeh_splash_seen` (sessionStorage); `tasbeeh_onboarding_completed` (localStorage) |

Keep client domain state (Zustand) separate from server cache (React Query) per project rules.

## 5. Services and external integrations

| Service | Location | Notes |
|---------|----------|--------|
| Firebase app | `services/firebase/app.ts` | Auth + app init; `firebaseReady` guard in UI |
| Firestore | `services/firebase/firestore/` | Instance + test collection hook |
| Auth | `services/auth/` | `AuthProvider`, `useAuth`, email/password, Google, email link; additional actions (e.g. anonymous, facebook) in `actions/` per tree |
| IslamicAPI | `features/tasbeeh/api/islamicApi/` + `services/api/islamicApiInstance.ts` | Axios instance, key via `VITE_ISLAMIC_API_KEY` / config |
| Remote Config | `services/remoteConfig/` | Defaults, parse/merge, `RemoteConfigProvider` |
| Analytics | `services/analytics/` | Screen tracking, `track` helpers |
| Crashlytics | `services/crashlytics/` | Global error handlers, user id, reporting |

UI and features should consume Firebase/auth and HTTP through these layers, not scatter raw SDK calls in pages.

## 6. Theme and color system

**Modes:** `light` | `dark` (`ThemeId` in `shared/config/constants.ts`). Stored under `tasbeehSettings.theme` in `localStorage`.

**Application:** `applyThemeToDocument` in `shared/lib/theme.ts` sets `document.body.dataset.theme`, updates `meta[name="theme-color"]` from `THEME_COLOR_META`, injects **pine green** ramp via `applyPineGreenPaletteToRoot` / `shared/theme` (`default/colors.ts`, `dark/colors.ts`, `pineGreen.ts`).

**Global semantic UI:** `shared/styles/global.css` — `:root` / `[data-theme="dark|light"]` with `--bg-*`, `--text-*`, `--accent`, `--card-*`, `--border`, etc.

| Theme | Semantic summary |
|-------|------------------|
| Dark | Pine green surfaces, light text, accent |
| Light | Warm off-white background, pine accent, dark text |

## 7. Typography and spacing

- **Fonts:** Plus Jakarta Sans (see `index.html`); `shared/styles/dubai-font.css` loaded from `main.tsx`; Arabic/Urdu fonts where configured for content.
- **Responsive scale:** `shared/utils/responsiveness.ts` — `wp`, `hp`, `fp` vs baseline **375×812**.
- **Design grid:** `shared/constants/design.constants.ts` — `DESIGN.SPACING` using `hp`/`wp`.

## 8. Assets

| Location | Contents |
|----------|----------|
| `public/` | `favicon.svg`, legacy `manifest.json`, `icons.svg`; generated `favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` via `yarn icons` |
| `src/assets/lottie/` | `app-logo.json`, `pluse-arrow.json` |
| `src/assets/videos/` | Onboarding MP4s (referenced by splash + onboarding; large binaries may be gitignored in some clones) |
| **Icons in UI** | `lucide-react`; Google/social may be inline SVG in auth UI |

## 9. Responsiveness and layout

- Prefer `shared/utils/responsiveness.ts` when matching scaled layouts; CSS primary for chrome.
- `.app` max-width ~500px, centered — mobile-first PWA shell.

## 10. Folder and export conventions

- Path alias **`@/`** for all `src` imports.
- **Features:** public API via `features/*/index.ts` where present; avoid cross-feature internal imports.
- **Pages:** route-level composition; colocated `*.module.css` where used.
- **Services:** one integration surface per domain; IslamicAPI instance lives under `services/api/` while feature-specific endpoints/config stay under `features/tasbeeh/api/`.

## 11. Component inventory (grouped)

| Component | Path | Role / notes |
|-----------|------|--------------|
| **Button** | `shared/components/Button/` | Framer Motion, variants (primary/secondary/ghost/glass), pill/squircle, loading; uses shared **Squircle** wrapper |
| **Squircle** | `shared/components/Squircle/` | Re-export/wrapper around `@squircle-js/react` |
| **SquircleCard** | `shared/components/SquircleCard.tsx` | Card shell with `squircle-card` class |
| **NavHeader** | `shared/components/NavHeader/` | Screen header pattern |
| **Drawer** | `shared/components/Drawer/` | Slide-out panel |
| **LogoutSheet** | `shared/components/LogoutSheet/` | Bottom/sheet logout UI |
| **Form** | `shared/components/forms/Form.tsx` | Form wrapper |
| **Input** | `shared/components/forms/Input.tsx` | Text input |
| **Switch** | `shared/components/forms/Switch.tsx` | Toggle |
| **schemas** | `shared/components/forms/schemas.ts` | Shared zod bits |
| **ThemePicker** | `features/settings/components/ThemePicker.tsx` | Theme selection |
| **ProgressRing** | `features/tasbeeh/components/ProgressRing.tsx` | Tasbeeh progress ring |

## 12. PWA and offline

- **vite-plugin-pwa:** `registerType: "autoUpdate"`; **dev** SW disabled (`devOptions.enabled: false`).
- **Workbox:** precaches js/css/html/png/svg/ico/woff2; `navigateFallbackDenylist` excludes `/assets/`, `/src/`, static extensions; video `mp4|webm` **NetworkOnly** in runtime caching.
- **Registration:** `pwa/register.ts` → `registerSW({ immediate: true })` via `virtual:pwa-register`.

## 13. Codegen / reuse rules (mandatory)

- Reuse **shared/components** (`Button`, `Squircle`, forms, `NavHeader`, etc.) and global patterns before adding one-off UI.
- Use **theme tokens**: CSS variables from `global.css` + injected `--pine-green-*`; avoid arbitrary hex in new UI unless extending `shared/theme`.
- Respect **boundaries:** services for Firebase/auth/HTTP wrappers; features don’t import other features’ internals; pages compose features + shared.
- **Remote copy:** Prefer `useRemoteConfig` / `t("key")` keys in `services/remoteConfig/defaults.ts` for user-visible strings.

## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
