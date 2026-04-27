import React from "react";

export interface CardProps {
  children: React.ReactNode;
  padding?: "sm" | "md" | "lg";
  onClick?: () => void;
  style?: React.CSSProperties;
}
