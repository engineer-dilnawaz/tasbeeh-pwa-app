import { motion } from "framer-motion";
import { useMemo } from "react";
import { ProgressRing } from "@/features/tasbeeh/components/ProgressRing";
import {
  AYAT_OF_THE_DAY,
  getDayRotationIndex,
  HADITH_OF_THE_DAY,
  MILESTONES,
  TASBEEH_CONTENT_VERSION,
} from "@/shared/config/data";
import { getIslamicApiKey, type AsmaUlHusnaName } from "@/features/tasbeeh/api/islamicApi";
import { log, recordError } from "@/services/crashlytics";
import { useAsmaUlHusna } from "@/features/tasbeeh/hooks/useAsmaUlHusna";
import { useRemoteConfig } from "@/shared/hooks/useRemoteConfig";
import { useFeatureFlag } from "@/shared/hooks/useFeatureFlag";
import { useFirestoreTestCollection } from "@/services/firebase/useFirestoreTestCollection";
import { useTasbeehQuery } from "@/features/tasbeeh/hooks/useTasbeehQuery";
import { firebaseReady } from "@/services/firebase/app";
import { useTasbeehStore } from "@/features/tasbeeh/store/tasbeehStore";

export default function Home() {
  const { t, locale } = useRemoteConfig();
  const hasIslamicApiKey = Boolean(getIslamicApiKey());
  const {
    data: asmaData,
    isError: asmaIsError,
    error: asmaErr,
    isPending: asmaPending,
  } = useAsmaUlHusna(locale);
  const showAyat = useFeatureFlag("ayatSection");
  const showHadith = useFeatureFlag("hadithSection");
  const { tasbeehList, count, currentIndex, increment, totalRecitations, streak } =
    useTasbeehStore();
  const { isLoading, isError, isFetching } = useTasbeehQuery();
  const {
    data: testDocs,
    isLoading: testLoading,
    isError: testError,
    error: testQueryError,
  } = useFirestoreTestCollection();

  const ayatToday = useMemo(
    () => AYAT_OF_THE_DAY[getDayRotationIndex(AYAT_OF_THE_DAY.length)],
    [],
  );
  const hadithToday = useMemo(
    () => HADITH_OF_THE_DAY[getDayRotationIndex(HADITH_OF_THE_DAY.length)],
    [],
  );

  const target = tasbeehList[currentIndex]?.target ?? 100;

  const onTap = () => {
    if (navigator.vibrate) navigator.vibrate(12);
    increment();
  };

  const onTestCrashlytics = () => {
    log("Crashlytics manual test (breadcrumb)");
    recordError(new Error("Crashlytics test: non-fatal (Home)"), { source: "home_manual_test" });
  };

  return (
    <motion.main
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <header className="header">
        <span style={{ fontSize: "17px", fontWeight: 700 }}>{t("app.title")}</span>
        <span className="streak-badge" style={{ marginLeft: "auto" }}>
          <span>{streak}</span> days
        </span>
      </header>

      <p className="settings-hint" style={{ marginBottom: "10px" }}>
        v{TASBEEH_CONTENT_VERSION}
        {(isLoading || isFetching) && " · Syncing catalog…"}
        {isError && !isLoading && " · Offline catalog"}
        {!isLoading && !isError && " · Ready"}
      </p>

      <div
        className="squircle-card"
        style={{
          marginBottom: "14px",
          fontSize: "13px",
          color: "var(--text-secondary)",
          minHeight: "72px",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: "6px", color: "var(--text-primary)" }}>
          {t("home.asmaTitle") || "Asma-ul-Husna"}
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>
          {hasIslamicApiKey
            ? t("home.asmaStatusKeyOk")
            : t("home.asmaStatusNoKey")}
        </p>
        {!hasIslamicApiKey ? (
          <p style={{ lineHeight: 1.5, color: "var(--text-primary)" }}>
            {t("home.asmaNoKey") ||
              "Create .env.local from .env.example, add your API key from islamicapi.com, then restart yarn dev."}
          </p>
        ) : asmaIsError ? (
          <p style={{ color: "var(--accent)", lineHeight: 1.5 }}>
            {(t("home.asmaError") || "Could not load names.") +
              (asmaErr instanceof Error ? ` ${asmaErr.message}` : "")}
          </p>
        ) : asmaPending || !asmaData ? (
          <p className="settings-hint">{t("home.asmaLoading") || "Loading names from IslamicAPI…"}</p>
        ) : asmaData.names.length === 0 ? (
          <p className="settings-hint">{t("home.asmaEmpty") || "API returned no names."}</p>
        ) : (
          <>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
              {asmaData.title}
            </p>
            <p className="settings-hint" style={{ marginBottom: "8px" }}>
              {asmaData.names.length} / {asmaData.total} · {asmaData.language_code.toUpperCase()}
            </p>
            <p style={{ fontSize: "12px", marginBottom: "10px", lineHeight: 1.45 }}>{asmaData.description}</p>
            <div
              style={{
                maxHeight: "min(480px, 65vh)",
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                padding: "10px 12px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <ol style={{ margin: 0, paddingLeft: "22px", lineHeight: 1.6 }}>
                {asmaData.names.map((n: AsmaUlHusnaName) => (
                  <li key={n.number} style={{ marginBottom: "12px", paddingLeft: "4px" }}>
                    <span className="tasbeeh-arabic" dir="rtl" style={{ fontSize: "1.05rem", display: "block" }}>
                      {n.name}
                    </span>
                    <span style={{ color: "var(--text-primary)", display: "block", fontSize: "12px", marginTop: "2px" }}>
                      {n.transliteration}
                    </span>
                    <span style={{ fontSize: "12px", opacity: 0.92 }}>{n.translation}</span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="settings-hint" style={{ marginTop: "10px", marginBottom: 0 }}>
              <a href="https://islamicapi.com/" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
                {t("home.asmaAttribution") || "Data: IslamicAPI"}
              </a>
            </p>
          </>
        )}
      </div>

      <div style={{ marginBottom: "14px" }}>
        <button type="button" className="secondary-btn" style={{ width: "100%" }} onClick={onTestCrashlytics}>
          {t("home.crashlyticsTest")}
        </button>
        <p className="settings-hint" style={{ marginTop: "6px", fontSize: "11px" }}>
          {t("home.crashlyticsTestHint")}
        </p>
      </div>

      <div
        className="squircle-card"
        style={{
          marginBottom: "14px",
          fontSize: "13px",
          color: "var(--text-secondary)",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: "8px", color: "var(--text-primary)" }}>
          {t("home.firestoreTitle")}
        </p>
        {!firebaseReady ? (
          <p className="settings-hint">{t("home.firestoreUnavailable")}</p>
        ) : testLoading ? (
          <p className="settings-hint">{t("home.firestoreLoading")}</p>
        ) : testError ? (
          <p className="settings-hint" style={{ color: "var(--accent)" }}>
            {t("home.firestoreError")}
            {testQueryError instanceof Error ? ` ${testQueryError.message}` : ""}
          </p>
        ) : !testDocs?.length ? (
          <p className="settings-hint">{t("home.firestoreEmpty")}</p>
        ) : (
          <ul style={{ margin: 0, paddingLeft: "18px", lineHeight: 1.7 }}>
            {testDocs.map((doc) => (
              <li key={doc.id}>
                <code style={{ fontSize: "11px", color: "var(--text-muted)" }}>{doc.id}</code>
                {" · "}
                <span style={{ color: "var(--text-primary)" }}>
                  {t("home.firestoreName")}: {doc.name ?? "—"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="tasbeeh-list-container">
        <div className="flow-mode-indicator">
          <span>Sequential</span>
        </div>
        <div id="tasbeehList">
          {tasbeehList.map((item, index) => {
            let rowClass = "tasbeeh-item upcoming";
            if (index < currentIndex) rowClass = "tasbeeh-item done";
            else if (index === currentIndex) rowClass = "tasbeeh-item active";
            return (
              <div key={`${item.transliteration}-${index}`} className={rowClass}>
                <span className="tasbeeh-arabic" dir="rtl">
                  {item.text}
                </span>
                <div className="tasbeeh-meta">
                  <span className="tasbeeh-roman">
                    {item.target}x - {item.transliteration}
                  </span>
                  <span className="tasbeeh-urdu" dir="rtl" lang="ur">
                    {item.urdu}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ProgressRing count={count} target={target} />

      <div className="today-stats">
        <div className="stat-item">
          <span className="stat-value">{count}</span>
          <span className="stat-label">This set</span>
        </div>
        <div className="stat-divider" />
        <div className="stat-item">
          <span className="stat-value">{totalRecitations}</span>
          <span className="stat-label">Total taps</span>
        </div>
      </div>

      <button type="button" className="tap-btn" onClick={onTap}>
        <span className="tap-text">Tap</span>
        <span className="ripple" />
      </button>

      {(showAyat || showHadith) && (
        <section style={{ marginTop: "20px" }} aria-label="Daily inspiration">
          {showAyat && (
            <>
              <h4 style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
                Ayat of the day
              </h4>
              <p className="tasbeeh-arabic" dir="rtl" style={{ marginBottom: "6px" }}>
                {ayatToday.arabic}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{ayatToday.english}</p>
              <p className="settings-hint">{ayatToday.source}</p>
            </>
          )}
          {showHadith && (
            <>
              <h4
                style={{
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  marginTop: showAyat ? "16px" : 0,
                  marginBottom: "8px",
                }}
              >
                Hadith of the day
              </h4>
              <p className="tasbeeh-arabic" dir="rtl" style={{ marginBottom: "6px" }}>
                {hadithToday.arabic}
              </p>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{hadithToday.english}</p>
              <p className="settings-hint">{hadithToday.source}</p>
            </>
          )}
        </section>
      )}

      <p className="settings-hint" style={{ marginTop: "16px" }}>
        Milestones: {MILESTONES.join(", ")}
      </p>
    </motion.main>
  );
}
