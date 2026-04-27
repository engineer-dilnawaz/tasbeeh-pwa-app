import { Card } from "@/design-system/molecules/Card";
import { Text } from "@/design-system/atoms/Text";
import { Button } from "@/design-system/atoms/Button";
import type { TasbeehItemProps } from "./TasbeehItem.types";

/**
 * TasbeehItem
 * 
 * A feature-level component that composes design-system atoms & molecules
 * with business logic for counting and progress tracking.
 * Includes actions for Reset and Delete.
 */
export const TasbeehItem = ({
  title,
  target = 33,
  count,
  onIncrement,
  onReset,
  onDelete,
}: TasbeehItemProps) => {
  const progress = Math.min((count / target) * 100, 100);

  return (
    <Card padding="md">
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        
        {/* Header with Title and Delete */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Text variant="subheading" weight="bold">{title}</Text>
          {onDelete && (
            <Button 
              variant="secondary" 
              onClick={onDelete} 
              size="sm"
              style={{ padding: "4px 8px", minWidth: "auto", background: "transparent", color: "#9ca3af" }}
            >
              ✕
            </Button>
          )}
        </div>

        {/* Progress Text */}
        <Text variant="caption" color="secondary">
          {count} / {target}
        </Text>

        {/* Progress bar */}
        <div
          style={{
            height: 8,
            background: "#e5e7eb",
            width: "100%",
            marginTop: 6,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#2e7d32",
              transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <Button onClick={onIncrement} style={{ flex: 1 }}>
            Count
          </Button>

          {onReset && (
            <Button variant="secondary" onClick={onReset}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
