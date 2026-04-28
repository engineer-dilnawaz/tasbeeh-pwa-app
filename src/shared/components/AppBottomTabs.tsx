import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Paper from "@mui/material/Paper";
import { alpha } from "@mui/material/styles";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/constants";
import { Icons } from "@/shared/components/icons";
import { AppStack } from "@/shared/components/AppStack";
import { AppText } from "@/shared/components/AppText";
import { t } from "@/shared/locales";

type TabKey = "home" | "collection" | "stats" | "settings";

function getTabValue(pathname: string): TabKey {
  if (pathname.startsWith(ROUTES.home)) return "home";
  if (pathname.startsWith(ROUTES.collection)) return "collection";
  if (pathname.startsWith(ROUTES.stats)) return "stats";
  if (pathname.startsWith(ROUTES.settings)) return "settings";
  return "home";
}

export function AppBottomTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const value = useMemo(
    () => getTabValue(location.pathname),
    [location.pathname],
  );

  const items = useMemo(
    () =>
      [
        {
          key: "home",
          label: t("nav.home"),
          Icon: Icons.Home,
          to: ROUTES.home,
        },
        {
          key: "collection",
          label: t("nav.collection"),
          Icon: Icons.Collection,
          to: ROUTES.collection,
        },
        {
          key: "stats",
          label: t("nav.stats"),
          Icon: Icons.Stats,
          to: ROUTES.stats,
        },
        {
          key: "settings",
          label: t("nav.settings"),
          Icon: Icons.Settings,
          to: ROUTES.settings,
        },
      ] as const,
    [],
  );

  return (
    <Paper
      sx={(theme) => ({
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: "calc(72px + max(env(safe-area-inset-bottom), 0px))",
        borderRadius: 0,
        borderTopLeftRadius: `calc(${theme.shape.borderRadius}px * 2)`,
        borderTopRightRadius: `calc(${theme.shape.borderRadius}px * 2)`,
        overflow: "hidden",
        bgcolor: theme.palette.background.paper,
        pb: "max(env(safe-area-inset-bottom), 0px)",
        boxSizing: "border-box",
      })}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          height: 72,
          px: 1.25,
          pt: 1,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 480 }}>
          <AppStack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center" }}
          >
            {items.map(({ key, label, Icon, to }) => {
              const isActive = value === key;

              return (
                <Box key={key} sx={{ flex: 1, minWidth: 0 }}>
                  <ButtonBase
                    onClick={() => navigate(to)}
                    sx={{
                      width: "100%",
                      height: 64,
                      borderRadius: 999,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppStack
                      direction="column"
                      spacing={0.25}
                      sx={(theme) => ({
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: isActive ? 84 : 64,
                        maxWidth: "100%",
                        px: isActive ? 2 : 1.25,
                        py: isActive ? 0.75 : 0.5,
                        height: 56,
                        borderRadius: 999,
                        color: isActive
                          ? theme.palette.primary.main
                          : theme.palette.text.secondary,
                        backgroundColor: isActive
                          ? alpha(theme.palette.primary.main, 0.12)
                          : "transparent",
                        transition: theme.transitions.create(
                          ["padding", "background-color", "color"],
                          { duration: 220 },
                        ),
                      })}
                    >
                      <Icon fontSize="medium" />

                      <AppText
                        variant="caption"
                        sx={(theme) => ({
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "100%",
                          maxHeight: isActive ? 16 : 0,
                          opacity: isActive ? 1 : 0,
                          transform: isActive
                            ? "translateY(0px)"
                            : "translateY(-4px)",
                          transition: theme.transitions.create(
                            ["max-height", "opacity", "transform"],
                            { duration: 220 },
                          ),
                        })}
                      >
                        {label}
                      </AppText>
                    </AppStack>
                  </ButtonBase>
                </Box>
              );
            })}
          </AppStack>
        </Box>
      </Box>
    </Paper>
  );
}
