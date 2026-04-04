---
name: tasbeeh-workflows-maintain
description: Maintenance playbook for the Tasbeeh PWA — bug fixes, animation and UI polish, refactors without behavior change, and genuinely small edits. Use when fixing broken behavior, polishing motion or visuals, cleaning up structure, renaming, tweaking colors/spacing, or any change that improves existing code without adding a new feature. Trigger on fix, broken, wrong, refactor, clean up, polish, tweak, adjust, animation, rename, move, bug, or similar.
---

# Tasbeeh PWA — Maintain Workflows

Use these when **changing or fixing what already exists**. For **new** features, screens, or store shape, use the **tasbeeh-workflows-build** skill first.

| Situation | Section |
|-----------|---------|
| Incorrect or unexpected behavior | [Workflow 1: Bug Fix](#workflow-1-bug-fix) |
| Motion, transitions, visual refinement | [Workflow 2: Animation / UI Polish](#workflow-2-animation--ui-polish) |
| Restructure without changing behavior | [Workflow 3: Refactor](#workflow-3-refactor) |
| Trivial edits (typo, one string, one spacing) | [Workflow 4: Quick Task](#workflow-4-quick-task) |
| Unsure which applies | [How to pick](#how-to-pick-the-right-workflow) |

---

## Workflow 1: Bug Fix

**When:** Something is broken, wrong, or inconsistent.

**1. Reproduce first**

Before diving into code, pin down:

- What actually happens?
- What should happen?
- When did it start (if known)?

**2. Isolate the layer**

- UI rendering → component
- Wrong values → store or hook
- Not persisting → Zustand `persist` / partialize, or remote sync layer
- Janky motion → Framer Motion props or CSS
- Only after refresh → hydration mismatch or `localStorage` timing

**3. Find the root cause**

Trace data from source to screen: origin → transforms → render. Do not patch at random.

**4. Fix at the root**

Correct the cause, not the symptom (e.g. fix rollover math, not a display fudge).

**5. Check neighbors**

- Counter logic → streak or related stats if coupled
- Style fix → **default, dark, pineGreen** themes
- Persistence → offline or reload path

---

## Workflow 2: Animation / UI Polish

**When:** Motion, transitions, micro-interactions, or visual refinement on **existing** UI.

**1. Intent**

Each animation should serve **one** of:

- **Feedback** — tap registered (e.g. counter pulse)
- **Transition** — context change (route, panel)
- **Presence** — content appeared (fade/slide in)
- **Ambient** — calm life in the background (subtle loop)

If none of these apply, skip or simplify.

**2. Parameters (starting points)**

| Intent | Duration | Easing | Typical motion |
|--------|----------|--------|----------------|
| Feedback | 100–200ms | easeOut | scale 0.97 → 1 |
| Transition | 300–450ms | easeInOut | fade or translate |
| Presence | 250–400ms | easeOut | opacity 0→1, y 8→0 |
| Ambient | 2–5s loop | sine | very subtle scale/opacity |

**3. Framer Motion**

```tsx
// Presence
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// Feedback
<motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.1 }} />

// Route shell
<AnimatePresence mode="wait">
  <motion.div
    key={routeKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  />
</AnimatePresence>
```

**4. Reduced motion**

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
```

If true, skip or greatly simplify motion.

**5. Feel test**

During a quiet moment of zikr, does this add calm or grab attention? If it shows off, reduce it.

---

## Workflow 3: Refactor

**When:** Restructuring code **without** intended behavior change.

**1. State what and why**

One clear sentence (e.g. extract hook from `Home.tsx` because the file mixes concerns).

**2. Baseline behavior**

Note what works today: visible behavior, state involved, edge cases that must stay true.

**3. Small moves**

Extract → verify. Rename → verify. Move file → update imports → verify. Avoid large multi-file rewrites in one step.

**4. Same diff externally**

Afterward: same UX, same state outcomes, same motion character. Unintended behavior change is a **bug**, not a refactor.

---

## Workflow 4: Quick Task

**When:** Truly small — rename, one token color, one spacing value, typo, single string.

**1. Do it**

No lengthy plan unless the edit touches many call sites.

**2. Still verify**

- Color → all **three** themes
- Copy → duplicated strings / i18n if applicable
- Spacing → small viewports still breathe

Escalate to Workflow 1 or **tasbeeh-workflows-build** if the “small” change keeps growing.

---

## How to pick the right workflow

1. **Parse the real ask** — “fix this” sometimes means a new capability; if so, use **tasbeeh-workflows-build**.
2. **Match** to Workflow 1–4 above.
3. **Mixed work** (e.g. add motion to an existing counter): apply **maintain** steps for polish and **build** steps where new structure or wiring is required — order by dependency (behavior first, then motion if needed).
4. **Skip** steps that do not apply; **add** steps when the situation demands it.

These workflows are guardrails: use judgment, do not improvise blindly.
