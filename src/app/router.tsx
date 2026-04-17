import { createBrowserRouter, Navigate } from "react-router-dom";
import AppShell from "@/app/layout/AppShell";
import { SplashScreen } from "@/pages/SplashScreen";
import { Onboarding } from "@/pages/Onboarding";
import Home from "@/pages/Home";
import Stats from "@/pages/Stats";
import Collections from "@/pages/Collections";
import CollectionsNew from "@/pages/CollectionsNew";
import CollectionsFilter from "@/pages/CollectionsFilter";
import Settings from "@/pages/Settings";
import SettingsFeedback from "@/pages/SettingsFeedback";
import SettingsAbout from "@/pages/SettingsAbout";
import SettingsProfile from "@/pages/SettingsProfile";
import TestScreen from "@/pages/TestScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
  },
  {
    element: <AppShell />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/stats",
        element: <Stats />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/collections",
        element: <Collections />,
      },
      {
        path: "/collections/new",
        element: <CollectionsNew />,
      },
      {
        path: "/collections/filter",
        element: <CollectionsFilter />,
      },
      {
        path: "/settings/feedback",
        element: <SettingsFeedback />,
      },
      {
        path: "/settings/about",
        element: <SettingsAbout />,
      },
      {
        path: "/settings/profile",
        element: <SettingsProfile />,
      },
    ],
  },
  {
    path: "/test",
    element: <TestScreen />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
