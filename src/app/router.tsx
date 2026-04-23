import {
  createBrowserRouter,
  Navigate,
  type RouteObject,
} from "react-router-dom";
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
import { SignIn, ForgotPassword } from "@/features/auth";
import TestScreen from "@/pages/TestScreen";
import { TasbeehTestDashboard } from "@/features/tasbeeh/test/TasbeehTestDashboard";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { AuthGuard } from "@/app/router/AuthGuard";

/**
 * Public routes accessible to everyone
 */
const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SplashScreen />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/onboarding",
    element: <Onboarding />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/signin",
    element: <SignIn />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    errorElement: <ErrorBoundary />,
  },
];

/**
 * Protected routes requiring authentication or specific flags
 */
const protectedRoutes: RouteObject[] = [
  {
    element: (
      <AuthGuard>
        <AppShell />
      </AuthGuard>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/stats", element: <Stats /> },
      { path: "/settings", element: <Settings /> },
      { path: "/collections", element: <Collections /> },
      { path: "/collections/new", element: <CollectionsNew /> },
      { path: "/collections/filter", element: <CollectionsFilter /> },
      { path: "/settings/feedback", element: <SettingsFeedback /> },
      { path: "/settings/about", element: <SettingsAbout /> },
      { path: "/settings/profile", element: <SettingsProfile /> },
    ],
  },
];

/**
 * Utility & Debug routes
 */
const utilityRoutes: RouteObject[] = [
  {
    path: "/test",
    element: <TestScreen />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/tester",
    element: <TasbeehTestDashboard />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  ...utilityRoutes,
]);
