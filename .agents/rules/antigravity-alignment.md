---
trigger: always_on
---

---

name: antigravity-alignment
description: >
ALWAYS load this skill at the start of every session and consult it throughout. This skill maintains a living memory of the developer's preferences, decisions, patterns, coding philosophy, and project context so they never have to repeat themselves. Triggers automatically at session start, and also whenever the user states a preference ("I prefer...", "always do...", "never do...", "I don't like...", "use X instead of Y"), makes an architectural decision, corrects the agent, expresses frustration, or teaches the agent something. Also triggers at session end to capture what was learned. The agent must update this skill's PREFERENCES.md and PROJECT.md files when new knowledge is gained. This is the agent's long-term brain — it must be read before working and written to after learning.

---

# Antigravity Alignment Skill

You are maintaining a **living alignment document** for a React Native developer. Your job is to know how this developer thinks, what they've decided, and what they expect — so they never have to say it twice.

---

## How This Skill Works

This skill has two reference files you must keep updated:

| File                        | Purpose                                  | When to read                  | When to update                               |
| --------------------------- | ---------------------------------------- | ----------------------------- | -------------------------------------------- |
| `references/PREFERENCES.md` | Developer's style, rules, opinions       | Every session start           | When a new preference is stated or implied   |
| `references/PROJECT.md`     | Project context, architecture, decisions | When working on project tasks | When architecture or tech decisions are made |

**Always read both files at session start** before doing any work.

---

## Session Start Protocol

At the beginning of every conversation, silently:

1. Read `references/PREFERENCES.md`
2. Read `references/PROJECT.md`
3. Apply everything in them without announcing it

Do NOT say "I've loaded your preferences." Just behave accordingly. The developer will notice when you get things right.

---

## When to Update

### Update PREFERENCES.md when the developer:

- States a rule: "always", "never", "I prefer", "I hate", "don't do X"
- Corrects you: "no, do it this way instead"
- Repeats the same instruction more than once (that's a signal it should be permanent)
- Expresses frustration about something you did
- Approves of a pattern you used ("yes, exactly like this")

### Update PROJECT.md when:

- A library or tool is chosen over another
- An architectural decision is made ("we'll use Zustand not Redux")
- A folder structure is established
- A naming convention is decided
- A screen, feature, or component is completed

---

## How to Update

When you detect something worth capturing, say:

> 🧠 **Alignment update** — I'm adding this to your preference memory:
> `[short statement of what you learned]`
> This means I'll apply it automatically going forward.

Then update the relevant reference file immediately.

Keep each entry in the files short — one line per rule, one line per decision. No essays.

---

## Conflict Detection

If a new instruction contradicts something already in PREFERENCES.md, flag it:

> ⚠️ **Conflict detected:** You previously said "[old rule]" but now you're saying "[new rule]". Which should I follow going forward?

After confirmation, update the file with the new rule and remove the old one.

---

## What NOT to Store

- Temporary decisions ("just for this screen, do X") — don't store these
- Ambiguous corrections — ask first: "Should I always do this, or just this time?"
- Sensitive info — no API keys, passwords, tokens
- Obvious things — don't clutter with things any senior RN dev would know

---

## Reference Files

Read these now if starting a session:

- → `references/PREFERENCES.md` — developer rules and style preferences
- → `references/PROJECT.md` — project architecture and decisions

---

## End-of-Session Capture (Optional but Valuable)

If the session involved significant decisions or new patterns, offer:

> 🧠 **Session summary — should I save these to your alignment memory?**
>
> 1. [decision or preference learned]
> 2. [decision or preference learned]
>
> Reply "save" to add them, or correct anything first.
