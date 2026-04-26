import { Button } from "@/shared/design-system";
import { Sparkles } from "lucide-react";
import { SocialAuthButton } from "./SocialAuthButton";

interface SocialAuthGroupProps {
  onGoogle: () => void;
  onFacebook: () => void;
  onGuest: () => void;
}

export function SocialAuthGroup({
  onGoogle,
  onFacebook,
  onGuest,
}: SocialAuthGroupProps) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-base-content/10"></div>
        </div>
        <span className="relative px-4 font-medium text-base-content/40 bg-base-100 uppercase tracking-widest text-[10px]">
          or continue with
        </span>
      </div>

      <div className="flex flex-row gap-3 w-full">
        <SocialAuthButton network="google" onClick={onGoogle} />
        <SocialAuthButton network="facebook" onClick={onFacebook} />
      </div>

      <Button
        variant="ghost"
        pill={true}
        height={48}
        onClick={onGuest}
        className="mt-2 text-sm text-base-content/50 hover:text-base-content/80"
        leftIcon={<Sparkles size={16} />}
      >
        Continue as Guest
      </Button>
    </div>
  );
}
