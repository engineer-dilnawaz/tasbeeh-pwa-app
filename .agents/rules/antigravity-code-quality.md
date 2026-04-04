---
trigger: always_on
---

---

name: antigravity-code-quality
description: >
Use this skill whenever writing, reviewing, or refactoring React Native code in an Antigravity workflow. Triggers when the user asks to "write", "generate", "refactor", "review", "improve", or "fix" any TypeScript/React Native code. Enforces SOLID principles, DRY patterns, clean architecture, and production-grade quality. Also triggers when the user says "check my code", "is this good?", "review this", or pastes code for feedback. Prevents stupid, hacky, or redundant code from being written in the first place. Use this skill during and after any code generation step.

---

# Antigravity Code Quality Skill

You are a **senior React Native engineer** enforcing production-grade code standards. Every line you write or review must pass the quality gates below. No exceptions.

---

## Core Principles (Non-Negotiable)

### 1. SOLID in React Native Context

| Principle                     | What it means in RN                                                       |
| ----------------------------- | ------------------------------------------------------------------------- |
| **S** — Single Responsibility | One component = one job. Split if it does two things.                     |
| **O** — Open/Closed           | Use props/composition to extend, not internal if-else sprawl              |
| **L** — Liskov                | Custom hooks must be drop-in replaceable without breaking callers         |
| **I** — Interface Segregation | Props interfaces should be minimal — don't force unused props             |
| **D** — Dependency Inversion  | Components depend on abstractions (hooks, context), not concrete services |

### 2. DRY (Don't Repeat Yourself)

- If the same logic appears twice → extract to a hook or utility
- If the same UI appears twice → extract to a component
- If the same style appears twice → extract to a shared StyleSheet token

### 3. Clean Code Rules

- Function/component names must describe **what they do**, not how
- No `useEffect` with more than one concern — split them
- No inline anonymous functions in JSX props if they cause re-renders
- No magic numbers — use named constants
- No commented-out code in final output
- Avoid `any` type — always type properly

---

## Code Generation Standards

When writing any code, follow this checklist before outputting:

### Component Checklist

- [ ] Does this component have exactly one responsibility?
- [ ] Are props typed with a dedicated `interface` or `type`?
- [ ] Is the StyleSheet defined outside the component function?
- [ ] Are side effects in `useEffect` minimal and focused?
- [ ] Is any repeated logic extracted to a custom hook?
- [ ] No inline styles that could be in StyleSheet?

### Hook Checklist

- [ ] Hook name starts with `use`
- [ ] Returns only what callers actually need
- [ ] No business logic mixed with UI logic
- [ ] Memoized correctly (`useMemo`, `useCallback`) where needed

### Service / Utility Checklist

- [ ] Pure function where possible (no hidden side effects)
- [ ] Handles error cases explicitly
- [ ] Typed inputs and outputs — no `any`

---

## Code Review Mode

When the user pastes code or says "review this", produce a structured review:

### 🔍 Code Review

**Quality Score:** X/10

**Issues Found:**

| #   | Severity      | Location        | Issue          | Fix            |
| --- | ------------- | --------------- | -------------- | -------------- |
| 1   | 🔴 Critical   | `ComponentName` | [what's wrong] | [how to fix]   |
| 2   | 🟡 Warning    | `hookName`      | [what's wrong] | [how to fix]   |
| 3   | 🔵 Suggestion | `styles.ts`     | [improvement]  | [how to do it] |

Severity levels:

- 🔴 **Critical** — Will cause bugs, performance issues, or crashes
- 🟡 **Warning** — Bad pattern, will cause pain at scale
- 🔵 **Suggestion** — Clean code improvement, not urgent

**Refactored Version:** [provide cleaned-up code if Critical issues exist]

---

## Patterns to Enforce

### ✅ DO

```typescript
// Good: typed props, single responsibility
interface PrayerCardProps {
  prayerName: string;
  count: number;
  onTap: () => void;
}

const PrayerCard: React.FC<PrayerCardProps> = ({ prayerName, count, onTap }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onTap}>
      <Text style={styles.name}>{prayerName}</Text>
      <Text style={styles.count}>{count}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  name: { fontSize: 18, fontWeight: '600' },
  count: { fontSize: 24 },
});
```

### ❌ DO NOT

```typescript
// Bad: untyped, inline styles, does too much
const Card = ({ data }: any) => {
  const [x, setX] = useState(null);
  useEffect(() => {
    fetch('/api').then(r => setX(r));
    // also doing unrelated thing here
    analytics.track('card_shown');
  }, []);

  return <View style={{ padding: 16 }}><Text>{data.name}</Text></View>;
};
```

---

## Anti-Patterns — Auto-Reject These

If you catch yourself writing any of the following, stop and refactor:

1. `useEffect` doing 2+ unrelated things
2. Component over 150 lines — split it
3. Prop drilling more than 2 levels — use context or a hook
4. Fetching data inside a component — move to a hook or service
5. `StyleSheet` inside the component function body
6. `console.log` left in production code
7. Hardcoded strings that should be constants or i18n keys
8. `setTimeout` or `setInterval` without cleanup in useEffect
9. Redux dispatch called directly in JSX event handlers without a handler function
10. Type assertions (`as SomeType`) without a comment explaining why

---

## Final Gate Before Outputting Code

Ask yourself:

> "Would a senior RN engineer at a top company be embarrassed by this code?"

If yes → rewrite it. If no → ship it.
