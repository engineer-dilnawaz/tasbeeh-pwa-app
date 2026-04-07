---
applyTo: "**/*.tsx,**/*.ts"
---

# Project Metadata
- **Project Name:** tasbeeh-flow
- **Framework:** React 19.2.4 (Vite PWA)
- **Last Scanned Date:** 2026-04-07
- **Core Dependencies:** React Router DOM v7, Zustand, Tanstack React Query, TailwindCSS, Framer Motion, Firebase, Lottie.

# Architecture Overview
```
src/
├── app/          → Shell: providers, router, layout
├── assets/       → Statics: svg, lottie, videos
├── dev/          → Design lab and pattern previews
├── features/     → Domain modules (tasbeeh, stats, settings, customTasbeeh)
├── pages/        → Route components (thin — compose features)
├── pwa/          → PWA Service Worker configs
├── services/     → External integrations (Firebase, queries, analytics, auth, crashlytics)
└── shared/       → Cross-cutting (components, theme, config, utils, hooks, types)
```

# Path Aliases
| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |

# Provider Stack
`src/app/providers.tsx`:
1. `QueryClientProvider` (via `queryClient`)
2. `BrowserRouter`
3. `RemoteConfigProvider`
4. `AuthProvider`

# Navigation
Managed by `react-router-dom` v7 in `src/app/router.tsx`. Flat routes structure:
- **Dev Routes:** `/design-lab/*`
- **Public Routes:** `/`, `/onboarding`, `/sign-in`, `/privacy`, `/terms`, `/data-deletion`, `/auth/email-link`
- **Authenticated/Protected Routes** (wrapped in `AppLayout`):
  - `/home`, `/collections`, `/ayat`, `/hadith`, `/asma-ul-husna`, `/asma-ul-husna/favorites`
  - `/community`, `/prayer-times`, `/qibla`, `/add`, `/stats`, `/settings`

# State Management
- **Domain/Local State:** `zustand` (e.g., `src/features/tasbeeh/store/tasbeehStore.ts` with transparent `localStorage` persistence).
- **Server/Remote Data:** `@tanstack/react-query`. Always handle remote endpoints, Firebase fetches, and third-party APIs via React Query cache, configured for offline resilience (`networkMode: 'offlineFirst'`).

# API Layer
- **Firebase Services:** Encapsulated inside `src/services/firebase/` and `src/services/auth/`. No raw `.doc()` or auth calls in UI components.
- **Islamic APIs:** Located in `src/features/tasbeeh/api/islamicApi/` interacting with endpoints via `axios`.
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
The app uses a 3-mode theme system: `default` (Light), `dark`, and a semantic `pineGreen` CSS custom properties scale.
- **Access Patterns:** Themes load statically via `getThemeColors(themeId)` defined in `src/shared/theme/index.ts`.
- **Namespaces:** `button`, `elevation`, `scales`, `input`, `border`, `card`, `tags`, `blackOpacity`, `whiteOpacity`.
- **Key Tokens:** `background`, `textPrimary`, `textSecondary`, `primary`, `onPrimary`, `secondary`, `tertiary`.
- **CSS Vars Inject:** Pine Green scaling injects dynamic CSS targets inside `--pine-green-*` mappings using `applyPineGreenPaletteToRoot`.

# Typography System
- **Font Families:** Managed via `src/shared/config/appFonts.ts` (Inter, Plus Jakarta Sans, DM Sans, Manrope, Rakkas, Amiri).
- **Mapping:** Injected into `document.documentElement` dynamically as `--font-primary` relying on Google Fonts CSS2 API.
- **Usage:** Typically styled via TailwindCSS classes coupled with `fp(size)` or semantic fonts map when specific typography is required.

# Assets & Images
- **Directory Map:** `src/assets/lottie/` (Lottie JSONs), `src/assets/videos/` (Onboarding MP4s), Icons primarily imported via `lucide-react`.
- **Image Usage Rules:** Precached via `vite-plugin-pwa`. Animations use `framer-motion` and `lottie-react`.

# Component Inventory
| Category | Component | Path | Use For |
|---|---|---|---|
| **Buttons** | `Button`, `UiButton` | `src/shared/components/Button/`, `src/shared/components/ui/` | Standard touch and click targets |
| **Primitives** | `UiBadge`, `UiCard`, `UiAvatar` | `src/shared/components/ui/` | Base UI structural elements |
| **Overlays** | `Drawer`, `LogoutSheet`, `SquircleSheet` | `src/shared/components/` | Bottom sheets, slide-outs, modals |
| **Squircles** | `Squircle`, `SquircleCard`, `CornerSquircle` | `src/shared/components/` | Premium squircle-cornered containers |
| **DaisyUI** | `DaisyRange`, `DaisyToggle` | `src/shared/components/daisy/` | React wrapped DaisyUI controls |
| **Animation**| `ProgressRing`, `AnimatedDhikrCount` | `src/features/tasbeeh/components/`, `src/shared/components/` | Meaningful zikr interactions |
| **Forms** | `Form`, `Input`, `Switch` | `src/shared/components/forms/` | Form fields and data capture controls |

# Figma to Component Mapping
(No static layout components mapped from Figma specifically identified currently; rely on shared components inventory).

# Component Reuse Rules
1. Never rebuild standard UI structures like `Button` or `SquircleCard` inline. Use `UiButton` or `SquircleCard`.
2. Abstract components visually only if a second feature module explicitly relies on them; never implement preliminary shared abstractions.

# Forms Module
Controlled validation via `react-hook-form` coupled with Zod resolvers. Schemas are modularized inside `src/shared/components/forms/schemas.ts`.

# Session Log
- **2026-04-04:** Initial project-scan initialized. Handled scanning Vite PWA context.
- **2026-04-07:** Refreshed project scan with detailed Architecture Overview, UI primitive components (`UiCard`, `SquircleSheet`, etc.), forms architecture (`react-hook-form` + `zod`), DaisyUI hooks, and extended assets mappings.
