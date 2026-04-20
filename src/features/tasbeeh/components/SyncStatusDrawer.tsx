import React from "react";
import { Cloud, CloudOff, CloudCheck, RefreshCw, X } from "lucide-react";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { useSyncStatus } from "@/shared/hooks/useSyncStatus";
import { Text } from "@/shared/design-system/ui/Text";
import { Squircle } from "corner-smoothing";

interface SyncStatusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  zIndexBase?: number;
}

/**
 * 🛰️ SyncStatusDrawer
 *
 * Provides detailed information about the application's cloud synchronization
 * state in a premium, glassmorphic bottom drawer.
 */
export const SyncStatusDrawer: React.FC<SyncStatusDrawerProps> = ({
  isOpen,
  onClose,
  zIndexBase,
}) => {
  const { status, label, description, pendingCount } = useSyncStatus();

  const getIcon = () => {
    switch (status) {
      case "offline":
        return <CloudOff className="text-warning h-12 w-12" />;
      case "syncing":
        return <RefreshCw className="text-info animate-spin h-12 w-12" />;
      case "synced":
        return <CloudCheck className="text-success h-12 w-12" />;
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      presentation="height"
      snapPoints={["50%"]}
      zIndexBase={zIndexBase}
    >
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        {/* State Icon with Squircle background */}
        <Squircle
          cornerRadius={20}
          cornerSmoothing={0.8}
          className="flex h-24 w-24 items-center justify-center bg-base-200/50"
        >
          {getIcon()}
        </Squircle>

        <div className="flex flex-col items-center text-center gap-2 px-6">
          <Text variant="heading" weight="bold" className="capitalize">
            {label}
          </Text>
          <Text variant="body" className="text-base-content/60 leading-relaxed">
            {description}
          </Text>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-auto flex h-14 w-full  items-center justify-center rounded-2xl bg-primary text-primary-content font-semibold transition-transform active:scale-95 shadow-lg shadow-primary/20"
        >
          Understood
        </button>
      </div>
    </Drawer>
  );
};
