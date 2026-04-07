import clsx from "clsx";
import { DaisyDivider, DaisyRange } from "@/shared/components/daisy";
import { SmoothSquircle } from "@/shared/components/ui/SmoothSquircle";
import { Link } from "react-router-dom";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

function stripBackgroundShorthand(
  s: CSSProperties | undefined,
): CSSProperties {
  if (!s) return {};
  const { background: _b, ...rest } = s as CSSProperties & {
    background?: string;
  };
  void _b;
  return rest;
}

/** Page shell — semantic [colors](https://daisyui.com/docs/colors/) */
export function SettingsPageCanvas({
  children,
  className,
  style,
  ...rest
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "w-[calc(100%+1.5rem)] -mx-3 -mt-4 flex min-h-full flex-1 flex-col",
        "bg-base-200/70 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))]",
        className,
      )}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export function SettingsElevatedSurface({
  children,
  cornerRadius,
  style,
  padding,
  displayFlex,
  ...rest
}: {
  children: ReactNode;
  cornerRadius: number;
  style?: CSSProperties;
  padding?: number | string;
  displayFlex?: boolean;
} & Omit<ComponentPropsWithoutRef<typeof SmoothSquircle>, "children">) {
  const { backgroundColor: cardBgColor, ...cardStyleRest } =
    stripBackgroundShorthand(style);

  return (
    <SmoothSquircle
      cornerRadius={cornerRadius}
      cornerSmoothing={1}
      style={{
        ...cardStyleRest,
        backgroundColor: cardBgColor ?? "var(--color-base-100)",
        boxShadow:
          "0 20px 48px -18px color-mix(in oklab, var(--color-base-content) 14%, transparent)",
        border: "none",
        overflow: "hidden",
        padding: padding ?? undefined,
        display: displayFlex ? "flex" : undefined,
        alignItems: displayFlex ? "center" : undefined,
        gap: displayFlex ? 20 : undefined,
      }}
      {...rest}
    >
      {children}
    </SmoothSquircle>
  );
}

export function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-5">
      <p className="mb-2 ml-1 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-base-content/55">
        {title}
      </p>
      <SettingsElevatedSurface cornerRadius={32}>{children}</SettingsElevatedSurface>
    </div>
  );
}

export function SettingsIconTile({
  background: tileBg,
  color: fg,
  children,
}: {
  background: string;
  color: string;
  children: ReactNode;
}) {
  return (
    <div
      className="flex size-[42px] shrink-0 items-center justify-center rounded-2xl transition-transform active:scale-95"
      style={{ backgroundColor: tileBg, color: fg }}
    >
      {children}
    </div>
  );
}

type SettingsRowBase = {
  icon: ReactNode;
  title: ReactNode;
  hint?: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

const rowClass =
  "flex w-full items-center gap-4 border-0 bg-transparent px-[22px] py-[18px] text-left font-inherit text-base-content transition-colors active:bg-base-200/80";

export function SettingsRowStatic({
  icon,
  title,
  hint,
  trailing,
  className,
}: SettingsRowBase) {
  return (
    <div className={clsx(rowClass, "cursor-default", className)}>
      {icon}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[1.02rem] font-bold leading-snug tracking-tight">
          {title}
        </span>
        {hint != null ? (
          <span className="mt-1 text-[0.8125rem] font-medium text-base-content/65">
            {hint}
          </span>
        ) : null}
      </div>
      {trailing != null ? (
        <div className="ml-auto flex shrink-0 items-center">{trailing}</div>
      ) : null}
    </div>
  );
}

export function SettingsRowButton({
  icon,
  title,
  hint,
  trailing,
  onClick,
  className,
}: SettingsRowBase & { onClick: () => void }) {
  return (
    <button
      type="button"
      className={clsx(rowClass, "cursor-pointer", className)}
      onClick={onClick}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[1.02rem] font-bold leading-snug tracking-tight">
          {title}
        </span>
        {hint != null ? (
          <span className="mt-1 text-[0.8125rem] font-medium text-base-content/65">
            {hint}
          </span>
        ) : null}
      </div>
      {trailing != null ? (
        <div className="ml-auto flex shrink-0 items-center">{trailing}</div>
      ) : null}
    </button>
  );
}

export function SettingsRowLink({
  icon,
  title,
  hint,
  trailing,
  to,
  className,
}: SettingsRowBase & { to: string }) {
  return (
    <Link
      to={to}
      className={clsx(rowClass, "cursor-pointer no-underline", className)}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[1.02rem] font-bold leading-snug tracking-tight">
          {title}
        </span>
        {hint != null ? (
          <span className="mt-1 text-[0.8125rem] font-medium text-base-content/65">
            {hint}
          </span>
        ) : null}
      </div>
      {trailing != null ? (
        <div className="ml-auto flex shrink-0 items-center">{trailing}</div>
      ) : null}
    </Link>
  );
}

export function SettingsRowDivider() {
  return (
    <div className="ml-[78px] mr-2">
      <DaisyDivider className="my-1 before:h-px after:h-px" aria-hidden />
    </div>
  );
}

export function SettingsEmbed({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "bottom";
}) {
  return (
    <div
      className={clsx(
        "px-[22px]",
        variant === "bottom" ? "pb-[22px] pt-2" : "pb-[18px] pt-2",
      )}
    >
      {children}
    </div>
  );
}

export function SettingsHapticSlider({
  strengthLabel,
  value,
  onChange,
}: {
  strengthLabel: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="px-[22px] pb-[22px] pt-0.5">
      <div className="flex justify-end">
        <span className="rounded-full bg-primary/15 px-3 py-1.5 text-[0.625rem] font-extrabold uppercase tracking-wider text-primary">
          {strengthLabel}
        </span>
      </div>
      <DaisyRange
        className="mt-3"
        min={0}
        max={3}
        step={1}
        variant="primary"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  );
}

