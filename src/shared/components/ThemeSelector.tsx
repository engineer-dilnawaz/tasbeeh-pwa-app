import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import { alpha } from "@mui/material/styles";

import { useThemeModeContext } from "@/app/providers";
import { Icons } from "./icons";
import { AppText } from "./AppText";
import { t } from "@/shared/locales";

const options = [
  {
    key: "light",
    label: t("screens.settings.themeOption.light"),
    icon: <Icons.LightMode fontSize="small" />,
  },
  {
    key: "dark",
    label: t("screens.settings.themeOption.dark"),
    icon: <Icons.DarkMode fontSize="small" />,
  },
  {
    key: "system",
    label: t("screens.settings.themeOption.system"),
    icon: <Icons.SystemMode fontSize="small" />,
  },
] as const;

export function ThemeSelector() {
  const { preference, setMode } = useThemeModeContext();

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        alignItems: "stretch",
        bgcolor: theme.custom.surface.level2,
        borderRadius: "16px",
        p: 0.5,
        width: "100%",
        minHeight: 48,
      })}
    >
      {options.map((opt) => {
        const isSelected = preference === opt.key;
        return (
          <ButtonBase
            key={opt.key}
            onClick={() => setMode(opt.key)}
            sx={(theme) => ({
              flex: 1,
              py: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              borderRadius: "12px",
              transition: "all 0.2s ease-in-out",
              bgcolor: isSelected
                ? theme.palette.mode === "dark"
                  ? alpha(theme.palette.common.white, 0.12)
                  : theme.custom.surface.level1
                : "transparent",
              boxShadow: isSelected
                ? theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(0,0,0,0.6)"
                  : "0 2px 8px rgba(0,0,0,0.08)"
                : "none",
              color: isSelected ? "text.primary" : "text.secondary",
              "&:hover": {
                color: isSelected ? "text.primary" : "text.primary",
              },
            })}
          >
            {opt.icon}
            <AppText
              variant="body2"
              sx={{
                fontWeight: isSelected ? 700 : 500,
                color: "inherit",
              }}
            >
              {opt.label}
            </AppText>
          </ButtonBase>
        );
      })}
    </Box>
  );
}
