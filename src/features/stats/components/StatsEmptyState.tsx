import { useNavigate } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/shared/design-system/ui/EmptyState";

export function StatsEmptyState() {
  const navigate = useNavigate();

  return (
    <EmptyState
      icon={<BarChart3 />}
      title="No Activity Yet"
      description="Start your tasbeeh journey and your progress will appear here. Every tap counts!"
      actionLabel="Start Now"
      onAction={() => navigate("/home")}
    />
  );
}
