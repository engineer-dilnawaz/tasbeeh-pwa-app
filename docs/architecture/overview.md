# Architecture Overview

This project follows a scalable, feature-based architecture with a strong design system foundation.

## Principles

- Keep components small and reusable
- Prefer composition over inheritance
- Avoid premature optimization
- Build MVP first, then iterate

## Folder Responsibilities

- app → app-level setup (providers, navigation)
- design-system → reusable UI system (DAS)
- features → domain-specific logic (tasbeeh, stats, etc.)
- services → external integrations (firebase, db)
- shared → reusable utilities (hooks, utils)
- store → global state (zustand)

## Rules

- No component should exceed 200 lines
- No direct Firebase calls inside UI components
- Use hooks for logic separation
- All UI must use design-system components

## Import Discipline

- Never import the React namespace (`import React from 'react'`).
- Always use named hook imports (`import { useState } from 'react'`).
- Always use `import type` for TypeScript-only imports (interfaces/types).
- No unused imports allowed.
