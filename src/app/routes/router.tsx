import { BrowserRouter, Navigate, Route, Routes, useParams } from "react-router-dom";

import { CounterScreen, TasbeehListScreen } from "@/features/tasbeeh";
import { AppTabsLayout } from "@/app/layouts";
import { CollectionReviewScreen, HomeScreen, SettingsScreen, StatsScreen } from "@/app/screens";
import { ROUTES } from "@/shared/constants/routes";

function LegacyTasbeehCounterRedirect() {
  const { tasbeehId } = useParams();
  if (!tasbeehId) return <Navigate to={ROUTES.collection} replace />;
  return <Navigate to={ROUTES.home} replace />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={ROUTES.home} replace />} />

        {/* Standalone (no tabs) */}
        <Route path={ROUTES.homeReview} element={<CollectionReviewScreen />} />

        <Route element={<AppTabsLayout />}>
          <Route path={ROUTES.home} element={<HomeScreen />} />
          <Route path={ROUTES.homeCounter} element={<CounterScreen />} />
          <Route path={ROUTES.collection} element={<TasbeehListScreen />} />
          <Route path={ROUTES.stats} element={<StatsScreen />} />
          <Route path={ROUTES.settings} element={<SettingsScreen />} />
        </Route>

        <Route path={ROUTES.legacyTasbeehList} element={<Navigate to={ROUTES.collection} replace />} />
        <Route path={ROUTES.legacyTasbeehCounter} element={<LegacyTasbeehCounterRedirect />} />

        <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

