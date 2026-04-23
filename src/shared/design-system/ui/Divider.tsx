import React from "react";

interface DividerProps {
  children?: React.ReactNode;
  className?: string;
}

/**
 * Standard DaisyUI Divider.
 */
export const Divider: React.FC<DividerProps> = ({ children, className = "" }) => {
  return (
    <div className={`divider ${className}`}>
      {children}
    </div>
  );
};
