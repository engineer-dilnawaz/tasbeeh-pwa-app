import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { PropsWithChildren } from "react";

import { AppButton } from "./AppButton";

type AppDialogProps = PropsWithChildren<{
  open: boolean;
  title: string;
  onClose: () => void;
  primaryAction: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}>;

export function AppDialog({
  open,
  title,
  onClose,
  primaryAction,
  secondaryAction,
  children,
}: AppDialogProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      aria-labelledby="app-dialog-title"
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0,0,0,0.3)",
          }
        },
        paper: {
          sx: {
            borderRadius: "12px",
            boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.15)",
          }
        }
      }}
    >
      <DialogTitle id="app-dialog-title">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions sx={{ px: 2.5, pb: 2.5, gap: 1 }}>
        {secondaryAction ? (
          <AppButton onClick={secondaryAction.onClick} variant="text">
            {secondaryAction.label}
          </AppButton>
        ) : null}
        <AppButton onClick={primaryAction.onClick} variant="contained">
          {primaryAction.label}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

