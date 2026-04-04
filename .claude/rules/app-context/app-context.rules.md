---
applyTo: "**/*.tsx,**/*.ts"
---

# App Context: Tasbeeh PWA

## 1. Project Metadata
- **Name:** Tasbeeh App
- **Frameworks:** React 19, Vite, TypeScript
- **State Management:** Zustand, React Query
- **Styling:** CSS variables (`global.css`, `*.module.css`)
- **Animations:** Framer Motion
- **Backend:** Firebase (Auth, Firestore, Crashlytics, Remote Config)
- **Last Scanned:** 2026-04-04

## 2. Architecture Overview
```text
src/
├── app/          # App shell, providers, layout, router
├── assets/       # Lottie files, images
├── features/     # Domain-driven feature modules (tasbeeh, customTasbeeh, settings, stats)
├── pages/        # Route-level components mapped by the router
├── pwa/          # Service worker registration
├── services/     # External integrations (Firebase, Analytics, Crashlytics, React Query)
└── shared/       # Cross-cutting concerns (hooks, components, theme configuration, constants)
```

## 3. Path Aliases
| Alias | Path |
|-------|------|
| `@/*` | `./src/*` |

## 4. Provider Stack
Managed via `src/app/providers.tsx`.
- `AuthProvider`: Firebase authentication wrapper
- `QueryClientProvider`: React query cache management
- `RemoteConfigProvider`: Firebase Remote config integration

## 5. Navigation
Handled via `React Router v7` in `src/app/router.tsx`.
- Flat route structure pointing to `src/pages/*.tsx`.
- Protected/shared layouts use `src/app/layout/AppLayout.tsx` (which renders `BottomNav.tsx`).

## 6. State Management
- **Local Application State:** Zustand (e.g., `features/tasbeeh/store/tasbeehStore.ts`), using `persist` with `createJSONStorage(() => localStorage)`.
- **Server State:** `@tanstack/react-query` for API fetching (e.g. Asma-ul-Husna).

## 7. API Layer
- **No Direct Fetch:** Use custom React Query hooks (e.g. `useTasbeehQuery`, `useAsmaUlHusna`).
- **External Calls:** Configured via `axios` and native `fetch` in `src/features/tasbeeh/api/client.ts`.
- **Firebase Calls:** Handled entirely within `src/services/firebase/`.

## 8. Responsiveness Utilities
- Responsive design focuses heavily on fluid CSS layouts rather than JS utilities.
- Standard media queries used within standard `.css` modules and CSS variables.

## 9. Canonical Folder Placement Rules
- **Pages:** Go into `src/pages/`. Only include routing/layout wrapper logic here, not business logic.
- **Business Logic/Components:** Go into `src/features/[feature-name]/`.
- **Reusable UI Components:** Go into `src/shared/components/`.
- **Services:** All Firebase integrations must be wrapped in `src/services/`.

## 10. Export / Barrel Conventions
- Standard domain-driven index files: `src/features/[feature-name]/index.ts` expose the public API of a feature to other domains or pages.

## 11. Theme & Color System
**Modes:** `dark`, `light`, `pineGreen`.
**Implementation:** Standard CSS Custom Properties driven by data-attributes (`data-theme="dark"`).
**Theme Access Pattern:** `var(--color-name)` inside CSS styles. Managed by `src/shared/theme/index.ts`.

| Namespace / Variables | Light Mode Equivalent | Dark Mode Equivalent |
|----------------|-----------------|----------------|
| `--bg-primary` | `#f6f2e7` | `#0e1d1a` |
| `--card-bg` | `#ffffff` | `#152b26` |
| `--accent` | `#234840` | `#ddeb70` |
| `--text-primary` | `#161616` | `#f0f0f0` |

*Refer to `src/shared/styles/global.css` and `src/shared/theme/dark/colors.ts` for full palettes.*

## 12. Typography System
Fonts are implemented natively in CSS via generic fallbacks and Google web fonts.

- **Primary Interface:** `"Plus Jakarta Sans", system-ui, -apple-system, sans-serif`
- **Arabic Text:** `"Amiri", serif` (Used heavily for Ayaat and Asma-ul-Husna)
- **Urdu Text:** `"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", "Geeza Pro", serif`

*Typography rules state to use raw semantic classes like `.tasbeeh-arabic` and `.tasbeeh-urdu` mapped in globally.*

## 13. Assets & Images
- Vector assets and icons from `lucide-react`.
- Static images in `/public/` (manifest.json, maskable icons).
- Animations inside `src/assets/lottie/`.

## 14. Component Inventory
| Component | Path | Use For |
|---|---|---|
| `SquircleCard` | `src/shared/components/SquircleCard.tsx` | Standard squircle bordered cards holding content. |
| `ProgressRing` | `src/features/tasbeeh/components/ProgressRing.tsx` | Displaying the circular SVG progress around the counter. |
| `BottomNav` | `src/app/layout/BottomNav.tsx` | App mobile navigation. |

## 15. Figma to Component Mapping
N/A. Codebase is driven by iterative UI engineering (Tailwind/CSS concepts) rather than direct 1:1 Figma components.

## 16. Component Reuse Rules (MANDATORY)
- **SquircleCard:** Never build a custom card `div` with corner-radius and borders from scratch, always use `SquircleCard`.
- **Forms:** Prefer functional hooks before building forms. Never place data logic within the UI component directly.

## 17. Forms Module
N/A. Pure interaction app. Built primarily using state toggles rather than textual input forms.

## 18. Session Log
- Created base context mapping project structure, themes, and logic paths on **2026-04-04**.
