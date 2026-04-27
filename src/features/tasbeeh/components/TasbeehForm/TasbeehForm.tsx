import { useState } from "react";
import { Button } from "@/design-system/atoms/Button";
import { Text } from "@/design-system/atoms/Text";
import { Card } from "@/design-system/molecules/Card";
import type { TasbeehFormProps } from "./TasbeehForm.types";

/**
 * TasbeehForm
 * 
 * A simple form for creating or editing a tasbeeh item.
 * NOTE: Uses raw <input> as a temporary measure until the Input atom is built.
 */
export const TasbeehForm = ({
  initialValues,
  onSubmit,
  onCancel,
}: TasbeehFormProps) => {
  const [title, setTitle] = useState(initialValues?.title || "");
  const [target, setTarget] = useState(initialValues?.target || 33);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ title, target });
  };

  return (
    <Card padding="md">
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Text variant="subheading" weight="bold">
          {initialValues ? "Edit Tasbeeh" : "New Tasbeeh"}
        </Text>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text variant="caption" color="secondary">Title</Text>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. SubhanAllah"
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Text variant="caption" color="secondary">Target Count</Text>
          <input
            type="number"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "16px",
              outline: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Button onClick={handleSubmit} style={{ flex: 1 }}>
            Save
          </Button>
          {onCancel && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
