import { GoogleAuthProvider, signInWithPopup, type Auth, type UserCredential } from "firebase/auth";

const provider = new GoogleAuthProvider();

export function signInWithGoogle(auth: Auth): Promise<UserCredential> {
  return signInWithPopup(auth, provider);
}
