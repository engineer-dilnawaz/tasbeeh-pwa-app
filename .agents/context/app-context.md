---
generated: true
lastScanned: "2026-04-28"
---

# Tasbeeh Flow - project context (generated)

Current, factual snapshot of this repository. Architecture intent and guardrails are defined in `.cursor/rules/*.mdc`.

## 1. Project metadata

| Field | Value |
|---|---|
| Package name | `tasbeeh-flow` |
| Version | `1.0.0` |
| Framework | React `^19.2.4` + React DOM `^19.2.4` |
| Build tool | Vite `^8.0.3` |
| TypeScript | `^6.0.2` (`strict: true`, target `ES2023`) |
| Router | `react-router-dom` `^7.13.2` |
| UI system | MUI (`@mui/material` `^9.0.0` + Emotion) |
| State (domain/client) | `zustand` `^5.0.12` (persist → localStorage) |
| PWA | `vite-plugin-pwa` `^1.2.0` |
| Animation | `framer-motion` `^12.38.0` |

### Scripts (from `package.json`)

- `dev`: `vite --host`
- `build`: `tsc -p tsconfig.app.json --noEmit --ignoreDeprecations 6.0 && vite build`
- `icons`: `node scripts/generate-app-icons.mjs`
- `lint`: `eslint .`
- `typecheck`: `tsc --noEmit --ignoreDeprecations 6.0`
- `preview`: `vite preview`

### Aliases and compile-time config

- Path alias: `@/*` → `./src/*` (`tsconfig.app.json`, `vite.config.ts`)
- Vite define: `__APP_VERSION__` from `package.json` (`vite.config.ts`)

### Key dependencies by role (selected)

- Routing: `react-router-dom`
- UI/components: `@mui/material`, `@mui/icons-material`, Emotion (`@emotion/react`, `@emotion/styled`)
- State: `zustand` (+ `zustand/middleware`)
- Animation: `framer-motion`
- PWA: `vite-plugin-pwa`
- Utilities that exist in deps (usage varies by screen): `zod`, `react-hook-form`, `chart.js`, `react-chartjs-2`, `firebase`, `dexie`, `@tanstack/react-query`, `@sentry/react`, `tailwindcss`

## 2. Architecture overview (directory tree summary)

Current `src/` map (depth ~3):

```
src/
├── main.tsx
├── app/
│   ├── App.tsx
│   ├── index.ts
│   ├── layouts/
│   │   ├── AppTabsLayout.tsx
│   │   └── index.ts
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   ├── ThemeModeProvider.tsx
│   │   ├── themeModeContext.ts
│   │   ├── useThemeModeContext.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── router.tsx
│   │   └── index.ts
│   └── screens/
│       ├── HomeScreen.tsx
│       ├── StatsScreen.tsx
│       ├── SettingsScreen.tsx
│       └── index.ts
├── features/
│   └── tasbeeh/
│       ├── components/CompletionCard.tsx
│       ├── screens/
│       │   ├── CounterScreen.tsx
│       │   ├── TasbeehListScreen.tsx
│       │   └── index.ts
│       ├── store/
│       │   ├── tasbeehStore.ts
│       │   └── index.ts
│       ├── types.ts
│       └── index.ts
└── shared/
    ├── components/ (16 files + barrel)
    ├── constants/ (routes, storageKeys, barrel)
    ├── hooks/ (theme mode hook + barrel)
    ├── locales/ (en + `t()` helper)
    └── theme/ (MUI theme + tokens + typings)
```

## 3. Router, providers, layout

### Entry

- `src/main.tsx` renders `<App />` into `#root` inside `StrictMode`.

### App root

- `src/app/App.tsx`: wraps `AppRouter` with `AppProviders`.

### Provider stack (`src/app/providers/AppProviders.tsx`)

1. `ThemeModeProvider` (custom context; mode preference persisted in localStorage)
2. MUI `ThemeProvider` bridging `ThemeModeContext` → `createAppTheme(mode)`
3. `CssBaseline`

### Router structure (`src/app/routes/router.tsx`)

