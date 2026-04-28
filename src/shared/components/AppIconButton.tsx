import IconButton from "@mui/material/IconButton";
import type { IconButtonProps } from "@mui/material/IconButton";
import type { PropsWithChildren } from "react";

export type AppIconButtonProps = PropsWithChildren<IconButtonProps>;

export function AppIconButton(props: AppIconButtonProps) {
  return <IconButton {...props} />;
}

