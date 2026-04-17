import { Button } from "@/shared/design-system/ui/Button";

interface HomeActionRowProps {
  isCompleted: boolean;
  onChangeTasbeeh: () => void;
  onReset: () => void;
  onPrimaryAction: () => void;
}

export function HomeActionRow({
  isCompleted,
  onChangeTasbeeh,
  onReset,
  onPrimaryAction,
}: HomeActionRowProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button variant="outline" size="sm" className="w-full" onClick={onChangeTasbeeh}>
        Change
      </Button>
      <Button variant="ghost" size="sm" className="w-full" onClick={onReset}>
        Reset
      </Button>
      <Button variant="primary" size="sm" className="w-full" onClick={onPrimaryAction}>
        {isCompleted ? "Complete" : "Continue"}
      </Button>
    </div>
  );
}

