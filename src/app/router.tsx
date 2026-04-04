import { Route, Routes } from "react-router-dom";
import { useScreenTracking } from "@/services/analytics";
import { AppLayout } from "@/app/layout/AppLayout";
import AddTasbeeh from "@/pages/AddTasbeeh";
import EmailLinkFallback from "@/pages/EmailLinkFallback";
import Collections from "@/pages/Collections";
import Home from "@/pages/Home";
import AyatOfTheDay from "@/pages/AyatOfTheDay";
import AsmaUlHusna from "@/pages/AsmaUlHusna";
import AsmaUlHusnaFavorites from "@/pages/AsmaUlHusnaFavorites";
import HadithOfTheDay from "@/pages/HadithOfTheDay";
import CommunityGoal from "@/pages/CommunityGoal";
import PrayerTimes from "@/pages/PrayerTimes";
import QiblaFinder from "@/pages/QiblaFinder";
import Settings from "@/pages/Settings";
import DataDeletion from "@/pages/data-deletion";
import Privacy from "@/pages/privacy";
import SignIn from "@/pages/sign-in";
import SplashScreen from "@/pages/splash";
import Stats from "@/pages/Stats";
import Terms from "@/pages/terms";
import Onboarding from "@/pages/onboarding";

export function AppRouter() {
  useScreenTracking();

  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/data-deletion" element={<DataDeletion />} />
      <Route path="/auth/email-link" element={<EmailLinkFallback />} />
      <Route element={<AppLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/ayat" element={<AyatOfTheDay />} />
        <Route path="/hadith" element={<HadithOfTheDay />} />
        <Route path="/asma-ul-husna" element={<AsmaUlHusna />} />
        <Route path="/asma-ul-husna/favorites" element={<AsmaUlHusnaFavorites />} />
        <Route path="/community" element={<CommunityGoal />} />
        <Route path="/prayer-times" element={<PrayerTimes />} />
        <Route path="/qibla" element={<QiblaFinder />} />
        <Route path="/add" element={<AddTasbeeh />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
