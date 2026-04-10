---
generated: true
lastScanned: "2026-04-09"
---

# Tasbeeh Flow — project context (generated)

Single snapshot of the repo for agents. Authoritative philosophy and boundaries: `.cursor/rules/tasbeeh-architecture.mdc`, `tasbeeh-guardian.mdc`, `Tasbeeh-PWA-Workspace-Rules.mdc`, `Coding-Craft-Standards.mdc`.

## 1. Project metadata

| Field | Value |
|--------|--------|
| **package.json `name`** | `tasbeeh-flow` |
| **PWA manifest** (vite-plugin-pwa) | name **Tasbeeh Flow**, short_name **Tasbeeh**, description *A calm and minimal tasbeeh app for daily dhikr* (`vite.config.ts` → `VitePWA.manifest`) |
| **HTML `<title>`** | Tasbeeh Flow (`index.html`) |
| **`public/manifest.json`** | Static copy may exist; build-time manifest comes from **vite-plugin-pwa** |

| Tool | Version (from `package.json`) |
|------|-------------------------------|
| React / React DOM | ^19.2.4 |
| Vite | ^8.0.3 |
| TypeScript | ^6.0.2 (target ES2023, `erasableSyntaxOnly`, strict) |
| Tailwind CSS | ^4.2.2 (`@tailwindcss/vite` plugin in `vite.config.ts`) |
| daisyUI | ^5.5.19 (devDependency; loaded via `@plugin "daisyui"` in `shared/styles/global.css`) |
| React Router DOM | ^7.13.2 |
| TanStack React Query | ^5.96.1 |
| Zustand | ^5.0.12 |
| Firebase | ^12.11.0 |
| Framer Motion / `motion` | ^12.38.0 |
| Sentry React | ^10.47.0 (`VITE_SENTRY_DSN`, optional dev reporting) |
| Dexie + dexie-react-hooks | ^4.x (IndexedDB for local tasbeeh sequences) |
| Lottie | `lottie-react` ^2.4.1 |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` ^4.3.6 |
| HTTP | `axios` ^1.14.0 |
| Onboarding | `react-tinder-card` ^1.6.4 (`@react-spring/web` 9.5.5) |
| Shapes UI | `@squircle-js/react`, `corner-smoothing` |
| Sheet UI | `react-modal-sheet` ^5.6.0 |
| Icons | `lucide-react` ^1.7.0 |
| Misc UI | `clsx`, `react-animated-numbers` |
| vite-plugin-pwa | ^1.2.0 |

**Scripts:** `dev` (Vite `--host`), `build` (`tsc -b && vite build`), `icons` (`node scripts/generate-app-icons.mjs` — Lottie → favicon/PWA PNGs; devDeps: canvas, jsdom, sharp, lottie-web), `lint`, `preview`.

**Path alias:** `@/*` → `./src/*` (`tsconfig.app.json`, `vite.config.ts` `resolve.alias`).

**Build define:** `__APP_VERSION__` from `package.json` version (used e.g. Sentry release fallback).

## 2. Architecture overview (`src/`)

| Area | Role |
|------|------|
| `app/` | `providers.tsx`, `router.tsx`, `layout/AppLayout.tsx`, `layout/BottomNav.tsx` |
| `pages/` | Splash, onboarding, sign-in, home, collections, ayat/hadith/asma/community, prayer/qibla, add, stats, settings, privacy, terms, data-deletion, email-link fallback |
| `dev/` | **DEV-only:** `DesignLab` + screens (foundations, components, patterns, **experiments**); lazy routes in `router.tsx` when `import.meta.env.DEV` |
| `features/` | `tasbeeh/` (store, hooks, `api/`, **Dexie** `services/tasbeeh.local.ts`), `settings/` (`settingsStore`, theme/font UI), `stats/`, `customTasbeeh/` |
| `services/` | Firebase, auth, Firestore, `api/islamicApiInstance.ts`, remote config, analytics, crashlytics, **Sentry** `sentry/initSentry.ts`, `queryClient` |
| `shared/` | Theme helpers (`shared/lib/theme.ts` — **daisyUI** document theme), legacy palette modules (`shared/theme/`), `twUi` Tailwind class bundles, constants, hooks, `global.css` + `dubai-font.css`, components, utils |
| `assets/` | `lottie/`, `videos/` (onboarding MP4s referenced by splash/onboarding) |
| `pwa/` | `register.ts` — `virtual:pwa-register` |

**PWA:** `vite-plugin-pwa` with `registerType: "autoUpdate"`, dev SW off; Workbox precache glob; runtime **NetworkOnly** for `mp4|webm`; `navigateFallbackDenylist` avoids treating `/assets/`, `/src/`, and static extensions as SPA fallbacks. Registration: `pwa/register.ts`.

**Entry:** `main.tsx` — `initSentry()` (guarded), `installGlobalErrorHandlers()` (crashlytics), `applyThemeToDocument(readStoredDaisyTheme())`, `initAppFont()`, Dubai + global CSS, `App` in `AppProviders` with `createRoot(..., getSentryReactRootOptions())`, `registerServiceWorker()` at end.

**Root app:** `App.tsx` wraps `AppRouter` in `Sentry.ErrorBoundary`; DEV-only `DevLabButton`.

## 3. Router, providers, layout

**Provider order** (`app/providers.tsx`): `QueryClientProvider` → `BrowserRouter` → `RemoteConfigProvider` → `AuthProvider`.

**Routes** (`app/router.tsx`):

| Path | Screen |
|------|--------|
| `/` | Splash |
| `/onboarding` | Onboarding |
| `/sign-in` | Sign in |
| `/privacy`, `/terms`, `/data-deletion` | Legal / policy |
| `/auth/email-link` | Email link fallback |
| **DEV only** | `/design-lab`, `/design-lab/foundations`, `/design-lab/components`, `/design-lab/patterns`, `/design-lab/experiments` (lazy + `Suspense`) |
| **Inside `AppLayout`** | `/home`, `/collections`, `/ayat`, `/hadith`, `/asma-ul-husna`, `/asma-ul-husna/favorites`, `/community`, `/prayer-times`, `/qibla`, `/add`, `/stats`, `/settings` |

**Layout:** `AppLayout` — while auth `loading`, centered loader; when ready and **no user**, `Navigate` to `/sign-in`; else column shell (`bg-base-300`, bottom padding for nav) + `Outlet` + `BottomNav`.

**Splash routing:** After min duration + auth resolved, session flag set: **signed-in → `/home`**; else **onboarding completed** → `/sign-in`; else **`/onboarding`**. Keys/helpers: `SPLASH_SESSION_STORAGE_KEY`, `ONBOARDING_COMPLETED_STORAGE_KEY`, `hasCompletedOnboarding()` in `shared/utils/onboardingCompletion.ts`.

## 4. State and data-fetching

| Layer | Usage |
|-------|--------|
| **Zustand** | `features/tasbeeh/store/tasbeehStore.ts`; `features/settings/store/settingsStore.ts` |
| **TanStack Query** | `services/queryClient.ts` (staleTime 60s, retry 1, `refetchOnWindowFocus: false`); hooks e.g. `useTasbeehQuery`, `usePrayerTimes`, `useAsmaUlHusna`, Firestore tests |
| **IndexedDB (Dexie)** | `features/tasbeeh/services/tasbeeh.local.ts` — local tasbeeh sequences / sync metadata |
| **Remote config** | `RemoteConfigProvider` + `useRemoteConfig` |
| **Theme / font persistence** | `localStorage` `tasbeehSettings` (`daisyUiTheme`, legacy `theme`), `app_font` key via `shared/lib/font.ts` |

Keep Zustand (domain) separate from React Query (server cache) per project rules.

## 5. Services and external integrations

| Service | Location | Notes |
|---------|----------|--------|
| Firebase app | `services/firebase/app.ts` | Auth + init |
| Firestore | `services/firebase/firestore/`, `firebase/tasbeehs/`, `firebase/users/` | Catalog sync helpers, user doc sync |
| Auth | `services/auth/` | `AuthProvider`, `useAuth`, email/password, Google, email link; `actions/` (anonymous, facebook, etc.) |
| IslamicAPI | `features/tasbeeh/api/` + `services/api/islamicApiInstance.ts` | Shared Axios; key via env / config |
| Remote Config | `services/remoteConfig/` | Defaults, parse/merge, provider |
| Analytics | `services/analytics/` | Screen tracking, `track` |
| Crashlytics | `services/crashlytics/` | Global handlers, reporting |
| Sentry | `services/sentry/initSentry.ts` | Browser tracing, replay, optional React Router integration; DSN via `VITE_SENTRY_DSN` |

UI should consume Firebase/auth/HTTP through these layers, not raw SDK scatter.

## 6. Theme and color system

**Primary theming:** **daisyUI** with `data-theme` on `<html>` — all built-in themes enabled in `global.css` (`themes: all`). Names and normalization: `shared/config/daisyUiThemes.ts`. Persisted field: `tasbeehSettings.daisyUiTheme` in `localStorage`; `readStoredDaisyTheme()` / `applyThemeToDocument()` in `shared/lib/theme.ts` also sync `html.dark` from computed `color-scheme` and `meta[name="theme-color"]` via legacy `ThemeId` mapping (`THEME_COLOR_META` in `shared/config/constants.ts`).

**Tailwind v4:** `@import "tailwindcss"` + `@theme` font tokens (`--font-sans` → `--font-primary`, `--font-arabic`, `--font-urdu`). Body uses `@apply bg-base-100 text-base-content`.

**Legacy / parallel styling:** `twUi` (`shared/lib/twUi.ts`) — slate/green Tailwind recipes with `accent-purple` / `accent-green` custom variants for older screens. `shared/theme/` (default/dark colors, pine green, `cssVars`) remains for palette helpers not necessarily wired to every screen.

**Custom variants** (`global.css`): `dark` (`.dark`), `accent-purple`, `accent-green`.

## 7. Typography and spacing

- **UI font:** `initAppFont` (`shared/lib/font.ts`) — selectable app fonts from `shared/config/appFonts.ts`, Google Fonts link injection; `--font-primary` on `:root`.
- **Arabic / Urdu:** Amiri + Noto Nastaliq Urdu from `index.html`; utilities `.Arabic-font`, `font-arabic` / `font-urdu` in Tailwind theme.
- **Dubai font CSS:** `shared/styles/dubai-font.css` still loaded from `main.tsx`.
- **Responsive scale:** `shared/utils/responsiveness.ts` — `wp`, `hp`, `fp` vs baseline **375×812**.
- **Design constants:** `shared/constants/design.constants.ts` — spacing via `hp`/`wp` where used.

## 8. Assets

| Location | Contents |
|----------|----------|
| `public/` | `_redirects`, `manifest.json`, `icons.svg`; generated PNGs (favicon-32, icons, apple-touch) via `yarn icons` when script run |
| `src/assets/lottie/` | e.g. `app-logo.json` (splash) |
| `src/assets/videos/` | Onboarding MP4s (`onboarding-1` … `onboarding-4` imported in splash) |
| **Icons in UI** | `lucide-react` |

## 9. Responsiveness and layout utilities

- Prefer `shared/utils/responsiveness.ts` when matching scaled mobile layouts; much new chrome uses Tailwind + daisy tokens directly.
- App shell: full-width column with safe-area padding; bottom nav clearance in `AppLayout`.

## 10. Folder and export conventions

- Path alias **`@/`** for `src` imports.
- **Features:** public API via `features/*/index.ts` where present; **no cross-feature internal imports** (see architecture rules).
- **Pages:** route-level composition; colocated `*.module.css` where used.
- **Services:** single integration surface per domain; IslamicAPI instance under `services/api/`; feature-specific API under `features/tasbeeh/api/`.

## 11. Component inventory (grouped)

### Shared — forms & misc

| Component | Path | Role / notes |
|-----------|------|----------------|
| Form | `shared/components/forms/Form.tsx` | Form wrapper |
| Input | `shared/components/forms/Input.tsx` | Text input |
| Switch | `shared/components/forms/Switch.tsx` | Toggle |
| schemas | `shared/components/forms/schemas.ts` | Shared zod bits |

### Shared — navigation & shells

| Component | Path | Role / notes |
|-----------|------|----------------|
| NavHeader | `shared/components/NavHeader/NavHeader.tsx` | Screen header |
| Drawer | `shared/components/Drawer/Drawer.tsx` | Slide-out panel |
| LogoutSheet | `shared/components/LogoutSheet/LogoutSheet.tsx` | Logout sheet UI |
| SquircleSheet | `shared/components/SquircleSheet/` | Sheet built on squircle styling |

### Shared — buttons & shapes

| Component | Path | Role / notes |
|-----------|------|----------------|
| Button | `shared/components/Button/index.tsx` | Motion button variants + CSS module |
| Squircle | `shared/components/Squircle/index.tsx` | `@squircle-js/react` wrapper |
| SquircleCard | `shared/components/SquircleCard.tsx` | Card shell (`.squircle-card` / squircle styles) |
| CornerSquircle | `shared/components/CornerSquircle.tsx` | Corner smoothing helper |
| SmoothSquircle | `shared/components/ui/SmoothSquircle.tsx` | Alternative squircle UI |

### Shared — daisyUI-flavored primitives

| Component | Path | Role / notes |
|-----------|------|----------------|
| DaisyRange | `shared/components/daisy/DaisyRange.tsx` | Range input styling |
| DaisyIndicator | `shared/components/daisy/DaisyIndicator.tsx` | Indicator dot/stepper |
| DaisyToggle | `shared/components/daisy/DaisyToggle.tsx` | Toggle |
| DaisyDivider | `shared/components/daisy/DaisyDivider.tsx` | Divider |
| DaisyCountdown | `shared/components/daisy/DaisyCountdown.tsx` | Countdown UI |
| daisy index | `shared/components/daisy/index.ts` | Barrel |

### Shared — UI kit (`ui/`)

| Component | Path | Role / notes |
|-----------|------|----------------|
| UiButton | `shared/components/ui/UiButton.tsx` | Button primitive |
| UiTextField | `shared/components/ui/UiTextField.tsx` | Text field |
| UiCard | `shared/components/ui/UiCard.tsx` | Card |
| UiBadge | `shared/components/ui/UiBadge.tsx` | Badge |
| UiAvatar | `shared/components/ui/UiAvatar.tsx` | Avatar |
| UiSpinner | `shared/components/ui/UiSpinner.tsx` | Loading |
| UiToast | `shared/components/ui/UiToast.tsx` | Toast |
| UiListRow | `shared/components/ui/UiListRow.tsx` | List row |
| UiToggle | `shared/components/ui/UiToggle.tsx` | Toggle |
| UiSelect | `shared/components/ui/UiSelect.tsx` | Select |
| palette | `shared/components/ui/palette.ts` | UI palette tokens |
| ZikrCounterTapDemo | `shared/components/ui/ZikrCounterTapDemo.tsx` | Dev/demo tap feedback |
| ui index | `shared/components/ui/index.ts` | Barrel |

### Shared — other

| Component | Path | Role / notes |
|-----------|------|----------------|
| AnimatedDhikrCount | `shared/components/AnimatedDhikrCount.tsx` | Animated digit display |

### Features — settings

| Component | Path | Role / notes |
|-----------|------|----------------|
| ThemePicker | `features/settings/components/ThemePicker.tsx` | Theme selection |
| DaisyThemeSwatch | `features/settings/components/DaisyThemeSwatch.tsx` | daisyUI theme swatch |
| FontOptionCards | `features/settings/components/FontOptionCards.tsx` | Font picker cards |
| SettingsPrimitives | `features/settings/components/SettingsPrimitives.tsx` | Settings UI building blocks |

### Features — tasbeeh

| Component | Path | Role / notes |
|-----------|------|----------------|
| ProgressRing | `features/tasbeeh/components/ProgressRing.tsx` | Progress ring |
| HomeDhikrCounter | `features/tasbeeh/components/HomeDhikrCounter.tsx` | Home counter |
| HomeDhikrCounterSkeleton | `features/tasbeeh/components/HomeDhikrCounterSkeleton.tsx` | Loading skeleton |

## 12. Codegen / reuse rules (mandatory)

- Reuse **shared/components** and `twUi` / daisy semantic classes before one-off styling.
- Prefer **daisyUI semantic tokens** (`bg-base-*`, `text-base-content`, etc.) for new surfaces; keep chrome **accessible** when mixing `twUi` (slate/green) with daisy themes.
- Respect **boundaries:** services for Firebase/auth/HTTP; features do not import other features’ internals; pages compose.
- **Remote copy:** Prefer `useRemoteConfig` / keys in `services/remoteConfig/defaults.ts` for user-visible strings where the pipeline supports it.

## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
