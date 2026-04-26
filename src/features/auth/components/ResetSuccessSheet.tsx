import { ArrowRight } from "lucide-react";
import { Drawer } from "@/shared/design-system/ui/Drawer";
import { Button, Text, Squircle } from "@/shared/design-system";
import { useAppLottie } from "@/shared/hooks/useAppLottie";
import { AUTH_EN } from "../en";

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
      title={AUTH_EN.reset_success.drawer_title}
      snapPoints={["70%"]}
      presentation="height"
    >
      <div className="flex flex-col items-center text-center px-2 pt-2 pb-8 gap-6">
        <div className="w-32 h-32 flex items-center justify-center">
          {isOpen && LottieView}
        </div>

        <div className="flex flex-col gap-2">
          <Text variant="heading" className="text-2xl font-black">
            {AUTH_EN.reset_success.title}
          </Text>
          <Text variant="body" color="subtle" className="leading-relaxed">
            {AUTH_EN.reset_success.description_pre}
            <span className="text-base-content font-bold">{email}</span>
            {AUTH_EN.reset_success.description_post}
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
            {AUTH_EN.reset_success.missing_email_label}
          </Text>
          <Text variant="caption" color="subtle">
            {AUTH_EN.reset_success.missing_email_help}
          </Text>
        </Squircle>

        <Button
          onClick={onClose}
          height={56}
          pill={true}
          className="w-full text-lg font-semibold mt-2"
        >
          {AUTH_EN.reset_success.back_to_login}
          <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </Drawer>
  );
}
