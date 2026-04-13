import { RouterProvider } from "react-router-dom";
import { router } from "@/app/router";
import { ScreenWrapper } from "@/app/layout/ScreenWrapper";

export default function App() {
  return (
    <ScreenWrapper>
      <RouterProvider router={router} />
    </ScreenWrapper>
  );
}
