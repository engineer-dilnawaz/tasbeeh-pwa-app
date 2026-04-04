import { Navigate, Outlet } from "react-router-dom";
import { BottomNav } from "@/app/layout/BottomNav";
import { useAuth } from "@/services/auth/useAuth";
import { Loader2 } from "lucide-react";

export function AppLayout() {
  const { user, status } = useAuth();

  // 1. If we are still loading the Firebase Auth state, 
  // show a minimal centered loader to prevent "flashes" of content.
  if (status === "loading") {
    return (
      <div style={{ 
        height: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--bg-primary)"
      }}>
        <Loader2 className="animate-spin" size={40} color="var(--accent)" style={{ opacity: 0.5 }} />
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
    <div className="app app--with-bottom-nav" id="app">
      <Outlet />
      <BottomNav />
    </div>
  );
}
