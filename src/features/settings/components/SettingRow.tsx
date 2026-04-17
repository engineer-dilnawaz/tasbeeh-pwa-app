import { ChevronRight } from "lucide-react";

import { ListItem } from "@/shared/design-system/ui/List";
import { Text } from "@/shared/design-system/ui/Text";

interface SettingRowProps {
  title: string;
  description?: string;
  onClick?: () => void;
  trailingText?: string;
  danger?: boolean;
  withDivider?: boolean;
}

export function SettingRow({
  title,
  description,
  onClick,
  trailingText,
  danger = false,
  withDivider = true,
}: SettingRowProps) {
  return (
    <ListItem
      onClick={onClick}
      className={withDivider ? "border-b border-base-content/8 last:border-b-0" : ""}
      title={
        <Text variant="body" color={danger ? "error" : "base"} weight="medium">
          {title}
        </Text>
      }
      description={description ? <Text variant="body" color="subtle">{description}</Text> : undefined}
      trailing={
        trailingText ? (
          <Text variant="caption" color="subtle" className="text-[10px]! tracking-[0.12em]!">
            {trailingText}
          </Text>
        ) : (
          <ChevronRight size={16} className={danger ? "text-error/60" : "text-base-content/30"} />
        )
      }
    />
  );
}

