import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tasbeehRemote } from "@/features/tasbeeh/services/tasbeeh.remote";
import { firebaseReady } from "@/services/firebase/app";
import { isFirestoreAvailable } from "@/services/firebase/firestore";
import { FIRESTORE_COLLECTIONS } from "@/shared/config/firestoreCollections";
import { TASBEEH_CATALOG_SEED } from "@/shared/config/tasbeehCatalogSeed";
import { DualModeLayout, Section } from "../DesignLab";
import type { PurpleTheme } from "../theme/purple";

export default function ExperimentsScreen() {
  const navigate = useNavigate();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const runSeed = async () => {
    setMsg(null);
    setErr(null);
    if (!firebaseReady || !isFirestoreAvailable()) {
      setErr("Firebase / Firestore not configured.");
      return;
    }
    setBusy(true);
    try {
      await tasbeehRemote.seedCatalog(TASBEEH_CATALOG_SEED);
      setMsg(
        `Wrote ${TASBEEH_CATALOG_SEED.length} docs to “${FIRESTORE_COLLECTIONS.tasbeehs}”. Dexie will sync in background.`,
      );
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Seed failed (check rules / network).");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DualModeLayout>
      {(theme: PurpleTheme) => (
        <>
          <button
            type="button"
            onClick={() => navigate("/design-lab")}
            style={{
              marginBottom: 16,
              background: "transparent",
              border: "none",
              color: theme.accent,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Lab
          </button>
          <h1 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 8px", color: theme.textPrimary }}>
            Experiments
          </h1>
          <p style={{ color: theme.textSecondary, marginBottom: 24, fontSize: 14 }}>
            Dev-only tools. Seed overwrites documents by id in Firestore.
          </p>

          <Section title="Firestore" theme={theme}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                maxWidth: 420,
              }}
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => void runSeed()}
                style={{
                  padding: "14px 18px",
                  borderRadius: 14,
                  border: "none",
                  fontWeight: 700,
                  cursor: busy ? "wait" : "pointer",
                  background: theme.accent,
                  color: theme.textOnAccent,
                }}
              >
                {busy ? "Seeding…" : `Seed tasbeehs (${TASBEEH_CATALOG_SEED.length} phrases)`}
              </button>
              {msg ? (
                <p style={{ color: "#22c55e", fontSize: 13, margin: 0 }}>{msg}</p>
              ) : null}
              {err ? (
                <p style={{ color: "#ef4444", fontSize: 13, margin: 0 }}>{err}</p>
              ) : null}
            </div>
          </Section>
        </>
      )}
    </DualModeLayout>
  );
}
