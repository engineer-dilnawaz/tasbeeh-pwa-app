import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthStatus = "unconfigured" | "loading" | "ready";

export type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  lastError: string | null;
  clearLastError: () => void;
  signInEmailPassword: (email: string, password: string) => Promise<void>;
  registerEmailPassword: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  requestPasswordResetEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
