---
name: tasbeeh-workflows-build
description: Construction playbook for the Tasbeeh PWA — new features, components, Zustand store changes, routes/pages, and service integrations (Firebase-related reads/writes). Use when adding or building a feature, component, page, route, store fields, or connecting cloud/auth/data; when the user says add, create, build, new page, new screen, add to store, connect Firebase, or expands app capabilities.
---

# Tasbeeh PWA — Build Workflows

Pick the workflow that matches the task and follow it in order.

| Situation | Section |
|-----------|---------|
| New capability / domain work | [Workflow 1: New Feature](#workflow-1-new-feature) |
| Any new React component | [Workflow 2: New Component](#workflow-2-new-component) |
| Zustand store changes | [Workflow 3: Store Modification](#workflow-3-store-modification) |
| New screen / URL | [Workflow 4: New Page / Route](#workflow-4-new-page--route) |
| Auth, Firestore, Remote Config, Analytics | [Workflow 5: Firebase & Services](#workflow-5-firebase--services) |

---

## Workflow 1: New Feature

**When:** Adding something that does not exist yet — a section, capability, or integration.

**1. Clarify scope (before code)**

Ask **one** question that exposes the core decision, for example:

- Should this persist across sessions or reset on app close?
- Does this need to work offline?
- What should happen when [edge case]?

One question. If the answer opens more gaps, ask **one** more. Move fast.

**2. State the plan in 3–5 lines**

```
Adding [feature] to features/[domain]/
- New component: [name] in features/[domain]/components/
- Store change: adding [fields] to [store].ts
- New hook: use[Name] for [purpose]
- Page integration: composing in pages/[Page].tsx
```

Wait for confirmation. If the user says go or does not object, proceed.

**3. Build order**

1. Types — data shape in `types.ts`
2. Store — fields and actions in the Zustand store (if needed)
3. Hook — fetching or non-trivial logic
4. Component — UI wired to hook/store
5. Page — compose into the route
6. Animation — Framer Motion **last**, after behavior is correct

Do not build UI first and infer state later.

**4. Verify**

- Feature does not break the counter flow if both are active
- Works offline where required
- All three themes: default, dark, pineGreen
- Motion is calm, not flashy

---

## Workflow 2: New Component

**When:** Creating any new React component.

**1. Placement**

- One feature only → `features/[domain]/components/`
- Multiple features → `shared/components/`
- Full-screen route shell → `pages/` (keep thin; logic stays in features)

**2. Shape**

```typescript
import { motion } from "framer-motion";
import styles from "./ComponentName.module.css"; // or "./ComponentName.css" to match neighbors

interface ComponentNameProps {
  // typed; optional props only when truly optional
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // hooks
  // derived values
  // handlers
  return <div className={styles.root}>...</div>;
}
```

**3. Rules**

- File: `ComponentName.tsx` (PascalCase; default export name matches)
- Styles: co-located `ComponentName.css` or `ComponentName.module.css` — match existing files in the same folder
- One component per file

**4. Before finishing**

- Single responsibility
- No hardcoded colors — CSS variables / theme tokens
- Empty / loading / error states where relevant
- Tap targets and contrast (accessibility)

---

## Workflow 3: Store Modification

**When:** Changing a Zustand store — fields, actions, or logic.

**1. State the change**

What fields and actions change; which selectors or shapes might break.

**2. Blast radius**

Search for consumers of this store. List files and which slices they read:

```
Components using tasbeehStore:
- Home (count, currentIndex, target)
- ProgressRing (count, target)
```

If a field’s **shape** changes, update every consumer.

**3. Edit the store**

- Extend the state interface
- Add or adjust actions
- Update `persist` / partialize if new fields must survive reloads
- Keep actions **pure**: no `navigate()`, no raw API calls in the store

**4. Consumers**

Use granular selectors: `(s) => s.field`. Avoid subscribing to the whole store.

**5. Persistence**

Change state → reload app → confirm values survived. Errors in persist config can **silently** drop user data.

---

## Workflow 4: New Page / Route

**When:** Adding a screen the user navigates to.

**1. Page**

Add under `pages/` (file or folder pattern — follow neighbors). Page stays **thin**: compose features, read params, layout only.

**2. Route**

Register in `src/app/router.tsx`. Lazy-load screens that are not needed for first paint:

```typescript
const NewPage = lazy(() => import("../pages/NewPage"));
```

**3. Navigation**

- App-wide nav → `AppLayout` / `BottomNav` as appropriate
- From another screen → link or button there
- Use React Router (`useNavigate`, `<Link>`), **not** store actions for navigation

**4. Verify**

- Direct URL / refresh works (PWA bookmarks)
- Back behavior is correct
- Transitions feel smooth
- Critical content behaves offline if required

---

## Workflow 5: Firebase & Services

**When:** Adding or changing auth, Firestore, Remote Config, Analytics, Crashlytics, or other remote layers.

**1. Service layer first**

No raw `firebase/*` imports in features or pages. Extend the right **existing** module under `src/services/`:

| Concern | In this codebase (typical) |
|--------|----------------------------|
| Auth | `services/auth/` |
| Firestore / Firebase app | `services/firebase/` |
| Remote Config | `services/remoteConfig/` |
| Analytics | `services/analytics/` |
| Crashlytics | `services/crashlytics/` |
| React Query defaults | `services/queryClient.ts` |

**2. Typed surface**

Expose small typed functions; features call those, not SDK types scattered in UI.

```typescript
export async function saveTasbeehProgress(
  userId: string,
  data: TasbeehProgress,
): Promise<void> {
  // implementation isolated here
}
```

**3. React Query for reads**

```typescript
export function useSyncedProgress(userId: string) {
  return useQuery({
    queryKey: ["tasbeehProgress", userId],
    queryFn: () => getTasbeehProgress(userId),
    staleTime: 1000 * 60 * 5,
    networkMode: "offlineFirst",
  });
}
```

**4. Offline fallback**

Reads should degrade: Firestore → local Zustand or cache; Remote Config → defaults in code; auth-aware flows should not brick offline core flows.

**5. Errors**

Report to Crashlytics where appropriate. User-facing copy stays calm; no raw stack traces in the UI.
