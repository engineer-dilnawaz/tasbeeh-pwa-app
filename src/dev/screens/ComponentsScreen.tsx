import { useState } from "react";
import {
  DaisyCountdown,
  UiAvatar,
  UiBadge,
  UiButton,
  UiCard,
  UiListRow,
  UiSelect,
  UiTextField,
  UiToast,
  UiToggle,
  ZikrCounterTapDemo,
} from "@/shared/components/ui";
import { DualModeLayout, Section } from "../DesignLab";
import { purpleToUiPalette } from "../theme/purpleToUiPalette";

export default function ComponentsScreen() {
  const [loadingBtn, setLoadingBtn] = useState(false);

  return (
    <DualModeLayout>
      {(theme) => {
        const ui = purpleToUiPalette(theme);
        return (
          <div style={{ fontFamily: "'Inter', system-ui", maxWidth: "640px" }}>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 900,
                color: theme.textPrimary,
                margin: "0 0 32px",
              }}
            >
              Components
            </h2>

            <Section title="Zikr counter" theme={theme}>
              <ZikrCounterTapDemo
                palette={ui}
                hint="Tap the circle to increment — same AnimatedDhikrCount as Patterns → Zikr Counter."
              />
            </Section>

            <Section title="Daisy countdown" theme={theme}>
              <p style={{ margin: "0 0 12px", color: theme.textSecondary, fontSize: 14 }}>
                daisyUI flip style (values 0–999).
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 12,
                  fontFamily: "ui-monospace, monospace",
                  fontSize: 28,
                  fontWeight: 800,
                  color: theme.textPrimary,
                }}
              >
                <DaisyCountdown value={59} digits={2} />
                <span style={{ fontSize: 14, fontWeight: 600, opacity: 0.7 }}>
                  seconds demo
                </span>
              </div>
            </Section>

            <Section title="Buttons" theme={theme}>
              <UiButton label="Primary" variant="primary" palette={ui} />
              <UiButton label="Secondary" variant="secondary" palette={ui} />
              <UiButton label="Ghost" variant="ghost" palette={ui} />
              <UiButton label="Danger" variant="danger" palette={ui} />
              <UiButton icon="🔊" variant="icon" palette={ui} />
              <UiButton label="Small" variant="primary" size="sm" palette={ui} />
              <UiButton label="Large" variant="primary" size="lg" palette={ui} />
              <UiButton
                label={loadingBtn ? "" : "Load"}
                loading={loadingBtn}
                variant="primary"
                palette={ui}
                onClick={() => {
                  setLoadingBtn(true);
                  setTimeout(() => setLoadingBtn(false), 2000);
                }}
              />
              <UiButton label="Disabled" variant="primary" disabled palette={ui} />
            </Section>

            <Section title="Inputs" theme={theme}>
              <UiTextField
                label="Default"
                placeholder="Type something..."
                palette={ui}
              />
              <UiTextField
                label="With Icon"
                placeholder="Search..."
                icon="🔍"
                palette={ui}
              />
              <UiTextField
                label="With Error"
                placeholder="Email"
                error="Invalid email address"
                palette={ui}
              />
              <UiTextField
                label="Disabled"
                placeholder="Not editable"
                disabled
                palette={ui}
              />
            </Section>

            <Section title="Avatars" theme={theme}>
              <UiAvatar size={32} name="DK" palette={ui} />
              <UiAvatar size={44} name="DK" palette={ui} />
              <UiAvatar size={56} name="DK" palette={ui} />
              <UiAvatar size={72} name="DK" palette={ui} />
              <UiAvatar size={56} name="DK" badge="🟢" palette={ui} />
              <UiAvatar size={56} name="DK" badge="3" palette={ui} />
            </Section>

            <Section title="Badges & Chips" theme={theme}>
              <UiBadge label="Default" palette={ui} />
              <UiBadge label="Success" color={theme.success} palette={ui} />
              <UiBadge label="Danger" color={theme.danger} palette={ui} />
              <UiBadge label="33 ×" palette={ui} />
              <UiBadge label="Streak 🔥" color="#ff9f0a" palette={ui} />
            </Section>

            <Section title="Cards" theme={theme}>
              <UiCard palette={ui}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: theme.textPrimary,
                    marginBottom: "6px",
                  }}
                >
                  Basic Card
                </div>
                <div style={{ fontSize: "13px", color: theme.textSecondary }}>
                  A simple content container with border and surface background.
                </div>
              </UiCard>
              <UiCard palette={ui} elevated>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: theme.textPrimary,
                    marginBottom: "6px",
                  }}
                >
                  Elevated Card
                </div>
                <div style={{ fontSize: "13px", color: theme.textSecondary }}>
                  Uses the raised surface level for depth hierarchy.
                </div>
              </UiCard>
              <UiCard palette={ui} onClick={() => alert("Card tapped")}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: theme.textPrimary,
                        marginBottom: "4px",
                      }}
                    >
                      Interactive Card
                    </div>
                    <div style={{ fontSize: "13px", color: theme.textSecondary }}>
                      Tap me — has press feedback
                    </div>
                  </div>
                  <span style={{ color: theme.textMuted, fontSize: "20px" }}>
                    ›
                  </span>
                </div>
              </UiCard>
            </Section>

            <Section title="Lists" theme={theme}>
              <UiListRow
                icon="🕋"
                title="Prayer Times"
                subtitle="Next: Asr in 2h 14m"
                palette={ui}
                onClick={() => {}}
              />
              <UiListRow
                icon="📿"
                title="Tasbeeh Counter"
                subtitle="SubhanAllah · 0 / 33"
                palette={ui}
                onClick={() => {}}
              />
              <UiListRow
                icon="🌙"
                title="99 Names of Allah"
                subtitle="Swipe through Asma ul Husna"
                palette={ui}
                onClick={() => {}}
              />
              <UiListRow
                title="With Badge"
                subtitle="Notification style"
                right={<UiBadge label="New" palette={ui} />}
                palette={ui}
                onClick={() => {}}
              />
              <UiListRow
                icon="⚙️"
                title="Settings"
                subtitle="Theme · Notifications · Account"
                right={<UiAvatar size={32} name="DK" palette={ui} />}
                palette={ui}
                onClick={() => {}}
              />
            </Section>

            <Section title="Toggles" theme={theme}>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  background: theme.surface,
                  padding: "16px",
                  borderRadius: "20px",
                  border: `1px solid ${theme.border}`,
                }}
              >
                <UiToggle label="Daily Reminder" palette={ui} />
                <div style={{ height: "1px", background: theme.border }} />
                <UiToggle label="Dark Mode" palette={ui} />
                <div style={{ height: "1px", background: theme.border }} />
                <UiToggle label="Haptic Feedback" palette={ui} />
              </div>
            </Section>

            <Section title="Dropdown / Select" theme={theme}>
              <div style={{ width: "100%", position: "relative", zIndex: 10 }}>
                <UiSelect
                  options={[
                    "SubhanAllah",
                    "Alhamdulillah",
                    "Allahu Akbar",
                    "La ilaha illallah",
                  ]}
                  palette={ui}
                />
              </div>
            </Section>

            <Section title="Toasts & Notifications" theme={theme}>
              <UiToast
                type="success"
                message="Tasbeeh complete — 33 recitations done"
                palette={ui}
              />
              <UiToast
                type="error"
                message="Could not connect to server"
                palette={ui}
              />
              <UiToast
                type="info"
                message="Streak restored from backup"
                palette={ui}
              />
            </Section>
          </div>
        );
      }}
    </DualModeLayout>
  );
}
