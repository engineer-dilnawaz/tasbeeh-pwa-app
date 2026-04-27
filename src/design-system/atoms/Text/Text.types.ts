import React from "react";

export type TextVariant =
  | "body"
  | "caption"
  | "heading"
  | "subheading";

export type TextWeight = "regular" | "medium" | "bold";

export interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  weight?: TextWeight;
  color?: "primary" | "secondary" | "inverse";
  as?: React.ElementType;
  style?: React.CSSProperties;
}
