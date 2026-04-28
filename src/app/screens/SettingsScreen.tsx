import Box from "@mui/material/Box";
import { useRef, useState } from "react";

import { useTasbeehStore } from "@/features/tasbeeh/store";
import {
  AppBottomSheet,
  AppButton,
  AppCard,
  AppDialog,
  AppListRow,
  AppStack,
  AppText,
  Icons,
  ScreenContainer,
  ThemeSelector,
} from "@/shared/components";
import { t } from "@/shared/locales";
import { alpha, ButtonBase } from "@mui/material";

export function SettingsScreen() {
  const resetAll = useTasbeehStore((s) => s.resetAll);
  const items = useTasbeehStore((s) => s.items);
  const counts = useTasbeehStore((s) => s.counts);

  const [fontSheetOpen, setFontSheetOpen] = useState(false);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);
  const [exportSheetOpen, setExportSheetOpen] = useState(false);
  const [importSheetOpen, setImportSheetOpen] = useState(false);
  const [resetSheetOpen, setResetSheetOpen] = useState(false);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const [fontTab, setFontTab] = useState<"en" | "ar" | "ur">("en");

  const [selectedImportFile, setSelectedImportFile] = useState<{
    name: string;
    size: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mocks for active states
  const activeLanguage = "en";
  const activeFonts = { en: "inter", ar: "amiri", ur: "noto-nastaliq" };

  // const downloadData = () => {
  //   // Mock functionality
  // };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImportFile({ name: file.name, size: file.size });
    }
    if (e.target) {
      e.target.value = ""; // Reset to allow selecting same file again
    }
  };

  const handleImport = () => {
    // Static for now
    setTimeout(() => {
      setImportSheetOpen(false);
      setTimeout(() => setSelectedImportFile(null), 300);
    }, 400);
  };

  const downloadExport = (withProgress: boolean) => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      tasbeeh: {
        items,
        counts: withProgress ? counts : {},
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasbeeh-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ScreenContainer>
      <AppStack spacing={2.5}>
        <Box sx={{ px: 2, pt: 1 }}>
          <ThemeSelector />
        </Box>

        <AppStack spacing={2}>
          <AppCard>
            <AppStack spacing={0.5}>
              <AppText
                variant="body2"
                sx={{
                  px: 2,
                  pt: 1.5,
                  fontWeight: 500,
                  color: "text.secondary",
                }}
              >
                {t("screens.settings.preferences")}
              </AppText>
              <AppStack spacing={0.5} sx={{ pb: 0.5 }}>
                <AppListRow
                  title={t("screens.settings.fontSheetTitle")}
                  subtitle={t("screens.settings.fontValue")}
                  onClick={() => setFontSheetOpen(true)}
                />
                <AppListRow
                  title={t("screens.settings.languageSheetTitle")}
                  subtitle={t("screens.settings.languageValue")}
                  onClick={() => setLanguageSheetOpen(true)}
                />
              </AppStack>
            </AppStack>
          </AppCard>

          <AppCard>
            <AppStack spacing={0.5}>
              <AppText
                variant="body2"
                sx={{
                  px: 2,
                  pt: 1.5,
                  fontWeight: 500,
                  color: "text.secondary",
                }}
              >
                {t("screens.settings.dataManagement")}
              </AppText>
              <AppStack spacing={0.5} sx={{ pb: 0.5 }}>
                <AppListRow
                  title={t("screens.settings.exportData")}
                  onClick={() => setExportSheetOpen(true)}
                />
                <AppListRow
                  title={t("screens.settings.importData")}
                  onClick={() => setImportSheetOpen(true)}
                />
                <AppListRow
                  title={t("screens.settings.resetAll")}
                  onClick={() => setResetSheetOpen(true)}
                />
              </AppStack>
            </AppStack>
          </AppCard>
        </AppStack>
      </AppStack>

      <AppBottomSheet
        open={fontSheetOpen}
        onClose={() => setFontSheetOpen(false)}
        icon={<Icons.Font fontSize="medium" />}
      >
        <AppStack spacing={2} sx={{ pt: 1, px: 2, pb: 2 }}>
          {/* Tab Selector */}
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
            {(
              [
                { id: "en", label: "English" },
                { id: "ar", label: "Arabic" },
                { id: "ur", label: "Urdu" },
              ] as const
            ).map((tab) => {
              const isSelected = fontTab === tab.id;
              return (
                <ButtonBase
                  key={tab.id}
                  onClick={() => setFontTab(tab.id)}
                  sx={(theme) => ({
                    flex: 1,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                  <AppText
                    variant="body2"
                    sx={{
                      fontWeight: isSelected ? 700 : 500,
                      color: "inherit",
                    }}
                  >
                    {tab.label}
                  </AppText>
                </ButtonBase>
              );
            })}
          </Box>

          {/* Font List */}
          <AppStack spacing={1.5}>
            {(fontTab === "en"
              ? [
                  { id: "roboto", label: "Roboto", font: "Roboto, sans-serif" },
                  { id: "inter", label: "Inter", font: "Inter, sans-serif" },
                  {
                    id: "system",
                    label: "System (SF Pro)",
                    font: "system-ui, -apple-system, sans-serif",
                  },
                ]
              : fontTab === "ar"
                ? [
                    { id: "amiri", label: "Amiri", font: "'Amiri', serif" },
                    {
                      id: "system",
                      label: "System Arabic",
                      font: "system-ui, -apple-system, sans-serif",
                    },
                  ]
                : [
                    {
                      id: "noto-nastaliq",
                      label: "Noto Nastaliq",
                      font: "'Noto Nastaliq Urdu', serif",
                    },
                    {
                      id: "system",
                      label: "System Urdu",
                      font: "system-ui, -apple-system, sans-serif",
                    },
                  ]
            ).map((f) => {
              const isSelected = activeFonts[fontTab] === f.id;
              return (
                <ButtonBase
                  key={f.id}
                  onClick={() => {
                    setTimeout(() => setFontSheetOpen(false), 250);
                  }}
                  sx={(theme) => ({
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
                    bgcolor: isSelected
                      ? alpha(
                          theme.palette.primary.main,
                          theme.palette.mode === "dark" ? 0.15 : 0.08,
                        )
                      : theme.custom.surface.level2,
                    border: `1px solid ${
                      isSelected ? theme.palette.primary.main : "transparent"
                    }`,
                    transition: "all 0.2s ease",
                  })}
                >
                  <AppText
                    variant="body1"
                    sx={{
                      fontFamily: f.font,
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? "primary.main" : "text.primary",
                    }}
                  >
                    {f.label}
                  </AppText>
                  {isSelected && (
                    <Icons.Check color="primary" fontSize="small" />
                  )}
                </ButtonBase>
              );
            })}
          </AppStack>
        </AppStack>
      </AppBottomSheet>

      <AppBottomSheet
        open={languageSheetOpen}
        onClose={() => setLanguageSheetOpen(false)}
        icon={<Icons.Language fontSize="medium" />}
      >
        <AppStack spacing={1.5} sx={{ pt: 1, px: 2, pb: 2 }}>
          {(
            [
              { id: "en", label: "English" },
              { id: "ar", label: "العربية (Arabic)" },
              { id: "ur", label: "اردو (Urdu)" },
            ] as const
          ).map((lang) => {
            const isSelected = activeLanguage === lang.id;
            return (
              <ButtonBase
                key={lang.id}
                onClick={() => {
                  setTimeout(() => setLanguageSheetOpen(false), 250);
                }}
                sx={(theme) => ({
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
                  bgcolor: isSelected
                    ? alpha(
                        theme.palette.primary.main,
                        theme.palette.mode === "dark" ? 0.15 : 0.08,
                      )
                    : theme.custom.surface.level2,
                  border: `1px solid ${
                    isSelected ? theme.palette.primary.main : "transparent"
                  }`,
                  transition: "all 0.2s ease",
                })}
              >
                <AppText
                  variant="body1"
                  sx={{
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "primary.main" : "text.primary",
                  }}
                >
                  {lang.label}
                </AppText>
                {isSelected && <Icons.Check color="primary" fontSize="small" />}
              </ButtonBase>
            );
          })}
        </AppStack>
      </AppBottomSheet>

      <AppBottomSheet
        open={exportSheetOpen}
        onClose={() => setExportSheetOpen(false)}
        icon={<Icons.Export fontSize="medium" />}
        description={t("screens.settings.exportSheetBody")}
      >
        <AppStack spacing={1.5} sx={{ pt: 1, px: 2, pb: 2 }}>
          <ButtonBase
            onClick={() => {
              downloadExport(false);
              setExportSheetOpen(false);
            }}
            sx={(theme) => ({
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
              bgcolor: theme.custom.surface.level2,
              border: `1px solid transparent`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
              },
            })}
          >
            <AppStack
              spacing={0.5}
              sx={{ alignItems: "flex-start", textAlign: "left" }}
            >
              <AppText
                variant="body1"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                {t("screens.settings.exportDataOnly")}
              </AppText>
              <AppText variant="body2" sx={{ color: "text.secondary" }}>
                {t("screens.settings.exportDataOnlyDesc")}
              </AppText>
            </AppStack>
            <Icons.ChevronRight color="action" fontSize="small" />
          </ButtonBase>

          <ButtonBase
            onClick={() => {
              downloadExport(true);
              setExportSheetOpen(false);
            }}
            sx={(theme) => ({
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
              bgcolor: alpha(
                theme.palette.primary.main,
                theme.palette.mode === "dark" ? 0.15 : 0.08,
              ),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.25 : 0.12,
                ),
              },
            })}
          >
            <AppStack
              spacing={0.5}
              sx={{ alignItems: "flex-start", textAlign: "left" }}
            >
              <AppText
                variant="body1"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {t("screens.settings.exportWithProgress")}
              </AppText>
              <AppText
                variant="body2"
                sx={{ color: "primary.main", opacity: 0.8 }}
              >
                {t("screens.settings.exportWithProgressDesc")}
              </AppText>
            </AppStack>
            <Icons.ChevronRight color="primary" fontSize="small" />
          </ButtonBase>
        </AppStack>
      </AppBottomSheet>

      <AppBottomSheet
        open={importSheetOpen}
        onClose={() => setImportSheetOpen(false)}
        icon={<Icons.Import fontSize="medium" />}
        description={t("screens.settings.importSheetBody")}
      >
        <AppStack spacing={2} sx={{ pt: 1, px: 2, pb: 2 }}>
          <input
            type="file"
            accept=".json"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileSelect}
          />

          <ButtonBase
            onClick={() => fileInputRef.current?.click()}
            sx={(theme) => ({
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderRadius: `${theme.custom.tasbeeh.card.radius}px`,
              bgcolor: theme.custom.surface.level2,
              border: `1px dashed ${theme.palette.divider}`,
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.02),
              },
            })}
          >
            <AppStack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: "center" }}
            >
              <Box
                sx={{
                  color: "text.secondary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Icons.Import fontSize="small" />
              </Box>
              <AppText variant="body1" sx={{ fontWeight: 500 }}>
                {t("screens.settings.importSelectFile")}
              </AppText>
            </AppStack>
            <Icons.ChevronRight color="action" fontSize="small" />
          </ButtonBase>

          {selectedImportFile && (
            <Box
              sx={(theme) => ({
                p: 1.5,
                borderRadius: "12px",
                bgcolor: alpha(
                  theme.palette.primary.main,
                  theme.palette.mode === "dark" ? 0.15 : 0.08,
                ),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
              })}
            >
              <AppText
                variant="body2"
                sx={{ fontWeight: 600, color: "primary.main" }}
              >
                {selectedImportFile.name}
              </AppText>
              <AppText
                variant="caption"
                sx={{ color: "primary.main", opacity: 0.8 }}
              >
                {(selectedImportFile.size / 1024).toFixed(1)} KB
              </AppText>
            </Box>
          )}

          <AppButton
            variant="contained"
            fullWidth
            disabled={!selectedImportFile}
            onClick={handleImport}
          >
            {t("screens.settings.importAction")}
          </AppButton>
        </AppStack>
      </AppBottomSheet>

      <AppBottomSheet
        open={resetSheetOpen}
        onClose={() => setResetSheetOpen(false)}
        icon={<Icons.Reset fontSize="medium" />}
        description={t("screens.settings.resetSheetBody")}
      >
        <AppStack spacing={2} sx={{ pt: 1 }}>
          <AppButton
            variant="contained"
            color="error"
            fullWidth
            onClick={() => {
              setResetSheetOpen(false);
              setConfirmResetOpen(true);
            }}
          >
            {t("screens.settings.resetSheetAction")}
          </AppButton>
        </AppStack>
      </AppBottomSheet>

      <AppDialog
        open={confirmResetOpen}
        title={t("screens.settings.resetConfirmTitle")}
        onClose={() => setConfirmResetOpen(false)}
        secondaryAction={{
          label: t("screens.settings.cancel"),
          onClick: () => setConfirmResetOpen(false),
        }}
        primaryAction={{
          label: t("screens.settings.confirmReset"),
          onClick: () => {
            resetAll();
            setConfirmResetOpen(false);
          },
        }}
      >
        <AppText variant="body2" color="text.secondary">
          {t("screens.settings.resetConfirmBody")}
        </AppText>
      </AppDialog>
    </ScreenContainer>
  );
}
