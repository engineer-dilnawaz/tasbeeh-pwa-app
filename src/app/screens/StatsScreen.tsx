import { Box, Chip, Divider, MenuItem, Select, alpha } from "@mui/material";
import { useMemo, useState } from "react";

import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useTasbeehStore } from "@/features/tasbeeh/store";
import {
  AppCard,
  AppStack,
  AppText,
  Icons,
  ScreenContainer,
} from "@/shared/components";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toDateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}`;
}

function monthLabel(d: Date) {
  return d.toLocaleString(undefined, { month: "long", year: "numeric" });
}

export function StatsScreen() {
  // Select stable slices from the store.
  const collections = useTasbeehStore((s) => s.collections);
  const items = useTasbeehStore((s) => s.items);
  const counts = useTasbeehStore((s) => s.counts);
  const dailyTapCounts = useTasbeehStore((s) => s.dailyTapCounts);

  // Month dropdown (top-right): default current month.
  const [selectedMonth, setSelectedMonth] = useState(() =>
    monthKey(new Date()),
  );
  // Week selection (under title): 0..(weeks-1) for the selected month.
  const [weekIndex, setWeekIndex] = useState(0);

  const rows = useMemo(() => {
    const itemById = new Map(items.map((i) => [i.id, i]));

    return (
      collections
        // active collections only: non-empty + has at least one resolvable item
        .filter((c) => c.tasbeehIds.some((tid) => itemById.has(tid)))
        .map((c) => {
          const resolvableIds = c.tasbeehIds.filter((tid) => itemById.has(tid));
          const total = resolvableIds.length;
          const completed = resolvableIds.filter((tid) => {
            const item = itemById.get(tid)!;
            return (counts[tid] ?? 0) >= item.targetCount;
          }).length;

          return {
            id: c.id,
            title: c.title,
            completed,
            total,
            isComplete: total > 0 && completed === total,
          };
        })
    );
  }, [collections, items, counts]);

  const monthOptions = useMemo(() => {
    const now = new Date();
    const opts: { key: string; label: string }[] = [];
    for (let i = 0; i < 12; i += 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      opts.push({ key: monthKey(d), label: monthLabel(d) });
    }
    return opts;
  }, []);

  const weekOptions = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split("-");
    const y = Number(yStr);
    const m = Number(mStr) - 1;
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const starts: Date[] = [];
    for (let day = 1; day <= daysInMonth; day += 7) {
      starts.push(new Date(y, m, day));
    }
    return starts.map((d, idx) => {
      const end = new Date(d);
      end.setDate(d.getDate() + 6);
      const label = `Week ${idx + 1} (${d.getDate()}-${Math.min(
        daysInMonth,
        end.getDate(),
      )})`;
      return { idx, start: d, label };
    });
  }, [selectedMonth]);

  const selectedWeekStart =
    weekOptions[Math.min(weekIndex, weekOptions.length - 1)]?.start;

  const dailySeries = useMemo(() => {
    if (!selectedWeekStart)
      return { labels: [] as string[], values: [] as number[] };
    const labels: string[] = [];
    const values: number[] = [];
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(selectedWeekStart);
      d.setDate(selectedWeekStart.getDate() + i);
      const key = toDateKey(d);
      labels.push(d.toLocaleDateString(undefined, { weekday: "short" }));
      values.push(dailyTapCounts[key] ?? 0);
    }
    return { labels, values };
  }, [dailyTapCounts, selectedWeekStart]);

  const pieData = useMemo(() => {
    // Distribution by collection based on COMPLETED tasbeeh targets (overall).
    const data = rows
      .map((r) => ({ id: r.id, value: r.completed, label: r.title }))
      .filter((x) => x.value > 0);
    return data;
  }, [rows]);

  const summary = useMemo(() => {
    const totalCollections = rows.length;
    const completedCollections = rows.filter((r) => r.isComplete).length;
    const totalTasbeeh = rows.reduce((acc, r) => acc + r.total, 0);
    const completedTasbeeh = rows.reduce((acc, r) => acc + r.completed, 0);
    return {
      totalCollections,
      completedCollections,
      totalTasbeeh,
      completedTasbeeh,
    };
  }, [rows]);

  return (
    <ScreenContainer>
      <AppStack spacing={2} sx={{ pb: 10 }}>
        <AppCard>
          <AppStack spacing={1.25}>
            <AppStack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Box
                sx={(theme) => ({
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: alpha(
                    theme.palette.primary.main,
                    theme.palette.mode === "dark" ? 0.16 : 0.1,
                  ),
                })}
              >
                <Icons.Stats sx={{ color: "primary.main" }} />
              </Box>
              <AppStack spacing={0} sx={{ flex: 1 }}>
                <AppText variant="subtitle1" sx={{ fontWeight: 900 }}>
                  Collections completed
                </AppText>
                <AppText variant="body2" color="text.secondary">
                  {summary.completedCollections} / {summary.totalCollections}
                </AppText>
              </AppStack>
              <Chip
                label={`${summary.completedCollections}/${summary.totalCollections}`}
                color={
                  summary.completedCollections === summary.totalCollections
                    ? "success"
                    : "primary"
                }
                variant="outlined"
                size="small"
                sx={{ fontWeight: 900 }}
              />
            </AppStack>

            <Divider />

            <AppStack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <AppStack spacing={0} sx={{ flex: 1 }}>
                <AppText variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Tasbeeh targets completed
                </AppText>
                <AppText variant="body2" color="text.secondary">
                  {summary.completedTasbeeh} / {summary.totalTasbeeh}
                </AppText>
              </AppStack>
              <Chip
                label={`${summary.completedTasbeeh}/${summary.totalTasbeeh}`}
                variant="outlined"
                size="small"
                sx={{ fontWeight: 900 }}
              />
            </AppStack>
          </AppStack>
        </AppCard>

        <AppCard>
          <AppStack spacing={1.25}>
            <AppText variant="subtitle1" sx={{ fontWeight: 900 }}>
              Daily progress (7 days)
            </AppText>

            <AppStack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              {/* Left dropdown: week */}
              <Select
                size="small"
                fullWidth
                value={Math.min(weekIndex, Math.max(0, weekOptions.length - 1))}
                onChange={(e) => setWeekIndex(Number(e.target.value))}
                sx={{
                  flex: 1,
                  "& .MuiSelect-select": {
                    py: 0.75,
                    pr: 4,
                    fontSize: "0.85rem",
                    whiteSpace: "normal",
                  },
                }}
              >
                {weekOptions.map((w) => (
                  <MenuItem key={w.idx} value={w.idx}>
                    {w.label}
                  </MenuItem>
                ))}
              </Select>

              {/* Right dropdown: month */}
              <Select
                size="small"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setWeekIndex(0);
                }}
                sx={{
                  minWidth: 156,
                  "& .MuiSelect-select": {
                    py: 0.75,
                    pr: 4,
                    fontSize: "0.85rem",
                    whiteSpace: "normal",
                  },
                }}
              >
                {monthOptions.map((m) => (
                  <MenuItem key={m.key} value={m.key}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </AppStack>
            <Box
              sx={{
                width: "100%",
              }}
            >
              <LineChart
                height={220}
                xAxis={[{ scaleType: "point", data: dailySeries.labels }]}
                yAxis={[
                  {
                    valueFormatter: (v: number) => String(Math.round(v)),
                  },
                ]}
                series={[{ data: dailySeries.values, label: "Taps" }]}
                margin={{ left: 0, right: 16, top: 16, bottom: 40 }}
              />
            </Box>
          </AppStack>
        </AppCard>

        <AppCard>
          <AppStack spacing={1.25}>
            <AppText variant="subtitle1" sx={{ fontWeight: 900 }}>
              Distribution (completed targets)
            </AppText>
            {pieData.length === 0 ? (
              <AppText variant="body2" color="text.secondary">
                No completed targets yet.
              </AppText>
            ) : (
              <Box sx={{ width: "100%" }}>
                <PieChart
                  height={240}
                  series={[{ data: pieData }]}
                  margin={{ left: 16, right: 16, top: 16, bottom: 16 }}
                />
              </Box>
            )}
          </AppStack>
        </AppCard>

        <AppCard>
          <AppStack spacing={0} sx={{ overflow: "hidden" }}>
            {rows.length === 0 ? (
              <AppText variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No active collections yet.
              </AppText>
            ) : (
              rows.map((r, idx) => {
                const isLast = idx === rows.length - 1;
                return (
                  <Box key={r.id}>
                    <Box
                      sx={{
                        px: 2,
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={(theme) => ({
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: alpha(
                            r.isComplete
                              ? theme.palette.success.main
                              : theme.palette.primary.main,
                            theme.palette.mode === "dark" ? 0.14 : 0.1,
                          ),
                          flexShrink: 0,
                        })}
                      >
                        {r.isComplete ? (
                          <Icons.Check
                            sx={{ color: "success.main", fontSize: 20 }}
                          />
                        ) : (
                          <Icons.Collection
                            sx={{ color: "primary.main", fontSize: 20 }}
                          />
                        )}
                      </Box>

                      <AppStack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                        <AppText
                          variant="body2"
                          sx={{ fontWeight: 900 }}
                          noWrap
                        >
                          {r.title}
                        </AppText>
                        <AppText
                          variant="caption"
                          color="text.secondary"
                          noWrap
                        >
                          {r.completed} / {r.total} completed
                        </AppText>
                      </AppStack>

                      <Chip
                        label={r.isComplete ? "Done" : "In progress"}
                        color={r.isComplete ? "success" : "default"}
                        size="small"
                        variant={r.isComplete ? "filled" : "outlined"}
                        sx={{ fontWeight: 900 }}
                      />
                    </Box>
                    {!isLast ? <Divider /> : null}
                  </Box>
                );
              })
            )}
          </AppStack>
        </AppCard>
      </AppStack>
    </ScreenContainer>
  );
}
