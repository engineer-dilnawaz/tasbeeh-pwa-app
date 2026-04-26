# Divine Atomic System (DAS) — Implementation Plan

This is the source of truth for the migration from DaisyUI to a pure, custom Atomic Design System built with Tailwind CSS and Framer Motion.

## 🏗️ Folder Structure (Proposed)
- [ ] Create `src/shared/design-system/atoms/`
- [ ] Create `src/shared/design-system/molecules/`
- [ ] Create `src/shared/design-system/tokens/`
- [ ] Create `src/shared/design-system/lab/`

## 🎨 Phase 1: Foundation (Semantic Tokens)
- [ ] Define `--ds-` CSS variables in `global.css`
- [ ] Map CSS variables in `tailwind.config.ts`
- [ ] Set up `ComponentLab.tsx` route at `/lab`

## 🧱 Phase 2: Atomic Primitives (Gold Standard)
- [x] **Surface.tsx** (Squircle + Background)
- [x] **Text.tsx** (Typography scales)
- [x] **Button.tsx** (Interaction)
- [x] **TextInput.tsx** (Input)
- [x] **Icon.tsx** (Phosphor wrapper)
- [ ] **Divider.tsx** (Borderness-free separation)
- [ ] **Badge.tsx** (Streaks, status, labels)
- [ ] **Skeleton.tsx** (Premium loading states)

## 🧪 Phase 3: Molecules & Testing
- [ ] **FormField.tsx** (Label + Input + Error)
- [ ] **ListItem.tsx** (Icon + Text + Chevron)
- [ ] **Card.tsx** (Surface + Header + Content)
- [ ] **SocialAuthGroup.tsx** (Facebook/Google/Apple)

## 🔄 Phase 4: Migration & Cleanup
- [ ] Swap Auth screen to DAS components
- [ ] Swap Settings/Profile screen to DAS components
- [ ] Swap Main Counter screen to DAS components
- [ ] Remove DaisyUI plugin from `tailwind.config.ts`
- [ ] Remove DaisyUI imports from `global.css`

---

## ✅ Status Tracking
- **Current Focus:** Phase 2 (Atomic Primitives)
- **Completed:** 
  - [x] Create DESIGN_SYSTEM_PLAN.md
  - [x] Define `--ds-` CSS variables in `global.css`
  - [x] Map CSS variables in `tailwind.config.ts`
  - [x] Set up `ComponentLab.tsx` route at `/lab`
  - [x] **Surface.tsx** (Atom)
  - [x] **Text.tsx** (Atom)
  - [x] **Button.tsx** (Atom)
  - [x] **TextInput.tsx** (Atom)
  - [x] **Icon.tsx** (Atom)
- **Next Step:** Complete Phase 2 atoms (**Divider**, **Badge**, **Skeleton**).
