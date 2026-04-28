import { Outlet } from "react-router-dom";

import { AppBottomTabs } from "@/shared/components";

export function AppTabsLayout() {
  return (
    <>
      <Outlet />
      <AppBottomTabs />
    </>
  );
}

