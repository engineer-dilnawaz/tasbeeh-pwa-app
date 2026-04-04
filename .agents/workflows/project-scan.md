---
description:
---

---

name: project-scan
description: >
Scan React project and write/update a single
.claude/rules/app-context/app-context.rules.md file containing all
architecture, theme, typography, assets, and component inventory context. Run
once after architecture setup, then rerun after major changes.

---

# Skill: project-scan

Scan the project and write a single consolidated instruction file to
`.claude/rules/app-context/app-context.rules.md`.

## Output File

**Single file:** `app-context.rules.md` — contains ALL context:

- Architecture, path aliases, provider stack, navigation, state, API
- Theme/color token system (modes, namespaces, key tokens, access patterns)
- Typography system (font families, ETextVariant reference, font mapping)
- Assets & images (directory map, icon components, image usage rules)
- Component inventory & Figma mapping
- Responsiveness utilities, folder placement, barrel conventions

**No separate files** for colors, typography, or images — everything goes in one
file to minimize token overhead during generation.

Static instruction files used by generation:

- `react-native-rules.rules.md`

## Inputs

- `workspace_path` — project root
- `output_dir` — `{workspace_path}/.claude/rules/app-context/`

## Run Frequency

- Run once after architecture is stable.
- Rerun only after major architecture/theme/component-system changes.
- Do not rerun for small screen-only changes.

## Step 1 — Project Metadata

- Read `package.json`, `tsconfig.json`, `app.json` (or app config variants)
- Extract framework/version, dependencies, aliases, navigation/state/styling
  stack

## Step 2 — Discover Architecture

- Map `src/` directory structure (app, modules, shared, core, assets)
- Extract path aliases from `tsconfig.json`
- Document provider stack from `src/app/Provider/`
- Document navigation structure from `src/app/navigation/`
- Document state management pattern (Redux Toolkit hooks/slices)
- Document API layer pattern

## Step 3 — Discover Color & Theme System

- Scan theme color files under `src/shared/theme/`
- Capture light/dark/highContrast tokens
- Document theme modes and constants
- Document color access patterns (`useThemeContext()`, `Colors[theme]`)
- Capture token namespaces (root, custom, tags, input, border, etc.)
- Capture key token values for light/dark reference
- Document color rules for generation

**Output format:** Concise tables and inline code. Include token namespace
summary table and key token reference table (light vs dark values). Do NOT dump
every single token — include only the commonly used ones. For the full list,
reference the source file path so it can be read with offset/limit when needed.

## Step 4 — Discover Typography System

- Scan `src/shared/theme/typography/` for font families, weights, scales
- Scan `src/shared/components/Text/text.types.ts` for `ETextVariant` enum
- Document font family constants
- Document all `ETextVariant` values with their sizes

**Output format:** Compact inline format grouped by category (Gazpacho, Gilroy
Headings, Gilroy Paragraphs, Gilroy Buttons, Gilroy Tags). Use single lines per
group, not full tables — e.g.:
`**Gazpacho:** GAZPACHO_A1 fp(52) | GAZPACHO_H1 fp(38) | ...`

Include Figma-to-variant mapping table for common text styles.

## Step 5 — Discover Assets System

- Scan `src/assets/` and related index files
- Document icon components (names, props)
- Document static images map
- Document placeholder and animation exports
- Document image rendering components from shared components

**Output format:** Compact directory tree + usage rules list. No verbose
examples — just import paths and brief rules.

## Step 6 — Discover Spacing & Responsiveness

- Scan `@utils/responsiveness` for utility functions
- Document `wp`/`hp`/`fp`/`wpct`/`hpct` with baseline values
- Document usage rules

## Step 7 — Project Structure Rules

- Document canonical folder placement rules
- Document file splitting rules for generation
- Document barrel export conventions

## Step 8 — Component Inventory (CRITICAL for figma-to-code)

### 8.1 — Scan Shared Components

Scan `src/shared/components/` recursively. For each component extract:

- Component name, full path, key props, visual category, purpose

### 8.2 — Scan Module Components

Scan `src/modules/*/components/` for module-specific reusables.

### 8.3 — Create Component Lookup Table

Group by visual category (Text, Buttons, Inputs, Modals, Images, etc.) in table
format: `| Component | Path | Props | Use For |`

### 8.4 — Create Figma Element Mapping

Generate mapping table:
`| Figma Element Type | Look For | Use Component | Import |`

### 8.5 — Reuse Rules Section

Add mandatory reuse rules with match thresholds and never-recreate list.

## Step 9 — Preserve Session Logs

If output file already exists:

- Preserve `Session Log` section
- Regenerate all other sections with latest architecture

## Step 10 — Write Single Output File

Write/update: `.claude/rules/app-context/app-context.rules.md`

The file must include frontmatter:

```yaml
---
applyTo: "**/*.tsx,**/*.ts"
---
```

**Section order in file:**

1. Project metadata (name, RN version, source files, last scanned date)
2. Architecture overview (directory tree)
3. Path aliases table
4. Provider stack
5. Navigation
6. State management
7. API layer
8. Responsiveness utilities
9. Canonical folder placement rules
10. Export / barrel conventions
11. Theme & Color System (modes, access patterns, token namespaces, key tokens,
    rules)
12. Typography System (font families, Text component, ETextVariant reference,
    font mapping, rules)
13. Assets & Images (directory map, icon components, image usage rules)
14. Component Inventory (grouped tables)
15. Figma to Component Mapping
16. Component Reuse Rules (MANDATORY)
17. Forms Module (if applicable)
18. Session Log

**Clean up old files:** If separate `app-colors.rules.md`,
`app-typography.rules.md`, or `app-images.rules.md` files exist, delete them
after merging their content into the single file.

## Step 11 — Handoff Contract to figma-to-code

`figma-to-code` treats this single file as source of truth for:

- Architecture and placement
- Tokens and theme usage
- Typography and assets
- Component reuse conventions

## Output Contract

After completion, output:

- File created/updated
- Project name + RN version
- Module/component counts (approx)
- Whether context was created or refreshed
- Whether old separate files were cleaned up
