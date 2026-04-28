import Stack from "@mui/material/Stack";
import type { StackProps } from "@mui/material/Stack";

export type AppStackProps = StackProps;

export function AppStack(props: AppStackProps) {
  return <Stack {...props} />;
}

