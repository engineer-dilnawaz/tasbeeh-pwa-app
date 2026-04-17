import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";

import { Drawer, type SnapPoint } from "@/shared/design-system/ui/Drawer";
import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

interface SettingsActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  snapPoints?: SnapPoint[];
  scrollable?: boolean;
  icon: LucideIcon;
  title: string;
  description: string;
  primaryButtonTitle: string;
  onPrimaryPress: () => void;
  primaryCooldownSeconds?: number;
  secondaryButtonTitle?: string;
  onSecondaryPress?: () => void;
  iconWrapperClassName?: string;
  primaryButtonClassName?: string;
  secondaryButtonClassName?: string;
  containerClassName?: string;
}

export function SettingsActionSheet({
  isOpen,
  onClose,
  snapPoints = ["40%"],
  scrollable = false,
  icon: Icon,
  title,
  description,
  primaryButtonTitle,
  onPrimaryPress,
  primaryCooldownSeconds = 0,
  secondaryButtonTitle = "Cancel",
  onSecondaryPress,
  iconWrapperClassName = "border border-primary/45 bg-primary/12 text-primary",
  primaryButtonClassName = "bg-neutral text-white",
  secondaryButtonClassName = "border border-base-content/20",
  containerClassName = "",
}: SettingsActionSheetProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!isOpen || primaryCooldownSeconds <= 0) {
      const resetTimeout = window.setTimeout(() => {
        setSecondsLeft(0);
      }, 0);
      return () => window.clearTimeout(resetTimeout);
    }

    const initTimeout = window.setTimeout(() => {
      setSecondsLeft(primaryCooldownSeconds);
    }, 0);
    const interval = window.setInterval(() => {
      setSecondsLeft((value) => (value > 0 ? value - 1 : 0));
    }, 1000);

    return () => {
      window.clearTimeout(initTimeout);
      window.clearInterval(interval);
    };
  }, [isOpen, primaryCooldownSeconds]);

  const isPrimaryDisabled = secondsLeft > 0;
  const primaryLabel =
    secondsLeft > 0 ? `${primaryButtonTitle} (${secondsLeft})` : primaryButtonTitle;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={snapPoints}
      scrollable={scrollable}
      zIndexBase={130}
    >
      <div className={`mb-4 px-2 pb-4 ${containerClassName}`}>
        <div
          className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${iconWrapperClassName}`}
        >
          <Icon size={22} />
        </div>
        <Text variant="heading" weight="semibold" className="text-center">
          {title}
        </Text>
        <Text variant="body" color="subtle" className="mt-2 text-center">
          {description}
        </Text>
        <div className="mt-6 flex flex-col gap-3">
          <Squircle cornerRadius={40} cornerSmoothing={100} asChild>
            <button
              type="button"
              onClick={onPrimaryPress}
              disabled={isPrimaryDisabled}
              className={`w-full px-4 py-3.5 text-sm font-semibold ${primaryButtonClassName} ${
                isPrimaryDisabled ? "cursor-not-allowed opacity-70" : ""
              }`}
            >
              {primaryLabel}
            </button>
          </Squircle>
          <Squircle cornerRadius={40} cornerSmoothing={100} asChild>
            <button
              type="button"
              onClick={onSecondaryPress ?? onClose}
              className={`w-full px-4 py-3.5 text-sm font-medium ${secondaryButtonClassName}`}
            >
              {secondaryButtonTitle}
            </button>
          </Squircle>
        </div>
      </div>
    </Drawer>
  );
}
