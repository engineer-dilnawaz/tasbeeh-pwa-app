import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "./config";

/**
 * Firebase Auth Service
 * 
 * Manages user authentication sessions and provides simple wrappers
 * for login, signup, and session detection.
 */
const auth = getAuth(app);

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signup = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const getCurrentUser = () => auth.currentUser;

export const onAuthChange = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};