- Router: `BrowserRouter` + `Routes`
- Shell/layout: `AppTabsLayout` renders `Outlet` + persistent `AppBottomTabs`

Primary routes (via `ROUTES`):

- `/` → redirects to `/home`
- `/home` → `HomeScreen` (redirects to `/home/:tasbeehId`)
- `/home/:tasbeehId` → `CounterScreen`
- `/collection` → `TasbeehListScreen`
- `/stats` → `StatsScreen`
- `/settings` → `SettingsScreen`
- Legacy redirects:
  - `/tasbeeh` → `/collection`
  - `/tasbeeh/:tasbeehId` → redirects to `/home` (see `LegacyTasbeehCounterRedirect`)
- `*` → redirects to `/home`

## 4. State and data-fetching patterns

### Domain/client state (Zustand)

| Store | Path | Persistence | Purpose |
|---|---|---|---|
| `useTasbeehStore` | `src/features/tasbeeh/store/tasbeehStore.ts` | `zustand/persist` → localStorage key `tasbeeh.tasbeehStore` | Collections + tasbeeh items, selected tasbeeh, counts, hydration flag |

Notes:

- The store includes a v1→v2 migration (wrap existing flat items into a default collection).
- `hasHydrated` is set via `onRehydrateStorage` callback.

### Server cache / remote data

- `@tanstack/react-query`, `firebase`, `dexie` exist in dependencies, but are **not wired** in the current `src/` structure shown above.

## 5. Services and external integrations

- No `src/services/` directory in the current `src/` tree.
- PWA integration is configured in `vite.config.ts` (see section 10).

## 6. Theme and color system

Theme is token-driven and implemented through MUI `ThemeProvider`.

- Tokens: `src/shared/theme/tokens.ts` (`THEME_TOKENS`)
- Theme factory: `src/shared/theme/createTheme.ts` (`createAppTheme(mode)`)
- Custom theme augmentation: `src/shared/theme/mui.d.ts` (adds `theme.custom.surface` and `theme.custom.tasbeeh`)

### Activation

- Theme mode preference is stored in localStorage key `tasbeeh.themeMode` (value: `light` | `dark` | `system`).
- When preference is `system`, mode follows `matchMedia("(prefers-color-scheme: dark)")`.

### Semantic roles (compact, by mode)

| Role | Light | Dark |
|---|---|---|
| App background (`palette.background.default`) | `#F6EDDD` | `#0B1220` |
| Paper (`palette.background.paper`) | `#FFFFFF` | `#0F172A` |
| Text primary | `#0F172A` | `#E2E8F0` |
| Text secondary | `#334155` | `#94A3B8` |
| Surface level2 (nested) | `#F3F3F3` | `#111C33` |

Brand + semantic:

- Primary: `#4F46E5`
- Accent: `#22C55E`
- Status: success `#16A34A`, warning `#D97706`, error `#DC2626`, info `#0284C7`

## 7. Typography and spacing

### Fonts (from `THEME_TOKENS.typography.fontFamily`)

- Body: `Roboto, Inter, system-ui, ...`
- Display: `Outfit, Roboto, system-ui, ...`
- Arabic: `Amiri, serif`
- Urdu: `Noto Nastaliq Urdu, serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, ...`

### MUI theme typography defaults (selected)

- Global `fontFamily`: body stack
- `h1`: display stack + black weight; letterSpacing from `THEME_TOKENS.tasbeeh.counter.letterSpacing`
- `button`: `textTransform: none`, semibold

### Spacing / radius

- MUI `spacing: 4`
- Global shape radius: `THEME_TOKENS.shape.radius.md` (with component overrides for pill buttons + tasbeeh card radius)

## 8. Assets

### `public/`

- `public/manifest.json`
- `public/icons.svg`
- `public/_redirects` (SPA hosting)
- `public/assets/sounds/count-tap.{wav,mp3}`

### Icons

- App icons are MUI icons wrapped in `src/shared/components/icons.tsx` (`Icons.*`)

### Script

- `yarn icons` → `scripts/generate-app-icons.mjs` (exists in scripts; output assets not enumerated here)

