import Box from "@mui/material/Box";
import { motion, useReducedMotion } from "framer-motion";
import type { PropsWithChildren } from "react";

type TapFeedbackProps = PropsWithChildren<{
  onTap?: () => void;
  ariaLabel?: string;
}>;

export function TapFeedback({ children, onTap, ariaLabel }: TapFeedbackProps) {
  const reduced = useReducedMotion();

  return (
    <Box
      component={motion.div}
      role="button"
      aria-label={ariaLabel}
      tabIndex={0}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
      onClick={() => {
        onTap?.();
        if (navigator.vibrate) navigator.vibrate(10);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onTap?.();
          if (navigator.vibrate) navigator.vibrate(10);
        }
      }}
      sx={{
        width: "100%",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {children}
    </Box>
  );
}

