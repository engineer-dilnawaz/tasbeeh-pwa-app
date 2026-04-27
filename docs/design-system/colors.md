# Color System

This project uses a token-based color system (Divine Atomic System).

## Structure

- **palette** → raw colors (defined in `src/design-system/tokens/colors.ts`)
- **semantic tokens** → used in UI (CSS variables in `global.css`)

## Rules

- Never use palette directly in components.
- Always use semantic CSS tokens (`--ds-*`) or Tailwind utility classes that map to them.
- Colors must support theming (light, dark, pineGreen).

## Example

✅ Correct:
```tsx
<div className="bg-ds-bg-page" />
```

❌ Wrong:
```tsx
<div style={{ backgroundColor: '#F6EDDD' }} />
```
