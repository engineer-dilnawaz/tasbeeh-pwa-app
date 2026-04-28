import { FormControl, IconButton, InputLabel, OutlinedInput, alpha, useTheme } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { Add, Remove } from "@mui/icons-material";

interface AppNumberFieldProps {
  /** Displayed label above the input */
  label: string;
  /** Controlled numeric value */
  value: number;
  /** Called with the next numeric value on any change */
  onChange: (value: number) => void;
  /** Minimum allowed value (default: 0) */
  min?: number;
  /** Maximum allowed value (default: 9999) */
  max?: number;
  /** Amount to step up/down per button click (default: 1) */
  step?: number;
  /** Optional helper text shown below the input */
  helperText?: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Whether the field is required */
  required?: boolean;
  /** MUI FormControl size override */
  size?: FormControlProps["size"];
  /** MUI FormControl fullWidth override (default: true) */
  fullWidth?: boolean;
}

export function AppNumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  disabled = false,
  required = false,
  size = "medium",
  fullWidth = true,
}: AppNumberFieldProps) {
  const theme = useTheme();

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const decrement = () => onChange(clamp(value - step));
  const increment = () => onChange(clamp(value + step));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange(min);
      return;
    }
    const parsed = parseInt(raw, 10);
    if (!isNaN(parsed)) onChange(clamp(parsed));
  };

  const atMin = value <= min;
  const atMax = value >= max;

  const stepperButtonSx = {
    borderRadius: "8px",
    width: 32,
    height: 32,
    transition: "background-color 0.15s ease",
    "&:hover": {
      bgcolor: alpha(theme.palette.primary.main, 0.1),
      color: "primary.main",
    },
    "&.Mui-disabled": {
      opacity: 0.35,
    },
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} disabled={disabled} required={required}>
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        label={label}
        value={value}
        onChange={handleChange}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
          "aria-label": label,
          style: {
            textAlign: "center",
            fontWeight: 700,
            fontSize: size === "small" ? "0.95rem" : "1.1rem",
            paddingLeft: 0,
            paddingRight: 0,
          },
        }}
        startAdornment={
          <IconButton
            onClick={decrement}
            disabled={disabled || atMin}
            size="small"
            edge="start"
            aria-label={`Decrease ${label}`}
            sx={{ ...stepperButtonSx, mr: 0.5 }}
          >
            <Remove fontSize="small" />
          </IconButton>
        }
        endAdornment={
          <IconButton
            onClick={increment}
            disabled={disabled || atMax}
            size="small"
            edge="end"
            aria-label={`Increase ${label}`}
            sx={{ ...stepperButtonSx, ml: 0.5 }}
          >
            <Add fontSize="small" />
          </IconButton>
        }
      />
    </FormControl>
  );
}
