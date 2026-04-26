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
import { VerifyEmail } from "@/pages/VerifyEmail";
import TestScreen from "@/pages/TestScreen";
import { TasbeehTestDashboard } from "@/features/tasbeeh/test/TasbeehTestDashboard";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { AuthGuard } from "@/app/router/AuthGuard";
import { APP_ROUTES } from "@/shared/routes";
import ComponentLab from "@/shared/design-system/lab/ComponentLab";

/**
 * Public routes accessible to everyone
 */
const publicRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.INDEX,
    element: <SplashScreen />,
  },
  {
    path: APP_ROUTES.ONBOARDING,
    element: <Onboarding />,
  },
  {
    path: APP_ROUTES.SIGNIN,
    element: <SignIn />,
  },
  {
    path: APP_ROUTES.FORGOT_PASSWORD,
    element: <ForgotPassword />,
  },
  {
    path: APP_ROUTES.VERIFY_EMAIL,
    element: <VerifyEmail />,
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
    children: [
      { path: APP_ROUTES.HOME, element: <Home /> },
      { path: APP_ROUTES.STATS, element: <Stats /> },
      { path: APP_ROUTES.SETTINGS, element: <Settings /> },
      { path: APP_ROUTES.COLLECTIONS, element: <Collections /> },
      { path: APP_ROUTES.COLLECTIONS_NEW, element: <CollectionsNew /> },
      { path: APP_ROUTES.COLLECTIONS_FILTER, element: <CollectionsFilter /> },
      { path: APP_ROUTES.SETTINGS_FEEDBACK, element: <SettingsFeedback /> },
      { path: APP_ROUTES.SETTINGS_ABOUT, element: <SettingsAbout /> },
      { path: APP_ROUTES.SETTINGS_PROFILE, element: <SettingsProfile /> },
    ],
  },
];

/**
 * Utility & Debug routes
 */
const utilityRoutes: RouteObject[] = [
  {
    path: APP_ROUTES.TEST,
    element: <TestScreen />,
  },
  {
    path: APP_ROUTES.TESTER,
    element: <TasbeehTestDashboard />,
  },
  {
    path: "/lab",
    element: <ComponentLab />,
  },
  {
    path: "*",
    element: <Navigate to={APP_ROUTES.INDEX} replace />,
  },
];

import RootLayout from "@/app/layout/RootLayout";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      ...publicRoutes,
      ...protectedRoutes,
      ...utilityRoutes,
    ],
  },
]);
