import clsx from "clsx";
import {
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type { UiPalette } from "./palette";

export type UiTextFieldProps = {
  placeholder?: string;
  label?: string;
  icon?: ReactNode;
  error?: string;
  disabled?: boolean;
  /** @deprecated Theme via daisyUI; ignored. */
  palette?: UiPalette;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  id?: string;
  style?: CSSProperties;
  className?: string;
};

/** Composite daisyUI [input](https://daisyui.com/components/input/). */
export function UiTextField({
  placeholder = "Type here...",
  label,
  icon,
  error,
  disabled,
  palette: _palette,
  value: controlledValue,
  defaultValue = "",
  onChange,
  id: idProp,
  style,
  className,
}: UiTextFieldProps) {
  void _palette;
  const autoId = useId();
  const id =
    idProp ??
    (label ? `ui-field-${label.replace(/\s+/g, "-").toLowerCase()}` : autoId);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;
  const setValue = (v: string) => {
    if (controlledValue === undefined) setUncontrolled(v);
    onChange?.(v);
  };

  return (
    <div
      className={clsx("flex w-full flex-col gap-1.5", className)}
      style={style}
    >
      {label ? (
        <label htmlFor={id} className="text-sm font-bold text-base-content/80">
          {label}
        </label>
      ) : null}
      <label
        className={clsx(
          "input flex w-full min-w-0 items-center gap-2",
          error && "input-error",
        )}
      >
        {icon != null && icon !== "" ? (
          <span className="shrink-0 opacity-50 [&>svg]:size-[1em]">{icon}</span>
        ) : null}
        <input
          id={id}
          className="grow min-w-0 bg-transparent outline-none placeholder:text-base-content/45"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
        />
        {value && !disabled ? (
          <button
            type="button"
            aria-label="Clear"
            className="btn btn-ghost btn-circle btn-xs shrink-0"
            onClick={() => setValue("")}
          >
            ✕
          </button>
        ) : null}
      </label>
      {error ? (
        <span className="text-error text-sm font-semibold">{error}</span>
      ) : null}
    </div>
  );
}
