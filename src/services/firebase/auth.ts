import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  reload,
  type User,
} from "firebase/auth";
import { auth } from "./config";
import { useEffect, useState } from "react";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/**
 * Signs in the user using Google Popup.
 * Handles account linking if an account exists with a different credential.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === "auth/account-exists-with-different-credential") {
      // In this case, we have the user's credential that they tried to sign in with.
      // We should ideally prompt them to sign in with their existing provider, 
      // then link the two accounts. 
      // However, with "Link accounts that use the same email" enabled in dashboard,
      // Google (a trusted provider) usually handles this automatically.
      console.warn("Account exists with different credential. Linking might be required or handled by Firebase.");
    }
    console.error("Auth: Google Sign In Error", error);
    throw error;
  }
}

/**
 * Signs in the user using Facebook Popup.
 */
export async function signInWithFacebook() {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return result.user;
  } catch (error: any) {
    if (error.code === "auth/account-exists-with-different-credential") {
      console.warn("Account exists with different credential. Facebook requires manual linking usually.");
    }
    console.error("Auth: Facebook Sign In Error", error);
    throw error;
  }
}

/**
 * Signs in using Email and Password.
 */
export async function signInWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error) {
    console.error("Auth: Email Sign In Error", error);
    throw error;
  }
}

/**
 * Sends a password reset email to the specified address.
 */
export async function sendPasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Auth: Password Reset Error", error);
    throw error;
  }
}

/**
 * Registers a new user with Email, Password and Display Name.
 * Automatically sends a verification email.
 */
export async function signUpWithEmail(
  email: string,
  pass: string,
  name: string,
) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    // Automatically send verification email on sign up
    await sendEmailVerification(result.user);
    return result.user;
  } catch (error) {
    console.error("Auth: Email Sign Up Error", error);
    throw error;
  }
}

/**
 * Manually sends a verification email to the current user.
 */
export async function sendVerificationEmail() {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
  }
}

/**
 * Reloads the user's data from Firebase to check for updated fields like emailVerified.
 */
export async function reloadUser() {
  const user = auth.currentUser;
  if (user) {
    await reload(user);
    return auth.currentUser;
  }
  return null;
}

/**
 * Generates a random meaningful name for guest users.
 */
export function generateRandomGuestName() {
  const adjectives = [
    "Peaceful",
    "Silent",
    "Grateful",
    "Calm",
    "Radiant",
    "Pure",
    "Humble",
    "Serene",
  ];
  const nouns = [
    "Traveler",
    "Soul",
    "Seeker",
    "Heart",
    "Breeze",
    "Light",
    "Bloom",
    "Echo",
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}`;
}

/**
 * Signs in Anonymously (Guest Mode).
 */
export async function signInAsGuest() {
  try {
    const result = await signInAnonymously(auth);

    // Only update profile if it's a new anonymous user (no display name yet)
    if (!result.user.displayName) {
      await updateProfile(result.user, {
        displayName: "Guest",
        // We use photoURL or a custom field for the "meaningful" handle if needed,
        // but for now let's just set the display name as "Guest" and
        // return the guestName so the caller can use it for username.
      });
      // We can't easily return extra data from here without changing signature,
      // but we can return the user and the caller can handle the rest.
    }

    return result.user;
  } catch (error) {
    console.error("Auth: Guest Sign In Error", error);
    throw error;
  }
}

/**
 * Signs out the current user.
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Auth: Sign Out Error", error);
    throw error;
  }
}

import { getUserProfile, createUserProfile } from "./userService";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

/**
 * useAuth hook — Subscribes to Firebase auth state and synchronizes profiles.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (u) {
        try {
          // Attempt to fetch existing profile
          const profile = await getUserProfile(u.uid);

          if (!profile) {
            // First time login: Create profile with current local settings
            const currentSettings = useSettingsStore.getState();
            await createUserProfile(u.uid, {
              email: u.email || "",
              profile: {
                ...currentSettings.profile,
                displayName: (currentSettings.profile.displayName === "Guest" && u.displayName) 
                  ? u.displayName 
                  : currentSettings.profile.displayName,
                email: u.email || currentSettings.profile.email,
              },
              settings: {
                appearance: currentSettings.appearance,
                interaction: currentSettings.interaction,
                notifications: currentSettings.notifications,
                language: currentSettings.language,
              },
              metadata: {
                isAnonymous: u.isAnonymous,
              },
            });
          } else {
            // Existing user: Hydrate local store with cloud data
            // Note: We can implement more complex merging here if needed
            useSettingsStore.setState({
              profile: profile.profile,
              appearance: profile.settings.appearance,
              interaction: profile.settings.interaction,
              notifications: profile.settings.notifications,
              language: profile.settings.language,
            });
          }
        } catch (error) {
          console.error("AuthSync: Failed to sync user profile", error);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
