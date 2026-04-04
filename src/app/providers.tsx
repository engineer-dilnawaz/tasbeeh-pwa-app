import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/services/auth/AuthProvider";
import { RemoteConfigProvider } from "@/services/remoteConfig/RemoteConfigProvider";
import { queryClient } from "@/services/queryClient";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RemoteConfigProvider>
          <AuthProvider>{children}</AuthProvider>
        </RemoteConfigProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
