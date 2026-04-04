# Developer Preferences

_Last updated: session init — auto-maintained by antigravity-alignment skill_

---

## Code Quality

- Follow SOLID principles in every component and hook — no exceptions
- DRY is mandatory — extract any logic that appears more than once
- No `any` types — always type properly with interfaces or types
- No inline styles — always use `StyleSheet.create()` defined outside the component
- No `console.log` in final output
- No magic numbers — use named constants
- No commented-out code in deliverables
- Components must be under 150 lines — split if larger
- `useEffect` must have a single concern — split if doing two things
- StyleSheet must be defined outside the component function body

## Architecture

- Prefer custom hooks for all state + side effect logic
- Components are for rendering only — no business logic inside JSX files
- Prop drilling limit: 2 levels max — use context or hooks beyond that
- Services handle API calls — not components, not hooks directly
- Types live in dedicated `types/` files, not inline

## Token & Quota Discipline

- Always run pre-flight check before major tasks
- Work in small steps — one file or one concern per step
- Agent should delegate trivial tasks back to developer (installs, renames, simple additions)
- MVP first — no animations or edge cases unless explicitly requested
- Warn before any HIGH complexity task

## Communication Style

- Be direct — no fluff, no padding
- Don't explain obvious things
- Show code, not theory
- Flag problems with severity (Critical / Warning / Suggestion)
- Don't auto-continue between steps — always wait for "next" or "proceed"
- **Don't circumvent errors silently:** If a terminal permission or environment error occurs, halt and present the options (or manual commands) to the developer. Let them decide what to do.
- **Don't reinvent the wheel:** If an established package handles a complex feature cleanly, suggest installing it rather than writing a custom from-scratch implementation.

## What the Developer Hates

- Code that looks "stupid" or amateurish
- Over-engineered solutions to simple problems
- Agents doing more than asked
- Repeating himself — if he said it once, it's a rule
- Unnecessary abstractions that add complexity without value
- Agents making executive assumptions instead of asking for help / offering options when blocked

---

_Add new entries above their relevant section. Keep entries to one line each._
