import { Box, alpha } from "@mui/material";
import { motion } from "framer-motion";

import { AppButton, AppStack, AppText, Icons } from "@/shared/components";

interface CompletionCardProps {
  onContinue: () => void;
  primaryAction?: { label: string; onClick: () => void };
}

export function CompletionCard({ onContinue, primaryAction }: CompletionCardProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      sx={(theme) => ({
        width: "100%",
        py: 4,
        px: 3,
        bgcolor: "background.paper",
        borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
        textAlign: "center",
      })}
    >
      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <Box
          sx={(theme) => ({
            width: 72,
            height: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(
              theme.palette.success.main,
              theme.palette.mode === "dark" ? 0.15 : 0.08,
            ),
            borderRadius: "50%",
          })}
        >
          <Icons.Check sx={{ fontSize: 36, color: "success.main" }} />
        </Box>
      </Box>
      <AppText
        variant="h5"
        sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}
      >
        Goal Completed!
      </AppText>
      <AppText
        variant="body1"
        sx={{ color: "text.secondary", mb: 4, lineHeight: 1.5 }}
      >
        Alhamdulillah, you have reached your target for this tasbeeh. May Allah
        accept it.
      </AppText>

      <AppStack spacing={2}>
        {primaryAction ? (
          <AppButton
            fullWidth
            variant="contained"
            color="success"
            onClick={primaryAction.onClick}
            sx={{ borderRadius: 8, py: 1.5, fontWeight: 700 }}
          >
            {primaryAction.label}
          </AppButton>
        ) : null}
        <AppButton
          fullWidth
          variant="text"
          onClick={onContinue}
          sx={{ color: "text.secondary" }}
        >
          Continue Counting
        </AppButton>
      </AppStack>
    </Box>
  );
}
