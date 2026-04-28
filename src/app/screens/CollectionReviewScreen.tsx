import { Box, Chip, Divider, alpha } from "@mui/material";
import { useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { useTasbeehStore, isCollectionComplete } from "@/features/tasbeeh/store";
import { AppButton, AppCard, AppStack, AppText, Icons, ScreenContainer } from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { t } from "@/shared/locales";

export function CollectionReviewScreen() {
  const navigate = useNavigate();

  const selectedCollectionId = useTasbeehStore((s) => s.selectedCollectionId);
  const collections = useTasbeehStore((s) => s.collections);
  const items = useTasbeehStore((s) => s.items);
  const counts = useTasbeehStore((s) => s.counts);
  const restartCollection = useTasbeehStore((s) => s.restartCollection);
  const collectionComplete = useTasbeehStore((s) => isCollectionComplete(s));

  const collection = useMemo(
    () => collections.find((c) => c.id === selectedCollectionId) ?? null,
    [collections, selectedCollectionId],
  );

  const rows = useMemo(() => {
    if (!collection) return [];
    return collection.tasbeehIds
      .map((tid) => {
        const item = items.find((i) => i.id === tid);
        if (!item) return null;
        const title =
          item.title || (item.titleKey ? t(item.titleKey) : "Custom Tasbeeh");
        const count = counts[tid] ?? 0;
        const complete = count >= item.targetCount;
        return { tid, title, target: item.targetCount, count, complete };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [collection, items, counts]);

  if (!collection || !selectedCollectionId) {
    return <Navigate to={ROUTES.collection} replace />;
  }

  const completedCount = rows.filter((r) => r.complete).length;

  return (
    <ScreenContainer noPadding>
      <AppStack spacing={0}>
        {/* Sticky header (same pattern as collection search header) */}
        <Box
          sx={(theme) => ({
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.paper",
            height: 64,
            display: "flex",
            alignItems: "center",
            px: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          })}
        >
          <Box
            onClick={() => navigate(-1)}
            role="button"
            aria-label="Back"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                navigate(-1);
              }
            }}
            sx={(theme) => ({
              width: 44,
              height: 44,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              bgcolor:
                theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.06)
                  : alpha(theme.palette.common.black, 0.04),
              transition: theme.transitions.create(["background-color"], { duration: 180 }),
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.1)
                    : alpha(theme.palette.common.black, 0.06),
              },
              "&:active": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.14)
                    : alpha(theme.palette.common.black, 0.08),
              },
            })}
          >
            <Icons.ChevronRight
              sx={{
                transform: "rotate(180deg)",
                color: "text.primary",
              }}
            />
          </Box>

          <AppText
            variant="subtitle1"
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              textAlign: "center",
              fontWeight: 900,
              pointerEvents: "none",
            }}
          >
            Review
          </AppText>
        </Box>

        <AppStack spacing={2} sx={{ px: 2, pt: 2 }}>

        <AppCard>
          <AppStack spacing={0.75}>
            <AppText variant="h6" sx={{ fontWeight: 900 }}>
              {collection.title}
            </AppText>

            <AppStack direction="row" spacing={1} sx={{ alignItems: "center", pt: 0.5 }}>
              <Chip
                label={`${completedCount}/${rows.length} completed`}
                color={collectionComplete ? "success" : "primary"}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 800 }}
              />
              {collectionComplete ? (
                <Chip
                  label="Completed"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800 }}
                />
              ) : null}
            </AppStack>
          </AppStack>
        </AppCard>

        <AppCard>
          <AppStack spacing={0} sx={{ overflow: "hidden" }}>
            {rows.map((r, idx) => {
              const isLast = idx === rows.length - 1;
              return (
                <Box key={r.tid}>
                  <Box
                    onClick={() =>
                      navigate(ROUTES.homeCounter.replace(":tasbeehId", r.tid))
                    }
                    sx={(theme) => ({
                      px: 2,
                      py: 1.5,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      bgcolor: "transparent",
                      "&:active": {
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                      },
                    })}
                  >
                    <Box
                      sx={(theme) => ({
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(
                          r.complete
                            ? theme.palette.success.main
                            : theme.palette.primary.main,
                          theme.palette.mode === "dark" ? 0.14 : 0.10,
                        ),
                        flexShrink: 0,
                      })}
                    >
                      {r.complete ? (
                        <Icons.Check sx={{ color: "success.main", fontSize: 20 }} />
                      ) : (
                        <Icons.Play sx={{ color: "primary.main", fontSize: 20 }} />
                      )}
                    </Box>

                    <AppStack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                      <AppText variant="body2" sx={{ fontWeight: 800 }} noWrap>
                        {r.title}
                      </AppText>
                      <AppText variant="caption" color="text.secondary" noWrap>
                        {r.count} / {r.target}
                      </AppText>
                    </AppStack>

                    <Chip
                      label={r.complete ? "Done" : "In progress"}
                      color={r.complete ? "success" : "default"}
                      size="small"
                      variant={r.complete ? "filled" : "outlined"}
                      sx={{ fontWeight: 800 }}
                    />
                  </Box>
                  {!isLast ? <Divider /> : null}
                </Box>
              );
            })}
          </AppStack>
        </AppCard>

        {collectionComplete ? (
          <AppCard>
            <AppStack spacing={1.25}>
              <AppText variant="subtitle1" sx={{ fontWeight: 900 }}>
                Completed
              </AppText>
              <AppText variant="body2" color="text.secondary">
                Restart this collection to begin again.
              </AppText>
              <AppButton
                variant="contained"
                onClick={() => {
                  restartCollection(selectedCollectionId);
                  const nextId = useTasbeehStore.getState().selectedId;
                  if (nextId) {
                    navigate(ROUTES.homeCounter.replace(":tasbeehId", nextId));
                  }
                }}
              >
                Restart collection
              </AppButton>
            </AppStack>
          </AppCard>
        ) : null}
        </AppStack>
      </AppStack>
    </ScreenContainer>
  );
}

