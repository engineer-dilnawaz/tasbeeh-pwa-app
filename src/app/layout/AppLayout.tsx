import { Navigate, Outlet } from "react-router-dom";
import { AppShellHeader } from "@/app/layout/AppShellHeader";
import { BottomNav } from "@/app/layout/BottomNav";
import { useAuth } from "@/services/auth/useAuth";
import { twUi } from "@/shared/lib/twUi";
import { Loader2 } from "lucide-react";

export function AppLayout() {
  const { user, status } = useAuth();

  // 1. If we are still loading the Firebase Auth state,
  // show a minimal centered loader to prevent "flashes" of content.
  if (status === "loading") {
    return (
      <div className="bg-base-100 flex h-screen items-center justify-center">
        <Loader2
          className={`animate-spin opacity-50 ${twUi.accentText}`}
          size={40}
          aria-hidden
        />
      </div>
    );
  }

  // 2. If Auth is ready but there's no user,
  // kick them back to the Sign In page.
  if (!user && status === "ready") {
    return <Navigate to="/sign-in" replace />;
  }

  // 3. Otherwise, render the app shell + content
  return (
    <div
      className="relative z-1 flex min-h-dvh w-full flex-col bg-base-100 pb-[calc(120px+env(safe-area-inset-bottom,20px))]"
      id="app"
    >
      <AppShellHeader />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
