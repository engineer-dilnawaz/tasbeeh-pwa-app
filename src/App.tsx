import { useEffect } from "react";
import { ThemeProvider, useTheme } from "./app/providers/ThemeProvider";
import { Text } from "./design-system/atoms/Text";
import { Button } from "./design-system/atoms/Button";
import { Card } from "./design-system/molecules/Card";
import { TasbeehScreen } from "./features/tasbeeh/screens";
import { useTasbeehStore } from "./store/tasbeeh/useTasbeehStore";
import { onAuthChange } from "./services/firebase/auth";

function AppLayout() {
  const { theme, mode, setMode } = useTheme();
  const { userId, setUser, hydrate } = useTasbeehStore();

  // 🔥 Reactive Auth Detection
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user.uid);
        hydrate();
      }
    });

    return () => unsubscribe();
  }, [setUser, hydrate]);

  // 🔥 Auto-Sync on App Focus
  useEffect(() => {
    const handleFocus = () => {
      if (userId) hydrate();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [userId, hydrate]);

  // Mock Login for Dev Testing
  const handleMockLogin = () => {
    setUser("mock-user-123");
    hydrate();
  };

  return (
    <div
      style={{
        background: theme.colors.background,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "24px",
        transition: "all 0.3s ease-in-out",
        padding: "20px 0",
      }}
    >
      {/* Header Area */}
      <div style={{ width: "100%", maxWidth: "480px", padding: "0 20px" }}>
        <Text variant="heading" style={{ fontSize: "24px" }}>Divine</Text>
        <Text variant="caption" color="secondary">
          {userId ? `User: ${userId}` : "Not Authenticated"}
        </Text>
      </div>

      {/* Main Content Area (Feature Layer) */}
      <div style={{ width: "100%", maxWidth: "480px" }}>
        {userId ? (
          <TasbeehScreen />
        ) : (
          <Card padding="lg" style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }}>
            <Text variant="subheading">Welcome to Divine</Text>
            <Text variant="body" color="secondary">Please sign in to start your zikr session and sync your progress.</Text>
            <Button onClick={handleMockLogin}>Simulate Login (Dev)</Button>
          </Card>
        )}
      </div>

      {/* Footer / System Controls */}
      <div style={{ width: "100%", maxWidth: "480px", padding: "0 20px", marginTop: "auto" }}>
        <Card style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="caption" color="secondary">Theme: {mode}</Text>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button 
              variant={mode === "light" ? "primary" : "secondary"}
              onClick={() => setMode("light")}
              size="sm"
            >
              Light
            </Button>
            <Button 
              variant={mode === "dark" ? "primary" : "secondary"}
              onClick={() => setMode("dark")}
              size="sm"
            >
              Dark
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}
