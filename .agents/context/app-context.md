---
generated: true
lastScanned: "2026-04-17"
---

# Tasbeeh Flow - project context (generated)

Current, factual snapshot of this repository. Architecture intent and guardrails are defined in `.cursor/rules/*.mdc`.

## 1. Project metadata

| Field | Value |
|--------|--------|
| Package name | `tasbeeh-flow` |
| Version | `1.0.0` |
| Framework | React `^19.2.4` + React DOM `^19.2.4` |
| Build tool | Vite `^8.0.3` |
| TypeScript | `^6.0.2` (`strict: true`, target `ES2023`) |
| Router | `react-router-dom` `^7.13.2` |
| State (domain/client) | `zustand` `^5.0.12` |
| State (server cache) | `@tanstack/react-query` `^5.96.1` |
| UI + styling | Tailwind v4 (`@tailwindcss/vite`), daisyUI `^5.5.19` (themes: light, dark) |
| Animation | `framer-motion` `^12.38.0`, `motion` `^12.38.0`, `@react-spring/web` `9.5.5` |
| Backend SDK | Firebase `^12.11.0` |
| Local storage | `dexie` `^4.4.2` (IndexedDB wrapper) |
| PWA | `vite-plugin-pwa` `^1.2.0` |
| Observability | `@sentry/react` `^10.47.0` |

### Scripts

- `dev`: `vite --host`
- `build`: `tsc -b && vite build`
- `icons`: `node scripts/generate-app-icons.mjs`
- `lint`: `eslint .`
- `typecheck`: `tsc --noEmit`
- `preview`: `vite preview`

### Aliases and compile-time config

- Path alias: `@/*` → `./src/*` (`tsconfig.app.json`, `vite.config.ts`)
- Build-time define: `__APP_VERSION__` from `package.json`

### Key dependencies by role

- Routing: `react-router-dom`
- UI primitives/icons: daisyUI, Tailwind CSS, `lucide-react`, `@phosphor-icons/react`, `@squircle-js/react`, `corner-smoothing`, `clsx`
- Sheets / cards: `react-modal-sheet`, `react-tinder-card`
- Animation/motion: `framer-motion`, `motion`, `@react-spring/web`, `react-animated-numbers`, `lottie-react` (+ dev `lottie-web`)
- Forms/validation: `react-hook-form`, `@hookform/resolvers`, `zod`
- Charts/calendar: `chart.js`, `react-chartjs-2`, `react-day-picker`, `date-fns`
- Data/storage: `zustand`, `dexie`, `dexie-react-hooks`, `axios`
- Backend/infra: `firebase`, `@sentry/react`

## 2. Architecture overview (directory tree summary)

Current `src/` map (depth ~3):

```
src/
├── main.tsx, App.tsx
├── app/
│   ├── router.tsx
│   └── layout/
│       ├── AppShell.tsx
│       └── ScreenWrapper.tsx
├── pages/
│   ├── SplashScreen.tsx
│   ├── Onboarding.tsx
│   ├── Home.tsx
│   ├── Stats.tsx
│   ├── Collections.tsx
│   ├── CollectionsNew.tsx
│   ├── Saved.tsx          ← present; not registered in router.tsx
│   ├── Settings.tsx
│   ├── SettingsFeedback.tsx
│   ├── SettingsAbout.tsx
│   ├── SettingsProfile.tsx
│   └── TestScreen.tsx
├── features/
│   ├── onboarding/
│   │   └── onboardingStore.ts
│   ├── settings/
│   │   ├── components/ (SettingsHub, SettingRow, SettingsActionSheet)
│   │   ├── services/appConfigRepository.ts
│   │   └── store/settingsStore.ts
│   └── tasbeeh/
│       ├── components/ (HomeStreakStrip, HomeCurrentTasbeehCard, HomeActionRow)
│       ├── collections/
│       │   ├── components/ (5)
│       │   ├── hooks/ (usePhrasesQuery, usePhraseMutations, useCollections)
│       │   ├── store/collectionComposerStore.ts
│       │   ├── types.ts
│       │   ├── queryKeys.ts
│       │   └── index.ts
│       ├── services/ (tasbeehDb.ts, tasbeehRepository.ts, collectionsRepository.ts)
│       └── store/tasbeehStore.ts
├── services/
│   ├── firebase/config.ts
│   ├── queryClient.ts
│   └── sync/              ← collections sync API (placeholder + types)
├── shared/
│   ├── design-system/
│   │   ├── index.ts (partial barrel — not every UI file re-exported)
│   │   ├── tokens/index.ts
│   │   ├── hooks/ (useTheme.ts, useLongPressTooltip.ts)
│   │   └── ui/ (36 TSX primitives)
│   ├── styles/global.css
│   └── utils/date.ts
└── assets/
    └── images/ (slide1.jpg, slide2.jpg, slide3.jpg)
```

## 3. Router, providers, layout

### Entry and app shell

- Entry `main.tsx` imports global styles and renders `<App />` in `StrictMode`.
- `App.tsx`: `QueryClientProvider` → `ScreenWrapper` → `RouterProvider`.
- `ScreenWrapper` centers a mobile-width viewport (`max-w-[480px]`) on a full-screen neutral background.

