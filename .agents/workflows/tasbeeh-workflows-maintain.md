---
description:
---

---

name: tasbeeh-workflows-maintain
description: >
Maintenance workflows for the Tasbeeh PWA — covers bug fixes, animation/UI polish, refactoring, and quick tasks. Use this skill when working on existing code: fixing bugs, improving animations, polishing UI, refactoring structure, or handling small changes. Trigger on: "fix this", "this is broken", "something wrong with", "refactor", "clean up", "polish", "improve the animation", "tweak", "adjust", "change the color", "rename", "move this", any bug report, any request to modify or improve existing code without adding new features. This is the repair and polish playbook — follow it step by step.

---

# Tasbeeh PWA — Maintain Workflows

Standard procedures for fixing, polishing, and improving what exists. Pick the right workflow, follow the steps.

---

## Workflow 1: Bug Fix

Use when: something is broken, wrong, or behaving unexpectedly.

**1. Reproduce first**
Before reading code, understand the exact behavior:

- What happens?
- What should happen?
- When did it start? (if known)

**2. Isolate the layer**
Figure out where the bug lives:

- UI rendering → component layer
- Wrong data → store or hook layer
- Data not persisting → Zustand persist or Firebase layer
- Animation glitch → Framer Motion props or CSS
- Only on refresh → hydration or localStorage race condition

**3. Find the root cause**
Read the relevant code. Don't guess. Trace data flow from source to screen:

- Where does the value originate?
- What transforms it?
- Where does it diverge from expected?

**4. Fix at the root**
Fix the actual cause, not the symptom. If the counter shows wrong numbers because rollover logic has an off-by-one, fix the rollover — don't add a UI-level correction that masks it.

**5. Check neighbors**
After fixing, verify nothing adjacent broke:

- Fixed the counter? Test streak calculation too
- Fixed a style? Check all 3 themes
- Fixed persistence? Test the offline flow

---

## Workflow 2: Animation / UI Polish

Use when: adding motion, transitions, micro-interactions, or visual refinements.

**1. Define the intent**
Every animation answers one of these:

- **Feedback** — "your tap was registered" (counter pulse)
- **Transition** — "you're moving to a new context" (page change)
- **Presence** — "this content has arrived" (fade-in on load)
- **Ambient** — "this space is alive and calm" (subtle breathing effect)

If the animation doesn't serve one of these, it doesn't belong.

**2. Pick the right parameters**

| Intent     | Duration   | Easing    | Transform                 |
| ---------- | ---------- | --------- | ------------------------- |
| Feedback   | 100-200ms  | easeOut   | scale 0.97→1.0            |
| Transition | 300-450ms  | easeInOut | translateX or fade        |
| Presence   | 250-400ms  | easeOut   | opacity 0→1, y: 8→0       |
| Ambient    | 2-5s, loop | sine      | very subtle scale/opacity |

**3. Implement with Framer Motion**

```typescript
// Presence — content appearing
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: 'easeOut' }}
>

// Feedback — counter tap
<motion.div
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.1 }}
>

// Page transition
<AnimatePresence mode="wait">
  <motion.div
    key={routeKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
```

**4. Check reduced motion**

```typescript
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
```

Skip or simplify animation if true.

**5. Feel test**
If Dilnawaz opens this during a quiet moment of zikr, does this animation add to the peace or interrupt it? If it draws attention to itself, tone it down.

---

## Workflow 3: Refactor

Use when: restructuring existing code without changing behavior.

**1. State what and why**
"Moving tasbeeh animation logic from Home.tsx into a dedicated hook because Home.tsx is 290 lines and mixing concerns."

**2. Verify current behavior**
Before touching anything, document what works:

- What does the user see?
- What state is involved?
- What edge cases currently work?

**3. Small moves**

- Extract → verify nothing broke
- Rename → verify nothing broke
- Move file → update imports → verify nothing broke

Each move independently correct. Never a "big bang" where 8 files change at once.

**4. Diff check**
After refactoring, user-facing behavior must be identical. No visual changes, no state changes, no animation differences. If the refactor changes behavior, it's a bug — not a refactor.

---

## Workflow 4: Quick Task

Use when: something genuinely small — rename a variable, tweak a color, adjust spacing, fix a typo, change a string.

**1. Just do it.**
No plan needed. No architecture discussion. Make the change.

**2. But still check:**

- Color change → works in all 3 themes?
- String change → not duplicated elsewhere?
- Spacing change → layout still breathes on small screens?

Not everything needs ceremony. Know when a task is actually small vs when it's bigger than it sounds.

---

## How to Pick the Right Workflow

When Dilnawaz makes a request:

1. Parse what he's actually asking (sometimes "fix this" means "add a feature" — if so, use the build workflows skill)
2. Pick the matching workflow above
3. If the request spans both build and maintain (e.g., "add animation to the existing counter"), use the relevant workflow from each skill in sequence
4. If a step doesn't apply, skip it. If an extra step is needed, add it

The workflows are rails, not cages. The point is: don't wing it. Have a process.
