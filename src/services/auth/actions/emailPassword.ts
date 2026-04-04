import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export async function registerWithEmailPassword(
  auth: Auth,
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
): Promise<UserCredential> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (firstName || lastName) {
    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    await updateProfile(cred.user, { displayName: fullName });
  }
  return cred;
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
