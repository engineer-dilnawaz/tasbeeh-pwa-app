import { Button, Drawer, Squircle } from "@/shared/design-system";
import { Info } from "lucide-react";

interface GuestDisclaimerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

export function GuestDisclaimerSheet({
  isOpen,
  onClose,
  onProceed,
}: GuestDisclaimerSheetProps) {
  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={["70%"]}
      presentation="height"
    >
      <div className="flex flex-col gap-6 py-2 px-4">
        <div className="space-y-4">
          <p className="text-base text-base-content/70 leading-relaxed">
            You are about to enter as a guest. Your spiritual progress is
            <span className="font-semibold text-base-content">
              {" "}
              saved only on this device.
            </span>
          </p>
          <Squircle cornerRadius={24} cornerSmoothing={0.9} asChild>
            <ul className="p-5 pl-10 bg-base-200/50 border border-base-content/5 space-y-3 list-disc">
              <li className="text-sm text-base-content/60 leading-relaxed">
                Your counts, streaks, and custom collections stay local.
              </li>
              <li className="text-sm text-base-content/60 leading-relaxed">
                No syncing if you change phones or use another device.
              </li>
              <li className="text-sm text-base-content/60 leading-relaxed">
                Clearing app data or uninstalling will erase your journey.
              </li>
            </ul>
          </Squircle>
          <p className="text-sm text-base-content/50 italic">
            Signing in ensures your remembrance is preserved and reachable
            wherever you go.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            onClick={() => {
              onProceed();
              onClose();
            }}
            pill={true}
            height={56}
            className="w-full font-bold"
          >
            I Understand, Proceed
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            pill={true}
            height={56}
            className="w-full text-base-content/60 font-medium"
          >
            Continue using Account
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
