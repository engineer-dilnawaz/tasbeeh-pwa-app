import { DaisyToggle } from "@/shared/components/daisy";

interface SwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

/** Settings row switch — daisyUI toggle + row click isolation. */
export function Switch({ isOn, onToggle, disabled }: SwitchProps) {
  return (
    <DaisyToggle
      checked={isOn}
      disabled={disabled}
      aria-checked={isOn}
      onClick={(e) => e.stopPropagation()}
      onChange={() => {
        if (!disabled) onToggle();
      }}
    />
  );
}
