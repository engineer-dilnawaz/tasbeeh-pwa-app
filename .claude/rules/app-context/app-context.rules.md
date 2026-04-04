---
applyTo: "**/*.tsx,**/*.ts"
---

# Project Metadata
- **Project Name:** tasbeeh-flow
- **Framework:** React 19.2.4 (Vite PWA)
- **Last Scanned Date:** 2026-04-04
- **Core Dependencies:** React Router DOM v7, Zustand, Tanstack React Query, Framer Motion, Firebase, Lottie.

# Architecture Overview
```
src/
├── app/          → Shell: providers, router, layout
├── pages/        → Route components (thin — compose features)
├── features/     → Domain modules (tasbeeh, stats, settings, customTasbeeh)
├── services/     → External integrations (Firebase, queries, analytics)
└── shared/       → Cross-cutting (components, theme, config, utils)
```

# Path Aliases
| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |

# Provider Stack
`src/app/providers.tsx`:
1. `QueryClientProvider`
2. `BrowserRouter`
3. `RemoteConfigProvider`
4. `AuthProvider`

# Navigation
Managed by `react-router-dom` in `src/app/router.tsx`. Flat routes structure:
- Public Routes: `/`, `/onboarding`, `/sign-in`, `/privacy`, `/terms`, `/data-deletion`, `/auth/email-link`
- Authenticated/Protected Routes (wrapped in `AppLayout` + `BottomNav`):
  - `/home` -> Tasbeeh counter
  - `/add` -> Custom Tasbeeh
  - `/stats` -> User Stats
  - `/settings` -> User Prefs

# State Management
- **Domain/Local State:** `zustand` (e.g., `src/features/tasbeeh/store/tasbeehStore.ts` with transparent `localStorage` persistence).
- **Server/Remote Data:** `@tanstack/react-query`. Always handle remote endpoints, Firebase fetches, and third-party APIs via React Query cache, with offline support (`networkMode: 'offlineFirst'`).

# API Layer
- **Firebase Services:** Encapsulated closely inside `src/services/firebase/` and `src/services/auth/`. No raw `.doc()` calls in core UI components.
- **Islamic API:** Lives in `src/features/tasbeeh/api/islamicApi/` interacting with `axios`.
- **Query Configurations:** Standardized in `src/services/queryClient.ts`.

# Responsiveness Utilities
Available in `src/shared/utils/responsiveness.ts`:
- `wp(size)`: Scale width mapping from 375px design layout.
- `hp(size)`: Scale height mapping from 812px design layout.
- `fp(size)`: Scale typography size with clamping constraints.

# Canonical Folder Placement Rules
- **Features (`src/features/*/`):** Business capabilities. **Critically**, features must *never* import out of another feature's internal tree.
- **Pages (`src/pages/*/`):** Represent the UI bindings to the router parameters. Keep logic thin.
- **Services (`src/services/*/`):** Wrap external, non-domain API logic like Firebase, Analytics.
- **Shared (`src/shared/*/`):** Shared Components, Hooks, and Utility logic serving more than one independent feature natively.

# Export / Barrel Conventions
Each feature directory holds a public-facing `index.ts` file which exports only modules explicitly prepared for external use. Use barrel imports where accessible.

# Theme & Color System
The app uses a 3-mode theme system: `default` (Light), `dark`, and a semantic `pineGreen` CSS custom properties injected scale.
- **Access Patterns:** Themes load statically via `getThemeColors(themeId)` defined in `src/shared/theme/index.ts`.
- **Namespaces:** `button`, `elevation`, `scales`, `input`, `border`, `card`, `tags`.
- **Key Tokens:** `background`, `textPrimary`, `textSecondary`, `primary`, `onPrimary`.
- **CSS Vars Inject:** Pine Green scaling injects dynamic CSS targets inside `--pine-green-*` mappings securely to `.app` roots (`applyPineGreenPaletteToRoot`).

# Typography System
Relies on traditional Semantic CSS bindings powered by fluid scaling mapping `.css` module files and standard inline attributes coupled dynamically with the `fp(size)` sizing calculator if absolute pixel alignment mapping is required.

# Assets & Images
Primarily mapped via React native JSX elements, inline SVG elements, and standard `.css` loading techniques leveraging `vite-plugin-pwa`'s precache behavior. `framer-motion` animates transitions inline.

# Component Inventory
| Component | Path | Use For |
|---|---|---|
| `Button` | `src/shared/components/Button/` | Accessible UI touch targets |
| `Squircle` / `SquircleCard` | `src/shared/components/Squircle/` | Cards with custom rounded radius overlays |
| `ThemePicker` | `src/features/settings/components/` | Settings option list styling hooks |
| `ProgressRing` | `src/features/tasbeeh/components/` | Counter SVG stroke-dasharray animations |

# Figma to Component Mapping
(No static layout components mapped from Figma specifically identified; standard UI component primitives handle typical workflows).

# Component Reuse Rules
1. Never rebuild standard UI structures like `Button` or `SquircleCard` inline.
2. Abstract components visually only if a second feature module explicitly relies on them; never implement preliminary shared abstractions.

# Forms Module
Vanilla React controlled values / simple refs; no major abstract layer required.

# Session Log
- **2026-04-04:** Initial project-scan initialized. Handled scanning Vite PWA context.
