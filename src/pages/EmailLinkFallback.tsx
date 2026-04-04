import { Navigate } from "react-router-dom";

/** Normalizes `/auth/email-link` when opened without a magic link (completion runs in AuthProvider first). */
export default function EmailLinkFallback() {
  return <Navigate to="/home" replace />;
}
