import type { HTMLAttributes, ReactNode } from "react";

type SquircleCardProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export function SquircleCard({ children, className = "", ...rest }: SquircleCardProps) {
  return (
    <div className={`squircle-card ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}
