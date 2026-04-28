import Box from "@mui/material/Box";
import type { PropsWithChildren } from "react";

type ScreenContainerProps = PropsWithChildren<{
  noPadding?: boolean;
}>;

export function ScreenContainer({ children, noPadding = false }: ScreenContainerProps) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100dvh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        justifyContent: "center",
        px: noPadding ? 0 : 2,
        pt: noPadding ? 0 : 3,
        pb: 12,
      })}
    >
      <Box sx={{ width: "100%", maxWidth: 480, display: "flex", flexDirection: "column" }}>{children}</Box>
    </Box>
  );
}

