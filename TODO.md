# Tasbeeh app — product roadmap & tracker

Use this file to track **done** vs **next**. Check boxes as you ship.

**Rules:** Don’t jump phases · ship working features · Zustand for state, React Query for API, Firestore for persistence (when you add it).

---

## Phase 0 — Foundation (done)

- [x] Authentication (Sign up / Sign in / Sign out)
- [x] Theme switching (Light / Dark)
- [x] Font customization
- [x] Basic profile (edit name)
- [x] Single Tasbeeh (local state)
- [x] Counter working + tracked locally

---

## Phase 1 — Core experience (MVP)

**Goal:** Make the app usable daily. **Finish this phase before Phase 2.**

### 1. Active Tasbeeh system

**Goal:** Support **multiple tasbeeh (1–4 active)**.

- [ ] Convert single tasbeeh → array (if any code still assumes one)
- [ ] Add `activeTasbeehs` (or equivalent) in Zustand
- [ ] Each active item model: `{ id, text, target, count }` (align with existing types / migration)
- [ ] Switch between tasbeeh (tabs or swipe)
- [ ] Maintain **separate** counters per active tasbeeh

### 2. Tasbeeh collection screen

**Goal:** User can browse and select tasbeeh.

- [ ] Create **Collection** screen (route + layout)
- [ ] Default tasbeeh list (hardcoded first)
- [ ] UI: card list with Arabic + transliteration + meaning
- [ ] Row/card actions (context menu or sheet):
  - [ ] Start Tasbeeh
  - [ ] Edit
  - [ ] Delete (**custom only**)

### 3. Add custom Tasbeeh

**Goal:** User can create their own entries.

- [ ] Add **Add / Edit** screen
- [ ] Fields: Arabic, transliteration, meaning, target count, category
- [ ] Save locally first (persist with existing storage pattern)

### 4. Replace local-only state → Firestore

**Goal:** Persist user data in the cloud.

- [ ] Save active tasbeehs: `users/{userId}/activeTasbeehs/{id}`
- [ ] Sync on app load
- [ ] Update counts in real time (**debounced** writes)

### 5. Daily progress tracking

**Goal:** Track daily usage.

- [ ] `users/{userId}/dailyLogs/{date}` collection
- [ ] Log shape per entry: `{ tasbeehId, count, completed }` (adjust names to match schema)

---

## Phase 2 — Consistency system

**Goal:** Bring users back daily.

### 6. Calendar view

- [ ] Show days: completed / missed / partial
- [ ] Tap day → detail of tasbeeh completed that day

### 7. Smart notifications

- [ ] Set up Firebase Cloud Messaging
- [ ] Logic baseline: `expected = (timePassed / totalTime) * target`
- [ ] Notify when: not started / behind schedule / (optional) before prayer time

### 8. Streak system

- [ ] Track consecutive days (align with existing streak if partial)
- [ ] Store in Firestore
- [ ] Show on Home

---

## Phase 3 — Advanced features

**Goal:** Deeper product depth.

### 9. Multi-tasbeeh flow (parallel)

- [ ] Handle **4** active tasbeeh cleanly
- [ ] Switch UI
- [ ] Independent progress per item

### 10. Filters & categories

- [ ] Categories: e.g. forgiveness, morning/evening, after prayer, Darood
- [ ] Filter UI on collection screen

### 11. Stats dashboard

- [ ] Total count
- [ ] Weekly / monthly stats
- [ ] Filters: date, tasbeeh, category

---

## Phase 4 — Social & gamification

**Goal:** Engagement (only after core is solid).

### 12. Challenges

- [ ] Challenge model (e.g. 10K Darood)
- [ ] Join / leave
- [ ] Progress tracking

### 13. Community

- [ ] Public tasbeeh listings
- [ ] Like, comment, save to collection

### 14. Leaderboard

- [ ] Anonymous ranking
- [ ] Optional display name

---

## Suggested folder shape (reference)

```text
features/tasbeeh/
  components/
  screens/
  store/
  services/
```

(Add only as you implement; keep matching existing `src/features/` patterns.)

---

## Weekly plan (realistic)

| Week | Focus |
|------|--------|
| 1 | Active tasbeeh system + Collection screen |
| 2 | Add/edit tasbeeh + Firestore sync |
| 3 | Daily logs + Calendar |
| 4 | Notifications + Streak hardening |

---

## Final goal (north star)

A PWA that feels **calm**, **smart**, **personal**, and **consistent**.

---

## Immediate next step

**Start with:** Active Tasbeeh system (Phase 1 §1).

Optional follow-up: *“start phase 1 implementation”* for code-level breakdown (store shape, screens, etc.).
