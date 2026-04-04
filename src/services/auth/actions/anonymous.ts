import { signInAnonymously, type Auth, type UserCredential } from "firebase/auth";

export function signInAnonymouslyUser(auth: Auth): Promise<UserCredential> {
  return signInAnonymously(auth);
}
