import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";

import { Squircle } from "@/shared/design-system/ui/Squircle";
import { Text } from "@/shared/design-system/ui/Text";

export default function SettingsAbout() {
  const [openSectionId, setOpenSectionId] = useState<string | null>("purpose");

  const sections: Array<{ id: string; title: string; content: string }> = [
    {
      id: "purpose",
      title: "Why this app exists",
      content:
        "Tasbeeh Flow is built as a calm digital companion for dhikr. The goal is to make remembrance simple, focused, and gentle without clutter or distraction.",
    },
    {
      id: "helps",
      title: "What it helps with",
      content:
        "It helps you keep consistent tasbeeh practice, use reminders with intention, and maintain a steady rhythm in daily spiritual habits.",
    },
    {
      id: "privacy",
      title: "Privacy and local-first approach",
      content:
        "Core usage is designed to work locally on your device. Feedback and optional profile details are shared only when you choose to submit them.",
    },
    {
      id: "version",
      title: "Version and updates",
      content:
        "Current release: Tasbeeh Flow v1.0.0. Future updates will focus on calm UX, better accessibility, and reliable offline experience.",
    },
    {
      id: "support",
      title: "Support",
      content:
        "If you face any issue or want to suggest an improvement, use the App Feedback screen in Settings.",
    },
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSectionId((prev) => (prev === sectionId ? null : sectionId));
  };

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-col gap-4 px-4 pt-4">
      <Squircle
        cornerRadius={26}
        cornerSmoothing={0.85}
        className="surface-card w-full p-5"
      >
        <div className="mb-3 flex items-center gap-2">
          <BookOpen size={16} className="text-primary" />
          <Text variant="heading" weight="semibold">
            About App
          </Text>
        </div>
        <Text variant="body" color="subtle">
          Learn about the app's purpose, privacy model, and support details.
        </Text>
      </Squircle>

      {sections.map((section) => {
        const isOpen = openSectionId === section.id;

        return (
          <Squircle
            key={section.id}
            cornerRadius={22}
            cornerSmoothing={0.9}
            className="surface-card w-full px-4"
          >
            <button
              type="button"
              onClick={() => toggleSection(section.id)}
              className="flex w-full items-center justify-between py-4 text-left"
            >
              <Text variant="body" weight="semibold">
                {section.title}
              </Text>
              <motion.span
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-base-content/45"
              >
                <ChevronRight size={16} />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-base-content/8 pb-4 pt-3">
                    <Text variant="body" color="subtle">
                      {section.content}
                    </Text>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Squircle>
        );
      })}
    </div>
  );
}
