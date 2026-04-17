import { Bookmark } from "lucide-react";

import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

export default function Saved() {
  return (
    <div className="mx-auto w-full max-w-[480px] px-4 pt-4">
      <Squircle
        cornerRadius={24}
        cornerSmoothing={0.9}
        className="surface-card flex flex-col items-center gap-2 p-8 text-center"
      >
        <div className="rounded-full bg-primary/10 p-3 text-primary">
          <Bookmark size={20} />
        </div>
        <Text variant="heading" weight="semibold">
          Saved Tasbeehs
        </Text>
        <Text variant="body" color="subtle">
          Your saved phrases will appear here.
        </Text>
      </Squircle>
    </div>
  );
}
