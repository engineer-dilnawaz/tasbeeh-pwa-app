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
  type User 
} from "firebase/auth";
import { auth } from "./config";
import { useEffect, useState } from "react";

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

/**
 * Signs in the user using Google Popup.
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
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
  } catch (error) {
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
 */
export async function signUpWithEmail(email: string, pass: string, name: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(result.user, { displayName: name });
    return result.user;
  } catch (error) {
    console.error("Auth: Email Sign Up Error", error);
    throw error;
  }
}

/**
 * Generates a random meaningful name for guest users.
 */
export function generateRandomGuestName() {
  const adjectives = ["Peaceful", "Silent", "Grateful", "Calm", "Radiant", "Pure", "Humble", "Serene"];
  const nouns = ["Traveler", "Soul", "Seeker", "Heart", "Breeze", "Light", "Bloom", "Echo"];
  
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
      const guestName = generateRandomGuestName();
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

/**
 * useAuth hook — Subscribes to Firebase auth state.
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
