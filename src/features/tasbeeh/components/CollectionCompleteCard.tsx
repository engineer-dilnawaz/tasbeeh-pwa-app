import { Box, alpha } from "@mui/material";
import { motion } from "framer-motion";

import { AppButton, AppStack, AppText, Icons } from "@/shared/components";

type CollectionCompleteCardProps = {
  onBackToCollections: () => void;
  onRestart: () => void;
};

export function CollectionCompleteCard({
  onBackToCollections,
  onRestart,
}: CollectionCompleteCardProps) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
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
              theme.palette.primary.main,
              theme.palette.mode === "dark" ? 0.15 : 0.08,
            ),
            borderRadius: "50%",
          })}
        >
          <Icons.Collection sx={{ fontSize: 36, color: "primary.main" }} />
        </Box>
      </Box>

      <AppText variant="h5" sx={{ fontWeight: 800, color: "text.primary", mb: 1 }}>
        Collection completed
      </AppText>
      <AppText variant="body1" sx={{ color: "text.secondary", mb: 4, lineHeight: 1.5 }}>
        You’ve finished all tasbeeh targets in this collection.
      </AppText>

      <AppStack spacing={2}>
        <AppButton
          fullWidth
          variant="contained"
          onClick={onRestart}
          sx={{ borderRadius: 8, py: 1.5, fontWeight: 700 }}
        >
          Restart collection
        </AppButton>
        <AppButton
          fullWidth
          variant="text"
          onClick={onBackToCollections}
          sx={{ color: "text.secondary" }}
        >
          Back to collections
        </AppButton>
      </AppStack>
    </Box>
  );
}

