---
name: project-scan
description: Scans the codebase and writes or refreshes a single consolidated app-context markdown file (architecture, tooling, theme, typography, assets, component inventory, reuse rules). Use when the user asks for a project scan, app context file, architecture inventory, codebase map, or onboarding snapshot for AI-assisted work; after major routing, state, theme, or folder-structure changes; or once after the src layout is stable.
---

# Project Scan

## Goal

Produce **one** markdown file that captures **current, factual** project context (tree, configs, tokens, inventory) so agents do not re-derive it from scratch. This is a **generated snapshot**. It complements hand-authored Cursor rules (`.cursor/rules/*.mdc`); it does not replace architecture philosophy there.

## Output

- **Path:** `.agents/context/app-context.md`
- **Create** `.agents/context/` if it does not exist.
- **Single file only** — do not split colors, typography, or assets into separate rule files unless the repo already mandates that layout.

Optional frontmatter:

```yaml
---
generated: true
lastScanned: "YYYY-MM-DD"
---
```

## When to run

- Run **once** after `src/` layout and tooling are stable.
- **Rerun** after major changes: router structure, providers, state layer, theme/token system, Firebase/service boundaries, large moves of shared UI.
- **Skip** reruns for small screen-only tweaks, copy edits, or one-off bugfixes.

## Refresh rules

If `.agents/context/app-context.md` already exists:

1. Copy or retain the entire **`## Session log`** section verbatim (user append-only notes).
2. Replace **all other sections** with freshly gathered content.

If the file is new, include an empty session log scaffold:

```markdown
## Session log

<!-- Append manual notes here; preserved when project-scan refreshes. -->
```

## Procedure

### 1 — Project metadata

Read `package.json`, Vite config (`vite.config.ts` / `.mts`), and TypeScript config (`tsconfig.app.json` or the file that defines `compilerOptions.paths`).

Extract: package name, React / Vite / TypeScript versions, scripts that matter (`dev`, `build`, PWA, icons), and **path aliases** (e.g. `@/*` → `./src/*`).

List **key dependencies** by role: routing, UI, animation, state (local vs server), backend SDKs, PWA.

### 2 — Architecture map

Summarize `src/` (depth ~3): typical zones include `app/` (router, layout, providers), `pages/`, `features/`, `services/`, `shared/`, `assets/`.

Document:

- **Entry:** `main.tsx`, root component wiring.
- **Router:** file(s) defining routes, lazy-loaded pages if any.
- **Shell:** provider order, persistent layout (nav, theme).
- **State:** where domain lives (e.g. Zustand per feature), where server cache lives (e.g. React Query) — and that these layers stay separate.
- **Services:** external integrations; components/features consume **only** through `services/` (or the project’s documented bridge), not raw SDK calls scattered in UI.
- **Boundaries:** e.g. features do not import other features’ internals; pages compose.

### 3 — Theme and color system

Scan theme-related dirs (e.g. `shared/theme/`, `shared/lib/theme.ts`, global CSS).

Capture: named themes/modes, how the active theme is applied (CSS variables on `:root`, `data-theme`, class on `html`, etc.), palette modules, helpers for reading or injecting tokens.

**Output style:** compact tables for **semantic** roles (background, text, accent) per theme — not every literal. Point to source files for exhaustive token lists.

### 4 — Typography and spacing

From global styles and any token/constants files: font families, scale, heading/body patterns, spacing rhythm if defined.

### 5 — Assets

Map `public/` and `src/assets/` (images, lottie, fonts). Note icon strategy (e.g. SVG components, Lucide). Mention asset-related npm scripts if present.

### 6 — Responsiveness and layout

If the project has utilities (e.g. `shared/utils/responsiveness.ts`), document breakpoints/helpers and when to prefer them vs CSS.

### 7 — PWA and offline (if applicable)

Note PWA plugin, service worker entry, and what must work offline (persisted client state, cached queries).

### 8 — Component inventory

Recursively scan:

- `shared/components/`
- `features/*/components/` (when present)

Build grouped tables: `| Component | Path | Role / key props |`.

### 9 — Reuse rules for codegen

Short **mandatory** bullets: reuse shared components first; use theme tokens/CSS variables; respect module boundaries; no one-off hex colors if the project forbids them.

### 10 — Section order in `app-context.md`

Use this order unless the repo already locks a different contract:

1. Project metadata (name, versions, key deps, aliases)
2. Architecture overview (directory tree summary)
3. Router, providers, layout
4. State and data-fetching patterns
5. Services and external integrations
6. Theme and color system
7. Typography and spacing
8. Assets
9. Responsiveness / layout utilities
10. Folder and export conventions
11. Component inventory (grouped)
12. Codegen / reuse rules
13. Session log

### 11 — Completion report

After writing, state:

- Output path and whether the file was created or refreshed
- Project name and primary framework versions
- Approximate counts (e.g. features, shared components)
- Confirmation that **Session log** was preserved (when applicable)

## Reference: Tasbeeh PWA (this repo)

Default expectations: React 19, Vite, React Router v7, Zustand, TanStack Query, Firebase via `services/`, Framer Motion, `vite-plugin-pwa`, CSS variables and `shared/theme/` for palettes. High-level layout rules live in `.cursor/rules/tasbeeh-architecture.mdc` — **summarize** them in `app-context.md`, do not duplicate the full rule files verbatim.

## Reference: other stacks

If the repository is **React Native** or uses different folder names, adapt paths (e.g. `navigation/`, `modules/`) while keeping the **single output file** and **session log preservation** behavior. An alternate checklist may exist at `.agents/workflows/project-scan.md`; use it only when it matches the actual stack.
