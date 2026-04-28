import { Box, alpha } from "@mui/material";
import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useTasbeehStore, isCollectionComplete } from "@/features/tasbeeh/store";
import { ROUTES } from "@/shared/constants";
import { t } from "@/shared/locales";
import { AppButton, AppCard, AppStack, AppText, Icons, ScreenContainer } from "@/shared/components";

export function HomeScreen() {
  const navigate = useNavigate();

  const selectedId = useTasbeehStore((s) => s.selectedId);
  const selectedCollectionId = useTasbeehStore((s) => s.selectedCollectionId);
  const items = useTasbeehStore((s) => s.items);
  const collections = useTasbeehStore((s) => s.collections);
  const counts = useTasbeehStore((s) => s.counts);
  const complete = useTasbeehStore((s) => isCollectionComplete(s));
  const restartCollection = useTasbeehStore((s) => s.restartCollection);

  const collection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  );

  const progress = useMemo(() => {
    if (!collection) return { completed: 0, total: 0 };
    const total = collection.tasbeehIds.length;
    const completed = collection.tasbeehIds.filter((tid) => {
      const item = items.find((i) => i.id === tid);
      if (!item) return false;
      return (counts[tid] ?? 0) >= item.targetCount;
    }).length;
    return { completed, total };
  }, [collection, items, counts]);

  if (!selectedId || !collection) return <Navigate to={ROUTES.collection} replace />;

  return (
    <ScreenContainer>
      <AppStack spacing={2}>
        <AppCard>
          <AppStack spacing={1.25}>
            <AppStack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                sx={(theme) => ({
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.16 : 0.10,
                  ),
                })}
              >
                <Icons.Collection sx={{ color: "primary.main" }} />
              </Box>

              <AppStack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                <AppText variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                  {collection.title}
                </AppText>
                <AppText variant="body2" color="text.secondary" noWrap>
                  {progress.completed}/{progress.total} completed
                </AppText>
              </AppStack>
            </AppStack>

            <AppStack direction="row" spacing={1}>
              <AppButton
                fullWidth
                variant="contained"
                onClick={() => {
                  if (complete) {
                    navigate(ROUTES.homeReview);
                    return;
                  }
                  navigate(ROUTES.homeCounter.replace(":tasbeehId", selectedId));
                }}
              >
                {complete ? "Review" : "Continue"}
              </AppButton>
              <AppButton
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={() => navigate(ROUTES.collection)}
              >
                {t("nav.collection")}
              </AppButton>
            </AppStack>
          </AppStack>
        </AppCard>

        {complete ? (
          <AppCard>
            <AppStack spacing={1.25}>
              <AppText variant="subtitle1" sx={{ fontWeight: 800 }}>
                Collection complete
              </AppText>
              <AppText variant="body2" color="text.secondary">
                You’ve completed all tasbeeh targets in this collection.
              </AppText>
              <AppButton
                variant="contained"
                onClick={() => {
                  if (!selectedCollectionId) return;
                  restartCollection(selectedCollectionId);
                  const nextId = useTasbeehStore.getState().selectedId;
                  if (!nextId) return;
                  navigate(ROUTES.homeCounter.replace(":tasbeehId", nextId));
                }}
              >
                Restart collection
              </AppButton>
            </AppStack>
          </AppCard>
        ) : null}
      </AppStack>
    </ScreenContainer>
  );
}

