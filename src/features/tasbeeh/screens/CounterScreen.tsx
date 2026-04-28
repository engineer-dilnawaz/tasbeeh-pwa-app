import { alpha, Box, useTheme, Snackbar, Button } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { t } from "@/shared/locales";

import {
  AppStack,
  AppText,
  Icons,
  ScreenContainer,
  TapFeedback,
  AppButton,
} from "@/shared/components";
import { AppDialog } from "@/shared/components/AppDialog";

import { getNextInCollection, isCollectionComplete, useTasbeehStore } from "@/features/tasbeeh/store";
import { ROUTES } from "@/shared/constants";

export function CounterScreen() {
  const { tasbeehId } = useParams<{ tasbeehId: string }>();
  const theme = useTheme();
  const navigate = useNavigate();

  const select = useTasbeehStore((s) => s.select);
  const increment = useTasbeehStore((s) => s.increment);
  const decrement = useTasbeehStore((s) => s.decrement);
  const reset = useTasbeehStore((s) => s.reset);
  const overrideCount = useTasbeehStore((s) => s.overrideCount);
  const advanceInCollection = useTasbeehStore((s) => s.advanceInCollection);
  const hasHydrated = useTasbeehStore((s) => s.hasHydrated);

  const tasbeeh = useTasbeehStore((s) =>
    tasbeehId ? (s.items.find((x) => x.id === tasbeehId) ?? null) : null,
  );
  const count = useTasbeehStore((s) =>
    tasbeehId ? (s.counts[tasbeehId] ?? 0) : 0,
  );

  const displayCount = useMemo(
    () => new Intl.NumberFormat(undefined).format(count),
    [count],
  );

  const title = tasbeeh
    ? tasbeeh.title || (tasbeeh.titleKey ? t(tasbeeh.titleKey) : "")
    : t("app.title");
  const arabic = tasbeeh?.arabic || "";
  const target = tasbeeh?.targetCount || 0;

  const isComplete = target > 0 && count >= target;
  
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);
  const [undoSnackbarOpen, setUndoSnackbarOpen] = useState(false);
  const [lastCountBeforeReset, setLastCountBeforeReset] = useState(0);

  // Keep store selection in sync with route param
  useEffect(() => {
    if (!tasbeehId) return;
    select(tasbeehId);
  }, [tasbeehId, select]);

  const nextInCollection = useTasbeehStore((s) => getNextInCollection(s));
  const collectionComplete = useTasbeehStore((s) => isCollectionComplete(s));

  const handleResetRequest = () => {
    if (!tasbeehId) return;
    if (count === 0) return; // Nothing to reset
    setConfirmResetOpen(true);
  };

  const executeReset = () => {
    if (!tasbeehId) return;
    setLastCountBeforeReset(count);
    reset(tasbeehId);
    setConfirmResetOpen(false);
    setUndoSnackbarOpen(true);
  };

  const handleUndoReset = () => {
    if (!tasbeehId) return;
    overrideCount(tasbeehId, lastCountBeforeReset);
    setUndoSnackbarOpen(false);
    // If restoring the count crosses the target, it will trigger completion UI naturally
  };

  const handleGoNext = () => {
    // If the whole collection is complete (or there is no next item), go to Home dashboard
    // where Review/Restart are shown.
    if (!nextInCollection || collectionComplete) {
      navigate(ROUTES.home, { replace: true });
      return;
    }

    advanceInCollection();
    navigate(ROUTES.homeCounter.replace(":tasbeehId", nextInCollection.id), { replace: true });
  };

  // Ring calculations
  const size = 320;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = target > 0 ? Math.min(count / target, 1) : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const ringColor = isComplete
    ? theme.palette.success.main
    : theme.palette.primary.main;
  const trackColor =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.common.white, 0.05)
      : alpha(theme.palette.common.black, 0.04);

  return (
    <ScreenContainer noPadding>
      {!hasHydrated ? (
        <AppText variant="body2" color="text.secondary" sx={{ p: 2 }}>
          {t("tasbeeh.counter.loading")}
        </AppText>
      ) : null}

      <AppStack
        sx={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Header Section */}
        <AppStack
          spacing={1}
          sx={{
            position: "absolute",
            top: 24,
            left: 0,
            right: 0,
            px: 3,
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          {arabic && (
            <AppText
              variant="h4"
              sx={{
                fontFamily: "'Amiri', 'Noto Naskh Arabic', serif",
                color: "text.primary",
              }}
            >
              {arabic}
            </AppText>
          )}
          <AppText variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
            {title}
          </AppText>
          {target > 0 && (
            <Box
              sx={{ px: 1.5, py: 0.5, bgcolor: trackColor, borderRadius: 4 }}
            >
              <AppText
                variant="caption"
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Target: {target}
              </AppText>
            </Box>
          )}
        </AppStack>

        {/* Main Interactive Counter Area */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <TapFeedback
            ariaLabel={t("tasbeeh.tap")}
            onTap={() => {
              if (!tasbeehId) return;
              if (isComplete) return;
              select(tasbeehId);
              increment(tasbeehId);
            }}
          >
            <Box
              sx={{
                mx: "auto",
                position: "relative",
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {/* Ring Background */}
              <svg
                width={size}
                height={size}
                style={{ position: "absolute", transform: "rotate(-90deg)" }}
              >
                <circle
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={trackColor}
                  strokeWidth={strokeWidth}
                />

                {/* Animated Progress Ring */}
                {target > 0 && (
                  <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset, stroke: ringColor }}
                    transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    style={{ strokeDasharray: circumference }}
                  />
                )}
              </svg>

              {/* Number Display */}
              <AppStack spacing={0} sx={{ alignItems: "center", zIndex: 2 }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={count}
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{
                      scale: 1.1,
                      opacity: 0,
                      y: -10,
                      position: "absolute",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <AppText
                      variant="h1"
                      sx={{
                        fontSize: count > 999 ? "4.5rem" : "6rem",
                        fontWeight: 800,
                        color: isComplete ? "success.main" : "text.primary",
                        lineHeight: 1,
                        textShadow:
                          theme.palette.mode === "dark"
                            ? "0px 4px 20px rgba(0,0,0,0.5)"
                            : "none",
                      }}
                    >
                      {displayCount}
                    </AppText>
                  </motion.div>
                </AnimatePresence>
                <AppText
                  variant="body2"
                  sx={{
                    color: isComplete ? "success.main" : "text.disabled",
                    fontWeight: 500,
                    mt: 1,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontSize: "0.75rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  {isComplete ? "Target Reached" : t("tasbeeh.tap")}
                </AppText>
              </AppStack>
            </Box>
          </TapFeedback>
        </Box>

        {/* Bottom Actions */}
        {isComplete ? (
          <Box sx={{ px: 4, mt: 8, mb: 4, zIndex: 10, width: "100%", maxWidth: 480 }}>
            <AppButton
              fullWidth
              variant="contained"
              color="success"
              onClick={handleGoNext}
              sx={{ py: 1.6, borderRadius: 10, fontWeight: 800 }}
            >
              Go to Next Tasbeeh
            </AppButton>
          </Box>
        ) : (
          <AppStack
            direction="row"
            spacing={3}
            sx={{ justifyContent: "center", px: 4, mt: 8, mb: 4, zIndex: 10 }}
          >
            <AppButton
              variant="text"
              startIcon={<Icons.Remove />}
              onClick={() => tasbeehId && decrement(tasbeehId)}
              sx={{
                bgcolor: trackColor,
                color: "text.secondary",
                borderRadius: 8,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.08),
                },
              }}
            >
              {t("tasbeeh.counter.decrement") || "Decrease"}
            </AppButton>

            <AppButton
              variant="text"
              startIcon={<Icons.Reset />}
              onClick={handleResetRequest}
              sx={{
                bgcolor: trackColor,
                color: "text.secondary",
                borderRadius: 8,
                px: 3,
                py: 1.5,
                fontWeight: 600,
                "&:hover": {
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.08),
                },
              }}
            >
              {t("tasbeeh.reset") || "Reset"}
            </AppButton>
          </AppStack>
        )}
      </AppStack>

      {/* Confirmation Dialog */}
      <AppDialog
        open={confirmResetOpen}
        title={t("tasbeeh.reset")}
        onClose={() => setConfirmResetOpen(false)}
        primaryAction={{
          label: "Reset",
          onClick: executeReset,
        }}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setConfirmResetOpen(false),
        }}
      >
        <AppText variant="body1" color="text.secondary">
          Are you sure you want to reset your count for {title}? This action can be undone briefly.
        </AppText>
      </AppDialog>

      {/* Undo Snackbar */}
      <Snackbar
        open={undoSnackbarOpen}
        autoHideDuration={3000}
        onClose={(_, reason) => {
          if (reason === "clickaway") return;
          setUndoSnackbarOpen(false);
        }}
        message="Tasbeeh reset to 0"
        action={
          <Button color="primary" size="small" onClick={handleUndoReset} sx={{ fontWeight: 700 }}>
            UNDO
          </Button>
        }
      />
    </ScreenContainer>
  );
}
