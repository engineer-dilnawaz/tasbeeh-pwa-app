import Box from "@mui/material/Box";
import type { SwipeableDrawerProps } from "@mui/material/SwipeableDrawer";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import type { SxProps, Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { AppStack } from "./AppStack";
import { AppText } from "./AppText";

export type AppBottomSheetProps = Omit<
  SwipeableDrawerProps,
  "anchor" | "onOpen"
> & {
  onOpen?: (event: React.SyntheticEvent<object>) => void;
  icon?: ReactNode;
  title?: string;
  description?: string;
  /** Controls the padding around grabber/header/content (outer container). */
  containerSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  paperSx?: SxProps<Theme>;
};

export function AppBottomSheet({
  icon,
  title,
  description,
  children,
  containerSx,
  contentSx,
  paperSx,
  ...drawerProps
}: AppBottomSheetProps) {
  const basePaperSx: SxProps<Theme> = (theme) => ({
    borderTopLeftRadius: `calc(${theme.shape.borderRadius}px * 2)`,
    borderTopRightRadius: `calc(${theme.shape.borderRadius}px * 2)`,
    bgcolor: theme.custom.surface.level1,
    maxHeight: "min(92dvh, 900px)",
    overflow: "hidden",
  });

  const mergedPaperSx = (
    paperSx ? [basePaperSx, paperSx] : [basePaperSx]
  ) as SxProps<Theme>;

  const mergedContentSx = (
    contentSx
      ? [
          {
            overflow: "auto",
            pb: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          },
          contentSx,
        ]
      : [
          {
            overflow: "auto",
            pb: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          },
        ]
  ) as SxProps<Theme>;

  const mergedContainerSx = (
    containerSx
      ? [
          {
            px: 2.5,
            pt: 2.5,
            pb: "max(env(safe-area-inset-bottom), 20px)",
          },
          containerSx,
        ]
      : [
          {
            px: 2.5,
            pt: 2.5,
            pb: "max(env(safe-area-inset-bottom), 20px)",
          },
        ]
  ) as SxProps<Theme>;

  return (
    <SwipeableDrawer
      anchor="bottom"
      disableSwipeToOpen={true}
      onOpen={drawerProps.onOpen || (() => {})}
      {...drawerProps}
      slotProps={{
        ...drawerProps.slotProps,
        paper: {
          elevation: 0,
          sx: mergedPaperSx,
          tabIndex: -1,
        },
      }}
    >
      <AppStack
        spacing={2.5}
        sx={mergedContainerSx}
      >
        {/* Grabber */}
        <Box
          sx={(theme) => ({
            width: 44,
            height: 4,
            borderRadius: 999,
            bgcolor: theme.palette.divider,
            alignSelf: "center",
            opacity: 0.7,
          })}
        />

        {/* Header Section */}
        {(icon || title || description) && (
          <AppStack
            spacing={1}
            sx={{ alignItems: "center", textAlign: "center", px: 2, pb: 1 }}
          >
            {icon && (
              <Box
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                sx={(theme) => ({
                  width: 64,
                  height: 64,
                  borderRadius: 999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.15 : 0.08,
                  ),
                  color: theme.palette.primary.main,
                  mb: 1,
                  "& svg": {
                    display: "block",
                    width: 32,
                    height: 32,
                  },
                })}
              >
                {icon}
              </Box>
            )}

            {title && (
              <AppText
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "text.primary",
                }}
              >
                {title}
              </AppText>
            )}

            {description && (
              <AppText
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: "90%", lineHeight: 1.6 }}
              >
                {description}
              </AppText>
            )}
          </AppStack>
        )}

        {/* Content */}
        <Box sx={mergedContentSx}>{children}</Box>
      </AppStack>
    </SwipeableDrawer>
  );
}
