import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/firebase/auth";
import { APP_ROUTES } from "@/shared/routes";

import { Loading } from "@/shared/design-system";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard protects routes that require authentication.
 * For now, we allow access but this component is ready to enforce
 * authentication once the static flag or actual auth state is wired.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    // Redirect to signin but save the attempted location
    return (
      <Navigate to={APP_ROUTES.SIGNIN} state={{ from: location }} replace />
    );
  }

  // Enforce email verification for non-anonymous (email/social) users
  if (isAuthenticated && !user?.isAnonymous && !user?.emailVerified) {
    return <Navigate to={APP_ROUTES.VERIFY_EMAIL} replace />;
  }

  return <>{children}</>;
};
