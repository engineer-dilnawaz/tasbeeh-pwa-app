# Tasbeeh Flow

> A calm and minimal tasbeeh app for daily dhikr

**Stage:** Alpha  
**Version:** 1.0.0  
**Last Updated:** 2026-04-18

---

## Table of Contents

1. [Overview](#1-overview)
   - 1.1 [Vision](#11-vision)
   - 1.2 [Target Audience](#12-target-audience)
   - 1.3 [Key Differentiators](#13-key-differentiators)
2. [Quick Start](#2-quick-start)
   - 2.1 [Prerequisites](#21-prerequisites)
   - 2.2 [Installation](#22-installation)
   - 2.3 [Environment Setup](#23-environment-setup)
   - 2.4 [Running the App](#24-running-the-app)
3. [Architecture](#3-architecture)
   - 3.1 [Directory Structure](#31-directory-structure)
   - 3.2 [Tech Stack](#32-tech-stack)
   - 3.3 [Design Principles](#33-design-principles)
   - 3.4 [Data Flow](#34-data-flow)
4. [Features](#4-features)
   - 4.1 [Done](#41-done)
   - 4.2 [In Progress](#42-in-progress)
   - 4.3 [Planned](#43-planned)
5. [Core Modules](#5-core-modules)
   - 5.1 [Routing](#51-routing)
   - 5.2 [State Management](#52-state-management)
   - 5.3 [Data Persistence](#53-data-persistence)
   - 5.4 [Design System](#54-design-system)
   - 5.5 [PWA & Offline](#55-pwa--offline)
6. [Database Schema](#6-database-schema)
   - 6.1 [Dexie Tables](#61-dexie-tables)
   - 6.2 [Sync Status Flow](#62-sync-status-flow)
   - 6.3 [Schema Migrations](#63-schema-migrations)
7. [Firebase Integration](#7-firebase-integration)
   - 7.1 [Current State](#71-current-state)
   - 7.2 [Authentication Strategy](#72-authentication-strategy)
   - 7.3 [Firestore Sync Strategy](#73-firestore-sync-strategy)
   - 7.4 [Firestore Collection Paths](#74-firestore-collection-paths)
8. [External Services](#8-external-services)
   - 8.1 [Firebase](#81-firebase)
   - 8.2 [Sentry](#82-sentry)
   - 8.3 [Islamic API](#83-islamic-api)
9. [Development](#9-development)
   - 9.1 [Scripts](#91-scripts)
   - 9.2 [Code Style](#92-code-style)
   - 9.3 [File Naming](#93-file-naming)
   - 9.4 [Import Conventions](#94-import-conventions)
10. [Testing](#10-testing)
    - 10.1 [Current State](#101-current-state)
    - 10.2 [Planned Strategy](#102-planned-strategy)
11. [Deployment](#11-deployment)
    - 11.1 [Build](#111-build)
    - 11.2 [Hosting](#112-hosting)
    - 11.3 [CI/CD](#113-cicd)
12. [Technical Debt & Maintenance](#12-technical-debt--maintenance)
    - 12.1 [Unused Dependencies](#121-unused-dependencies)
    - 12.2 [Dead/WIP Files](#122-deadwip-files)
    - 12.3 [Placeholder Implementations](#123-placeholder-implementations)
    - 12.4 [Periodic Review Checklist](#124-periodic-review-checklist)
13. [Contributing](#13-contributing)
14. [Troubleshooting](#14-troubleshooting)
15. [Brand Guidelines](#15-brand-guidelines)
    - 15.1 [Brand Identity](#151-brand-identity)
    - 15.2 [Color System](#152-color-system)
    - 15.3 [Typography](#153-typography)
    - 15.4 [Iconography](#154-iconography)
    - 15.5 [Motion & Animation](#155-motion--animation)
    - 15.6 [Spacing & Layout](#156-spacing--layout)
    - 15.7 [Component Patterns](#157-component-patterns)
    - 15.8 [Voice & Tone](#158-voice--tone)
16. [User Flows](#16-user-flows)
    - 16.1 [Flow Overview](#161-flow-overview)
    - 16.2 [First-Time User Flow](#162-first-time-user-flow)
    - 16.3 [Returning User Flow](#163-returning-user-flow)
    - 16.4 [Tasbeeh Counting Flow](#164-tasbeeh-counting-flow)
    - 16.5 [Collection Management Flow](#165-collection-management-flow)
    - 16.6 [Settings Flow](#166-settings-flow)
    - 16.7 [Authentication Flow](#167-authentication-flow-planned)
    - 16.8 [Sync Flow](#168-sync-flow-planned)
17. [Glossary](#17-glossary)
18. [Changelog](#18-changelog)

---

## 1. Overview

### 1.1 Vision

Tasbeeh Flow is a **calm and minimal tasbeeh app for daily dhikr**. It aims to provide Muslims with a distraction-free, beautiful, and reliable tool for their daily remembrance of Allah.

The app is designed to be:
- **Offline-first**: Works without internet, syncs when connected
- **Privacy-respecting**: Local storage by default, optional cloud sync
- **Beautiful**: Custom design system with thoughtful animations
- **Accessible**: Support for Arabic, Urdu, and English typography

### 1.2 Target Audience

Muslims practicing daily dhikr, ranging from casual users doing occasional tasbeeh to devout practitioners with structured daily routines. The app supports both simple counting and complex collection-based workflows.

### 1.3 Key Differentiators

| Feature | Implementation |
|---------|----------------|
| Custom Design System | Squircle components, design tokens, Framer Motion animations |
| Local-First Architecture | Dexie (IndexedDB) with rich schema, React Query in `offlineFirst` mode |
| PWA with Workbox | Precaching, standalone mode, auto-update service worker |
| Dual Calendar Support | Hijri + Gregorian calendar UI components |
| Collection System | Phrases library, customizable collections with roles (start/main/end) |
| Multi-language Typography | Arabic (Amiri), Urdu (Noto Nastaliq), English (Inter, Outfit) |

---

## 2. Quick Start

### 2.1 Prerequisites

- **Node.js**: v20+ recommended
- **Package Manager**: Yarn (preferred) or npm
- **Browser**: Chrome/Edge/Safari with PWA support

### 2.2 Installation

```bash
git clone <repository-url>
cd tasbeeh-app
yarn install
```

### 2.3 Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in required values (see `.env.example` for documentation):

   | Variable | Required | Where to Find |
   |----------|----------|---------------|
   | `VITE_FIREBASE_API_KEY` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_STORAGE_BUCKET` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_APP_ID` | Yes | Firebase Console → Project Settings → General |
   | `VITE_FIREBASE_MEASUREMENT_ID` | Optional | Firebase Console → Project Settings → General |
   | `VITE_SENTRY_DSN` | Optional | Sentry → Project Settings → Client Keys (DSN) |
   | `VITE_ISLAMIC_API_KEY` | Optional | https://islamicapi.com → Dashboard |
   | `VITE_PUBLIC_APP_NAME` | Optional | Your app's display name |
   | `VITE_SUPPORT_EMAIL` | Optional | Support email for legal pages |

### 2.4 Running the App

```bash
# Development server (with hot reload)
yarn dev

# Type checking
yarn typecheck

# Linting
yarn lint

# Production build
yarn build

# Preview production build
yarn preview
```

---

## 3. Architecture

### 3.1 Directory Structure

```
src/
├── main.tsx                 # App entry point
├── App.tsx                  # Root component with providers
├── app/                     # Application shell
│   ├── router.tsx           # Route definitions
│   └── layout/
│       ├── AppShell.tsx     # Main layout (header, nav, outlet)
│       └── ScreenWrapper.tsx # Mobile viewport wrapper
├── pages/                   # Route components (thin, compose features)
│   ├── SplashScreen.tsx
│   ├── Onboarding.tsx
│   ├── Home.tsx
│   ├── Stats.tsx
│   ├── Collections.tsx
│   ├── CollectionsNew.tsx
│   ├── Settings.tsx
│   ├── SettingsFeedback.tsx
│   ├── SettingsAbout.tsx
│   ├── SettingsProfile.tsx
│   ├── Saved.tsx            # [PLANNED] Not yet routed
│   └── TestScreen.tsx       # Development testing
├── features/                # Domain modules
│   ├── onboarding/
│   │   └── onboardingStore.ts
│   ├── settings/
│   │   ├── components/
│   │   ├── services/
│   │   └── store/
│   └── tasbeeh/
│       ├── components/
│       ├── collections/     # Collection composer feature
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── store/
│       │   ├── types.ts
│       │   ├── queryKeys.ts
│       │   └── index.ts     # Barrel exports
│       ├── services/
│       │   ├── tasbeehDb.ts         # Dexie schema
│       │   ├── tasbeehRepository.ts
│       │   └── collectionsRepository.ts
│       └── store/
├── services/                # External integrations
│   ├── firebase/
│   │   └── config.ts        # Firebase app initialization
│   ├── sync/
│   │   ├── collectionsSync.ts  # [PLACEHOLDER] Firebase sync
│   │   └── index.ts
│   └── queryClient.ts       # React Query configuration
├── shared/                  # Cross-cutting concerns
│   ├── design-system/
│   │   ├── index.ts         # Barrel exports
│   │   ├── tokens/          # Design tokens
│   │   ├── hooks/           # useTheme, useLongPressTooltip
│   │   └── ui/              # 36+ UI components
│   ├── styles/
│   │   └── global.css       # Global styles, fonts, CSS variables
│   └── utils/
│       └── date.ts
└── assets/
    └── images/              # Onboarding slides
```

### 3.2 Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | React | ^19.2.4 | UI library |
| **Build** | Vite | ^8.0.3 | Build tool & dev server |
| **Language** | TypeScript | ^6.0.2 | Type safety |
| **Routing** | React Router DOM | ^7.13.2 | Client-side routing |
| **State (Client)** | Zustand | ^5.0.12 | Local/domain state |
| **State (Server)** | TanStack React Query | ^5.96.1 | Server state & caching |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS |
| **UI Components** | daisyUI | ^5.5.19 | Component library |
| **Animation** | Framer Motion | ^12.38.0 | Animations |
| **Local DB** | Dexie | ^4.4.2 | IndexedDB wrapper |
| **Backend** | Firebase | ^12.11.0 | Auth, Firestore, Analytics |
| **PWA** | vite-plugin-pwa | ^1.2.0 | Service worker, manifest |
| **Forms** | React Hook Form | latest | Form state management |
| **Validation** | Zod | latest | Schema validation |
| **Icons** | Lucide React | latest | Icon library |

### 3.3 Design Principles

1. **Feature-Based Organization**
   - Each feature is a self-contained module under `features/`
   - Features expose public API via `index.ts` barrel exports
   - **Features must NOT import from other features' internals**

2. **Separation of Concerns**
   - Pages: Thin route components, compose features
   - Features: Business logic, domain state, feature-specific UI
   - Shared: Cross-cutting components, hooks, utilities
   - Services: External integrations (Firebase, APIs)

3. **State Layer Separation**
   - **Zustand**: Local/domain state (UI state, user preferences)
   - **React Query**: Server/remote state (data fetching, caching)
   - Never mix these responsibilities

4. **Offline-First**
   - All writes go to Dexie immediately
   - Background sync when online (planned)
   - React Query configured with `networkMode: 'offlineFirst'`

### 3.4 Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERACTION                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENTS                         │
│  (Pages compose Features, Features use Shared UI)               │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌───────────────────┐ ┌─────────────────┐ ┌─────────────────────┐
│   ZUSTAND STORES  │ │  REACT QUERY    │ │  REACT HOOK FORM    │
│   (Client State)  │ │  (Server State) │ │  (Form State)       │
└───────────────────┘ └─────────────────┘ └─────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REPOSITORIES                              │
│  (tasbeehRepository, collectionsRepository, appConfigRepository) │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                ▼                               ▼
┌───────────────────────────┐     ┌───────────────────────────────┐
│     DEXIE (IndexedDB)     │     │   FIREBASE (Firestore)        │
│     [PRIMARY - LOCAL]     │     │   [SECONDARY - SYNC]          │
│                           │     │   [NOT YET IMPLEMENTED]       │
└───────────────────────────┘     └───────────────────────────────┘
```

---

## 4. Features

### 4.1 Done

| Feature | Location | Description |
|---------|----------|-------------|
| **Splash Screen** | `pages/SplashScreen.tsx` | Animated app launch screen |
| **Onboarding** | `pages/Onboarding.tsx` | First-time user flow with slides |
| **Home Screen** | `pages/Home.tsx` | Main tasbeeh counter with streak |
| **Collections List** | `pages/Collections.tsx` | View/select tasbeeh collections |
| **Collection Composer** | `pages/CollectionsNew.tsx` | Create new collections with full form |
| **Settings Hub** | `pages/Settings.tsx` | Settings navigation |
| **Profile Settings** | `pages/SettingsProfile.tsx` | User profile management |
| **Feedback** | `pages/SettingsFeedback.tsx` | User feedback submission |
| **About** | `pages/SettingsAbout.tsx` | App information |
| **App Shell** | `app/layout/AppShell.tsx` | Header, bottom nav, theme |
| **Design System** | `shared/design-system/` | 36+ UI components |
| **Theme System** | Light/dark modes | CSS variables, useTheme hook |
| **PWA** | `vite.config.ts` | Installable, offline-capable |
| **Dexie Schema** | `services/tasbeehDb.ts` | Version 4 with migrations |
| **Phrases CRUD** | `collectionsRepository.ts` | Create, read, update phrases |
| **Collections CRUD** | `collectionsRepository.ts` | Create, read, update, archive |

### 4.2 In Progress

| Feature | Location | Status | Blocker |
|---------|----------|--------|---------|
| **Firebase Sync** | `services/sync/collectionsSync.ts` | Placeholder | Need auth implementation |
| **Firebase Auth** | `services/firebase/config.ts` | SDK initialized | No UI/flow implemented |
| **Stats Screen** | `pages/Stats.tsx` | Route exists | Minimal implementation |

### 4.3 Planned

| Feature | Priority | Notes |
|---------|----------|-------|
| **Saved/Favorites** | High | `pages/Saved.tsx` exists, not routed |
| **Firebase Authentication** | High | Anonymous → Email/Google upgrade flow |
| **Firestore Sync** | High | Push pending, pull remote, conflict resolution |
| **Sentry Error Tracking** | Medium | SDK in deps, env configured, not initialized |
| **Islamic API Integration** | Medium | Asma-ul-Husna, additional content |
| **Stats & Analytics** | Medium | Charts, streaks, insights |
| **Notifications** | Low | Reminder system |
| **CI/CD Pipeline** | Low | GitHub Actions for lint/test/deploy |
| **Automated Testing** | Low | Vitest for unit, Playwright for E2E |

---

## 5. Core Modules

### 5.1 Routing

**File:** `src/app/router.tsx`

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | `SplashScreen` | No | App launch |
| `/onboarding` | `Onboarding` | No | First-time flow |
| `/home` | `Home` | No* | Main counter |
| `/stats` | `Stats` | No* | Statistics |
| `/collections` | `Collections` | No* | Collection list |
| `/collections/new` | `CollectionsNew` | No* | Create collection |
| `/settings` | `Settings` | No* | Settings hub |
| `/settings/feedback` | `SettingsFeedback` | No* | Feedback form |
| `/settings/about` | `SettingsAbout` | No* | About page |
| `/settings/profile` | `SettingsProfile` | No* | Profile settings |
| `/test` | `TestScreen` | No | Dev testing |
| `*` | Redirect to `/` | - | Catch-all |

*Routes under `AppShell` layout. Auth will be required for sync features.

### 5.2 State Management

#### Zustand Stores

| Store | File | Key | Persistence | Purpose |
|-------|------|-----|-------------|---------|
| `useTasbeehStore` | `features/tasbeeh/store/tasbeehStore.ts` | `tasbeeh-home-storage` | localStorage | Active tasbeeh, count, streak |
| `useSettingsStore` | `features/settings/store/settingsStore.ts` | IndexedDB | IndexedDB via repository | App config, preferences |
| `useOnboardingStore` | `features/onboarding/onboardingStore.ts` | `onboarding-storage` | localStorage | Onboarding completion |
| `useCollectionComposerStore` | `features/tasbeeh/collections/store/` | None (ephemeral) | - | Draft items, picker state |
| `useToastStore` | `shared/design-system/ui/useToast.ts` | None (ephemeral) | - | Toast queue |

#### React Query Configuration

**File:** `src/services/queryClient.ts`

```typescript
{
  staleTime: 60_000,        // 1 minute
  gcTime: 5 * 60_000,       // 5 minutes
  networkMode: 'offlineFirst',
  retry: 1,
}
```

#### Query Keys

**File:** `features/tasbeeh/collections/queryKeys.ts`

```typescript
tasbeehQueryKeys = {
  all: ['tasbeeh'],
  phrases: () => [...all, 'phrases'],
  collections: () => [...all, 'collections'],
  collection: (id) => [...collections(), id],
}
```

### 5.3 Data Persistence

#### Repository Pattern

All database operations go through repository modules:

| Repository | File | Responsibility |
|------------|------|----------------|
| `tasbeehRepository` | `services/tasbeehRepository.ts` | Progress, streaks, events |
| `collectionsRepository` | `services/collectionsRepository.ts` | Collections, phrases, items |
| `appConfigRepository` | `settings/services/appConfigRepository.ts` | App configuration |

#### Repository → Dexie → Firebase Flow

```
Component
    │
    ▼
Repository (e.g., createCollection)
    │
    ├─► Dexie.put() with syncStatus: "pending"
    │
    └─► [FUTURE] Trigger sync service
            │
            ▼
        Firebase Firestore
```

### 5.4 Design System

**Location:** `src/shared/design-system/`

#### Component Inventory (36+ components)

| Category | Components |
|----------|------------|
| **Layout** | Card, Squircle, Header, BottomNav, Drawer |
| **Typography** | Text (variants: body, caption, heading, display) |
| **Form** | TextInput, Checkbox, Switch, Select, Form/FormField |
| **Feedback** | Toast, Toaster, Dialog, EmptyState |
| **Data Display** | Avatar, AvatarGroup, Badge, Indicator, List/ListItem |
| **Navigation** | SegmentedControl, Accordion |
| **Progress** | ProgressRing, Skeleton |
| **Actions** | Button, FAB |
| **Calendar** | Calendar, CalendarDay, GregorianCalendar, HijriCalendar |
| **Utility** | Tooltip, PullToRefresh, TimePicker |

#### Design Tokens

**File:** `shared/design-system/tokens/index.ts`

```typescript
TOKENS = {
  colors: {
    primary: 'oklch(58.6% 0.2 260)',    // Divine Indigo
    accent: 'oklch(65.6% 0.19 155)',     // Zikr Green
  },
  radius: { squircle, smooth, full },
  shadows: { soft, ambient },
  motion: { spring, gentle, entry },
}
```

#### Theme System

- **Modes:** `light`, `dark`
- **Activation:** `data-theme` attribute on `<html>`
- **Hook:** `useTheme()` for state and toggle
- **Transitions:** `.theme-transitioning` class (240ms)

### 5.5 PWA & Offline

**Configuration:** `vite.config.ts`

| Setting | Value | Purpose |
|---------|-------|---------|
| `registerType` | `autoUpdate` | Auto-update service worker |
| `devOptions.enabled` | `false` | Disable SW in development |
| `manifest.name` | `Tasbeeh Flow` | App name |
| `manifest.display` | `standalone` | Full-screen PWA |

**Workbox Strategy:**
- Precache: `**/*.{js,css,html,ico,png,svg,woff2}`
- Videos: `NetworkOnly` (no caching)
- Navigate fallback: Denylist for assets/modules

---

## 6. Database Schema

### 6.1 Dexie Tables

**File:** `src/features/tasbeeh/services/tasbeehDb.ts`  
**Database:** `tasbeehFlowDb`  
**Current Version:** 4

#### `tasbeehCollection` (Legacy)

Single-phrase tasbeehs (pre-collections architecture).

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `arabic` | string | Arabic text |
| `transliteration` | string | Latin transliteration |
| `translation` | string \| null | English translation |
| `targetCount` | number | Target count |
| `sortOrder` | number | Display order |
| `isDefault` | boolean | Default selection |
| `isArchived` | boolean | Soft delete |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |
| `syncStatus` | SyncStatus | Sync state |

#### `userProgress`

Active tasbeeh state and streak tracking.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `activeTasbeehId` | string \| null | Current tasbeeh |
| `currentCount` | number | Current count |
| `streakDays` | number | Consecutive days |
| `lastCompletedOn` | string \| null | Last completion date |
| `updatedAt` | string | ISO timestamp |
| `version` | number | Optimistic locking |
| `syncStatus` | SyncStatus | Sync state |

#### `progressEvents`

Event log for analytics and sync.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `tasbeehId` | string | Related tasbeeh |
| `eventType` | `tap` \| `reset` \| `complete` \| `switch` | Event type |
| `delta` | number | Count change |
| `countAfter` | number | Count after event |
| `occurredOn` | string | Event date |
| `createdAt` | string | ISO timestamp |
| `source` | `home` \| `migration` \| `sync` | Event source |
| `syncStatus` | SyncStatus | Sync state |

#### `appConfig`

Application settings storage.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `schemaVersion` | number | Config version |
| `data` | Record<string, unknown> | Settings object |
| `updatedAt` | string | ISO timestamp |
| `syncStatus` | SyncStatus | Sync state |
| `lastSyncedAt` | string \| null | Last sync timestamp |

#### `tasbeehCollections`

Collection groups with scheduling.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `title` | string | Collection name |
| `description` | string \| null | Optional description |
| `scheduleType` | `prayer_specific` \| `anytime_today` | Schedule mode |
| `timesPerDay` | number | Daily repetitions |
| `slots` | PrayerSlot[] \| null | Prayer times |
| `slotExpiryPolicy` | `next_prayer` \| `day_end` | Expiry rule |
| `priority` | `low` \| `normal` \| `high` | Priority level |
| `reminderPolicy` | `off` \| `gentle` \| `strong` | Reminder setting |
| `tags` | string[] | User tags |
| `reference` | TasbeehReference \| null | Source reference |
| `isDefault` | boolean | Default selection |
| `isArchived` | boolean | Soft delete |
| `sortOrder` | number | Display order |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |
| `syncStatus` | SyncStatus | Sync state |

#### `tasbeehPhrases`

Phrase library.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `arabic` | string | Arabic text |
| `transliteration` | string | Latin transliteration |
| `translation` | string \| null | English translation |
| `isNewlyCreated` | boolean | User-created flag |
| `isArchived` | boolean | Soft delete |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |
| `syncStatus` | SyncStatus | Sync state |

#### `collectionItems`

Links phrases to collections.

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Primary key |
| `userId` | string | User identifier |
| `collectionId` | string | Parent collection |
| `phraseId` | string | Linked phrase |
| `role` | `start` \| `main` \| `end` | Position role |
| `targetCount` | number | Target count |
| `sortOrder` | number | Display order |
| `createdAt` | string | ISO timestamp |
| `updatedAt` | string | ISO timestamp |
| `syncStatus` | SyncStatus | Sync state |

### 6.2 Sync Status Flow

```typescript
type SyncStatus = "local" | "pending" | "synced" | "error";
```

```
┌─────────┐     Create/Update      ┌─────────┐
│  local  │ ───────────────────►   │ pending │
└─────────┘                        └─────────┘
     │                                  │
     │ (seeded data)                    │ Sync success
     │                                  ▼
     │                             ┌─────────┐
     │                             │ synced  │
     │                             └─────────┘
     │                                  │
     │                                  │ Local update
     │                                  ▼
     │                             ┌─────────┐
     └─────────────────────────►   │ pending │
                                   └─────────┘
                                        │
                                        │ Sync failure
                                        ▼
                                   ┌─────────┐
                                   │  error  │
                                   └─────────┘
```

### 6.3 Schema Migrations

| Version | Changes |
|---------|---------|
| 1 | Initial: `tasbeehCollection`, `userProgress`, `progressEvents` |
| 2 | Add `userId` to all tables, backfill with `DEVICE_USER_ID` |
| 3 | Add `appConfig` table |
| 4 | Add `tasbeehCollections`, `tasbeehPhrases`, `collectionItems` |

---

## 7. Firebase Integration

### 7.1 Current State

| Component | Status | Notes |
|-----------|--------|-------|
| Firebase App | Initialized | `services/firebase/config.ts` |
| Firebase Auth | SDK Only | `getAuth()` exported, no usage |
| Firestore | SDK Only | `getFirestore()` exported, no usage |
| Sync Service | Placeholder | Functions defined, not implemented |

### 7.2 Authentication Strategy

**Planned Flow:**

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Anonymous  │ ──► │ Email/Google │ ──► │   Verified   │
│    (local)   │     │   Sign-up    │     │    User      │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
   Local only          Link account         Full sync
   (Dexie only)        (migrate data)       (Firestore)
```

**Implementation TODO:**
1. Anonymous auth on first launch
2. Email link / Google sign-in UI
3. Account linking flow
4. Data migration from anonymous to authenticated

### 7.3 Firestore Sync Strategy

**File:** `src/services/sync/collectionsSync.ts`

**Documented Intent:**
- **Local-first**: Writes go to Dexie immediately with `syncStatus: "pending"`
- **Background sync**: Push pending items when online
- **Pull-merge**: Fetch remote changes, merge by `updatedAt`
- **Conflict resolution**: Last-write-wins using `updatedAt` timestamp

**Functions (Placeholder):**

| Function | Purpose |
|----------|---------|
| `syncCollections(userId)` | Full bidirectional sync |
| `syncPendingCollections(userId)` | Push local pending to Firestore |
| `pullCollectionsFromRemote(userId)` | Pull and merge remote changes |
| `hasPendingSync(userId)` | Check for pending items |
| `getPendingSyncCount(userId)` | Count pending by table |
| `markForResync(ids, table)` | Mark items for retry |

### 7.4 Firestore Collection Paths

```typescript
FIRESTORE_PATHS = {
  userCollections: (userId) => `users/${userId}/tasbeehCollections`,
  userPhrases: (userId) => `users/${userId}/tasbeehPhrases`,
  collectionItems: (userId, collectionId) => 
    `users/${userId}/tasbeehCollections/${collectionId}/items`,
}
```

---

## 8. External Services

### 8.1 Firebase

| Service | Status | Configuration |
|---------|--------|---------------|
| Authentication | Planned | Email link, Google OAuth |
| Firestore | Planned | User data sync |
| Analytics | Planned | Usage tracking |
| Hosting | Possible | Alternative to Netlify |

**Environment Variables:**
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID` (optional)

### 8.2 Sentry

| Item | Status |
|------|--------|
| Dependency | Installed (`@sentry/react`) |
| Environment | Documented in `.env.example` |
| Initialization | **Not implemented** |

**TODO:** Initialize Sentry in `main.tsx`:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_SENTRY_ENVIRONMENT,
  enabled: import.meta.env.PROD || import.meta.env.VITE_SENTRY_ENABLE_IN_DEV,
});
```

### 8.3 Islamic API

| Item | Status |
|------|--------|
| Dependency | **Not used** (axios installed but unused) |
| Environment | `VITE_ISLAMIC_API_KEY`, `VITE_ISLAMIC_API_BASE_URL` |
| Implementation | **No code in src/** |

**Planned Features:**
- Asma-ul-Husna (99 Names of Allah)
- Additional dhikr content
- Hadith references

---

## 9. Development

### 9.1 Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite --host` | Development server |
| `build` | `tsc -b && vite build` | Production build |
| `preview` | `vite preview` | Preview production build |
| `typecheck` | `tsc --noEmit` | Type checking |
| `lint` | `eslint .` | Code linting |
| `icons` | `node scripts/generate-app-icons.mjs` | Generate app icons |

### 9.2 Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (via ESLint)
- **Imports**: Sorted, aliased with `@/`
- **Components**: Functional with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables

### 9.3 File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `CollectionComposerForm.tsx` |
| Hooks | camelCase with `use` prefix | `useCollections.ts` |
| Stores | camelCase with `Store` suffix | `tasbeehStore.ts` |
| Repositories | camelCase with `Repository` suffix | `collectionsRepository.ts` |
| Types | PascalCase | `types.ts` |
| Utilities | camelCase | `date.ts` |

### 9.4 Import Conventions

```typescript
// 1. React/external libraries
import React from "react";
import { motion } from "framer-motion";

// 2. Internal aliases (sorted)
import { Button } from "@/shared/design-system/ui/Button";
import { useTheme } from "@/shared/design-system/hooks/useTheme";

// 3. Relative imports
import { useCollectionComposerStore } from "../store/collectionComposerStore";
import type { CreateCollectionDraft } from "../types";
```

---

## 10. Testing

### 10.1 Current State

| Type | Status | Tool |
|------|--------|------|
| Unit Tests | None | - |
| Integration Tests | None | - |
| E2E Tests | None | - |
| Type Checking | Active | TypeScript |
| Linting | Active | ESLint |

### 10.2 Planned Strategy

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Vitest | Repositories, utilities, hooks |
| Component | Vitest + Testing Library | Design system components |
| E2E | Playwright | Critical user flows |

**Priority Test Scenarios:**
1. Collection CRUD operations
2. Phrase CRUD operations
3. Tasbeeh counting flow
4. Offline → Online sync
5. Theme switching

---

## 11. Deployment

### 11.1 Build

```bash
yarn build
```

**Output:** `dist/` directory with:
- Minified JS/CSS bundles
- Service worker
- Manifest
- Static assets

### 11.2 Hosting

**Current Setup:** Netlify-ready

| File | Purpose |
|------|---------|
| `public/_redirects` | SPA fallback (`/* → /index.html 200`) |

**Supported Platforms:**
- Netlify (current)
- Vercel (compatible)
- Firebase Hosting (compatible)

### 11.3 CI/CD

**Current State:** Not configured

**Planned Pipeline:**

```yaml
# .github/workflows/ci.yml (TODO)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: yarn install
      - run: yarn typecheck
      - run: yarn lint
      - run: yarn build
      # - run: yarn test (when tests exist)
```

---

## 12. Technical Debt & Maintenance

### 12.1 Unused Dependencies

| Package | Status | Action |
|---------|--------|--------|
| `axios` | Installed, unused | Remove or implement Islamic API |
| `@sentry/react` | Installed, not initialized | Initialize or remove |

**To audit:**
```bash
# Check for unused dependencies
npx depcheck
```

### 12.2 Dead/WIP Files

| File | Status | Action |
|------|--------|--------|
| `src/pages/Saved.tsx` | Exists, not routed | **Planned feature** - Add to router when ready |

> **Important:** These files should be reviewed periodically to ensure:
> 1. They are either completed and routed
> 2. Or removed if no longer planned
> 3. **Never left in limbo indefinitely**
>
> Add a recurring task to review unrouted files monthly.

### 12.3 Placeholder Implementations

| File | Functions | Status |
|------|-----------|--------|
| `services/sync/collectionsSync.ts` | All functions | Console.info only, need Firebase implementation |

### 12.4 Periodic Review Checklist

Run this checklist **monthly** or before major releases:

- [ ] **Unused files**: Check for unrouted pages, unused components
- [ ] **Unused deps**: Run `npx depcheck`
- [ ] **Placeholder code**: Search for `TODO`, `PLACEHOLDER`, `console.info`
- [ ] **Type errors**: Run `yarn typecheck`
- [ ] **Lint errors**: Run `yarn lint`
- [ ] **Bundle size**: Check `dist/` size after build
- [ ] **Sync status**: Review items stuck in `pending` or `error`
- [ ] **Dead routes**: Compare `pages/` files against `router.tsx`

---

## 13. Contributing

### Workflow

1. Create feature branch from `main`
2. Make changes following code style guidelines
3. Run `yarn typecheck && yarn lint`
4. Test manually in browser (PWA mode if relevant)
5. Create PR with clear description

### Commit Messages

```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- refactor: Code restructure
- docs: Documentation
- style: Formatting
- test: Tests
- chore: Maintenance
```

### PR Checklist

- [ ] Types pass (`yarn typecheck`)
- [ ] Lint passes (`yarn lint`)
- [ ] Tested in browser
- [ ] No console errors/warnings
- [ ] README updated if needed

---

## 14. Troubleshooting

### Common Issues

#### PWA not updating
```bash
# Clear service worker
# In browser DevTools → Application → Service Workers → Unregister
```

#### IndexedDB corruption
```bash
# Clear database
# In browser DevTools → Application → IndexedDB → Delete database
```

#### Build fails with type errors
```bash
yarn typecheck
# Fix reported errors
```

#### Hot reload not working
```bash
# Restart dev server
yarn dev
```

---

## 15. Brand Guidelines

### 15.1 Brand Identity

| Attribute | Value |
|-----------|-------|
| **Name** | Tasbeeh Flow |
| **Short Name** | Tasbeeh |
| **Tagline** | A calm and minimal tasbeeh app for daily dhikr |
| **Personality** | Calm, spiritual, focused, minimal, trustworthy |
| **Design System** | Divine Design System 2.0 |

#### Brand Values

1. **Serenity** — The app should feel peaceful and distraction-free
2. **Spirituality** — Design choices should evoke a sense of connection to the divine
3. **Simplicity** — Every element serves a purpose; no visual clutter
4. **Accessibility** — Usable by all Muslims regardless of language or ability
5. **Reliability** — Works offline, never loses data, always available

### 15.2 Color System

#### Color Format

All colors use **OKLCH** (Oklab Lightness Chroma Hue) for perceptual uniformity and premium color fidelity.

```
oklch(L% C H)
L = Lightness (0-100%)
C = Chroma (0-0.4, saturation)
H = Hue (0-360, color wheel angle)
```

#### Primary Palette

| Name | Value | Usage |
|------|-------|-------|
| **Divine Indigo** | `oklch(58.6% 0.2 260)` | Primary actions, active states, links |
| **Zikr Green** | `oklch(65.6% 0.19 155)` | Accent, success, completion states |

#### Semantic Colors

| Role | Value | Usage |
|------|-------|-------|
| **Success** | `oklch(70% 0.15 150)` | Confirmations, completed actions |
| **Error** | `oklch(60% 0.2 25)` | Errors, destructive actions, warnings |
| **Warning** | `oklch(80% 0.15 85)` | Cautions, pending states |

#### Theme Colors

##### Light Theme (`data-theme="light"`)

| Token | Value | Description |
|-------|-------|-------------|
| `--color-base-100` | `#F6EDDD` | Creamy spiritual background |
| `--color-base-content` | `#2C2C2C` | Primary text |
| `--color-surface-card` | `#FFFFFF` | Card/surface background |

##### Dark Theme (`data-theme="dark"`)

| Token | Value | Description |
|-------|-------|-------------|
| `--color-base-100` | `#1C1E21` | Deep focused background |
| `--color-base-content` | `#EDEDED` | Primary text |
| `--color-surface-card` | `#111214` | Card/surface background |

#### PWA Theme

| Context | Color |
|---------|-------|
| `theme_color` | `#f8fafc` |
| `background_color` | `#f8fafc` |

#### Content Opacity Levels

| Level | Class | Usage |
|-------|-------|-------|
| Base | `text-base-content` | Primary text, headings |
| Muted | `text-base-content/85` | Secondary text |
| Subtle | `text-base-content/60` | Captions, hints, placeholders |

#### Color Usage Rules

1. **Never use raw hex colors** — Always use CSS variables or OKLCH tokens
2. **Maintain contrast** — Text must meet WCAG AA (4.5:1 for body, 3:1 for large text)
3. **Semantic usage** — Use success/error/warning colors only for their intended meaning
4. **Theme-aware** — All colors must work in both light and dark modes

### 15.3 Typography

#### Font Families

| Variable | Font Stack | Usage |
|----------|------------|-------|
| `--font-primary` | Inter, ui-sans-serif, system-ui, sans-serif | Body text, UI elements |
| `--font-display` | Outfit, ui-sans-serif, system-ui, sans-serif | Counters, large numbers |
| `--font-arabic` | Amiri, ui-serif, Georgia, serif | Arabic dhikr text |
| `--font-urdu` | Noto Nastaliq Urdu, serif | Urdu text |

#### Typography Classes

| Class | Properties | Usage |
|-------|------------|-------|
| `.text-display-arabic` | Amiri, 4xl-6xl, line-height 1.8 | Arabic dhikr display |
| `.text-display-urdu` | Noto Nastaliq, 3xl-5xl, line-height 2.2 | Urdu text display |
| `.text-counter` | Outfit, black weight, tabular-nums | Numeric counters |
| `.text-heading` | Sans, semibold, tight tracking | Section headings |

#### Text Component Variants

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `display` | 2xl+ | Bold | Hero text, large titles |
| `heading` | lg-xl | Semibold | Section headers |
| `body` | base | Normal | Body text, descriptions |
| `caption` | sm | Normal/Medium | Labels, hints, metadata |

#### Typography Rules

1. **Arabic text** — Always use `--font-arabic` with generous line-height (1.8+)
2. **Numbers** — Use `--font-display` with `tabular-nums` for aligned digits
3. **Hierarchy** — Maximum 3 levels of text hierarchy per screen
4. **Readability** — Body text minimum 16px, line-height 1.5+

### 15.4 Iconography

#### Icon Library

| Library | Package | Usage |
|---------|---------|-------|
| **Primary** | `lucide-react` | UI icons, actions, navigation |
| **Supplementary** | `@phosphor-icons/react` | Additional icons when needed |

#### Icon Sizes

| Size | Pixels | Usage |
|------|--------|-------|
| `xs` | 12px | Inline indicators, badges |
| `sm` | 14-16px | Buttons, list items |
| `md` | 18-20px | Navigation, primary actions |
| `lg` | 24px | Empty states, feature icons |
| `xl` | 32px+ | Hero illustrations |

#### Icon Usage Rules

1. **Consistency** — Use Lucide as primary; only use Phosphor for missing icons
2. **Stroke width** — Default stroke width (2px), never modify
3. **Color** — Icons inherit text color; use `currentColor`
4. **Accessibility** — Always pair icons with text labels or `aria-label`

### 15.5 Motion & Animation

#### Motion Tokens

```typescript
// Spring animation (primary)
spring: {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 1,
}

// Gentle spring (subtle)
gentle: {
  type: "spring",
  stiffness: 150,
  damping: 20,
}

// Entry animation (page/modal)
entry: {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1],  // Custom ease-out
}
```

#### Animation Durations

| Type | Duration | Usage |
|------|----------|-------|
| Micro | 100-150ms | Button press, hover states |
| Short | 200-250ms | Toggles, small reveals |
| Medium | 300-400ms | Drawers, modals, page transitions |
| Long | 500ms+ | Complex sequences, celebrations |

#### Theme Transitions

```css
.theme-transitioning {
  transition-property: background-color, border-color, color, fill, stroke, box-shadow;
  transition-duration: 240ms;
  transition-timing-function: ease-in-out;
}
```

#### Motion Rules

1. **Respect preferences** — Check `prefers-reduced-motion` and disable animations
2. **Purpose** — Every animation should communicate state change or guide attention
3. **Performance** — Animate only `transform` and `opacity` when possible
4. **Consistency** — Use motion tokens; don't invent custom timing

### 15.6 Spacing & Layout

#### Spacing Scale

Uses Tailwind's default spacing scale (4px base unit):

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight gaps, icon margins |
| `2` | 8px | Small gaps, button padding |
| `3` | 12px | Standard gaps |
| `4` | 16px | Section padding, card padding |
| `6` | 24px | Large gaps, section margins |
| `8` | 32px | Major section breaks |

#### Layout Constraints

| Element | Value | Purpose |
|---------|-------|---------|
| Max content width | `480px` | Mobile-first viewport |
| Card corner radius | `28px` | Squircle appearance |
| Button corner radius | `100px` (pill) or `10-18px` | Depends on context |
| Safe area bottom | `env(safe-area-inset-bottom)` | iOS home indicator |

#### Squircle Radii

| Variable | Value | Usage |
|----------|-------|-------|
| `--radius-squircle` | 22px | Default squircle radius |
| `cornerSmoothing` | 0.9-0.92 | Squircle smoothing factor |

### 15.7 Component Patterns

#### Card Pattern

```tsx
<Squircle cornerRadius={28} cornerSmoothing={0.92} className="surface-card p-4">
  {/* content */}
</Squircle>
```

#### Button Variants

| Variant | Usage |
|---------|-------|
| Primary (solid) | Main actions, CTAs |
| Ghost | Secondary actions, toolbar items |
| Outline | Tertiary actions, toggles |

#### Form Inputs

- Use `TextInput` component with `variant="bordered"` or `variant="ghost"`
- Background: `bg-base-200` or `bg-base-content/5`
- Border: `border-base-300` or `border-base-content/10`

#### Drawer/Bottom Sheet

- Snap points: `["auto"]` for content-height, specific percentages for fixed heights
- Corner radius: Large (28px+) at top
- Backdrop: Semi-transparent overlay

### 15.8 Voice & Tone

#### Writing Principles

1. **Calm** — Use gentle, unhurried language
2. **Respectful** — Honor the spiritual nature of the content
3. **Clear** — Simple words, short sentences
4. **Encouraging** — Celebrate progress without being excessive

#### UI Copy Guidelines

| Context | Example | Notes |
|---------|---------|-------|
| Empty state | "Start your dhikr journey" | Inviting, not demanding |
| Success | "Alhamdulillah, completed!" | Authentic Islamic expressions |
| Error | "Something went wrong" | Calm, not alarming |
| Loading | "Loading…" | Simple ellipsis, no spinny words |

#### Islamic Terminology

| Term | Usage |
|------|-------|
| Dhikr | Preferred over "recitation" for remembrance |
| Tasbeeh | Use for the counting practice |
| Alhamdulillah | For celebration/completion moments |
| InshaAllah | For future-oriented messaging (sparingly) |

#### Avoid

- Gamification language ("streak!", "achievement unlocked!")
- Pressure tactics ("Don't break your streak!")
- Overly casual tone ("Hey!", "Awesome!")
- Complex religious terminology without context

---

## 16. User Flows

### 16.1 Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              APP ENTRY                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                            ┌───────────────┐
                            │    Splash     │
                            │    Screen     │
                            └───────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
            ┌───────────────┐               ┌───────────────┐
            │  First Time?  │───── Yes ────►│  Onboarding   │
            │   (check)     │               │    Flow       │
            └───────────────┘               └───────────────┘
                    │                               │
                    │ No                            │
                    ▼                               ▼
            ┌─────────────────────────────────────────────────┐
            │                    HOME                          │
            │  ┌─────────────────────────────────────────┐    │
            │  │         Active Tasbeeh Counter          │    │
            │  │              Streak Display              │    │
            │  │            Collection Info               │    │
            │  └─────────────────────────────────────────┘    │
            └─────────────────────────────────────────────────┘
                                    │
            ┌───────────┬───────────┼───────────┬───────────┐
            ▼           ▼           ▼           ▼           ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
      │  Stats   │ │Collection│ │ Tasbeeh  │ │ Settings │ │  (More)  │
      │          │ │   List   │ │ Counting │ │          │ │          │
      └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

### 16.2 First-Time User Flow

**Trigger:** App opened for the first time (onboarding not completed)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Splash    │────►│  Onboarding  │────►│  Onboarding  │────►│  Onboarding  │
│    Screen    │     │   Slide 1    │     │   Slide 2    │     │   Slide 3    │
│   (2-3 sec)  │     │  (Welcome)   │     │  (Features)  │     │  (Get Start) │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                                       │
                                                                       ▼
                                                               ┌──────────────┐
                                                               │     Home     │
                                                               │   (Ready!)   │
                                                               └──────────────┘
```

| Step | Screen | Actions | Data Changes |
|------|--------|---------|--------------|
| 1 | Splash | Auto-advance after animation | Check `onboardingStore.completed` |
| 2 | Onboarding Slide 1 | Swipe/tap to continue | None |
| 3 | Onboarding Slide 2 | Swipe/tap to continue | None |
| 4 | Onboarding Slide 3 | Tap "Get Started" | Set `onboardingStore.completed = true` |
| 5 | Home | Begin using app | Bootstrap default collections (Tasbeeh Fatima) |

**Exit Points:**
- Skip button (if implemented) → Home
- Complete onboarding → Home

### 16.3 Returning User Flow

**Trigger:** App opened with onboarding already completed

```
┌──────────────┐     ┌──────────────┐
│    Splash    │────►│     Home     │
│    Screen    │     │              │
│   (1-2 sec)  │     │  - Counter   │
└──────────────┘     │  - Streak    │
                     │  - Actions   │
                     └──────────────┘
```

| Step | Screen | Actions | Data Changes |
|------|--------|---------|--------------|
| 1 | Splash | Auto-advance | Hydrate stores from IndexedDB |
| 2 | Home | Ready to count | Load active tasbeeh, streak |

**State Restoration:**
- `useTasbeehStore` hydrates from localStorage
- `useSettingsStore` hydrates from IndexedDB
- Theme applied from saved preference

### 16.4 Tasbeeh Counting Flow

**Trigger:** User on Home screen with active tasbeeh

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HOME SCREEN                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                     STREAK DISPLAY                             │  │
│  │                    "🔥 5 day streak"                           │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                   TASBEEH COUNTER CARD                         │  │
│  │                                                                 │  │
│  │    ┌─────────────────────────────────────────────────────┐    │  │
│  │    │              سُبْحَانَ ٱللَّٰهِ                        │    │  │
│  │    │               SubhanAllah                            │    │  │
│  │    │           "Glory be to Allah"                        │    │  │
│  │    └─────────────────────────────────────────────────────┘    │  │
│  │                                                                 │  │
│  │                    ┌───────────┐                               │  │
│  │                    │    27     │  ← Current count              │  │
│  │                    │   / 33    │  ← Target                     │  │
│  │                    └───────────┘                               │  │
│  │                                                                 │  │
│  │    ┌─────────┐              ┌─────────┐                       │  │
│  │    │  Reset  │              │  Undo   │                       │  │
│  │    └─────────┘              └─────────┘                       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│                         TAP ANYWHERE TO COUNT                        │
└─────────────────────────────────────────────────────────────────────┘
```

#### Counting Actions

| Action | Trigger | Effect | Data Changes |
|--------|---------|--------|--------------|
| **Count +1** | Tap counter area | Increment count, haptic feedback | `progressEvents.tap`, `userProgress.currentCount++` |
| **Reset** | Tap reset button | Reset to 0 | `progressEvents.reset`, `userProgress.currentCount = 0` |
| **Undo** | Tap undo button | Revert last action | Restore previous count |
| **Complete** | Reach target | Celebration animation, advance to next | `progressEvents.complete`, update streak |

#### Completion Sub-flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Count = 33  │────►│ Celebration  │────►│ Next Phrase  │
│  (target)    │     │  Animation   │     │  or Done     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                            ┌────────────────────┴────────────────────┐
                            ▼                                         ▼
                    ┌──────────────┐                          ┌──────────────┐
                    │ Next phrase  │                          │  Collection  │
                    │ in collection│                          │  Complete!   │
                    └──────────────┘                          └──────────────┘
                                                                      │
                                                                      ▼
                                                              ┌──────────────┐
                                                              │ Update Streak│
                                                              │ +1 if daily  │
                                                              └──────────────┘
```

### 16.5 Collection Management Flow

#### 16.5.1 View Collections

**Entry:** Bottom nav → Collections tab

```
┌─────────────────────────────────────────────────────────────────────┐
│                        COLLECTIONS SCREEN                            │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ACTIVE COLLECTION                                             │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  📿 Tasbeeh Fatima                                      │  │  │
│  │  │  5 prayers • 3 phrases • High priority                  │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  OTHER COLLECTIONS                                             │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Morning Adhkar                                         │  │  │
│  │  │  Anytime • 5 phrases                                    │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────┐  │  │
│  │  │  Evening Adhkar                                         │  │  │
│  │  └─────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│                    ┌─────────────────────┐                          │
│                    │   + New Collection  │                          │
│                    └─────────────────────┘                          │
└─────────────────────────────────────────────────────────────────────┘
```

| Action | Result |
|--------|--------|
| Tap collection card | Select as active, navigate to Home |
| Tap "+ New Collection" | Navigate to Collection Composer |

#### 16.5.2 Create Collection

**Entry:** Collections → "+ New Collection"

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Collections │────►│   Composer   │────►│  Add Items   │────►│    Save      │
│    Screen    │     │  Basic Info  │     │  (Phrases)   │     │  Collection  │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                            │                    │                     │
                            ▼                    ▼                     ▼
                     ┌─────────────┐      ┌─────────────┐       ┌─────────────┐
                     │ - Title     │      │ - Pick from │       │ Dexie write │
                     │ - Descript. │      │   library   │       │ syncStatus: │
                     │ - Schedule  │      │ - Create    │       │  "pending"  │
                     │ - Priority  │      │   new       │       └─────────────┘
                     │ - Tags      │      │ - Set count │
                     │ - Reference │      │ - Set role  │
                     └─────────────┘      └─────────────┘
```

**Composer Form Steps:**

| Section | Fields | Required |
|---------|--------|----------|
| **Basics** | Title, Description | Title only |
| **Schedule** | Type (prayer-specific/anytime), Slots, Times per day | Yes |
| **Items** | Phrases with role (start/main/end) and target count | Min 1 item |
| **Advanced** | Expiry, Priority, Reminders, Tags, Reference | All optional |

**Phrase Selection Sub-flow:**

```
┌──────────────┐     ┌──────────────────────────────────────┐
│  + Add Item  │────►│          ADD ITEM DRAWER              │
└──────────────┘     │  ┌────────────────────────────────┐  │
                     │  │  Pick from library             │  │
                     │  │  ┌────────────────────────┐    │  │
                     │  │  │ SubhanAllah           │    │  │
                     │  │  │ Alhamdulillah         │    │  │
                     │  │  │ Allahu Akbar          │    │  │
                     │  │  │ + Create new phrase   │    │  │
                     │  │  └────────────────────────┘    │  │
                     │  └────────────────────────────────┘  │
                     │                                      │
                     │  Role: [Start] [Main] [End]          │
                     │  Target count: [___33___]            │
                     │                                      │
                     │  ┌────────────────────────────────┐  │
                     │  │         Add to Draft           │  │
                     │  └────────────────────────────────┘  │
                     └──────────────────────────────────────┘
```

### 16.6 Settings Flow

**Entry:** Bottom nav → Settings tab

```
┌─────────────────────────────────────────────────────────────────────┐
│                         SETTINGS HUB                                 │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  APPEARANCE                                                    │  │
│  │  ├── Theme: [Light / Dark / System]                           │  │
│  │  └── Haptic feedback: [On / Off]                              │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  ACCOUNT                                                       │  │
│  │  ├── Profile ─────────────────────────────────────────► [>]   │  │
│  │  └── Sign in (sync your data) ────────────────────────► [>]   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  SUPPORT                                                       │  │
│  │  ├── Send feedback ───────────────────────────────────► [>]   │  │
│  │  └── About ───────────────────────────────────────────► [>]   │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

| Route | Screen | Purpose |
|-------|--------|---------|
| `/settings` | Settings Hub | Main settings navigation |
| `/settings/profile` | Profile | User info, display name |
| `/settings/feedback` | Feedback | Bug reports, feature requests |
| `/settings/about` | About | Version, licenses, credits |

### 16.7 Authentication Flow (Planned)

**Status:** Not yet implemented

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Settings   │────►│  Sign In     │────►│   Choose     │────►│  Verify &    │
│   Account    │     │   Prompt     │     │   Method     │     │   Link       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
                                                │
                            ┌───────────────────┼───────────────────┐
                            ▼                   ▼                   ▼
                     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
                     │ Email Link  │     │   Google    │     │   Apple     │
                     │             │     │   OAuth     │     │   Sign In   │
                     └─────────────┘     └─────────────┘     └─────────────┘
                            │                   │                   │
                            └───────────────────┼───────────────────┘
                                                ▼
                                        ┌─────────────┐
                                        │  Account    │
                                        │  Linked!    │
                                        │             │
                                        │ - Migrate   │
                                        │   local data│
                                        │ - Enable    │
                                        │   sync      │
                                        └─────────────┘
```

**Planned Implementation:**

| Step | Action | Technical |
|------|--------|-----------|
| 1 | Anonymous session | `signInAnonymously()` on first launch |
| 2 | Choose auth method | Show options: Email link, Google, Apple |
| 3 | Complete auth | Firebase Auth flow |
| 4 | Link accounts | `linkWithCredential()` to preserve data |
| 5 | Enable sync | Switch `userId` from `DEVICE_USER_ID` to Firebase UID |

### 16.8 Sync Flow (Planned)

**Status:** Placeholder implemented, not functional

```
┌─────────────────────────────────────────────────────────────────────┐
│                          SYNC LIFECYCLE                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐                                        ┌──────────────┐
│    LOCAL     │                                        │   FIREBASE   │
│    DEXIE     │                                        │  FIRESTORE   │
└──────────────┘                                        └──────────────┘
       │                                                       │
       │  1. User creates/updates                              │
       ▼                                                       │
┌──────────────┐                                               │
│ Write to DB  │                                               │
│ syncStatus:  │                                               │
│  "pending"   │                                               │
└──────────────┘                                               │
       │                                                       │
       │  2. Sync trigger (online, manual, periodic)           │
       ▼                                                       │
┌──────────────┐     3. Push pending      ┌──────────────┐    │
│ Collect all  │─────────────────────────►│   Batch      │    │
│   pending    │                          │   Write      │    │
│    items     │                          └──────────────┘    │
└──────────────┘                                  │            │
       │                                          │            │
       │                                          ▼            │
       │                                   ┌──────────────┐    │
       │                                   │   Success?   │    │
       │                                   └──────────────┘    │
       │                                     │           │     │
       │                              Yes ───┘           └─── No
       │                                │                     │
       ▼                                ▼                     ▼
┌──────────────┐                 ┌──────────────┐     ┌──────────────┐
│ Update local │◄────────────────│ syncStatus:  │     │ syncStatus:  │
│  syncStatus  │                 │   "synced"   │     │   "error"    │
└──────────────┘                 └──────────────┘     └──────────────┘
       │
       │  4. Pull remote changes
       ▼
┌──────────────┐     5. Fetch newer      ┌──────────────┐
│  Query for   │◄────────────────────────│   Remote     │
│   updates    │      (by updatedAt)     │    Data      │
└──────────────┘                         └──────────────┘
       │
       │  6. Merge with conflict resolution (LWW)
       ▼
┌──────────────┐
│ Update local │
│    Dexie     │
└──────────────┘
```

**Sync Triggers:**

| Trigger | When | Priority |
|---------|------|----------|
| App foreground | App becomes active | High |
| Manual | User taps "Sync now" | High |
| Periodic | Every 15-30 minutes if online | Low |
| After mutation | After local write (debounced) | Medium |

**Conflict Resolution:**

```
Local: { id: "123", title: "A", updatedAt: "2026-04-18T10:00:00Z" }
Remote: { id: "123", title: "B", updatedAt: "2026-04-18T10:05:00Z" }

Result: Remote wins (later updatedAt)
Final: { id: "123", title: "B", updatedAt: "2026-04-18T10:05:00Z" }
```

---

## 17. Glossary

| Term | Definition |
|------|------------|
| **Tasbeeh** | Islamic practice of reciting phrases in remembrance of Allah |
| **Dhikr** | Remembrance of Allah through recitation |
| **Collection** | A grouped set of phrases with schedule and settings |
| **Phrase** | A single dhikr text (Arabic + transliteration + translation) |
| **Slot** | A prayer time (Fajr, Dhuhr, Asr, Maghrib, Isha) |
| **Streak** | Consecutive days of completing dhikr |
| **Squircle** | Superellipse shape (rounded square) used in design system |
| **PWA** | Progressive Web App - installable web application |
| **Dexie** | IndexedDB wrapper library for local storage |
| **Sync Status** | State tracking for local-to-cloud synchronization |
| **OKLCH** | Perceptually uniform color space (Lightness, Chroma, Hue) |
| **Divine Indigo** | Primary brand color (`oklch(58.6% 0.2 260)`) |
| **Zikr Green** | Accent brand color (`oklch(65.6% 0.19 155)`) |
| **LWW** | Last-Write-Wins conflict resolution strategy |

---

## 18. Changelog

### [Unreleased]

#### Added
- Comprehensive README documentation
- Collection composer form with full field support
- Consolidated useForm for collection creation
- Repository functions: `updateCollection`, `archiveCollection`
- Sync service placeholder structure
- Type exports: `CreateCollectionDraft`, `UpdateCollectionDraft`

#### Changed
- `CreateCollectionDraft` now includes all form fields
- `createCollection` accepts full parameters

#### Technical Debt Documented
- Unused dependencies (axios, @sentry/react)
- Unrouted page (Saved.tsx)
- Placeholder sync functions

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Routes | `src/app/router.tsx` |
| DB Schema | `src/features/tasbeeh/services/tasbeehDb.ts` |
| Collections CRUD | `src/features/tasbeeh/services/collectionsRepository.ts` |
| Sync Service | `src/services/sync/collectionsSync.ts` |
| Design System | `src/shared/design-system/` |
| Theme | `src/shared/design-system/hooks/useTheme.ts` |
| Global Styles | `src/shared/styles/global.css` |
| Types | `src/features/tasbeeh/collections/types.ts` |

### Key Commands

```bash
yarn dev          # Start development
yarn build        # Production build
yarn typecheck    # Check types
yarn lint         # Lint code
```

---

**Last Updated:** 2026-04-18  
**Maintainer:** <!-- Add your name/handle -->  
**License:** Private
