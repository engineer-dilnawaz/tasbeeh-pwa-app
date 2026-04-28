import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import type { PropsWithChildren } from "react";

type CommonProps = PropsWithChildren<{
  onClick?: () => void;
  ariaLabel?: string;
}>;

export function AppCard({ children, onClick, ariaLabel }: CommonProps) {
  const content = <Box sx={(theme) => ({ p: `${theme.custom.tasbeeh.card.padding}px` })}>{children}</Box>;

  return (
    <Box
      sx={(theme) => ({
        borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
        bgcolor: theme.palette.background.paper,
      })}
    >
      {onClick ? (
        <ButtonBase
          onClick={onClick}
          aria-label={ariaLabel}
          sx={(theme) => ({
            display: "block",
            width: "100%",
            textAlign: "left",
            borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
          })}
        >
          {content}
        </ButtonBase>
      ) : (
        content
      )}
    </Box>
  );
}

