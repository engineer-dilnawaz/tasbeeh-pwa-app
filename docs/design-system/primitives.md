# Primitives

Primitives are low-level UI building blocks that enforce foundational visual rules.

## Shape System Rules (STRICT)

To ensure "Apple-style" organic corners and prevent visual leakage:

### Forbidden ❌
- `borderRadius` (never use directly)
- `border` (never use for container edges)
- `outline` styling for defining shapes

### Required ✅
- **All containers** must use the Squircle primitive.
- **Overflow: hidden** is mandatory on all Squircles to ensure clipping.

---

## Elevation & Shadow Rules (STRICT)

This system is built on a "No Shadow" philosophy to ensure maximum clarity and theme consistency.

### ❌ Forbidden
- `box-shadow` ❌
- `drop-shadow` ❌
- `text-shadow` ❌ (unless explicitly allowed in future typography system)
- Simulating elevation with shadows.

### ✅ Allowed Alternative
- **Semantic Surface Layering**: Use background contrast (e.g., surface vs background color).
- **Spacing**: Use whitespace to define grouping and hierarchy.
- **Elevation Tokens**: (Future Phase) Controlled tokens for specific state-based depth.

## Squircle Primitive

| Component | Radius | Smoothing |
| --------- | ------ | --------- |
| Button    | 12     | 0.9       |
| Card      | 16     | 0.9       |

### Usage

```tsx
import { Squircle } from "@/design-system/primitives/Squircle";

<Squircle radius={16} smoothing={0.9} style={{ background: theme.colors.surface }}>
  Content
</Squircle>
```
