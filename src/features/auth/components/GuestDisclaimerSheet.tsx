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
      snapPoints={["65%"]}
      title={
        <div className="flex items-center justify-center gap-2 text-black dark:text-white font-bold">
          <span>Guest Mode Notice</span>
        </div>
      }
      presentation="height"
    >
      <div className="flex flex-col gap-6 py-2 px-4">
        <div className="space-y-4">
          <p className="text-base text-base-content/70 leading-relaxed">
            In Guest Mode, all your tasbeeh counts, streaks, and settings are
            <span className="font-semibold text-base-content">
              {" "}
              stored locally on this device only.
            </span>
          </p>
          <Squircle cornerRadius={24} cornerSmoothing={0.9} asChild>
            <ul className="p-4 pl-8 bg-base-200/50 border border-base-content/5 space-y-2 list-disc">
              <li className="text-sm text-base-content/60 leading-relaxed">
                No data synchronization between different devices.
              </li>
              <li className="text-sm text-base-content/60 leading-relaxed">
                Uninstalling the app will result in permanent data loss.
              </li>
            </ul>
          </Squircle>
          <p className="text-sm text-base-content/50 italic">
            We highly recommend signing in to keep your spiritual journey safe
            across all your devices.
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
