import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";

import { AppStack } from "./AppStack";
import { AppText } from "./AppText";
import { Icons } from "./icons";

export type AppListRowProps = {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function AppListRow({ title, subtitle, onClick, ariaLabel }: AppListRowProps) {
  return (
    <ButtonBase
      onClick={onClick}
      aria-label={ariaLabel ?? title}
      sx={(theme) => ({
        width: "100%",
        display: "block",
        textAlign: "left",
        borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
        "&:hover > .AppListRow-surface": {
          bgcolor: theme.palette.action.hover,
        },
        "&:active > .AppListRow-surface": {
          bgcolor: theme.palette.action.selected,
        },
      })}
    >
      <Box
        className="AppListRow-surface"
        sx={(theme) => ({
          px: 2,
          py: 1.5,
          borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
          bgcolor: "transparent",
        })}
      >
        <AppStack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <AppStack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
            <AppText variant="subtitle1" color="text.secondary" noWrap>
              {title}
            </AppText>
            {subtitle ? (
              <AppText variant="body2" color="text.disabled" noWrap>
                {subtitle}
              </AppText>
            ) : null}
          </AppStack>

          <Icons.ChevronRight fontSize="small" color="disabled" />
        </AppStack>
      </Box>
    </ButtonBase>
  );
}

