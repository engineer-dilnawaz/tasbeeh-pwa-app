# Molecules

Molecules are combinations of atoms forming UI blocks.

## Rules

- **Use atoms only** (Text, Button, etc.) for content.
- No raw HTML typography or buttons inside molecules.
- No business logic; molecules should be purely representational.
- Focus on layout, spacing, and composition.

## Card Molecule

A reusable container for grouping related information.

```tsx
import { Card } from "@/design-system/molecules/Card";
import { Text } from "@/design-system/atoms/Text";

<Card padding="lg">
  <Text variant="heading">Title</Text>
  <Text variant="body">Content goes here.</Text>
</Card>
```
