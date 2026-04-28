import Typography from "@mui/material/Typography";
import type { TypographyProps } from "@mui/material/Typography";

export type AppTextProps = TypographyProps;

export function AppText(props: AppTextProps) {
  return <Typography {...props} />;
}

