import { ArrowRight } from "lucide-react";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Button, Text, Squircle } from "@/shared/design-system";
import { useAppLottie } from "@/shared/hooks/useAppLottie";

interface ResetSuccessSheetProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function ResetSuccessSheet({
  isOpen,
  onClose,
  email,
}: ResetSuccessSheetProps) {
  const { LottieView } = useAppLottie("CheckMark", {
    width: 120,
    height: 120,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Check Your Email"
      snapPoints={["65%"]}
      presentation="height"
    >
      <div className="flex flex-col items-center text-center px-6 pt-2 pb-8 gap-6">
        <div className="w-32 h-32 flex items-center justify-center">
          {LottieView}
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="heading" className="text-2xl font-black">
            Reset Link Sent!
          </Text>
          <Text variant="body" color="subtle" className="leading-relaxed">
            We've sent a password reset link to{" "}
            <span className="text-base-content font-bold">{email}</span>. Please
            check your inbox and follow the instructions.
          </Text>
        </div>

        <Squircle
          cornerRadius={20}
          cornerSmoothing={0.9}
          className="w-full bg-white dark:bg-base-content/5 p-4 flex flex-col gap-2 text-left"
        >
          <Text
            variant="caption"
            className="font-bold uppercase tracking-widest text-[10px] text-base-content/40"
          >
            Didn't get the email?
          </Text>
          <Text variant="caption" color="subtle">
            Check your spam folder or wait a few minutes. If it still doesn't
            arrive, try sending it again.
          </Text>
        </Squircle>

        <Button
          onClick={onClose}
          height={56}
          pill={true}
          className="w-full text-lg font-semibold mt-2"
        >
          Back to Login
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </Drawer>
  );
}
