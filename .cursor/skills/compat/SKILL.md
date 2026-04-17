---
name: compat
description: >-
  Produces a single compact handoff block summarizing the thread, what was
  completed (why/how), and what remains, formatted for copy-paste into a new
  chat. Use when the user invokes /compat, asks for a thread compact, context
  handoff, new-thread summary, or "paste this in a new chat".
---

# Thread compact (compat)

## When to run

Apply this skill when the user wants to **carry context into a new thread** without dumping raw chat. Output **one** markdown block they can copy wholesale.

## Instructions

1. **Scan the thread** (user goals, constraints, files touched, decisions, errors fixed).
2. **Summarize in 3–8 short bullets** — outcomes and facts only, no filler.
3. **Completed work** — for each meaningful chunk: **what** changed, **why** (user intent or bug), **how** (1 line: approach or key file/area). No full code; use `path` or `path:symbol` if helpful.
4. **Left to do** — ordered list: concrete next actions, open questions, or "none". Mark blockers explicitly.
5. **Token hygiene** — omit unchanged files, boilerplate, and long code. Do not paste large diffs; reference behavior instead.
6. **Optional** — one line: "Suggested first message for new thread: …" if it helps them continue.

## Output template

Use exactly this structure (fill sections; remove lines that do not apply):

```markdown
## Thread handoff (compat)

### Summary
- …

### Done (why / how)
- **…** — Why: … How: …
- …

### Repo / files touched (high signal)
- `…` — …

### Left / next
1. …
2. …

### Blockers
- None — OR …

### Env / notes (if relevant)
- Branch, commands run, versions, …
```

## Rules

- Write for a **reader with zero prior messages**; define acronyms once if needed.
- Prefer **imperative next steps** ("Add persist to filter store") over vague ("maybe improve").
- If the thread mixed topics, **split** into "Topic A" / "Topic B" subsections under Summary and Done.
- Do **not** include system prompts, tool internals, or skill file contents unless the user asked.

## Example (illustrative)

```markdown
## Thread handoff (compat)

### Summary
- Added collections list filters (search, schedule, toggles) with Zustand store.
- Integrated filter UI on `/collections/filter` and client-side list filtering on `Collections`.

### Done (why / how)
- **Filter model** — Why: User wanted v1 filtering after brainstorm. How: `collectionListFilters.ts` + `applyCollectionListFilters`.
- **State** — Why: Share filters between list and screen. How: `collectionsFilterStore` (no persist yet).

### Repo / files touched (high signal)
- `src/pages/CollectionsFilter.tsx` — full filter form + sticky apply footer.
- `src/pages/Collections.tsx` — filtered queries + summary bar + empty match state.

### Left / next
1. Optional: persist filters via `zustand/middleware` + rehydration-safe draft init.
2. Tags / sort on filter screen if product wants v2.

### Blockers
- None

### Env / notes (if relevant)
- `npm run typecheck` passed after changes.
```
