import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { router } from "@/app/router";
import { ScreenWrapper } from "@/app/layout/ScreenWrapper";
import { queryClient } from "@/services/queryClient";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScreenWrapper>
        <RouterProvider router={router} />
      </ScreenWrapper>
    </QueryClientProvider>
  );
}
