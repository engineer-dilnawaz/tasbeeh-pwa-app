import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export function registerWithEmailPassword(
  auth: Auth,
  email: string,
  password: string,
): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}

export function signInWithEmailPassword(
  auth: Auth,
  email: string,
  password: string,
): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email.trim(), password);
}

export function requestPasswordResetEmail(auth: Auth, email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email.trim());
}
