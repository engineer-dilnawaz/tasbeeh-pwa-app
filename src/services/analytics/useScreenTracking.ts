import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackScreenView } from "./track";

/** Fires `screen_view` when the route pathname changes. Use inside `BrowserRouter`. */
export function useScreenTracking(): void {
  const { pathname } = useLocation();

  useEffect(() => {
    trackScreenView(pathname || "/");
  }, [pathname]);
}
