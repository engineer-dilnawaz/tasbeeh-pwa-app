import React from "react";
import { Button } from "@/shared/design-system";

import googleIcon from "@/assets/images/google.png";
import facebookIcon from "@/assets/images/facebook.png";

interface SocialAuthButtonProps {
  network: "google" | "facebook" | "apple";
  onClick: () => void;
  isLoading?: boolean;
}

const icons = {
  google: googleIcon,
  facebook: facebookIcon,
  apple: "", // Add if needed
};

/**
 * Premium Social Authentication Button.
 * Uses local high-quality assets for brand iconography.
 */
export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  network,
  onClick,
  isLoading,
}) => {
  const label = network.charAt(0).toUpperCase() + network.slice(1);
  const iconSrc = icons[network as keyof typeof icons];

  return (
    <Button
      variant="google"
      height={52}
      isLoading={isLoading}
      onClick={onClick}
      pill={true}
      className="flex-1 border-base-content/10"
      leftIcon={
        iconSrc ? (
          <img
            src={iconSrc}
            className="w-5 h-5 object-contain"
            alt={label}
          />
        ) : null
      }
    >
      {label}
    </Button>
  );
};
