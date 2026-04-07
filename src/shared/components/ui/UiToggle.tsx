import clsx from "clsx";
import { useCallback, useId, useState } from "react";
import { DaisyToggle } from "@/shared/components/daisy";
import type { UiPalette } from "./palette";

export type UiToggleProps = {
  label: string;
  /** @deprecated Ignored; use app theme. */
  palette?: UiPalette;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export function UiToggle({
  label,
  palette: _palette,
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  className,
}: UiToggleProps) {
  void _palette;
  const id = useId();
  const [inner, setInner] = useState(defaultChecked);
  const on = controlled !== undefined ? controlled : inner;

  const toggle = useCallback(
    (next: boolean) => {
      if (controlled === undefined) setInner(next);
      onCheckedChange?.(next);
    },
    [controlled, onCheckedChange],
  );

  return (
    <label
      className={clsx(
        "label flex cursor-pointer items-center justify-between gap-4 py-0",
        className,
      )}
    >
      <span className="text-base font-semibold text-base-content">{label}</span>
      <DaisyToggle
        id={id}
        checked={on}
        disabled={disabled}
        aria-checked={on}
        onChange={(next) => toggle(next)}
      />
    </label>
  );
}
