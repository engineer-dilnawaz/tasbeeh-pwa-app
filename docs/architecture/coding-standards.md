# Coding Standards

This project enforces strict import and TypeScript usage rules to maintain consistency, improve performance, and avoid common linting issues.

---

## 1. React Import Rule (STRICT)

The React 17+ JSX transform makes importing the React namespace obsolete for JSX.

### ❌ Forbidden
```ts
import React from "react"

React.useState()
React.useEffect()
```

### ✅ Required
```ts
import { useState, useEffect } from "react"
```
Always use named imports for hooks directly.

---

## 2. TypeScript Import Rule (STRICT)

To prevent runtime overhead and clarify intent, always use type-only imports for TypeScript interfaces and types.

### ❌ Forbidden
```ts
import { ButtonProps } from "./Button.types"
```

### ✅ Required
```ts
import type { ButtonProps } from "./Button.types"
```

---

## 3. Component Structure Rule

Follow the human-crafted component structure:
1.  **Imports** (Libraries first, then internal, then styles/types).
2.  **Type Definitions** (if not imported).
3.  **Hooks** (useState, useEffect, custom hooks).
4.  **Derived Values/Computations**.
5.  **Event Handlers**.
6.  **JSX Return**.
7.  **Shadow Rule (STRICT)**: Never use `box-shadow`, `drop-shadow`, or `text-shadow` in styles.

---

## Why This Matters
- **Cleaner Code**: Reduces noise and repetitive namespace usage.
- **Optimization**: Improves tree-shaking and reduces bundle size via type-only imports.
- **Consistency**: Ensures the AI agent and the developer speak the same architectural language.
