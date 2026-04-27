# Atoms

Atoms are the smallest building blocks of the UI.

## Rules

- **No raw HTML elements** (p, span, h1, etc.) in screens or features.
- Always use DAS atoms (Text, Button, etc.).
- Atoms must use the theme via `useTheme()`.
- Atoms must not contain business logic.

## Text Atom

The foundation of all typography.

```tsx
import { Text } from "@/design-system/atoms/Text";

<Text variant="heading">Title</Text>
<Text variant="body" color="secondary">Description</Text>
```

## Button Atom

The foundation of interaction.

- Use Button atom for all clickable actions.
- Do not use raw `<button>` in UI.
- Use variants: `primary`, `secondary`, `ghost`.
- Use `loading` state instead of manual spinners.

```tsx
import { Button } from "@/design-system/atoms/Button";

<Button onClick={() => {}}>Save</Button>
<Button variant="secondary" loading>Saving...</Button>
```
