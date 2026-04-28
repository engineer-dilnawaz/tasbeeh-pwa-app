---
applyTo: "**/*.tsx,**/*.ts"
---

# Project Metadata
- **Project Name:** tasbeeh-flow
- **Framework:** React 19.2.4 (Vite PWA)
- **Last Scanned Date:** 2026-04-28
- **Core Dependencies:** MUI (@mui/material), React Router DOM v7, Zustand, Tanstack React Query, Framer Motion, Firebase, Lottie.

# Architecture Overview
```
src/
├── app/          → Shell: providers, routes, layouts, screens
├── features/     → Domain modules (tasbeeh)
└── shared/       → Cross-cutting (components, theme, constants, hooks, locales)
public/
└── assets/       → Statics
```

# Path Aliases
| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |

# Provider Stack
`src/app/providers/AppProviders.tsx`:
1. `ThemeModeProvider`
2. `MuiThemeBridge` -> `ThemeProvider` (MUI)
3. `CssBaseline` (MUI)

# Navigation
Managed by `react-router-dom` v7 in `src/app/routes/router.tsx`. Flat routes structure:
- **Public/Protected Routes:** `/`, `/home`, `/home/:tasbeehId`, `/collection`, `/collection/:tasbeehId`, `/stats`, `/settings`.

# State Management
- **Domain/Local State:** `zustand` (e.g., `src/features/tasbeeh/store/tasbeehStore.ts` with transparent `localStorage` persistence).
- **Server/Remote Data:** `@tanstack/react-query`. 

# API Layer
No explicit `services/` folder detected in `src/`. External API logics are expected to be placed within feature modules or a designated `services` folder if created. Firebase SDK is present in `package.json`.

# Responsiveness Utilities
No specific responsiveness utilities (`wp`, `hp`, etc.) found. 

# Canonical Folder Placement Rules
- **Features (`src/features/*/`):** Business capabilities. **Critically**, features must *never* import out of another feature's internal tree.
- **Screens (`src/app/screens/*/`):** Represent the UI bindings to the router parameters. Keep logic thin.
- **Shared (`src/shared/*/`):** Shared Components, Hooks, and Utility logic serving more than one independent feature natively.

# Export / Barrel Conventions
Each feature directory holds a public-facing `index.ts` file which exports only modules explicitly prepared for external use. Use barrel imports where accessible.

# Theme & Color System
The app uses a dynamic MUI theme system via `src/shared/theme/createTheme.ts` and `src/shared/theme/tokens.ts`.
- **Modes:** `light`, `dark`.
- **Access Patterns:** Theme context accessed via `useThemeModeContext()`. Colors applied via MUI `ThemeProvider`.
- **Token Namespaces:** `brand`, `light`, `dark`, `semantic`. Within light/dark: `background`, `surface`, `text`, `divider`, `action`.
- **Key Tokens:** `background.default`, `background.paper`, `surface.level0`, `surface.level1`, `text.primary`, `text.secondary`.

# Typography System
- **Font Families:** `body` (Roboto, Inter, etc.), `display` (Outfit, Roboto, etc.), `arabic` (Amiri), `urdu` (Noto Nastaliq Urdu), `mono`.
- **Weight Scale:** `regular: 400`, `medium: 500`, `semibold: 600`, `bold: 700`, `black: 900`.
- **Usage:** Configured via MUI's `typography` object in `createTheme.ts` (`h1`, `h5`, `button`). Rendered using `<AppText>` which wraps `<Typography>`.

# Assets & Images
- **Directory Map:** `public/assets/`.
- **Icons:** `@mui/icons-material`, `@phosphor-icons/react`, `lucide-react` available. Centralized in `src/shared/components/icons.tsx`.
- **Images:** Precached via `vite-plugin-pwa`. 

# Component Inventory
| Category | Component | Path | Use For |
|---|---|---|---|
| **Layout** | `ScreenContainer`, `AppStack`, `AppDivider`, `AppListRow` | `src/shared/components/` | Base layout and structuring |
| **Actions** | `AppButton`, `AppIconButton`, `TapFeedback` | `src/shared/components/` | Buttons and touch targets |
| **Surfaces** | `AppCard`, `AppBottomSheet`, `AppDialog` | `src/shared/components/` | Cards, modals, and sheets |
| **Navigation** | `AppBottomTabs` | `src/shared/components/` | Bottom navigation tab bar |
| **Typography** | `AppText` | `src/shared/components/` | All text rendering |
| **Forms/Inputs**| `AppSwitch` | `src/shared/components/` | Form controls |

# Figma to Component Mapping
(No static layout components mapped from Figma specifically identified currently; rely on shared components inventory).

# Component Reuse Rules
1. Never rebuild standard UI structures like `Button` or `Card` inline. Use `AppButton` or `AppCard`.
2. Abstract components visually only if a second feature module explicitly relies on them; never implement preliminary shared abstractions.

# Forms Module
Controlled validation via `react-hook-form` coupled with Zod resolvers. 

# Session Log
- **2026-04-04:** Initial project-scan initialized. Handled scanning Vite PWA context.
- **2026-04-07:** Refreshed project scan with detailed Architecture Overview, UI primitive components (`UiCard`, `SquircleSheet`, etc.), forms architecture (`react-hook-form` + `zod`), DaisyUI hooks, and extended assets mappings.
- **2026-04-28:** Refreshed architecture reflecting current structure (MUI integration, `App`-prefixed components in `shared`, `src/app/` hierarchy).
