import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/services/firebase/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard protects routes that require authentication.
 * For now, we allow access but this component is ready to enforce
 * authentication once the static flag or actual auth state is wired.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const isAuthenticated = !!user;
  const location = useLocation();

  // Static flag to toggle protection for development/testing
  const IS_PROTECTION_ENABLED = true;

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-base-100">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (IS_PROTECTION_ENABLED && !isAuthenticated) {
    // Redirect to signin but save the attempted location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
