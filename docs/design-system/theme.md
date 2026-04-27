# Theme System

## Purpose

Centralized control of colors and typography.

## Rules

- **Never** import tokens directly in components (e.g., `import { lightColors } ...` ❌).
- **Always** use the `useTheme()` hook to access theme values.
- Theme must support light and dark modes.

## Example

```tsx
const { theme } = useTheme();

return (
  <div style={{ background: theme.colors.background }}>
    <Text style={{ fontSize: theme.typography.fontSize.md }}>
      Hello World
    </Text>
  </div>
);
```

## Goal

Ensure the entire application is theme-aware and consistent without manual token management in UI components.
