---
trigger: always_on
---

# Tasbeeh PWA — Workspace Rules

## What This App Is

This is a Progressive Web App built as a personal spiritual companion for daily zikr (remembrance of Allah). It is not a productivity tool, not a social app, not a tech demo. Every technical decision serves one purpose: helping the user find calm and consistency in their daily spiritual practice.

The app counts tasbeeh, rotates daily Ayat and Hadith, displays the 99 Names of Allah, tracks streaks, and does it all with animations and UI that feel like a deep breath — not a notification ping.

## Tech Stack (Exact — Do Not Deviate Without Discussion)

- **Framework:** React 19, TypeScript (strict), Vite
- **State:** Zustand (local/domain state with localStorage persistence) + React Query (server/remote state)
- **Routing:** React Router v7
- **Styling:** CSS with custom properties (3 themes: default, dark, pineGreen)
- **Animation:** Framer Motion — calm, subtle, purposeful
- **Backend:** Firebase (Auth, Firestore, Crashlytics, Remote Config, Analytics)
- **PWA:** vite-plugin-pwa (service workers, offline support, installability)
- **API:** IslamicAPI for Asma-ul-Husna

## Non-Negotiable Principles

1. **Think before you code.** Every feature request gets evaluated for consequences before implementation. Ask: does this belong? What does it cost? Is there a simpler way?

2. **Code like a human, not a machine.** No AI-generated patterns: no redundant comments, no over-abstraction, no cookie-cutter file structures. Code should read like it was written by someone who cares about this specific app.

3. **Respect the architecture.** Domain-driven feature folders. Features don't import each other's internals. State layers are separate (useState / Zustand / React Query). Services wrap external SDKs. Pages compose features.

4. **Calm is the feature.** Animations should soothe, not impress. UI should breathe. Loading states should feel gentle. The counter tap should feel like touching prayer beads. If a change makes the app feel busier, it's wrong.

5. **Offline-first always.** This is a PWA used during prayer, travel, and moments without connectivity. The counter, streak, preferences, and daily content must work offline. No blank screens. No spinners where cached data exists.

6. **No dependency bloat.** Every new package needs justification. The current stack covers almost everything. Adding a library to save 20 lines of code is not justified if it adds 50KB to the bundle.

7. **Warn before you break.** Before modifying core flows (counter engine, streak logic, theme system, daily rotation), explain what could break and verify edge cases. These features are used daily — reliability is sacred.

## Project Structure

```
src/
├── app/          → Shell: providers, router, layout
├── pages/        → Route components (thin — compose features)
├── features/     → Domain modules (tasbeeh, stats, settings, customTasbeeh)
├── services/     → External integrations (Firebase, query client)
└── shared/       → Cross-cutting: components, hooks, constants, theme
```

New code goes where it belongs. When in doubt, start in the feature folder — extraction is cheap, wrong abstractions are expensive.

## How to Work on This Codebase

- **Before adding a feature:** Evaluate purpose, consequences, and fit with the app's soul
- **Before adding a dependency:** Justify it. Check size, maintenance, overlap with existing tools
- **Before changing state architecture:** Identify what specific problem the current approach doesn't solve
- **Before touching animations:** Ask — does this calm or distract?
- **After every change:** The codebase should be cleaner than before. Never dirtier.

## Code Style Quick Reference

- TypeScript: strict, no `any`, interfaces for entities, types for unions
- Components: PascalCase, one per file, hooks at top, JSX at bottom
- Selectors: granular (`state => state.count`, never `useStore()`)
- CSS: custom properties only, no hardcoded colors, generous spacing
- Animations: ease-in-out or soft springs, 150-500ms, subtle transforms
- Imports: React/libs → internal modules → styles, blank lines between groups
- Comments: only for the "why", never for the "what"
