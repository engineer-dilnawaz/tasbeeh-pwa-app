import * as React from "react";

interface UseLongPressTooltipOptions {
  /** Hold duration before tooltip opens (ms). Default: 420 */
  holdDelayMs?: number;
  /** How long tooltip stays visible after opening (ms). Default: 2000 */
  visibleMs?: number;
}

export function useLongPressTooltip(options: UseLongPressTooltipOptions = {}) {
  const { holdDelayMs = 420, visibleMs = 2000 } = options;

  const [isOpen, setIsOpen] = React.useState(false);
  const [didLongPress, setDidLongPress] = React.useState(false);
  const holdTimerRef = React.useRef<number | null>(null);
  const autoHideTimerRef = React.useRef<number | null>(null);

  const clearTimers = React.useCallback(() => {
    if (holdTimerRef.current) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (autoHideTimerRef.current) {
      window.clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
  }, []);

  const start = React.useCallback(() => {
    setDidLongPress(false);
    clearTimers();
    holdTimerRef.current = window.setTimeout(() => {
      setDidLongPress(true);
      setIsOpen(true);
      autoHideTimerRef.current = window.setTimeout(() => {
        setIsOpen(false);
      }, visibleMs);
    }, holdDelayMs);
  }, [clearTimers, holdDelayMs, visibleMs]);

  const end = React.useCallback(() => {
    // If it already long-pressed, let auto-hide handle closing.
    if (didLongPress) {
      if (holdTimerRef.current) {
        window.clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      return;
    }
    clearTimers();
    setIsOpen(false);
  }, [clearTimers, didLongPress]);

  const cancel = React.useCallback(() => {
    clearTimers();
    setIsOpen(false);
  }, [clearTimers]);

  React.useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const bind = {
    onPointerDown: start,
    onPointerUp: end,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
    onTouchStart: start,
    onTouchEnd: end,
    onTouchCancel: cancel,
    onContextMenu: (e: React.SyntheticEvent) => {
      // Prevent native long-press context menu.
      // (iOS Safari / Chrome Android)
      e.preventDefault();
    },
  } as const;

  return {
    isOpen,
    didLongPress,
    bind,
    close: cancel,
  };
}

