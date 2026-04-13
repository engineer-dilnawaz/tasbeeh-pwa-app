import { createBrowserRouter, Navigate } from "react-router-dom";
import { SplashScreen } from "@/pages/SplashScreen";
import { Onboarding } from "@/pages/Onboarding";
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
    path: "/home",
    element: <TestScreen />, // Temporary placeholder until Home.tsx is built
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
