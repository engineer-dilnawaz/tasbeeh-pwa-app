import { FacebookAuthProvider, signInWithPopup, type Auth, type UserCredential } from "firebase/auth";

const provider = new FacebookAuthProvider();

export function signInWithFacebook(auth: Auth): Promise<UserCredential> {
  return signInWithPopup(auth, provider);
}
