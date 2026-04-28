import {
  Box,
  Chip,
  Collapse,
  Divider,
  Fab,
  TextField,
  alpha,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBottomSheet,
  AppButton,
  AppDialog,
  AppIconButton,
  AppNumberField,
  AppStack,
  AppText,
  Icons,
  ScreenContainer,
} from "@/shared/components";
import { ROUTES } from "@/shared/constants";
import { t } from "@/shared/locales";

import { useTasbeehStore } from "@/features/tasbeeh/store";
import type {
  Collection,
  CollectionId,
  Tasbeeh,
} from "@/features/tasbeeh/types";

// ─── Types ───────────────────────────────────────────────────────────────────

type CollectionManagerMode =
  | { kind: "create" }
  | { kind: "edit"; collectionId: CollectionId };

// ─── Screen ──────────────────────────────────────────────────────────────────

export function TasbeehListScreen() {
  const navigate = useNavigate();
  const theme = useTheme();

  const items = useTasbeehStore((s) => s.items);
  const collections = useTasbeehStore((s) => s.collections);
  const hasHydrated = useTasbeehStore((s) => s.hasHydrated);

  const selectCollection = useTasbeehStore((s) => s.selectCollection);
  const select = useTasbeehStore((s) => s.select);
  const addCollection = useTasbeehStore((s) => s.addCollection);
  const updateCollection = useTasbeehStore((s) => s.updateCollection);
  const removeCollection = useTasbeehStore((s) => s.removeCollection);
  const addTasbeehToCollection = useTasbeehStore(
    (s) => s.addTasbeehToCollection,
  );
  const updateTasbeeh = useTasbeehStore((s) => s.updateTasbeeh);
  const removeTasbeehFromCollection = useTasbeehStore(
    (s) => s.removeTasbeehFromCollection,
  );

  // ─── Search ──────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");

  // ─── Expand/Collapse ─────────────────────────────────────────────────────
  const [expandedIds, setExpandedIds] = useState<Set<CollectionId>>(
    () => new Set(collections.map((c) => c.id)),
  );
  const toggleExpanded = (id: CollectionId) =>
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ─── Context menu (three-dots) ────────────────────────────────────────────
  const [contextCollection, setContextCollection] = useState<Collection | null>(
    null,
  );

  // ─── Collection Manager Sheet ─────────────────────────────────────────────
  const [managerMode, setManagerMode] = useState<CollectionManagerMode | null>(
    null,
  );
  const [collectionTitle, setCollectionTitle] = useState("");

  // Inline tasbeeh form
  const [editingTasbeehId, setEditingTasbeehId] = useState<string | null>(null);
  const [addTasbeehSheetOpen, setAddTasbeehSheetOpen] = useState(false);
  const [tasbeehForm, setTasbeehForm] = useState({
    title: "",
    arabic: "",
    targetCount: 33,
  });

  const resetTasbeehForm = () => {
    setTasbeehForm({ title: "", arabic: "", targetCount: 33 });
    setEditingTasbeehId(null);
    setAddTasbeehSheetOpen(false);
  };

  const openCreateCollection = () => {
    setCollectionTitle("");
    resetTasbeehForm();
    setManagerMode({ kind: "create" });
  };

  const openEditCollection = (collection: Collection) => {
    setCollectionTitle(collection.title);
    resetTasbeehForm();
    setManagerMode({ kind: "edit", collectionId: collection.id });
  };

  const closeManager = () => {
    setManagerMode(null);
    resetTasbeehForm();
  };

  const handleSaveCollectionName = () => {
    if (!collectionTitle.trim()) return;
    if (managerMode?.kind === "create") {
      addCollection(collectionTitle.trim());
      setTimeout(() => {
        const latest = useTasbeehStore.getState().collections;
        const newest = latest[latest.length - 1];
        if (newest) {
          setExpandedIds((prev) => new Set([...prev, newest.id]));
          setManagerMode({ kind: "edit", collectionId: newest.id });
        }
      }, 0);
    } else if (managerMode?.kind === "edit") {
      updateCollection(managerMode.collectionId, {
        title: collectionTitle.trim(),
      });
    }
  };

  const handleAddTasbeeh = () => {
    if (!tasbeehForm.title.trim() || managerMode?.kind !== "edit") return;
    addTasbeehToCollection(managerMode.collectionId, {
      title: tasbeehForm.title.trim(),
      arabic: tasbeehForm.arabic.trim(),
      targetCount: tasbeehForm.targetCount > 0 ? tasbeehForm.targetCount : 33,
    });
    resetTasbeehForm();
  };

  const startEditTasbeeh = (tasbeeh: Tasbeeh) => {
    setEditingTasbeehId(tasbeeh.id);
    setTasbeehForm({
      title:
        tasbeeh.title || (tasbeeh.titleKey ? t(tasbeeh.titleKey as any) : ""),
      arabic: tasbeeh.arabic || "",
      targetCount: tasbeeh.targetCount,
    });
    setAddTasbeehSheetOpen(true);
  };

  const handleSaveTasbeehEdit = () => {
    if (!editingTasbeehId || !tasbeehForm.title.trim()) return;
    updateTasbeeh(editingTasbeehId, {
      title: tasbeehForm.title.trim(),
      arabic: tasbeehForm.arabic.trim(),
      targetCount: tasbeehForm.targetCount > 0 ? tasbeehForm.targetCount : 33,
    });
    resetTasbeehForm();
  };

  const handleSubmitTasbeehSheet = () => {
    if (editingTasbeehId) {
      handleSaveTasbeehEdit();
      return;
    }
    handleAddTasbeeh();
  };

  // ─── Delete confirmations ─────────────────────────────────────────────────
  const [pendingDeleteCollectionId, setPendingDeleteCollectionId] =
    useState<CollectionId | null>(null);
  const [pendingDeleteTasbeeh, setPendingDeleteTasbeeh] = useState<{
    collectionId: CollectionId;
    tasbeehId: string;
  } | null>(null);

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filteredCollections = collections
    .map((collection) => {
      if (!searchQuery.trim())
        return { collection, matchedIds: collection.tasbeehIds };
      const q = searchQuery.toLowerCase();
      const titleMatch = collection.title.toLowerCase().includes(q);
      const matched = collection.tasbeehIds.filter((tid) => {
        const item = items.find((i) => i.id === tid);
        if (!item) return false;
        const title =
          item.title || (item.titleKey ? t(item.titleKey as any) : "");
        return (
          title.toLowerCase().includes(q) ||
          (item.arabic || "").includes(q) ||
          item.targetCount.toString().startsWith(q)
        );
      });
      return {
        collection,
        matchedIds: titleMatch ? collection.tasbeehIds : matched,
      };
    })
    .filter((e) => e.matchedIds.length > 0);

  const managedCollection =
    managerMode?.kind === "edit"
      ? (collections.find((c) => c.id === managerMode.collectionId) ?? null)
      : null;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <ScreenContainer noPadding>
      <AppStack spacing={0} sx={{ pb: 12 }}>
        {/* Sticky Search */}
        <Box
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            bgcolor: "background.paper",
            height: 64,
            display: "flex",
            alignItems: "center",
            px: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search tasbeeh..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <Icons.Search
                    sx={{ color: "text.secondary", mr: 1, fontSize: 20 }}
                  />
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor:
                  theme.palette.mode === "dark"
                    ? alpha(theme.palette.common.white, 0.05)
                    : alpha(theme.palette.common.black, 0.04),
                borderRadius: "12px",
                "& fieldset": { borderColor: "transparent" },
                "&:hover fieldset": { borderColor: "transparent" },
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            }}
          />
        </Box>

        {/* Collection List */}
        <AppStack spacing={1.5} sx={{ px: 2, pt: 2 }}>
          {!hasHydrated ? (
            <AppText variant="body2" color="text.secondary">
              {t("tasbeeh.counter.loading")}
            </AppText>
          ) : filteredCollections.length === 0 ? (
            <Box
              sx={{
                minHeight: "65vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  py: 4,
                  px: 3,
                  bgcolor: "background.paper",
                  borderRadius: "12px",
                }}
              >
                <AppStack
                  spacing={2}
                  sx={{ alignItems: "center", textAlign: "center" }}
                >
                  <Box
                    sx={{
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
                    }}
                  >
                    <Icons.Search
                      sx={{ fontSize: 36, color: "primary.main" }}
                    />
                  </Box>
                  <AppStack spacing={0.5}>
                    <AppText variant="h6" sx={{ fontWeight: 700 }}>
                      {searchQuery ? "No results found" : "No collections yet"}
                    </AppText>
                    <AppText variant="body2" color="text.secondary">
                      {searchQuery
                        ? `Nothing matched "${searchQuery}".`
                        : "Tap + to create your first collection."}
                    </AppText>
                  </AppStack>
                  {searchQuery && (
                    <AppButton
                      variant="outlined"
                      fullWidth
                      color="inherit"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </AppButton>
                  )}
                </AppStack>
              </Box>
            </Box>
          ) : (
            filteredCollections.map(({ collection, matchedIds }) => {
              const isExpanded = expandedIds.has(collection.id);

              return (
                <Box
                  key={collection.id}
                  sx={{
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  {/* ── Collection Header ── */}
                  <Box
                    sx={{
                      px: 2,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      borderBottom: isExpanded
                        ? `1px solid ${alpha(theme.palette.divider, 0.5)}`
                        : "none",
                    }}
                  >
                    {/* Tappable area → expand/collapse */}
                    <Box
                      onClick={() => toggleExpanded(collection.id)}
                      sx={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
                        minWidth: 0,
                        height: "100%",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          transition: "transform 0.2s ease",
                          transform: isExpanded
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      >
                        <Icons.ChevronDown
                          sx={{ color: "text.disabled", fontSize: 18 }}
                        />
                      </Box>
                      <AppText
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                        noWrap
                      >
                        {collection.title}
                      </AppText>
                      <Chip
                        label={collection.tasbeehIds.length}
                        color="primary"
                        variant="outlined"
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      />
                    </Box>

                    {/* Play */}
                    <AppIconButton
                      onClick={() => {
                        selectCollection(collection.id);
                        navigate(ROUTES.home);
                      }}
                    >
                      <Icons.Play
                        sx={{ color: "primary.main", fontSize: 22 }}
                      />
                    </AppIconButton>

                    {/* Three dots */}
                    <AppIconButton
                      onClick={() => setContextCollection(collection)}
                    >
                      <Icons.MoreVert
                        sx={{ color: "text.secondary", fontSize: 22 }}
                      />
                    </AppIconButton>
                  </Box>

                  {/* ── Tasbeeh Items ── */}
                  <Collapse in={isExpanded} timeout={200}>
                    <AppStack spacing={0}>
                      {matchedIds.map((tid, idx) => {
                        const item = items.find((i) => i.id === tid);
                        if (!item) return null;
                        const title =
                          item.title ||
                          (item.titleKey
                            ? t(item.titleKey as any)
                            : "Custom Tasbeeh");
                        const isLast = idx === matchedIds.length - 1;

                        return (
                          <Box
                            key={tid}
                            onClick={() => {
                              select(tid);
                              selectCollection(collection.id);
                              navigate(ROUTES.home);
                            }}
                            sx={{
                              px: 2,
                              py: 1.25,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              cursor: "pointer",
                              borderBottom: isLast
                                ? "none"
                                : `1px solid ${alpha(theme.palette.divider, 0.35)}`,
                              transition: "background-color 0.15s ease",
                              "&:active": {
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.04,
                                ),
                              },
                            }}
                          >
                            {/* Target count badge */}
                            <Box
                              sx={{
                                minWidth: 36,
                                height: 36,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  theme.palette.mode === "dark" ? 0.12 : 0.08,
                                ),
                                flexShrink: 0,
                              }}
                            >
                              <AppText
                                variant="caption"
                                sx={{
                                  fontWeight: 800,
                                  color: "primary.main",
                                  fontSize: "0.7rem",
                                }}
                              >
                                {item.targetCount}
                              </AppText>
                            </Box>

                            {/* Text */}
                            <AppStack spacing={0} sx={{ flex: 1, minWidth: 0 }}>
                              <AppText
                                variant="body2"
                                sx={{ fontWeight: 600, lineHeight: 1.3 }}
                                noWrap
                              >
                                {title}
                              </AppText>
                              {item.arabic && (
                                <AppText
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    fontFamily:
                                      "'Amiri', 'Noto Naskh Arabic', serif",
                                  }}
                                  noWrap
                                >
                                  {item.arabic}
                                </AppText>
                              )}
                            </AppStack>
                          </Box>
                        );
                      })}
                    </AppStack>
                  </Collapse>
                </Box>
              );
            })
          )}
        </AppStack>
      </AppStack>

      {/* FAB */}
      <Fab
        color="primary"
        onClick={openCreateCollection}
        sx={{
          position: "fixed",
          bottom: "max(env(safe-area-inset-bottom), 90px)",
          right: 20,
          zIndex: 10,
        }}
      >
        <Icons.Add />
      </Fab>

      {/* ── Context Menu Sheet (three-dots) ──────────────────── */}
      <AppBottomSheet
        open={contextCollection !== null && managerMode === null}
        onClose={() => setContextCollection(null)}
        containerSx={{
          minHeight: 200,
          pb: "max(env(safe-area-inset-bottom), 12px)",
        }}
      >
        <AppStack spacing={0} sx={{ px: 1, py: 0.5 }}>
          <AppText
            variant="subtitle2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 1.5 }}
          >
            {contextCollection?.title}
          </AppText>
          <Divider sx={{ mt: 0.5, mb: 4, width: "94%", mx: "auto" }} />
          <Box
            sx={(theme) => ({
              bgcolor: theme.custom.surface.level2,
              borderRadius: "8px",
              overflow: "hidden",
              py: 0.5,
              mb: 2,
            })}
          >
            <AppButton
              fullWidth
              variant="text"
              startIcon={<Icons.Edit />}
              onClick={() => {
                const col = contextCollection!;
                setContextCollection(null);
                setTimeout(() => openEditCollection(col), 150);
              }}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                color: "text.primary",
                borderRadius: 0,
              }}
            >
              Edit collection
            </AppButton>
            <Divider />
            <AppButton
              fullWidth
              variant="text"
              startIcon={<Icons.Delete />}
              onClick={() => {
                setPendingDeleteCollectionId(contextCollection!.id);
                setContextCollection(null);
              }}
              sx={{
                justifyContent: "flex-start",
                py: 1.5,
                color: "error.main",
                borderRadius: 0,
              }}
            >
              Delete collection
            </AppButton>
          </Box>
        </AppStack>
      </AppBottomSheet>

      {/* ── Collection Manager Sheet ──────────────────────────── */}
      <AppBottomSheet
        open={managerMode !== null}
        onClose={closeManager}
        icon={<Icons.Collection fontSize="medium" />}
      >
        <AppStack spacing={2.5} sx={{ px: 2, pb: 4, pt: 1 }}>
          <AppText variant="h6" sx={{ fontWeight: 800, textAlign: "center" }}>
            {managerMode?.kind === "create"
              ? "New collection"
              : "Manage collection"}
          </AppText>

          {/* Name row */}
          <AppStack direction="row" spacing={1} sx={{ alignItems: "flex-end" }}>
            <TextField
              fullWidth
              label="Collection name"
              variant="outlined"
              value={collectionTitle}
              onChange={(e) => setCollectionTitle(e.target.value)}
              placeholder="e.g. After Fajr"
              size="small"
            />
            <AppButton
              variant="contained"
              onClick={handleSaveCollectionName}
              disabled={!collectionTitle.trim()}
              sx={{ whiteSpace: "nowrap", flexShrink: 0, height: 40 }}
            >
              {managerMode?.kind === "create" ? "Create" : "Save"}
            </AppButton>
          </AppStack>

          {/* Tasbeeh list — edit mode only */}
          {managerMode?.kind === "edit" && managedCollection && (
            <>
              <Divider>
                <AppText
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Tasbeeh Items
                </AppText>
              </Divider>

              {managedCollection.tasbeehIds.length === 0 ? (
                <AppText
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center", py: 1 }}
                >
                  No tasbeeh yet. Add one below.
                </AppText>
              ) : (
                <AppStack
                  spacing={0}
                  sx={{
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                  }}
                >
                  {managedCollection.tasbeehIds.map((tid, idx) => {
                    const item = items.find((i) => i.id === tid);
                    if (!item) return null;
                    const title =
                      item.title ||
                      (item.titleKey
                        ? t(item.titleKey as any)
                        : "Custom Tasbeeh");
                    const isLast =
                      idx === managedCollection.tasbeehIds.length - 1;

                    return (
                      <Box key={tid}>
                        <Box
                          sx={{
                            px: 1.5,
                            py: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            borderBottom: !isLast
                              ? `1px solid ${alpha(theme.palette.divider, 0.4)}`
                              : "none",
                            bgcolor: "transparent",
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              flexShrink: 0,
                            }}
                          >
                            <AppText
                              variant="caption"
                              sx={{
                                fontWeight: 800,
                                color: "primary.main",
                                fontSize: "0.65rem",
                              }}
                            >
                              {item.targetCount}
                            </AppText>
                          </Box>
                          <AppText
                            variant="body2"
                            sx={{ fontWeight: 600, flex: 1 }}
                            noWrap
                          >
                            {title}
                          </AppText>
                          <AppIconButton onClick={() => startEditTasbeeh(item)}>
                            <Icons.Edit fontSize="small" color="action" />
                          </AppIconButton>
                          <AppIconButton
                            onClick={() =>
                              setPendingDeleteTasbeeh({
                                collectionId: managerMode.collectionId,
                                tasbeehId: tid,
                              })
                            }
                          >
                            <Icons.Delete fontSize="small" color="error" />
                          </AppIconButton>
                        </Box>
                      </Box>
                    );
                  })}
                </AppStack>
              )}

              <AppButton
                variant="outlined"
                fullWidth
                startIcon={<Icons.Add />}
                onClick={() => {
                  setEditingTasbeehId(null);
                  setTasbeehForm({ title: "", arabic: "", targetCount: 33 });
                  setAddTasbeehSheetOpen(true);
                }}
              >
                Add tasbeeh
              </AppButton>
            </>
          )}
        </AppStack>
      </AppBottomSheet>

      {/* ── Nested sheet: Add tasbeeh ─────────────────────────── */}
      <AppBottomSheet
        open={addTasbeehSheetOpen && managerMode?.kind === "edit"}
        onClose={() => resetTasbeehForm()}
        icon={<Icons.Add fontSize="medium" />}
        title={editingTasbeehId ? "Edit tasbeeh" : "Add tasbeeh"}
        description={
          editingTasbeehId
            ? "Update the tasbeeh item for this collection."
            : "Create a tasbeeh item for this collection."
        }
        containerSx={{ pt: 2, pb: "max(env(safe-area-inset-bottom), 12px)" }}
      >
        <AppStack
          spacing={2.5}
          sx={{
            p: 2,
            borderRadius: "8px",
            bgcolor: alpha(theme.palette.primary.main, 0.03),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          }}
        >
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            size="small"
            value={tasbeehForm.title}
            onChange={(e) =>
              setTasbeehForm((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="e.g. Astaghfirullah"
            autoFocus
          />
          <TextField
            fullWidth
            label="Arabic (Optional)"
            variant="outlined"
            size="small"
            value={tasbeehForm.arabic}
            onChange={(e) =>
              setTasbeehForm((p) => ({ ...p, arabic: e.target.value }))
            }
            placeholder="e.g. أَسْتَغْفِرُ اللّٰهَ"
            dir="rtl"
          />
          <AppNumberField
            label="Target count"
            value={tasbeehForm.targetCount}
            onChange={(v) => setTasbeehForm((p) => ({ ...p, targetCount: v }))}
            min={1}
            max={9999}
            size="small"
          />
          <AppButton
            variant="contained"
            fullWidth
            disabled={!tasbeehForm.title.trim()}
            onClick={handleSubmitTasbeehSheet}
          >
            {editingTasbeehId ? "Save changes" : "Add to collection"}
          </AppButton>
        </AppStack>
      </AppBottomSheet>

      {/* ── Delete Collection Dialog ──────────────────────────── */}
      <AppDialog
        open={pendingDeleteCollectionId !== null}
        title="Delete collection"
        onClose={() => setPendingDeleteCollectionId(null)}
        secondaryAction={{
          label: "Cancel",
          onClick: () => setPendingDeleteCollectionId(null),
        }}
        primaryAction={{
          label: "Delete",
          onClick: () => {
            if (pendingDeleteCollectionId)
              removeCollection(pendingDeleteCollectionId);
            setPendingDeleteCollectionId(null);
          },
        }}
      >
        <AppText variant="body2" color="text.secondary">
          This will permanently delete the collection and all its tasbeeh.
        </AppText>
      </AppDialog>

      {/* ── Delete Tasbeeh Dialog ─────────────────────────────── */}
      <AppDialog
        open={pendingDeleteTasbeeh !== null}
        title={t("tasbeeh.list.deleteConfirmTitle")}
        onClose={() => setPendingDeleteTasbeeh(null)}
        secondaryAction={{
          label: t("tasbeeh.list.cancel"),
          onClick: () => setPendingDeleteTasbeeh(null),
        }}
        primaryAction={{
          label: t("tasbeeh.list.confirmDelete"),
          onClick: () => {
            if (pendingDeleteTasbeeh) {
              removeTasbeehFromCollection(
                pendingDeleteTasbeeh.collectionId,
                pendingDeleteTasbeeh.tasbeehId,
              );
            }
            setPendingDeleteTasbeeh(null);
          },
        }}
      >
        <AppText variant="body2" color="text.secondary">
          {t("tasbeeh.list.deleteConfirmBody")}
        </AppText>
      </AppDialog>
    </ScreenContainer>
  );
}
