import { Navigate, Outlet } from "react-router-dom";
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
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
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
      className="relative z-1 flex min-h-dvh w-full flex-col bg-base-300 px-3 pt-4 pb-[calc(120px+env(safe-area-inset-bottom,20px))]"
      id="app"
    >
      <Outlet />
      <BottomNav />
    </div>
  );
}
