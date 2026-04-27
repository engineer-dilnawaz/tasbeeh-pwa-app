# Auth Architecture

This document defines how user identity and data isolation are handled in the Divine Tasbeeh system.

## Core Rule (STRICT)

**All data in the system MUST be scoped to a user.**

There is no concept of "global" or "anonymous" data for production features. Every piece of zikr progress belongs to a specific `userId`.

## Pattern

```
userId → tasbeehList
```

- **Zustand Store**: Must contain a `userId` property.
- **Persistence Layer**: Must include `userId` in keys or paths (e.g., Firestore document path `/users/{userId}/tasbeeh`).
- **Offline Storage**: Must partition data by `userId` to prevent data leakage between users on shared devices.

## Firestore Security Rules (REQUIRED)

To resolve the `Missing or insufficient permissions` error, apply these rules in the Firebase Console:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write only their own document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Temporary Rule for Dev/Mock Testing
      // allow read, write: if userId == "mock-user-123"; 
    }
  }
}
```

## Auth Flow

1. App Mounts.
2. Check `getCurrentUser()` session.
3. If user exists:
   - Update `userId` in Zustand.
   - Trigger `hydrate()` for that specific user.
4. If user does NOT exist:
   - Redirect to Login/Signup.
   - Block zikr features.

## Security

- No sensitive data (passwords, tokens) should ever enter the Zustand store.
- Use Firebase Security Rules to enforce that only `userId` owners can read/write their data.
