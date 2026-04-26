---
generated: false
lastUpdated: "2026-04-26"
source:
  hook: "src/shared/design-system/hooks/useTheme.ts"
  tokens: "src/shared/styles/global.css"
  loader: "index.html"
---

# Theme System — `useTheme`

This document describes the **robust theme architecture**, **persistence logic**, and the **expanded semantic tokens** of the Divine Atomic System (DAS).

The system is designed to be **zero-flicker** and **state-persistent**.

## Core Mechanisms

### 1. Persistence & State
The `useTheme` hook manages the active theme state and persists it to `localStorage` under the key `tasbeeh-app-theme`.

### 2. Flicker Prevention (Zero-Flicker)
To prevent the "light-mode flash" on reload, a blocking `<script>` is injected into the `<head>` of `index.html`. This script reads `localStorage` and applies the `data-theme` attribute before the browser renders the first pixel.

### 3. Theme Variants
- `light`: Default spiritual cream theme.
- `dark`: High-contrast focused dark theme.
- `pineGreen`: Deep emerald meditative theme.

## Where Colors Live
All colors are defined as CSS variables in `src/shared/styles/global.css`. 
The system uses `data-theme="..."` attributes on the root `<html>` element.

**Tailwind Compatibility:**
The `.dark` class is appended to the root **only** when the theme is `dark`. This allows standard Tailwind `dark:` variants to function alongside our custom DAS tokens.

## Token Architecture (DAS V2)

The system is now fully "Borderness-free", relying on background shifts and semantic tokens for state.

### 1. Core Primitives
| Token | Meaning | Usage |
|---|---|---|
| `--ds-bg-page` | Main background | Required: `#F6EDDD` (Light), `#1C1E21` (Dark) |
| `--ds-bg-surface` | Elevated surface | For cards, containers, and groups. |
| `--ds-bg-input` | Field background | Standard background for all text inputs. |
| `--ds-text-main` | Primary text | High contrast text for headings and body. |
| `--ds-text-subtle` | Secondary text | De-emphasized text for captions and meta. |
| `--ds-primary` | Brand color | The main accent color (Purple in Light/Dark). |
| `--ds-border` | Subtle divider | For `Divider` atoms. Not for interactive rings. |

### 2. Interaction & Feedback (New)
These tokens drive the "No Border" interactive states.

| Token | Meaning | Visual Feedback |
|---|---|---|
| `--ds-surface-hover` | Subtle hover | Applied to interactive surfaces on mouse-over. |
| `--ds-surface-active` | Press/Tap | Deepening/lightening when a component is pressed. |
| `--ds-success` | Success state | Status indicators, success badges. |
| `--ds-error` | Error state | Invalid input backgrounds, error alerts. |
| `--ds-warning` | Warning state | Pending actions, warnings. |

## Implementation Status

- [x] **Persistence**: `localStorage` integration complete.
- [x] **Flash Prevention**: `index.html` blocking script complete.
- [x] **Expanded Tokens**: Hover/Active and Semantic states live in `global.css`.
- [x] **"No Border" Compliance**: Inputs and Buttons migrated to background-based states.

## Theme Token Tables

### `light` (Spiritual Cream)
| Token | Value |
|---|---|
| `--ds-bg-page` | `#F6EDDD` |
| `--ds-bg-surface` | `#FFFFFF` |
| `--ds-text-main` | `#2C2C2C` |
| `--ds-border` | `rgba(44, 44, 44, 0.08)` |
| `--ds-error` | `#EF4444` |

### `dark` (Focused Midnight)
| Token | Value |
|---|---|
| `--ds-bg-page` | `#1C1E21` |
| `--ds-bg-surface` | `#111214` |
| `--ds-text-main` | `#EDEDED` |
| `--ds-border` | `rgba(237, 237, 237, 0.08)` |
| `--ds-error` | `#F87171` |

### `pineGreen` (Meditative Emerald)
| Token | Value |
|---|---|
| `--ds-bg-page` | `#0D2B22` |
| `--ds-bg-surface` | `#133D31` |
| `--ds-text-main` | `#E6F0ED` |
| `--ds-border` | `rgba(230, 240, 237, 0.08)` |
| `--ds-primary` | `#10B981` |

## Usage Rules for Developers

1. **Never use `border-`** for focus or error states. Use background color shifts (e.g., `bg-red-500/10` or `--ds-error`).
2. **Use `data-theme` for CSS**: Target themes via `[data-theme="dark"] .my-class`.
3. **Use `.dark` for Tailwind**: Standard `dark:bg-black` will work fine.
4. **Transition Everything**: Always add `transition-colors duration-300` to main layout containers to ensure smooth theme swapping.
