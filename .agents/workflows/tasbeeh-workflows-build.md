---
description:
---

---

name: tasbeeh-workflows-build
description: >
Build workflows for the Tasbeeh PWA — covers creating new features, components, pages, store changes, and Firebase integrations. Use this skill EVERY TIME you start building something new: a feature, component, page, route, store modification, or Firebase integration. Trigger on: "add a feature", "create a component", "build this", "I want to add", "can you make", "new page", "add to store", "connect Firebase", "add a screen", any request that involves creating new code or expanding the app's capabilities. This is the construction playbook — follow it step by step.

---

# Tasbeeh PWA — Build Workflows

Standard procedures for creating new things. Pick the right workflow, follow the steps.

---

## Workflow 1: New Feature

Use when: adding something that doesn't exist yet — a new section, capability, or integration.

**1. Clarify scope (before touching code)**
Ask exactly one question that exposes the core decision:

- "Should this persist across sessions or reset on app close?"
- "Does this need to work offline?"
- "What should happen when [edge case]?"

One question. If the answer reveals more gaps, ask one more. Move fast.

**2. State the plan in 3-5 lines**

```
Adding [feature] to features/[domain]/
- New component: [name] in features/[domain]/components/
- Store change: adding [fields] to [store].ts
- New hook: use[Name] for [purpose]
- Page integration: composing in pages/[Page].tsx
```

Wait for thumbs up. If Dilnawaz says "go" or doesn't object, proceed.

**3. Build in this order**

1. Types first — define the data shape in `types.ts`
2. Store/state — add fields and actions to the Zustand store
3. Hook — if there's fetching or complex logic, write the hook
4. Component — build the UI, wire to hook/store
5. Page integration — compose into the route
6. Animation — add motion last, after the feature works

Each layer depends on the one before it. Don't build UI first and figure out state later.

**4. Verify**

- Does the feature work with the counter still running?
- Does it work offline?
- Does it work in all 3 themes? (dark, default, pineGreen)
- Is the animation calm, not flashy?

---

## Workflow 2: New Component

Use when: creating any new React component.

**1. Decide where it lives**

- Used by one feature → `features/[domain]/components/`
- Used across features → `shared/components/`
- Full-screen route → `pages/`

**2. Create with this structure**

```typescript
import { motion } from "framer-motion";
import { useTasbeehStore } from "../tasbeehStore";
import "./ComponentName.css";

interface ComponentNameProps {
  // typed, no optionals unless genuinely optional
}

export default function ComponentName({ prop }: ComponentNameProps) {
  // hooks
  // derived values
  // handlers
  // return JSX
}
```

**3. Rules**

- File: `ComponentName.tsx` (PascalCase, matches export)
- CSS: `ComponentName.css` (co-located, same name)
- One component per file. No exceptions.

**4. Before finishing**

- Is the component doing one thing?
- Any hardcoded colors? (use CSS variables)
- Does it handle empty/loading/error states?
- Accessible? (tap targets, contrast)

---

## Workflow 3: Store Modification

Use when: changing Zustand store — adding fields, actions, or modifying logic.

**1. State the change**
Write out: what fields are added/changed, what actions are added/changed, what selectors might break.

**2. Check blast radius**
Search the codebase for every component reading from this store. List them:

```
Components using tasbeehStore:
- Home.tsx (reads: count, currentIndex, target)
- ProgressRing.tsx (reads: count, target)
- Stats page (reads: totalRecitations, streak)
```

If modifying an existing field's shape, every consumer needs updating.

**3. Edit the store**

- Add fields to the state interface
- Add actions
- Update persist config if new fields need localStorage
- Keep actions pure — no side effects, no navigation, no API calls

**4. Update consumers**
Granular selectors everywhere: `state => state.newField`. Never subscribe to the whole store.

**5. Test persistence**
Set state → close app → reopen → confirm state survived. Zustand persist writes to localStorage — mistakes here silently lose user data.

---

## Workflow 4: New Page / Route

Use when: adding a new screen the user navigates to.

**1. Create the page**
Location: `pages/NewPage.tsx`. The page is thin — it composes feature components, reads route params, handles layout. No business logic.

**2. Add the route**
In `app/router.tsx`. Lazy-load non-primary screens:

```typescript
const NewPage = lazy(() => import("../pages/NewPage"));
```

**3. Add navigation**

- From BottomNav → update `AppLayout.tsx`
- From a specific screen → add trigger in that component
- Always via React Router hooks (`useNavigate`), never via store actions

**4. Verify**

- Direct URL access works (PWA bookmarks)
- Back navigation works
- Page transition animation is smooth
- Content loads correctly offline

---

## Workflow 5: Firebase Integration

Use when: adding or modifying any Firebase feature.

**1. Service layer first**
All Firebase code in `services/firebase/`. Extend the right file:

- Auth → `auth.ts`, Data → `firestore.ts`, Config → `remoteConfig.ts`, Analytics → `analytics.ts`

**2. Typed interface**
Features talk to clean TypeScript functions, not raw SDK:

```typescript
// services/firebase/firestore.ts
export async function saveTasbeehProgress(
  userId: string,
  data: TasbeehProgress,
): Promise<void> {
  // Firebase implementation hidden from features
}
```

**3. React Query wrapper (for reads)**

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
Every Firebase read needs a fallback: Firestore → local Zustand data, Remote Config → hardcoded defaults, Auth → anonymous/offline usage for core features.

**5. Error handling**
Errors go to Crashlytics. User never sees a raw error. Gentle fallback UI only.
