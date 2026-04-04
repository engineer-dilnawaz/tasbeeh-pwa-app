import { Outlet } from "react-router-dom";
import { BottomNav } from "@/app/layout/BottomNav";

export function AppLayout() {
  return (
    <div className="app app--with-bottom-nav" id="app">
      <Outlet />
      <BottomNav />
    </div>
  );
}
