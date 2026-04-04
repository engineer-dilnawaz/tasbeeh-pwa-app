import { getValue, type RemoteConfig } from "firebase/remote-config";

/** `getSource()` may be string enum or legacy numeric depending on SDK version */
export function getParameterSourceName(rc: RemoteConfig | null, key: string): string {
  if (!rc) return "—";
  try {
    const v = getValue(rc, key);
    const s = v.getSource() as string | number;
    if (s === "remote" || s === 2) return "remote (Firebase)";
    if (s === "default" || s === 1) return "default (in-app)";
    if (s === "static" || s === 0) return "static";
    return `source(${String(s)})`;
  } catch {
    return "?";
  }
}