### Provider stack (`App.tsx`)

1. `QueryClientProvider` (`services/queryClient.ts`)
2. `ScreenWrapper`
3. `RouterProvider`

### Router structure

`src/app/router.tsx` — `createBrowserRouter`:

**Public**

- `/` → `SplashScreen`
- `/onboarding` → `Onboarding`

**App shell** (`AppShell` layout children)

- `/home` → `Home`
- `/stats` → `Stats`
- `/settings` → `Settings`
- `/collections` → `Collections`
- `/collections/new` → `CollectionsNew`
- `/settings/feedback` → `SettingsFeedback`
- `/settings/about` → `SettingsAbout`
- `/settings/profile` → `SettingsProfile`

**Dev / fallback**

- `/test` → `TestScreen`
- `*` → `Navigate` to `/`

### AppShell layout

`AppShell.tsx`: `Header` (dynamic title, back on sub-screens), `Outlet`, `Toaster`, `BottomNav` (hidden on feedback/about/profile and `/collections/new`). Hydrates settings from IndexedDB once; syncs DOM theme via `useTheme` from store `appearance.theme`. Bottom nav variant from settings: `bar` | `glass-dock`.

## 4. State and data-fetching patterns

### Domain/client state (Zustand)

| Store | Path | Persistence | Purpose |
|-------|------|-------------|---------|
| `useTasbeehStore` | `features/tasbeeh/store/tasbeehStore.ts` | IndexedDB | Library, count, streak, etc. |
| `useSettingsStore` | `features/settings/store/settingsStore.ts` | IndexedDB via `appConfigRepository` | Appearance, interaction, accessibility, notifications |
| `useOnboardingStore` | `features/onboarding/onboardingStore.ts` | localStorage key `onboarding-storage` | Completion flag |
| `useCollectionComposerStore` | `features/tasbeeh/collections/store/collectionComposerStore.ts` | Ephemeral | Draft collection / phrase UI |
| `useToastStore` | `shared/design-system/ui/useToast.ts` | Ephemeral | Toast queue |

### Server cache (React Query)

- `QueryClient` defaults: `staleTime` 60s, `gcTime` 5m, `networkMode: 'offlineFirst'`, `retry: 1` (queries and mutations).

**React Query hooks (phrases)**

- `usePhrasesQuery()` — `listPhrases()` from Dexie; key `tasbeehQueryKeys.phrases()`; `staleTime: Infinity`.
- `useCreatePhraseMutation` / `useUpdatePhraseMutation` — invalidate phrases query on settle.

**Non-Query data loading**

- `useCollections()` — `useState` + `useEffect` calling `listCollections` / `getCollectionDetails` (not TanStack Query).

## 5. Services and external integrations

### IndexedDB (Dexie)

`features/tasbeeh/services/tasbeehDb.ts` — DB name `tasbeehFlowDb`.

| Table | Purpose |
|-------|---------|
| `tasbeehCollection` | Legacy single-phrase tasbeehs |
| `userProgress` | Active tasbeeh, count, streak |
| `progressEvents` | Tap/reset/complete log |
| `appConfig` | Serialized app settings |
| `tasbeehCollections` | Collection groups (schedule, priority, …) |
| `tasbeehPhrases` | Phrase library |
| `collectionItems` | Phrase ↔ collection links |

**Schema version:** Dexie `version(4)` (latest store definitions include collections/phrases/items).

Row types include `syncStatus` (`local` \| `pending` \| `synced` \| `error`) for future cloud sync.

### Repository layer

- `tasbeehRepository.ts` — progress, streak, cycles
- `collectionsRepository.ts` — phrases and collections CRUD
- `appConfigRepository.ts` — read/patch app config

### Firebase

`services/firebase/config.ts` — `initializeApp` from `VITE_FIREBASE_*`; exports `auth`, `db` (Firestore). Feature usage remains thin vs local Dexie.

### Sync module

`services/sync/` — re-exports from `collectionsSync.ts`: `syncCollections`, `syncPendingCollections`, `pullCollectionsFromRemote`, pending counts, labels, `FIRESTORE_PATHS`. **Implementation is largely placeholder** (console + no-op success); intended local-first → Firestore direction is documented in file comments.

## 6. Theme and color system

### Activation

- `data-theme` on `document.documentElement` (`light` \| `dark`)
- `useTheme` toggles `.dark` for Tailwind dark variants; `.theme-transitioning` ~280ms on changes
- AppShell applies `setTheme` from hydrated settings

### Semantic roles (compact)

| Role | Notes |
|------|--------|
| Surfaces | daisyUI `base-100`, `base-200`, `base-content` |
| Brand | `primary`, semantic tokens in CSS vars |
| Cards | e.g. `--color-surface-card` (see `global.css`) |

### Token module

`shared/design-system/tokens/index.ts` — `TOKENS`: primary/accent OKLCH, content class names, status colors, shadow/radius CSS var refs, Framer-style motion presets.

