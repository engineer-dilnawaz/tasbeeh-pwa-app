import { Route, Routes } from "react-router-dom";
import { useScreenTracking } from "@/services/analytics";
import { AppLayout } from "@/app/layout/AppLayout";
import AddTasbeeh from "@/pages/AddTasbeeh";
import EmailLinkFallback from "@/pages/EmailLinkFallback";
import Home from "@/pages/Home";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/sign-in";
import SplashScreen from "@/pages/splash";
import Stats from "@/pages/Stats";
import Onboarding from "@/pages/onboarding";

export function AppRouter() {
  useScreenTracking();

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/auth/email-link" element={<EmailLinkFallback />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/add" element={<AddTasbeeh />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
