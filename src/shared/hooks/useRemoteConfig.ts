import { useContext } from "react";
import { RemoteConfigContext, type RemoteConfigContextValue } from "@/services/remoteConfig/remoteConfigContext";

export function useRemoteConfig(): RemoteConfigContextValue {
  const ctx = useContext(RemoteConfigContext);
  if (!ctx) {
    throw new Error("useRemoteConfig must be used within RemoteConfigProvider");
  }
  return ctx;
}