## 7. Typography and spacing

From `shared/styles/global.css`:

- Font stacks: `--font-primary` (Inter), `--font-arabic` (Amiri), `--font-urdu` (Noto Nastaliq Urdu), `--font-display` (Outfit), `--font-sans` → primary
- Utilities: `.text-display-arabic`, `.text-display-urdu`, `.text-counter`, `.text-heading`
- Spacing: Tailwind scale only (no shared spacing token module)

## 8. Assets

### `public/`

`favicon.svg`, `favicon-32.png`, `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `icons.svg`, `manifest.json`, `_redirects`

### `src/assets/`

`images/slide{1,2,3}.jpg` — onboarding

### Icons

- Primary: `lucide-react`
- Secondary: `@phosphor-icons/react`

### Script

- `yarn icons` → `scripts/generate-app-icons.mjs`

## 9. Responsiveness / layout utilities

- Mobile-first Tailwind
- `ScreenWrapper` max width 480px
- No dedicated breakpoint helper module

## 10. PWA and offline

- `vite-plugin-pwa`: `registerType: "autoUpdate"`, SW **disabled in dev** (`devOptions.enabled: false`)
- Workbox: precache `**/*.{js,css,html,ico,png,svg,woff2}`; video `NetworkOnly`; `navigateFallbackDenylist` for `/assets/`, `/src/`, static extensions
- Offline: Query `offlineFirst` + Dexie-backed reads for phrases/collections

## 11. Folder and export conventions

- Import alias `@/` for `src/`
- `shared/design-system/index.ts` exports a **subset** of UI; deep imports allowed for pieces not in the barrel (e.g. `Tooltip`, calendar subcomponents)
- Features: own `components/`, `services/`, `store/`; avoid cross-feature internal imports
- Pages compose routes and feature hooks/components

## 12. Component inventory (grouped)

### Shared design-system UI (`shared/design-system/ui`) — 36 files

| Component | Role / notes |
|-----------|----------------|
| `Accordion` | Grouped disclosure |
| `Avatar`, `AvatarGroup` | Avatars / stacks |
| `Badge` | Labels / status chips |
| `BottomNav` | Tabs; variants `bar` \| `glass-dock`; optional FAB slot (bar) |
| `Button` | Primary actions |
| `Calendar` | Shell + variants |
| `CalendarActivityList` | Day activity list |
| `CalendarDay` | Day cell |
| `Card` | Surfaces |
| `ChatBubble` | Message bubbles |
| `Checkbox` | Controlled checkbox |
| `Counter` | Numeric / tasbeeh display |
| `Dialog` | Modal |
| `Drawer` | Bottom sheet |
| `EmptyState` | Empty views |
| `FAB` | Floating action |
| `Form` | RHF-friendly pieces |
| `GregorianCalendar`, `HijriCalendar` | Calendar systems |
| `Header` | Top bar |
| `Indicator` | Dots / pulses |
| `List` | List layout |
| `ProgressRing` | Circular progress |
| `PullToRefresh` | Pull gesture |
| `SegmentedControl` | Segmented switching |
| `Select` | Mobile-style select |
| `Skeleton` | Loading placeholders |
| `Squircle` | Smoothed corners |
| `StatsBarChart` | Chart wrapper |
| `Switch` | Toggle |
| `Text` | Typography primitive |
| `TextInput` | Text field |
| `TimePicker` | Time wheels |
| `Toast`, `Toaster` | Toasts |
| `Tooltip` | Tooltip / overlay |
| `useDrawer` | Drawer state (co-located in `ui/`) |
| `useToast` | Toast store + helpers |

### Shared hooks (`shared/design-system/hooks`)

| Hook | Purpose |
|------|---------|
| `useTheme` | `data-theme` + `.dark` sync |
| `useLongPressTooltip` | Long-press tooltip trigger |

### Feature — `tasbeeh`

| Component | Role |
|-----------|------|
| `HomeStreakStrip` | Streak UI |
| `HomeCurrentTasbeehCard` | Active dhikr card |
| `HomeActionRow` | Home actions |

### Feature — `tasbeeh/collections`

| Component | Role |
|-----------|------|
| `CollectionComposerForm` | New/edit collection |
| `CollectionsCard` | Collection summary card |
| `AddTasbeehItemDrawer` | Add phrase/item drawer |
| `DraftTasbeehItemsSection` | Draft list |
| `PhraseLibraryDrawer` | Phrase picker |

### Feature — `settings`

| Component | Role |
|-----------|------|
| `SettingsHub` | Settings home |
| `SettingRow` | Row primitive |
| `SettingsActionSheet` | Action sheet |

## 13. Codegen / reuse rules

- Prefer `shared/design-system` primitives and existing patterns before new one-off UI
- Use semantic daisyUI / CSS variables / `TOKENS` — avoid arbitrary hex unless aligning with tokens
- Separate Zustand (domain/UI) from React Query (cache/invalidation for query-shaped data)
- Firebase and sync: consume through `services/` and repositories, not scattered SDK calls in components
- Pages compose; do not import another feature’s internals

## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