## 9. Responsiveness / layout utilities

- `ScreenContainer` enforces a mobile-first centered column with `maxWidth: 480` and safe bottom padding for the bottom tabs.
- No dedicated breakpoint/helper module in the current `src/shared/`.

## 10. PWA and offline

From `vite.config.ts`:

- `vite-plugin-pwa`: `registerType: "autoUpdate"`
- Service worker disabled in dev (`devOptions.enabled: false`)
- Workbox:
  - `globPatterns`: `**/*.{js,css,html,ico,png,svg,woff2}`
  - runtime caching: video `NetworkOnly` (`mp4|webm`)
  - `navigateFallbackDenylist`: guards for `/assets/`, `/src/`, and static extensions to avoid returning HTML for module requests

## 11. Folder and export conventions

- Import alias `@/` for `src/`
- Barrels:
  - `src/app/index.ts` exports `App`
  - `src/app/providers/index.ts` exports `AppProviders`, `ThemeModeProvider`, `useThemeModeContext`
  - `src/app/routes/index.ts` exports `AppRouter`
  - `src/shared/components/index.ts` exports shared UI wrappers/primitives
  - `src/features/tasbeeh/index.ts` exports screens + store + types

## 12. Component inventory (grouped)

### Shared components (`src/shared/components/`)

| Component | Path | Role / key props |
|---|---|---|
| `ScreenContainer` | `src/shared/components/ScreenContainer.tsx` | Screen shell; `noPadding?: boolean`; centers content max width 480 |
| `AppBottomTabs` | `src/shared/components/AppBottomTabs.tsx` | Persistent bottom tab bar; uses `ROUTES` + `useLocation()` to highlight active tab |
| `AppBottomSheet` | `src/shared/components/AppBottomSheet.tsx` | Bottom sheet wrapper over `SwipeableDrawer`; supports `icon/title/description`, `paperSx/contentSx` |
| `AppDialog` | `src/shared/components/AppDialog.tsx` | Dialog wrapper with primary/secondary actions |
| `AppCard` | `src/shared/components/AppCard.tsx` | Card surface; optionally clickable (`onClick`, `ariaLabel`) |
| `AppListRow` | `src/shared/components/AppListRow.tsx` | Clickable row with title/subtitle + chevron |
| `AppNumberField` | `src/shared/components/AppNumberField.tsx` | Numeric input with +/- steppers; clamps to `min/max` |
| `TapFeedback` | `src/shared/components/TapFeedback.tsx` | Tap target with optional vibration + reduced-motion scaling |
| `ThemeSelector` | `src/shared/components/ThemeSelector.tsx` | Light/system/dark segmented selector; writes to `ThemeModeContext` |
| `AppButton` | `src/shared/components/AppButton.tsx` | MUI `Button` passthrough |
| `AppIconButton` | `src/shared/components/AppIconButton.tsx` | MUI icon button wrapper (styling helper) |
| `AppDivider` | `src/shared/components/AppDivider.tsx` | Divider wrapper |
| `AppStack` | `src/shared/components/AppStack.tsx` | MUI `Stack` passthrough |
| `AppSwitch` | `src/shared/components/AppSwitch.tsx` | MUI `Switch` export |
| `AppText` | `src/shared/components/AppText.tsx` | MUI `Typography` passthrough |
| `Icons` | `src/shared/components/icons.tsx` | Central icon map (MUI icons) |

### Feature components (`src/features/*/components`)

| Component | Path | Role |
|---|---|---|
| `CompletionCard` | `src/features/tasbeeh/components/CompletionCard.tsx` | “Target reached” UI; routes back to collection or continues counting |

## 13. Codegen / reuse rules

- Prefer `src/shared/components/*` wrappers for UI so theme tokens and consistent MUI usage stay centralized.
- Use `THEME_TOKENS` + `createAppTheme()` (no one-off hex colors in screens unless intentional).
- Keep feature code within `src/features/<feature>/...` and avoid cross-feature deep imports.
- Route constants live in `src/shared/constants/routes.ts` (`ROUTES`), reuse them for navigation.

## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
